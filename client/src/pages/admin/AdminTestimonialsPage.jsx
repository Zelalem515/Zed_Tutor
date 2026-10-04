import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  MessageSquare, RefreshCw, Trash2, Pencil, X, Save,
  CheckCircle2, AlertTriangle, ShieldCheck, Pin, PinOff,
  Eye, EyeOff, ThumbsUp, Clock
} from 'lucide-react';

// ── Constants ────────────────────────────────────────────────────────────────
const STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

const STATUS_STYLES = {
  PENDING:  { pill: 'bg-amber-100 text-amber-700 border-amber-200',   dot: 'bg-amber-500'   },
  APPROVED: { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  REJECTED: { pill: 'bg-red-100 text-red-600 border-red-200',         dot: 'bg-red-500'     },
};

const RELATIONSHIPS = [
  'Lecturer', 'Academic Advisor', 'Project Supervisor', 'Classmate',
  'Teacher', 'Student', 'Parent', 'Employer/Colleague', 'Friend', 'Other'
];

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ── Shared UI helpers ────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl max-w-sm ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
}

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
            <p className="text-sm text-slate-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit / Detail Drawer ─────────────────────────────────────────────────────
function TestimonialDrawer({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    authorName:       item.authorName       || '',
    relationship:     item.relationship     || 'Other',
    organization:     item.organization     || '',
    message:          item.message          || '',
    status:           item.status           || 'PENDING',
    isVerifiedWitness: item.isVerifiedWitness ?? false,
    isPinned:         item.isPinned         ?? false,
    adminNotes:       item.adminNotes       || '',
    displayOrder:     item.displayOrder     ?? 0,
  });
  const [dirty, setDirty] = useState(false);
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setDirty(true); };

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const inputCls  = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-academic-400 focus:border-transparent';
  const labelCls  = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-academic-50 border border-academic-100 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-academic-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Testimonial Detail</p>
              <h3 className="text-sm font-bold text-navy-950 truncate">{item.authorName}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata strip */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-3">
          <StatusBadge status={item.status} />
          {item.helpfulCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <ThumbsUp className="w-3 h-3" /> {item.helpfulCount} helpful
            </span>
          )}
          <span className="text-[11px] text-slate-400">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
          </span>
        </div>

        {/* Form */}
        <div className="flex-1 p-6 space-y-5">

          {/* Status row */}
          <div>
            <label className={labelCls}>Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button key={s} type="button"
                  onClick={() => set('status', s)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    form.status === s
                      ? STATUS_STYLES[s].pill + ' ring-2 ring-offset-1 ring-current'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-3">
            <button type="button"
              onClick={() => set('isVerifiedWitness', !form.isVerifiedWitness)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                form.isVerifiedWitness
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
              <ShieldCheck className="w-4 h-4" />
              {form.isVerifiedWitness ? 'Verified Witness' : 'Not Verified'}
            </button>
            <button type="button"
              onClick={() => set('isPinned', !form.isPinned)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                form.isPinned
                  ? 'bg-academic-50 border-academic-200 text-academic-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
              {form.isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
              {form.isPinned ? 'Pinned / Featured' : 'Not Pinned'}
            </button>
          </div>

          {/* Author name + relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Author Name</label>
              <input className={inputCls} value={form.authorName} maxLength={100}
                onChange={e => set('authorName', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Relationship</label>
              <select className={inputCls} value={form.relationship} onChange={e => set('relationship', e.target.value)}>
                {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Organisation + display order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Organisation</label>
              <input className={inputCls} value={form.organization} maxLength={120}
                onChange={e => set('organization', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" min={0} className={inputCls}
                value={form.displayOrder} onChange={e => set('displayOrder', Number(e.target.value))} />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className={labelCls}>Message</label>
            <textarea rows={5} maxLength={1500} className={`${inputCls} resize-none`}
              value={form.message} onChange={e => set('message', e.target.value)} />
            <p className="text-[11px] text-slate-400 text-right mt-1">{form.message.length} / 1500</p>
          </div>

          {/* Submitter contact (read-only — for reference only) */}
          {(item.email || item.phone) && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Submitter Contact (Private)</p>
              {item.email && <p className="text-xs text-slate-600">{item.email}</p>}
              {item.phone && <p className="text-xs text-slate-600">{item.phone}</p>}
            </div>
          )}

          {/* Admin notes */}
          <div>
            <label className={labelCls}>Admin Notes <span className="font-normal text-slate-400 normal-case">(private — never shown publicly)</span></label>
            <textarea rows={3} maxLength={1000} className={`${inputCls} resize-none`}
              value={form.adminNotes} onChange={e => set('adminNotes', e.target.value)}
              placeholder="Internal notes, verification steps, follow-up reminders…" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Close</button>
          <button onClick={() => onSave(item._id, form)} disabled={!dirty || saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-50 rounded-xl transition-colors">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selected,     setSelected]     = useState(null);
  const [deleteTgt,    setDeleteTgt]    = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = useCallback(() => setToast(null), []);

  async function load() {
    setLoading(true);
    const res = await api.getTestimonialsAll();
    setTestimonials(res?.data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave(id, form) {
    setSaving(true);
    const res = await api.updateTestimonial(id, form);
    if (res?.success) {
      setTestimonials(prev => prev.map(t => t._id === id ? { ...t, ...form } : t));
      setSelected(prev => prev?._id === id ? { ...prev, ...form } : prev);
      showToast('Testimonial updated.');
    } else {
      showToast(res?.message || 'Update failed.', 'error');
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTgt) return;
    const res = await api.deleteTestimonial(deleteTgt._id);
    if (res?.success) {
      setTestimonials(prev => prev.filter(t => t._id !== deleteTgt._id));
      if (selected?._id === deleteTgt._id) setSelected(null);
      showToast('Testimonial deleted.');
    } else {
      showToast(res?.message || 'Delete failed.', 'error');
    }
    setDeleteTgt(null);
  }

  // Inline quick-status from table
  async function quickStatus(t, status) {
    const res = await api.updateTestimonial(t._id, { status });
    if (res?.success) {
      setTestimonials(prev => prev.map(x => x._id === t._id ? { ...x, status } : x));
    } else showToast('Status update failed.', 'error');
  }

  // Inline pin toggle
  async function quickPin(t) {
    const isPinned = !t.isPinned;
    const res = await api.updateTestimonial(t._id, { isPinned });
    if (res?.success) {
      setTestimonials(prev => prev.map(x => x._id === t._id ? { ...x, isPinned } : x));
    } else showToast('Pin toggle failed.', 'error');
  }

  const filtered = filterStatus === 'ALL' ? testimonials : testimonials.filter(t => t.status === filterStatus);
  const counts   = { ALL: testimonials.length, ...STATUSES.reduce((a, s) => ({ ...a, [s]: testimonials.filter(t => t.status === s).length }), {}) };

  return (
    <AdminLayout title="Testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/admin" className="hover:text-navy-900">Admin</Link>
              <span>/</span>
              <span className="text-navy-950 font-semibold">Testimonials</span>
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-academic-600" />
              Testimonial Moderation
            </h1>
          </div>
          <button onClick={load}
            className="p-2.5 rounded-xl text-slate-400 hover:text-navy-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',    value: counts.ALL,      colour: 'text-navy-950'    },
            { label: 'Pending',  value: counts.PENDING,  colour: 'text-amber-600'   },
            { label: 'Approved', value: counts.APPROVED, colour: 'text-emerald-600' },
            { label: 'Rejected', value: counts.REJECTED, colour: 'text-red-600'     },
          ].map(({ label, value, colour }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm text-center">
              <span className={`text-2xl font-black ${colour} block`}>{value}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2">
          {['ALL', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                filterStatus === s
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>
              {s === 'ALL' ? 'All' : s}
              <span className="ml-1.5 opacity-60">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Loading testimonials…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <MessageSquare className="w-10 h-10" />
              <p className="text-sm font-semibold">{filterStatus === 'ALL' ? 'No testimonials yet.' : `No ${filterStatus} testimonials.`}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3 hidden md:table-cell">Relationship</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Message</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Flags</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3 w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => setSelected(t)}>
                      {/* Author */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-academic-100 flex items-center justify-center text-xs font-bold text-academic-700 flex-shrink-0">
                            {t.authorName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-navy-950 truncate max-w-[130px]">{t.authorName}</p>
                            {t.organization && <p className="text-[11px] text-slate-400 truncate max-w-[130px]">{t.organization}</p>}
                          </div>
                        </div>
                      </td>
                      {/* Relationship */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-600">{t.relationship}</span>
                      </td>
                      {/* Message preview */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-xs text-slate-500 line-clamp-2 max-w-[220px]">{t.message}</p>
                      </td>
                      {/* Status — click-through to drawer */}
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={t.status} />
                        </div>
                      </td>
                      {/* Flags */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          {t.isVerifiedWitness && (
                            <span title="Verified Witness">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            </span>
                          )}
                          {t.isPinned && (
                            <span title="Pinned">
                              <Pin className="w-4 h-4 text-academic-500" />
                            </span>
                          )}
                          {t.helpfulCount > 0 && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                              <ThumbsUp className="w-3 h-3" />{t.helpfulCount}
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-400">
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          {/* Quick approve/reject */}
                          {t.status !== 'APPROVED' && (
                            <button onClick={() => quickStatus(t, 'APPROVED')}
                              title="Approve" className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {t.status !== 'REJECTED' && (
                            <button onClick={() => quickStatus(t, 'REJECTED')}
                              title="Reject" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}
                          {/* Pin toggle */}
                          <button onClick={() => quickPin(t)}
                            title={t.isPinned ? 'Unpin' : 'Pin'}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-academic-600 hover:bg-academic-50 transition-colors">
                            {t.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                          </button>
                          {/* Edit */}
                          <button onClick={() => setSelected(t)}
                            title="Edit" className="p-1.5 rounded-lg text-slate-500 hover:text-academic-600 hover:bg-academic-50 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button onClick={() => setDeleteTgt(t)}
                            title="Delete" className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
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
          Click any row to open the full detail drawer. Use quick-action icons on hover to approve, reject, or pin without opening the drawer.
        </p>
      </div>

      {/* Drawer */}
      {selected && (
        <TestimonialDrawer item={selected} onClose={() => setSelected(null)} onSave={handleSave} saving={saving} />
      )}

      {/* Delete confirm */}
      {deleteTgt && (
        <ConfirmDialog
          message={`Delete testimonial from "${deleteTgt.authorName}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTgt(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </AdminLayout>
  );
}
