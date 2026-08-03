import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import React from 'react';
import { Navigate } from 'react-router-dom';

const RenderIfNotLoggedIn = ({ Component, redirectToLogin }) => {
  if (tenantConstants.HAVE_LOGIN_SCREEN) {
    return Component ? Component : <Navigate to={tenantRoutes.auth().signin.path} />;
  } else {
    redirectToLogin();
    return null;
  }
};

export default RenderIfNotLoggedIn;
