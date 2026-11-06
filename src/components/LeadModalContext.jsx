import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { POPUP_DELAY_MS } from '../config/site.js';
import { getLeadStatus } from '../services/leadService.js';
import { trackPopupOpen } from '../services/trackingService.js';

const LeadModalContext = createContext(null);
const SESSION_KEY = 'kneev_popup_closed';

function popupSuppressed() {
  if (new URLSearchParams(window.location.search).has('popup')) return false; // ?popup=1 forces it (testing)
  if (getLeadStatus()?.state === 'submitted') return true; // never re-ask someone who has enquired
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function LeadModalProvider({ children }) {
  const [modal, setModal] = useState({ open: false, source: 'popup', treatment: '', auto: false, key: 0 });
  const engaged = useRef(false);
  const openRef = useRef(false);
  openRef.current = modal.open;

  const openLeadModal = useCallback(({ source = 'cta', treatment = '' } = {}) => {
    trackPopupOpen(source);
    setModal((m) => ({ open: true, source, treatment, auto: false, key: m.key + 1 }));
  }, []);

  const closeLeadModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
    // Closing only snoozes the popup for this browser session; it returns on the next visit.
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Visitor is filling in an inline form: never interrupt with the popup.
  const markEngaged = useCallback(() => {
    engaged.current = true;
  }, []);

  // Popup on opening the site, after a short delay. Shown once per browser session;
  // never shown again after a successful enquiry.
  useEffect(() => {
    if (popupSuppressed()) return undefined;

    const timer = setTimeout(() => {
      if (engaged.current || openRef.current || popupSuppressed()) return;
      trackPopupOpen('auto');
      setModal((m) => (m.open ? m : { open: true, source: 'popup', treatment: '', auto: true, key: m.key + 1 }));
    }, POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const value = useMemo(() => ({ modal, openLeadModal, closeLeadModal, markEngaged }), [modal, openLeadModal, closeLeadModal, markEngaged]);
  return <LeadModalContext.Provider value={value}>{children}</LeadModalContext.Provider>;
}

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error('useLeadModal must be used inside LeadModalProvider');
  return ctx;
}
