const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { requireAuth } = require('../middleware/auth.middleware');
const { testimonialLimiter, inquiryLimiter } = require('../middleware/rateLimit.middleware');
const { defaultTestimonials } = require('../data/defaultData');
const { getDBStatus } = require('../config/db');

let runtimeTestimonials = [
  ...defaultTestimonials.map((t, i) => ({
    ...t,
    _id: `testi_${i + 1}`,
    isPinned: false,
    adminNotes: '',
    helpfulCount: 0,
    createdAt: new Date()
  }))
];

// ── GET /api/testimonials (Public: APPROVED only, pinned first) ───────────────
router.get('/', async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const testimonials = await Testimonial.find({ status: 'APPROVED' })
        .sort({ isPinned: -1, displayOrder: 1, createdAt: -1 })
        .select('-email -phone -adminNotes'); // never expose admin/contact fields publicly
      if (testimonials.length === 0) {
        const seeded = await Testimonial.insertMany(
          defaultTestimonials.map(t => ({ ...t, isPinned: false, adminNotes: '', helpfulCount: 0 }))
        );
        return res.json({ success: true, data: seeded });
      }
      return res.json({ success: true, data: testimonials });
    }
    const approved = runtimeTestimonials
      .filter(t => t.status === 'APPROVED')
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    return res.json({ success: true, data: approved });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/testimonials (Public submission → PENDING) ─────────────────────
router.post('/', testimonialLimiter, async (req, res, next) => {
  try {
    const { authorName, relationship, organization, message, email, phone, _hp } = req.body;

    // Honeypot — silent 201 if filled by bot
    if (_hp && String(_hp).trim().length > 0) {
      return res.status(201).json({
        success: true,
        message: 'Your testimonial has been submitted successfully! It will be reviewed before appearing publicly.',
        data: { _id: 'hp_blocked', status: 'PENDING' }
      });
    }

    if (!authorName || !relationship || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, relationship, and testimonial message are required.'
      });
    }

    // Basic length guards
    if (
      String(authorName).length > 100 ||
      String(message).length > 1500 ||
      (organization && String(organization).length > 120)
    ) {
      return res.status(400).json({ success: false, message: 'One or more fields exceed the allowed length.' });
    }

    const payload = {
      authorName: String(authorName).trim(),
      relationship,
      organization: organization ? String(organization).trim() : '',
      message: String(message).trim(),
      email: email ? String(email).trim().toLowerCase() : '',
      phone: phone ? String(phone).trim() : '',
      avatarUrl: '',
      status: 'PENDING',
      isVerifiedWitness: false,
      isPinned: false,
      adminNotes: '',
      helpfulCount: 0
    };

    if (getDBStatus()) {
      const created = await Testimonial.create(payload);
      return res.status(201).json({
        success: true,
        message: 'Your testimonial has been submitted successfully! It will be reviewed before appearing publicly.',
        data: { _id: created._id, status: created.status }
      });
    }

    const newT = { ...payload, _id: `testi_${Date.now()}`, createdAt: new Date() };
    runtimeTestimonials.unshift(newT);
    return res.status(201).json({
      success: true,
      message: 'Your testimonial has been submitted successfully! It will be reviewed before appearing publicly.',
      data: { _id: newT._id, status: newT.status }
    });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/testimonials/:id/helpful (Public: increment helpful count) ──────
// Uses inquiryLimiter (15 req / 15 min) for basic abuse prevention.
// No accounts needed — just a lightweight helpful counter.
router.post('/:id/helpful', inquiryLimiter, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const updated = await Testimonial.findOneAndUpdate(
        { _id: req.params.id, status: 'APPROVED' },
        { $inc: { helpfulCount: 1 } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
      return res.json({ success: true, helpfulCount: updated.helpfulCount });
    }
    const t = runtimeTestimonials.find(t => t._id === req.params.id && t.status === 'APPROVED');
    if (!t) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    t.helpfulCount = (t.helpfulCount || 0) + 1;
    return res.json({ success: true, helpfulCount: t.helpfulCount });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/testimonials/admin/all (Admin: all statuses) ────────────────────
router.get('/admin/all', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const all = await Testimonial.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: all });
    }
    return res.json({ success: true, data: runtimeTestimonials });
  } catch (error) {
    next(error);
  }
});

// ── PUT /api/testimonials/admin/:id (Admin: full edit — all fields) ──────────
router.put('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    const {
      authorName, relationship, organization, message,
      status, isVerifiedWitness, isPinned,
      adminNotes, displayOrder
    } = req.body;

    const updateData = {};
    if (authorName     !== undefined) updateData.authorName     = String(authorName).trim();
    if (relationship   !== undefined) updateData.relationship   = relationship;
    if (organization   !== undefined) updateData.organization   = String(organization).trim();
    if (message        !== undefined) updateData.message        = String(message).trim();
    if (status         !== undefined) updateData.status         = status;
    if (isVerifiedWitness !== undefined) updateData.isVerifiedWitness = Boolean(isVerifiedWitness);
    if (isPinned       !== undefined) updateData.isPinned       = Boolean(isPinned);
    if (adminNotes     !== undefined) updateData.adminNotes     = String(adminNotes);
    if (displayOrder   !== undefined) updateData.displayOrder   = Number(displayOrder);

    if (getDBStatus()) {
      const updated = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
      return res.json({ success: true, message: 'Testimonial updated.', data: updated });
    }

    const index = runtimeTestimonials.findIndex(t => t._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    runtimeTestimonials[index] = { ...runtimeTestimonials[index], ...updateData };
    return res.json({ success: true, message: 'Testimonial updated in runtime state.', data: runtimeTestimonials[index] });
  } catch (error) {
    next(error);
  }
});

// ── DELETE /api/testimonials/admin/:id (Admin) ───────────────────────────────
router.delete('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const deleted = await Testimonial.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
      return res.json({ success: true, message: 'Testimonial deleted.' });
    }
    runtimeTestimonials = runtimeTestimonials.filter(t => t._id !== req.params.id);
    return res.json({ success: true, message: 'Testimonial deleted from runtime state.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
