import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Award, Plus, Pencil, Trash2, Eye, EyeOff, Download, X,
  Save, AlertTriangle, CheckCircle2, FileText, RefreshCw, ExternalLink
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'Academic',
  'Awards & Recognition',
  'Certificates & Training',
  'National Examination',
  'University',
  'Other',
];

const EMPTY_FORM = {
  title: '',
  category: 'Academic',
  issuingOrg: '',
  issueDate: '',
  description: '',
  fileUrl: '',
  thumbnailUrl: '',
  fileType: 'image',
  isPublic: true,
  isDownloadable: true,
  displayOrder: 0,
};

// ── Small helpers ─────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colours =
    type === 'success'
      ? 'bg-emerald-600 text-white'
      : type === 'error'
      ? 'bg-red-600 text-white'
      : 'bg-navy-900 text-white';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl ${colours} max-w-sm`}>
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
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
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Certificate Form Modal ────────────────────────────────────────────────────
function CertForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const isEdit = !!initial?._id;

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!form.issuingOrg.trim()) return;
    onSave(form);
  }

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const inputCls =
    'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-400 focus:border-transparent placeholder:text-slate-400 transition-shadow';
  const labelCls = 'block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-academic-50 border border-academic-100 flex items-center justify-center">
              <Award className="w-4.5 h-4.5 text-academic-600" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">
              {isEdit ? 'Edit Certificate' : 'Add New Certificate'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5 overflow-y-auto">
          {/* Title + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Title <span className="text-red-500">*</span></label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. University Gold Medal"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Category <span className="text-red-500">*</span></label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Issuing Org + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Issuing Organisation <span className="text-red-500">*</span></label>
              <input
                className={inputCls}
                value={form.issuingOrg}
                onChange={(e) => set('issuingOrg', e.target.value)}
                placeholder="e.g. Debre Tabor University"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Issue Date / Label</label>
              <input
                className={inputCls}
                value={form.issueDate}
                onChange={(e) => set('issueDate', e.target.value)}
                placeholder="e.g. 2024 or Graduation Convocation"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief description of this certificate or award…"
            />
          </div>

          {/* File URL + File Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className={labelCls}>
                Document URL
                <span className="ml-1 text-[10px] font-normal text-slate-400 normal-case">(image or PDF link)</span>
              </label>
              <input
                className={inputCls}
                value={form.fileUrl}
                onChange={(e) => set('fileUrl', e.target.value)}
                placeholder="https://… or /uploads/cert.pdf"
              />
            </div>
            <div>
              <label className={labelCls}>File Type</label>
              <select
                className={inputCls}
                value={form.fileType}
                onChange={(e) => set('fileType', e.target.value)}
              >
                <option value="image">Image</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className={labelCls}>
              Thumbnail URL
              <span className="ml-1 text-[10px] font-normal text-slate-400 normal-case">(optional — defaults to document URL)</span>
            </label>
            <input
              className={inputCls}
              value={form.thumbnailUrl}
              onChange={(e) => set('thumbnailUrl', e.target.value)}
              placeholder="https://… or /uploads/cert-thumb.jpg"
            />
          </div>

          {/* Display Order */}
          <div className="w-40">
            <label className={labelCls}>Display Order</label>
            <input
              type="number"
              className={inputCls}
              value={form.displayOrder}
              onChange={(e) => set('displayOrder', parseInt(e.target.value, 10) || 0)}
              min={0}
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4 pt-1">
            <button
              type="button"
              onClick={() => set('isPublic', !form.isPublic)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                form.isPublic
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              {form.isPublic ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              {form.isPublic ? 'Publicly Visible' : 'Hidden from Public'}
            </button>

            <button
              type="button"
              onClick={() => set('isDownloadable', !form.isDownloadable)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                form.isDownloadable
                  ? 'bg-academic-50 border-academic-200 text-academic-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <Download className={`w-4 h-4 ${form.isDownloadable ? 'text-academic-600' : 'text-slate-400'}`} />
              {form.isDownloadable ? 'Downloadable' : 'Download Disabled'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Admin Layout Shell ────────────────────────────────────────────────────────
// Removed — now using shared AdminLayout from components/admin/AdminLayout.jsx

// ── Certificate Row ───────────────────────────────────────────────────────────
function CertRow({ cert, onEdit, onDelete, onTogglePublic, onToggleDownload }) {
  const hasFile = cert.fileUrl && cert.fileUrl !== '#' && cert.fileUrl !== '';

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
      {/* Thumbnail */}
      <td className="px-4 py-3 w-12">
        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {cert.thumbnailUrl && cert.thumbnailUrl !== '' ? (
            <img
              src={cert.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <Award className="w-4 h-4 text-gold-400" />
          )}
        </div>
      </td>

      {/* Title + org */}
      <td className="px-4 py-3 min-w-0">
        <p className="text-sm font-bold text-navy-950 leading-snug truncate max-w-xs">{cert.title}</p>
        <p className="text-xs text-slate-500 truncate max-w-xs">{cert.issuingOrg}</p>
      </td>

      {/* Category */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide whitespace-nowrap">
          {cert.category}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-xs text-slate-500">{cert.issueDate || '—'}</span>
      </td>

      {/* File status */}
      <td className="px-4 py-3 hidden sm:table-cell">
        {hasFile ? (
          <a
            href={cert.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-academic-600 hover:text-academic-700"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>File</span>
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">No file</span>
        )}
      </td>

      {/* Visibility toggle */}
      <td className="px-4 py-3">
        <button
          onClick={() => onTogglePublic(cert)}
          title={cert.isPublic ? 'Click to hide from public' : 'Click to make public'}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {cert.isPublic ? (
            <Eye className="w-4 h-4 text-emerald-500" />
          ) : (
            <EyeOff className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </td>

      {/* Download toggle */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <button
          onClick={() => onToggleDownload(cert)}
          title={cert.isDownloadable ? 'Click to disable download' : 'Click to enable download'}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {cert.isDownloadable ? (
            <Download className="w-4 h-4 text-academic-500" />
          ) : (
            <Download className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(cert)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-academic-600 hover:bg-academic-50 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(cert)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCertificatesPage() {
  // Auth handled by shared AdminLayout
  const [certs, setCerts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [formOpen, setFormOpen]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);   // null = add, obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterCat, setFilterCat]   = useState('All');
  const [toast, setToast]           = useState(null);   // { message, type }

  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = useCallback(() => setToast(null), []);

  // Load all certificates (including hidden ones) for admin view
  async function loadCerts() {
    setLoading(true);
    const data = await api.getCertificatesAll();
    setCerts(data || []);
    setLoading(false);
  }

  useEffect(() => { loadCerts(); }, []);

  // ── CRUD handlers ──────────────────────────────────────────────────────────

  async function handleSave(formData) {
    setSaving(true);
    try {
      let res;
      if (editTarget?._id) {
        res = await api.updateCertificate(editTarget._id, formData);
      } else {
        res = await api.createCertificate(formData);
      }

      if (res?.success) {
        showToast(editTarget?._id ? 'Certificate updated.' : 'Certificate added.');
        setFormOpen(false);
        setEditTarget(null);
        await loadCerts();
      } else {
        showToast(res?.message || 'Save failed. Check required fields.', 'error');
      }
    } catch {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await api.deleteCertificate(deleteTarget._id);
      if (res?.success) {
        showToast('Certificate deleted.');
        await loadCerts();
      } else {
        showToast(res?.message || 'Delete failed.', 'error');
      }
    } catch {
      showToast('Delete failed unexpectedly.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleTogglePublic(cert) {
    const res = await api.updateCertificate(cert._id, { isPublic: !cert.isPublic });
    if (res?.success) {
      setCerts((prev) =>
        prev.map((c) => (c._id === cert._id ? { ...c, isPublic: !cert.isPublic } : c))
      );
    } else {
      showToast('Failed to update visibility.', 'error');
    }
  }

  async function handleToggleDownload(cert) {
    const res = await api.updateCertificate(cert._id, { isDownloadable: !cert.isDownloadable });
    if (res?.success) {
      setCerts((prev) =>
        prev.map((c) => (c._id === cert._id ? { ...c, isDownloadable: !cert.isDownloadable } : c))
      );
    } else {
      showToast('Failed to update download setting.', 'error');
    }
  }

  function openAdd() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(cert) {
    setEditTarget(cert);
    setFormOpen(true);
  }

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered =
    filterCat === 'All' ? certs : certs.filter((c) => c.category === filterCat);

  const publicCount = certs.filter((c) => c.isPublic).length;
  const hiddenCount = certs.length - publicCount;

  return (
    <AdminLayout title="Certificate Management">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/" className="hover:text-navy-900 transition-colors">Site</Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">Admin</span>
              <span>/</span>
              <span className="text-navy-950 font-semibold">Certificates</span>
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
              <Award className="w-6 h-6 text-gold-500" />
              Certificate Management
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Certificate
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total',    value: certs.length,  colour: 'text-navy-950', bg: 'bg-white' },
            { label: 'Public',   value: publicCount,   colour: 'text-emerald-600', bg: 'bg-white' },
            { label: 'Hidden',   value: hiddenCount,   colour: 'text-slate-500', bg: 'bg-white' },
            {
              label: 'With File',
              value: certs.filter((c) => c.fileUrl && c.fileUrl !== '#').length,
              colour: 'text-academic-600',
              bg: 'bg-white'
            },
          ].map(({ label, value, colour, bg }) => (
            <div key={label} className={`${bg} rounded-2xl border border-slate-200 px-5 py-4 shadow-sm`}>
              <span className={`text-3xl font-black ${colour} block`}>{value}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Category Filter Bar ── */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterCat === cat
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  ({certs.filter((c) => c.category === cat).length})
                </span>
              )}
            </button>
          ))}
          <button
            onClick={loadCerts}
            className="ml-auto p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Loading certificates…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-400">
              <Award className="w-12 h-12" />
              <p className="text-sm font-semibold">
                {filterCat === 'All' ? 'No certificates yet.' : `No certificates in "${filterCat}".`}
              </p>
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add the first one
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3 w-12"></th>
                    <th className="px-4 py-3">Title / Organisation</th>
                    <th className="px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 hidden sm:table-cell">File</th>
                    <th className="px-4 py-3">Visible</th>
                    <th className="px-4 py-3 hidden sm:table-cell">DL</th>
                    <th className="px-4 py-3 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cert) => (
                    <CertRow
                      key={cert._id}
                      cert={cert}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                      onTogglePublic={handleTogglePublic}
                      onToggleDownload={handleToggleDownload}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Usage note ── */}
        <p className="text-xs text-slate-400 text-center">
          Certificate files (images or PDFs) can be hosted on any URL — paste the direct link in the "Document URL" field.
          The public gallery at <Link to="/certificates" className="text-academic-500 hover:underline">/certificates</Link> will
          update automatically.
        </p>
      </div>

      {/* ── Form Modal ── */}
      {formOpen && (
        <CertForm
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          saving={saving}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </AdminLayout>
  );
}
