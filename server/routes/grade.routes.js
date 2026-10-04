const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const { requireAuth } = require('../middleware/auth.middleware');
const { defaultGrades } = require('../data/defaultData');
const { getDBStatus } = require('../config/db');

let runtimeGrades = [...defaultGrades.map((g, i) => ({ ...g, _id: `gr_${i + 1}` }))];

// GET /api/grades (Public active grades; Admin can pass ?all=true)
router.get('/', async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    if (getDBStatus()) {
      const filter = showAll ? {} : { isActive: true };
      const grades = await Grade.find(filter).sort({ numericValue: 1 });
      if (grades.length === 0 && !showAll) {
        const seeded = await Grade.insertMany(defaultGrades);
        return res.json({ success: true, data: seeded });
      }
      return res.json({ success: true, data: grades });
    }
    const filtered = showAll ? runtimeGrades : runtimeGrades.filter(g => g.isActive);
    return res.json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
});

// POST /api/grades (Admin only)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { label, numericValue, isActive, displayOrder } = req.body;
    if (!label || numericValue === undefined) {
      return res.status(400).json({ success: false, message: 'Label and numericValue are required.' });
    }

    if (getDBStatus()) {
      const newGrade = await Grade.create({
        label,
        numericValue: Number(numericValue),
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder || numericValue
      });
      return res.status(201).json({ success: true, message: 'Grade created.', data: newGrade });
    }

    const newG = {
      _id: `gr_${Date.now()}`,
      label,
      numericValue: Number(numericValue),
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || numericValue
    };
    runtimeGrades.push(newG);
    return res.status(201).json({ success: true, message: 'Grade created in runtime state.', data: newG });
  } catch (error) {
    next(error);
  }
});

// PUT /api/grades/:id (Admin only)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const updated = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Grade not found.' });
      return res.json({ success: true, message: 'Grade updated.', data: updated });
    }

    const index = runtimeGrades.findIndex(g => g._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Grade not found.' });
    runtimeGrades[index] = { ...runtimeGrades[index], ...req.body };
    return res.json({ success: true, message: 'Grade updated in runtime state.', data: runtimeGrades[index] });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/grades/:id (Admin only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const deleted = await Grade.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Grade not found.' });
      return res.json({ success: true, message: 'Grade deleted.' });
    }

    runtimeGrades = runtimeGrades.filter(g => g._id !== req.params.id);
    return res.json({ success: true, message: 'Grade deleted from runtime state.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
