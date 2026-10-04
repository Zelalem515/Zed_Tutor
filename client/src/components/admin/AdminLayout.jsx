import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import {
  GraduationCap, Award, MessageSquare, BookOpen,
  ExternalLink, LogOut, Menu, X, ChevronRight,
  LayoutDashboard, Video, Quote, User, Shield
} from 'lucide-react';

const LOGO_SRC = '/assets/branding/logo.png';

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
    description: 'Overview & recent activity',
    exact: true,
  },
  {
    label: 'Profile & Content',
    path: '/admin/profile',
    icon: User,
    description: 'Name, bio, contact, social, security',
  },
  {
    label: 'Certificates',
    path: '/admin/certificates',
    icon: Award,
    description: 'Manage certificates & awards',
  },
  {
    label: 'Inquiries',
    path: '/admin/inquiries',
    icon: MessageSquare,
    description: 'View tutoring requests',
    badge: true,
  },
  {
    label: 'Subjects & Grades',
    path: '/admin/subjects',
    icon: BookOpen,
    description: 'Edit subjects and grade levels',
  },
  {
    label: 'Testimonials',
    path: '/admin/testimonials',
    icon: Quote,
    description: 'Moderate & approve testimonials',
    pendingBadge: true,
  },
  {
    label: 'Promo Videos',
    path: '/admin/videos',
    icon: Video,
    description: 'Manage promotional videos',
  },
];

// ── Logo — image with icon fallback ──────────────────────────────────────────
function AdminLogo({ size = 8 }) {
  const [failed, setFailed] = useState(false);
  const cls = `w-${size} h-${size} object-contain`;
  if (!failed) {
    return (
      <img
        src={LOGO_SRC}
        alt="ZED_Tutor"
        className={cls}
        onError={() => setFailed(true)}
      />
    );
  }
  return <GraduationCap className={`w-${Math.floor(size * 0.6)} h-${Math.floor(size * 0.6)} text-gold-400`} />;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ onClose, newInquiryCount, pendingTestimonials }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const isActive = (item) => {
    if (item.exact) return pathname === item.path;
    return pathname === item.path || pathname.startsWith(item.path + '/');
  };

  const getBadgeCount = (item) => {
    if (item.badge)        return newInquiryCount;
    if (item.pendingBadge) return pendingTestimonials;
    return 0;
  };

  return (
    <div className="flex flex-col h-full bg-navy-950 border-r border-navy-800 w-64">

      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-navy-800">
        <Link
          to="/admin"
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center flex-shrink-0 hover:bg-navy-700 transition-colors"
        >
          <AdminLogo size={6} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-white font-bold text-sm leading-none">ZED_Tutor</p>
          <p className="text-slate-500 text-[11px] font-medium mt-0.5">Admin Panel</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white lg:hidden flex-shrink-0"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const badgeCount = getBadgeCount(item);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors group ${
                active
                  ? 'bg-academic-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="leading-none">{item.label}</span>
                  {badgeCount > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                      active ? 'bg-white text-academic-700' : 'bg-blue-500 text-white'
                    }`}>
                      {badgeCount}
                    </span>
                  )}
                </div>
                <p className={`text-[11px] font-normal mt-0.5 truncate ${
                  active ? 'text-academic-200' : 'text-slate-600 group-hover:text-slate-500'
                }`}>
                  {item.description}
                </p>
              </div>
              {active && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer — view site + user email + logout */}
      <div className="px-3 py-4 border-t border-navy-800 space-y-0.5">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-slate-500" />
          <span>View Public Site</span>
        </Link>
        {user?.email && (
          <div className="px-3 py-2">
            <p className="text-[11px] text-slate-600 truncate" title={user.email}>{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

// ── Main AdminLayout export ───────────────────────────────────────────────────
export default function AdminLayout({ children, title }) {
  const [sidebarOpen,         setSidebarOpen]         = useState(false);
  const [newInquiryCount,     setNewInquiryCount]     = useState(0);
  const [pendingTestimonials, setPendingTestimonials] = useState(0);

  // Fetch badge counts once on mount — non-blocking, silent on error
  useEffect(() => {
    api.getInquiriesAll()
      .then(res => {
        const list = res?.data || res || [];
        setNewInquiryCount(Array.isArray(list) ? list.filter(i => i.status === 'NEW').length : 0);
      })
      .catch(() => {});

    api.getTestimonialsAll()
      .then(res => {
        const list = res?.data || [];
        setPendingTestimonials(Array.isArray(list) ? list.filter(t => t.status === 'PENDING').length : 0);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Desktop sidebar — sticky, always visible lg+ */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <Sidebar newInquiryCount={newInquiryCount} pendingTestimonials={pendingTestimonials} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 flex flex-col flex-shrink-0 h-full">
            <Sidebar
              onClose={() => setSidebarOpen(false)}
              newInquiryCount={newInquiryCount}
              pendingTestimonials={pendingTestimonials}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden bg-navy-950 border-b border-navy-800 h-14 flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
              <AdminLogo size={4} />
            </div>
            <span className="text-white font-bold text-sm truncate">
              ZED_Tutor <span className="text-slate-500 font-normal">/ Admin</span>
            </span>
          </div>
          {title && (
            <span className="text-xs font-semibold text-slate-400 truncate hidden sm:block">{title}</span>
          )}
          {(newInquiryCount > 0 || pendingTestimonials > 0) && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {newInquiryCount > 0 && (
                <Link to="/admin/inquiries">
                  <span className="text-[10px] font-black px-2 py-1 rounded-full bg-blue-500 text-white">
                    {newInquiryCount} inq
                  </span>
                </Link>
              )}
              {pendingTestimonials > 0 && (
                <Link to="/admin/testimonials">
                  <span className="text-[10px] font-black px-2 py-1 rounded-full bg-amber-500 text-white">
                    {pendingTestimonials} pending
                  </span>
                </Link>
              )}
            </div>
          )}
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
