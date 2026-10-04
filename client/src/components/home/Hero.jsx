import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, GraduationCap, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Hero({ profile, academic }) {
  const cgpa              = academic?.cgpa              || 3.95;
  const university        = academic?.university        || 'Debre Tabor University';
  const gradeDistribution = academic?.gradeDistribution || { aPlus: 31, aOrAbove: 46 };

  const fullName  = profile?.fullName   || 'Zelalem Birhan';
  const brandName = profile?.brandName  || 'ZED_Tutor';
  const tagline   = profile?.tagline    || 'University Gold Medalist · Ranked 1st at GIT · 3.95 CGPA';
  const title     = profile?.heroHeadline || profile?.title || 'Mathematics & Information Technology Tutor';
  const avatarUrl = profile?.avatarUrl  || '';
  const initials  = fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-academic-500/8 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-400/6 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Left column ── */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">

            {/* Name + brand — first thing the visitor reads */}
            <div className="animate-fade-in">
              <p className="text-academic-300 text-sm font-semibold tracking-widest uppercase">
                {brandName} · {fullName}
              </p>
            </div>

            {/* Credential ribbon — directly under the name */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-gold-500/30 bg-navy-900/80 backdrop-blur-sm animate-soft-pulse">
                <Award className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="text-gold-400 text-[13px] font-semibold tracking-wide">
                  {tagline}
                </span>
              </div>
            </div>

            {/* Main headline */}
            <div className="animate-fade-in-up delay-100">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white leading-[1.08] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                {profile?.heroHeadline ? (
                  title
                ) : (
                  <>
                    Mathematics &{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-academic-300 via-cyan-300 to-academic-400">
                      Information Technology
                    </span>{' '}
                    Tutor
                  </>
                )}
              </h1>
            </div>

            {/* Value proposition */}
            <p className="animate-fade-in-up delay-200 text-slate-300 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Empowering learners in{' '}
              <strong className="text-white font-semibold">Grades 5–12</strong> to build deep conceptual understanding, logical reasoning, and practical problem-solving in{' '}
              <strong className="text-white font-semibold">Mathematics, ICT, Programming, and Web Development</strong>.
            </p>

            {/* Credential chips */}
            <div className="animate-fade-in-up delay-300 flex flex-wrap justify-center lg:justify-start gap-3">
              {[
                { icon: CheckCircle, text: 'BSc Information Technology · GIT' },
                { icon: CheckCircle, text: 'University Gold Medalist · 3.95 CGPA' },
                { icon: CheckCircle, text: 'Grades 5–12 · Math & IT' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/7 border border-white/10 text-slate-300 text-xs font-medium">
                  <Icon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  {text}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                to="/contact#inquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-navy-950 bg-gold-500 hover:bg-gold-400 shadow-gold transition-all duration-200 active:scale-[0.98]"
                style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
              >
                Request Tutoring
                <ArrowRight className="w-4 h-4 text-navy-950" />
              </Link>
              <Link
                to="/academic-evidence"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-[15px] text-white bg-white/8 hover:bg-white/14 border border-white/15 transition-all duration-200"
              >
                <GraduationCap className="w-4 h-4 text-slate-400" />
                Explore Academic Evidence
              </Link>
            </div>

          </div>{/* end left column */}

          {/* ── Right: Credential card ── */}
          <div className="lg:col-span-5 flex justify-center animate-fade-in-up delay-300">
            <div className="w-full max-w-[400px] bg-navy-900/70 backdrop-blur-sm border border-white/10 rounded-3xl p-7 shadow-navy relative">

              {/* Verified badge */}
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500 shadow-gold text-navy-950 text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                Verified Record
              </div>

              {/* Profile header inside card */}
              <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-academic-500 to-academic-300 flex items-center justify-center text-white text-xl font-black shadow-lg flex-shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                    {fullName}
                  </h3>
                  <p className="text-gold-400 text-xs font-semibold mt-0.5">BSc in Information Technology</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{university} · GIT</p>
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="col-span-2 bg-gradient-to-br from-gold-500/15 to-gold-600/5 border border-gold-500/25 rounded-2xl p-4 text-center">
                  <span className="block text-[2.4rem] font-black text-gold-400 leading-none tabular-nums">{cgpa}</span>
                  <span className="text-[11px] font-semibold text-slate-300 mt-1 block">CGPA out of 4.00 · University Gold Medalist</span>
                </div>
                <div className="bg-white/6 border border-white/8 rounded-xl p-3.5 text-center">
                  <span className="block text-2xl font-black text-white leading-none">{gradeDistribution.aPlus}</span>
                  <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">A+ Grades</span>
                </div>
                <div className="bg-white/6 border border-white/8 rounded-xl p-3.5 text-center">
                  <span className="block text-2xl font-black text-white leading-none">{gradeDistribution.aOrAbove}<span className="text-base text-slate-400">/54</span></span>
                  <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">Grades A or Above</span>
                </div>
              </div>

              {/* Rank badge */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-academic-500/12 border border-academic-500/20">
                <div>
                  <span className="text-[11px] text-academic-300 font-semibold uppercase tracking-wider block">Rank</span>
                  <span className="text-sm font-bold text-white">1st at Gafat Institute of Technology</span>
                </div>
                <Link to="/tutoring" className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors">
                  View Subjects <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <p className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-academic-400" />
                All metrics backed by official university records
              </p>

            </div>
          </div>{/* end right column */}

        </div>
      </div>
    </section>
  );
}
