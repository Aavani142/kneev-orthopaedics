import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import KneeReplacement from '../components/KneeReplacement.jsx';
import ACLReconstruction from '../components/ACLReconstruction.jsx';
import WhyKneev from '../components/WhyKneev.jsx';
import DoctorProfile from '../components/DoctorProfile.jsx';
import PatientJourney from '../components/PatientJourney.jsx';
import Testimonials from '../components/Testimonials.jsx';
import ClinicGallery from '../components/ClinicGallery.jsx';
import FAQ from '../components/FAQ.jsx';
import ContactSection from '../components/ContactSection.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import Footer from '../components/Footer.jsx';
import MobileActionBar from '../components/MobileActionBar.jsx';

/** Restrained fade-in as sections enter the viewport. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -40px 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    // Safety net: never leave content hidden (jump links, print, unusual browsers).
    const fallback = setTimeout(() => els.forEach((el) => el.classList.add('is-visible')), 2500);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);
}

export default function Home() {
  useReveal();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <KneeReplacement />
        <ACLReconstruction />
        <WhyKneev />
        <DoctorProfile />
        <PatientJourney />
        <Testimonials />
        <ClinicGallery />
        <FAQ />
        <ContactSection />
        <FinalCTA />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
