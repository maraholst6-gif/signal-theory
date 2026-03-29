import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../db/pool';
import { authLimiter } from '../middleware/rateLimit';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const SALT_ROUNDS = 12;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN ?? '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';
const REFRESH_EXPIRES_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

// ─────────────────────────────────────────────
// Token helpers
// ─────────────────────────────────────────────

function signAccessToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET as string,
    { expiresIn: ACCESS_EXPIRES } as jwt.SignOptions
  );
}

function signRefreshToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: REFRESH_EXPIRES } as jwt.SignOptions
  );
}

async function storeRefreshToken(
  userId: string,
  token: string
): Promise<void> {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hash, expiresAt]
  );
}

// ─────────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────────

router.post('/signup', authLimiter, async (req: Request, res: Response) => {
  const { email, password, display_name } = req.body as {
    email?: string;
    password?: string;
    display_name?: string;
  };

  if (!email?.trim() || !password?.trim()) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check for existing user
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Check for existing quiz profile to link
    const quizResult = await pool.query(
      `SELECT id, profile_type FROM quiz_profiles WHERE email = $1`,
      [normalizedEmail]
    );
    const quizProfile = quizResult.rows[0] ?? null;

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, profile_type, quiz_profile_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, display_name, profile_type, subscription_status,
                 scenarios_used_week, analyses_used_week, week_reset_at, quiz_profile_id, created_at`,
      [
        normalizedEmail,
        passwordHash,
        display_name?.trim() ?? null,
        quizProfile?.profile_type ?? 'unknown',
        quizProfile?.id ?? null,
      ]
    );

    const user = userResult.rows[0];

    // Mark quiz profile as linked
    if (quizProfile?.id) {
      await pool.query(
        `UPDATE quiz_profiles SET app_linked_at = NOW() WHERE id = $1`,
        [quizProfile.id]
      );
    }

    const accessToken = signAccessToken(user.id, user.email);
    const refreshToken = signRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error('[auth/signup]', err);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────

router.post('/login', authLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email?.trim() || !password?.trim()) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      `SELECT id, email, password_hash, display_name, profile_type, subscription_status,
              scenarios_used_week, analyses_used_week, week_reset_at, quiz_profile_id, created_at
       FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ error: 'Incorrect email or password.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Incorrect email or password.' });
      return;
    }

    const { password_hash: _, ...safeUser } = user;

    const accessToken = signAccessToken(user.id, user.email);
    const refreshToken = signRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);

    res.json({ user: safeUser, accessToken, refreshToken });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/refresh
// ─────────────────────────────────────────────

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token required.' });
    return;
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };

    const hash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const tokenResult = await pool.query(
      `SELECT id FROM refresh_tokens
       WHERE user_id = $1 AND token_hash = $2 AND expires_at > NOW()`,
      [payload.userId, hash]
    );

    if (tokenResult.rows.length === 0) {
      res.status(401).json({ error: 'Invalid or expired refresh token.' });
      return;
    }

    // Rotate refresh token
    await pool.query(
      'DELETE FROM refresh_tokens WHERE token_hash = $1',
      [hash]
    );

    const userResult = await pool.query(
      'SELECT id, email FROM users WHERE id = $1',
      [payload.userId]
    );

    const user = userResult.rows[0];
    if (!user) {
      res.status(401).json({ error: 'User not found.' });
      return;
    }

    const newAccessToken = signAccessToken(user.id, user.email);
    const newRefreshToken = signRefreshToken(user.id);
    await storeRefreshToken(user.id, newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid refresh token.' });
    } else {
      console.error('[auth/refresh]', err);
      res.status(500).json({ error: 'Token refresh failed.' });
    }
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────

router.post('/logout', requireAuth, async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (refreshToken) {
    const hash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await pool.query(
      'DELETE FROM refresh_tokens WHERE token_hash = $1',
      [hash]
    ).catch(() => {});
  }

  res.json({ success: true });
});

export default router;
