import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookCheck, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AcademicStatistics({ academic }) {
  const { t, isAmharic } = useLanguage();

  const totalCourses = academic?.totalCourses || 54;
  const gradeDistrib = academic?.gradeDistribution || { aPlus: 31, a: 15, aMinus: 5, bPlus: 3, aOrAbove: 46 };
  const national     = academic?.nationalExam || { mathScore: 85, mathMax: 100, overallScore: 482 };
  const aOrAbove     = gradeDistrib.aOrAbove || 46;
  const pctA         = Math.round((aOrAbove / totalCourses) * 100);

  const highlighted = academic?.highlightedCourses && academic.highlightedCourses.length > 0
    ? academic.highlightedCourses
    : [
        { name: 'Discrete Mathematics', grade: 'A', category: 'Foundation' },
        { name: 'Applied Mathematics / Calculus', grade: 'A+', category: 'Analytical' },
        { name: 'Probability & Statistics', grade: 'A+', category: 'Quantitative' },
        { name: 'Data Structures & Algorithms', grade: 'A+', category: 'Core Computing' },
      ];

  const bars = [
    { label: 'A+', count: gradeDistrib.aPlus, pct: Math.round((gradeDistrib.aPlus/totalCourses)*100), color: 'bg-emerald-500', bg: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { label: 'A',  count: gradeDistrib.a,     pct: Math.round((gradeDistrib.a/totalCourses)*100),     color: 'bg-academic-500', bg: 'bg-academic-50', textColor: 'text-academic-700' },
    { label: 'A−', count: gradeDistrib.aMinus, pct: Math.round((gradeDistrib.aMinus/totalCourses)*100), color: 'bg-sky-500', bg: 'bg-sky-50', textColor: 'text-sky-700' },
    { label: 'B+', count: gradeDistrib.bPlus, pct: Math.round((gradeDistrib.bPlus/totalCourses)*100), color: 'bg-indigo-500', bg: 'bg-indigo-50', textColor: 'text-indigo-700' },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ── Section header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="section-label justify-center">
            <BookCheck className="w-3.5 h-3.5" />
            <span>{t('academicStats.badge', null, 'Academic Record')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            {t('academicStats.title', null, 'Verified Academic Performance')}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {t('academicStats.subtitle', null, 'A transparent record from national examinations through university graduation — backed by official documents.')}
          </p>
        </div>

        {/* ── Primary achievement banner ── */}
        <div className="bg-navy-950 rounded-2xl p-7 sm:p-9 text-white border border-navy-800 shadow-navy">
          <div className="flex flex-col md:flex-row items-center gap-7 md:gap-10">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
              <Award className="w-9 h-9 text-navy-950" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-1.5">
              <p className="text-gold-400 text-xs font-bold uppercase tracking-widest">{t('academicStats.highestHonour', null, 'Highest Academic Honour')}</p>
              <h3 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                {t('academicStats.goldMedalistTitle', null, 'University Gold Medalist')}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isAmharic ? (
                  <>
                    በደብረ ታቦር ዩኒቨርሲቲ <strong className="text-white">በጋፋት ቴክኖሎጂ ኢንስቲትዩት 1ኛ ደረጃ</strong> የተገኘ ሲሆን በ54 ኮርሶች <strong className="text-white">3.95 / 4.00 CGPA</strong> ተመዝግቧል።
                  </>
                ) : (
                  <>
                    Ranked <strong className="text-white">1st at Gafat Institute of Technology</strong>, Debre Tabor University
                    with a <strong className="text-white">3.95 / 4.00 CGPA</strong> across 54 courses.
                  </>
                )}
              </p>
            </div>
            <div className="flex-shrink-0 text-center px-7 py-4 rounded-xl bg-navy-800 border border-navy-700">
              <span className="block text-[2.8rem] font-black text-gold-400 leading-none tabular-nums">3.95</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1 block">CGPA / 4.00</span>
            </div>
          </div>
        </div>

        {/* ── Secondary metrics ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: `${aOrAbove}/${totalCourses}`, label: isAmharic ? 'A እና ከዚያ በላይ ውጤቶች' : 'Grades A or Above', sub: isAmharic ? `የሁሉም ኮርሶች ${pctA}%` : `${pctA}% of all courses`, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { value: `${gradeDistrib.aPlus}`,       label: isAmharic ? 'የ A+ ውጤቶች' : 'A+ Grades',          sub: isAmharic ? `የኮርሶች ${Math.round((gradeDistrib.aPlus/totalCourses)*100)}%` : `${Math.round((gradeDistrib.aPlus/totalCourses)*100)}% of courses`, color: 'text-navy-950', bg: 'bg-slate-50', border: 'border-slate-200' },
            { value: `${national.mathScore}/100`,   label: isAmharic ? 'የ12ኛ ክፍል ሂሳብ' : 'Grade 12 Maths',     sub: isAmharic ? 'ሀገር አቀፍ ፈተና' : 'National Examination',   color: 'text-sky-700',      bg: 'bg-sky-50',    border: 'border-sky-100' },
            { value: `${national.overallScore}`,    label: isAmharic ? 'የ12ኛ ክፍል ጠቅላላ' : 'Grade 12 Total',     sub: isAmharic ? 'የዩኒቨርሲቲ መግቢያ ውጤት' : 'University Entrance Score', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          ].map(({ value, label, sub, color, bg, border }) => (
            <div key={label} className={`card ${bg} ${border} p-5 text-center hover-lift`}>
              <p className={`text-2xl sm:text-3xl font-black ${color} tabular-nums leading-none`}>{value}</p>
              <p className="text-xs font-semibold text-slate-700 mt-2 uppercase tracking-wide">{label}</p>
              <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Detailed breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Grade distribution bars */}
          <div className="card p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                  {isAmharic ? 'የ54ቱ ኮርሶች የውጤት ስርጭት' : '54-Course Grade Distribution'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{isAmharic ? 'ይፋዊ ሰነድ · ደብረ ታቦር ዩኒቨርሲቲ' : 'Official record · Debre Tabor University'}</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {aOrAbove}/{totalCourses} ≥ A
              </span>
            </div>

            <div className="space-y-4">
              {bars.map((bar) => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className={`w-10 text-center text-xs font-bold px-1.5 py-1 rounded-lg ${bar.bg} ${bar.textColor} flex-shrink-0`}>
                    {bar.label}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full rounded-full ${bar.color} transition-all duration-700`} style={{ width: `${bar.pct}%` }} />
                  </div>
                  <div className="w-16 text-right flex-shrink-0">
                    <span className="text-sm font-semibold text-navy-950">{bar.count}</span>
                    <span className="text-[11px] text-slate-400 ml-1">({bar.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
              <span>{isAmharic ? 'ድምር፡ 31 A+ · 15 A · 5 A− · 3 B+' : 'Total: 31 A+ · 15 A · 5 A− · 3 B+'}</span>
              <span className="text-emerald-600 font-semibold">{isAmharic ? 'ከ B+ በታች የወረደ ምንም ኮርስ የለም' : 'Zero courses below B+'}</span>
            </div>
          </div>

          {/* Highlighted maths courses */}
          <div className="card p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                  {isAmharic ? 'የተመረጡ የሂሳብ እና ተዛማጅ ኮርሶች' : 'Selected Mathematics Courses'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{isAmharic ? 'ከ BSc IT ፕሮግራም የተወሰዱ' : 'Sample from BSc IT program'}</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-academic-500" />
            </div>

            <div className="space-y-2.5">
              {highlighted.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-academic-100 hover:bg-academic-50/30 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-950 leading-snug truncate">{c.name}</p>
                    <span className="text-[11px] text-slate-400">{c.category}</span>
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
              {isAmharic
                ? 'ማሳሰቢያ፡ እዚህ የቀረቡት ኮርሶች በሂሳብ ያለኝን አካዳሚክ ጥንካሬ ለማሳየት የተመረጡ ናሙናዎች እንጂ የተጠናቀቁ የሂሳብ ነክ ኮርሶች ሙሉ ዝርዝር አይደሉም።'
                : 'Note: The courses shown are selected examples highlighting my academic strength in Mathematics, not a complete list of all Mathematics-related courses completed.'}
            </p>

            <div className="pt-1">
              <Link to="/academic-evidence" className="link-arrow text-xs">
                {isAmharic ? 'ሙሉ የአካዳሚክ ማስረጃዎች እና ስታቲስቲክስ' : 'Full academic evidence & statistics'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <Link to="/academic-evidence" className="btn-secondary inline-flex">
            <TrendingUp className="w-4 h-4 text-academic-500" />
            {t('academicStats.exploreEvidenceBtn', null, 'Explore Full Academic Evidence')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
