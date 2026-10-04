const express = require('express');
const router = express.Router();
const Academic = require('../models/Academic');
const { requireAuth } = require('../middleware/auth.middleware');
const { defaultAcademic } = require('../data/defaultData');
const { getDBStatus } = require('../config/db');

let runtimeAcademic = { ...defaultAcademic };

// GET /api/academic (Public)
router.get('/', async (req, res, next) => {
  try {
    if (getDBStatus()) {
      let academic = await Academic.findOne();
      if (!academic) {
        academic = await Academic.create(defaultAcademic);
      }
      return res.json({ success: true, data: academic });
    }
    return res.json({ success: true, data: runtimeAcademic });
  } catch (error) {
    next(error);
  }
});

// PUT /api/academic (Admin only)
router.put('/', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      let academic = await Academic.findOne();
      if (!academic) {
        academic = new Academic(req.body);
      } else {
        Object.assign(academic, req.body);
      }
      await academic.save();
      return res.json({ success: true, message: 'Academic data updated successfully.', data: academic });
    }

    runtimeAcademic = { ...runtimeAcademic, ...req.body };
    return res.json({ success: true, message: 'Academic data updated in runtime state.', data: runtimeAcademic });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
