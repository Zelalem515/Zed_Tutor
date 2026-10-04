import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Video } from 'lucide-react';

function buildEmbedUrl(platform, embedId) {
  if (!embedId) return null;
  if (platform === 'YouTube') return `https://www.youtube-nocookie.com/embed/${embedId}?rel=0&modestbranding=1`;
  if (platform === 'Vimeo')   return `https://player.vimeo.com/video/${embedId}?title=0&byline=0&portrait=0`;
  return null;
}

export default function PromoVideoSection({ videos }) {
  // Render a tasteful placeholder when no videos are active
  const hasVideos  = videos && videos.length > 0;
  const primary    = hasVideos ? videos[0] : null;
  const additional = hasVideos ? videos.slice(1, 4) : [];
  const embedUrl   = primary ? buildEmbedUrl(primary.platform, primary.embedId) : null;

  return (
    <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="section-label">
              <Video className="w-3.5 h-3.5" />
              <span>Introduction</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-950" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
              Meet Your Tutor
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-lg">
              A short video introduction to Zelalem's academic background, teaching philosophy,
              and what you can expect from tutoring sessions.
            </p>
          </div>
          {hasVideos && videos.length > 1 && (
            <Link to="/videos" className="link-arrow flex-shrink-0">
              <span>All videos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Video content */}
        {hasVideos ? (
          <div className={`grid gap-6 ${additional.length > 0 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 max-w-3xl mx-auto w-full'}`}>

            {/* Primary video */}
            <div className={additional.length > 0 ? 'lg:col-span-2' : ''}>
              <div className="card overflow-hidden hover-lift">
                <div className="relative aspect-video bg-navy-950 rounded-t-2xl overflow-hidden">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={primary.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Play className="w-7 h-7 text-white ml-1" />
                      </div>
                      <p className="text-sm text-slate-400">Video not available</p>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    primary.platform === 'YouTube'
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-sky-50 text-sky-600 border border-sky-100'
                  }`}>{primary.platform}</span>
                  <h3 className="text-base font-semibold text-navy-950 mt-2 leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                    {primary.title}
                  </h3>
                  {primary.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{primary.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional videos */}
            {additional.length > 0 && (
              <div className="space-y-3">
                {additional.map(vid => (
                  <Link to="/videos" key={vid._id}
                    className="flex items-center gap-3 card p-3.5 hover:border-academic-200 hover:shadow-card-md transition-all duration-200 group">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-navy-950 flex-shrink-0 flex items-center justify-center">
                      {vid.thumbnailUrl
                        ? <img src={vid.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        : <Play className="w-5 h-5 text-slate-400" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-navy-950 line-clamp-2 group-hover:text-academic-600 transition-colors">
                        {vid.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{vid.platform}</p>
                    </div>
                  </Link>
                ))}
                {videos.length > 4 && (
                  <Link to="/videos" className="block text-center text-xs font-semibold text-academic-600 hover:text-academic-700 py-2 transition-colors">
                    +{videos.length - 4} more video{videos.length - 4 !== 1 ? 's' : ''}
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Elegant empty state — no broken UI */
          <div className="max-w-2xl mx-auto">
            <div className="card p-12 text-center space-y-4 border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto">
                <Play className="w-7 h-7 text-slate-300" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-600">Introduction video coming soon</p>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  A short introductory video is being prepared and will appear here.
                </p>
              </div>
              <Link to="/about" className="link-arrow justify-center">
                Learn about Zelalem <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
