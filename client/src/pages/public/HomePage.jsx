import React, { useEffect, useState } from 'react';

// Existing components — unchanged
import Hero            from '../../components/home/Hero';
import PromoVideoSection from '../../components/home/PromoVideoSection';
import TutoringOverview  from '../../components/home/TutoringOverview';
import AboutSection    from '../../components/home/AboutSection';
import TeachingApproach from '../../components/home/TeachingApproach';
import AcademicStatistics from '../../components/home/AcademicStatistics';
import TestimonialsSection from '../../components/home/TestimonialsSection';

// New homepage-only components
import CertificatesPreview from '../../components/home/CertificatesPreview';
import FinalCTA            from '../../components/home/FinalCTA';

import { api } from '../../api/client';

export default function HomePage() {
  const [profile,      setProfile]      = useState(null);
  const [academic,     setAcademic]     = useState(null);
  const [subjects,     setSubjects]     = useState([]);
  const [videos,       setVideos]       = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [profData, acadData, subData, vidData, testiData] = await Promise.all([
          api.getProfile(),
          api.getAcademic(),
          api.getSubjects(),
          api.getVideos(),
          api.getTestimonials(),
        ]);
        if (isMounted) {
          setProfile(profData);
          setAcademic(acadData);
          setSubjects(subData);
          setVideos(vidData);
          setTestimonials(testiData);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex-1">

      {/* 1. HERO — Introduction + concise credibility summary */}
      <Hero profile={profile} academic={academic} />

      {/* 2. PROMOTIONAL VIDEO — "Meet Your Tutor" — null when no active videos */}
      <PromoVideoSection videos={videos} />

      {/* 3. WHAT I CAN TEACH — dynamic subjects + grade levels */}
      <TutoringOverview subjects={subjects} />

      {/* 4. ABOUT ME — personal identity, story, IT→tutoring connection */}
      <AboutSection profile={profile} />

      {/* 5. TEACHING APPROACH — 4-phase methodology */}
      <TeachingApproach />

      {/* 6. ACADEMIC EVIDENCE — detailed proof (CGPA, grades, courses, exams) */}
      <AcademicStatistics academic={academic} />

      {/* 7. CERTIFICATES / CREDENTIALS PREVIEW — links to full page */}
      <CertificatesPreview />

      {/* 8. TESTIMONIALS — approved only, pinned first — null when empty */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 9. FINAL CTA — Request Tutoring */}
      <FinalCTA profile={profile} />

    </div>
  );
}
