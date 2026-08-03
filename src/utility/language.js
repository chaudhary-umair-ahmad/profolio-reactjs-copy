import tenantConstants from '@constants';
import { getClassifiedBaseURL, getBaseURL, TENANT_KEY } from './env';

export const getAppLanguage = () => {
  const pathDirectories = window.location.pathname.split('/');
  if (pathDirectories.length > 1) {
    const pathLocale = pathDirectories[1];
    const lang = tenantConstants.LANGUAGES.find((e) => e.key == pathLocale) || tenantConstants.LANGUAGES[0];
    return lang;
  }
};

export const getLocaleForURL = () => {
  const locale = getAppLanguage().key;
  return tenantConstants.LANGUAGES[0].key === locale ? '' : '/' + locale;
};

export const getLoginPath = () => {
  const redirectedUrl = window.location.href;
  const localePath = getLocaleForURL();

  const path = tenantConstants.HAVE_LOGIN_SCREEN
    ? `${window.location.origin}${localePath}/signin`
    : `${getClassifiedBaseURL()}${localePath}/${TENANT_KEY === 'zameen' ? 'login.html?r=' : 'account?externalRedirectPath='}${
        redirectedUrl ? redirectedUrl : `${getBaseURL()}/${localePath}`
      }`;
  return path;
};
