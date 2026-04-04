import { Router } from 'express';
import pool from '../db/pool';

const router = Router();

// One-time admin endpoint to set premium tier
// DELETE THIS FILE after using it
router.post('/set-premium', async (req, res) => {
  const { email, secret } = req.body;
  
  // Simple secret to prevent abuse (delete this endpoint after use)
  if (secret !== 'temp-admin-secret-delete-me') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE users SET tier = 'premium' WHERE email = $1 RETURNING email, tier`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      user: result.rows[0],
      message: 'Premium tier set. DELETE THIS ENDPOINT NOW.' 
    });
  } catch (error) {
    console.error('Error setting premium:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
