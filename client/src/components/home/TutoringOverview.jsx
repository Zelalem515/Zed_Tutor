import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Monitor, Code2, Globe, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
  'Mathematics':             BookOpen,
  'Computer / ICT':          Monitor,
  'Programming':             Code2,
  'Web Development':         Globe,
  'General Computer Skills': Cpu,
  'Other':                   BookOpen,
};

// Consistent two-tone accent — icon background and border only, not text color all over
const CATEGORY_ACCENTS = {
  'Mathematics':             { iconBg: 'bg-academic-50 border-academic-100', iconColor: 'text-academic-600' },
  'Computer / ICT':          { iconBg: 'bg-sky-50 border-sky-100',           iconColor: 'text-sky-600'      },
  'Programming':             { iconBg: 'bg-indigo-50 border-indigo-100',     iconColor: 'text-indigo-600'   },
  'Web Development':         { iconBg: 'bg-emerald-50 border-emerald-100',   iconColor: 'text-emerald-600'  },
  'General Computer Skills': { iconBg: 'bg-amber-50 border-amber-100',       iconColor: 'text-amber-600'    },
  'Other':                   { iconBg: 'bg-slate-50 border-slate-200',       iconColor: 'text-slate-500'    },
};

const FALLBACK_SUBJECTS = [
  { _id: '1', name: 'Mathematics',            category: 'Mathematics',             shortDescription: 'From arithmetic and algebra to geometry, functions, and national exam preparation.', gradeRange: 'Grades 5–12', topics: ['Algebra & Equations', 'Geometry & Proofs', 'Functions & Graphs', 'Trigonometry', 'Exam Strategies'] },
  { _id: '2', name: 'Computer / ICT',         category: 'Computer / ICT',          shortDescription: 'Digital literacy: hardware, operating systems, and productivity software.', gradeRange: 'Grades 5–12', topics: ['Computer Architecture', 'Word, Excel & PowerPoint', 'Internet Safety', 'Networking'] },
  { _id: '3', name: 'Programming Fundamentals', category: 'Programming',           shortDescription: 'Algorithmic thinking, logic, and foundational programming skills.', gradeRange: 'Grades 7–12', topics: ['Variables & Flow Control', 'Loops & Functions', 'Algorithmic Thinking', 'Debugging'] },
  { _id: '4', name: 'Web Development',        category: 'Web Development',         shortDescription: 'Hands-on website building using HTML, CSS, and JavaScript.', gradeRange: 'Grades 8–12', topics: ['HTML5 Structure', 'CSS3 & Responsive Styling', 'JavaScript Logic', 'Interactive Projects'] },
  { _id: '5', name: 'General Computer Skills', category: 'General Computer Skills', shortDescription: 'Practical digital skills for students and beginners.', gradeRange: 'All Grades', topics: ['File Management', 'Research Skills', 'Safe Collaboration', 'Troubleshooting'] },
];

export default function TutoringOverview({ subjects }) {
  const displaySubjects = subjects && subjects.length > 0 ? subjects : FALLBACK_SUBJECTS;

  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="section-label">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Grades 5–12</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              What I Teach
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Each subject is structured around the Ethiopian national curriculum and extended with
              practical application to build real understanding — not just exam results.
            </p>
          </div>
          <Link to="/tutoring" className="link-arrow flex-shrink-0">
            <span>Full curriculum details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Subject cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displaySubjects.map((sub) => {
            const Icon   = CATEGORY_ICONS[sub.category]   || BookOpen;
            const accent = CATEGORY_ACCENTS[sub.category] || CATEGORY_ACCENTS['Other'];
            return (
              <div key={sub._id} className="card-hover hover-lift flex flex-col">
                <div className="p-6 flex-1 space-y-4">
                  {/* Icon + grade range */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${accent.iconBg}`}>
                      <Icon className={`w-5 h-5 ${accent.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
                      {sub.gradeRange || 'Grades 5–12'}
                    </span>
                  </div>

                  {/* Name + description */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy-950 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                      {sub.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1.5">{sub.shortDescription}</p>
                  </div>

                  {/* Topic tags */}
                  {sub.topics && sub.topics.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {sub.topics.slice(0, 4).map((topic, idx) => (
                          <span key={idx} className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <span className={`w-1 h-1 rounded-full mr-1.5 ${accent.iconColor.replace('text-', 'bg-')}`} />
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Online & In-person</span>
                  <Link to="/contact#inquiry" className="link-arrow text-xs">
                    Request Tutoring <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
