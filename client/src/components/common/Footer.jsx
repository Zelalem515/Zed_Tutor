import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Send, ExternalLink, Lock, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LOGO_SRC = '/assets/branding/logo.png';

function FooterLogo() {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-transparent">
        <img
          src={LOGO_SRC}
          alt="ZED_Tutor logo"
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-academic-600 to-academic-500 flex items-center justify-center text-white shadow-md">
      <GraduationCap className="w-5 h-5 text-gold-400" />
    </div>
  );
}

// Resolve a telegram value (full URL or @handle) into a clickable href
function telegramHref(value) {
  if (!value) return null;
  if (value.startsWith('http')) return value;
  return `https://t.me/${value.replace(/^@/, '')}`;
}

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const ci = profile?.contactInfo || {};

  // Core contact — real values with real fallbacks
  const phone        = ci.phone       || '+251 912 692 343';
  const whatsapp     = ci.whatsapp    || '+251912692343';
  const telegramChan = ci.telegram    || 'https://t.me/zed_tutor';
  const email        = ci.email       || 'zedtutorit@gmail.com';
  const portfolioUrl = profile?.itPortfolioUrl || 'https://zelalem-birhan.vercel.app/';

  // Active social links from the managed socialLinks array
  const activeSocialLinks = (profile?.socialLinks || []).filter(l => l.isActive && l.url);

  // WhatsApp URL: strip all non-digits from stored number
  const waDigits = whatsapp.replace(/[^0-9]/g, '');
  const waHref   = `https://wa.me/${waDigits}`;

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand & Credibility ── */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FooterLogo />
              <span className="text-xl font-bold tracking-tight text-white">
                ZED<span className="text-academic-500">_Tutor</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.brandDesc')}
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700/60 text-xs text-gold-400 font-medium">
              <Award className="w-4 h-4 text-gold-500" />
              <span>{t('footer.goldBadge')}</span>
            </div>

            {/* ── Social links row — driven by managed socialLinks array ── */}
            {activeSocialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activeSocialLinks.map((link, idx) => (
                  <a
                    key={link._id || idx}
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label || link.platform}
                    title={link.label || link.platform}
                    className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-academic-600/30 flex items-center justify-center text-slate-400 hover:text-academic-300 transition-colors text-[10px] font-bold uppercase"
                  >
                    {(link.label || link.platform).slice(0, 2)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Quick Navigation ── */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {t('footer.exploreHeading')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t('footer.linkHome'),         to: '/' },
                { label: t('footer.linkAbout'),        to: '/about' },
                { label: t('footer.linkJourney'),      to: '/academic-journey' },
                { label: t('footer.linkEvidence'),     to: '/academic-evidence' },
                { label: t('footer.linkCertificates'), to: '/certificates' },
                { label: t('footer.linkTutoring'),     to: '/tutoring' },
                { label: t('footer.linkTestimonials'), to: '/testimonials' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Core Tutoring Areas ── */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {t('footer.tutoringAreasHeading')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {[
                t('footer.area1'),
                t('footer.area2'),
                t('footer.area3'),
                t('footer.area4'),
                t('footer.area5'),
              ].map((item, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-academic-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Direct Contact ── */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {t('footer.contactHeading')}
            </h4>
            <ul className="space-y-3 text-sm">

              {/* WhatsApp — always shown */}
              <li>
                <a href={waHref} target="_blank" rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    💬
                  </span>
                  <span className="truncate">WhatsApp: {whatsapp}</span>
                </a>
              </li>

              {/* Telegram channel — shown when value present */}
              {telegramChan && (
                <li>
                  <a href={telegramHref(telegramChan)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-2.5 text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 flex-shrink-0">
                      <Send className="w-3.5 h-3.5" />
                    </span>
                    <span>{t('footer.telegramChannel')}</span>
                  </a>
                </li>
              )}

              {/* Email */}
              {email && (
                <li>
                  <a href={`mailto:${email}`}
                    className="flex items-center space-x-2.5 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{email}</span>
                  </a>
                </li>
              )}

              {/* IT Portfolio */}
              {portfolioUrl && (
                <li>
                  <a href={portfolioUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-2.5 text-slate-300 hover:text-academic-400 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-academic-500/10 flex items-center justify-center text-academic-400 flex-shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <span>{t('footer.explorePortfolio')}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            {t('footer.copyright', { year: currentYear })}
          </p>
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              {t('footer.inquiries')}
            </Link>
            <span>•</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-1 text-slate-600 hover:text-slate-400 transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>{t('footer.admin')}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
