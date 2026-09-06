import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Local development must never silently run an outdated offline application.
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
if (isLocal && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(
    registrations.filter(registration => new URL(registration.scope).pathname === '/').map(registration => registration.unregister())
  ));
  void caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('semaforo-judicial-')).map(key => caches.delete(key))));
}

// Keep offline installation support on deployed sites only.
if (!isLocal && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  let refreshing = false;

  // Listen for controllerchange when the new active Service Worker takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Notify the application
    window.dispatchEvent(new CustomEvent('sw-controller-change'));
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Listen for new worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update is available and ready to activate
                window.dispatchEvent(
                  new CustomEvent('sw-update-available', {
                    detail: { registration, newWorker }
                  })
                );
              }
            });
          }
        });

        // Periodic check for updates every 15 minutes if active
        setInterval(() => {
          registration.update().catch(() => {});
        }, 15 * 60 * 1000);
      })
      .catch((err) => {
        console.log('SW registration notice:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


