import './instrument';
import './i18n/i18n';

import * as Sentry from '@sentry/react';
import * as serviceWorker from './serviceWorker';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { isProduction } from './utility/env';
import { configureHumbucker } from './utility/humbucker';
import store from '@store';
import { Provider } from 'react-redux';

// Create a root using the createRoot API
const container = document.getElementById('root');
const root = createRoot(
  container,
  isProduction
    ? {
        // Callback called when an error is thrown and not caught by an ErrorBoundary.
        onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
          console.warn('Uncaught error', error, errorInfo.componentStack);
        }),
        // Callback called when React catches an error in an ErrorBoundary.
        onCaughtError: Sentry.reactErrorHandler(),
      }
    : {},
);

// Configure Humbucker before the app renders so that
// any requests challenged by Humbucker get handled
// with the config set.
configureHumbucker();

// Render the App component inside the root
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
