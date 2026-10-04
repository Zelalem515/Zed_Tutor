import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  User, Save, RefreshCw, CheckCircle2, AlertTriangle, X,
  Globe, Phone, Send, Mail, MapPin, ExternalLink,
  BookOpen, Image, FileText, Settings, Upload, Trash2, Camera,
  Plus, Eye, EyeOff, Shield, Lock
} from 'lucide-react';

// ── Shared form helpers ──────────────────────────────────────────────────────
const inputCls  = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-400 focus:border-transparent placeholder:text-slate-400 transition-shadow';
const labelCls  = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5';
const hintCls   = 'text-[11px] text-slate-400 mt-1 leading-relaxed';

function Field({ label, hint, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className={hintCls}>{hint}</p>}
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl max-w-sm ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success'
        ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'identity',  label: 'Identity',          icon: User    },
  { id: 'bio',       label: 'Bio & Content',      icon: FileText },
  { id: 'contact',   label: 'Contact & Social',   icon: Phone   },
  { id: 'links',     label: 'Links & Availability', icon: Settings },
  { id: 'security',  label: 'Account & Security', icon: Shield  },
];

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminProfilePage() {
  const [profile,  setProfile]  = useState(null);
  const [form,     setForm]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [dirty,    setDirty]    = useState(false);
  const [tab,      setTab]      = useState('identity');
  const [toast,    setToast]    = useState(null);

  const showToast  = (message, type = 'success') => setToast({ message, type });
  const hideToast  = useCallback(() => setToast(null), []);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const set = (path, value) => {
    setForm(prev => {
      const next = { ...prev };
      const parts = path.split('.');
      if (parts.length === 1) {
        next[parts[0]] = value;
      } else {
        next[parts[0]] = { ...prev[parts[0]], [parts[1]]: value };
      }
      return next;
    });
    setDirty(true);
  };

  // ── Load ─────────────────────────────────────────────────────────────────
  async function loadProfile() {
    setLoading(true);
    const data = await api.getProfile();
    setProfile(data);
    setForm(JSON.parse(JSON.stringify(data))); // deep copy to avoid reference mutation
    setDirty(false);
    setLoading(false);
  }

  useEffect(() => { loadProfile(); }, []);

  // ── Save ─────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateProfile(form);
      if (res?.success) {
        setProfile(JSON.parse(JSON.stringify(form)));
        setDirty(false);
        showToast('Profile saved successfully.');
      } else {
        showToast(res?.message || 'Save failed. Please try again.', 'error');
      }
    } catch {
      showToast('Unexpected error — please try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setForm(JSON.parse(JSON.stringify(profile)));
    setDirty(false);
  }

  // ── Photo upload/replace/remove ───────────────────────────────────────────
  const fileInputRef = useRef(null);
  const [photoUploading,  setPhotoUploading]  = useState(false);
  const [photoRemoving,   setPhotoRemoving]   = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!e.target.files) return;
    e.target.value = ''; // reset so same file can be reselected
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (JPEG, PNG, WebP, etc.).', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File exceeds the 5 MB limit. Please choose a smaller image.', 'error');
      return;
    }

    setPhotoUploading(true);
    try {
      const res = await api.uploadProfilePhoto(file);
      if (res?.success) {
        // Update both profile state and form state so the preview refreshes immediately
        const updated = { ...profile, avatarUrl: res.avatarUrl };
        setProfile(updated);
        setForm(prev => ({ ...prev, avatarUrl: res.avatarUrl }));
        showToast('Profile photo updated successfully.');
      } else {
        showToast(res?.message || 'Photo upload failed.', 'error');
      }
    } catch {
      showToast('Unexpected error during upload.', 'error');
    } finally {
      setPhotoUploading(false);
    }
  }

  async function handlePhotoRemove() {
    setShowRemoveConfirm(false);
    setPhotoRemoving(true);
    try {
      const res = await api.removeProfilePhoto();
      if (res?.success) {
        const updated = { ...profile, avatarUrl: '', avatarPublicId: '' };
        setProfile(updated);
        setForm(prev => ({ ...prev, avatarUrl: '' }));
        showToast('Profile photo removed.');
      } else {
        showToast(res?.message || 'Failed to remove photo.', 'error');
      }
    } catch {
      showToast('Unexpected error while removing photo.', 'error');
    } finally {
      setPhotoRemoving(false);
    }
  }

  // ── Change password state & handler ─────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNextPw,    setShowNextPw]    = useState(false);

  function pwStrength(pw) {
    if (!pw) return null;
    if (pw.length < 8)  return { label: 'Too short',  colour: 'text-red-500',    bar: 'bg-red-400',    w: 'w-1/4' };
    if (pw.length < 12) return { label: 'Weak',        colour: 'text-amber-500',  bar: 'bg-amber-400',  w: 'w-2/4' };
    const hasUpper   = /[A-Z]/.test(pw);
    const hasLower   = /[a-z]/.test(pw);
    const hasDigit   = /\d/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const score = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
    if (score >= 4) return { label: 'Strong',  colour: 'text-emerald-600', bar: 'bg-emerald-500', w: 'w-full' };
    if (score >= 3) return { label: 'Good',    colour: 'text-academic-600', bar: 'bg-academic-500', w: 'w-3/4' };
    return             { label: 'Fair',    colour: 'text-amber-500',  bar: 'bg-amber-400',  w: 'w-2/4' };
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!pwForm.current) {
      showToast('Please enter your current password.', 'error'); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      showToast('New password and confirmation do not match.', 'error'); return;
    }
    if (pwForm.next.length < 8) {
      showToast('New password must be at least 8 characters.', 'error'); return;
    }
    setPwSaving(true);
    try {
      const res = await api.changePassword(pwForm.current, pwForm.next, pwForm.confirm);
      if (res?.success) {
        setPwForm({ current: '', next: '', confirm: '' });
        showToast('Password changed successfully.');
      } else {
        showToast(res?.message || 'Password change failed.', 'error');
      }
    } catch {
      showToast('Unexpected error — please try again.', 'error');
    } finally {
      setPwSaving(false);
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading || !form) {
    return (
      <AdminLayout title="Profile">
        <div className="flex items-center justify-center h-64 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm font-medium">Loading profile…</span>
        </div>
      </AdminLayout>
    );
  }

  const ci = form.contactInfo || {};

  return (
    <AdminLayout title="Profile & Content">
      <form onSubmit={handleSave} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/admin" className="hover:text-navy-900 transition-colors">Admin</Link>
              <span>/</span>
              <span className="text-navy-950 font-semibold">Profile & Content</span>
            </div>
            <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
              <User className="w-6 h-6 text-academic-600" />
              Profile & Content Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Changes here update the live public website immediately after saving.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {dirty && (
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              >
                Discard
              </button>
            )}
            <button
              type="submit"
              disabled={saving || !dirty}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-academic-500 hover:bg-academic-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : dirty ? 'Save Changes' : 'Saved'}
            </button>
          </div>
        </div>

        {/* ── Dirty indicator ── */}
        {dirty && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-medium text-amber-700">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            You have unsaved changes.
          </div>
        )}

        {/* ── Tab bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-100">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 border-b-2 ${
                  tab === id
                    ? 'text-academic-600 border-academic-500 bg-academic-50/50'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-7 space-y-6">

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB: IDENTITY                                                  */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {tab === 'identity' && (
              <div className="space-y-6">

                {/* ── Card: Basic Identity Fields ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-academic-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">Identity</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name *" hint="Your display name on the public website.">
                      <input
                        className={inputCls}
                        required
                        maxLength={100}
                        value={form.fullName || ''}
                        onChange={e => set('fullName', e.target.value)}
                        placeholder="Zelalem Birhan"
                      />
                    </Field>
                    <Field label="Brand Name" hint="Short brand identifier shown in the navbar and footer.">
                      <input
                        className={inputCls}
                        maxLength={60}
                        value={form.brandName || ''}
                        onChange={e => set('brandName', e.target.value)}
                        placeholder="ZED_Tutor"
                      />
                    </Field>
                  </div>

                  <Field label="Professional Title" hint="Shown under your name in the hero section and navbar subtitle.">
                    <input
                      className={inputCls}
                      maxLength={120}
                      value={form.title || ''}
                      onChange={e => set('title', e.target.value)}
                      placeholder="Mathematics & Information Technology Tutor"
                    />
                  </Field>

                  <Field
                    label="Tagline / Credential Summary"
                    hint="Short credibility line shown in the hero ribbon and page metadata."
                  >
                    <input
                      className={inputCls}
                      maxLength={160}
                      value={form.tagline || ''}
                      onChange={e => set('tagline', e.target.value)}
                      placeholder="University Gold Medalist | 3.95 CGPA | Ranked 1st at GIT"
                    />
                  </Field>

                  {/* heroHeadline moved to Bio & Content tab */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-academic-50 border border-academic-100">
                    <FileText className="w-4 h-4 text-academic-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-navy-950">Hero Headline Override</span> has moved to the{' '}
                      <button type="button" onClick={() => setTab('bio')} className="text-academic-600 hover:text-academic-700 font-semibold hover:underline underline-offset-2">
                        Bio &amp; Content
                      </button>{' '}tab.
                    </p>
                  </div>
                </div>

                {/* ── Card: Profile Photo ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-4 h-4 text-academic-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">Profile Photo</h3>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-start">

                    {/* Preview area */}
                    <div className="flex-shrink-0">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-academic-100 border-2 border-slate-200 flex items-center justify-center relative">
                        {(photoUploading || photoRemoving) ? (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-academic-600 animate-spin" />
                          </div>
                        ) : null}
                        {form.avatarUrl ? (
                          <img
                            src={form.avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-3xl font-black text-academic-600 select-none">
                            {(form.fullName || 'ZB').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 text-center mt-2 w-28">
                        {form.avatarUrl ? 'Current photo' : 'No photo set'}
                      </p>
                    </div>

                    {/* Upload controls */}
                    <div className="flex-1 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Upload a professional photo. The image will be stored on Cloudinary and
                        displayed on the public website in the hero and about sections.
                        <br />
                        <span className="text-slate-400">Accepted: JPEG, PNG, WebP, GIF · Max: 5 MB</span>
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoSelect}
                          aria-label="Select profile photo"
                        />

                        {/* Upload / Replace button */}
                        <button
                          type="button"
                          disabled={photoUploading || photoRemoving}
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-academic-500 hover:bg-academic-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                          {photoUploading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Uploading…
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              {form.avatarUrl ? 'Replace Photo' : 'Upload Photo'}
                            </>
                          )}
                        </button>

                        {/* Remove button — only shown when photo exists */}
                        {form.avatarUrl && (
                          <button
                            type="button"
                            disabled={photoUploading || photoRemoving}
                            onClick={() => setShowRemoveConfirm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {photoRemoving ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Removing…
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Remove Photo
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Photo changes are saved immediately — no need to click Save Changes.
                      </p>
                    </div>
                  </div>

                  {/* Remove confirmation inline prompt */}
                  {showRemoveConfirm && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700 font-medium flex-1">
                        Remove this photo? This will delete it from Cloudinary and cannot be undone.
                      </p>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowRemoveConfirm(false)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white rounded-lg border border-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handlePhotoRemove}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB: BIO & CONTENT                                             */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {tab === 'bio' && (
              <div className="space-y-6">

                {/* ── Card: Hero Headline ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
                        <FileText className="w-4 h-4 text-academic-600" />
                        Hero Headline
                      </h3>
                      <p className={`${hintCls} mt-1`}>
                        Replaces the main H1 on the homepage hero section. Leave blank to use the default
                        styled headline <em>"Mathematics &amp; Information Technology Tutor"</em>.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Headline Override</label>
                    <input
                      className={inputCls}
                      maxLength={200}
                      value={form.heroHeadline || ''}
                      onChange={e => set('heroHeadline', e.target.value)}
                      placeholder="Leave blank to use the default headline"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className={hintCls}>
                        {form.heroHeadline
                          ? `Active — public hero will show: "${form.heroHeadline}"`
                          : 'Inactive — default styled headline is used.'}
                      </p>
                      <span className={`text-[11px] font-mono ${(form.heroHeadline || '').length > 180 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {(form.heroHeadline || '').length} / 200
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Card: Short Bio ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-4 h-4 text-academic-600" />
                      Short Bio
                    </h3>
                    <p className={`${hintCls} mt-1`}>
                      Displayed in the <strong>About section</strong> on the homepage. Keep to 2–3 concise sentences.
                      Max 600 characters.
                    </p>
                  </div>

                  <div>
                    <label className={labelCls}>Short Bio</label>
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={4}
                      maxLength={600}
                      value={form.shortBio || ''}
                      onChange={e => set('shortBio', e.target.value)}
                      placeholder="Your short professional introduction…"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className={hintCls}>
                        {form.shortBio?.trim()
                          ? `${form.shortBio.trim().split(/\s+/).length} words`
                          : 'No content yet'}
                      </p>
                      <span className={`text-[11px] font-mono ${(form.shortBio || '').length > 550 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {(form.shortBio || '').length} / 600
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Card: Full Bio ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-4 h-4 text-academic-600" />
                      Full Bio
                    </h3>
                    <p className={`${hintCls} mt-1`}>
                      Displayed on the <strong>About page</strong> under "Academic &amp; Professional Background".
                      Can be longer and more detailed. Max 3000 characters.
                    </p>
                  </div>

                  <div>
                    <label className={labelCls}>Full Bio</label>
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={9}
                      maxLength={3000}
                      value={form.fullBio || ''}
                      onChange={e => set('fullBio', e.target.value)}
                      placeholder="Your full professional biography…"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className={hintCls}>
                        {form.fullBio?.trim()
                          ? `${form.fullBio.trim().split(/\s+/).length} words`
                          : 'No content yet'}
                      </p>
                      <span className={`text-[11px] font-mono ${(form.fullBio || '').length > 2800 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {(form.fullBio || '').length} / 3000
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Info: Teaching Approach ── */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200">
                  <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Teaching Approach (4-Phase Methodology)</p>
                    <p className={hintCls}>
                      The Understand → Practice → Apply → Review framework is a static pedagogical component
                      and is not editable from the CMS. To modify it, edit{' '}
                      <code className="text-xs bg-slate-200 px-1 py-0.5 rounded">TeachingApproach.jsx</code>.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB: CONTACT & SOCIAL                                          */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {tab === 'contact' && (
              <div className="space-y-6">

                {/* ── Card: Core Contact Details ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-academic-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">Core Contact Details</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Phone */}
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input className={`${inputCls} pl-9`}
                            maxLength={30}
                            value={ci.phone || ''}
                            onChange={e => set('contactInfo.phone', e.target.value)}
                            placeholder="+251 912 692 343" />
                        </div>
                        {ci.phone && (
                          <button type="button" onClick={() => set('contactInfo.phone', '')}
                            className="px-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors flex-shrink-0" title="Clear">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className={hintCls}>Shown on the Contact page as a direct call option.</p>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className={labelCls}>WhatsApp Number <span className="text-red-500">*</span></label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm leading-none">💬</span>
                          <input className={`${inputCls} pl-9`}
                            maxLength={20}
                            value={ci.whatsapp || ''}
                            onChange={e => set('contactInfo.whatsapp', e.target.value)}
                            placeholder="+251912692343" />
                        </div>
                        {ci.whatsapp && (
                          <button type="button" onClick={() => set('contactInfo.whatsapp', '')}
                            className="px-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors flex-shrink-0" title="Clear">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className={hintCls}>Digits only (or with + prefix). Used for wa.me link — primary contact method.</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input className={`${inputCls} pl-9`} type="email"
                            maxLength={100}
                            value={ci.email || ''}
                            onChange={e => set('contactInfo.email', e.target.value)}
                            placeholder="zedtutorit@gmail.com" />
                        </div>
                        {ci.email && (
                          <button type="button" onClick={() => set('contactInfo.email', '')}
                            className="px-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors flex-shrink-0" title="Clear">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className={hintCls}>Shown publicly on the Contact and Footer sections.</p>
                    </div>

                    {/* Location */}
                    <div>
                      <label className={labelCls}>Current Tutoring Location</label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input className={`${inputCls} pl-9`}
                            maxLength={100}
                            value={ci.location || ''}
                            onChange={e => set('contactInfo.location', e.target.value)}
                            placeholder="Addis Ababa, Ethiopia" />
                        </div>
                        {ci.location && (
                          <button type="button" onClick={() => set('contactInfo.location', '')}
                            className="px-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors flex-shrink-0" title="Clear">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className={hintCls}>City/area for tutoring. Shown in the footer and in the in-person option on the contact form. Current: Addis Ababa, Ethiopia.</p>
                    </div>

                  </div>
                </div>

                {/* ── Card: Telegram ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-academic-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">Telegram</h3>
                  </div>

                  {/* Telegram Channel — public */}
                  <div>
                    <label className={labelCls}>
                      Telegram Channel URL
                      <span className="ml-2 text-[11px] font-normal text-emerald-600 normal-case bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Public</span>
                    </label>
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input className={`${inputCls} pl-9`}
                          maxLength={100}
                          value={ci.telegram || ''}
                          onChange={e => set('contactInfo.telegram', e.target.value)}
                          placeholder="https://t.me/zed_tutor" />
                      </div>
                      {ci.telegram && (
                        <button type="button" onClick={() => set('contactInfo.telegram', '')}
                          className="px-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors flex-shrink-0" title="Clear">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className={hintCls}>Full URL (https://t.me/...) or @handle. Shown publicly on the Contact page and Footer as a contact option.</p>
                  </div>

                  {/* Telegram Bot — internal only */}
                  <div className="border-t border-slate-200 pt-5">
                    <label className={labelCls}>
                      Telegram Bot Handle
                      <span className="ml-2 text-[11px] font-normal text-amber-700 normal-case bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Internal Only</span>
                    </label>
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input className={`${inputCls} pl-9`}
                          value={ci.telegramBot || ''}
                          onChange={e => set('contactInfo.telegramBot', e.target.value)}
                          placeholder="@Zed_tutor_bot" />
                      </div>
                      {ci.telegramBot && (
                        <button type="button" onClick={() => set('contactInfo.telegramBot', '')}
                          className="px-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors flex-shrink-0" title="Clear">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-start gap-2 mt-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-700 leading-relaxed">
                        This bot handle is <strong>never shown publicly</strong>. It is stored here for reference only. The actual bot token and chat ID that power inquiry notifications are configured in the server environment file (<code className="bg-amber-100 px-1 rounded">TELEGRAM_BOT_TOKEN</code> / <code className="bg-amber-100 px-1 rounded">TELEGRAM_CHAT_ID</code>) and must never be entered here.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Info: Social media ── */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200">
                  <Globe className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Social Media Links</p>
                    <p className={hintCls}>Instagram, Facebook, YouTube, Vimeo, TikTok, and IT Portfolio are managed in the <button type="button" onClick={() => setTab('links')} className="text-academic-600 hover:text-academic-700 font-semibold hover:underline underline-offset-2">Links &amp; Availability</button> tab.</p>
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB: LINKS & AVAILABILITY                                      */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {tab === 'links' && (
              <div className="space-y-6">

                {/* ── Card: Social & External Links manager ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-academic-600" />
                      <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">Social & External Links</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const links = Array.isArray(form.socialLinks) ? form.socialLinks : [];
                        set('socialLinks', [...links, { platform: 'Instagram', label: '', url: '', isActive: true, _tempId: Date.now() }]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-academic-500 hover:bg-academic-600 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Link
                    </button>
                  </div>

                  <p className={hintCls}>
                    Only <strong>Active</strong> links are shown publicly on the Contact page and Footer.
                    Inactive links are saved but hidden from visitors.
                  </p>

                  {/* Link list */}
                  {(!form.socialLinks || form.socialLinks.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      <Globe className="w-8 h-8 mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No social links yet</p>
                      <p className="text-xs mt-1">Click "Add Link" to add your first social or external link.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(form.socialLinks || []).map((link, idx) => (
                        <div key={link._id || link._tempId || idx}
                          className={`rounded-xl border p-4 space-y-3 transition-colors ${
                            link.isActive ? 'bg-white border-slate-200' : 'bg-slate-100 border-slate-200 opacity-70'
                          }`}>
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Platform select */}
                            <select
                              value={link.platform}
                              onChange={e => {
                                const updated = [...form.socialLinks];
                                updated[idx] = { ...updated[idx], platform: e.target.value };
                                set('socialLinks', updated);
                              }}
                              className="text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-academic-400"
                            >
                              {['Instagram','Facebook','YouTube','Vimeo','TikTok','LinkedIn','GitHub',
                                'WhatsApp','Telegram Channel','Portfolio Website','Other'].map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>

                            {/* Active toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...form.socialLinks];
                                updated[idx] = { ...updated[idx], isActive: !updated[idx].isActive };
                                set('socialLinks', updated);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                                link.isActive
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}
                            >
                              {link.isActive ? (
                                <><Eye className="w-3 h-3" /> Active</>
                              ) : (
                                <><EyeOff className="w-3 h-3" /> Inactive</>
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = form.socialLinks.filter((_, i) => i !== idx);
                                set('socialLinks', updated);
                              }}
                              className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* URL */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">URL or Handle</label>
                            <input
                              className={inputCls}
                              maxLength={300}
                              value={link.url}
                              onChange={e => {
                                const updated = [...form.socialLinks];
                                updated[idx] = { ...updated[idx], url: e.target.value };
                                set('socialLinks', updated);
                              }}
                              placeholder={
                                link.platform === 'Instagram' ? 'https://instagram.com/yourhandle' :
                                link.platform === 'Facebook'  ? 'https://facebook.com/yourpage' :
                                link.platform === 'YouTube'   ? 'https://youtube.com/@yourchannel' :
                                link.platform === 'LinkedIn'  ? 'https://linkedin.com/in/yourprofile' :
                                link.platform === 'GitHub'    ? 'https://github.com/yourusername' :
                                link.platform === 'TikTok'    ? 'https://tiktok.com/@yourhandle' :
                                link.platform === 'Vimeo'     ? 'https://vimeo.com/yourprofile' :
                                link.platform === 'Telegram Channel' ? 'https://t.me/yourchannel' :
                                'https://…'
                              }
                            />
                          </div>

                          {/* Optional label */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Display Label <span className="font-normal text-slate-400 normal-case">(optional — shown instead of platform name)</span></label>
                            <input
                              className={`${inputCls} text-sm`}
                              maxLength={80}
                              value={link.label || ''}
                              onChange={e => {
                                const updated = [...form.socialLinks];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                set('socialLinks', updated);
                              }}
                              placeholder={`e.g. ${link.platform} — ZED_Tutor`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Card: IT Portfolio URL ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-academic-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">IT Portfolio / Personal Website</h3>
                  </div>
                  <div>
                    <label className={labelCls}>Portfolio URL</label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input className={`${inputCls} pl-9`} type="url"
                        value={form.itPortfolioUrl || ''}
                        onChange={e => set('itPortfolioUrl', e.target.value)}
                        placeholder="https://zelalem-birhan.vercel.app/" />
                    </div>
                    {form.itPortfolioUrl && (
                      <a href={form.itPortfolioUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-academic-600 hover:text-academic-700 mt-1.5 transition-colors">
                        <ExternalLink className="w-3 h-3" /> Open portfolio
                      </a>
                    )}
                    <p className={hintCls}>Shown in the footer and contact page as "Explore My IT Portfolio". Also add it as a Social Link above if you want it in the social row.</p>
                  </div>
                </div>

                {/* ── Info: Grade Levels / Subjects ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200">
                    <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Grade Levels</p>
                      <p className={hintCls}>Managed in <Link to="/admin/subjects" className="text-academic-600 hover:underline">Subjects &amp; Grades</Link>.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200">
                    <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Tutoring Subjects</p>
                      <p className={hintCls}>Managed in <Link to="/admin/subjects" className="text-academic-600 hover:underline">Subjects &amp; Grades</Link>.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB: ACCOUNT & SECURITY                                        */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {tab === 'security' && (
              <div className="space-y-6">

                {/* ── Card: Change Password ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-academic-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">Change Password</h3>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5">

                    {/* Current password */}
                    <div>
                      <label className={labelCls}>Current Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          required
                          autoComplete="current-password"
                          value={pwForm.current}
                          onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                          className={`${inputCls} pr-10`}
                          placeholder="Your current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label={showCurrentPw ? 'Hide password' : 'Show password'}
                        >
                          {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New password */}
                    <div>
                      <label className={labelCls}>New Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type={showNextPw ? 'text' : 'password'}
                          required
                          autoComplete="new-password"
                          value={pwForm.next}
                          onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                          className={`${inputCls} pr-10`}
                          placeholder="Minimum 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNextPw(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label={showNextPw ? 'Hide password' : 'Show password'}
                        >
                          {showNextPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength indicator */}
                      {pwForm.next && (() => {
                        const s = pwStrength(pwForm.next);
                        return s ? (
                          <div className="mt-2 space-y-1">
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-300 ${s.bar} ${s.w}`} />
                            </div>
                            <p className={`text-[11px] font-semibold ${s.colour}`}>{s.label}</p>
                          </div>
                        ) : null;
                      })()}
                      <p className={hintCls}>Min 8 characters. Use uppercase, lowercase, numbers, and symbols for a stronger password.</p>
                    </div>

                    {/* Confirm new password */}
                    <div>
                      <label className={labelCls}>Confirm New Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          autoComplete="new-password"
                          value={pwForm.confirm}
                          onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                          className={`${inputCls} ${
                            pwForm.confirm && pwForm.next !== pwForm.confirm
                              ? 'border-red-300 focus:ring-red-400'
                              : pwForm.confirm && pwForm.next === pwForm.confirm
                              ? 'border-emerald-300 focus:ring-emerald-400'
                              : ''
                          }`}
                          placeholder="Repeat new password"
                        />
                      </div>
                      {pwForm.confirm && pwForm.next !== pwForm.confirm && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">Passwords do not match.</p>
                      )}
                      {pwForm.confirm && pwForm.next === pwForm.confirm && pwForm.next.length >= 8 && (
                        <p className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Passwords match.
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm || pwForm.next !== pwForm.confirm || pwForm.next.length < 8}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      {pwSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      {pwSaving ? 'Changing Password…' : 'Change Password'}
                    </button>
                  </form>
                </div>

                {/* ── Info: Session behavior ── */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">After changing your password</p>
                    <p className={hintCls}>
                      Your current session remains active. Other devices or browsers will need to log in again with the new password.
                      Password change requires an active database connection.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* ── Floating save bar — visible when dirty ── */}
        {dirty && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-navy-950 text-white px-5 py-3 rounded-2xl shadow-navy border border-navy-800">
            <span className="text-sm font-medium">Unsaved changes</span>
            <button
              type="button"
              onClick={handleDiscard}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-navy-800"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-academic-500 hover:bg-academic-400 text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}

      </form>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </AdminLayout>
  );
}
