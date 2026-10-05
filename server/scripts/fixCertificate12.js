/**
 * fixCertificate12.js
 * Updates the "Programming Fundamentals" certificate record with
 * correct metadata read from the actual Udacity certificate image,
 * and fixes the file path (removes leading space).
 *
 * Run from server/ directory:
 *   node scripts/fixCertificate12.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');

async function fix() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zed_tutor';
  console.log(`[Fix] Connecting to MongoDB…`);

  try {
    await mongoose.connect(uri);
    console.log('[Fix] Connected.');

    const updated = await Certificate.findOneAndUpdate(
      { title: 'Programming Fundamentals' },
      {
        title:          'Programming Fundamentals — Udacity Nanodegree',
        category:       'Certificates & Training',
        issuingOrg:     'Udacity (Part of Accenture)',
        issueDate:      'March 23, 2026',
        description:    'Verified Certificate of Nanodegree Program Completion in Programming Fundamentals, awarded to Zelalem Birhan by Udacity. Program delivered in partnership with UAE Ministry of Cabinet Affairs, Government Experience Exchange Office, and Ethiopian Ministry of Labor and Skills.',
        fileUrl:        '/certificates/training/programming-fundamentals.jpg',
        thumbnailUrl:   '/certificates/training/programming-fundamentals.jpg',
        fileType:       'image',
        isPublic:       true,
        isDownloadable: true,
        displayOrder:   12,
      },
      { new: true }
    );

    if (updated) {
      console.log(`[Fix] Updated: "${updated.title}"`);
      console.log(`      fileUrl: ${updated.fileUrl}`);
      console.log(`      issuer:  ${updated.issuingOrg}`);
      console.log(`      date:    ${updated.issueDate}`);
    } else {
      console.log('[Fix] Record not found — nothing updated.');
    }

    process.exit(0);
  } catch (err) {
    console.error('[Fix Error]', err.message);
    process.exit(1);
  }
}

fix();
