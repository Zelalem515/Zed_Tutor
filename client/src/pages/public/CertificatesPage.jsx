import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import {
  Award, Download, Eye, FileText, X, ExternalLink,
  ShieldCheck, ChevronDown, AlertCircle
} from 'lucide-react';

// Category colour map — used on filter pills and card badges
const CATEGORY_STYLES = {
  'Academic':                { pill: 'bg-academic-100 text-academic-700 border-academic-200',   active: 'bg-academic-600 text-white border-academic-600' },
  'Awards & Recognition':    { pill: 'bg-gold-100 text-gold-800 border-gold-200',               active: 'bg-gold-500 text-white border-gold-500' },
  'Certificates & Training': { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200',      active: 'bg-emerald-600 text-white border-emerald-600' },
  'National Examination':    { pill: 'bg-sky-100 text-sky-700 border-sky-200',                  active: 'bg-sky-600 text-white border-sky-600' },
  'University':              { pill: 'bg-indigo-100 text-indigo-700 border-indigo-200',         active: 'bg-indigo-600 text-white border-indigo-600' },
  'Other':                   { pill: 'bg-slate-100 text-slate-600 border-slate-200',            active: 'bg-slate-600 text-white border-slate-600' },
};

const ALL_PILL = 'bg-slate-100 text-slate-700 border-slate-200';
const ALL_ACTIVE = 'bg-navy-900 text-white border-navy-900';

function CategoryBadge({ category }) {
  const styles = CATEGORY_STYLES[category] || CATEGORY_STYLES['Other'];
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${styles.pill}`}>
      {category}
    </span>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ cert, onClose }) {
  const hasRealFile = cert.fileUrl && cert.fileUrl !== '#' && cert.fileUrl !== '';
  const isPDF = cert.fileType === 'pdf' ||
    (cert.fileUrl && cert.fileUrl.toLowerCase().endsWith('.pdf'));

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${cert.title}`}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="min-w-0">
            <CategoryBadge category={cert.category} />
            <h3 className="text-lg font-bold text-navy-950 mt-2 leading-snug">{cert.title}</h3>
            <p className="text-xs font-medium text-academic-600 mt-0.5">{cert.issuingOrg}</p>
            {cert.issueDate && (
              <p className="text-xs text-slate-400 mt-0.5">{cert.issueDate}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body — Preview area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          {hasRealFile ? (
            isPDF ? (
              // PDF viewer via <iframe>
              <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height: '420px' }}>
                <iframe
                  src={cert.fileUrl}
                  title={cert.title}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            ) : (
              // Image viewer
              <div className="w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                <img
                  src={cert.fileUrl}
                  alt={cert.title}
                  className="max-w-full max-h-[420px] object-contain rounded-xl"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback if image fails to load */}
                <div className="hidden flex-col items-center justify-center p-10 text-slate-400 space-y-3">
                  <AlertCircle className="w-10 h-10" />
                  <p className="text-sm font-medium">Image could not be loaded.</p>
                </div>
              </div>
            )
          ) : (
            // Placeholder — file not yet uploaded
            <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-academic-50 border border-academic-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-academic-400" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-slate-600">Document not yet uploaded</p>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Actual certificates and official documents will be uploaded through the admin portal.
                </p>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Document is verified — upload pending</span>
              </div>
            </div>
          )}

          {/* Description */}
          {cert.description && (
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed">{cert.description}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          {hasRealFile && (
            <a
              href={cert.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </a>
          )}
          {cert.isDownloadable && (
            <a
              href={cert.fileUrl && cert.fileUrl !== '#' ? cert.fileUrl : undefined}
              download={cert.fileUrl && cert.fileUrl !== '#' ? undefined : undefined}
              onClick={cert.fileUrl === '#' || !cert.fileUrl ? (e) => e.preventDefault() : undefined}
              className={`inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold rounded-lg transition-colors ${
                cert.fileUrl && cert.fileUrl !== '#'
                  ? 'text-white bg-navy-900 hover:bg-navy-800 cursor-pointer'
                  : 'text-slate-400 bg-slate-100 cursor-not-allowed'
              }`}
              title={cert.fileUrl === '#' || !cert.fileUrl ? 'Document not yet available' : 'Download certificate'}
            >
              <Download className={`w-3.5 h-3.5 ${cert.fileUrl && cert.fileUrl !== '#' ? 'text-gold-400' : 'text-slate-400'}`} />
              <span>{cert.fileUrl && cert.fileUrl !== '#' ? 'Download' : 'Not Available Yet'}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Certificate Card ──────────────────────────────────────────────────────────
function CertCard({ cert, onPreview }) {
  const hasRealFile = cert.fileUrl && cert.fileUrl !== '#' && cert.fileUrl !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
      {/* Thumbnail / Hero area */}
      <div className="h-36 rounded-t-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100 flex items-center justify-center relative">
        {cert.thumbnailUrl && cert.thumbnailUrl !== '' ? (
          <img
            src={cert.thumbnailUrl}
            alt={cert.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 p-4 text-slate-300">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
              <Award className="w-6 h-6 text-gold-400" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              {cert.issuingOrg?.split(',')[0] || 'Certificate'}
            </span>
          </div>
        )}
        {/* Category pill overlay */}
        <div className="absolute top-3 right-3">
          <CategoryBadge category={cert.category} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-navy-950 leading-snug mb-1">{cert.title}</h3>
        <p className="text-xs font-semibold text-academic-600 mb-1">{cert.issuingOrg}</p>
        {cert.issueDate && (
          <p className="text-[11px] text-slate-400 mb-3">{cert.issueDate}</p>
        )}
        {cert.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">{cert.description}</p>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-auto">
          <button
            onClick={() => onPreview(cert)}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          {cert.isDownloadable ? (
            <a
              href={hasRealFile ? cert.fileUrl : undefined}
              download={hasRealFile ? true : undefined}
              onClick={!hasRealFile ? (e) => e.preventDefault() : undefined}
              className={`flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                hasRealFile
                  ? 'text-white bg-navy-900 hover:bg-navy-800 cursor-pointer'
                  : 'text-slate-400 bg-slate-100 cursor-not-allowed'
              }`}
              title={hasRealFile ? 'Download certificate' : 'Document not yet uploaded'}
            >
              <Download className={`w-3.5 h-3.5 ${hasRealFile ? 'text-gold-400' : 'text-slate-400'}`} />
              <span>{hasRealFile ? 'Download' : 'Pending'}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewCert, setPreviewCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getCertificates();
      setCertificates(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = ['All', 'Awards & Recognition', 'Academic', 'University', 'National Examination', 'Certificates & Training', 'Other'];

  const filtered = selectedCategory === 'All'
    ? certificates
    : certificates.filter(c => c.category === selectedCategory);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Public Credentials</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            Certificates & Official Awards
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Downloadable, verifiable academic credentials and awards from Debre Tabor University
            and national assessment bodies.
          </p>
        </div>

        {/* ── Trust Strip ── */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <div className="inline-flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified Academic Records</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="inline-flex items-center space-x-1.5">
            <Download className="w-4 h-4 text-academic-500" />
            <span>Free Download — No Account Required</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="inline-flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-gold-500" />
            <span>University Gold Medalist • 3.95 CGPA</span>
          </div>
        </div>

        {/* ── Category Filters ── */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isAll = cat === 'All';
            const active = selectedCategory === cat;
            const base = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all';
            let cls;
            if (active) {
              cls = isAll ? ALL_ACTIVE : CATEGORY_STYLES[cat]?.active || ALL_ACTIVE;
            } else {
              cls = isAll ? ALL_PILL : CATEGORY_STYLES[cat]?.pill || ALL_PILL;
              cls += ' hover:opacity-80';
            }
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${base} ${cls}`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-[10px] opacity-70">
                    ({certificates.filter(c => c.category === cat).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Certificate Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 h-64 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
            <Award className="w-12 h-12" />
            <p className="text-sm font-semibold">No certificates in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cert) => (
              <CertCard key={cert._id} cert={cert} onPreview={setPreviewCert} />
            ))}
          </div>
        )}

        {/* ── Privacy Note ── */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            Certificates are publicly accessible and free to download. Documents containing unnecessary personal identifiers
            or private contact information are not published. Actual certificate files will be uploaded through the admin portal.
          </span>
        </div>
      </div>

      {/* ── Preview Modal ── */}
      {previewCert && (
        <PreviewModal cert={previewCert} onClose={() => setPreviewCert(null)} />
      )}
    </div>
  );
}
