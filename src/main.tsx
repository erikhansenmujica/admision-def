import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for PWA Android capability and listen for updates
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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


