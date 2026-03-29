import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import pool from '../db/pool';

const router = Router();

// ─────────────────────────────────────────────
// POST /api/webhooks/revenuecat
// https://www.revenuecat.com/docs/webhooks
// ─────────────────────────────────────────────

router.post('/revenuecat', async (req: Request, res: Response) => {
  // Verify webhook signature
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (secret) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      res.status(401).json({ error: 'Invalid webhook signature.' });
      return;
    }
  }

  const event = req.body as {
    event?: {
      type?: string;
      app_user_id?: string;
      aliases?: string[];
      product_id?: string;
      period_type?: string;
      expiration_at_ms?: number;
    };
  };

  if (!event?.event) {
    res.status(400).json({ error: 'Invalid event payload.' });
    return;
  }

  const { type, app_user_id, expiration_at_ms } = event.event;

  if (!app_user_id) {
    res.status(400).json({ error: 'Missing app_user_id.' });
    return;
  }

  try {
    let subscriptionStatus: string | null = null;

    switch (type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'UNCANCELLATION':
        // Determine monthly vs annual from product_id or period_type
        subscriptionStatus = determineSubscriptionStatus(event.event);
        break;

      case 'CANCELLATION':
        // Keep premium until expiration
        subscriptionStatus = determineSubscriptionStatus(event.event);
        break;

      case 'EXPIRATION':
      case 'BILLING_ISSUE':
        subscriptionStatus = 'free';
        break;

      default:
        // Non-subscription events — ignore
        res.json({ received: true });
        return;
    }

    if (subscriptionStatus) {
      await pool.query(
        `UPDATE users
         SET subscription_status = $1, revenuecat_app_user_id = $2
         WHERE revenuecat_app_user_id = $2 OR id::text = $2`,
        [subscriptionStatus, app_user_id]
      );
    }

    res.json({ received: true });
  } catch (err) {
    console.error('[webhooks/revenuecat]', err);
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
});

function determineSubscriptionStatus(event: {
  product_id?: string;
  period_type?: string;
  expiration_at_ms?: number;
}): string {
  // If expired, downgrade
  if (event.expiration_at_ms && event.expiration_at_ms < Date.now()) {
    return 'free';
  }

  // Check product ID for annual vs monthly
  const productId = event.product_id?.toLowerCase() ?? '';
  if (productId.includes('annual') || productId.includes('yearly')) {
    return 'annual';
  }

  return 'monthly';
}

export default router;
