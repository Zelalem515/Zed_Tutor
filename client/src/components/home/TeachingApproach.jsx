import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ClipboardList, Target, RotateCcw, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function TeachingApproach() {
  const { t, isAmharic } = useLanguage();

  const steps = [
    {
      num: '01',
      title: isAmharic ? 'መረዳት' : 'Understand',
      subtitle: isAmharic ? 'ፅንሰ-ሀሳብን ማስቀደም' : 'Concept intuition first',
      description: isAmharic
        ? 'ቀመሮችን ወይም አልጎሪዝሞችን ከመያዝ በፊት ነገሮች ለምንና እንዴት እንደሚሰሩ ጥርት ያለ አእምሯዊ ግንዛቤ እንገነባለን። እውነተኛ መረዳት ሁልጊዜም ከሸመደዳ ይቀድማል።'
        : 'Before formulas or algorithms, we build a clear mental model of why something works. Genuine understanding always comes before memorisation.',
      icon: Lightbulb,
      accentBg:    'bg-amber-50',
      accentBorder:'border-amber-200',
      accentIcon:  'text-amber-600',
      accentNum:   'text-amber-200',
    },
    {
      num: '02',
      title: isAmharic ? 'መልመድ' : 'Practice',
      subtitle: isAmharic ? 'ደረጃ በደረጃ ማጠናከር' : 'Step-by-step scaffolding',
      description: isAmharic
        ? 'ከመሰረቱ ጀምሮ ወደ ውስብስብ ደረጃ የሚያድጉ የተመረጡ የልምምድ ጥያቄዎች — በእያንዳንዱ እርምጃ ፈጣንና ገንቢ ግብረ-መልስ በመስጠት የሚከናወን።'
        : 'Carefully structured problem sets — starting from foundations and building toward complexity — with immediate, constructive feedback at each stage.',
      icon: ClipboardList,
      accentBg:    'bg-academic-50',
      accentBorder:'border-academic-100',
      accentIcon:  'text-academic-600',
      accentNum:   'text-academic-100',
    },
    {
      num: '03',
      title: isAmharic ? 'መተግበር' : 'Apply',
      subtitle: isAmharic ? 'ፈተናን የመጋፈጥ እውነተኛ ብቃት' : 'Real reasoning under pressure',
      description: isAmharic
        ? 'ተማሪዎች ግንዛቤያቸውን ባለብዙ-ደረጃ ጥያቄዎች እና በሀገር አቀፍ ፈተና ጥያቄዎች ላይ ይፈትሻሉ። ስህተቶች እንደ ውድቀት ሳይሆን እንደ መማሪያ እና መረጃ ይወሰዳሉ።'
        : 'Students test their understanding on multi-step problems and real examination questions. Mistakes are treated as diagnostic information, not failures.',
      icon: Target,
      accentBg:    'bg-cyan-50',
      accentBorder:'border-cyan-100',
      accentIcon:  'text-cyan-600',
      accentNum:   'text-cyan-100',
    },
    {
      num: '04',
      title: isAmharic ? 'መከለስ' : 'Review',
      subtitle: isAmharic ? 'ማጠናከር እና ራስን መቻል' : 'Consolidation & independence',
      description: isAmharic
        ? 'እያንዳንዱ ክፍለ-ጊዜ የተያዙ ዋና ዋና ነጥቦችን በመገምገም፣ ተጨማሪ ትኩረት የሚሹ ክፍተቶችን በመለየትና ራስን በራስ የማስጠናት ልምድን በሚያዳብሩ የቤት ስራዎች ይጠናቀቃል።'
        : 'Each session ends with a summary of mastered concepts, remaining gaps, and a targeted assignment that builds autonomous study habits.',
      icon: RotateCcw,
      accentBg:    'bg-emerald-50',
      accentBorder:'border-emerald-100',
      accentIcon:  'text-emerald-600',
      accentNum:   'text-emerald-100',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="section-label mx-auto">
            <span>{t('teachingApproach.sectionLabel', null, 'Teaching Methodology')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            {t('teachingApproach.title', null, 'How I Teach: The 4-Phase Framework')}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {t('teachingApproach.description', null, 'Every tutoring session follows a deliberate four-phase structure built around how people actually learn — not just how they pass tests.')}
          </p>
        </div>

        {/* Steps — desktop horizontal with connectors, mobile vertical */}
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className={`relative card-hover hover-lift p-6 space-y-4 ${step.accentBg} ${step.accentBorder} border`}>
                  {/* Number — large decorative background */}
                  <div className="relative">
                    <span className="absolute -top-1 -right-1 text-6xl font-black leading-none select-none" style={{ color: '#0F172A' }}>
                      {step.num}
                    </span>
                    {/* Icon circle */}
                    <div className={`relative w-12 h-12 rounded-xl border flex items-center justify-center ${step.accentBg} ${step.accentBorder}`}>
                      <Icon className={`w-5 h-5 ${step.accentIcon}`} />
                    </div>
                  </div>

                  <div>
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${step.accentIcon} mb-1`}>
                      {isAmharic ? `ደረጃ ${step.num}` : `Phase ${step.num}`}
                    </p>
                    <h3 className="text-lg font-semibold text-navy-950 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{step.subtitle}</p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>

                  {/* Arrow connector — desktop only, not on last step */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-12 z-10">
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA banner */}
        <div className="bg-navy-950 rounded-2xl p-8 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-navy border border-navy-800">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              {isAmharic ? 'የትምህርት መሰረትዎን ለማጠናከር ዝግጁ ነዎት?' : 'Ready to Strengthen Your Academic Foundation?'}
            </h3>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              {isAmharic
                ? 'ለ12ኛ ክፍል ሀገር አቀፍ ፈተና፣ ለትምህርት ቤት ፈተናዎች ወይም በኮምፒውተር ሳይንስ ጠንካራ መሰረት ለመጣል ዝግጅት ላይ ከሆኑ።'
                : 'Whether preparing for Grade 12 national examinations, school exams, or building a stronger foundation in computing.'}
            </p>
          </div>
          <Link to="/contact#inquiry" className="flex-shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base text-navy-950 bg-gold-500 hover:bg-gold-400 shadow-gold transition-all">
            {isAmharic ? 'የማስተማር ክፍለ-ጊዜ ይጠይቁ' : 'Request a Tutoring Session'}
            <ArrowRight className="w-5 h-5 text-navy-950" />
          </Link>
        </div>

      </div>
    </section>
  );
}
