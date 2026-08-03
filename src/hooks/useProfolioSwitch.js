import { useEffect, useState } from 'react';

import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import Cookies from 'js-cookie';
import { getBaseURL, isDevelopment } from '../utility/env';
import { getLoginPath } from '../utility/utility';
import { getLocaleForURL } from '../utility/language';

const useProfolioSwitch = () => {
  const [show, setShow] = useState(isDevelopment);

  useEffect(() => {
    const auth_token = Cookies.get(tenantConstants.AUTH_TOKEN_COOKIE_KEY);
    if (auth_token || tenantConstants.KC_ENABLED || tenantConstants.HAVE_LOGIN_SCREEN) {
      redirectIfPathExists(true);
    } else if (!isDevelopment) {
      window.location.href = getLoginPath();
    }
  }, []);

  const redirectIfPathExists = () => {
    const pathToRedirect = tenantRoutes.redirectToAppPath();
    if (pathToRedirect) {
      window.location.replace(getBaseURL() + getLocaleForURL() + pathToRedirect);
    } else {
      setShow(true);
    }
  };

  return [show];
};
export default useProfolioSwitch;
