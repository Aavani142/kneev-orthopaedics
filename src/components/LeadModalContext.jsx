import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { POPUP_DELAY_MS, POPUP_SNOOZE_DAYS } from '../config/site.js';
import { getLeadStatus, setLeadStatus } from '../services/leadService.js';
import { trackPopupOpen } from '../services/trackingService.js';

const LeadModalContext = createContext(null);

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
    if (getLeadStatus()?.state !== 'submitted') setLeadStatus({ state: 'dismissed', at: Date.now() });
  }, []);

  // Visitor is filling in an inline form: never interrupt with the popup.
  const markEngaged = useCallback(() => {
    engaged.current = true;
  }, []);

  // First-visit popup, after a short delay. Suppressed after submission, and
  // for POPUP_SNOOZE_DAYS after the visitor closes it.
  useEffect(() => {
    const status = getLeadStatus();
    if (status?.state === 'submitted') return undefined;
    if (status?.state === 'dismissed' && Date.now() - status.at < POPUP_SNOOZE_DAYS * 864e5) return undefined;

    const timer = setTimeout(() => {
      if (engaged.current || openRef.current || getLeadStatus()?.state === 'submitted') return;
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
