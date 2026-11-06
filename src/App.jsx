import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { LeadModalProvider } from './components/LeadModalContext.jsx';
import ConsultationPopup from './components/ConsultationPopup.jsx';
import Home from './pages/Home.jsx';

export default function App() {
  return (
    // domAnimation keeps the motion bundle small; reducedMotion respects OS settings.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <LeadModalProvider>
          <Home />
          <ConsultationPopup />
        </LeadModalProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
