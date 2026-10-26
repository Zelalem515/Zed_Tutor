import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, ArrowRight, FileText, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function CertificatesPreview() {
  const { t, isAmharic } = useLanguage();

  const credentialCategories = [
    {
      label: isAmharic ? 'የዩኒቨርሲቲ ዲግሪ' : 'University Degree',
      desc:  isAmharic ? 'BSc በኢንፎርሜሽን ቴክኖሎጂ — ደብረ ታቦር ዩኒቨርሲቲ' : 'BSc Information Technology — Debre Tabor University',
      icon:  FileText,
      accent: 'bg-academic-50 border-academic-100 text-academic-600',
    },
    {
      label: isAmharic ? 'የዩኒቨርሲቲ የወርቅ ሜዳሊያ' : 'University Gold Medal',
      desc:  isAmharic ? 'ከፍተኛ የአካዳሚክ ክብር — ጋፋት ቴክኖሎጂ ኢንስቲትዩት' : 'Highest academic honour — Gafat Institute of Technology',
      icon:  Award,
      accent: 'bg-gold-50 border-gold-200 text-gold-600',
    },
    {
      label: isAmharic ? 'አካዳሚክ ትራንስክሪፕት' : 'Academic Transcript',
      desc:  isAmharic ? 'ከሬጅስትራር ጽ/ቤት የተሰጠ ይፋዊ የ54ቱ ኮርሶች ሰነድ' : 'Official 54-course record from the Office of the Registrar',
      icon:  Shield,
      accent: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    },
    {
      label: isAmharic ? 'ብሔራዊ ፈተና' : 'National Examination',
      desc:  isAmharic ? 'የ12ኛ ክፍል ሰርተፊኬት — ከትምህርት ምዘናና ፈተናዎች ኤጀንሲ' : 'Grade 12 certificate — National Educational Assessment Agency',
      icon:  FileText,
      accent: 'bg-sky-50 border-sky-100 text-sky-600',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="space-y-3">
            <div className="section-label-gold">
              <Award className="w-3.5 h-3.5" />
              <span>{t('certificatesSection.badge', null, 'Official Credentials')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              {t('certificatesSection.title', null, 'Certificates & Documentary Evidence')}
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-xl">
              {t('certificatesSection.subtitle', null, 'Official documents from Debre Tabor University and the National Educational Assessment Agency — all publicly accessible and free to download.')}
            </p>
          </div>
          <Link to="/certificates" className="link-arrow flex-shrink-0">
            <span>{isAmharic ? 'ሁሉንም ሰርተፊኬቶች ይመልከቱ' : 'View all certificates'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Credential cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {credentialCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.label} className="card-hover hover-lift p-5 flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${cat.accent}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-950 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                    {cat.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 card p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-academic-50 border border-academic-100 flex items-center justify-center flex-shrink-0">
              <Download className="w-4.5 h-4.5 text-academic-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                {isAmharic ? 'ሁሉም ሰርተፊኬቶች በቀላሉ የሚወርዱ (Download) ናቸው' : 'All certificates are publicly downloadable'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {isAmharic ? 'ምንም አይነት አካውንት መክፈት አይጠበቅብዎትም። በሰርተፊኬቶች ገጽ ላይ ይፋዊ ሰነዶችን መመልከትና ማውረድ ይችላሉ።' : 'No account required. Preview and download official documents on the Certificates page.'}
              </p>
            </div>
          </div>
          <Link to="/certificates" className="btn-dark flex-shrink-0">
            <FileText className="w-4 h-4 text-gold-400" />
            {isAmharic ? 'ሰርተፊኬቶችን ያስሱ' : 'Browse Certificates'}
          </Link>
        </div>

      </div>
    </section>
  );
}
