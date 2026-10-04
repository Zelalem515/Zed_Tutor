const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
  degree: {
    type: String,
    default: 'BSc in Information Technology'
  },
  university: {
    type: String,
    default: 'Debre Tabor University'
  },
  institute: {
    type: String,
    default: 'Gafat Institute of Technology (GIT)'
  },
  country: {
    type: String,
    default: 'Ethiopia'
  },
  cgpa: {
    type: Number,
    default: 3.95
  },
  maxCgpa: {
    type: Number,
    default: 4.00
  },
  goldMedalist: {
    type: Boolean,
    default: true
  },
  rank: {
    type: String,
    default: 'Ranked 1st at Gafat Institute of Technology'
  },
  totalCourses: {
    type: Number,
    default: 54
  },
  gradeDistribution: {
    aPlus: { type: Number, default: 31 },
    a: { type: Number, default: 15 },
    aMinus: { type: Number, default: 5 },
    bPlus: { type: Number, default: 3 },
    aOrAbove: { type: Number, default: 46 }
  },
  nationalExam: {
    mathScore: { type: Number, default: 85 },
    mathMax: { type: Number, default: 100 },
    overallScore: { type: Number, default: 482 }
  },
  highlightedCourses: [
    {
      name: { type: String, required: true },
      grade: { type: String, required: true },
      category: { type: String, default: 'Mathematics & Statistics' }
    }
  ],
  timelineMilestones: [
    {
      title: { type: String, required: true },
      subtitle: { type: String },
      year: { type: String },
      description: { type: String, required: true },
      iconName: { type: String, default: 'Award' }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Academic', academicSchema);
