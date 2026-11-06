import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Services from '../components/Services.jsx';
import Interlude from '../components/Interlude.jsx';
import KneeReplacement from '../components/KneeReplacement.jsx';
import ACLReconstruction from '../components/ACLReconstruction.jsx';
import WhyKneev from '../components/WhyKneev.jsx';
import DoctorProfile from '../components/DoctorProfile.jsx';
import PatientJourney from '../components/PatientJourney.jsx';
import Testimonials from '../components/Testimonials.jsx';
import ClinicGallery from '../components/ClinicGallery.jsx';
import FAQ from '../components/FAQ.jsx';
import ContactSection from '../components/ContactSection.jsx';
import AppointmentSection from '../components/AppointmentSection.jsx';
import Footer from '../components/Footer.jsx';
import MobileActionBar from '../components/MobileActionBar.jsx';
import FloatingContact from '../components/FloatingContact.jsx';

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
        <Interlude
          source="band-services"
          title="Not sure which treatment *you need?*"
          text="That is what a consultation is for. Speak with our team and we will guide you to the right assessment."
        />
        <KneeReplacement />
        <ACLReconstruction />
        <WhyKneev />
        <Interlude
          tone="dark"
          source="band-second-opinion"
          title="Already been *advised surgery?*"
          text="Bring your reports for a second opinion. Non-surgical options are always discussed first."
        />
        <DoctorProfile />
        <PatientJourney />
        <Testimonials />
        <ClinicGallery />
        <FAQ />
        <ContactSection />
        {/* Same enquiry form as the popup, directly above the footer */}
        <AppointmentSection />
      </main>
      <Footer />
      <MobileActionBar />
      <FloatingContact />
    </>
  );
}
