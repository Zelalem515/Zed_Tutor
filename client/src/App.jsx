import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import AcademicJourneyPage from './pages/public/AcademicJourneyPage';
import AcademicEvidencePage from './pages/public/AcademicEvidencePage';
import TutoringPage from './pages/public/TutoringPage';
import CertificatesPage from './pages/public/CertificatesPage';
import TestimonialsPage from './pages/public/TestimonialsPage';
import VideosPage from './pages/public/VideosPage';
import ContactPage from './pages/public/ContactPage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminCertificatesPage from './pages/admin/AdminCertificatesPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminSubjectsPage from './pages/admin/AdminSubjectsPage';
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage';
import AdminVideosPage from './pages/admin/AdminVideosPage';

import { api } from './api/client';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// All /admin/* routes (except /admin/login) use their own AdminLayout shell
function AppLayout() {
  const { pathname } = useLocation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const p = await api.getProfile();
      setProfile(p);
    }
    load();
  }, []);

  // Any path under /admin (except /admin/login) is standalone — no public Navbar/Footer
  const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminArea) {
    return (
      <Routes>
        <Route path="/admin"               element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/profile"       element={<ProtectedRoute><AdminProfilePage /></ProtectedRoute>} />
        <Route path="/admin/certificates"  element={<ProtectedRoute><AdminCertificatesPage /></ProtectedRoute>} />
        <Route path="/admin/inquiries"     element={<ProtectedRoute><AdminInquiriesPage /></ProtectedRoute>} />
        <Route path="/admin/subjects"      element={<ProtectedRoute><AdminSubjectsPage /></ProtectedRoute>} />
        <Route path="/admin/testimonials"  element={<ProtectedRoute><AdminTestimonialsPage /></ProtectedRoute>} />
        <Route path="/admin/videos"        element={<ProtectedRoute><AdminVideosPage /></ProtectedRoute>} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/"                  element={<HomePage />} />
          <Route path="/about"             element={<AboutPage />} />
          <Route path="/academic-journey"  element={<AcademicJourneyPage />} />
          <Route path="/academic-evidence" element={<AcademicEvidencePage />} />
          <Route path="/tutoring"          element={<TutoringPage />} />
          <Route path="/certificates"      element={<CertificatesPage />} />
          <Route path="/testimonials"      element={<TestimonialsPage />} />
          <Route path="/videos"            element={<VideosPage />} />
          <Route path="/contact"           element={<ContactPage />} />

          {/* Admin login uses public layout so Navbar/Footer appear (by design) */}
          <Route path="/admin/login"       element={<AdminLoginPage />} />
        </Routes>
      </main>
      <Footer profile={profile} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
