import tenantConstants from '@constants';
import Cookies from 'js-cookie';
import { cookieDomain } from './env';
import { getLoginPath } from './language';

export const removeCookies = () => {
  Cookies.remove(tenantConstants.AUTH_TOKEN_COOKIE_KEY, cookieDomain && { domain: cookieDomain, path: '/' });
  // Don't reload/redirect if already on signin page (prevents reload loop on 401)
  const pathname = window.location.pathname || '';
  const isOnSigninPage = pathname.endsWith('/signin') || pathname.includes('/signin');
  if (!isOnSigninPage) {
    window.location.replace(getLoginPath());
  }
};
