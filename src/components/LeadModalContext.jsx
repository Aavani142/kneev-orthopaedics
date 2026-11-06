import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { POPUP_DELAY_MS } from '../config/site.js';
import { ENQUIRY_SENT_SESSION_KEY } from '../services/leadService.js';
import { trackPopupOpen } from '../services/trackingService.js';

const LeadModalContext = createContext(null);

/**
 * The enquiry popup opens automatically every time the website is opened or reloaded
 * (after POPUP_DELAY_MS). The only exception: a visitor who has already submitted an
 * enquiry is not asked again until they close the browser. `?popup=1` always forces it.
 */
function popupSuppressed() {
  if (new URLSearchParams(window.location.search).has('popup')) return false;
  try {
    return sessionStorage.getItem(ENQUIRY_SENT_SESSION_KEY) === '1';
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

  // Closing just closes it for this page view; it opens again on the next visit or reload.
  const closeLeadModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
  }, []);

  // Visitor is already typing in the on-page form: don't interrupt with the popup.
  const markEngaged = useCallback(() => {
    engaged.current = true;
  }, []);

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
