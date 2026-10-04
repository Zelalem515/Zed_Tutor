const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  numericValue: {
    type: Number,
    required: true
  },
  isActive: {
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

module.exports = mongoose.model('Grade', gradeSchema);
