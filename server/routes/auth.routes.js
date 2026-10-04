const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth.middleware');
const { loginLimiter } = require('../middleware/rateLimit.middleware');
const { getDBStatus } = require('../config/db');

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'admin@zedtutor.com').toLowerCase();
    const defaultAdminPass = process.env.ADMIN_PASSWORD; // must be set in environment — no hardcoded fallback

    let user = null;
    if (getDBStatus()) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    // If DB is connected and user exists
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
    } else {
      // Fallback: env-only admin check (no DB required)
      if (!defaultAdminPass) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
      if (email.toLowerCase() === defaultAdminEmail && password === defaultAdminPass) {
        user = {
          _id: 'default_admin_id',
          name: 'Zelalem Birhan',
          email: defaultAdminEmail,
          role: 'admin'
        };
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'admin' },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        name: user.name,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me (Verify active token)
router.get('/me', requireAuth, async (req, res) => {
  res.json({
    success: true,
    user: {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// PUT /api/auth/change-password (Admin only — requires current password)
// Only works when DB is connected (env-only admins must update .env directly).
router.put('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // ── Input validation ────────────────────────────────────────────────────
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirmation are all required.'
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match.'
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.'
      });
    }
    if (newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'New password must be 128 characters or fewer.'
      });
    }
    // Prevent trivially weak passwords
    if (/^(.)\1+$/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'New password is too simple. Please choose a stronger password.'
      });
    }

    // ── Require DB — env-only admins cannot change password via API ─────────
    if (!getDBStatus()) {
      return res.status(503).json({
        success: false,
        message: 'Password change requires a database connection. Update ADMIN_PASSWORD in your .env file instead.'
      });
    }

    // ── Find the admin user by userId from the JWT ──────────────────────────
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found in the database. Log in again or re-run the seed script.'
      });
    }

    // ── Verify current password ─────────────────────────────────────────────
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // ── Hash new password and save ──────────────────────────────────────────
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({
      success: true,
      message: 'Password changed successfully. Your existing session remains active.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
