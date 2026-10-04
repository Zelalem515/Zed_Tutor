const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  relationship: {
    type: String,
    required: true,
    enum: [
      'Lecturer',
      'Academic Advisor',
      'Project Supervisor',
      'Classmate',
      'Teacher',
      'Student',
      'Parent',
      'Employer/Colleague',
      'Friend',
      'Other'
    ]
  },
  organization: {
    type: String,
    trim: true,
    default: '',
    maxlength: 120
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1500
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  isVerifiedWitness: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    default: '',
    maxlength: 1000
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
