import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import {
  Mail, Phone, Send, ExternalLink, ArrowRight,
  CheckCircle2, ShieldCheck, MessageSquare
} from 'lucide-react';

const EMPTY_FORM = {
  clientName: '',
  clientRole: 'Parent',
  studentGrade: '',
  subject: '',
  topicStruggles: '',
  preferredSchedule: '',
  mode: 'Online',
  phoneOrWhatsApp: '',
  email: '',
  message: '',
  // honeypot — must remain empty
  _hp: '',
};

export default function ContactPage() {
  const [profile,  setProfile]  = useState(null);
  const [grades,   setGrades]   = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg,  setStatusMsg]  = useState(null);

  // Scroll to the inquiry form when arriving via /contact#inquiry
  useEffect(() => {
    if (window.location.hash === '#inquiry') {
      const timer = setTimeout(() => {
        const el = document.getElementById('inquiry');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    async function load() {
      const [p, s, g] = await Promise.all([
        api.getProfile(),
        api.getSubjects(),
        api.getGrades(),
      ]);
      setProfile(p);
      setSubjects(s);
      setGrades(g);

      // Set sensible defaults once data arrives
      setFormData((prev) => ({
        ...prev,
        studentGrade: g?.[0]?.label || 'Grade 9',
        subject: s?.[0]?.name || 'Mathematics',
      }));
    }
    load();
  }, []);

  const set = (field, value) => setFormData((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Honeypot check — bots fill this, humans don't
    if (formData._hp) return;

    setSubmitting(true);
    setStatusMsg(null);

    // Strip honeypot before sending
    const { _hp, ...payload } = formData;

    try {
      const res = await api.submitInquiry(payload);
      if (res?.success) {
        setStatusMsg({
          type: 'success',
          text: 'Your tutoring request has been received. Zelalem will contact you shortly via phone or WhatsApp.',
        });
        setFormData({
          ...EMPTY_FORM,
          studentGrade: grades?.[0]?.label || 'Grade 9',
          subject: subjects?.[0]?.name || 'Mathematics',
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: res?.message || 'Could not submit. Please check the required fields and try again.',
        });
      }
    } catch {
      setStatusMsg({
        type: 'error',
        text: 'An unexpected error occurred. Please reach out directly via WhatsApp.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const phone     = profile?.contactInfo?.phone    || '+251 912 692 343';
  const whatsapp  = profile?.contactInfo?.whatsapp || '+251912692343';
  const telegram  = profile?.contactInfo?.telegram || 'https://t.me/zed_tutor';
  const email     = profile?.contactInfo?.email    || 'zedtutorit@gmail.com';
  const location  = profile?.contactInfo?.location || 'Addis Ababa, Ethiopia';
  const portfolio = profile?.itPortfolioUrl || 'https://zelalem-birhan.vercel.app/';

  // Managed social links — only active ones shown publicly
  const activeSocialLinks = (profile?.socialLinks || []).filter(l => l.isActive && l.url);
  // Keep legacy flat-field social reads for fallback (these will be empty after migration)
  const instagram   = profile?.contactInfo?.instagram   || '';
  const facebook    = profile?.contactInfo?.facebook    || '';
  const youtube     = profile?.contactInfo?.youtube     || '';

  // WhatsApp — strip to digits for wa.me URL
  const waDigits = whatsapp.replace(/[^0-9]/g, '');
  const waHref   = `https://wa.me/${waDigits}`;

  // Resolve telegram handle or URL
  const telegramHref = (val) => {
    if (!val) return '#';
    if (val.startsWith('http')) return val;
    return `https://t.me/${val.replace(/^@/, '')}`;
  };

  const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-400 focus:border-transparent placeholder:text-slate-400 transition-shadow';
  const labelCls = 'block text-xs font-bold text-slate-700 mb-1.5';

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Connect & Request Tutoring</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            Contact & Tutoring Inquiry
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Questions or ready to start? Submit a tutoring request below or reach out through any of the direct channels.
            No account required — no calendar booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ── Left: Direct Contact Channels ── */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-navy-950">Direct Contact Channels</h2>

              <div className="space-y-3 text-sm">

                {/* WhatsApp — uses wa.me with digits-only number */}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-colors group"
                >
                  <span className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">💬</span>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-500 font-semibold block">WhatsApp Chat</span>
                    <span className="font-bold text-slate-800 group-hover:text-emerald-700 truncate block">{whatsapp}</span>
                  </div>
                </a>

                {/* Telegram channel — dynamic label derived from URL/handle */}
                {telegram && (
                  <a
                    href={telegramHref(telegram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center flex-shrink-0">
                      <Send className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Telegram Channel</span>
                      <span className="font-bold text-slate-800 group-hover:text-sky-700">
                        {telegram.startsWith('http')
                          ? telegram.replace('https://t.me/', '@')
                          : telegram}
                      </span>
                    </div>
                  </a>
                )}

                {/* Telegram bot is internal admin tooling — not shown publicly */}

                {/* Phone */}                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-colors group"
                >
                  <span className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">Phone Call</span>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700">{phone}</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition-colors group"
                >
                  <span className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-500 font-semibold block">Email</span>
                    <span className="font-bold text-slate-800 group-hover:text-amber-700 truncate block text-xs sm:text-sm">{email}</span>
                  </div>
                </a>

                {/* Dynamic social links from managed socialLinks array */}
                {activeSocialLinks.map((link, idx) => (
                  <a
                    key={link._id || idx}
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-academic-50 border border-slate-100 hover:border-academic-200 transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-lg bg-academic-500/10 text-academic-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {(link.label || link.platform).slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-500 font-semibold block">{link.platform}</span>
                      <span className="font-bold text-slate-800 group-hover:text-academic-700 truncate block text-xs">
                        {link.label || link.url}
                      </span>
                    </div>
                  </a>
                ))}

                {/* Legacy flat-field social fallback — rendered only if no socialLinks exist and old data is present */}
                {activeSocialLinks.length === 0 && instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-100 hover:border-pink-200 transition-colors group">
                    <span className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center text-xs font-bold flex-shrink-0">IG</span>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Instagram</span>
                      <span className="font-bold text-slate-800 group-hover:text-pink-700">
                        {instagram.includes('instagram.com/') ? '@' + instagram.split('instagram.com/').pop().replace(/\/$/, '') : instagram}
                      </span>
                    </div>
                  </a>
                )}
                {activeSocialLinks.length === 0 && facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                    <span className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">FB</span>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Facebook</span>
                      <span className="font-bold text-slate-800 group-hover:text-blue-700">ZED_Tutor</span>
                    </div>
                  </a>
                )}
                {activeSocialLinks.length === 0 && youtube && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 transition-colors group">
                    <span className="w-10 h-10 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">YT</span>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">YouTube</span>
                      <span className="font-bold text-slate-800 group-hover:text-red-700">ZED_Tutor</span>
                    </div>
                  </a>
                )}
              </div>

              {/* IT Portfolio */}
              <div className="pt-2 border-t border-slate-100">
                <a
                  href={portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-navy-900 hover:bg-navy-800 transition-colors shadow-sm"
                >
                  <span>Explore My IT Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                </a>
              </div>
            </div>

            {/* Quick info card */}
            <div className="bg-academic-50 border border-academic-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-academic-600" />
                <span className="text-xs font-bold text-academic-700 uppercase tracking-wide">What to Expect</span>
              </div>
              <ul className="space-y-2">
                {[
                  'No account or registration required',
                  'Response within 24 hours via WhatsApp',
                  'Sessions available online or in-person',
                  'Grades 5–12 — all subjects listed',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: Inquiry Form ── */}
          <div id="inquiry" className="lg:col-span-7 bg-white rounded-2xl p-7 sm:p-9 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-navy-950">Tutoring Inquiry Form</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your details and I'll reach out directly. All fields marked * are required.
              </p>
            </div>

            {/* Status message */}
            {statusMsg && (
              <div className={`mb-5 p-4 rounded-xl text-sm font-semibold flex items-start gap-3 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {statusMsg.type === 'success'
                  ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  : <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                }
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Honeypot — hidden from real users, bots fill this */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-0" tabIndex={-1}>
                <label htmlFor="_hp">Leave this empty</label>
                <input
                  id="_hp"
                  type="text"
                  name="_hp"
                  value={formData._hp}
                  onChange={(e) => set('_hp', e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              {/* Name + Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Your Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formData.clientName}
                    onChange={(e) => set('clientName', e.target.value)}
                    className={inputCls}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className={labelCls}>I am a *</label>
                  <select
                    value={formData.clientRole}
                    onChange={(e) => set('clientRole', e.target.value)}
                    className={inputCls}
                  >
                    <option value="Parent">Parent</option>
                    <option value="Student">Student</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Grade + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Student Grade Level *</label>
                  <select
                    required
                    value={formData.studentGrade}
                    onChange={(e) => set('studentGrade', e.target.value)}
                    className={inputCls}
                  >
                    {grades.length > 0
                      ? grades.map((g) => (
                          <option key={g._id} value={g.label}>{g.label}</option>
                        ))
                      : ['Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))
                    }
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Subject Needed *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => set('subject', e.target.value)}
                    className={inputCls}
                  >
                    {subjects.length > 0
                      ? subjects.map((s) => (
                          <option key={s._id} value={s.name}>{s.name}</option>
                        ))
                      : ['Mathematics','Computer / ICT','Programming Fundamentals','Web Development','General Computer Skills'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))
                    }
                    <option value="Multiple / General">Multiple / General</option>
                  </select>
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Phone / WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={formData.phoneOrWhatsApp}
                    onChange={(e) => set('phoneOrWhatsApp', e.target.value)}
                    className={inputCls}
                    placeholder="+251 9… / WhatsApp"
                  />
                </div>
                <div>
                  <label className={labelCls}>Email <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input
                    type="email"
                    maxLength={100}
                    value={formData.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputCls}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Mode + Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Learning Mode *</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => set('mode', e.target.value)}
                    className={inputCls}
                  >
                    <option value="Online">Online (Zoom / Meet)</option>
                    <option value="In-person">In-person ({location})</option>
                    <option value="Flexible">Flexible / Either</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Preferred Days / Schedule</label>
                  <input
                    type="text"
                    maxLength={200}
                    value={formData.preferredSchedule}
                    onChange={(e) => set('preferredSchedule', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Weekends / Evenings"
                  />
                </div>
              </div>

              {/* Topics / struggles */}
              <div>
                <label className={labelCls}>
                  Topics or Learning Goals
                  <span className="text-slate-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={formData.topicStruggles}
                  onChange={(e) => set('topicStruggles', e.target.value)}
                  className={`${inputCls} resize-none`}
                  placeholder="e.g. Needs help with Algebra word problems, preparing for Grade 8 exam, or wants to learn Python basics…"
                />
              </div>

              {/* Additional message */}
              <div>
                <label className={labelCls}>
                  Additional Message
                  <span className="text-slate-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  maxLength={1500}
                  value={formData.message}
                  onChange={(e) => set('message', e.target.value)}
                  className={`${inputCls} resize-none`}
                  placeholder="Any other information you'd like to share…"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-navy-950 bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-500 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Sending Request…' : 'Submit Tutoring Request'}</span>
                {!submitting && <ArrowRight className="w-4 h-4 text-navy-950" />}
              </button>

              <p className="text-center text-[11px] text-slate-400">
                No account required. Your contact details are only used to respond to this inquiry.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
