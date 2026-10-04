require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Profile = require('../models/Profile');
const Academic = require('../models/Academic');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const Certificate = require('../models/Certificate');
const Testimonial = require('../models/Testimonial');
const Video = require('../models/Video');

const {
  defaultProfile,
  defaultAcademic,
  defaultSubjects,
  defaultGrades,
  defaultCertificates,
  defaultTestimonials
} = require('../data/defaultData');

const seedAll = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zed_tutor';
  console.log(`[Seed Script] Connecting to: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('[Seed Script] Connected to MongoDB.');

    // 1. Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@zedtutor.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD; // required — no hardcoded fallback
    if (!adminPassword) {
      console.error('[Seed Script] ADMIN_PASSWORD environment variable is not set. Aborting.');
      process.exit(1);
    }
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      admin = await User.create({
        name: 'Zelalem Birhan',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`[Seed Script] Admin user created: ${adminEmail}`);
    } else {
      console.log(`[Seed Script] Admin user exists: ${adminEmail}`);
    }

    // 2. Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(defaultProfile);
      console.log('[Seed Script] Default profile created.');
    }

    // 3. Academic
    const academicCount = await Academic.countDocuments();
    if (academicCount === 0) {
      await Academic.create(defaultAcademic);
      console.log('[Seed Script] Default academic records created.');
    }

    // 4. Subjects
    const subjectCount = await Subject.countDocuments();
    if (subjectCount === 0) {
      await Subject.insertMany(defaultSubjects);
      console.log(`[Seed Script] Seeded ${defaultSubjects.length} subjects.`);
    }

    // 5. Grades
    const gradeCount = await Grade.countDocuments();
    if (gradeCount === 0) {
      await Grade.insertMany(defaultGrades);
      console.log(`[Seed Script] Seeded ${defaultGrades.length} grades.`);
    }

    // 6. Certificates
    const certCount = await Certificate.countDocuments();
    if (certCount === 0) {
      await Certificate.insertMany(defaultCertificates);
      console.log(`[Seed Script] Seeded ${defaultCertificates.length} certificates.`);
    }

    // 7. Testimonials
    const testiCount = await Testimonial.countDocuments();
    if (testiCount === 0) {
      await Testimonial.insertMany(defaultTestimonials);
      console.log(`[Seed Script] Seeded ${defaultTestimonials.length} testimonials.`);
    }

    console.log('[Seed Script] All database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]', error.message);
    process.exit(1);
  }
};

seedAll();
