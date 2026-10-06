const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Verified fallback data to guarantee 100% uptime and immediate rendering
const FALLBACK_PROFILE = {
  fullName: 'Zelalem Birhan',
  brandName: 'ZED_Tutor',
  title: 'Mathematics & Information Technology Tutor',
  tagline: 'University Gold Medalist | 3.95 CGPA | Ranked 1st at GIT',
  shortBio: 'Information Technology graduate from Debre Tabor University (Gafat Institute of Technology), Ethiopia. Passionate about empowering learners in Grades 5–12 to master Mathematics, Computer/ICT, Programming, and Web Development through conceptual understanding and structured problem-solving.',
  fullBio: 'Graduated as the University Gold Medalist and 1st ranked at Gafat Institute of Technology with a 3.95/4.00 CGPA across 54 courses. My university education developed deep mathematical reasoning, analytical thinking, software development, database systems, and networking. Alongside high academic performance, I engineered major systems including a Web-Based E-Learning Management System and an Online Examination System. As an educator, my focus is cultivating genuine logical thinking, building academic confidence, and fostering independent learning habits.',
  avatarUrl: '',
  itPortfolioUrl: 'https://zelalem-birhan.vercel.app/',
  heroHeadline: '',
  availability: 'Available for new students — online and in-person (Addis Ababa area)',
  contactInfo: {
    phone: '+251 912 692 343',
    whatsapp: '+251912692343',
    telegram: 'https://t.me/zed_tutor',
    email: 'zedtutorit@gmail.com',
    location: 'Addis Ababa, Ethiopia',
    telegramBot: '',
    instagram: '',
    facebook: '',
    youtube: '',
    vimeo: '',
    tiktok: ''
  },
  socialLinks: []
};

const FALLBACK_ACADEMIC = {
  degree: 'BSc in Information Technology',
  university: 'Debre Tabor University',
  institute: 'Gafat Institute of Technology (GIT)',
  country: 'Ethiopia',
  cgpa: 3.95,
  maxCgpa: 4.00,
  goldMedalist: true,
  rank: '1st at Gafat Institute of Technology',
  totalCourses: 54,
  gradeDistribution: {
    aPlus: 31,
    a: 15,
    aMinus: 5,
    bPlus: 3,
    aOrAbove: 46
  },
  nationalExam: {
    mathScore: 85,
    mathMax: 100,
    overallScore: 482
  },
  highlightedCourses: [
    { name: 'Mathematics for Natural Science', grade: 'A+', category: 'Pure & Applied Mathematics' },
    { name: 'Applied Mathematics I', grade: 'A+', category: 'Pure & Applied Mathematics' },
    { name: 'Discrete Mathematics', grade: 'A', category: 'Foundations of Computer Science' },
    { name: 'Introduction to Statistics', grade: 'A+', category: 'Probability & Quantitative Analysis' }
  ],
  timelineMilestones: [
    {
      title: 'Grade 12 National Examination',
      year: 'Foundation Phase',
      description: 'Scored 85/100 in Mathematics and an overall score of 482, demonstrating top quantitative aptitude.',
      iconName: 'GraduationCap'
    },
    {
      title: 'University Admission at GIT',
      year: 'Admission',
      description: 'Commenced Bachelor of Science in Information Technology at Gafat Institute of Technology, Debre Tabor University.',
      iconName: 'BookOpen'
    },
    {
      title: 'Mathematical Rigor & Core Computing',
      year: 'Core Growth',
      description: 'Mastered mathematical reasoning, algorithms, database systems, networking, and system analysis.',
      iconName: 'Code'
    },
    {
      title: 'Major Systems Engineering Period',
      year: 'Final Year Milestone',
      description: 'Engineered Web-Based LMS, Online Exam Management System, and Debre Tabor Gebeya E-Commerce while maintaining top academic performance.',
      iconName: 'Cpu'
    },
    {
      title: 'Graduation & University Gold Medal',
      year: 'Highest Honor',
      description: 'Graduated with 3.95/4.00 CGPA, ranked 1st across Gafat Institute of Technology, and awarded the University Gold Medal.',
      iconName: 'Award'
    },
    {
      title: 'ZED_Tutor Launch',
      year: 'Mentorship & Tutoring',
      description: 'Established ZED_Tutor to offer structured, evidence-based tutoring for Grades 5–12 in Mathematics, ICT, and Programming.',
      iconName: 'Sparkles'
    }
  ]
};

// NOTE: Closing bracket was missing — this was a syntax error in the previous version.
const FALLBACK_SUBJECTS = [
  {
    _id: 'sub_1',
    name: 'Mathematics',
    category: 'Mathematics',
    shortDescription: 'From fundamental arithmetic to algebraic reasoning, geometry, functions, and exam preparation with step-by-step clarity.',
    gradeRange: 'Grades 5–12',
    topics: ['Algebra & Expressions', 'Plane & Solid Geometry', 'Equations & Inequalities', 'Functions & Graphs', 'Trigonometry', 'Exam Practice & Problem Solving'],
    displayOrder: 1,
    isActive: true
  },
  {
    _id: 'sub_2',
    name: 'Computer / ICT',
    category: 'Computer / ICT',
    shortDescription: 'Complete digital fluency covering computer architecture, productivity tools, operating systems, and internet safety.',
    gradeRange: 'Grades 5–12',
    topics: ['Computer Architecture', 'Operating Systems', 'Word, Excel, PowerPoint', 'Networking Fundamentals', 'Digital Security & Ethics'],
    displayOrder: 2,
    isActive: true
  },
  {
    _id: 'sub_3',
    name: 'Programming Fundamentals',
    category: 'Programming',
    shortDescription: 'Core algorithmic thinking, problem decomposition, and syntax mastery in beginner-friendly and industry-standard languages.',
    gradeRange: 'Grades 7–12',
    topics: ['Variables & Data Types', 'Control Flow & Loops', 'Functions & Modular Code', 'Basic Algorithms', 'Debugging Strategies'],
    displayOrder: 3,
    isActive: true
  },
  {
    _id: 'sub_4',
    name: 'Web Development',
    category: 'Web Development',
    shortDescription: 'Hands-on website design and development: structuring pages, responsive styling, and dynamic interactive behavior.',
    gradeRange: 'Grades 8–12',
    topics: ['HTML5 Semantic Structure', 'CSS3 & Responsive Design', 'Modern JavaScript Essentials', 'Building Interactive Pages'],
    displayOrder: 4,
    isActive: true
  },
  {
    _id: 'sub_5',
    name: 'General Computer Skills',
    category: 'General Computer Skills',
    shortDescription: 'Essential practical skills for students, parents, and beginners to navigate modern technology and software tools confidently.',
    gradeRange: 'All Grades & Beginners',
    topics: ['File Management & Organization', 'Internet Research Skills', 'Safe Online Collaboration', 'Software Installation & Troubleshooting'],
    displayOrder: 5,
    isActive: true
  }
];

const FALLBACK_CERTIFICATES = [
  {
    _id: 'cert_1',
    title: 'Certificate of Merit',
    category: 'Awards & Recognition',
    issuingOrg: 'Debre Tabor University — Main Registrar Office',
    issueDate: 'June 25, 2026',
    description: 'Issued to Zelalem Birhan Geta, student of Information Technology department in Gafat Institute of Technology, for scoring a CGPA of 3.95 with distinction and a rank of 1st from all students in the Institute.',
    fileUrl: '/certificates/awards/Medalist_Certificate.jpg',
    thumbnailUrl: '/certificates/awards/Medalist_Certificate.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 1
  },
  {
    _id: 'cert_2',
    title: 'Bachelor of Science Degree in Information Technology',
    category: 'University',
    issuingOrg: 'Debre Tabor University — Registrar and Alumni Directorate',
    issueDate: 'June 24, 2026',
    description: 'Issued to Zelalem Birhan Geta upon graduation in the regular program with Bachelor of Science Degree in Information Technology with a CGPA of 3.95. He took the National Exit Examination in June 2026 and passed with a score of 69%.',
    fileUrl: '/certificates/academic/BSC_Degree_certificate.jpg',
    thumbnailUrl: '/certificates/academic/BSC_Degree_certificate.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 2
  },
  {
    _id: 'cert_3',
    title: 'Ethiopian Secondary School Leaving Certificate Examination (ESSLCE)',
    category: 'National Examination',
    issuingOrg: 'NEAEA — Ministry of Education, FDRE',
    issueDate: 'December 2021',
    description: 'Certifies that Zelalem Birhan Geta took 7 subjects in the 2021 (2014 E.C.) examination session. Scores: English 62, Maths (Natural) 85, Aptitude 58, Physics 54, Chemistry 75, Biology 71, Civics 77. Total: 482. Certificate No. 2594907.',
    fileUrl: '/certificates/academic/Grade12_certificate.jpg',
    thumbnailUrl: '/certificates/academic/Grade12_certificate.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 3
  },
  {
    _id: 'cert_4',
    title: 'Exit Examination Certificate — Information Technology (BSc)',
    category: 'National Examination',
    issuingOrg: 'FDRE Ministry of Education — Educational Assessment and Examinations Service',
    issueDate: 'October 5, 2026',
    description: 'Certifies that Zelalem Birhan Geta, student of Information Technology (BSc) at Debre Tabor University, successfully completed the Exit Examination (2018 End Year) with a total score of 69.00% and status: PASS. Generated October 5, 2026.',
    fileUrl: '/certificates/national-examination/exit_exam_result.jpg',
    thumbnailUrl: '/certificates/national-examination/exit_exam_result.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 4
  },
  {
    _id: 'cert_5',
    title: 'AI for Business Professionals',
    category: 'Certificates & Training',
    issuingOrg: 'HP LIFE / HP Foundation',
    issueDate: 'April 4, 2026',
    description: "Certificate of Completion awarded to Zelalem Birhan for the HP LIFE online course 'AI for Business Professionals'. Topics covered: AI's role in business, standalone vs integrated AI tools, crafting effective prompts, ethical AI use, and using AI tools to support professional growth.",
    fileUrl: '/certificates/training/ai-for-business-professionals.jpg',
    thumbnailUrl: '/certificates/training/ai-for-business-professionals.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 5
  },
  {
    _id: 'cert_6',
    title: 'Critical Thinking in the AI Era',
    category: 'Certificates & Training',
    issuingOrg: 'HP LIFE / HP Foundation',
    issueDate: 'April 4, 2026',
    description: "Certificate of Completion awarded to Zelalem Birhan for the HP LIFE online course 'Critical Thinking in the AI Era'. Topics covered: using critical thinking to make better decisions, understanding how AI-generated content can distort the truth, strategies to counteract biases, and tools to fact-check information.",
    fileUrl: '/certificates/training/Critical Thinking in the AI Era (1)_page-0001.jpg',
    thumbnailUrl: '/certificates/training/Critical Thinking in the AI Era (1)_page-0001.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 6
  },
  {
    _id: 'cert_7',
    title: 'Android Developer Fundamentals',
    category: 'Certificates & Training',
    issuingOrg: 'Udacity (Part of Accenture)',
    issueDate: 'April 29, 2026',
    description: 'Verified Certificate of Nanodegree Program Completion in Android Developer Fundamentals, awarded to Zelalem Birhan by Udacity (Part of Accenture). Signed by Kai Roemmelt, CEO, Udacity.',
    fileUrl: '/certificates/training/android developer_page-0001.jpg',
    thumbnailUrl: '/certificates/training/android developer_page-0001.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 7
  },
  {
    _id: 'cert_8',
    title: 'Artificial Intelligence Fundamentals',
    category: 'Certificates & Training',
    issuingOrg: 'Udacity (Part of Accenture)',
    issueDate: 'November 25, 2024',
    description: 'Verified Certificate of Nanodegree Program Completion in Artificial Intelligence Fundamentals, awarded to Zelalem Birhan by Udacity (Part of Accenture). Signed by Kai Roemmelt, CEO, Udacity.',
    fileUrl: '/certificates/training/Artificial Intelligence_page-0001.jpg',
    thumbnailUrl: '/certificates/training/Artificial Intelligence_page-0001.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 8
  },
  {
    _id: 'cert_9',
    title: 'Data Science Fundamentals',
    category: 'Certificates & Training',
    issuingOrg: 'Udacity (Part of Accenture)',
    issueDate: 'March 23, 2026',
    description: 'Verified Certificate of Nanodegree Program Completion in Data Science Fundamentals, awarded to Zelalem Birhan by Udacity (Part of Accenture). Signed by Kai Roemmelt, CEO, Udacity.',
    fileUrl: '/certificates/training/data-science-fundamentals.jpg',
    thumbnailUrl: '/certificates/training/data-science-fundamentals.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 9
  },
  {
    _id: 'cert_10',
    title: 'Beginner Level Digital Literacy Skills Training',
    category: 'Certificates & Training',
    issuingOrg: 'Dereja.com / Mastercard Foundation / Debre Tabor University',
    issueDate: 'July 7, 2024',
    description: 'Certificate of Completion presented to Zelalem Birhan Geta for successfully completing a Beginner Level Digital Literacy Skills Training held in 2024 for two months, organised and delivered by Dereja in partnership with MasterCard Foundation and Debre Tabor University. Certificate ID: f3e22e65-5d41-4230-9b22-ebafca4c4451.',
    fileUrl: '/certificates/training/basic-digital-literacy-from-Dereja.jpg',
    thumbnailUrl: '/certificates/training/basic-digital-literacy-from-Dereja.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 10
  },
  {
    _id: 'cert_11',
    title: 'Basic Digital Literacy',
    category: 'Certificates & Training',
    issuingOrg: 'Amhara National Regional State Education Bureau',
    issueDate: 'May 8, 2026',
    description: 'Verified Certificate of Achievement issued to Zelalem Birhan Geta for successfully completing and receiving a passing grade in Basic Digital Literacy, a program offered by Amhara National Regional State Education Bureau in partnership with AIT, Amhara Labour & Skill Bureau, and Amhara Region Education Bureau. Certificate ID: 9DDPeJbiPl.',
    fileUrl: '/certificates/training/digital-literacy-from-Amhara-Educationbrue.jpg',
    thumbnailUrl: '/certificates/training/digital-literacy-from-Amhara-Educationbrue.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 11
  },
  {
    _id: 'cert_12',
    title: 'Programming Fundamentals',
    category: 'Certificates & Training',
    issuingOrg: 'Udacity (Part of Accenture)',
    issueDate: 'March 23, 2026',
    description: 'Verified Certificate of Nanodegree Program Completion in Programming Fundamentals, awarded to Zelalem Birhan by Udacity (Part of Accenture). Signed by Kai Roemmelt, CEO, Udacity.',
    fileUrl: '/certificates/training/programming-fundamentals.jpg',
    thumbnailUrl: '/certificates/training/programming-fundamentals.jpg',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 12
  }
];

const FALLBACK_GRADES = [
  { _id: 'gr_1', label: 'Grade 5',  numericValue: 5,  isActive: true, displayOrder: 1 },
  { _id: 'gr_2', label: 'Grade 6',  numericValue: 6,  isActive: true, displayOrder: 2 },
  { _id: 'gr_3', label: 'Grade 7',  numericValue: 7,  isActive: true, displayOrder: 3 },
  { _id: 'gr_4', label: 'Grade 8',  numericValue: 8,  isActive: true, displayOrder: 4 },
  { _id: 'gr_5', label: 'Grade 9',  numericValue: 9,  isActive: true, displayOrder: 5 },
  { _id: 'gr_6', label: 'Grade 10', numericValue: 10, isActive: true, displayOrder: 6 },
  { _id: 'gr_7', label: 'Grade 11', numericValue: 11, isActive: true, displayOrder: 7 },
  { _id: 'gr_8', label: 'Grade 12', numericValue: 12, isActive: true, displayOrder: 8 },
];

// Helper to make API requests with fallback
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('zed_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API] Fallback used for ${endpoint}:`, err.message);
    return null;
  }
}

export const api = {
  // Profile
  async getProfile() {
    const res = await request('/profile');
    return res?.data || FALLBACK_PROFILE;
  },
  async updateProfile(data) {
    return await request('/profile', { method: 'PUT', body: JSON.stringify(data) });
  },
  // Upload a profile photo (File object) — uses multipart/form-data
  async uploadProfilePhoto(file) {
    const token = localStorage.getItem('zed_admin_token');
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await fetch(`${API_BASE}/profile/photo`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        // Do NOT set Content-Type — browser sets it with the correct boundary
      });
      return await res.json();
    } catch (err) {
      console.warn('[API] uploadProfilePhoto failed:', err.message);
      return { success: false, message: 'Upload failed. Check your connection.' };
    }
  },
  // Remove the current profile photo
  async removeProfilePhoto() {
    return await request('/profile/photo', { method: 'DELETE' });
  },

  // Academic
  async getAcademic() {
    const res = await request('/academic');
    return res?.data || FALLBACK_ACADEMIC;
  },
  async updateAcademic(data) {
    return await request('/academic', { method: 'PUT', body: JSON.stringify(data) });
  },

  // Subjects
  async getSubjects(showAll = false) {
    const res = await request(`/subjects${showAll ? '?all=true' : ''}`);
    return res?.data || FALLBACK_SUBJECTS;
  },
  async createSubject(data) {
    return await request('/subjects', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateSubject(id, data) {
    return await request(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteSubject(id) {
    return await request(`/subjects/${id}`, { method: 'DELETE' });
  },

  // Grades — Public
  async getGrades() {
    const res = await request('/grades');
    return res?.data || FALLBACK_GRADES;
  },
  // Grades — Admin
  async getGradesAll() {
    const res = await request('/grades?all=true');
    return res?.data || FALLBACK_GRADES;
  },
  async createGrade(data) {
    return await request('/grades', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateGrade(id, data) {
    return await request(`/grades/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteGrade(id) {
    return await request(`/grades/${id}`, { method: 'DELETE' });
  },

  // Certificates — Public
  async getCertificates() {
    const res = await request('/certificates');
    return (res?.data && res.data.length > 0) ? res.data : FALLBACK_CERTIFICATES;
  },

  // Certificates — Admin
  async getCertificatesAll() {
    const res = await request('/certificates?all=true');
    return res?.data || FALLBACK_CERTIFICATES;
  },
  async createCertificate(data) {
    return await request('/certificates', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateCertificate(id, data) {
    return await request(`/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteCertificate(id) {
    return await request(`/certificates/${id}`, { method: 'DELETE' });
  },

  // Testimonials — Public
  async getTestimonials() {
    const res = await request('/testimonials');
    return res?.data || [];
  },
  async submitTestimonial(data) {
    return await request('/testimonials', { method: 'POST', body: JSON.stringify(data) });
  },
  async markTestimonialHelpful(id) {
    return await request(`/testimonials/${id}/helpful`, { method: 'POST' });
  },

  // Testimonials — Admin
  async getTestimonialsAll() {
    return await request('/testimonials/admin/all');
  },
  async updateTestimonial(id, data) {
    return await request(`/testimonials/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteTestimonial(id) {
    return await request(`/testimonials/admin/${id}`, { method: 'DELETE' });
  },

  // Inquiries — Public
  async submitInquiry(data) {
    return await request('/inquiries', { method: 'POST', body: JSON.stringify(data) });
  },

  // Inquiries — Admin
  async getInquiriesAll() {
    return await request('/inquiries/admin/all');
  },
  async updateInquiry(id, data) {
    return await request(`/inquiries/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteInquiry(id) {
    return await request(`/inquiries/admin/${id}`, { method: 'DELETE' });
  },

  // Videos — Public
  async getVideos() {
    const res = await request('/videos');
    return res?.data || [];
  },

  // Videos — Admin
  async getVideosAll() {
    const res = await request('/videos?all=true');
    return res?.data || [];
  },
  async createVideo(data) {
    return await request('/videos', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateVideo(id, data) {
    return await request(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteVideo(id) {
    return await request(`/videos/${id}`, { method: 'DELETE' });
  },

  // Auth
  async login(email, password) {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  async getMe() {
    return await request('/auth/me');
  },
  async changePassword(currentPassword, newPassword, confirmPassword) {
    return await request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
  }
};
