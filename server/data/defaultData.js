const defaultProfile = {
  fullName: 'Zelalem Birhan',
  brandName: 'ZED_Tutor',
  title: 'Mathematics & Information Technology Tutor',
  tagline: 'University Gold Medalist | 3.95 CGPA | Ranked 1st at GIT',
  shortBio: 'Information Technology graduate from Debre Tabor University (Gafat Institute of Technology), Ethiopia. Passionate about empowering learners in Grades 5–12 to master Mathematics, Computer/ICT, Programming, and Web Development through conceptual understanding and structured problem-solving.',
  fullBio: 'Graduated as the University Gold Medalist and 1st ranked at Gafat Institute of Technology with a 3.95/4.00 CGPA across 54 courses. My university education developed deep mathematical reasoning, analytical thinking, software development, database systems, and networking. Alongside high academic performance, I engineered major systems including a Web-Based E-Learning Management System and an Online Examination System. As an educator, my focus is cultivating genuine logical thinking, building academic confidence, and fostering independent learning habits.',
  avatarUrl: '',
  itPortfolioUrl: 'https://zelalem-birhan.vercel.app/',
  heroHeadline: '',
  availability: 'Available for new students — online and in-person (Debre Tabor area)',
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

const defaultAcademic = {
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
    {
      name: 'Mathematics for Natural Science',
      grade: 'A+',
      category: 'Pure & Applied Mathematics'
    },
    {
      name: 'Applied Mathematics I',
      grade: 'A+',
      category: 'Pure & Applied Mathematics'
    },
    {
      name: 'Discrete Mathematics',
      grade: 'A',
      category: 'Foundations of Computer Science'
    },
    {
      name: 'Introduction to Statistics',
      grade: 'A+',
      category: 'Probability & Quantitative Analysis'
    }
  ],
  timelineMilestones: [
    {
      title: 'Grade 12 National Examination',
      year: 'Academic Foundation',
      description: 'Achieved 85/100 in Mathematics and an overall score of 482, demonstrating exceptional early aptitude for quantitative science.',
      iconName: 'GraduationCap'
    },
    {
      title: 'University Admission at GIT',
      year: 'Foundation Phase',
      description: 'Commenced Bachelor of Science in Information Technology at Gafat Institute of Technology, Debre Tabor University.',
      iconName: 'BookOpen'
    },
    {
      title: 'Mathematical Rigor & Core Computing',
      year: 'Core Development',
      description: 'Mastered mathematical reasoning, algorithms, database systems, networking, and system analysis with consistent high honors.',
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

const defaultSubjects = [
  {
    name: 'Mathematics',
    category: 'Mathematics',
    shortDescription: 'From fundamental arithmetic to algebraic reasoning, geometry, functions, and exam preparation with step-by-step clarity.',
    gradeRange: 'Grades 5–12',
    topics: ['Algebra & Expressions', 'Plane & Solid Geometry', 'Equations & Inequalities', 'Functions & Graphs', 'Trigonometry', 'Exam Practice & Problem Solving'],
    displayOrder: 1,
    isActive: true
  },
  {
    name: 'Computer / ICT',
    category: 'Computer / ICT',
    shortDescription: 'Complete digital fluency covering computer architecture, productivity tools, operating systems, and internet safety.',
    gradeRange: 'Grades 5–12',
    topics: ['Computer Architecture', 'Operating Systems', 'Word, Excel, PowerPoint', 'Networking Fundamentals', 'Digital Security & Ethics'],
    displayOrder: 2,
    isActive: true
  },
  {
    name: 'Programming Fundamentals',
    category: 'Programming',
    shortDescription: 'Core algorithmic thinking, problem decomposition, and syntax mastery in beginner-friendly and industry-standard languages.',
    gradeRange: 'Grades 7–12',
    topics: ['Variables & Data Types', 'Control Flow & Loops', 'Functions & Modular Code', 'Basic Algorithms', 'Debugging Strategies'],
    displayOrder: 3,
    isActive: true
  },
  {
    name: 'Web Development',
    category: 'Web Development',
    shortDescription: 'Hands-on website design and development: structuring pages, responsive styling, and dynamic interactive behavior.',
    gradeRange: 'Grades 8–12',
    topics: ['HTML5 Semantic Structure', 'CSS3 & Responsive Design', 'Modern JavaScript Essentials', 'Building Interactive Pages'],
    displayOrder: 4,
    isActive: true
  },
  {
    name: 'General Computer Skills',
    category: 'General Computer Skills',
    shortDescription: 'Essential practical skills for students, parents, and beginners to navigate modern technology and software tools confidently.',
    gradeRange: 'All Grades & Beginners',
    topics: ['File Management & Organization', 'Internet Research Skills', 'Safe Online Collaboration', 'Software Installation & Troubleshooting'],
    displayOrder: 5,
    isActive: true
  }
];

const defaultGrades = [
  { label: 'Grade 5', numericValue: 5, isActive: true, displayOrder: 1 },
  { label: 'Grade 6', numericValue: 6, isActive: true, displayOrder: 2 },
  { label: 'Grade 7', numericValue: 7, isActive: true, displayOrder: 3 },
  { label: 'Grade 8', numericValue: 8, isActive: true, displayOrder: 4 },
  { label: 'Grade 9', numericValue: 9, isActive: true, displayOrder: 5 },
  { label: 'Grade 10', numericValue: 10, isActive: true, displayOrder: 6 },
  { label: 'Grade 11', numericValue: 11, isActive: true, displayOrder: 7 },
  { label: 'Grade 12', numericValue: 12, isActive: true, displayOrder: 8 }
];

const defaultCertificates = [
  {
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

const defaultTestimonials = [
  {
    authorName: 'Senior Lecturer, IT Department',
    relationship: 'Lecturer',
    organization: 'Debre Tabor University (GIT)',
    message: 'Zelalem demonstrated unparalleled analytical rigor, discipline, and clarity in all coursework. His capability to break down complex mathematical and computing problems into transparent steps was already evident during seminars and discussions.',
    status: 'APPROVED',
    isVerifiedWitness: true,
    displayOrder: 1
  },
  {
    authorName: 'Academic Project Supervisor',
    relationship: 'Project Supervisor',
    organization: 'Gafat Institute of Technology',
    message: 'Supervising Zelalem during his final year project confirmed his rare combination of strong theoretical foundations and practical software architecture. He delivers with exceptional attention to detail.',
    status: 'APPROVED',
    isVerifiedWitness: true,
    displayOrder: 2
  },
  {
    authorName: 'Classmate & Study Partner',
    relationship: 'Classmate',
    organization: 'BSc IT Class of 2024',
    message: 'Whenever someone in our department struggled with discrete mathematics or algorithms, Zelalem was the one who could explain the intuition in a way that simply made sense. He is patient, structured, and genuine.',
    status: 'APPROVED',
    isVerifiedWitness: true,
    displayOrder: 3
  }
];

module.exports = {
  defaultProfile,
  defaultAcademic,
  defaultSubjects,
  defaultGrades,
  defaultCertificates,
  defaultTestimonials
};
