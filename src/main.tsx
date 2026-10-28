import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for PWA offline caching & installability
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Versi baru SIAP GURU tersedia.');
  },
  onOfflineReady() {
    console.log('SIAP GURU siap digunakan secara offline.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

