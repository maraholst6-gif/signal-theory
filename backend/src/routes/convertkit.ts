import { Router } from 'express';
import { generalLimiter } from '../middleware/rateLimit';

const router = Router();

/**
 * POST /api/convertkit/subscribe
 * Proxy endpoint for ConvertKit form submissions
 * Keeps API key server-side and handles CORS
 */
router.post('/subscribe', generalLimiter, async (req, res) => {
  try {
    const { email, tags } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // ConvertKit API credentials from env
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY || 'z9c_QCm0VIwY74gbl-AxAg';
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || '9264094';

    // Submit to ConvertKit
    const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email.trim(),
        tags: tags || []
      })
    });

    const data = await response.json();

    if (response.ok && data.subscription) {
      return res.json({
        success: true,
        subscription: data.subscription
      });
    } else {
      console.error('[ConvertKit] Subscription failed:', response.status, data);
      return res.status(response.status || 400).json({
        error: data.error || data.message || 'Subscription failed'
      });
    }

  } catch (error: any) {
    console.error('[ConvertKit] Error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
