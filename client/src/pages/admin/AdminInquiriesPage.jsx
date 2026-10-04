import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  MessageSquare, RefreshCw, Trash2,
  X, CheckCircle2, AlertTriangle,
  Phone, Mail, BookOpen, Clock, User, Tag, SlidersHorizontal
} from 'lucide-react';

// ── Constants ────────────────────────────────────────────────────────────────
const STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];

const STATUS_STYLES = {
  NEW:         { pill: 'bg-blue-100 text-blue-700 border-blue-200',     dot: 'bg-blue-500'    },
  CONTACTED:   { pill: 'bg-amber-100 text-amber-700 border-amber-200',   dot: 'bg-amber-500'   },
  IN_PROGRESS: { pill: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  COMPLETED:   { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  CLOSED:      { pill: 'bg-slate-100 text-slate-500 border-slate-200',   dot: 'bg-slate-400'   },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.NEW;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ── Toast notification ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl max-w-sm ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success'
        ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        : <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      }
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Confirm dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-950">Confirm Delete</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inquiry Detail Drawer ────────────────────────────────────────────────────
function InquiryDrawer({ inquiry, onClose, onStatusChange, onNotesChange, saving }) {
  const [notes, setNotes] = useState(inquiry.adminNotes || '');
  const [status, setStatus] = useState(inquiry.status);
  const [dirty, setDirty] = useState(false);

  // Escape to close
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  function handleSave() {
    onStatusChange(inquiry._id, status, notes);
    setDirty(false);
  }

  const Field = ({ icon: Icon, label, value }) => (
    value ? (
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-3.5 h-3.5 text-slate-500" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-sm text-slate-800 mt-0.5 leading-relaxed break-words">{value}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-academic-50 border border-academic-100 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-academic-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiry Detail</p>
              <h3 className="text-sm font-bold text-navy-950 truncate">{inquiry.clientName}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Status badge + received date */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <StatusBadge status={inquiry.status} />
            <span className="text-xs text-slate-400">
              {new Date(inquiry.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>

          {/* Core details */}
          <div className="space-y-4">
            <Field icon={User}      label="Name"            value={`${inquiry.clientName} (${inquiry.clientRole})`} />
            <Field icon={BookOpen}  label="Grade Level"     value={inquiry.studentGrade} />
            <Field icon={Tag}       label="Subject"         value={inquiry.subject} />
            <Field icon={SlidersHorizontal} label="Mode"   value={inquiry.mode} />
            <Field icon={Phone}     label="Phone / WhatsApp" value={inquiry.phoneOrWhatsApp} />
            <Field icon={Mail}      label="Email"           value={inquiry.email} />
            <Field icon={Clock}     label="Preferred Schedule" value={inquiry.preferredSchedule} />
            <Field icon={BookOpen}  label="Topics / Struggles" value={inquiry.topicStruggles} />
            <Field icon={MessageSquare} label="Message"    value={inquiry.message} />
          </div>

          {/* Status control */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Update Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatus(s); setDirty(true); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    status === s
                      ? STATUS_STYLES[s].pill + ' ring-2 ring-offset-1 ring-current'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Admin Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setDirty(true); }}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-400 resize-none placeholder:text-slate-400"
              placeholder="Internal notes, follow-up reminders, schedule agreed…"
            />
          </div>
        </div>

        {/* Sticky footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AdminInquiriesPage() {
  // Auth handled by shared AdminLayout

  const [inquiries, setInquiries]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selected, setSelected]         = useState(null); // open drawer
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast  = (message, type = 'success') => setToast({ message, type });
  const hideToast  = useCallback(() => setToast(null), []);

  async function loadInquiries() {
    setLoading(true);
    const res = await api.getInquiriesAll();
    setInquiries(res?.data || []);
    setLoading(false);
  }

  useEffect(() => { loadInquiries(); }, []);

  async function handleStatusChange(id, status, adminNotes) {
    setSaving(true);
    const res = await api.updateInquiry(id, { status, adminNotes });
    if (res?.success) {
      setInquiries((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status, adminNotes } : i))
      );
      // keep drawer in sync
      setSelected((prev) => prev?._id === id ? { ...prev, status, adminNotes } : prev);
      showToast('Inquiry updated.');
    } else {
      showToast(res?.message || 'Update failed.', 'error');
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await api.deleteInquiry(deleteTarget._id);
    if (res?.success) {
      setInquiries((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      if (selected?._id === deleteTarget._id) setSelected(null);
      showToast('Inquiry deleted.');
    } else {
      showToast(res?.message || 'Delete failed.', 'error');
    }
    setDeleteTarget(null);
  }

  // Quick inline status change from the table row
  async function quickStatus(inquiry, newStatus) {
    const res = await api.updateInquiry(inquiry._id, { status: newStatus });
    if (res?.success) {
      setInquiries((prev) =>
        prev.map((i) => (i._id === inquiry._id ? { ...i, status: newStatus } : i))
      );
    } else {
      showToast('Status update failed.', 'error');
    }
  }

  const filtered = filterStatus === 'ALL'
    ? inquiries
    : inquiries.filter((i) => i.status === filterStatus);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = inquiries.filter((i) => i.status === s).length;
    return acc;
  }, {});

  return (
    <AdminLayout title="Tutoring Inquiries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/" className="hover:text-navy-900 transition-colors">Site</Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">Admin</span>
              <span>/</span>
              <span className="text-navy-950 font-semibold">Inquiries</span>
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-academic-600" />
              Tutoring Inquiries
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/subjects"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-colors"
            >
              Manage Subjects
            </Link>
            <button
              onClick={loadInquiries}
              className="p-2.5 rounded-xl text-slate-400 hover:text-navy-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total',       value: inquiries.length, colour: 'text-navy-950' },
            { label: 'New',         value: counts.NEW || 0,         colour: 'text-blue-600' },
            { label: 'Contacted',   value: counts.CONTACTED || 0,   colour: 'text-amber-600' },
            { label: 'In Progress', value: counts.IN_PROGRESS || 0, colour: 'text-indigo-600' },
            { label: 'Completed',   value: counts.COMPLETED || 0,   colour: 'text-emerald-600' },
            { label: 'Closed',      value: counts.CLOSED || 0,      colour: 'text-slate-500' },
          ].map(({ label, value, colour }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 px-4 py-4 shadow-sm text-center">
              <span className={`text-2xl font-black ${colour} block`}>{value}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Status Filter ── */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                filterStatus === s
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s === 'ALL' ? 'All' : s}
              <span className="ml-1.5 opacity-60">
                ({s === 'ALL' ? inquiries.length : counts[s] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* ── Inquiry Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Loading inquiries…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
              <MessageSquare className="w-10 h-10" />
              <p className="text-sm font-semibold">
                {filterStatus === 'ALL' ? 'No inquiries yet.' : `No ${filterStatus} inquiries.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Name / Role</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Grade</th>
                    <th className="px-4 py-3 hidden md:table-cell">Subject</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Mode</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Contact</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Received</th>
                    <th className="px-4 py-3 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inq) => (
                    <tr
                      key={inq._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => setSelected(inq)}
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-navy-950 leading-snug">{inq.clientName}</p>
                        <p className="text-xs text-slate-400">{inq.clientRole}</p>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs font-semibold text-slate-700">{inq.studentGrade}</span>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-600 max-w-[120px] truncate block">{inq.subject}</span>
                      </td>

                      {/* Mode */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-500">{inq.mode}</span>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-xs font-mono text-slate-700 truncate max-w-[120px]">{inq.phoneOrWhatsApp}</p>
                      </td>

                      {/* Status — click cycles through statuses */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative group/status">
                          <StatusBadge status={inq.status} />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-400">
                          {new Date(inq.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short'
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          {/* Quick status dropdown */}
                          <select
                            value={inq.status}
                            onChange={(e) => quickStatus(inq, e.target.value)}
                            className="text-[10px] font-bold px-1.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none cursor-pointer"
                            title="Change status"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setDeleteTarget(inq)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center">
          Click any row to open the full detail drawer. Status changes save immediately via the inline dropdown or the detail panel.
        </p>
      </div>

      {/* ── Detail Drawer ── */}
      {selected && (
        <InquiryDrawer
          inquiry={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onNotesChange={() => {}}
          saving={saving}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete inquiry from "${deleteTarget.clientName}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </AdminLayout>
  );
}
