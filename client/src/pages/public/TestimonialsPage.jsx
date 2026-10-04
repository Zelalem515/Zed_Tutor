import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/client';
import {
  MessageSquare, ShieldCheck, Star, Plus, Send,
  CheckCircle2, ThumbsUp, Pin, ArrowRight, X, Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RELATIONSHIPS = [
  'Lecturer', 'Academic Advisor', 'Project Supervisor', 'Classmate',
  'Teacher', 'Student', 'Parent', 'Employer/Colleague', 'Friend', 'Other'
];

const EMPTY_FORM = {
  authorName: '',
  relationship: 'Student',
  organization: '',
  message: '',
  email: '',
  _hp: '',  // honeypot — must stay empty
};

// ── Helpful button with optimistic update ────────────────────────────────────
function HelpfulButton({ testimonialId, initialCount }) {
  const [count, setCount]     = useState(initialCount || 0);
  const [voted, setVoted]     = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (voted || loading) return;
    setLoading(true);
    setCount(c => c + 1);   // optimistic
    setVoted(true);
    try {
      const res = await api.markTestimonialHelpful(testimonialId);
      if (res?.helpfulCount !== undefined) setCount(res.helpfulCount);
    } catch {
      // revert on error
      setCount(c => Math.max(0, c - 1));
      setVoted(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={voted || loading}
      title={voted ? 'Already marked as helpful' : 'Mark as helpful'}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
        voted
          ? 'bg-academic-50 border-academic-200 text-academic-600 cursor-default'
          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-academic-50 hover:border-academic-200 hover:text-academic-600'
      }`}
    >
      <ThumbsUp className="w-3 h-3" />
      <span>Helpful{count > 0 ? ` (${count})` : ''}</span>
    </button>
  );
}

// ── Single testimonial card ───────────────────────────────────────────────────
function TestimonialCard({ t, featured = false }) {
  return (
    <div className={`bg-white rounded-2xl border flex flex-col ${
      featured
        ? 'border-academic-200 shadow-md ring-1 ring-academic-100'
        : 'border-slate-200/90 shadow-sm'
    }`}>
      {/* Pinned badge */}
      {featured && (
        <div className="px-5 pt-4 pb-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-academic-700 bg-academic-50 border border-academic-200 px-2.5 py-1 rounded-full">
            <Pin className="w-3 h-3" />
            Featured
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-4">
        {/* Quote + relationship */}
        <div className="flex items-start justify-between gap-2">
          <Quote className="w-6 h-6 text-academic-300 flex-shrink-0 mt-0.5" />
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
              {t.relationship}
            </span>
            {t.isVerifiedWitness && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Verified Witness
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-700 leading-relaxed flex-1 italic">
          "{t.message}"
        </p>

        {/* Author + helpful */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-academic-100 text-academic-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
              {t.authorName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-navy-950 truncate">{t.authorName}</h4>
              {t.organization && (
                <p className="text-[11px] text-slate-500 truncate">{t.organization}</p>
              )}
            </div>
          </div>
          <HelpfulButton testimonialId={t._id} initialCount={t.helpfulCount || 0} />
        </div>
      </div>
    </div>
  );
}

// ── Submission modal ──────────────────────────────────────────────────────────
function SubmitModal({ onClose }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status,   setStatus]   = useState(null);
  const [busy,     setBusy]     = useState(false);

  const set = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData._hp) return;   // honeypot
    setBusy(true);
    setStatus(null);
    const { _hp, ...payload } = formData;
    try {
      const res = await api.submitTestimonial(payload);
      if (res?.success) {
        setStatus({ type: 'success', text: res.message || 'Thank you! Your testimonial will appear after admin review.' });
        setFormData(EMPTY_FORM);
      } else {
        setStatus({ type: 'error', text: res?.message || 'Submission failed. Please check required fields.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Unexpected error. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-academic-400 focus:border-transparent placeholder:text-slate-400';
  const labelCls = 'block text-xs font-bold text-slate-700 mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Submit a testimonial"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-navy-950">Submit a Testimonial</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Share your genuine experience. Submissions are reviewed before publishing.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Honeypot — hidden off-screen */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-0" tabIndex={-1}>
            <label htmlFor="t_hp">Leave blank</label>
            <input id="t_hp" type="text" name="_hp" value={formData._hp}
              onChange={e => set('_hp', e.target.value)} autoComplete="off" tabIndex={-1} />
          </div>

          {status && (
            <div className={`mb-4 p-4 rounded-xl text-sm font-semibold flex items-start gap-2 ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {status.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />}
              <span>{status.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Your Full Name *</label>
              <input type="text" required maxLength={100}
                value={formData.authorName} onChange={e => set('authorName', e.target.value)}
                className={inputCls} placeholder="e.g. Dr. Abebe Kebede" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Relationship to Zelalem *</label>
                <select value={formData.relationship} onChange={e => set('relationship', e.target.value)} className={inputCls}>
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Organisation / Institution</label>
                <input type="text" maxLength={120}
                  value={formData.organization} onChange={e => set('organization', e.target.value)}
                  className={inputCls} placeholder="e.g. Debre Tabor University" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Testimonial Message * <span className="text-slate-400 font-normal">(max 1500 chars)</span></label>
              <textarea required rows={4} maxLength={1500}
                value={formData.message} onChange={e => set('message', e.target.value)}
                className={`${inputCls} resize-none`}
                placeholder="Describe Zelalem's academic character, teaching approach, or the impact of working with him…" />
              <p className="text-[11px] text-slate-400 mt-1 text-right">{formData.message.length} / 1500</p>
            </div>

            <div>
              <label className={labelCls}>Email <span className="text-slate-400 font-normal">(optional — private, not shown publicly)</span></label>
              <input type="email" maxLength={100}
                value={formData.email} onChange={e => set('email', e.target.value)}
                className={inputCls} placeholder="contact@example.com" />
            </div>

            <p className="text-[11px] text-slate-400 italic leading-relaxed">
              All submissions enter a pending moderation state and are reviewed for authenticity before appearing publicly.
              Your email, if provided, is private and never displayed.
            </p>

            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-60 rounded-xl shadow-sm transition-colors">
                <span>{busy ? 'Submitting…' : 'Submit Testimonial'}</span>
                <Send className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getTestimonials();
      setTestimonials(data);
      setLoading(false);
    }
    load();
  }, []);

  const pinned   = testimonials.filter(t => t.isPinned);
  const regular  = testimonials.filter(t => !t.isPinned);
  const verified = testimonials.filter(t => t.isVerifiedWitness).length;

  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community & Academic Endorsements</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            Testimonials & References
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Genuine statements from university lecturers, supervisors, academic peers, and students.
            Each submission is individually reviewed before appearing here.
          </p>

          {/* Stats strip */}
          {!loading && testimonials.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <MessageSquare className="w-3.5 h-3.5 text-academic-500" />
                {testimonials.length} published
              </span>
              {verified > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {verified} verified witness{verified !== 1 ? 'es' : ''}
                </span>
              )}
              {pinned.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-academic-600">
                  <Star className="w-3.5 h-3.5" />
                  {pinned.length} featured
                </span>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-navy-900 hover:bg-navy-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-gold-400" />
              Submit a Testimonial
            </button>
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 h-48 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && testimonials.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-400">
            <MessageSquare className="w-12 h-12" />
            <p className="text-base font-semibold text-slate-600">No testimonials yet.</p>
            <p className="text-sm text-center max-w-sm">
              Be the first to share your experience. Submissions are reviewed before appearing here.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-navy-900 hover:bg-navy-800 transition-colors"
            >
              <Plus className="w-4 h-4 text-gold-400" />
              Submit a Testimonial
            </button>
          </div>
        )}

        {/* ── Pinned / Featured section ── */}
        {!loading && pinned.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-academic-700 uppercase tracking-widest">
                <Star className="w-3.5 h-3.5" />
                Featured Testimonials
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pinned.map(t => (
                <TestimonialCard key={t._id} t={t} featured />
              ))}
            </div>
          </section>
        )}

        {/* ── All testimonials ── */}
        {!loading && regular.length > 0 && (
          <section className="space-y-5">
            {pinned.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">All Testimonials</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {regular.map(t => (
                <TestimonialCard key={t._id} t={t} />
              ))}
            </div>
          </section>
        )}

        {/* ── Verified badge explanation ── */}
        {!loading && testimonials.length > 0 && (
          <div className="flex items-start gap-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-800 leading-relaxed">
              <strong>Verified Witness</strong> badges are assigned manually by Zelalem after confirming
              the person's identity and relationship. They are not awarded automatically.
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="bg-gradient-to-r from-navy-950 to-navy-900 rounded-2xl p-7 sm:p-9 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg border border-navy-800">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold">Interested in Tutoring?</h3>
            <p className="text-sm text-slate-300">Send a tutoring inquiry and Zelalem will respond directly.</p>
          </div>
          <Link
            to="/contact#inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors shadow-md flex-shrink-0"
          >
            <span>Request Tutoring</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* ── Modal ── */}
      {showModal && <SubmitModal onClose={closeModal} />}
    </div>
  );
}
