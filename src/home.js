import tenantRoutes from '@routes';
import React, { Suspense, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Spinner, NationalDayModal } from './components/common';
import Page from './container';
import { useScrollToTop } from './hooks';
import withAdminLayout from './layout/withAdminLayout';
import { stSlash } from './utility/utility';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((state) => state.app.loginUser);
  useScrollToTop();

  const getAppRoutes = useCallback(() => {
    return tenantRoutes.app(stSlash(''), true, user);
  }, [user?.id]);

  return (
    <>
      <Suspense fallback={<Spinner type="full" />}>
        <Routes>
          {getAppRoutes().map((e) => {
            const Component = Page[e.Component];
            return <Route key={e.path} path={e.path} element={<Component />} />;
          })}
        </Routes>
      </Suspense>

      {user && (
        <NationalDayModal />
      )}
    </>
  );
};

export default withAdminLayout(Home);
