const stripLangPrefix = (path) => path?.replace(/^\/[a-zA-Z]{2}(?:-[a-zA-Z]{2})?\//, '/') || '';

export const isKeycloakDisabledForPath = () => {
  const disableKeycloakEndpoints = ['/post-ad/'];

  let currentPath = '';
  if (window?.location?.pathname) {
    currentPath = window.location.pathname;
  }
  const normalizedPath = stripLangPrefix(currentPath);
  const disableKeycloak = disableKeycloakEndpoints.some((e) => normalizedPath.startsWith(e));

  return disableKeycloak;
};
