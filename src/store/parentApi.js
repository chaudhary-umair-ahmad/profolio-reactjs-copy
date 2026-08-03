import tenantConstants from '@constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { removeCookies } from '../utility/cookies';
import { getAPIBaseURL, isDevelopment, isProduction } from '../utility/env';
import { getAppLanguage } from '../utility/language';
import store from '@store';
import { isKeycloakDisabledForPath } from '../utility/helpers';

const excludedPaths = ['/favorites', '/change_password', '/searches/saved', '/credentials/password'];
const getErrorStringRtk = (res) => {
  let errors = res?.error?.data?.error || res?.error?.error;
  if(!errors){
    errors = res?.error?.data?.errors
  } else if (res?.error?.data?.errors){
    if (typeof res.error.data.errors === 'string'){
      errors += `, ${res.error.data.errors}`
    } else {
      errors = [errors, ...res.error.data.errors]
    }
  }

  if (errors) {
    if (typeof errors === 'string') return errors;
    if (typeof errors === 'object')
      return Object.keys(errors)
        .map((key) => errors[key])
        .join(', ');
  }
  if (res && res.response?.data?.error_description) return res.response?.data?.error_description;
  if (res && res.response?.data?.message) return res.response?.data?.message;
  if (res && res.message) return res.message;
  if (res && typeof res === 'string') return res;
  else return res;
};

const getToken = () => Cookies.get(tenantConstants.AUTH_TOKEN_COOKIE_KEY);

export const getAppSource = (state) => {
  const { isMobile, isMemberArea } = state || store.getState().app.AppConfig;
  return `${isMemberArea ? '' : 'profolio-'}web-${isMobile ? 'mobile' : 'desktop'}`;
};

export const getRequestHeaders = (auth, h = {}, url = '', state) => {
  const disableKeycloak = isKeycloakDisabledForPath();

  const headers = {};
  const isKcRequest = url.includes('/realms/');
  const lang = getAppLanguage();
  if (!isKcRequest) {
    headers.lang = lang.key;
    headers.source = h.source || tenantConstants.APP_SOURCE || getAppSource(state);
  }
  if ((tenantConstants.KC_ENABLED && isKcRequest) || (!tenantConstants.KC_ENABLED && !isProduction)) {
    if (isDevelopment || !disableKeycloak) {
      headers['Authorization'] = `Bearer ${auth && auth.token ? auth.token : getToken()}`;
    }

    headers['Accept-Language'] = lang.key;
  } else if (tenantConstants.KC_ENABLED && isDevelopment) {
    headers['kc_access_token'] = auth.token;
    headers['kc_id_token'] = auth.idToken;
    headers['enable_keycloak'] = true;
  } else if (tenantConstants.KC_ENABLED && !isKcRequest) {
    headers['enable_keycloak'] = true;
  }
  return headers;
};

const skippedAuthEndpoints = [];
const skipLangHeaders = ['/plotFinder'];

const baseQuery = fetchBaseQuery({
  baseUrl: getAPIBaseURL(),
  prepareHeaders: (headers, { arg, getState }) => {
    let obj = {};
    const skipAuth = skippedAuthEndpoints.find((e) => e == arg?.url);
    const skipLang = skipLangHeaders.some((e) => arg?.url?.includes(e));

    if (!skipAuth) {
      obj = getRequestHeaders(getState().auth.login, headers, arg?.url, getState().app.AppConfig);
    }
    Object.keys(obj).forEach((e) => {
      !!obj[e] && headers.set(e, obj[e]);
    });
    if (skipLang) {
      headers.delete('lang');
    }
    return headers;
  },
  credentials: 'include',
});

const customErrorEndpoints = ['postNewListing'];
const statusErrorEndpoints = ['verifyLicenseOtp'];

const parentApi = createApi({
  reducerPath: 'parentApi',
  baseQuery: async (args, api, extraOptions) => {
    try {
      let response = await baseQuery(args, api, extraOptions);
      if (response && response?.error?.status == 401 && !excludedPaths.some((path) => args?.url?.includes(path))) {
        removeCookies();
        return { ...response, error: getErrorStringRtk(response) };
      }
      if (response?.error?.status) {
        if (customErrorEndpoints.includes(api?.endpoint)) {
          const { error, errors, ...rest } = response?.error?.data || {};
          return {
            error: {
              data: rest,
              errorMessage: getErrorStringRtk(response),
            },
          };
        }
        if (statusErrorEndpoints?.includes(api?.endpoint)) {
          return { ...response, error: {message: getErrorStringRtk(response), status: response?.error?.status} };
        }
        return { ...response, error: getErrorStringRtk(response) };
      } else {
        return { ...response };
      }
    } catch (e) {
      return getErrorStringRtk(e);
    }
  },
  endpoints: (builder) => ({}),
  tagTypes: [
    'current',
    'fav-proprties',
    'user-profile',
    'profile',
    'my-listings',
    'agency-profile',
    'agency-staff',
    'agency-staff-user',
    'cart',
    'credits',
    'month-rules',
    'email-leads',
    'licenses',
    'saved-searches',
    'user-notifications',
    'user-notifications-count',
    'unread-count',
  ],
});

export default parentApi;
