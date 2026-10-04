const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Mathematics', 'Computer / ICT', 'Programming', 'Web Development', 'General Computer Skills', 'Other'],
    default: 'Mathematics'
  },
  shortDescription: {
    type: String,
    required: true
  },
  gradeRange: {
    type: String,
    default: 'Grades 5–12'
  },
  topics: [{
    type: String
  }],
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
