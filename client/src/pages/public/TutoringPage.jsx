import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import {
  BookOpen, Monitor, Code2, Globe, Cpu, CheckCircle2, ArrowRight,
  Wifi, MapPin, Layers, Target, Users, Lightbulb, ClipboardList,
  GraduationCap, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

// ── Icon map by subject category ──────────────────────────────────────────────
const CATEGORY_ICONS = {
  'Mathematics':            BookOpen,
  'Computer / ICT':         Monitor,
  'Programming':            Code2,
  'Web Development':        Globe,
  'General Computer Skills':Cpu,
  'Other':                  BookOpen,
};

// ── Subtle colour accent per subject ─────────────────────────────────────────
const CATEGORY_ACCENTS = {
  'Mathematics':             { bg: 'bg-academic-50',  icon: 'text-academic-600',  border: 'border-academic-100'  },
  'Computer / ICT':          { bg: 'bg-sky-50',        icon: 'text-sky-600',       border: 'border-sky-100'       },
  'Programming':             { bg: 'bg-indigo-50',     icon: 'text-indigo-600',    border: 'border-indigo-100'    },
  'Web Development':         { bg: 'bg-emerald-50',    icon: 'text-emerald-600',   border: 'border-emerald-100'   },
  'General Computer Skills': { bg: 'bg-amber-50',      icon: 'text-amber-600',     border: 'border-amber-100'     },
  'Other':                   { bg: 'bg-slate-50',      icon: 'text-slate-600',     border: 'border-slate-100'     },
};

const METHOD_ICONS = [Lightbulb, ClipboardList, Target, Star];
const METHOD_COLOURS = [
  'bg-academic-50 text-academic-600 border-academic-100',
  'bg-sky-50 text-sky-600 border-sky-100',
  'bg-indigo-50 text-indigo-600 border-indigo-100',
  'bg-emerald-50 text-emerald-600 border-emerald-100',
];

const MODE_ICONS = [Wifi, MapPin, Layers];
const MODE_STYLES = [
  { accent: 'border-sky-200 bg-sky-50/40', iconBg: 'bg-sky-100 text-sky-600' },
  { accent: 'border-emerald-200 bg-emerald-50/40', iconBg: 'bg-emerald-100 text-emerald-600' },
  { accent: 'border-indigo-200 bg-indigo-50/40', iconBg: 'bg-indigo-100 text-indigo-600' },
];

export default function TutoringPage() {
  const { t, localizeSubject, localizeGrade, isAmharic } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [s, g] = await Promise.all([api.getSubjects(), api.getGrades()]);
      setSubjects(s);
      setGrades(g);
      setLoading(false);
    }
    load();
  }, []);

  const defaultWhoPoints = [
    'Students preparing for national or school examinations',
    'Learners who struggle with a specific topic or concept',
    'Students who want to accelerate beyond their classroom pace',
    'Beginners taking their first steps in ICT or Programming',
  ];
  const whoPoints = t('tutoringPage.whoPoints', null, defaultWhoPoints);
  const whoPointsList = Array.isArray(whoPoints) ? whoPoints : defaultWhoPoints;

  const defaultMethods = [
    {
      phase: '01',
      title: 'Understand the Concept',
      description: 'Every session starts by building genuine conceptual understanding — not memorisation. The "why" always comes before the "how".',
    },
    {
      phase: '02',
      title: 'Guided Practice',
      description: 'Worked examples and step-by-step problem-solving, with explicit reasoning at each stage so the student can reproduce the thinking independently.',
    },
    {
      phase: '03',
      title: 'Apply Independently',
      description: 'Supervised independent exercises increase in difficulty. Mistakes are treated as diagnostic data, not failures — then corrected with precision.',
    },
    {
      phase: '04',
      title: 'Review & Consolidate',
      description: 'Each session ends with a summary of what was mastered, what still needs attention, and a targeted assignment to reinforce retention.',
    },
  ];
  const methods = t('tutoringPage.methods', null, defaultMethods);
  const methodList = Array.isArray(methods) ? methods : defaultMethods;

  const defaultModes = [
    {
      title: t('tutoringPage.onlineTitle', null, 'Online Tutoring'),
      subtitle: t('tutoringPage.onlineSub', null, 'Zoom / Google Meet'),
      description: t('tutoringPage.onlineDesc', null, 'Full-feature live sessions via video call. Screen sharing, digital whiteboard, and document sharing. Available to students anywhere.'),
      tags: ['Zoom', 'Google Meet', 'Screen sharing', 'Digital whiteboard'],
    },
    {
      title: t('tutoringPage.inPersonTitle', null, 'In-Person Tutoring'),
      subtitle: t('tutoringPage.inPersonSub', null, 'Addis Ababa (Bole Arabsa & nearby)'),
      description: t('tutoringPage.inPersonDesc', null, 'Face-to-face sessions at an agreed location in Addis Ababa (based in Bole Arabsa). In-person tutoring is available only within Addis Ababa.'),
      tags: isAmharic ? ['አዲስ አበባ', 'ቦሌ አረብሳ', 'በአካል', 'የታተሙ ሰነዶች'] : ['Addis Ababa', 'Bole Arabsa', 'Face-to-face', 'Printed materials'],
    },
    {
      title: t('tutoringPage.hybridTitle', null, 'Hybrid / Flexible'),
      subtitle: t('tutoringPage.hybridSub', null, 'Best of both options'),
      description: t('tutoringPage.hybridDesc', null, "Mix online and in-person sessions according to the student's schedule and preference. Fully adaptable week to week."),
      tags: isAmharic ? ['ተለዋዋጭ ፕሮግራም', 'ቅይጥ ቅርጸት', 'የሚስማማ'] : ['Flexible schedule', 'Mixed format', 'Adaptable'],
    },
  ];
  const modes = t('tutoringPage.modes', null, defaultModes);
  const modeList = Array.isArray(modes) ? modes : defaultModes;

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-academic-300 text-xs font-bold uppercase tracking-wider border border-white/10">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('tutoringPage.badge', null, 'Academic Tutoring — Grades 5 to 12')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight font-heading">
            {t('tutoringPage.title', null, 'Structured Tutoring in')}<br className="hidden sm:block" />
            <span className="text-gold-400"> {t('tutoringPage.titleHighlight', null, 'Mathematics & Information Technology')}</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('tutoringPage.subtitle', null, 'Evidence-based, one-on-one academic tutoring designed to build genuine understanding — not just exam preparation. Delivered online or in-person by a University Gold Medalist with a 3.95 CGPA.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/contact#inquiry"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors shadow-md font-heading"
            >
              <span>{t('tutoringPage.ctaPrimary', null, 'Request Tutoring Session')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/academic-evidence"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors font-heading"
            >
              <span>{t('tutoringPage.ctaEvidence', null, 'View Academic Evidence')}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── Who I Teach ───────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>{t('tutoringPage.whoBadge', null, 'Who I Teach')}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950 leading-snug font-heading">
              {t('tutoringPage.whoTitle', null, 'Students in Grades 5–12 and their Parents')}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('tutoringPage.whoDescription', null, 'I work directly with secondary and preparatory school students in Ethiopia who want to strengthen their understanding of Mathematics, Computer/ICT, Programming, and Web Development. Parents are always welcome to be involved in goal-setting and progress discussions.')}
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              {whoPointsList.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Grade levels grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950 font-heading">
                {t('tutoringPage.gradeLevelsTitle', null, 'Available Grade Levels')}
              </h3>
              <span className="text-xs font-semibold text-academic-600 bg-academic-50 px-2.5 py-1 rounded-full border border-academic-100">
                {t('tutoringPage.gradesBadge', null, 'Grades 5–12')}
              </span>
            </div>
            {loading ? (
              <div className="grid grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {grades.map((g) => (
                  <div
                    key={g._id}
                    className="flex items-center justify-center h-10 rounded-xl bg-academic-50 border border-academic-100 text-academic-700 text-xs font-bold"
                  >
                    {localizeGrade(g.label)}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('tutoringPage.gradeLevelsNote', null, 'Grade levels are dynamically managed. Contact to confirm availability for your specific grade.')}
            </p>
          </div>
        </section>

        {/* ── Subjects / Areas ─────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('tutoringPage.subjectsBadge', null, 'Subjects & Areas')}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950 font-heading">
              {t('tutoringPage.subjectsTitle', null, 'What I Teach')}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('tutoringPage.subjectsSubtitle', null, 'Each tutoring area is structured around the Ethiopian national curriculum, extended with practical real-world application wherever it helps a student truly understand the material.')}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((sub) => {
                const Icon   = CATEGORY_ICONS[sub.category]   || BookOpen;
                const accent = CATEGORY_ACCENTS[sub.category] || CATEGORY_ACCENTS['Other'];
                const localizedName = localizeSubject(sub.name);
                return (
                  <div
                    key={sub._id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="p-6 sm:p-7 flex-1 space-y-4">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className={`w-12 h-12 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${accent.icon}`} />
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${accent.bg} ${accent.icon} ${accent.border} whitespace-nowrap`}>
                          {localizeGrade(sub.gradeRange)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-navy-950 leading-snug font-heading">{localizedName}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mt-1.5">{sub.shortDescription}</p>
                      </div>

                      {/* Topics */}
                      {sub.topics && sub.topics.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {t('tutoringPage.topicsCovered', null, 'Topics Covered')}
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
                            {sub.topics.map((tItem, idx) => (
                              <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                <span>{tItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="px-6 sm:px-7 py-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        {t('tutoringPage.onlineAndInPerson', null, 'Online & In-person')}
                      </span>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1 text-xs font-bold text-academic-600 hover:text-academic-700 transition-colors font-heading"
                      >
                        <span>{t('tutoringPage.requestSubject', null, 'Request Tutoring')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Delivery Modes ───────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
              <Wifi className="w-3.5 h-3.5" />
              <span>{t('tutoringPage.deliveryBadge', null, 'Delivery Modes')}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950 font-heading">
              {t('tutoringPage.deliveryTitle', null, 'How Tutoring Is Delivered')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {modeList.map((mode, idx) => {
              const Icon = MODE_ICONS[idx] || Wifi;
              const style = MODE_STYLES[idx] || MODE_STYLES[0];
              return (
                <div
                  key={mode.title}
                  className={`bg-white rounded-2xl border ${style.accent} shadow-sm p-6 space-y-4`}
                >
                  <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-950 font-heading">{mode.title}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{mode.subtitle}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{mode.description}</p>
                  {mode.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {mode.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Teaching Methodology ─────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>{t('tutoringPage.approachBadge', null, 'Teaching Approach')}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950 font-heading">
              {t('tutoringPage.approachTitle', null, 'My Teaching Methodology')}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('tutoringPage.approachSubtitle', null, 'Every session follows a deliberate four-phase structure built on how people actually learn, not just how they pass tests.')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {methodList.map((step, idx) => {
              const Icon = METHOD_ICONS[idx] || Lightbulb;
              const colour = METHOD_COLOURS[idx] || METHOD_COLOURS[0];
              const phaseNum = step.phase || `0${idx + 1}`;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border shadow-sm p-6 space-y-3 ${colour.split(' ').slice(2).join(' ')}`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colour}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${colour.split(' ')[1]}`}>
                      Phase {phaseNum}
                    </span>
                    <h3 className="text-base font-bold text-navy-950 mt-0.5 leading-snug font-heading">{step.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Credibility Strip ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: t('tutoringPage.credibility.cgpa', null, '3.95'),    unit: t('tutoringPage.credibility.cgpaUnit', null, '/ 4.00'), label: t('tutoringPage.credibility.cgpaLabel', null, 'University CGPA') },
              { value: t('tutoringPage.credibility.rank', null, '1st'),     unit: t('tutoringPage.credibility.rankUnit', null, 'at GIT'), label: t('tutoringPage.credibility.rankLabel', null, 'Class Rank') },
              { value: t('tutoringPage.credibility.aPlus', null, '31'),      unit: t('tutoringPage.credibility.aPlusUnit', null, 'courses'), label: t('tutoringPage.credibility.aPlusLabel', null, 'A+ Grades') },
              { value: t('tutoringPage.credibility.aOrAbove', null, '46 / 54'), unit: t('tutoringPage.credibility.aOrAboveUnit', null, 'courses'), label: t('tutoringPage.credibility.aOrAboveLabel', null, 'Grade A or Above') },
            ].map(({ value, unit, label }) => (
              <div key={label} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-navy-950 tabular-nums font-heading">
                  {value}
                  <span className="text-xs font-semibold text-slate-400 ml-1 normal-case">{unit}</span>
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 text-center sm:text-left">
              {t('tutoringPage.credibility.tagline', null, 'Zelalem Birhan — University Gold Medalist, BSc Information Technology, Debre Tabor University')}
            </p>
            <Link
              to="/academic-evidence"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-academic-600 hover:text-academic-700 whitespace-nowrap transition-colors font-heading"
            >
              <span>{t('tutoringPage.credibility.evidenceLink', null, 'View Full Academic Evidence')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-navy-950 to-navy-900 rounded-2xl p-8 sm:p-12 text-white text-center space-y-5 shadow-xl border border-navy-800">
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight font-heading">
            {t('tutoringPage.finalTitle', null, 'Ready to Start? Send a Tutoring Request.')}
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            {t('tutoringPage.finalSubtitle', null, 'No account required. Tell me your grade level, the subject you need help with, and your preferred schedule. I will contact you directly via phone or WhatsApp.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors shadow-md font-heading"
            >
              <span>{t('tutoringPage.finalCtaPrimary', null, 'Submit Tutoring Inquiry')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/certificates"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors font-heading"
            >
              <span>{t('tutoringPage.finalCtaCertificates', null, 'Browse Certificates')}</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
