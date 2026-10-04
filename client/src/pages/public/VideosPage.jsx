import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Play, Video as VideoIcon, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Safe embed URL builder — only YouTube and Vimeo allowed ──────────────────
function buildEmbedUrl(platform, embedId) {
  if (!embedId) return null;
  if (platform === 'YouTube') return `https://www.youtube-nocookie.com/embed/${embedId}?rel=0`;
  if (platform === 'Vimeo')   return `https://player.vimeo.com/video/${embedId}?title=0&byline=0`;
  return null;
}

// ── Single video card ────────────────────────────────────────────────────────
function VideoCard({ vid }) {
  const embedUrl = buildEmbedUrl(vid.platform, vid.embedId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Embed */}
      <div className="relative aspect-video bg-navy-950">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={vid.title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-12 h-12 text-slate-600" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            vid.platform === 'YouTube'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-sky-100 text-sky-700 border border-sky-200'
          }`}>
            {vid.platform}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Promotional Video
          </span>
        </div>
        <h3 className="text-base font-bold text-navy-950 leading-snug">{vid.title}</h3>
        {vid.description && (
          <p className="text-xs text-slate-600 leading-relaxed flex-1">{vid.description}</p>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function VideosPage() {
  const [videos,  setVideos]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getVideos();
      setVideos(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-academic-100 text-academic-700 text-xs font-bold uppercase tracking-wider">
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Promotional Media</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            Promotional & Introductory Videos
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Short introductory videos about ZED_Tutor — the academic background, tutoring approach,
            and what students and parents can expect.
          </p>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-100" />
                <div className="p-5 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && videos.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
              <Play className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">Promotional Videos Coming Soon</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Introductory and overview videos are being prepared and will be available here soon.
              In the meantime, explore the academic evidence and tutoring subjects.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-academic-600 bg-academic-50 border border-academic-100 hover:bg-academic-100 transition-colors"
              >
                About Zelalem
              </Link>
              <Link
                to="/tutoring"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-colors"
              >
                View Tutoring Areas
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ── Videos grid ── */}
        {!loading && videos.length > 0 && (
          <div className={`grid gap-7 ${videos.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {videos.map(vid => (
              <VideoCard key={vid._id} vid={vid} />
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        {!loading && videos.length > 0 && (
          <div className="bg-gradient-to-r from-navy-950 to-navy-900 rounded-2xl p-7 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg border border-navy-800">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold">Ready to start tutoring?</h3>
              <p className="text-sm text-slate-300">Send a request — no account needed.</p>
            </div>
            <Link
              to="/contact#inquiry"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-navy-950 bg-gold-400 hover:bg-gold-500 transition-colors shadow-md flex-shrink-0"
            >
              <span>Request Tutoring</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
