const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { requireAuth } = require('../middleware/auth.middleware');
const { inquiryLimiter } = require('../middleware/rateLimit.middleware');
const { sendTelegramNotification } = require('../services/telegram.service');
const { getDBStatus } = require('../config/db');

let runtimeInquiries = [];

// POST /api/inquiries (Public: submit tutoring inquiry)
router.post('/', inquiryLimiter, async (req, res, next) => {
  try {
    const {
      clientName,
      clientRole,
      studentGrade,
      subject,
      topicStruggles,
      preferredSchedule,
      mode,
      phoneOrWhatsApp,
      email,
      message,
      _hp   // honeypot field — must be empty from legitimate submissions
    } = req.body;

    // Anti-spam: honeypot filled → silent 201 (bot thinks it succeeded, no data saved)
    if (_hp && _hp.trim().length > 0) {
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your tutoring request has been received. Zelalem will contact you shortly.',
        data: { _id: 'hp_blocked' }
      });
    }

    if (!clientName || !studentGrade || !subject || !phoneOrWhatsApp) {
      return res.status(400).json({
        success: false,
        message: 'Name, student grade, subject, and contact number (Phone/WhatsApp) are required.'
      });
    }

    // Basic length guards against oversized payloads
    if (
      clientName.length > 100 ||
      studentGrade.length > 50 ||
      subject.length > 100 ||
      phoneOrWhatsApp.length > 30 ||
      (topicStruggles  && topicStruggles.length  > 500)  ||
      (preferredSchedule && preferredSchedule.length > 200) ||
      (message && message.length > 1500) ||
      (email   && email.length   > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: 'One or more fields exceed the allowed length. Please shorten your input.'
      });
    }

    const payload = {
      clientName: clientName.trim(),
      clientRole: clientRole || 'Parent',
      studentGrade: studentGrade.trim(),
      subject: subject.trim(),
      topicStruggles: topicStruggles ? topicStruggles.trim() : '',
      preferredSchedule: preferredSchedule ? preferredSchedule.trim() : '',
      mode: mode || 'Online',
      phoneOrWhatsApp: phoneOrWhatsApp.trim(),
      email: email ? email.trim() : '',
      message: message ? message.trim() : '',
      status: 'NEW'
    };

    let savedInquiry;
    if (getDBStatus()) {
      savedInquiry = await Inquiry.create(payload);
    } else {
      savedInquiry = { ...payload, _id: `inq_${Date.now()}`, createdAt: new Date() };
      runtimeInquiries.unshift(savedInquiry);
    }

    // Trigger asynchronous Telegram alert (non-blocking)
    sendTelegramNotification(savedInquiry).catch(err => {
      console.warn('[Telegram Alert Error]', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your tutoring request has been received. Zelalem will contact you shortly.',
      data: { _id: savedInquiry._id }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/inquiries/admin/all (Admin only: view all inquiries)
router.get('/admin/all', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: inquiries });
    }
    return res.json({ success: true, data: runtimeInquiries });
  } catch (error) {
    next(error);
  }
});

// PUT /api/inquiries/admin/:id (Admin only: update status and notes)
router.put('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    if (getDBStatus()) {
      const updated = await Inquiry.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return res.json({ success: true, message: 'Inquiry updated successfully.', data: updated });
    }

    const index = runtimeInquiries.findIndex(i => i._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    runtimeInquiries[index] = { ...runtimeInquiries[index], ...updateData };
    return res.json({ success: true, message: 'Inquiry updated in runtime state.', data: runtimeInquiries[index] });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/inquiries/admin/:id (Admin only)
router.delete('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const deleted = await Inquiry.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return res.json({ success: true, message: 'Inquiry deleted.' });
    }

    runtimeInquiries = runtimeInquiries.filter(i => i._id !== req.params.id);
    return res.json({ success: true, message: 'Inquiry deleted from runtime state.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
