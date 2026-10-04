const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { requireAuth } = require('../middleware/auth.middleware');
const { defaultCertificates } = require('../data/defaultData');
const { getDBStatus } = require('../config/db');

let runtimeCertificates = [...defaultCertificates.map((c, i) => ({ ...c, _id: `cert_${i + 1}` }))];

// GET /api/certificates (Public: isPublic=true; Admin: ?all=true)
router.get('/', async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    if (getDBStatus()) {
      const filter = showAll ? {} : { isPublic: true };
      const certs = await Certificate.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      if (certs.length === 0 && !showAll) {
        const seeded = await Certificate.insertMany(defaultCertificates);
        return res.json({ success: true, data: seeded });
      }
      return res.json({ success: true, data: certs });
    }
    const filtered = showAll ? runtimeCertificates : runtimeCertificates.filter(c => c.isPublic);
    return res.json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
});

// POST /api/certificates (Admin only)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, category, issuingOrg, issueDate, description, fileUrl, thumbnailUrl, fileType, isPublic, isDownloadable, displayOrder } = req.body;
    if (!title || !issuingOrg || !fileUrl) {
      return res.status(400).json({ success: false, message: 'Title, issuing organization, and file URL are required.' });
    }

    if (getDBStatus()) {
      const newCert = await Certificate.create({
        title,
        category: category || 'Academic',
        issuingOrg,
        issueDate: issueDate || '',
        description: description || '',
        fileUrl,
        thumbnailUrl: thumbnailUrl || fileUrl,
        fileType: fileType || 'image',
        isPublic: isPublic !== undefined ? isPublic : true,
        isDownloadable: isDownloadable !== undefined ? isDownloadable : true,
        displayOrder: displayOrder || 0
      });
      return res.status(201).json({ success: true, message: 'Certificate created.', data: newCert });
    }

    const newC = {
      _id: `cert_${Date.now()}`,
      title,
      category: category || 'Academic',
      issuingOrg,
      issueDate: issueDate || '',
      description: description || '',
      fileUrl,
      thumbnailUrl: thumbnailUrl || fileUrl,
      fileType: fileType || 'image',
      isPublic: isPublic !== undefined ? isPublic : true,
      isDownloadable: isDownloadable !== undefined ? isDownloadable : true,
      displayOrder: displayOrder || 0
    };
    runtimeCertificates.push(newC);
    return res.status(201).json({ success: true, message: 'Certificate created in runtime state.', data: newC });
  } catch (error) {
    next(error);
  }
});

// PUT /api/certificates/:id (Admin only)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Certificate not found.' });
      return res.json({ success: true, message: 'Certificate updated.', data: updated });
    }

    const index = runtimeCertificates.findIndex(c => c._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Certificate not found.' });
    runtimeCertificates[index] = { ...runtimeCertificates[index], ...req.body };
    return res.json({ success: true, message: 'Certificate updated in runtime state.', data: runtimeCertificates[index] });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/certificates/:id (Admin only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const deleted = await Certificate.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Certificate not found.' });
      return res.json({ success: true, message: 'Certificate deleted.' });
    }

    runtimeCertificates = runtimeCertificates.filter(c => c._id !== req.params.id);
    return res.json({ success: true, message: 'Certificate deleted from runtime state.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
