import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import pool from '../db/pool';
import { stripe } from '../services/stripeService';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// ─────────────────────────────────────────────
// POST /api/stripe/create-checkout
// ─────────────────────────────────────────────

router.post('/create-checkout', requireAuth, async (req: AuthRequest, res: Response) => {
  const { priceId } = req.body as { priceId?: string };
  const userId = req.user!.userId;

  if (!priceId) {
    res.status(400).json({ error: 'priceId is required.' });
    return;
  }

  // Map symbolic keys to env var price IDs, or pass through if already a price ID
  const priceMap: Record<string, string | undefined> = {
    'price_monthly': process.env.STRIPE_PRICE_MONTHLY,
    'price_yearly': process.env.STRIPE_PRICE_YEARLY,
  };
  const stripePriceId = priceMap[priceId] ?? priceId;

  if (!stripePriceId) {
    res.status(400).json({ error: 'Invalid or unconfigured price ID.' });
    return;
  }

  try {
    const userResult = await pool.query(
      'SELECT email, stripe_customer_id FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Get or create Stripe customer
    let customerId = user.stripe_customer_id as string | null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email as string,
        metadata: { userId },
      });
      customerId = customer.id;
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, userId]
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${process.env.APP_BASE_URL ?? ''}/app?upgrade=success`,
      cancel_url: `${process.env.APP_BASE_URL ?? ''}/app?upgrade=cancelled`,
      metadata: { userId },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/create-checkout]', err);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/stripe/webhook
// Requires raw body (configured in index.ts)
// ─────────────────────────────────────────────

router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET not configured');
    res.status(500).json({ error: 'Webhook secret not configured.' });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig as string, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err);
    res.status(400).json({ error: 'Invalid webhook signature.' });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          await pool.query(
            `UPDATE users SET tier = 'premium', stripe_subscription_id = $1 WHERE id = $2`,
            [session.subscription, userId]
          );
          console.log(`[stripe/webhook] User ${userId} upgraded to premium (sub: ${session.subscription})`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await pool.query(
          `UPDATE users SET tier = 'free', stripe_subscription_id = NULL
           WHERE stripe_subscription_id = $1`,
          [sub.id]
        );
        console.log(`[stripe/webhook] Subscription ${sub.id} cancelled — user downgraded to free`);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const isActive = sub.status === 'active' || sub.status === 'trialing';
        await pool.query(
          `UPDATE users SET tier = $1 WHERE stripe_subscription_id = $2`,
          [isActive ? 'premium' : 'free', sub.id]
        );
        console.log(`[stripe/webhook] Subscription ${sub.id} updated — tier: ${isActive ? 'premium' : 'free'}`);
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook]', err);
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/stripe/create-portal-session
// ─────────────────────────────────────────────

router.post('/create-portal-session', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const userResult = await pool.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [userId]
    );
    const customerId = userResult.rows[0]?.stripe_customer_id as string | null;

    if (!customerId) {
      res.status(400).json({ error: 'No Stripe subscription found. Please subscribe first.' });
      return;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_BASE_URL ?? ''}/app`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/create-portal-session]', err);
    res.status(500).json({ error: 'Failed to create portal session.' });
  }
});

export default router;
