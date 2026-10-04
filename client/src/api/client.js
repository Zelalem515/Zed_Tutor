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
    title: 'University Gold Medal & 1st Rank Award',
    category: 'Awards & Recognition',
    issuingOrg: 'Debre Tabor University, Gafat Institute of Technology',
    issueDate: 'Graduation Convocation',
    description: 'Awarded for graduating ranked 1st in the Gafat Institute of Technology with a final CGPA of 3.95/4.00.',
    fileUrl: '#',
    thumbnailUrl: '',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 1
  },
  {
    _id: 'cert_2',
    title: 'BSc Degree in Information Technology (Distinction)',
    category: 'Academic',
    issuingOrg: 'Debre Tabor University',
    issueDate: 'Official Degree Award',
    description: 'Official Bachelor of Science degree in Information Technology with Very Great Distinction.',
    fileUrl: '#',
    thumbnailUrl: '',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 2
  },
  {
    _id: 'cert_3',
    title: 'Grade 12 National Examination Certificate',
    category: 'National Examination',
    issuingOrg: 'National Educational Assessment and Examinations Agency (NEAEA)',
    issueDate: 'University Entrance Certificate',
    description: 'National Examination result certificate: 85/100 in Mathematics, 482 overall entrance score.',
    fileUrl: '#',
    thumbnailUrl: '',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 3
  },
  {
    _id: 'cert_4',
    title: 'Official Academic Transcript (Verifiable Record)',
    category: 'University',
    issuingOrg: 'Office of the Registrar, Debre Tabor University',
    issueDate: 'Official Academic Record',
    description: 'Complete 54-course academic record showing 31 A+ and 15 A grades (46 courses A or above, 3.95 CGPA).',
    fileUrl: '#',
    thumbnailUrl: '',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 4
  },
  {
    _id: 'cert_5',
    title: 'Academic Systems Engineering & Full-Stack Development',
    category: 'Certificates & Training',
    issuingOrg: 'Gafat Institute of Technology — Systems Development Unit',
    issueDate: 'Final-Year Project Certification',
    description: 'Practical certification for engineering the Web-Based LMS, Online Exam Management System, and Debre Tabor Gebeya.',
    fileUrl: '#',
    thumbnailUrl: '',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 5
  },
  {
    _id: 'cert_6',
    title: 'Certificate of Scholastic Honor & Academic Mentorship',
    category: 'Other',
    issuingOrg: 'Debre Tabor University Student Academic Affairs',
    issueDate: 'Academic Honor',
    description: 'Recognition for academic leadership, quantitative problem solving, and peer tutoring support in mathematics and computing.',
    fileUrl: '#',
    thumbnailUrl: '',
    fileType: 'image',
    isPublic: true,
    isDownloadable: true,
    displayOrder: 6
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
