import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { captureAttribution } from './services/attribution.js';
import { initTracking } from './services/trackingService.js';
import './index.css';

captureAttribution();
initTracking();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
