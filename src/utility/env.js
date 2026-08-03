import variables from './variables';

const getBaseURL = () => process.env.REACT_APP_BASE_URL || '';
const getAPIBaseURL = () => process.env.REACT_APP_API_ENDPOINT;
const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';
const isDevelopment = process.env.REACT_APP_ENVIRONMENT === 'development';
const TENANT_KEY = process.env.REACT_APP_TENANT || 'zameen';

const getPlatform = () =>
  window.location.origin.includes('zameen')
    ? 'zameen'
    : window.location.origin.includes('dubizzle')
      ? 'dubizzle'
      : 'bayut';

const getPlatformEnvs = () => {
  if (typeof window == 'undefined') {
    return {};
  } else {
    const platform = getPlatform();

    if (variables?.[platform]) {
      return variables?.[platform];
    }
    return {};
  }
};

const getClassifiedBaseURL = () => getPlatformEnvs()?.classifiedBaseURL || process.env.REACT_APP_CLASSIFIED_URL;
const getKCBaseURL = () => getPlatformEnvs()?.kCBaseURL || process.env.REACT_APP_KEYCLOAK_BASE_URL;
const cookieDomain = getPlatformEnvs()?.cookieDomain || process.env.REACT_APP_COOKIE_DOMAIN;
const kcClientId = getPlatformEnvs()?.kcClientId || process.env.REACT_APP_KEYCLOAK_CLIENT_ID;
const kcRealm = getPlatformEnvs()?.kcRealm || process.env.REACT_APP_KEYCLOAK_REALM;
const broadCastChannelName = getPlatformEnvs()?.broadCastChannelName || process.env.REACT_APP_BROADCAST_CHANNEL_NAME;
const getColors = () => getPlatformEnvs()?.colors || {};

const isHumbuckerEnabled = () => !!process.env.REACT_APP_HUMBUCKER_ENABLED ? process.env.REACT_APP_HUMBUCKER_ENABLED === 'true' : !!getKCBaseURL();
const getHumbuckerScriptURL = () => process.env.REACT_APP_HUMBUCKER_SCRIPT_URL || null;
const getHumbuckerScriptVersion = () => process.env.REACT_APP_HUMBUCKER_SCRIPT_VERSION || '1';
const getHumbuckerClientName = () => process.env.REACT_APP_HUMBUCKER_CLIENT_NAME || `legion-profolio-${getPlatform()}-${TENANT_KEY}-${process.env.REACT_APP_ENVIRONMENT || 'unknown'}`;

const isGCCTenant = ['oman', 'bahrain', 'qatar', 'jordon', 'eg'].includes(TENANT_KEY)

export {
  getBaseURL,
  getClassifiedBaseURL,
  getAPIBaseURL,
  isProduction,
  isDevelopment,
  cookieDomain,
  TENANT_KEY,
  getKCBaseURL,
  kcClientId,
  kcRealm,
  broadCastChannelName,
  getColors,
  isGCCTenant,
  isHumbuckerEnabled,
  getHumbuckerScriptURL,
  getHumbuckerScriptVersion,
  getHumbuckerClientName,
};
