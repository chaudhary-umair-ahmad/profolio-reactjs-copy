import { Result } from 'antd';
import RenderIfNotLoggedIn from '../render-if-not-loggedIn/renderIfNotLoggedIn';
import { Button, Spinner } from '../common';
import { Navigate } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';

const RenderIfLoggedIn = ({
  Component,
  awaitForUserToken,
  redirectToLogin,
  error,
  fetchBaseDetail,
  loading,
  onLogout,
  user,
  navigateTo,
}) => {
  const { t } = useTranslation();

  if (!awaitForUserToken) {
    return <RenderIfNotLoggedIn redirectToLogin={redirectToLogin} />;
  }

  if (error) {
    return (
      <Result
        status="error"
        title={t('Error')}
        subTitle={error}
        extra={[
          <Button onClick={fetchBaseDetail} loading={loading} type="primary" key="retry">
            {t('Retry')}
          </Button>,
          <Button key="buy" onClick={onLogout}>
            {t('Logout')}
          </Button>,
        ]}
      />
    );
  }

  if (loading) {
    return <Spinner type="full" />;
  }

  if (user) {
    return Component ? Component : <Navigate to={navigateTo(user)} />;
  }

  return null;
};

export default RenderIfLoggedIn;
