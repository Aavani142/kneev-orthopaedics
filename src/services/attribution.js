import { ATTRIBUTION_KEYS } from '../../shared/lead-schema.js';

const STORE_KEY = 'kneev_attribution';
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // Google click IDs are valid for 90 days

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && Date.now() - raw.updatedAt < MAX_AGE_MS) return raw;
  } catch {
    /* storage blocked or corrupt */
  }
  return null;
}

/**
 * Call once on page load. Stores the click IDs and UTM parameters from the
 * landing URL so they survive in-page navigation and later form submissions.
 * First touch is kept; last touch is replaced whenever a new ad click arrives.
 */
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const incoming = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) incoming[key] = value.slice(0, 300);
  }
  const existing = read();
  const now = Date.now();
  const touch = {
    ...incoming,
    landing_page: window.location.href.slice(0, 500),
    referrer: document.referrer.slice(0, 300),
    timestamp: new Date(now).toISOString(),
  };
  const hasNew = Object.keys(incoming).length > 0;
  const record = {
    first: existing?.first || touch,
    last: hasNew || !existing ? touch : existing.last,
    updatedAt: hasNew || !existing ? now : existing.updatedAt,
  };
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(record));
  } catch {
    /* ignore */
  }
  window.__kneevAttribution = record;
  return record;
}

/** Flat attribution object sent with every lead. */
export function getAttribution() {
  const record = window.__kneevAttribution || read() || {};
  const last = record.last || {};
  const out = {};
  for (const key of ATTRIBUTION_KEYS) if (last[key]) out[key] = last[key];
  out.landing_page = last.landing_page || window.location.href;
  out.referrer = last.referrer || '';
  if (record.first?.timestamp) out.first_visit = record.first.timestamp;
  if (record.first?.utm_source) out.first_utm_source = record.first.utm_source;
  return out;
}
