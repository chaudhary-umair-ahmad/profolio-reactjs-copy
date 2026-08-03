import { isProduction } from './utility/env';
import * as Sentry from '@sentry/react';
import React from 'react';
import ReactGA from 'react-ga4';
import { useLocation, useNavigationType, matchRoutes } from 'react-router-dom';

// Sensitive keys to scrub from anything Sentry captures (headers, cookies, breadcrumb data).
const SENSITIVE_KEYS = ['authorization', 'cookie', 'kc_access_token', 'kc_id_token', 'kc_refresh_token'];

const scrubObject = obj => {
  if (!obj || typeof obj !== 'object') return obj;
  Object.keys(obj).forEach(key => {
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
      obj[key] = '[Filtered]';
    }
  });
  return obj;
};

// Sentry for errors
isProduction &&
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      // Sentry.browserTracingIntegration()
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        matchRoutes,
      }),
    ],
    tracesSampleRate: 0.1,
    // Never attach the user's IP/cookies just because the SDK can.
    sendDefaultPii: false,
    // Strip auth tokens from captured HTTP/fetch/xhr breadcrumbs.
    beforeBreadcrumb(breadcrumb) {
      scrubObject(breadcrumb?.data?.headers);
      scrubObject(breadcrumb?.data?.request_headers);
      return breadcrumb;
    },
    // Strip auth tokens from the request data attached to events.
    beforeSend(event) {
      scrubObject(event?.request?.headers);
      if (event?.request?.cookies) event.request.cookies = '[Filtered]';
      return event;
    },
  });

// Google Analytics
isProduction &&
  process.env.REACT_APP_GA_MEASUREMENT_ID &&
  ReactGA.initialize([{ trackingId: process.env.REACT_APP_GA_MEASUREMENT_ID }]);
