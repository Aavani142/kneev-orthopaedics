import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Services from '../components/Services.jsx';
import NotSure from '../components/NotSure.jsx';
import AppointmentSection from '../components/AppointmentSection.jsx';
import WhyKneev from '../components/WhyKneev.jsx';
import ClinicGallery from '../components/ClinicGallery.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Footer from '../components/Footer.jsx';
import MobileActionBar from '../components/MobileActionBar.jsx';
import FloatingContact from '../components/FloatingContact.jsx';

/*
 * Page order:
 *   1 Hero (+ marquee) - 2 How we can help - 3 "Not sure?" prompt - 4 Enquiry form
 *   5 Why KNEEV - 6 Inside KNEEV - 7 Location & contact - 8 Google Map - 9 Footer
 * The enquiry form (#book) and the popup share one <LeadForm> and submission handler.
 *
 * Not rendered (components kept in src/components for possible reuse):
 * KneeReplacement, ACLReconstruction, DoctorProfile, PatientJourney, Testimonials, FAQ, Interlude.
 */
export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <NotSure />
        <AppointmentSection />
        <WhyKneev />
        <ClinicGallery />
        <ContactSection />
      </main>
      <Footer />
      <MobileActionBar />
      <FloatingContact />
    </>
  );
}
