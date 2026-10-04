const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const { requireAuth } = require('../middleware/auth.middleware');
const { getDBStatus } = require('../config/db');

let runtimeVideos = [
  {
    _id: 'vid_1',
    title: 'Welcome to ZED_Tutor — Mathematics & IT Mentorship',
    platform: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedId: 'dQw4w9WgXcQ',
    description: 'An overview of my academic foundation, tutoring methodology, and how I support Grades 5–12 learners.',
    displayOrder: 1,
    isPublished: true
  }
];

// Helper to extract embed ID from YouTube or Vimeo URLs
const extractEmbedId = (url, platform) => {
  if (!url) return '';
  if (platform === 'YouTube') {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  }
  if (platform === 'Vimeo') {
    const regExp = /(?:vimeo\.com\/)(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  }
  return url;
};

// GET /api/videos (Public: only published videos)
router.get('/', async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    if (getDBStatus()) {
      const filter = showAll ? {} : { isPublished: true };
      const videos = await Video.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      return res.json({ success: true, data: videos });
    }
    const filtered = showAll ? runtimeVideos : runtimeVideos.filter(v => v.isPublished);
    return res.json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
});

// POST /api/videos (Admin only)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, platform, videoUrl, description, displayOrder, isPublished } = req.body;
    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title and video URL are required.' });
    }

    const plat = platform || (videoUrl.includes('vimeo') ? 'Vimeo' : 'YouTube');
    const embedId = extractEmbedId(videoUrl, plat);

    if (getDBStatus()) {
      const created = await Video.create({
        title,
        platform: plat,
        videoUrl,
        embedId,
        description: description || '',
        displayOrder: displayOrder || 0,
        isPublished: isPublished !== undefined ? isPublished : true
      });
      return res.status(201).json({ success: true, message: 'Video added successfully.', data: created });
    }

    const newV = {
      _id: `vid_${Date.now()}`,
      title,
      platform: plat,
      videoUrl,
      embedId,
      description: description || '',
      displayOrder: displayOrder || 0,
      isPublished: isPublished !== undefined ? isPublished : true
    };
    runtimeVideos.push(newV);
    return res.status(201).json({ success: true, message: 'Video added in runtime state.', data: newV });
  } catch (error) {
    next(error);
  }
});

// PUT /api/videos/:id (Admin only)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.videoUrl) {
      const plat = updateData.platform || (updateData.videoUrl.includes('vimeo') ? 'Vimeo' : 'YouTube');
      updateData.embedId = extractEmbedId(updateData.videoUrl, plat);
    }

    if (getDBStatus()) {
      const updated = await Video.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Video not found.' });
      return res.json({ success: true, message: 'Video updated successfully.', data: updated });
    }

    const index = runtimeVideos.findIndex(v => v._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Video not found.' });
    runtimeVideos[index] = { ...runtimeVideos[index], ...updateData };
    return res.json({ success: true, message: 'Video updated in runtime state.', data: runtimeVideos[index] });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/videos/:id (Admin only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const deleted = await Video.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Video not found.' });
      return res.json({ success: true, message: 'Video deleted.' });
    }

    runtimeVideos = runtimeVideos.filter(v => v._id !== req.params.id);
    return res.json({ success: true, message: 'Video deleted from runtime state.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
