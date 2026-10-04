const rateLimit = require('express-rate-limit');

// Limiter for Admin login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Limiter for public tutoring inquiries
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Limiter for public testimonial submissions
const testimonialLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many testimonials submitted from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  inquiryLimiter,
  testimonialLimiter
};
