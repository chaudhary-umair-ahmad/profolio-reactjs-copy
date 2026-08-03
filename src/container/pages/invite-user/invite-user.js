import React, { useEffect, useState } from 'react';

import tenantApi from '@api';
import tenantRoutes from '@routes';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, DrawerModal, notification } from '../../../components/common';
import { strings } from '../../../constants/strings';
import { useAppAuthentication, useGetLocation, useRouteNavigate } from '../../../hooks';
import { getBaseURL } from '../../../utility/env';
import { mapQueryStringToFilterObject } from '../../../utility/urlQuery';
import { useLazyGetInviteInformationQuery, useManageAgencyInviteMutation } from '../../../apis/agency';

const InviteUserPage = () => {
  const { t } = useTranslation();
  const navigate = useRouteNavigate();
  const [token, setToken] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState(null);
  const [errorTries, setErrorTries] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const [manageAgencyInvite] = useManageAgencyInviteMutation();
  const [getInviteInformation] = useLazyGetInviteInformationQuery();

  const location = useGetLocation();
  const { isMemberArea } = useSelector((state) => state.app.AppConfig);
  const user = useSelector((state) => state.app.loginUser?.user);

  useEffect(() => {
    onShowModal();
  }, []);

  const REDIRECT_PATH = isMemberArea ? tenantRoutes.app().listings.path : tenantRoutes.app().dashboard.path;

  const onCloseModal = () => {
    setToken('');
    setAcceptLoading(false);
    setRejectLoading(false);
    setLoading(false);
    setInviteData('');
    navigate(REDIRECT_PATH);
    window.location.reload(true);
  };

  const { handleRefreshToken } = useAppAuthentication();

  const handleAccept = async () => {
    setAcceptLoading(true);
    const values = { invitation: { status: 'accepted', token: token } };
    const response = await manageAgencyInvite(values);
    setAcceptLoading(false);
    if (!response.error) {
      notification.success(t('Invite Accepted Successfully'));
      handleRefreshToken(null, () => {
        navigate(tenantRoutes.app(getBaseURL(), false, user).dashboard.path);
      });
    } else {
      notification.error(response.error);
      setErrorTries(errorTries + 1);
      errorTries > 3 &&
        setTimeout(() => {
          navigate(REDIRECT_PATH);
          window.location.reload(true);
        }, 3000);
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    const values = { invitation: { status: 'rejected', token: token } };
    const response = await manageAgencyInvite(values);
    setRejectLoading(false);
    if (!response.error) {
      notification.success(t('Invite Rejected Successfully'));
      setTimeout(() => {
        navigate(REDIRECT_PATH);
        window.location.reload(true);
      }, 3000);
    } else {
      notification.error(response.error);
      setErrorTries(errorTries + 1);
      errorTries > 3 &&
        setTimeout(() => {
          navigate(REDIRECT_PATH);
          window.location.reload(true);
        }, 3000);
    }
  };

  const onShowModal = () => {
    getInviteInformationData();
  };

  const getInviteInformationData = async () => {
    const queryObj = mapQueryStringToFilterObject(location.search);
    setLoading(true);
    setToken(queryObj.queryObj.token);
    const values = { token: queryObj.queryObj.token };
    const response = await getInviteInformation({ values });
    setLoading(false);
    if (!response.error) {
      if (response) {
        setIsVisible(true);
        setInviteData(response.data);
      }
    } else {
      setError(true);
      notification.error(response.error);
      setTimeout(() => {
        navigate(REDIRECT_PATH);
        window.location.reload(true);
      }, 3000);
    }
  };

  return (
    <>
      {!error && (
        <DrawerModal
          type="primary"
          title={t(strings.invitation)}
          visible={isVisible}
          okText={t('Accept')}
          okButtonProps={{ type: 'primary' }}
          loading={loading | acceptLoading | rejectLoading}
          onOk={handleAccept}
          onCancel={onCloseModal}
          width={990}
          footer={
            <>
              <Button type="default" size="large" onClick={handleReject} loading={rejectLoading}>
                {t('Reject')}
              </Button>
              <Button type="primary" size="large" onClick={handleAccept} loading={acceptLoading}>
                {t('Accept')}
              </Button>
            </>
          }
        >
          {/* <JSONFormStyled
            fields={formData?.formFields?.list}
            ref={formRef}
            onSubmitForm={handleInviteSubmit}
            loading={!formData && loading && !error}
            fetchError={error}
            retryButtonLoading={!formData && loading}
            onRetry={getInviteUserData}
            noOfContentColumns={2}
          /> */}
          <div>
            <p>{`${t('You have been invited to join ')} ${inviteData?.invitation?.invitor?.agency?.name} ${t(' by ')} ${
              inviteData?.invitation?.invitor?.name
            }`}</p>
            <p>{`${t('If you want to be a part of this agency. Please accept this invitation.')}`}</p>
          </div>
        </DrawerModal>
      )}
    </>
  );
};

export default InviteUserPage;
