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

dotenv.config();

// ─────────────────────────────────────────────
// Validate required env vars on startup
// ─────────────────────────────────────────────

const REQUIRED_ENV = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'OPENAI_API_KEY',
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
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
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

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
});

export default app;
