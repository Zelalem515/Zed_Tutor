import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Award, MessageSquare, BookOpen, ArrowRight,
  GraduationCap, TrendingUp, Star, Users, Hash,
  CheckCircle2, Clock, RefreshCw, ExternalLink, User
} from 'lucide-react';

// Status style map — matches AdminInquiriesPage
const STATUS_STYLES = {
  NEW:         { pill: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'    },
  CONTACTED:   { pill: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500'   },
  IN_PROGRESS: { pill: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500'  },
  COMPLETED:   { pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  CLOSED:      { pill: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-400'   },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.NEW;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sublabel, to, colour }) {
  const card = (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-3 hover:shadow-md transition-shadow group`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colour.iconBg}`}>
        <Icon className={`w-5 h-5 ${colour.icon}`} />
      </div>
      <div>
        <p className={`text-3xl font-black ${colour.value} tabular-nums`}>{value ?? '—'}</p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
        {sublabel && <p className="text-[11px] text-slate-400 mt-1">{sublabel}</p>}
      </div>
      {to && (
        <div className={`inline-flex items-center gap-1 text-xs font-semibold ${colour.link} opacity-0 group-hover:opacity-100 transition-opacity mt-auto`}>
          <span>Manage</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  return to ? <Link to={to}>{card}</Link> : card;
}

// ── Quick-action card ─────────────────────────────────────────────────────────
function QuickAction({ icon: Icon, title, description, to, colour }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4 hover:shadow-md hover:border-slate-300 transition-all group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colour.iconBg}`}>
        <Icon className={`w-5 h-5 ${colour.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-navy-950 leading-snug">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${colour.icon} opacity-0 group-hover:opacity-100 transition-opacity`} />
    </Link>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [inquiries,    setInquiries]    = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [subjects,     setSubjects]     = useState(null);
  const [grades,       setGrades]       = useState(null);
  const [loading,      setLoading]      = useState(true);

  async function loadSummary() {
    setLoading(true);
    try {
      const [inqRes, certRes, subRes, gradeRes] = await Promise.allSettled([
        api.getInquiriesAll(),
        api.getCertificatesAll(),
        api.getSubjects(true),
        api.getGradesAll(),
      ]);

      if (inqRes.status === 'fulfilled')  setInquiries(inqRes.value?.data  || inqRes.value  || []);
      if (certRes.status === 'fulfilled') setCertificates(certRes.value || []);
      if (subRes.status === 'fulfilled')  setSubjects(subRes.value || []);
      if (gradeRes.status === 'fulfilled') setGrades(gradeRes.value || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSummary(); }, []);

  const newInquiryCount = inquiries?.filter(i => i.status === 'NEW').length ?? 0;
  const recentInquiries = inquiries?.slice(0, 5) ?? [];

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-gold-500" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              ZED_Tutor content management overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadSummary}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </a>
          </div>
        </div>

        {/* ── New inquiry alert banner ── */}
        {!loading && newInquiryCount > 0 && (
          <Link
            to="/admin/inquiries"
            className="flex items-center gap-4 px-5 py-4 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-900">
                {newInquiryCount === 1
                  ? '1 new tutoring inquiry needs your attention'
                  : `${newInquiryCount} new tutoring inquiries need your attention`}
              </p>
              <p className="text-xs text-blue-600 mt-0.5">Click to review and respond</p>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}

        {/* ── Summary stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={MessageSquare}
            label="Total Inquiries"
            value={loading ? '…' : inquiries?.length ?? 0}
            sublabel={loading ? null : `${newInquiryCount} new`}
            to="/admin/inquiries"
            colour={{ iconBg: 'bg-academic-50', icon: 'text-academic-600', value: 'text-navy-950', link: 'text-academic-600' }}
          />
          <StatCard
            icon={Award}
            label="Certificates"
            value={loading ? '…' : certificates?.length ?? 0}
            sublabel={loading ? null : `${certificates?.filter(c => c.isPublic)?.length ?? 0} public`}
            to="/admin/certificates"
            colour={{ iconBg: 'bg-gold-50', icon: 'text-gold-600', value: 'text-navy-950', link: 'text-gold-600' }}
          />
          <StatCard
            icon={BookOpen}
            label="Subjects"
            value={loading ? '…' : subjects?.length ?? 0}
            sublabel={loading ? null : `${subjects?.filter(s => s.isActive)?.length ?? 0} active`}
            to="/admin/subjects"
            colour={{ iconBg: 'bg-emerald-50', icon: 'text-emerald-600', value: 'text-navy-950', link: 'text-emerald-600' }}
          />
          <StatCard
            icon={Hash}
            label="Grade Levels"
            value={loading ? '…' : grades?.length ?? 0}
            sublabel={loading ? null : `${grades?.filter(g => g.isActive)?.length ?? 0} active`}
            to="/admin/subjects"
            colour={{ iconBg: 'bg-sky-50', icon: 'text-sky-600', value: 'text-navy-950', link: 'text-sky-600' }}
          />
        </div>

        {/* ── Bottom section: recent inquiries + quick actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent inquiries list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Recent Inquiries
              </h2>
              <Link
                to="/admin/inquiries"
                className="text-xs font-semibold text-academic-600 hover:text-academic-700 transition-colors"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Loading…</span>
              </div>
            ) : recentInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2 text-slate-400">
                <MessageSquare className="w-8 h-8" />
                <p className="text-sm font-medium">No inquiries yet.</p>
                <p className="text-xs text-center px-8">
                  When visitors submit tutoring requests, they'll appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentInquiries.map((inq) => (
                  <Link
                    key={inq._id}
                    to="/admin/inquiries"
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-academic-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-academic-700">
                      {inq.clientName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-950 truncate">{inq.clientName}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {inq.subject} • {inq.studentGrade}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <StatusBadge status={inq.status} />
                      <span className="text-[10px] text-slate-400">
                        {inq.createdAt
                          ? new Date(inq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                          : ''}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-navy-950 px-1">Quick Actions</h2>

            <QuickAction
              icon={User}
              title="Edit Profile & Content"
              description="Update name, bio, contact info, and social links."
              to="/admin/profile"
              colour={{ iconBg: 'bg-sky-50', icon: 'text-sky-600' }}
            />
            <QuickAction
              icon={MessageSquare}
              title="Manage Inquiries"
              description="View, respond to, and update status of tutoring requests."
              to="/admin/inquiries"
              colour={{ iconBg: 'bg-academic-50', icon: 'text-academic-600' }}
            />
            <QuickAction
              icon={Award}
              title="Manage Certificates"
              description="Add, edit, or upload academic certificates and awards."
              to="/admin/certificates"
              colour={{ iconBg: 'bg-gold-50', icon: 'text-gold-600' }}
            />
            <QuickAction
              icon={BookOpen}
              title="Subjects & Grades"
              description="Edit tutoring areas, topics, and available grade levels."
              to="/admin/subjects"
              colour={{ iconBg: 'bg-emerald-50', icon: 'text-emerald-600' }}
            />

            {/* Public site links */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 mt-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Public Pages</p>
              {[
                { label: 'Tutoring Page',          to: '/tutoring' },
                { label: 'Certificates Gallery',   to: '/certificates' },
                { label: 'Contact / Inquiry Form', to: '/contact' },
              ].map(({ label, to }) => (
                <a
                  key={to}
                  href={to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy-900 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
