import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { en } from '../locales/en';
import { am } from '../locales/am';

const LanguageContext = createContext();

const STORAGE_KEY = 'zed_language';

const dictionaries = { en, am };

// Subject translations mapping for dynamic or fallback subjects
const SUBJECT_TRANSLATIONS = {
  'Mathematics': {
    name: 'ሂሳብ',
    category: 'ሂሳብ',
    shortDescription: 'ከመሰረታዊ ስሌት እስከ አልጀብራ አስተሳሰብ፣ ጂኦሜትሪ፣ ፈንክሽኖች እና ደረጃ በደረጃ ግልጽ የሆነ የፈተና ዝግጅት።',
    gradeRange: 'ከ5ኛ – 12ኛ ክፍል',
    topics: [
      'አልጀብራ እና አገላለጾች (Algebra & Expressions)',
      'የጠለል እና ጠጣር ጂኦሜትሪ (Plane & Solid Geometry)',
      'እኩልታዎች እና ኢ-እኩልታዎች (Equations & Inequalities)',
      'ፈንክሽኖች እና ግራፎች (Functions & Graphs)',
      'ትሪጎኖሜትሪ (Trigonometry)',
      'የፈተና ልምምድ እና የችግር አፈታት (Exam Practice & Problem Solving)'
    ]
  },
  'Computer / ICT': {
    name: 'ኮምፒውተር / አይሲቲ (ICT)',
    category: 'ኮምፒውተር / አይሲቲ',
    shortDescription: 'የኮምፒውተር አወቃቀር፣ የቢሮ መተግበሪያዎች፣ ኦፕሬቲንግ ሲስተሞች እና የኢንተርኔት ደህንነትን የሚያጠቃልል የተሟላ የዲጂታል ክህሎት።',
    gradeRange: 'ከ5ኛ – 12ኛ ክፍል',
    topics: [
      'የኮምፒውተር አወቃቀር (Computer Architecture)',
      'ኦፕሬቲንግ ሲስተሞች (Operating Systems)',
      'Word, Excel, PowerPoint',
      'የመሰረታዊ ኔትወርክ እውቀት (Networking Fundamentals)',
      'የዲጂታል ደህንነት እና ስነ-ምግባር (Digital Security & Ethics)'
    ]
  },
  'Programming Fundamentals': {
    name: 'የፕሮግራሚንግ መሰረታዊያን',
    category: 'ፕሮግራሚንግ',
    shortDescription: 'ለአጠቃቀም ምቹ በሆኑ እና በኢንዱስትሪው ተቀባይነት ባላቸው ቋንቋዎች የተደገፈ የአልጎሪዝም አስተሳሰብ፣ ችግሮችን የመተንተን እና የኮዲንግ ህጎችን የመረዳት ክህሎት።',
    gradeRange: 'ከ7ኛ – 12ኛ ክፍል',
    topics: [
      'ተለዋዋጮች እና ዳታ አይነቶች (Variables & Data Types)',
      'የቁጥጥር ፍሰት እና ድግግሞሾች (Control Flow & Loops)',
      'ፈንክሽኖች እና ሞጁላር ኮድ (Functions & Modular Code)',
      'መሰረታዊ አልጎሪዝሞች (Basic Algorithms)',
      'ስህተቶችን የመፈለግና የማረም ስልቶች (Debugging Strategies)'
    ]
  },
  'Programming': {
    name: 'የፕሮግራሚንግ መሰረታዊያን',
    category: 'ፕሮግራሚንግ',
    shortDescription: 'ለአጠቃቀም ምቹ በሆኑ እና በኢንዱስትሪው ተቀባይነት ባላቸው ቋንቋዎች የተደገፈ የአልጎሪዝም አስተሳሰብ፣ ችግሮችን የመተንተን እና የኮዲንግ ህጎችን የመረዳት ክህሎት።',
    gradeRange: 'ከ7ኛ – 12ኛ ክፍል',
    topics: [
      'ተለዋዋጮች እና ዳታ አይነቶች (Variables & Data Types)',
      'የቁጥጥር ፍሰት እና ድግግሞሾች (Control Flow & Loops)',
      'ፈንክሽኖች እና ሞጁላር ኮድ (Functions & Modular Code)',
      'መሰረታዊ አልጎሪዝሞች (Basic Algorithms)',
      'ስህተቶችን የመፈለግና የማረም ስልቶች (Debugging Strategies)'
    ]
  },
  'Web Development': {
    name: 'የድረ-ገጽ ግንባታ (Web Development)',
    category: 'ድረ-ገጽ ግንባታ',
    shortDescription: 'ተግባራዊ የድረ-ገጽ ንድፍ እና ግንባታ፡ የገጾች አወቃቀር፣ ለሁሉም ስክሪኖች የሚስማማ ስታይል (Responsive) እና ተለዋዋጭ የተጠቃሚ ግንኙነቶች።',
    gradeRange: 'ከ8ኛ – 12ኛ ክፍል',
    topics: [
      'የ HTML5 ትርጉም ያለው አወቃቀር (HTML5 Structure)',
      'CSS3 እና Responsive ዲዛይን',
      'የዘመናዊ ጃቫስክሪፕት (JavaScript) መሰረቶች',
      'ተግባራዊ እና ተለዋዋጭ ገጾችን መገንባት (Building Interactive Pages)'
    ]
  },
  'General Computer Skills': {
    name: 'አጠቃላይ የኮምፒውተር ክህሎቶች',
    category: 'አጠቃላይ የኮምፒውተር ክህሎቶች',
    shortDescription: 'ተማሪዎች፣ ወላጆች እና ጀማሪዎች ዘመናዊ ቴክኖሎጂዎችን እና ሶፍትዌሮችን በልበ-ሙሉነት እንዲጠቀሙ የሚያስችሉ አስፈላጊ ተግባራዊ ክህሎቶች።',
    gradeRange: 'ለሁሉም ክፍሎች እና ጀማሪዎች',
    topics: [
      'የፋይል አያያዝና አደረጃጀት (File Management & Organization)',
      'የኢንተርኔት ፍለጋና ምርምር ክህሎት (Internet Research Skills)',
      'አስተማማኝ የኦንላይን ትብብርና ግንኙነት (Safe Online Collaboration)',
      'ሶፍትዌር መጫንና ቴክኒካል ችግሮችን መፍታት (Software Installation & Troubleshooting)'
    ]
  }
};

// Topic translations dictionary
const TOPIC_TRANSLATIONS = {
  'Algebra & Expressions': 'አልጀብራ እና አገላለጾች (Algebra & Expressions)',
  'Plane & Solid Geometry': 'የጠለል እና ጠጣር ጂኦሜትሪ (Plane & Solid Geometry)',
  'Equations & Inequalities': 'እኩልታዎች እና ኢ-እኩልታዎች (Equations & Inequalities)',
  'Functions & Graphs': 'ፈንክሽኖች እና ግራፎች (Functions & Graphs)',
  'Trigonometry': 'ትሪጎኖሜትሪ (Trigonometry)',
  'Exam Practice & Problem Solving': 'የፈተና ልምምድ እና የችግር አፈታት (Exam Practice & Problem Solving)',
  'Computer Architecture': 'የኮምፒውተር አወቃቀር (Computer Architecture)',
  'Operating Systems': 'ኦፕሬቲንግ ሲስተሞች (Operating Systems)',
  'Word, Excel, PowerPoint': 'Word, Excel, PowerPoint',
  'Networking Fundamentals': 'የመሰረታዊ ኔትወርክ እውቀት (Networking Fundamentals)',
  'Digital Security & Ethics': 'የዲጂታል ደህንነት እና ስነ-ምግባር (Digital Security & Ethics)',
  'Variables & Data Types': 'ተለዋዋጮች እና ዳታ አይነቶች (Variables & Data Types)',
  'Control Flow & Loops': 'የቁጥጥር ፍሰት እና ድግግሞሾች (Control Flow & Loops)',
  'Functions & Modular Code': 'ፈንክሽኖች እና ሞጁላር ኮድ (Functions & Modular Code)',
  'Basic Algorithms': 'መሰረታዊ አልጎሪዝሞች (Basic Algorithms)',
  'Debugging Strategies': 'ስህተቶችን የመፈለግና የማረም ስልቶች (Debugging Strategies)',
  'HTML5 Semantic Structure': 'የ HTML5 ትርጉም ያለው አወቃቀር (HTML5 Structure)',
  'CSS3 & Responsive Design': 'CSS3 እና Responsive ዲዛይን',
  'Modern JavaScript Essentials': 'የዘመናዊ ጃቫስክሪፕት (JavaScript) መሰረቶች',
  'Building Interactive Pages': 'ተግባራዊ እና ተለዋዋጭ ገጾችን መገንባት (Building Interactive Pages)',
  'File Management & Organization': 'የፋይል አያያዝና አደረጃጀት (File Management)',
  'Internet Research Skills': 'የኢንተርኔት ፍለጋና ምርምር ክህሎት (Research Skills)',
  'Safe Online Collaboration': 'አስተማማኝ የኦንላይን ትብብርና ግንኙነት (Online Collaboration)',
  'Software Installation & Troubleshooting': 'ሶፍትዌር መጫንና ቴክኒካል ችግሮችን መፍታት (Troubleshooting)',
};

// Category translations
const CATEGORY_TRANSLATIONS = {
  'Awards & Recognition': 'ሽልማቶችና እውቅናዎች',
  'University': 'የዩኒቨርሲቲ',
  'National Examination': 'ብሔራዊ ፈተና',
  'Certificates & Training': 'ሰርተፊኬቶችና ስልጠናዎች',
  'Academic': 'አካዳሚክ',
  'Other': 'ሌሎች',
  'Mathematics': 'ሂሳብ',
  'Computer / ICT': 'ኮምፒውተር / አይሲቲ',
  'Programming': 'ፕሮግራሚንግ',
  'Web Development': 'ድረ-ገጽ ግንባታ',
  'General Computer Skills': 'አጠቃላይ የኮምፒውተር ክህሎቶች',
};

// Testimonial relationship translations
const RELATIONSHIP_TRANSLATIONS = {
  'Lecturer': 'የዩኒቨርሲቲ መምህር',
  'Academic Advisor': 'አካዳሚክ አማካሪ',
  'Project Supervisor': 'የፕሮጀክት ሱፐርቫይዘር',
  'Classmate': 'የትምህርት ባልደረባ',
  'Teacher': 'አስተማሪ',
  'Student': 'ተማሪ',
  'Parent': 'ወላጅ',
  'Employer/Colleague': 'አሰሪ / የስራ ባልደረባ',
  'Friend': 'ጓደኛ',
  'Other': 'ሌላ'
};

// Academic timeline milestones translation
const MILESTONE_TRANSLATIONS = {
  'Grade 12 National Examination': {
    year: 'የአካዳሚክ መሰረት',
    title: 'የ12ኛ ክፍል ብሔራዊ ፈተና',
    description: 'በሂሳብ 85/100 እና በአጠቃላይ 482 ውጤት በማስመዝገብ፣ በቁጥርና ሳይንሳዊ ትንተና የላቀ የቅድመ-ዩኒቨርሲቲ ብቃትን ማሳየት።'
  },
  'University Admission at GIT': {
    year: 'የመግቢያ ምዕራፍ',
    title: 'በጋፋት ቴክኖሎጂ ኢንስቲትዩት (GIT) መመዝገብ',
    description: 'በደብረ ታቦር ዩኒቨርሲቲ ጋፋት ቴክኖሎጂ ኢንስቲትዩት የኢንፎርሜሽን ቴክኖሎጂ የመጀመሪያ ዲግሪ (BSc) ትምህርትን መጀመር።'
  },
  'Mathematical Rigor & Core Computing': {
    year: 'ዋናው የአካዳሚክ እድገት',
    title: 'ጥልቅ የሂሳብና የኮምፒውተር ሳይንስ ትምህርት',
    description: 'የሂሳብ አመክንዮ፣ አልጎሪዝም፣ የዳታቤዝ ሲስተሞች፣ ኔትወርክ እና የሲስተም አናሊሲስን በተከታታይ የላቀ ውጤት ጠንቅቆ ማወቅ።'
  },
  'Major Systems Engineering Period': {
    year: 'የመመረቂያ ዓመት ማይልስቶን',
    title: 'የተግባራዊ ሲስተሞች ኢንጂነሪንግ ወቅት',
    description: 'የላቀ ውጤትን አስጠብቆ በመቆየት የድረ-ገጽ ኢ-ለርኒንግ ማኔጅመንት ሲስተም፣ የኦንላይን ፈተና ማኔጅመንት ሲስተም እና የደብረ ታቦር ገበያ ኢ-ኮሜርስን መገንባት።'
  },
  'Graduation & University Gold Medal': {
    year: 'ከፍተኛው ክብር',
    title: 'ምረቃ እና የዩኒቨርሲቲው የወርቅ ሜዳሊያ',
    description: 'በ 3.95/4.00 CGPA በመመረቅ ከጋፋት ቴክኖሎጂ ኢንስቲትዩት 1ኛ ደረጃን ይዞ ማጠናቀቅ እና የዩኒቨርሲቲውን የወርቅ ሜዳሊያ መሸለም።'
  },
  'ZED_Tutor Launch': {
    year: 'የማስተማርና የማብቃት አገልግሎት',
    title: 'የ ZED_Tutor ምረቃና ጅምር',
    description: 'ከ5ኛ – 12ኛ ክፍል ላሉ ተማሪዎች በሂሳብ፣ አይሲቲ እና ፕሮግራሚንግ የተደራጀና በማስረጃ ላይ የተመሰረተ የማስተማር አገልግሎት ለመስጠት ZED_Tutorን ማቋቋም።'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'am' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang) => {
    if (lang !== 'en' && lang !== 'am') return;
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'am') {
      document.body.classList.add('font-amharic');
    } else {
      document.body.classList.remove('font-amharic');
    }
  }, [language]);

  // Nested translation helper with parameter interpolation
  const t = useMemo(() => {
    return (path, params = {}, fallback = '') => {
      const dict = dictionaries[language] || en;
      const keys = path.split('.');
      let current = dict;
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          // fallback to English
          let enCurrent = en;
          for (const ek of keys) {
            if (enCurrent && typeof enCurrent === 'object' && ek in enCurrent) {
              enCurrent = enCurrent[ek];
            } else {
              enCurrent = null;
              break;
            }
          }
          current = enCurrent !== null ? enCurrent : (fallback || path);
          break;
        }
      }

      if (typeof current !== 'string') return current || fallback || path;

      // Parameter replacement {key}
      let result = current;
      if (params && typeof params === 'object') {
        Object.entries(params).forEach(([key, val]) => {
          result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
        });
      }
      return result;
    };
  }, [language]);

  // Localize a subject object or string safely
  const localizeSubject = useMemo(() => {
    return (subject) => {
      if (!subject) return subject;
      if (language !== 'am') return subject;

      // Handle string input directly
      if (typeof subject === 'string') {
        const tr = SUBJECT_TRANSLATIONS[subject] ||
          Object.entries(SUBJECT_TRANSLATIONS).find(([k]) => k.toLowerCase() === subject.toLowerCase())?.[1];
        return tr?.name || subject;
      }

      const translation = SUBJECT_TRANSLATIONS[subject.name] || SUBJECT_TRANSLATIONS[subject.category];
      if (!translation) {
        return {
          ...subject,
          topics: subject.topics ? subject.topics.map(t => TOPIC_TRANSLATIONS[t] || t) : subject.topics
        };
      }

      return {
        ...subject,
        name: translation.name || subject.name,
        category: translation.category || subject.category,
        shortDescription: translation.shortDescription || subject.shortDescription,
        gradeRange: translation.gradeRange || subject.gradeRange,
        topics: translation.topics || (subject.topics ? subject.topics.map(t => TOPIC_TRANSLATIONS[t] || t) : subject.topics)
      };
    };
  }, [language]);

  // Localize individual topic string
  const localizeTopic = useMemo(() => {
    return (topic) => {
      if (!topic) return topic;
      if (language !== 'am') return topic;
      return TOPIC_TRANSLATIONS[topic] || topic;
    };
  }, [language]);

  // Localize category names
  const localizeCategory = useMemo(() => {
    return (category) => {
      if (!category) return category;
      if (language !== 'am') return category;
      return CATEGORY_TRANSLATIONS[category] || category;
    };
  }, [language]);

  // Localize grade label (e.g. "Grade 5" -> "5ኛ ክፍል", "Grades 5–12" -> "ከ5ኛ – 12ኛ ክፍል")
  const localizeGrade = useMemo(() => {
    return (gradeLabel) => {
      if (!gradeLabel) return gradeLabel;
      if (language !== 'am') return gradeLabel;

      const rangeMatch = gradeLabel.match(/(\d+)\s*[-–—to]+\s*(\d+)/i);
      if (rangeMatch) {
        return `ከ${rangeMatch[1]}ኛ – ${rangeMatch[2]}ኛ ክፍል`;
      }

      const match = gradeLabel.match(/\d+/);
      if (match) {
        return `${match[0]}ኛ ክፍል`;
      }
      if (gradeLabel.toLowerCase().includes('all')) return 'ለሁሉም ክፍሎች';
      return gradeLabel;
    };
  }, [language]);

  // Localize relationship names
  const localizeRelationship = useMemo(() => {
    return (rel) => {
      if (!rel) return rel;
      if (language !== 'am') return rel;
      return RELATIONSHIP_TRANSLATIONS[rel] || rel;
    };
  }, [language]);

  // Localize academic timeline milestone
  const localizeMilestone = useMemo(() => {
    return (m) => {
      if (!m) return m;
      if (language !== 'am') return m;
      const tr = MILESTONE_TRANSLATIONS[m.title] ||
        Object.entries(MILESTONE_TRANSLATIONS).find(([k]) => k.toLowerCase() === m.title?.toLowerCase())?.[1];
      if (!tr) return m;
      return {
        ...m,
        year: tr.year || m.year,
        title: tr.title || m.title,
        description: tr.description || m.description
      };
    };
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    isAmharic: language === 'am',
    localizeSubject,
    localizeTopic,
    localizeCategory,
    localizeGrade,
    localizeRelationship,
    localizeMilestone
  }), [language, t, localizeSubject, localizeTopic, localizeCategory, localizeGrade, localizeRelationship, localizeMilestone]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
