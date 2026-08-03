import Moengage from '@moengage/web-sdk';

const initializeUserAttributes = (user) => {
  Moengage.add_unique_user_id(user?.external_id);
  Moengage.add_email(user?.email);
  Moengage.add_user_name(user?.name);
};

export function initializeMoEngage(user) {
  Moengage?.initialize({
    app_id: process.env.REACT_APP_MOENGAGE_APP_ID,
    debug_logs: 1,
    swPath: '/moengage-service-worker.js',
  });

  window.moengageInitialized = true; // Set flag on global window object

  initializeUserAttributes(user);

  // Ensure service worker is registered only once
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) {
        navigator.serviceWorker
          .register('/moengage-service-worker.js')
          .catch((err) => console.error('Service Worker registration failed:', err));
      }
    });
  }
}

export function trackPushEvent(eventName, eventData = {}) {
  if (!Moengage.isMoeLoaded()) {
    console.warn('MoEngage is not initialized.');
    return;
  }
  Moengage.track_event(eventName, eventData);
}

export function logoutMoengage() {
  Moengage?.destroy_session();
}
