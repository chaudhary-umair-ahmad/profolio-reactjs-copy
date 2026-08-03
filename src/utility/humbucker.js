import * as Sentry from '@sentry/react';

import { getKCBaseURL, isHumbuckerEnabled, getHumbuckerScriptURL, getHumbuckerScriptVersion, getHumbuckerClientName } from './env';

const createHumbuckerHostScriptURL = () => {
  try {
    if (!isHumbuckerEnabled()) {
        return null;
    }

    const hostURL = getKCBaseURL() || getClassifiedBaseURL();
    if (!hostURL) {
        return null;
    }

    return `${new URL(hostURL).origin}/.humbucker/clients/browser.js`;
  } catch (error) {
    return null;
  }
};

export const createHumbuckerScriptURL = () => {
    if (!isHumbuckerEnabled()) {
        return null;
    }

    const scriptBaseURL =
        getHumbuckerScriptURL() || createHumbuckerHostScriptURL();
    if (!scriptBaseURL) {
        return null;
    }

    const queryParams = new URLSearchParams();
    queryParams.set("v", getHumbuckerScriptVersion());
    queryParams.set("client", getHumbuckerClientName());

    return `${scriptBaseURL}?${queryParams.toString()}`;
};

export const configureHumbucker = () => {
    if (!isHumbuckerEnabled()) {
        return;
    }

    window.__hbOptions__ = {
        exceptionLogger: (
            error,
            message,
            extra,
            tags,
        ) => {
            Sentry.captureException(error);
            console.error(`[HB ERROR] ${message}`, { error, extra, tags });
        },
    };
};
