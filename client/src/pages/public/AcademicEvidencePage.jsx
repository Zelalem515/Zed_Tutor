import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../api/client';
import { BookCheck, Award, TrendingUp, Star, FileText, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated counter hook — counts up from 0 to target when element enters viewport
function useAnimatedCounter(target, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration, decimals]);

  return { value, ref };
}

// Animated bar — fills from 0 to targetPct when in view
function AnimatedBar({ targetPct, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(targetPct), delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [targetPct, delay]);

  return (
    <div ref={ref} className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// Individual stat card with animated counter
function StatCard({ target, decimals, suffix, prefix, label, sublabel, accent, icon: Icon }) {
  const { value, ref } = useAnimatedCounter(target, 1400, decimals);
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl border ${accent.border} shadow-sm p-6 flex flex-col items-center text-center space-y-2 hover:shadow-md transition-shadow`}
    >
      <div className={`w-11 h-11 rounded-xl ${accent.iconBg} flex items-center justify-center mb-1`}>
        <Icon className={`w-5 h-5 ${accent.iconColor}`} />
      </div>
      <span className={`text-4xl sm:text-5xl font-black ${accent.textColor} leading-none tabular-nums`}>
        {prefix}{decimals > 0 ? value.toFixed(decimals) : value}{suffix}
      </span>
      <span className={`text-xs font-bold uppercase tracking-wider ${accent.labelColor}`}>{label}</span>
      {sublabel && <span className="text-[11px] text-slate-400">{sublabel}</span>}
    </div>
  );
}

export default function AcademicEvidencePage() {
  const [academic, setAcademic] = useState(null);

  useEffect(() => {
    async function load() {
      const a = await api.getAcademic();
      setAcademic(a);
    }
    load();
  }, []);

  const gradeDist = academic?.gradeDistribution || { aPlus: 31, a: 15, aMinus: 5, bPlus: 3, aOrAbove: 46 };
  const nationalExam = academic?.nationalExam || { mathScore: 85, mathMax: 100, overallScore: 482 };
  const highlighted = academic?.highlightedCourses || [];
  const total = 54;

  // Grade bar chart data
  const gradeRows = [
    {
      label: 'A+',
      count: gradeDist.aPlus,
      pct: Math.round((gradeDist.aPlus / total) * 100),
      barColor: 'bg-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      delay: 0
    },
    {
      label: 'A',
      count: gradeDist.a,
      pct: Math.round((gradeDist.a / total) * 100),
      barColor: 'bg-academic-500',
      badgeColor: 'bg-academic-100 text-academic-800',
      delay: 120
    },
    {
      label: 'A−',
      count: gradeDist.aMinus,
      pct: Math.round((gradeDist.aMinus / total) * 100),
      barColor: 'bg-sky-500',
      badgeColor: 'bg-sky-100 text-sky-800',
      delay: 240
    },
    {
      label: 'B+',
      count: gradeDist.bPlus,
      pct: Math.round((gradeDist.bPlus / total) * 100),
      barColor: 'bg-amber-400',
      badgeColor: 'bg-amber-100 text-amber-800',
      delay: 360
    }
  ];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
            <BookCheck className="w-3.5 h-3.5" />
            <span>Verifiable Academic Record</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            Academic Evidence & Credibility
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Evidence-backed transparency. Every statistic reflects official records from Debre Tabor University and the National Examination Agency.
          </p>
        </div>

        {/* ── Top-level Credential Banner ── */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-2xl p-6 sm:p-8 text-white border border-navy-800 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Gold medal badge */}
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-xl shadow-gold-500/30">
              <Award className="w-9 h-9 text-navy-950" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <p className="text-gold-400 text-xs font-bold uppercase tracking-widest">Highest Academic Honor</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">University Gold Medalist</h2>
              <p className="text-slate-300 text-sm">
                Ranked <strong className="text-white">1st at Gafat Institute of Technology</strong> — Debre Tabor University,
                with a <strong className="text-white">3.95 / 4.00 CGPA</strong> across 54 courses.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center space-y-1 px-6 py-4 rounded-xl bg-navy-800 border border-navy-700">
              <span className="text-4xl font-black text-gold-400 tabular-nums">3.95</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CGPA / 4.00</span>
            </div>
          </div>
        </div>

        {/* ── Animated Stat Cards ── */}
        <div>
          <h2 className="text-xl font-bold text-navy-950 mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-academic-600" />
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              target={3.95} decimals={2} suffix="" prefix=""
              label="CGPA" sublabel="out of 4.00"
              accent={{ border: 'border-gold-200', iconBg: 'bg-gold-50', iconColor: 'text-gold-600', textColor: 'text-gold-600', labelColor: 'text-slate-500' }}
              icon={Award}
            />
            <StatCard
              target={31} decimals={0} suffix="" prefix=""
              label="A+ Grades" sublabel={`${Math.round((31/54)*100)}% of all courses`}
              accent={{ border: 'border-emerald-200', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', textColor: 'text-emerald-600', labelColor: 'text-slate-500' }}
              icon={Star}
            />
            <StatCard
              target={46} decimals={0} suffix="/54" prefix=""
              label="Grades A or Above" sublabel="≈ 85.2% of courses"
              accent={{ border: 'border-academic-200', iconBg: 'bg-academic-50', iconColor: 'text-academic-600', textColor: 'text-academic-600', labelColor: 'text-slate-500' }}
              icon={TrendingUp}
            />
            <StatCard
              target={85} decimals={0} suffix="/100" prefix=""
              label="Grade 12 Math" sublabel="National Examination"
              accent={{ border: 'border-sky-200', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', textColor: 'text-sky-600', labelColor: 'text-slate-500' }}
              icon={GraduationCap}
            />
          </div>
        </div>

        {/* ── Grade Distribution Chart ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-7 py-5 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-navy-950">Full 54-Course Grade Distribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Official academic record — Debre Tabor University</p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 whitespace-nowrap">
              46 / 54 courses ≥ A (85.2%)
            </span>
          </div>

          <div className="p-7 space-y-5">
            {gradeRows.map((row) => (
              <div key={row.label} className="flex items-center gap-4">
                {/* Grade badge */}
                <span className={`w-12 text-center text-sm font-black rounded-lg px-2 py-1 ${row.badgeColor} flex-shrink-0`}>
                  {row.label}
                </span>
                {/* Animated bar */}
                <div className="flex-1">
                  <AnimatedBar targetPct={row.pct} color={row.barColor} delay={row.delay} />
                </div>
                {/* Count + pct */}
                <div className="w-20 text-right flex-shrink-0">
                  <span className="text-sm font-bold text-navy-950">{row.count}</span>
                  <span className="text-xs text-slate-400 ml-1">({row.pct}%)</span>
                </div>
              </div>
            ))}

            {/* Summary row */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[120px] bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <span className="block text-2xl font-black text-emerald-700">{gradeDist.aOrAbove}</span>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Courses A or Above</span>
              </div>
              <div className="flex-1 min-w-[120px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="block text-2xl font-black text-slate-700">{total}</span>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Courses</span>
              </div>
              <div className="flex-1 min-w-[120px] bg-academic-50 border border-academic-100 rounded-xl p-4 text-center">
                <span className="block text-2xl font-black text-academic-700">≈85.2%</span>
                <span className="text-[11px] font-bold text-academic-800 uppercase tracking-wider">At or Above A</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── National Examination ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-5">
          <h2 className="text-xl font-bold text-navy-950">Grade 12 National Examination</h2>
          <p className="text-sm text-slate-500">
            Results issued by the <strong>National Educational Assessment and Examinations Agency (NEAEA)</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-sky-50 border border-sky-100 flex flex-col gap-1">
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Mathematics Score</span>
              <span className="text-3xl font-black text-sky-700 tabular-nums">
                {nationalExam.mathScore} <span className="text-base font-bold text-sky-400">/ {nationalExam.mathMax}</span>
              </span>
              <div className="mt-2">
                <AnimatedBar targetPct={nationalExam.mathScore} color="bg-sky-500" delay={200} />
              </div>
            </div>
            <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col gap-1">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Overall Entrance Score</span>
              <span className="text-3xl font-black text-indigo-700 tabular-nums">
                {nationalExam.overallScore}
              </span>
              <span className="text-xs text-indigo-500 mt-1">University Entrance Total Score</span>
            </div>
          </div>
        </div>

        {/* ── Highlighted Maths & Stats Courses ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-navy-950">Selected Mathematics & Statistics Courses</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                A sample from the BSc IT program — not all university mathematics courses are listed here.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlighted.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-academic-200 hover:bg-academic-50/40 transition-colors"
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-navy-950 leading-snug">{c.name}</h4>
                  <span className="text-[11px] text-slate-500">{c.category}</span>
                </div>
                <span className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-black ${
                  c.grade === 'A+' ? 'bg-emerald-100 text-emerald-700' :
                  c.grade === 'A'  ? 'bg-academic-100 text-academic-700' :
                  'bg-sky-100 text-sky-700'
                }`}>
                  {c.grade}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Note: The Mathematics courses shown are selected examples of my academic performance and do not represent the complete list of Mathematics-related courses I have completed.
          </p>
        </div>

        {/* ── Verification Notice ── */}
        <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-100 border border-slate-200">
          <ShieldCheck className="w-6 h-6 text-academic-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-navy-950">Academic Privacy Notice:</strong> Statistics and summaries are presented to demonstrate credibility.
            Official transcripts, degree certificates, and examination records are available for download from the Certificates page.
            Private contact details and unrelated personal identifiers are not published.
          </div>
        </div>

        {/* ── Certificate Redirect Banner ── */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-950 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg border border-navy-800">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold">Inspect Official Certificates & Awards</h3>
            <p className="text-xs text-slate-300">Downloadable copies of the degree award, gold medal, and national examination certificate.</p>
          </div>
          <Link
            to="/certificates"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors shadow-md flex-shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Browse Certificates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
