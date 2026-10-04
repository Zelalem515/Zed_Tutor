import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { GraduationCap, Award, BookOpen, Code2, Cpu, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AcademicJourneyPage() {
  const [academic, setAcademic] = useState(null);

  useEffect(() => {
    async function load() {
      const a = await api.getAcademic();
      setAcademic(a);
    }
    load();
  }, []);

  const steps = [
    {
      step: '01',
      period: 'Secondary School Foundation',
      title: 'Grade 12 National Examination',
      subtitle: 'Quantitative Foundation & University Entrance',
      description: 'Scored 85/100 in Mathematics and an overall score of 482, demonstrating exceptional early aptitude in quantitative reasoning and securing direct placement into higher education.',
      icon: GraduationCap,
      badge: 'Math: 85/100 • Total: 482',
      color: 'blue'
    },
    {
      step: '02',
      period: 'University Admission',
      title: 'Enrollment at Gafat Institute of Technology (GIT)',
      subtitle: 'Debre Tabor University, Ethiopia',
      description: 'Commenced the Bachelor of Science in Information Technology, immersing in core discrete mathematics, calculus for natural sciences, and computer science foundations.',
      icon: BookOpen,
      badge: 'Gafat Institute of Technology',
      color: 'slate'
    },
    {
      step: '03',
      period: 'Core Academic Growth',
      title: 'BSc Information Technology Program',
      subtitle: 'Rigorous Analytical & Computational Training',
      description: 'Mastered mathematical reasoning, data structures, algorithms, database architectures, and networking. Built consistent academic momentum across 54 university courses.',
      icon: Code2,
      badge: '31 A+ Courses • 46 A/A+',
      color: 'academic'
    },
    {
      step: '04',
      period: 'Practical Systems Development',
      title: 'Final-Year Project Period & System Engineering',
      subtitle: 'Hands-on Real-World Architecture',
      description: 'Engineered three major academic systems: Web-Based E-Learning Management System, Online Examination Management System, and Debre Tabor Gebeya E-Commerce, while sustaining flawless academic standing.',
      icon: Cpu,
      badge: '3 Major Platforms Built',
      color: 'indigo'
    },
    {
      step: '05',
      period: 'Highest Academic Honor',
      title: 'Graduation & University Gold Medalist',
      subtitle: 'Ranked 1st at Gafat Institute of Technology',
      description: 'Graduated with a final 3.95 / 4.00 CGPA, ranked 1st across Gafat Institute of Technology, and was formally awarded the University Gold Medal at convocation.',
      icon: Award,
      badge: 'CGPA: 3.95 • Rank 1st GIT',
      color: 'gold'
    },
    {
      step: '06',
      period: 'Knowledge Sharing & Mentorship',
      title: 'Launch of ZED_Tutor',
      subtitle: 'Evidence-Based Mentorship for Grades 5–12',
      description: 'Founded ZED_Tutor to bridge academic discipline, mathematical intuition, and practical computing skills for secondary and preparatory students.',
      icon: Sparkles,
      badge: 'Grades 5–12 Mentorship',
      color: 'emerald'
    }
  ];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>High-Level Academic Timeline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            My Academic Journey
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            A high-level progression from early national examination distinction to university top rank, system engineering, and dedicated tutoring.
          </p>
        </div>

        {/* Quick Progression Flow Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hidden md:flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span>
            <span>Grade 12 Exam</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">2</span>
            <span>GIT Admission</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-academic-100 text-academic-700 flex items-center justify-center font-bold">3</span>
            <span>BSc IT Studies</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">4</span>
            <span>Final-Year Projects</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">5</span>
            <span>Gold Medal (3.95)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">6</span>
            <span>ZED_Tutor</span>
          </div>
        </div>

        {/* High-Level Timeline */}
        <div className="relative border-l-2 border-academic-200 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10 py-2">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div className={`absolute -left-[37px] sm:-left-[53px] top-1.5 w-8 h-8 rounded-full bg-white border-4 border-academic-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <span className="w-2 h-2 rounded-full bg-academic-600"></span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-academic-600 uppercase tracking-wider px-3 py-1 rounded-full bg-academic-50 border border-academic-100">
                      Phase {item.step} • {item.period}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-navy-950">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {item.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credibility Callout */}
        <div className="bg-gradient-to-r from-navy-950 to-navy-900 rounded-2xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Inspect the Verified Evidence</h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Every milestone is verified through university records, official convocation awards, and national examination certificates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/academic-evidence"
              className="px-5 py-3 rounded-xl font-bold text-xs text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <span>View Academic Evidence</span>
              <ArrowRight className="w-4 h-4 text-navy-950" />
            </Link>
            <Link
              to="/certificates"
              className="px-5 py-3 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <span>Download Certificates</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
