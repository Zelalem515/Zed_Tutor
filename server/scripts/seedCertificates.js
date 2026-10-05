/**
 * seedCertificates.js
 *
 * Seeds the Certificate collection with all current certificate records.
 * Images are served from /certificates/... (Vercel public folder).
 *
 * Run from the server/ directory:
 *   node scripts/seedCertificates.js
 *
 * Safe to re-run — checks for existing records by title before inserting.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');

const CERTIFICATES = [
  // ── Awards & Recognition ──────────────────────────────────────────────────
  {
    title: 'Certificate of Merit — Ranked 1st with CGPA 3.95',
    category: 'Awards & Recognition',
    issuingOrg: 'Debre Tabor University — Main Registrar Office',
    issueDate: 'June 25, 2026',
    description:
      'Issued to Zelalem Birhan Geta for scoring a CGPA of 3.95 with distinction and ranking 1st from all students in Gafat Institute of Technology, Information Technology department.',
    fileUrl: '/certificates/awards/Medalist_Certificate.jpg',
    thumbnailUrl: '/certificates/awards/Medalist_Certificate.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 1,
  },

  // ── Academic ──────────────────────────────────────────────────────────────
  {
    title: 'Bachelor of Science Degree in Information Technology',
    category: 'Academic',
    issuingOrg: 'Debre Tabor University — Registrar and Alumni Directorate',
    issueDate: 'June 24, 2026',
    description:
      'Official BSc graduation certificate issued to Zelalem Birhan Geta upon completion of the regular program with a CGPA of 3.95. He passed the National Exit Examination in June 2026 with a score of 69%.',
    fileUrl: '/certificates/academic/BSC_Degree_certificate.jpg',
    thumbnailUrl: '/certificates/academic/BSC_Degree_certificate.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 2,
  },
  {
    title: 'Ethiopian Secondary School Leaving Certificate (ESSLCE)',
    category: 'Academic',
    issuingOrg:
      'National Educational Assessment and Examinations Agency (NEAEA) — Ministry of Education, FDRE',
    issueDate: 'December 2021',
    description:
      'Grade 12 national examination certificate for Zelalem Birhan Geta. Subjects: English 62, Maths (Natural) 85, Aptitude 58, Physics 54, Chemistry 75, Biology 71, Civics 77. Total score: 482.',
    fileUrl: '/certificates/academic/Grade12_certificate.jpg',
    thumbnailUrl: '/certificates/academic/Grade12_certificate.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 3,
  },

  // ── National Examination ──────────────────────────────────────────────────
  {
    title: 'Exit Examination Certificate — Information Technology (BSc)',
    category: 'National Examination',
    issuingOrg: 'FDRE Ministry of Education — Educational Assessment and Examinations Service',
    issueDate: 'October 5, 2026',
    description:
      'Exit Examination Certificate issued to Zelalem Birhan Geta, student of Information Technology (BSc) at Debre Tabor University. Examination year: 2018 End Year. Total score: 69.00%. Status: PASS.',
    fileUrl: '/certificates/national-examination/exit_exam_result.jpg',
    thumbnailUrl: '/certificates/national-examination/exit_exam_result.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 4,
  },

  // ── Certificates & Training ───────────────────────────────────────────────
  {
    title: 'AI for Business Professionals — HP LIFE',
    category: 'Certificates & Training',
    issuingOrg: 'HP LIFE / HP Foundation',
    issueDate: 'April 4, 2026',
    description:
      "Certificate of Completion awarded to Zelalem Birhan for the HP LIFE online course 'AI for Business Professionals'. Topics: AI's role in business, standalone vs integrated AI tools, crafting effective prompts, ethical AI use, and using AI tools for professional growth.",
    fileUrl: '/certificates/training/ai-for-business-professionals.jpg',
    thumbnailUrl: '/certificates/training/ai-for-business-professionals.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 5,
  },
  {
    title: 'Critical Thinking in the AI Era — HP LIFE',
    category: 'Certificates & Training',
    issuingOrg: 'HP LIFE / HP Foundation',
    issueDate: 'April 4, 2026',
    description:
      "Certificate of Completion awarded to Zelalem Birhan for the HP LIFE online course 'Critical Thinking in the AI Era'. Topics: using critical thinking for better decisions, understanding how AI-generated content can distort truth, counteracting biases, and fact-checking strategies.",
    fileUrl: '/certificates/training/Critical Thinking in the AI Era (1)_page-0001.jpg',
    thumbnailUrl: '/certificates/training/Critical Thinking in the AI Era (1)_page-0001.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 6,
  },
  {
    title: 'Android Developer Fundamentals — Udacity Nanodegree',
    category: 'Certificates & Training',
    issuingOrg: 'Udacity (Part of Accenture)',
    issueDate: 'April 29, 2026',
    description:
      'Verified Certificate of Nanodegree Program Completion in Android Developer Fundamentals, awarded to Zelalem Birhan by Udacity. Program delivered in partnership with UAE Ministry of Cabinet Affairs, Government Experience Exchange Office, and Ethiopian Ministry of Labor and Skills.',
    fileUrl: '/certificates/training/android developer_page-0001.jpg',
    thumbnailUrl: '/certificates/training/android developer_page-0001.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 7,
  },
  {
    title: 'Artificial Intelligence Fundamentals — Udacity Nanodegree',
    category: 'Certificates & Training',
    issuingOrg: 'Udacity (Part of Accenture)',
    issueDate: 'November 25, 2024',
    description:
      'Verified Certificate of Nanodegree Program Completion in Artificial Intelligence Fundamentals, awarded to Zelalem Birhan by Udacity. Program delivered in partnership with UAE Ministry of Cabinet Affairs, Government Experience Exchange Office, and Ethiopian Ministry of Labor and Skills.',
    fileUrl: '/certificates/training/Artificial Intelligence_page-0001.jpg',
    thumbnailUrl: '/certificates/training/Artificial Intelligence_page-0001.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 8,
  },
  {
    title: 'Data Science Fundamentals — Udacity Nanodegree',
    category: 'Certificates & Training',
    issuingOrg: 'Udacity (Part of Accenture)',
    issueDate: 'March 23, 2026',
    description:
      'Verified Certificate of Nanodegree Program Completion in Data Science Fundamentals, awarded to Zelalem Birhan by Udacity. Program delivered in partnership with UAE Ministry of Cabinet Affairs, Government Experience Exchange Office, and Ethiopian Ministry of Labor and Skills.',
    fileUrl: '/certificates/training/data-science-fundamentals.jpg',
    thumbnailUrl: '/certificates/training/data-science-fundamentals.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 9,
  },
  {
    title: 'Beginner Level Digital Literacy Skills Training — Dereja',
    category: 'Certificates & Training',
    issuingOrg: 'Dereja.com in partnership with MasterCard Foundation and Debre Tabor University',
    issueDate: 'July 7, 2024',
    description:
      'Certificate of Completion presented to Zelalem Birhan Geta for successfully completing a Beginner Level Digital Literacy Skills Training held in 2024 for two months, organised and delivered by Dereja in partnership with MasterCard Foundation and Debre Tabor University.',
    fileUrl: '/certificates/training/basic-digital-literacy-from-Dereja.jpg',
    thumbnailUrl: '/certificates/training/basic-digital-literacy-from-Dereja.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 10,
  },
  {
    title: 'Basic Digital Literacy — Amhara National Regional State Education Bureau',
    category: 'Certificates & Training',
    issuingOrg:
      'Amhara National Regional State Education Bureau (Digital Amhara) in partnership with AIT, Amhara Labour & Skill Bureau, and Amhara Region Education Bureau',
    issueDate: 'May 8, 2026',
    description:
      'Verified Certificate of Achievement issued to Zelalem Birhan Geta for successfully completing and receiving a passing grade in Basic Digital Literacy, a program offered by Amhara National Regional State Education Bureau.',
    fileUrl: '/certificates/training/digital-literacy-from-Amhara-Educationbrue.jpg',
    thumbnailUrl: '/certificates/training/digital-literacy-from-Amhara-Educationbrue.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 11,
  },
  {
    // Note: filename has a leading space — stored exactly as on disk
    title: 'Programming Fundamentals',
    category: 'Certificates & Training',
    issuingOrg: '',   // issuer not visible — update via admin after confirming
    issueDate: '',    // date not confirmed — update via admin
    description:
      'Certificate of completion in Programming Fundamentals. Details to be confirmed — please update issuer and date via the admin panel after reviewing the original certificate.',
    fileUrl: '/certificates/training/ programming-fundamentals.jpg',
    thumbnailUrl: '/certificates/training/ programming-fundamentals.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 12,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zed_tutor';
  console.log(`[Cert Seed] Connecting to: ${uri.replace(/:([^@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(uri);
    console.log('[Cert Seed] Connected.');

    let created = 0;
    let skipped = 0;

    for (const cert of CERTIFICATES) {
      const exists = await Certificate.findOne({ title: cert.title });
      if (exists) {
        console.log(`  SKIP  "${cert.title}" — already exists`);
        skipped++;
      } else {
        await Certificate.create(cert);
        console.log(`  ADD   "${cert.title}"`);
        created++;
      }
    }

    console.log(`\n[Cert Seed] Done. Created: ${created} | Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('[Cert Seed Error]', err.message);
    process.exit(1);
  }
}

seed();
