import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, ArrowRight, User, GraduationCap, Lightbulb } from 'lucide-react';

export default function AboutSection({ profile }) {
  const shortBio  = profile?.shortBio || 'Information Technology graduate from Debre Tabor University (Gafat Institute of Technology), Ethiopia. Passionate about empowering learners in Grades 5–12 to master Mathematics, Computer/ICT, Programming, and Web Development through conceptual understanding and structured problem-solving.';
  const avatarUrl = profile?.avatarUrl || '';
  const fullName  = profile?.fullName  || 'Zelalem Birhan';
  const initials  = fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Left: Profile visual ── */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[380px]">
              {/* Decorative background blob */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-academic-100 to-academic-50 rounded-3xl opacity-60" />

              <div className="relative bg-navy-950 rounded-2xl overflow-hidden border border-white/5 p-8 text-center text-white shadow-navy">
                {/* Avatar */}
                <div className="mx-auto w-32 h-32 rounded-2xl bg-gradient-to-tr from-academic-600 to-academic-400 flex items-center justify-center text-white font-black text-3xl shadow-lg border-2 border-gold-400/30 mb-5 overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                  {fullName}
                </h3>
                <p className="text-gold-400 text-sm font-semibold mt-1">BSc Information Technology</p>
                <p className="text-slate-400 text-xs mt-0.5">Debre Tabor University · GIT</p>

                {/* Identity tags */}
                <div className="mt-6 pt-5 border-t border-white/8 space-y-2.5 text-left">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Award className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>University Gold Medalist & Ranked 1st at GIT</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <GraduationCap className="w-4 h-4 text-academic-400 flex-shrink-0" />
                    <span>3.95 CGPA across 54 university courses</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Tutoring Grades 5–12 in Math & IT</span>
                  </div>
                </div>

                <div className="mt-5">
                  <Link to="/about" className="inline-flex items-center gap-1.5 text-xs font-semibold text-academic-400 hover:text-academic-300 transition-colors">
                    Full biography & journey <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Narrative ── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="section-label">
                <User className="w-3.5 h-3.5" />
                <span>About Zelalem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                An Academic Foundation Built for Meaningful Teaching
              </h2>
            </div>

            <p className="text-slate-600 text-base leading-relaxed">{shortBio}</p>

            {/* Two feature points */}
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-academic-50 border border-academic-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-academic-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                    Dual Expertise: Mathematical Logic & Applied IT
                  </h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    University training spanning abstract mathematics, algorithms, database systems, and software engineering. This lets me teach mathematics not as isolated formulas, but as a logical framework connected to real computing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                    Focus on Independent Understanding
                  </h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Good tutoring builds independence, not dependency. My goal is for every student to understand the reasoning behind the answer — so they can solve problems they haven't seen before.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/about" className="btn-dark">
                Full Biography & Timeline
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
              <Link to="/tutoring" className="btn-secondary">
                View Tutoring Subjects
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
