import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, X, Save,
  RefreshCw, AlertTriangle, CheckCircle2,
  ExternalLink, Hash
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const SUBJECT_CATEGORIES = [
  'Mathematics',
  'Computer / ICT',
  'Programming',
  'Web Development',
  'General Computer Skills',
  'Other',
];

const EMPTY_SUBJECT = {
  name: '',
  category: 'Mathematics',
  shortDescription: '',
  gradeRange: 'Grades 5–12',
  topics: '',        // comma-separated in form, converted to array on save
  displayOrder: 0,
  isActive: true,
};

const EMPTY_GRADE = {
  label: '',
  numericValue: '',
  isActive: true,
  displayOrder: 0,
};

// ── Shared helpers ────────────────────────────────────────────────────────────

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
        : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
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
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Subject Form Modal ────────────────────────────────────────────────────────
function SubjectForm({ initial, onSave, onClose, saving }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(
    initial
      ? { ...initial, topics: Array.isArray(initial.topics) ? initial.topics.join(', ') : initial.topics || '' }
      : EMPTY_SUBJECT
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.shortDescription.trim()) return;
    // Convert comma-separated topics string → array
    const topicsArray = form.topics
      ? form.topics.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    onSave({ ...form, topics: topicsArray });
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-400 focus:border-transparent placeholder:text-slate-400';
  const labelCls = 'block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-academic-50 border border-academic-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-academic-600" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">
              {isEdit ? 'Edit Subject' : 'Add New Subject'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {/* Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name <span className="text-red-500">*</span></label>
              <input className={inputCls} required value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category}
                onChange={(e) => set('category', e.target.value)}>
                {SUBJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Short Description <span className="text-red-500">*</span></label>
            <textarea className={`${inputCls} resize-none`} rows={3} required
              value={form.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
              placeholder="Brief description of what this subject covers…" />
          </div>

          {/* Grade range + display order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Grade Range</label>
              <input className={inputCls} value={form.gradeRange}
                onChange={(e) => set('gradeRange', e.target.value)}
                placeholder="e.g. Grades 5–12" />
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" min={0} className={inputCls}
                value={form.displayOrder}
                onChange={(e) => set('displayOrder', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className={labelCls}>
              Topics
              <span className="ml-1 text-[10px] font-normal text-slate-400 normal-case">
                (comma-separated)
              </span>
            </label>
            <textarea className={`${inputCls} resize-none`} rows={3}
              value={form.topics}
              onChange={(e) => set('topics', e.target.value)}
              placeholder="Algebra & Expressions, Geometry, Functions & Graphs, Trigonometry" />
          </div>

          {/* Visibility toggle */}
          <button
            type="button"
            onClick={() => set('isActive', !form.isActive)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              form.isActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            {form.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {form.isActive ? 'Active (visible on site)' : 'Hidden from public'}
          </button>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-60 transition-colors">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Grade Form Modal ──────────────────────────────────────────────────────────
function GradeForm({ initial, onSave, onClose, saving }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(initial || EMPTY_GRADE);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.label.trim() || form.numericValue === '') return;
    onSave({ ...form, numericValue: Number(form.numericValue), displayOrder: Number(form.displayOrder) || Number(form.numericValue) });
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-400 placeholder:text-slate-400';
  const labelCls = 'block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
            <Hash className="w-5 h-5 text-academic-600" />
            {isEdit ? 'Edit Grade Level' : 'Add Grade Level'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Label <span className="text-red-500">*</span></label>
            <input className={inputCls} required value={form.label}
              onChange={(e) => set('label', e.target.value)}
              placeholder="e.g. Grade 9" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Numeric Value <span className="text-red-500">*</span></label>
              <input type="number" min={1} className={inputCls} required
                value={form.numericValue}
                onChange={(e) => set('numericValue', e.target.value)}
                placeholder="9" />
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" min={0} className={inputCls}
                value={form.displayOrder}
                onChange={(e) => set('displayOrder', e.target.value)} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => set('isActive', !form.isActive)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              form.isActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            {form.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {form.isActive ? 'Active' : 'Hidden'}
          </button>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-60 transition-colors">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : isEdit ? 'Save' : 'Add Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminSubjectsPage() {
  // Auth handled by shared AdminLayout

  // Subjects state
  const [subjects,      setSubjects]      = useState([]);
  const [subLoading,    setSubLoading]    = useState(true);
  const [subSaving,     setSubSaving]     = useState(false);
  const [subFormOpen,   setSubFormOpen]   = useState(false);
  const [subEditTarget, setSubEditTarget] = useState(null);
  const [subDeleteTgt,  setSubDeleteTgt]  = useState(null);

  // Grades state
  const [grades,        setGrades]        = useState([]);
  const [gradeLoading,  setGradeLoading]  = useState(true);
  const [gradeSaving,   setGradeSaving]   = useState(false);
  const [gradeFormOpen, setGradeFormOpen] = useState(false);
  const [gradeEditTgt,  setGradeEditTgt]  = useState(null);
  const [gradeDeleteTgt,setGradeDeleteTgt]= useState(null);

  const [toast, setToast] = useState(null);
  const showToast  = (message, type = 'success') => setToast({ message, type });
  const hideToast  = useCallback(() => setToast(null), []);

  // ── Load ──────────────────────────────────────────────────────────────────
  async function loadSubjects() {
    setSubLoading(true);
    const res = await api.getSubjects(true); // all=true shows hidden too
    setSubjects(res || []);
    setSubLoading(false);
  }

  async function loadGrades() {
    setGradeLoading(true);
    const res = await api.getGradesAll();
    setGrades(res || []);
    setGradeLoading(false);
  }

  useEffect(() => {
    loadSubjects();
    loadGrades();
  }, []);

  // ── Subject CRUD ─────────────────────────────────────────────────────────
  async function handleSubjectSave(formData) {
    setSubSaving(true);
    try {
      let res;
      if (subEditTarget?._id) {
        res = await api.updateSubject(subEditTarget._id, formData);
      } else {
        res = await api.createSubject(formData);
      }
      if (res?.success) {
        showToast(subEditTarget?._id ? 'Subject updated.' : 'Subject added.');
        setSubFormOpen(false);
        setSubEditTarget(null);
        await loadSubjects();
      } else {
        showToast(res?.message || 'Save failed.', 'error');
      }
    } catch {
      showToast('Unexpected error.', 'error');
    } finally {
      setSubSaving(false);
    }
  }

  async function handleSubjectDelete() {
    if (!subDeleteTgt) return;
    const res = await api.deleteSubject(subDeleteTgt._id);
    if (res?.success) {
      showToast('Subject deleted.');
      await loadSubjects();
    } else {
      showToast(res?.message || 'Delete failed.', 'error');
    }
    setSubDeleteTgt(null);
  }

  async function toggleSubjectActive(sub) {
    const res = await api.updateSubject(sub._id, { isActive: !sub.isActive });
    if (res?.success) {
      setSubjects((prev) => prev.map((s) => s._id === sub._id ? { ...s, isActive: !sub.isActive } : s));
    } else {
      showToast('Toggle failed.', 'error');
    }
  }

  // ── Grade CRUD ────────────────────────────────────────────────────────────
  async function handleGradeSave(formData) {
    setGradeSaving(true);
    try {
      let res;
      if (gradeEditTgt?._id) {
        res = await api.updateGrade(gradeEditTgt._id, formData);
      } else {
        res = await api.createGrade(formData);
      }
      if (res?.success) {
        showToast(gradeEditTgt?._id ? 'Grade updated.' : 'Grade added.');
        setGradeFormOpen(false);
        setGradeEditTgt(null);
        await loadGrades();
      } else {
        showToast(res?.message || 'Save failed.', 'error');
      }
    } catch {
      showToast('Unexpected error.', 'error');
    } finally {
      setGradeSaving(false);
    }
  }

  async function handleGradeDelete() {
    if (!gradeDeleteTgt) return;
    const res = await api.deleteGrade(gradeDeleteTgt._id);
    if (res?.success) {
      showToast('Grade deleted.');
      await loadGrades();
    } else {
      showToast(res?.message || 'Delete failed.', 'error');
    }
    setGradeDeleteTgt(null);
  }

  async function toggleGradeActive(grade) {
    const res = await api.updateGrade(grade._id, { isActive: !grade.isActive });
    if (res?.success) {
      setGrades((prev) => prev.map((g) => g._id === grade._id ? { ...g, isActive: !grade.isActive } : g));
    } else {
      showToast('Toggle failed.', 'error');
    }
  }

  return (
    <AdminLayout title="Subjects & Grade Levels">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/" className="hover:text-navy-900 transition-colors">Site</Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">Admin</span>
              <span>/</span>
              <span className="text-navy-950 font-semibold">Subjects & Grades</span>
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-academic-600" />
              Subjects & Grade Levels
            </h1>
          </div>
          <Link
            to="/admin/inquiries"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-colors"
          >
            View Inquiries
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SUBJECTS SECTION                                                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-950">Tutoring Subjects</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These appear on the public Tutoring page and in the Contact inquiry form.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadSubjects} className="p-2 rounded-xl text-slate-400 hover:text-navy-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setSubEditTarget(null); setSubFormOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {subLoading ? (
              <div className="flex items-center justify-center py-16 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm font-medium">Loading subjects…</span>
              </div>
            ) : subjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
                <BookOpen className="w-10 h-10" />
                <p className="text-sm font-semibold">No subjects yet.</p>
                <button
                  onClick={() => { setSubEditTarget(null); setSubFormOpen(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-navy-900 rounded-xl"
                >
                  <Plus className="w-4 h-4" />Add the first one
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3 hidden md:table-cell">Category</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Grade Range</th>
                      <th className="px-4 py-3 hidden sm:table-cell">Topics</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Active</th>
                      <th className="px-4 py-3 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((sub) => (
                      <tr key={sub._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-navy-950">{sub.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 max-w-[180px]">{sub.shortDescription}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-academic-50 text-academic-700 border border-academic-100">
                            {sub.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-slate-500">{sub.gradeRange}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs text-slate-500">
                            {sub.topics?.length > 0 ? `${sub.topics.length} topics` : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-slate-500">{sub.displayOrder}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleSubjectActive(sub)}
                            title={sub.isActive ? 'Click to hide' : 'Click to show'}
                            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            {sub.isActive
                              ? <Eye className="w-4 h-4 text-emerald-500" />
                              : <EyeOff className="w-4 h-4 text-slate-400" />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setSubEditTarget(sub); setSubFormOpen(true); }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-academic-600 hover:bg-academic-50 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSubDeleteTgt(sub)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
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
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* GRADE LEVELS SECTION                                              */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-950">Grade Levels</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These populate the grade dropdown on the Contact inquiry form and the Tutoring page.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadGrades} className="p-2 rounded-xl text-slate-400 hover:text-navy-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setGradeEditTgt(null); setGradeFormOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Grade
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {gradeLoading ? (
              <div className="flex items-center justify-center py-16 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm font-medium">Loading grades…</span>
              </div>
            ) : grades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
                <Hash className="w-10 h-10" />
                <p className="text-sm font-semibold">No grade levels yet.</p>
                <button
                  onClick={() => { setGradeEditTgt(null); setGradeFormOpen(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-navy-900 rounded-xl"
                >
                  <Plus className="w-4 h-4" />Add the first one
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Label</th>
                      <th className="px-4 py-3">Numeric</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Active</th>
                      <th className="px-4 py-3 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade) => (
                      <tr key={grade._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold text-navy-950">{grade.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono text-slate-600">{grade.numericValue}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-slate-500">{grade.displayOrder}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleGradeActive(grade)}
                            title={grade.isActive ? 'Click to hide' : 'Click to show'}
                            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            {grade.isActive
                              ? <Eye className="w-4 h-4 text-emerald-500" />
                              : <EyeOff className="w-4 h-4 text-slate-400" />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setGradeEditTgt(grade); setGradeFormOpen(true); }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-academic-600 hover:bg-academic-50 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setGradeDeleteTgt(grade)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
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

          <p className="text-xs text-slate-400">
            Hiding a grade removes it from the public inquiry form. Deleting is permanent — add it back manually if needed.
          </p>
        </section>

      </div>

      {/* ── Subject Form Modal ── */}
      {subFormOpen && (
        <SubjectForm
          initial={subEditTarget}
          onSave={handleSubjectSave}
          onClose={() => { setSubFormOpen(false); setSubEditTarget(null); }}
          saving={subSaving}
        />
      )}

      {/* ── Grade Form Modal ── */}
      {gradeFormOpen && (
        <GradeForm
          initial={gradeEditTgt}
          onSave={handleGradeSave}
          onClose={() => { setGradeFormOpen(false); setGradeEditTgt(null); }}
          saving={gradeSaving}
        />
      )}

      {/* ── Confirm Dialogs ── */}
      {subDeleteTgt && (
        <ConfirmDialog
          message={`Delete subject "${subDeleteTgt.name}"? This cannot be undone.`}
          onConfirm={handleSubjectDelete}
          onCancel={() => setSubDeleteTgt(null)}
        />
      )}
      {gradeDeleteTgt && (
        <ConfirmDialog
          message={`Delete grade level "${gradeDeleteTgt.label}"? This cannot be undone.`}
          onConfirm={handleGradeDelete}
          onCancel={() => setGradeDeleteTgt(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </AdminLayout>
  );
}
