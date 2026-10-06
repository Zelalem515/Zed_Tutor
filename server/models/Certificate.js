const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Awards & Recognition', 'University', 'National Examination', 'Certificates & Training', 'Academic', 'Other'],
    default: 'Awards & Recognition'
  },
  issuingOrg: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    default: 'image' // 'image' or 'pdf'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isDownloadable: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
