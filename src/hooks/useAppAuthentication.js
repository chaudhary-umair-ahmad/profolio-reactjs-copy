import tenantConstants from '@constants';
import { BroadcastChannel } from 'broadcast-channel';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import keycloak from '../keycloak';
import { removeCookies } from '../utility/cookies';
import { broadCastChannelName, cookieDomain, getClassifiedBaseURL, isDevelopment } from '../utility/env';
import { removeAppTokens, setAppTokens } from '../store/authSlice';
import { useLoginMutation, useLogoutStratMutation } from '../store/authApi';
import { KC_REQUESTS } from '../keycloak/requests';
import { getRequestHeaders } from '../store/parentApi';
import { getLoginPath } from '../utility/utility';
import useRouteType from './useRouteType';
import { logoutMoengage } from '../services/moengage/moengage';
import { getLocaleForURL } from '../utility/language';
import tenantRoutes from '@routes';

const channel = tenantConstants.KC_ENABLED && broadCastChannelName && new BroadcastChannel(broadCastChannelName);

const useAppAuthentication = (initialize) => {
  const REFRESH_TIME_GAP = 15000; // Time to refresh before expiry (00:00:15)
  const currentPath = window?.location?.pathname?.replace(getLocaleForURL(), '')
  const isPublicPath = tenantRoutes?.publicRoutes()?.some(route => currentPath?.includes(route?.path));

  const auth = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();
  const authRef = useRef(auth);
  const routeType = useRouteType();

  const [login] = useLoginMutation();
  const [logoutStrat] = useLogoutStratMutation();

  const awaitForUserToken = auth.authenticated || !auth.initialized;

  const canInitializeKC = () => !!(initialize && tenantConstants.KC_ENABLED && !isPublicPath);
  const getMessage = (k) => ({ idToken: k.idToken, refreshToken: k.refreshToken, token: k.accessToken });

  useEffect(() => {
    if (canInitializeKC()) {
      authRef.current = auth;
    }
  }, [auth.token]);

  useEffect(() => {
    const canInit = canInitializeKC();
    if (canInit) {
      initializeKeycloak();
      document.addEventListener('visibilitychange', refreshTokenAfterTabChange);
      channel.onmessage = (message) => onMessage(message);
    }
  }, [currentPath]);

  useEffect(() => {
    // To Check
    if (canInitializeKC() && auth.token) {
      try {
        const decodedToken = jwtDecode(auth.token);
        const expiryTime = decodedToken.exp * 1000;
        const now = Date.now();
        const delay = expiryTime - now - REFRESH_TIME_GAP;
        if (delay > 0) {
          const timer = setInterval(() => {
            if (document.visibilityState === 'visible') {
              handleRefreshToken(auth.refreshToken);
            }
          }, delay);
          return () => {
            clearTimeout(timer);
          };
        }
      } catch {}
    }
  }, [auth.authenticated]);

  const setStoreTokens = (obj, rest) => {
    const authObj = {
      token: obj.token,
      idToken: obj.idToken,
      refreshToken: obj.refreshToken,
      initialized: true,
      authenticated: true,
      ...rest,
    };
    dispatch(setAppTokens(authObj));
  };

  const initializeKeycloak = async () => {
    if (isPublicPath) return

    if (isDevelopment) {
      try {
        const kc = await keycloak;
        const authenticated = await kc.init({ onLoad: 'login-required' });
        setStoreTokens(kc, { authenticated });
        if (!authenticated) {
          kc.login();
        }
      } catch (error) {
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    } else {
      keycloak
        .init()
        .then((authenticated) => {
          if (!authenticated) {
            keycloak.login();
            return;
          } else {
            setStoreTokens(keycloak, { token: keycloak.accessToken });
          }
        })
        .catch((error) => {
          onLogout();
        });
    }
  };

  const handleRefreshToken = async (rT, onSuccess = () => {}) => {
    if (tenantConstants.KC_ENABLED) {
      if (isDevelopment) {
        const kc = await keycloak;
        kc.updateToken();
      } else {
        keycloak
          .refresh(rT || auth.refreshToken)
          .then(() => {
            setStoreTokens(keycloak, { token: keycloak.accessToken });
            channel.postMessage(JSON.stringify(getMessage(keycloak)));
            onSuccess();
          })
          .catch(() => {
            onLogout();
          });
      }
    } else {
      return;
    }
  };

  const refreshTokenAfterTabChange = () => {
    if (!document.hidden) {
      try {
        const currentAuth = authRef.current;
        const decodedToken = jwtDecode(currentAuth?.token);
        const expiryTime = decodedToken.exp * 1000;
        const now = Date.now();
        const delay = expiryTime - now - REFRESH_TIME_GAP;
        if (delay <= 0) {
          handleRefreshToken(currentAuth.refreshToken);
        }
      } catch {}
    }
  };

  const onMessage = (message) => {
    const data = JSON.parse(message);
    setStoreTokens(data);
  };

  const redirectToLogin = () => {
    dispatch(removeAppTokens());
    window.location.replace(getLoginPath());
  };

  const onLogin = (values) => {
    if (!tenantConstants.KC_ENABLED) {
      login(values).then((response) => {
        dispatch(
          setAppTokens({ token: response?.data?.token, authenticated: !!response?.data?.token, initialized: true }),
        );
        response?.data?.user &&
          Cookies.set(tenantConstants.AUTH_TOKEN_COOKIE_KEY, response?.data?.token, {
            secure: true,
            sameSite: 'Lax',
            path: '/',
            ...(cookieDomain && { domain: cookieDomain }),
          });
      });
    }
  };

  const destroyMoengageSession = () => {
    tenantConstants.PUSH_NOTIFICATIONS_ENABLED && logoutMoengage();
  };

  const onLogout = useCallback(async (options = {}) => {
    const { manualLogout = false, redirection = true } = options || {};
    // Clear National Day modal localStorage on logout
    localStorage.removeItem('nationalDayModalLastShown');

    if (tenantConstants.KC_ENABLED) {
      if (isDevelopment) {
        const kc = await keycloak;
        kc.logout();
        destroyMoengageSession();
      } else {
        keycloak.logout();
        if (auth.refreshToken) {
          await KC_REQUESTS.logout.request(auth.refreshToken, {
            ...getRequestHeaders(auth, {}, KC_REQUESTS.logout.url),
            'Content-Type': 'application/x-www-form-urlencoded',
          });
        }
        destroyMoengageSession();
      }

      if (!redirection) return;
      else if (manualLogout) {
        const locale = getLocaleForURL();
        window.location.href = `${getClassifiedBaseURL()}${locale}`;
      } else {
        redirectToLogin();
      }
    } else {
      !isDevelopment && (await logoutStrat());
      dispatch(removeAppTokens());
      removeCookies();
      destroyMoengageSession();
    }
  }, [auth.token]);

  return { auth, awaitForUserToken, redirectToLogin, onLogin, onLogout, handleRefreshToken, initializeKeycloak };
};
export default useAppAuthentication;
