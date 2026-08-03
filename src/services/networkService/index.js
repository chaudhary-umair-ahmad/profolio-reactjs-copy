import { getAPIBaseURL, isDevelopment, isProduction } from '../../utility/env';

import tenantConstants from '@constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import store from '@store';
import { removeCookies } from '../../utility/cookies';
import { getErrorString } from '../../utility/utility';
import { getAppLanguage } from '../../utility/language';

const getToken = () => Cookies.get(tenantConstants.AUTH_TOKEN_COOKIE_KEY);

const getAppSource = () => {
  const { isMobile, isMemberArea } = store.getState().app.AppConfig;
  return `${isMemberArea ? '' : 'profolio-'}web-${isMobile ? 'mobile' : 'desktop'}`;
};

const getRequestHeaders = (auth, h = {}, url = '') => {
  const headers = {};
  const isKcRequest = url.includes('/realms/');
  const lang = getAppLanguage();
  if (!isKcRequest) {
    headers.lang = lang.key;
    headers.source = h.source || tenantConstants.APP_SOURCE || getAppSource();
  }
  if ((tenantConstants.KC_ENABLED && isKcRequest) || (!tenantConstants.KC_ENABLED && !isProduction)) {
    headers['Authorization'] = `Bearer ${auth && auth.token ? auth.token : getToken()}`;
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

const client = axios.create({
  baseURL: getAPIBaseURL(),
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    const originalRequest = error.config;
    if (response) {
      if (`${response?.status}`.startsWith(5)) {
        // do something here
      } else if (`${response?.status}`.startsWith(4)) {
        // do something here
      } else if (`${response?.status}`.startsWith(3)) {
        // do something here
      } else {
        return originalRequest;
      }
    }
    return Promise.reject(error);
  },
);

class NetworkService {
  static async get(path = '', data, headerOptions, applyRetry = false, returnRespOn = () => true, axiosConfigs = {}) {
    let retryCount = applyRetry ? 0 : 2;
    while (retryCount < 3) {
      try {
        const response = await client({
          method: 'GET',
          url: path,
          headers: { ...headerOptions },
          data: null,
          ...(!!data && { params: data }),
          ...axiosConfigs,
        });
        if (response && response?.status == 401 && !path.includes('/favorites')) {
          !isDevelopment && removeCookies();
          return { ...response, error: getErrorString(response) };
        }
        if (response?.status % 200 < 10 && response?.status % 200 >= 0 && returnRespOn(response)) {
          return response;
        } else {
          if (!!applyRetry && retryCount < 2) {
            retryCount++;
            continue;
          } else {
            return { ...response, error: getErrorString(response) };
          }
        }
      } catch (e) {
        const response = e?.response;
        if (response && response?.status == 401 && !path.includes('/favorites')) {
          !isDevelopment && removeCookies();
          return { ...e, error: getErrorString(e) };
        }
        if (!!applyRetry && retryCount < 2) {
          retryCount++;
          continue;
        } else {
          return { ...e, error: getErrorString(e) };
        }
      }
    }
  }

  static async post(path = '', data = {}, headerOptions) {
    try {
      const response = await client({
        method: 'POST',
        url: path,
        ...(!!data && { data }),
        headers: { ...headerOptions },
      });
      return response;
    } catch (e) {
      return { ...e, error: getErrorString(e) };
    }
  }

  static async patch(path = '', data = {}, headerOptions) {
    try {
      const response = await client({
        method: 'PATCH',
        url: path,
        ...(!!data && { data: JSON.stringify(data) }),
        headers: { ...headerOptions },
      });
      return response;
    } catch (e) {
      return { ...e, error: getErrorString(e) };
    }
  }

  static async delete(path = '', data = {}, headerOptions) {
    try {
      const response = await client({
        method: 'DELETE',
        url: path,
        ...(!!data && { data }),
        headers: { ...headerOptions },
      });
      return response;
    } catch (e) {
      return { ...e, error: getErrorString(e) };
    }
  }

  static async put(path = '', data = {}, headerOptions) {
    try {
      const response = await client({
        method: 'PUT',
        url: path,
        data,
        headers: { ...headerOptions },
      });
      return response;
    } catch (e) {
      return { ...e, error: getErrorString(e) };
    }
  }
}

export { client as NetworkClient, NetworkService };
