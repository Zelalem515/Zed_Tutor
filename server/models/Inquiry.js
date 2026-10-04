const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  clientRole: {
    type: String,
    enum: ['Parent', 'Student', 'Other'],
    default: 'Parent'
  },
  studentGrade: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  topicStruggles: {
    type: String,
    default: '',
    maxlength: 500
  },
  preferredSchedule: {
    type: String,
    default: '',
    maxlength: 200
  },
  mode: {
    type: String,
    enum: ['Online', 'In-person', 'Flexible'],
    default: 'Online'
  },
  phoneOrWhatsApp: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  message: {
    type: String,
    default: '',
    maxlength: 1500
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'],
    default: 'NEW'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);
