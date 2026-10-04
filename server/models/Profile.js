const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    default: 'Zelalem Birhan'
  },
  brandName: {
    type: String,
    default: 'ZED_Tutor'
  },
  title: {
    type: String,
    default: 'Information Technology Graduate & Academic Tutor'
  },
  tagline: {
    type: String,
    default: 'University Gold Medalist | 3.95 CGPA | Ranked 1st at GIT'
  },
  shortBio: {
    type: String,
    default: 'Information Technology graduate from Debre Tabor University (Gafat Institute of Technology), passionate about building conceptual mastery and problem-solving skills in Mathematics, Computer/ICT, programming, and web development.'
  },
  fullBio: {
    type: String,
    default: 'Graduated as the University Gold Medalist and 1st ranked at Gafat Institute of Technology with a 3.95/4.00 CGPA. I combine strong theoretical mathematics and analytical thinking with practical software engineering. My tutoring methodology focuses on the 4-phase learning cycle: Understand, Practice, Apply, and Review.'
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  // Cloudinary public ID for the profile photo — used to delete/replace the asset
  avatarPublicId: {
    type: String,
    default: ''
  },
  itPortfolioUrl: {
    type: String,
    default: 'https://zelalem-birhan.vercel.app/'
  },
  // Optional hero headline override — if set, replaces the default hero title
  heroHeadline: {
    type: String,
    default: ''
  },
  // Availability note shown on tutoring/contact sections
  availability: {
    type: String,
    default: 'Available for new students — online and in-person (Addis Ababa area)'
  },
  contactInfo: {
    phone:       { type: String, default: '' },
    whatsapp:    { type: String, default: '' },
    telegram:    { type: String, default: '' },
    email:       { type: String, default: '' },
    location:    { type: String, default: '' },
    telegramBot: { type: String, default: '' },
    // Legacy flat social fields — kept for backwards compatibility
    instagram:   { type: String, default: '' },
    facebook:    { type: String, default: '' },
    youtube:     { type: String, default: '' },
    vimeo:       { type: String, default: '' },
    tiktok:      { type: String, default: '' }
  },
  // Managed social & external links — replaces the flat contactInfo social fields
  socialLinks: [
    {
      platform: { type: String, required: true }, // 'Instagram', 'Facebook', 'YouTube', 'GitHub', etc.
      label:    { type: String, default: '' },     // optional display label override
      url:      { type: String, required: true },  // full URL or @handle
      isActive: { type: Boolean, default: true }   // controls public visibility
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
