import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Video as VideoIcon, Plus, Pencil, Trash2, Eye, EyeOff,
  X, Save, RefreshCw, AlertTriangle, CheckCircle2,
  ExternalLink, Play
} from 'lucide-react';

// ── Safe embed URL (mirrors public VideosPage) ───────────────────────────────
function buildEmbedUrl(platform, embedId) {
  if (!embedId) return null;
  if (platform === 'YouTube') return `https://www.youtube-nocookie.com/embed/${embedId}?rel=0`;
  if (platform === 'Vimeo')   return `https://player.vimeo.com/video/${embedId}?title=0&byline=0`;
  return null;
}

const EMPTY_FORM = {
  title:        '',
  platform:     'YouTube',
  videoUrl:     '',
  description:  '',
  thumbnailUrl: '',
  displayOrder: 0,
  isPublished:  true,
};

// ── Shared helpers ────────────────────────────────────────────────────────────
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

// ── Video Form Modal ─────────────────────────────────────────────────────────
function VideoForm({ initial, onSave, onClose, saving }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(initial ? {
    title:        initial.title        || '',
    platform:     initial.platform     || 'YouTube',
    videoUrl:     initial.videoUrl     || '',
    description:  initial.description  || '',
    thumbnailUrl: initial.thumbnailUrl || '',
    displayOrder: initial.displayOrder ?? 0,
    isPublished:  initial.isPublished  ?? true,
  } : EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-academic-400 focus:border-transparent placeholder:text-slate-400';
  const labelCls = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5';

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.videoUrl.trim()) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-academic-50 border border-academic-100 flex items-center justify-center">
              <VideoIcon className="w-4 h-4 text-academic-600" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">{isEdit ? 'Edit Video' : 'Add Promotional Video'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">

          {/* Title */}
          <div>
            <label className={labelCls}>Title <span className="text-red-500">*</span></label>
            <input className={inputCls} required value={form.title}
              onChange={e => set('title', e.target.value)} placeholder="e.g. Welcome to ZED_Tutor" />
          </div>

          {/* Platform + Video URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Platform</label>
              <select className={inputCls} value={form.platform} onChange={e => set('platform', e.target.value)}>
                <option value="YouTube">YouTube</option>
                <option value="Vimeo">Vimeo</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Video URL <span className="text-red-500">*</span></label>
              <input className={inputCls} required type="url" value={form.videoUrl}
                onChange={e => set('videoUrl', e.target.value)}
                placeholder={form.platform === 'YouTube' ? 'https://www.youtube.com/watch?v=...' : 'https://vimeo.com/123456789'} />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            The embed ID will be extracted automatically from the URL on the server.
            Only YouTube and Vimeo URLs are supported — no other platforms.
          </p>

          {/* Description */}
          <div>
            <label className={labelCls}>Short Description</label>
            <textarea rows={3} className={`${inputCls} resize-none`} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief description of what this video covers…" />
          </div>

          {/* Thumbnail + order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Thumbnail URL <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
              <input className={inputCls} type="url" value={form.thumbnailUrl}
                onChange={e => set('thumbnailUrl', e.target.value)}
                placeholder="https://…/thumbnail.jpg" />
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" min={0} className={inputCls} value={form.displayOrder}
                onChange={e => set('displayOrder', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          {/* Published toggle */}
          <button type="button" onClick={() => set('isPublished', !form.isPublished)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              form.isPublished
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
            {form.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {form.isPublished ? 'Active (visible publicly)' : 'Inactive (hidden)'}
          </button>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-60 transition-colors">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Preview modal ─────────────────────────────────────────────────────────────
function PreviewModal({ video, onClose }) {
  const embedUrl = buildEmbedUrl(video.platform, video.embedId);
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{video.platform} Preview</p>
            <h3 className="text-base font-bold text-navy-950 mt-0.5">{video.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative aspect-video bg-navy-950">
          {embedUrl ? (
            <iframe src={embedUrl} title={video.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Play className="w-10 h-10" />
              <p className="text-sm font-medium">No embed ID available — save the video first.</p>
            </div>
          )}
        </div>
        {video.description && (
          <div className="px-5 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">{video.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminVideosPage() {
  const [videos,     setVideos]    = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [saving,     setSaving]    = useState(false);
  const [formOpen,   setFormOpen]  = useState(false);
  const [editTarget, setEditTarget]= useState(null);
  const [deleteTgt,  setDeleteTgt] = useState(null);
  const [previewVid, setPreviewVid]= useState(null);
  const [toast,      setToast]     = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = useCallback(() => setToast(null), []);

  async function load() {
    setLoading(true);
    const data = await api.getVideosAll();
    setVideos(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave(formData) {
    setSaving(true);
    const res = editTarget?._id
      ? await api.updateVideo(editTarget._id, formData)
      : await api.createVideo(formData);
    if (res?.success) {
      showToast(editTarget?._id ? 'Video updated.' : 'Video added.');
      setFormOpen(false);
      setEditTarget(null);
      await load();
    } else {
      showToast(res?.message || 'Save failed.', 'error');
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTgt) return;
    const res = await api.deleteVideo(deleteTgt._id);
    if (res?.success) {
      setVideos(prev => prev.filter(v => v._id !== deleteTgt._id));
      showToast('Video deleted.');
    } else {
      showToast(res?.message || 'Delete failed.', 'error');
    }
    setDeleteTgt(null);
  }

  async function togglePublished(video) {
    const res = await api.updateVideo(video._id, { isPublished: !video.isPublished });
    if (res?.success) {
      setVideos(prev => prev.map(v => v._id === video._id ? { ...v, isPublished: !video.isPublished } : v));
    } else {
      showToast('Toggle failed.', 'error');
    }
  }

  const activeCount = videos.filter(v => v.isPublished).length;

  return (
    <AdminLayout title="Promotional Videos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/admin" className="hover:text-navy-900">Admin</Link>
              <span>/</span>
              <span className="text-navy-950 font-semibold">Promotional Videos</span>
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
              <VideoIcon className="w-6 h-6 text-academic-600" />
              Promotional Videos
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load}
              className="p-2.5 rounded-xl text-slate-400 hover:text-navy-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => { setEditTarget(null); setFormOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> Add Video
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total',    value: videos.length, colour: 'text-navy-950'    },
            { label: 'Active',   value: activeCount,   colour: 'text-emerald-600' },
            { label: 'Inactive', value: videos.length - activeCount, colour: 'text-slate-500' },
          ].map(({ label, value, colour }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm text-center">
              <span className={`text-2xl font-black ${colour} block`}>{value}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* Video table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Loading videos…</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
              <VideoIcon className="w-12 h-12" />
              <p className="text-sm font-semibold">No promotional videos yet.</p>
              <button onClick={() => { setEditTarget(null); setFormOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-navy-900 rounded-xl hover:bg-navy-800 transition-colors">
                <Plus className="w-4 h-4" /> Add the first one
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3 w-12"></th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Platform</th>
                    <th className="px-4 py-3 hidden md:table-cell">Embed ID</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Order</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3 w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map(vid => (
                    <tr key={vid._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      {/* Thumbnail */}
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                          {vid.thumbnailUrl ? (
                            <img src={vid.thumbnailUrl} alt="" className="w-full h-full object-cover"
                              onError={e => { e.currentTarget.style.display = 'none'; }} />
                          ) : (
                            <Play className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </td>
                      {/* Title */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-navy-950 truncate max-w-[180px]">{vid.title}</p>
                        {vid.description && (
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">{vid.description}</p>
                        )}
                      </td>
                      {/* Platform */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          vid.platform === 'YouTube'
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : 'bg-sky-100 text-sky-700 border-sky-200'
                        }`}>{vid.platform}</span>
                      </td>
                      {/* Embed ID */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <code className="text-xs text-slate-500 font-mono truncate max-w-[100px]">{vid.embedId || '—'}</code>
                          {vid.videoUrl && (
                            <a href={vid.videoUrl} target="_blank" rel="noopener noreferrer"
                              className="text-slate-400 hover:text-academic-600 transition-colors" title="Open original URL">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      {/* Order */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs font-mono text-slate-500">{vid.displayOrder}</span>
                      </td>
                      {/* Published toggle */}
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublished(vid)}
                          title={vid.isPublished ? 'Click to deactivate' : 'Click to activate'}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                          {vid.isPublished
                            ? <Eye className="w-4 h-4 text-emerald-500" />
                            : <EyeOff className="w-4 h-4 text-slate-400" />}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button onClick={() => setPreviewVid(vid)}
                            title="Preview" className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setEditTarget(vid); setFormOpen(true); }}
                            title="Edit" className="p-1.5 rounded-lg text-slate-500 hover:text-academic-600 hover:bg-academic-50 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTgt(vid)}
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
          Only <strong>Active</strong> videos appear on the public <Link to="/videos" target="_blank" className="text-academic-500 hover:underline">/videos</Link> page.
          The embed ID is extracted automatically from the video URL when you save.
        </p>
      </div>

      {/* Form modal */}
      {formOpen && (
        <VideoForm initial={editTarget} onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditTarget(null); }} saving={saving} />
      )}

      {/* Preview modal */}
      {previewVid && <PreviewModal video={previewVid} onClose={() => setPreviewVid(null)} />}

      {/* Delete confirm */}
      {deleteTgt && (
        <ConfirmDialog message={`Delete "${deleteTgt.title}"? This cannot be undone.`}
          onConfirm={handleDelete} onCancel={() => setDeleteTgt(null)} />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </AdminLayout>
  );
}
