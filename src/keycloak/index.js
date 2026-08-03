import { KeycloakStratAuthenticator } from '@sector-labs/fe-auth-redux';
import { getClassifiedBaseURL, getKCBaseURL, isDevelopment, kcClientId, kcRealm } from '../utility/env';

const keycloakConfig = { url: getKCBaseURL() + '/auth', realm: kcRealm, clientId: kcClientId };

const keycloak = isDevelopment
  ? (async () => { // For Development only
      const Keycloak = (await import('keycloak-js')).default;
      return new Keycloak(keycloakConfig);
    })()
  : new KeycloakStratAuthenticator(getKCBaseURL(), kcRealm, kcClientId, getClassifiedBaseURL());

export default keycloak;
