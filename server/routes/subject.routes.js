const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { requireAuth } = require('../middleware/auth.middleware');
const { defaultSubjects } = require('../data/defaultData');
const { getDBStatus } = require('../config/db');

let runtimeSubjects = [...defaultSubjects.map((s, i) => ({ ...s, _id: `sub_${i + 1}` }))];

// GET /api/subjects (Public: active subjects; Admin can request all via query)
router.get('/', async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    if (getDBStatus()) {
      const filter = showAll ? {} : { isActive: true };
      const subjects = await Subject.find(filter).sort({ displayOrder: 1, createdAt: 1 });
      if (subjects.length === 0 && !showAll) {
        // Seed default if empty
        const seeded = await Subject.insertMany(defaultSubjects);
        return res.json({ success: true, data: seeded });
      }
      return res.json({ success: true, data: subjects });
    }
    const filtered = showAll ? runtimeSubjects : runtimeSubjects.filter(s => s.isActive);
    return res.json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
});

// POST /api/subjects (Admin only)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, category, shortDescription, gradeRange, topics, displayOrder, isActive } = req.body;
    if (!name || !shortDescription) {
      return res.status(400).json({ success: false, message: 'Name and short description are required.' });
    }

    if (getDBStatus()) {
      const newSubject = await Subject.create({
        name,
        category: category || 'Mathematics',
        shortDescription,
        gradeRange: gradeRange || 'Grades 5–12',
        topics: topics || [],
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true
      });
      return res.status(201).json({ success: true, message: 'Subject created.', data: newSubject });
    }

    const newSub = {
      _id: `sub_${Date.now()}`,
      name,
      category: category || 'Mathematics',
      shortDescription,
      gradeRange: gradeRange || 'Grades 5–12',
      topics: topics || [],
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    };
    runtimeSubjects.push(newSub);
    return res.status(201).json({ success: true, message: 'Subject created in runtime state.', data: newSub });
  } catch (error) {
    next(error);
  }
});

// PUT /api/subjects/:id (Admin only)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Subject not found.' });
      return res.json({ success: true, message: 'Subject updated.', data: updated });
    }

    const index = runtimeSubjects.findIndex(s => s._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Subject not found.' });
    runtimeSubjects[index] = { ...runtimeSubjects[index], ...req.body };
    return res.json({ success: true, message: 'Subject updated in runtime state.', data: runtimeSubjects[index] });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/subjects/:id (Admin only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const deleted = await Subject.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Subject not found.' });
      return res.json({ success: true, message: 'Subject deleted.' });
    }

    runtimeSubjects = runtimeSubjects.filter(s => s._id !== req.params.id);
    return res.json({ success: true, message: 'Subject removed from runtime state.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
