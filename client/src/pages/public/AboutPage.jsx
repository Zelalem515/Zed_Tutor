import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Award, BookOpen, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [academic, setAcademic] = useState(null);

  useEffect(() => {
    async function load() {
      const [p, a] = await Promise.all([api.getProfile(), api.getAcademic()]);
      setProfile(p);
      setAcademic(a);
    }
    load();
  }, []);

  const milestones = academic?.timelineMilestones || [];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Journey</span>
          </div>
          <h1 className="text-4xl font-extrabold text-navy-950 tracking-tight">
            About Zelalem Birhan
          </h1>
          <p className="text-slate-600 text-lg">
            From National Examination excellence to University Gold Medalist and dedicated academic tutor.
          </p>
        </div>

        {/* Bio Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-16 space-y-6">
          <h2 className="text-2xl font-bold text-navy-950">Academic & Professional Background</h2>
          <p className="text-slate-700 leading-relaxed text-base">
            {profile?.fullBio || profile?.shortBio}
          </p>
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="block text-2xl font-bold text-navy-950">{academic?.cgpa || '3.95'}</span>
              <span className="text-xs text-slate-500">CGPA / 4.00</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="block text-2xl font-bold text-amber-600">{academic?.rank ? 'Ranked 1st' : 'Ranked 1st'}</span>
              <span className="text-xs text-slate-500">GIT Gold Medalist</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="block text-2xl font-bold text-academic-600">Grades 5–12</span>
              <span className="text-xs text-slate-500">Tutoring Scope</span>
            </div>
          </div>
        </div>

        {/* High-level Academic Timeline */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-950">High-Level Academic Milestones</h2>
            <p className="text-sm text-slate-500 mt-1">A transparent progression of academic development</p>
          </div>

          <div className="relative border-l-2 border-academic-200 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10 py-4">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-academic-600 group-hover:scale-125 transition-transform" />
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-academic-600 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-academic-50">
                      {m.year}
                    </span>
                    <Award className="w-4 h-4 text-gold-500" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-950 mb-1">{m.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/academic-journey"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-navy-900 hover:bg-navy-800 transition-colors shadow-sm"
          >
            <span>Full Academic Journey & Timeline</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </Link>
          <Link
            to="/academic-evidence"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm text-academic-600 hover:bg-academic-50 border border-academic-200 transition-colors"
          >
            <span>Academic Evidence & Statistics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/tutoring"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <span>Explore Tutoring Subjects</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
