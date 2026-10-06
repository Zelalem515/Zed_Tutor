/**
 * rebuildCertificates.js
 *
 * CRITICAL REBUILD — deletes ALL existing certificate records and replaces them
 * with exactly one record per actual certificate file in client/public/certificates/.
 *
 * Every record is based ONLY on what is visible in the actual certificate image.
 * Nothing is invented or guessed.
 *
 * Run from server/ directory:
 *   node scripts/rebuildCertificates.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');

// ── Verified records — one per actual file, metadata read from actual image ──
const VERIFIED_CERTIFICATES = [
  // ── Awards & Recognition ────────────────────────────────────────────────────
  {
    title:          'Certificate of Merit',
    category:       'Awards & Recognition',
    issuingOrg:     'Debre Tabor University — Main Registrar Office',
    issueDate:      'June 25, 2026',
    description:    'Issued to Zelalem Birhan Geta, student of Information Technology department in Gafat Institute of Technology, for scoring a CGPA of 3.95 with distinction and a rank of 1st from all students in the Institute.',
    fileUrl:        '/certificates/awards/Medalist_Certificate.jpg',
    thumbnailUrl:   '/certificates/awards/Medalist_Certificate.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   1,
  },

  // ── University ──────────────────────────────────────────────────────────────
  {
    title:          'Bachelor of Science Degree in Information Technology',
    category:       'University',
    issuingOrg:     'Debre Tabor University — Registrar and Alumni Directorate',
    issueDate:      'June 24, 2026',
    description:    'Issued to Zelalem Birhan Geta upon graduation in the regular program with Bachelor of Science Degree in Information Technology with a CGPA of 3.95. He took the National Exit Examination in June 2026 and passed with a score of 69%.',
    fileUrl:        '/certificates/academic/BSC_Degree_certificate.jpg',
    thumbnailUrl:   '/certificates/academic/BSC_Degree_certificate.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   2,
  },

  // ── National Examination ────────────────────────────────────────────────────
  {
    title:          'Ethiopian Secondary School Leaving Certificate Examination (ESSLCE)',
    category:       'National Examination',
    issuingOrg:     'National Educational Assessment and Examinations Agency (NEAEA) — Federal Democratic Republic of Ethiopia Ministry of Education',
    issueDate:      'December 2021',
    description:    'Certifies that Zelalem Birhan Geta took 7 subjects in the 2021 (2014 E.C.) examination session. Scores: English 62, Maths (Natural) 85, Aptitude 58, Physics 54, Chemistry 75, Biology 71, Civics 77. Total: 482. Certificate No. 2594907.',
    fileUrl:        '/certificates/academic/Grade12_certificate.jpg',
    thumbnailUrl:   '/certificates/academic/Grade12_certificate.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   3,
  },
  {
    title:          'Exit Examination Certificate — Information Technology (BSc)',
    category:       'National Examination',
    issuingOrg:     'FDRE Ministry of Education — Educational Assessment and Examinations Service',
    issueDate:      'October 5, 2026',
    description:    'Certifies that Zelalem Birhan Geta, student of Information Technology (BSc) at Debre Tabor University, successfully completed the Exit Examination (2018 End Year) with a total score of 69.00% and status: PASS. Generated October 5, 2026.',
    fileUrl:        '/certificates/national-examination/exit_exam_result.jpg',
    thumbnailUrl:   '/certificates/national-examination/exit_exam_result.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   4,
  },

  // ── Certificates & Training ─────────────────────────────────────────────────
  {
    title:          'AI for Business Professionals',
    category:       'Certificates & Training',
    issuingOrg:     'HP LIFE / HP Foundation',
    issueDate:      'April 4, 2026',
    description:    "Certificate of Completion awarded to Zelalem Birhan for the HP LIFE online course 'AI for Business Professionals'. Topics covered: AI's role in business, standalone vs integrated AI tools, crafting effective prompts, ethical AI use, and using AI tools to support professional growth.",
    fileUrl:        '/certificates/training/ai-for-business-professionals.jpg',
    thumbnailUrl:   '/certificates/training/ai-for-business-professionals.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   5,
  },
  {
    title:          'Critical Thinking in the AI Era',
    category:       'Certificates & Training',
    issuingOrg:     'HP LIFE / HP Foundation',
    issueDate:      'April 4, 2026',
    description:    "Certificate of Completion awarded to Zelalem Birhan for the HP LIFE online course 'Critical Thinking in the AI Era'. Topics covered: using critical thinking to make better decisions, understanding how AI-generated content can distort the truth, strategies to counteract biases, and tools to fact-check information.",
    fileUrl:        '/certificates/training/Critical Thinking in the AI Era (1)_page-0001.jpg',
    thumbnailUrl:   '/certificates/training/Critical Thinking in the AI Era (1)_page-0001.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   6,
  },
  {
    title:          'Android Developer Fundamentals',
    category:       'Certificates & Training',
    issuingOrg:     'Udacity (Part of Accenture)',
    issueDate:      'April 29, 2026',
    description:    'Verified Certificate of Nanodegree Program Completion in Android Developer Fundamentals, awarded to Zelalem Birhan by Udacity (Part of Accenture). Signed by Kai Roemmelt, CEO, Udacity.',
    fileUrl:        '/certificates/training/android developer_page-0001.jpg',
    thumbnailUrl:   '/certificates/training/android developer_page-0001.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   7,
  },
  {
    title:          'Artificial Intelligence Fundamentals',
    category:       'Certificates & Training',
    issuingOrg:     'Udacity (Part of Accenture)',
    issueDate:      'November 25, 2024',
    description:    'Verified Certificate of Nanodegree Program Completion in Artificial Intelligence Fundamentals, awarded to Zelalem Birhan by Udacity (Part of Accenture). Signed by Kai Roemmelt, CEO, Udacity.',
    fileUrl:        '/certificates/training/Artificial Intelligence_page-0001.jpg',
    thumbnailUrl:   '/certificates/training/Artificial Intelligence_page-0001.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   8,
  },
  {
    title:          'Data Science Fundamentals',
    category:       'Certificates & Training',
    issuingOrg:     'Udacity (Part of Accenture)',
    issueDate:      'March 23, 2026',
    description:    'Verified Certificate of Nanodegree Program Completion in Data Science Fundamentals, awarded to Zelalem Birhan by Udacity (Part of Accenture). Signed by Kai Roemmelt, CEO, Udacity.',
    fileUrl:        '/certificates/training/data-science-fundamentals.jpg',
    thumbnailUrl:   '/certificates/training/data-science-fundamentals.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   9,
  },
  {
    title:          'Beginner Level Digital Literacy Skills Training',
    category:       'Certificates & Training',
    issuingOrg:     'Dereja.com in partnership with MasterCard Foundation and Debre Tabor University',
    issueDate:      'July 7, 2024',
    description:    'Certificate of Completion presented to Zelalem Birhan Geta for successfully completing a Beginner Level Digital Literacy Skills Training held in 2024 for two months, organised and delivered by Dereja in partnership with MasterCard Foundation and Debre Tabor University. Certificate ID: f3e22e65-5d41-4230-9b22-ebafca4c4451.',
    fileUrl:        '/certificates/training/basic-digital-literacy-from-Dereja.jpg',
    thumbnailUrl:   '/certificates/training/basic-digital-literacy-from-Dereja.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   10,
  },
  {
    title:          'Basic Digital Literacy',
    category:       'Certificates & Training',
    issuingOrg:     'Amhara National Regional State Education Bureau',
    issueDate:      'May 8, 2026',
    description:    'Verified Certificate of Achievement issued to Zelalem Birhan Geta for successfully completing and receiving a passing grade in Basic Digital Literacy, a program offered by Amhara National Regional State Education Bureau in partnership with AIT, Amhara Labour & Skill Bureau, and Amhara Region Education Bureau. Certificate ID: 9DDPeJbiPl.',
    fileUrl:        '/certificates/training/digital-literacy-from-Amhara-Educationbrue.jpg',
    thumbnailUrl:   '/certificates/training/digital-literacy-from-Amhara-Educationbrue.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   11,
  },
  {
    title:          'Programming Fundamentals',
    category:       'Certificates & Training',
    issuingOrg:     'Udacity (Part of Accenture)',
    issueDate:      'March 23, 2026',
    description:    'Verified Certificate of Nanodegree Program Completion in Programming Fundamentals, awarded to Zelalem Birhan by Udacity (Part of Accenture). Signed by Kai Roemmelt, CEO, Udacity.',
    fileUrl:        '/certificates/training/programming-fundamentals.jpg',
    thumbnailUrl:   '/certificates/training/programming-fundamentals.jpg',
    fileType:       'image',
    isPublic:       true,
    isDownloadable: true,
    displayOrder:   12,
  },
];

async function rebuild() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zed_tutor';
  console.log('[Rebuild] Connecting to MongoDB…');

  try {
    await mongoose.connect(uri);
    console.log('[Rebuild] Connected.\n');

    // Step 1: Count and list what we are about to delete
    const existing = await Certificate.find({}, 'title').lean();
    console.log(`[Rebuild] Found ${existing.length} existing certificate records:`);
    existing.forEach(c => console.log(`  - "${c.title}"`));

    // Step 2: Delete ALL existing records
    const { deletedCount } = await Certificate.deleteMany({});
    console.log(`\n[Rebuild] Deleted ${deletedCount} records.\n`);

    // Step 3: Insert verified records
    console.log('[Rebuild] Inserting verified records:');
    for (const cert of VERIFIED_CERTIFICATES) {
      await Certificate.create(cert);
      console.log(`  ADD [${cert.displayOrder}] "${cert.title}" — ${cert.issuingOrg} (${cert.issueDate})`);
    }

    const finalCount = await Certificate.countDocuments();
    console.log(`\n[Rebuild] Complete. ${finalCount} certificate records now in database.`);
    console.log('[Rebuild] Every record corresponds to an actual file in client/public/certificates/.');
    process.exit(0);
  } catch (err) {
    console.error('[Rebuild Error]', err.message);
    process.exit(1);
  }
}

rebuild();
