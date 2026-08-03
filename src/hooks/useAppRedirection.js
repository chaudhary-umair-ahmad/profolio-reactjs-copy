import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import { getBaseURL, getClassifiedBaseURL, isDevelopment, TENANT_KEY } from '../utility/env';
import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getLoginPath } from '../utility/utility';
import { mapUserFromIdToken } from '../utility/user';
import { useSelector } from 'react-redux';
import { getLocaleForURL } from '../utility/language';
import { isKeycloakDisabledForPath } from '../utility/helpers';
import { useLazyGetCurrentUserQuery } from '../apis/user';

export const useAppRedirection = () => {
  const [show, setShow] = useState(false);
  const auth = useSelector((state) => state.auth.login);
  const currentPath = window?.location?.pathname?.replace(getLocaleForURL(), '');
  const [fetchCurrentUser] = useLazyGetCurrentUserQuery();

  // Redirection for login and app paths
  useEffect(() => {
    const auth_token = Cookies.get(tenantConstants.AUTH_TOKEN_COOKIE_KEY);
    if (tenantConstants.KC_ENABLED) {
      auth.initialized && redirectIfPathExists();
      //setShow(true);
    } else if (auth_token || tenantConstants.HAVE_LOGIN_SCREEN) {
      redirectIfPathExists();
      //setShow(true);
    } else if (!isDevelopment) {
      window.location.href = getLoginPath();
    }
  }, [auth.idToken]);

  // Redirect to first then render app
  const redirectIfPathExists = useCallback(async () => {
    const latestIdToken = auth?.idToken;

    // Fetch user data from API to get is_package_user
    const userResponse = await fetchCurrentUser();
    const apiUser = userResponse?.data;

    let pathToChangeOrigin;
    const pathToRedirect = tenantRoutes.redirectToAppPath();
    let mappedUser = latestIdToken ? mapUserFromIdToken(latestIdToken) : {};

    // Use is_package_user from current call (zameen always true as at zameen we dont have light user)
    if (TENANT_KEY === 'zameen') {
      mappedUser.is_package_user = true;
    } else if (apiUser?.is_package_user !== undefined) {
      mappedUser.is_package_user = apiUser?.is_package_user;
    }

    if (tenantConstants.KC_ENABLED && mappedUser) {
      pathToChangeOrigin = getPathToRedirect(mappedUser, !mappedUser.is_package_user);
    }

    if (pathToRedirect || pathToChangeOrigin) {
      const localePrefix = getLocaleForURL();
      const pathAlreadyHasLocale = pathToRedirect && pathToRedirect?.startsWith(localePrefix);

      // Determine the correct base URL based on user type and current origin
      let baseURL;
      if (pathToChangeOrigin?.origin) {
        baseURL = pathToChangeOrigin.origin;
      } else if (mappedUser && !mappedUser?.is_package_user) {
        // Non-package users should use classified base URL
        baseURL = getClassifiedBaseURL();
      } else {
        // Package users should use profolio base URL
        baseURL = getBaseURL();
      }

      // Path that will be generated if any relevant path or origin change (for lite experience) is there
      const finalPath =
        baseURL +
        (pathToRedirect
          ? pathAlreadyHasLocale
            ? pathToRedirect
            : localePrefix + pathToRedirect
          : pathToChangeOrigin.path);

      const isPublicPath = tenantRoutes?.publicRoutes()?.some((route) => currentPath?.includes(route?.path));

      if (!isPublicPath) window.location.replace(finalPath);
    } else {
      setShow(true);
    }
  }, [auth.idToken, fetchCurrentUser]);

  const getPath = (pathname, searchString, availablePaths) => {
    const isAllowedPath = availablePaths?.findIndex((route) => pathname?.includes(route?.path));
    return isAllowedPath == -1 ? availablePaths?.[0]?.path : pathname + searchString;
  };

  const getPathToRedirect = (user, isMemberArea) => {
    if (isMemberArea && window.location.origin != getClassifiedBaseURL()) {
      // lite experience
      const appPaths = tenantRoutes.app('', true, user);

      return {
        origin: getClassifiedBaseURL(),
        path:
          window.location.pathname.length > 1
            ? getPath(window.location.pathname, window.location.search, appPaths)
            : appPaths?.[0]?.path,
      };
    } else if (!isMemberArea && window.location.origin != getBaseURL()) {
      // pro experience
      return { origin: getBaseURL(), path: window.location.pathname + window.location.search };
    }

    return;
  };

  const setUserStorage = (user) => {
    const { id, is_package_user, is_suspended } = user;
    const localUserInfo = localStorage.getItem(tenantConstants.USER_LOCAL_STORAGE_KEY);
    (!localUserInfo || localUserInfo?.id != id) &&
      localStorage.setItem(
        tenantConstants.USER_LOCAL_STORAGE_KEY,
        JSON.stringify({ id, is_package_user, is_suspended }),
      );
  };

  const onLanding = (user, isMemberArea) => {
    return new Promise((resolve) => {
      if (tenantConstants.HAS_MEMBER_AREA) {
        if (user) {
          setUserStorage(user);
          const redirect = getPathToRedirect(user, isMemberArea);

          // To prevent redirecting for magic post-ad page
          const disableKeycloak = isKeycloakDisabledForPath();

          redirect && !disableKeycloak && window.location.replace(redirect.origin + redirect.path);

          setTimeout(() => {
            resolve();
          }, 10);
        }
      } else {
        resolve();
      }
    });
  };

  return { onLanding, show };
};
