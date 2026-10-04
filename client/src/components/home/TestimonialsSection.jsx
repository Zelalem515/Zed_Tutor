import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Pin, MessageSquare } from 'lucide-react';

export default function TestimonialsSection({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  const preview = testimonials.slice(0, 3);

  return (
    <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="space-y-3">
            <div className="section-label">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Community Endorsements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              What People Say
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-xl">
              Genuine statements from university lecturers, supervisors, academic peers, and students —
              reviewed individually before publication.
            </p>
          </div>
          <Link to="/testimonials" className="link-arrow flex-shrink-0">
            All testimonials <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {preview.map(t => (
            <div
              key={t._id}
              className={`card-hover flex flex-col ${
                t.isPinned ? 'ring-1 ring-academic-200 border-academic-200 shadow-card-md' : ''
              }`}
            >
              {t.isPinned && (
                <div className="px-5 pt-4 pb-0">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-academic-600 bg-academic-50 border border-academic-100 px-2.5 py-1 rounded-full">
                    <Pin className="w-2.5 h-2.5" />
                    Featured
                  </span>
                </div>
              )}

              <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-4">
                {/* Top row: relationship + verified badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                    {t.relationship}
                  </span>
                  {t.isVerifiedWitness && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Quote — opening mark is decorative, not semantic */}
                <div className="flex-1">
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                    <span className="text-academic-200 text-2xl font-black leading-none mr-1 align-top">"</span>
                    {t.message}
                  </p>
                </div>

                {/* Author */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-academic-100 text-academic-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                    {t.authorName?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-navy-950 truncate">{t.authorName}</p>
                    {t.organization && (
                      <p className="text-[11px] text-slate-400 truncate">{t.organization}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {testimonials.length > 3 && (
          <div className="text-center">
            <Link to="/testimonials" className="btn-secondary inline-flex">
              <MessageSquare className="w-4 h-4 text-academic-500" />
              View All {testimonials.length} Testimonials
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
