const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const Profile = require('../models/Profile');
const { requireAuth } = require('../middleware/auth.middleware');
const { defaultProfile } = require('../data/defaultData');
const { getDBStatus } = require('../config/db');
const { uploadBuffer, deleteAsset, isConfigured } = require('../services/cloudinary.service');

// Multer — keep file in memory (buffer), 5 MB limit, images only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  },
});

// In-memory runtime state for development fallback
let runtimeProfile = { ...defaultProfile };

// ── GET /api/profile (Public) ─────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    if (getDBStatus()) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create(defaultProfile);
      }
      return res.json({ success: true, data: profile });
    }
    return res.json({ success: true, data: runtimeProfile });
  } catch (error) {
    next(error);
  }
});

// ── PUT /api/profile (Admin only) ─────────────────────────────────────────────
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const body = req.body;

    // ── Basic server-side validation ──────────────────────────────────────────
    if (body.fullName !== undefined) {
      if (typeof body.fullName !== 'string' || body.fullName.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Full name cannot be empty.' });
      }
      if (body.fullName.trim().length > 100) {
        return res.status(400).json({ success: false, message: 'Full name must be 100 characters or fewer.' });
      }
    }
    if (body.shortBio !== undefined && typeof body.shortBio === 'string' && body.shortBio.length > 600) {
      return res.status(400).json({ success: false, message: 'Short bio must be 600 characters or fewer.' });
    }
    if (body.fullBio !== undefined && typeof body.fullBio === 'string' && body.fullBio.length > 3000) {
      return res.status(400).json({ success: false, message: 'Full bio must be 3000 characters or fewer.' });
    }
    if (body.heroHeadline !== undefined && typeof body.heroHeadline === 'string' && body.heroHeadline.length > 200) {
      return res.status(400).json({ success: false, message: 'Hero headline must be 200 characters or fewer.' });
    }
    if (body.tagline !== undefined && typeof body.tagline === 'string' && body.tagline.length > 200) {
      return res.status(400).json({ success: false, message: 'Tagline must be 200 characters or fewer.' });
    }
    if (body.title !== undefined && typeof body.title === 'string' && body.title.length > 150) {
      return res.status(400).json({ success: false, message: 'Professional title must be 150 characters or fewer.' });
    }

    // ── contactInfo field validation ──────────────────────────────────────────
    if (body.contactInfo !== undefined && typeof body.contactInfo === 'object') {
      const ci = body.contactInfo;

      // Phone — basic format check, optional
      if (ci.phone !== undefined && typeof ci.phone === 'string' && ci.phone.length > 30) {
        return res.status(400).json({ success: false, message: 'Phone number must be 30 characters or fewer.' });
      }
      // WhatsApp — digits/+ only when present
      if (ci.whatsapp !== undefined && ci.whatsapp !== '') {
        if (typeof ci.whatsapp !== 'string' || !/^[+\d\s\-()]{7,20}$/.test(ci.whatsapp.trim())) {
          return res.status(400).json({ success: false, message: 'WhatsApp number must be a valid phone number (7–20 digits).' });
        }
      }
      // Email — basic format when present
      if (ci.email !== undefined && ci.email !== '') {
        if (typeof ci.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ci.email.trim())) {
          return res.status(400).json({ success: false, message: 'Email address format is invalid.' });
        }
        if (ci.email.length > 100) {
          return res.status(400).json({ success: false, message: 'Email address must be 100 characters or fewer.' });
        }
      }
      // Location — free text, reasonable limit
      if (ci.location !== undefined && typeof ci.location === 'string' && ci.location.length > 100) {
        return res.status(400).json({ success: false, message: 'Location must be 100 characters or fewer.' });
      }
      // Telegram channel — URL or @handle
      if (ci.telegram !== undefined && ci.telegram !== '') {
        if (typeof ci.telegram !== 'string' ||
            (!ci.telegram.startsWith('https://t.me/') && !ci.telegram.startsWith('@') && !ci.telegram.startsWith('http'))) {
          return res.status(400).json({ success: false, message: 'Telegram channel must be a full URL (https://t.me/...) or @handle.' });
        }
        if (ci.telegram.length > 100) {
          return res.status(400).json({ success: false, message: 'Telegram channel URL must be 100 characters or fewer.' });
        }
      }
    }

    // ── socialLinks array validation ─────────────────────────────────────────
    if (body.socialLinks !== undefined) {
      if (!Array.isArray(body.socialLinks)) {
        return res.status(400).json({ success: false, message: 'socialLinks must be an array.' });
      }
      for (const link of body.socialLinks) {
        if (!link.platform || typeof link.platform !== 'string' || link.platform.trim().length === 0) {
          return res.status(400).json({ success: false, message: 'Each social link must have a platform name.' });
        }
        if (!link.url || typeof link.url !== 'string' || link.url.trim().length === 0) {
          return res.status(400).json({ success: false, message: 'Each social link must have a URL.' });
        }
        if (link.url.length > 300) {
          return res.status(400).json({ success: false, message: `Social link URL for "${link.platform}" must be 300 characters or fewer.` });
        }
        if (link.label && link.label.length > 80) {
          return res.status(400).json({ success: false, message: `Label for "${link.platform}" must be 80 characters or fewer.` });
        }
      }
    }

    if (getDBStatus()) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = new Profile(req.body);
      } else {
        Object.assign(profile, req.body);
      }
      await profile.save();
      return res.json({ success: true, message: 'Profile updated successfully.', data: profile });
    }
    runtimeProfile = { ...runtimeProfile, ...req.body };
    return res.json({ success: true, message: 'Profile updated in runtime state.', data: runtimeProfile });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/profile/photo (Admin only) — upload or replace profile photo ────
// Accepts multipart/form-data with field name "photo".
// Workflow:
//   1. Validate file present and mimetype is image.
//   2. Upload new image to Cloudinary.
//   3. On success, delete the previous Cloudinary asset (if any).
//   4. Update the profile record with the new URL and publicId.
//   Cloudinary secrets are never sent to the client.
router.post('/photo', requireAuth, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Image upload is not configured on this server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      });
    }

    // Upload new image first — do not delete old one until new upload succeeds
    const result = await uploadBuffer(req.file.buffer, {
      folder: 'zed_tutor/profile',
      // Square crop centred on the face for consistent avatar display
      transformation: [{ width: 600, height: 600, crop: 'fill', gravity: 'face' }],
    });

    if (getDBStatus()) {
      let profile = await Profile.findOne();
      const oldPublicId = profile?.avatarPublicId || '';

      if (!profile) {
        profile = new Profile({ avatarUrl: result.secure_url, avatarPublicId: result.public_id });
      } else {
        profile.avatarUrl      = result.secure_url;
        profile.avatarPublicId = result.public_id;
      }
      await profile.save();

      // Delete previous Cloudinary asset after DB is updated — silent on failure
      if (oldPublicId && oldPublicId !== result.public_id) {
        deleteAsset(oldPublicId); // non-blocking, errors logged internally
      }

      return res.json({
        success:   true,
        message:   'Profile photo updated.',
        avatarUrl: result.secure_url,
      });
    }

    // Runtime fallback (no DB) — store in memory only
    runtimeProfile.avatarUrl      = result.secure_url;
    runtimeProfile.avatarPublicId = result.public_id;
    return res.json({
      success:   true,
      message:   'Profile photo updated (runtime state).',
      avatarUrl: result.secure_url,
    });
  } catch (error) {
    // Multer fileFilter error
    if (error.message === 'Only image files are allowed.') {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.code === 'LIMIT_FILE_SIZE' || error.message?.includes('File too large')) {
      return res.status(400).json({ success: false, message: 'File exceeds the 5 MB size limit.' });
    }
    next(error);
  }
});

// ── DELETE /api/profile/photo (Admin only) — remove profile photo ─────────────
// Removes the Cloudinary asset and clears avatarUrl + avatarPublicId in the DB.
router.delete('/photo', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const profile = await Profile.findOne();
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found.' });
      }

      const publicIdToDelete = profile.avatarPublicId || '';

      profile.avatarUrl      = '';
      profile.avatarPublicId = '';
      await profile.save();

      // Delete from Cloudinary after DB is cleared — non-blocking
      if (publicIdToDelete) {
        deleteAsset(publicIdToDelete);
      }

      return res.json({ success: true, message: 'Profile photo removed.' });
    }

    // Runtime fallback
    const oldId = runtimeProfile.avatarPublicId || '';
    runtimeProfile.avatarUrl      = '';
    runtimeProfile.avatarPublicId = '';
    if (oldId) deleteAsset(oldId);
    return res.json({ success: true, message: 'Profile photo removed (runtime state).' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
