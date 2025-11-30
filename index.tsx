import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ('serviceWorker' in navigator) {
  // Attempt to register service worker with error handling
  // This prevents the "Origin mismatch" error from stopping the app in preview environments
  navigator.serviceWorker.register('./sw.js')
    .then(() => {
      console.log('Service Worker Registered');
    })
    .catch((error) => {
      // Log as warning to indicate PWA features might be unavailable in this environment
      console.warn('Service Worker registration failed (PWA features disabled):', error);
    });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);