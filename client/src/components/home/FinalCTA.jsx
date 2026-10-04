import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Send } from 'lucide-react';

export default function FinalCTA({ profile }) {
  const whatsapp = profile?.contactInfo?.whatsapp || '+251912692343';
  const telegram = profile?.contactInfo?.telegram || 'https://t.me/zed_tutor';
  const email    = profile?.contactInfo?.email    || 'zedtutorit@gmail.com';

  const waDigits     = whatsapp.replace(/[^0-9]/g, '');
  const telegramHref = telegram.startsWith('http')
    ? telegram
    : `https://t.me/${telegram.replace(/^@/, '')}`;

  return (
    <section className="py-20 lg:py-28 bg-navy-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

        {/* Headline */}
        <div className="space-y-4">
          <p className="text-gold-400 text-sm font-semibold tracking-widest uppercase">Ready to Start?</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            Request Tutoring — No Account Required
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Tell me your grade level, the subject you need help with, and your preferred schedule.
            I will respond directly via phone or WhatsApp.
          </p>
        </div>

        {/* Subject chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['Mathematics', 'Computer / ICT', 'Programming', 'Web Development', 'General Computer Skills'].map(s => (
            <span key={s} className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-white/7 border border-white/10">
              {s}
            </span>
          ))}
          <span className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-400 bg-white/4 border border-white/8">
            Grades 5–12
          </span>
        </div>

        {/* Primary CTA */}
        <div>
          <Link
            to="/contact#inquiry"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-[17px] text-navy-950 bg-gold-500 hover:bg-gold-400 shadow-gold hover:shadow-[0_6px_28px_rgba(245,181,27,0.40)] transition-all duration-200 active:scale-[0.98]"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            Request Tutoring
            <ArrowRight className="w-5 h-5 text-navy-950" />
          </Link>
        </div>

        {/* Secondary: direct channels */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/6 hover:bg-white/10 border border-white/10 transition-all duration-200">
            <span>💬</span> WhatsApp
          </a>
          <a href={telegramHref} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/6 hover:bg-white/10 border border-white/10 transition-all duration-200">
            <Send className="w-3.5 h-3.5" /> Telegram
          </a>
          <a href={`mailto:${email}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/6 hover:bg-white/10 border border-white/10 transition-all duration-200">
            <Mail className="w-3.5 h-3.5" /> {email}
          </a>
        </div>

      </div>
    </section>
  );
}
