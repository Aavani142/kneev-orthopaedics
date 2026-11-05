import { LeadModalProvider } from './components/LeadModalContext.jsx';
import ConsultationPopup from './components/ConsultationPopup.jsx';
import Home from './pages/Home.jsx';

export default function App() {
  return (
    <LeadModalProvider>
      <Home />
      <ConsultationPopup />
    </LeadModalProvider>
  );
}
