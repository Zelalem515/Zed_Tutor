const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    enum: ['YouTube', 'Vimeo'],
    default: 'YouTube'
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  },
  embedId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);
