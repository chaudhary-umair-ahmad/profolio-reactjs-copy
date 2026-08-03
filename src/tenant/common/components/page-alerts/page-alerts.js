import tenantTheme from '@theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button } from '../../../../components/common';
import { getClassifiedBaseURL } from '../../../../utility/env';
import { useSelector } from 'react-redux';

const PageAlert = () => {
  const { t } = useTranslation();
  const loggedInUser = useSelector((state) => state.app.loginUser);
  const { isMobile, locale, isMemberArea } = useSelector((state) => state.app.AppConfig);

  return (
    <>
      {loggedInUser?.user && loggedInUser?.user?.is_nafaz_verified === false && isMemberArea && (
        <Alert
          type="info"
          showIcon
          className="mb-20"
          style={{ zIndex: '100', margin: `${isMobile && '12px 1rem'}` }}
          message={t('Ready to post your listing? Complete your Nafath verification to kick off the posting process!')}
          action={
            <Button
              type={'link'}
              href={`${getClassifiedBaseURL()}/${locale}/verification/nafath/?redirectPath=${window.location.href}`}
              style={{
                '--btn-content-color': tenantTheme['base-color'],
                textDecoration: 'underline',
                margin: 0,
                '--btn-padding-y': 0,
              }}
              // onClick={nafathButtonClickEvent(loggedInUser, response, errorValue)}
            >
              {t('Verify')}
            </Button>
          }
          isMobile={isMobile}
        />
      )}
    </>
  );
};
export default PageAlert;
