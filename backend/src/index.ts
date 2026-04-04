import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generalLimiter } from './middleware/rateLimit';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import scenarioRoutes from './routes/scenarios';
import analysisRoutes from './routes/analysis';
import usageRoutes from './routes/usage';
import webhookRoutes from './routes/webhooks';
import quizRoutes from './routes/quizzes';
import adminRoutes, { getActivePrompt } from './routes/admin';
import convertkitRoutes from './routes/convertkit';
import emailRoutes from './routes/email';
import testEmailRoutes from './routes/testEmail';
import { requireAuth } from './middleware/auth';

dotenv.config();

// ─────────────────────────────────────────────
// Validate required env vars on startup
// ─────────────────────────────────────────────

const REQUIRED_ENV = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ANTHROPIC_API_KEY',
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[startup] Missing required env var: ${key}`);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────
// App setup
// ─────────────────────────────────────────────

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret'],
  })
);

// Parse JSON body — webhooks need raw body for signature verification
app.use('/api/webhooks', express.raw({ type: 'application/json' }), (req, _res, next) => {
  if (req.body && Buffer.isBuffer(req.body)) {
    req.body = JSON.parse(req.body.toString());
  }
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(generalLimiter);

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/convertkit', convertkitRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/email', testEmailRoutes);  // TEST: /api/email/test/:template
app.use('/unsubscribe', emailRoutes);   // GET /unsubscribe/:token
app.get('/api/prompts/scenario-coach', requireAuth, getActivePrompt);

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────
// Claude API key diagnostic
// ─────────────────────────────────────────────

app.get('/api/diag/claude', async (_req, res) => {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 5,
      messages: [{ role: 'user', content: 'hi' }],
    });
    res.json({ ok: true });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.json({ ok: false, status: e.status, message: e.message, key_prefix: (process.env.ANTHROPIC_API_KEY ?? '').slice(0, 12) + '...' });
  }
});

// ─────────────────────────────────────────────
// 404 handler
// ─────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// ─────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '3000', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Signal Theory API running on port ${PORT}`);
  console.log(`[server] Environment: ${process.env.NODE_ENV ?? 'development'}`);

  // Process email queue every 15 minutes
  const QUEUE_INTERVAL_MS = 15 * 60 * 1000;
  async function runEmailQueue() {
    try {
      const { processQueue } = await import('./jobs/processEmailQueue');
      await processQueue();
    } catch (err) {
      console.error('[email-queue] Error processing queue:', err);
    }
  }

  // Run once on startup (after 30s delay to let things settle)
  setTimeout(runEmailQueue, 30_000);
  // Then every 15 minutes
  setInterval(runEmailQueue, QUEUE_INTERVAL_MS);
  console.log('[server] Email queue processor scheduled (every 15 min)');
});

export default app;
