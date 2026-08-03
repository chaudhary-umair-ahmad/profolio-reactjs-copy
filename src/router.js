import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import tenantData from '@data';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useLazyGetAgencyProfileDetailsQuery } from './apis/agency';
import { useLazyGetActiveProductsQuery } from './apis/common';
import { useLazyGetUserDetailFromTokenQuery } from './apis/user';
import { Spinner } from './components/common';
import RenderIfLoggedIn from './components/render-if-loggedIn/renderIfLoggedIn';
import RenderIfNotLoggedIn from './components/render-if-not-loggedIn/renderIfNotLoggedIn';
import { PublicPages } from './container';
import SignInPage from './container/pages/authentication/SignIn';
import Home from './home';
import { useAppAuthentication, useAppRedirection } from './hooks';
import { setAllSectionsPlatform } from './store/appSlice';
import { setBadgeLocalStorage } from './utility/user';

const MainRouter = () => {
  const { onLanding, show } = useAppRedirection();
  const { auth, awaitForUserToken, redirectToLogin, onLogout, handleRefreshToken } = useAppAuthentication(true);

  const { user } = useSelector((state) => state.app.loginUser);
  const dispatch = useDispatch();
  const [fetchUserDetailFromToken, { data, isLoading, error, isError }] = useLazyGetUserDetailFromTokenQuery();
  const [getActiveProducts] = useLazyGetActiveProductsQuery();
  const [fetchAgencyUsers] = useLazyGetAgencyProfileDetailsQuery();
  const availableRoutes = (user) => tenantRoutes.app('', true, user);
  const loading = !data && !isError ? true : isLoading;

  useEffect(() => {
    auth?.authenticated && show && fetchBaseDetail();
  }, [auth.authenticated, show]);

  // To refresh token if user got suspended or converted to package user.
  useEffect(() => {
    if (tenantConstants.KC_ENABLED && user?.id) {
      const localUserInfo = JSON.parse(localStorage.getItem(tenantConstants.USER_LOCAL_STORAGE_KEY) || null);
      if (localUserInfo) {
        const { id, is_package_user, is_suspended } = user;
        if (localUserInfo.is_package_user != is_package_user || localUserInfo.is_suspended != is_suspended) {
          handleRefreshToken(null, () => {
            localStorage.setItem(
              tenantConstants.USER_LOCAL_STORAGE_KEY,
              JSON.stringify({ id, is_package_user, is_suspended }),
            );
          });
        }
      }
    }
  }, [user]);

  useEffect(() => {
    setBadgeLocalStorage(user);
  }, [user]);

  const fetchBaseDetail = async () => {
    const response = await fetchUserDetailFromToken();
    if (response?.data) {
      const isMemberArea = !response?.data?.is_package_user;
      const isAgencyAdmin = response?.data?.agency?.id && !!response?.data?.is_agency_admin;
      onLanding(response?.data, isMemberArea, isAgencyAdmin).then(() => {
        getActiveProducts();
        isAgencyAdmin && fetchAgencyUsers(response?.data?.agency?.id);
      });
      dispatch(setAllSectionsPlatform({ value: tenantData?.platformList?.[0] }));
    }
  };

  return (
    <Routes>
      {/** Public Routes */}
      {tenantRoutes.publicRoutes().map((e) => {
        const Component = PublicPages[e.Component];
        return <Route key={e.path} path={e.path} element={<Component />} />;
      })}

      {/** Protected Routes */}
      <Route
        path={tenantRoutes.auth().signin.path}
        element={
          awaitForUserToken ? (
            loading ? (
              <Spinner type="full" />
            ) : (
              <Navigate to={user ? availableRoutes(user)[0].path : '/'} />
            )
          ) : (
            <RenderIfNotLoggedIn Component={<SignInPage />} redirectToLogin={redirectToLogin} />
          )
        }
      />
      <Route
        path="/"
        element={
          <RenderIfLoggedIn
            awaitForUserToken={awaitForUserToken}
            redirectToLogin={redirectToLogin}
            error={error}
            fetchBaseDetail={fetchBaseDetail}
            loading={loading}
            onLogout={onLogout}
            user={user}
            navigateTo={(e) => availableRoutes(e)[0].path}
          />
        }
      />
      <Route
        path="/*"
        element={
          <RenderIfLoggedIn
            Component={<Home />}
            awaitForUserToken={awaitForUserToken}
            redirectToLogin={redirectToLogin}
            error={error}
            fetchBaseDetail={fetchBaseDetail}
            loading={loading}
            onLogout={onLogout}
            user={user}
            navigateTo={(e) => availableRoutes(e)[0].path}
          />
        }
      />
    </Routes>
  );
};

export default MainRouter;
