require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, getDBStatus } = require('./config/db');
const { errorHandler } = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const academicRoutes = require('./routes/academic.routes');
const subjectRoutes = require('./routes/subject.routes');
const gradeRoutes = require('./routes/grade.routes');
const certificateRoutes = require('./routes/certificate.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const videoRoutes = require('./routes/video.routes');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Database connection
connectDB();

// API Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'ZED_Tutor API',
    databaseConnected: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/videos', videoRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[ZED_Tutor Server] Running on http://localhost:${PORT}`);
});
