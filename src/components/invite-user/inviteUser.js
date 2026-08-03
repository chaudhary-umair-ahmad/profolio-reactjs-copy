import tenantData from '@data';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { Space } from 'antd';
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, DrawerModal, notification, Spinner, GoogleReCaptcha } from '../../components/common';
import { strings } from '../../constants/strings';
import { JSONFormStyled } from '../common/json-form/json-form';
import { useCaptcha } from '../../hooks/useCaptcha';
import { Modal } from '../common/modals/antd-modals';
import { OtpVerification } from './otp-verification';
import sentAnimation from './sentLottie.json';
import { useLazyGetOtpForInviteUserToAgencyQuery, useValidateOtpForInvitationMutation } from '../../apis/agency';
const Lottie = lazy(() => import('../../components/common/lottie/lottie'));

export const InviteUser = ({ isVisible, setIsVisible }) => {
  const { t } = useTranslation();
  const loggedInUserMobile = useSelector((state) => state.app.loginUser.user.mobile);
  const loggedInUserId = useSelector((state) => state.app.loginUser.user?.id);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [otpVisible, setOtpVisible] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [enableInvitationSent, setEnableInvitationSent] = useState(false);
  const [userName, setUserName] = useState('');
  const formRef = useRef();
  const initialRender = useRef(true);

  const {
    shouldShowCaptcha,
    shouldShowContent,
    checkCaptchaToken,
    handleCaptchaSuccess: hookHandleCaptchaSuccess,
    resetCaptchaAndTrigger,
  } = useCaptcha();

  const [getOtp, { isLoading: otpLoading }] = useLazyGetOtpForInviteUserToAgencyQuery();
  const [validateOtp, { isLoading: validatingOtp }] = useValidateOtpForInvitationMutation();

  useEffect(() => {
    if (!initialRender.current && userName != '') {
      setEnableInvitationSent(true);
    } else {
      initialRender.current = false;
    }
  }, [userName]);

  const onCloseModal = () => {
    setIsVisible(false);
    setOtpVisible(false);
    setPhoneNumber('');
    setReferenceNumber('');
    setFormData(null);
    setError(null);
    setOtpError(false);
    setLoading(false);
    setEnableInvitationSent(false);
    setUserName('');
    setResendLoading(false);
  };

  const handleOk = () => {
    !loading && formRef.current && formRef.current.submitForm();
  };

  const handleOtpOk = async (values) => {
    const response = await validateOtp({ code: values, referenceNumber });
    if (response.error) {
      if (response.error == 'Invalid OTP code') {
        setOtpError(true);
        setOtpVisible(true);
      } else {
        notification.error(response.error);
      }
    } else {
      setOtpVisible(false);
      setEnableInvitationSent(true);
      setUserName(tenantUtils.getLocalisedString(response?.data?.user, 'name'));
    }
  };

  const handleOtpResend = async () => {
    const hasToken = checkCaptchaToken(
      () => resetCaptchaAndTrigger()
    );

    if (hasToken) {
      setResendLoading(true);
      const response = await getOtp({ userId: loggedInUserId, identifier: phoneNumber });
      setResendLoading(false);
      if (response.error) {
        notification.error(response.error);
        setOtpError(true);
      } else {
        setReferenceNumber(response?.data?.reference_number);
      }
      return response;
    }
  };

  const handleCaptchaSuccess = () => {
    // Proceed with OTP resend after CAPTCHA completion
    handleOtpResend();
  };

  const handleInviteSubmit = async (values) => {
    const mobile = values.mobile.replace(/\+/g, '');

    const hasToken = checkCaptchaToken(
      () => resetCaptchaAndTrigger()
    );

    if (hasToken) {
      await proceedWithInviteSubmit(mobile);
    }
  };

  const proceedWithInviteSubmit = async (mobile) => {
    setInviteLoading(true);
    const response = await getOtp({ userId: loggedInUserId, identifier: mobile });
    setInviteLoading(false);
    if (!response.error) {
      setPhoneNumber(mobile);
      setReferenceNumber(response?.data?.reference_number);
      setIsVisible(false);
      setOtpVisible(true);
    } else {
      notification.error(response.error);
    }
  };

  const handleInviteCaptchaSuccess = () => {
    hookHandleCaptchaSuccess(() => {
      if (formRef.current) {
        formRef.current.submitForm();
      }
    });
  };

  const handleInvitationSentDone = () => {
    notification.success(
      `${t('Invitation has been sent to ')} ${userName} ${t(' to join your agency. ')} ${t(
        'We will notify you once they accept it.',
      )}`,
    );
    onCloseModal();
  };

  return (
    <>
      <DrawerModal
        type="primary"
        title={t(strings.invite_user)}
        visible={isVisible}
        okButtonProps={{ type: 'primary' }}
        loading={inviteLoading}
        onCancel={onCloseModal}
        width={510}
        height={'auto'}
        footer={null}
      >
        <Space direction="vertical" size={isMobile ? 24 : 40} className="w-100">
          {shouldShowCaptcha ? (
            <>
              <div className="text-muted fs16 text-center">
                <div>{t('Please complete the verification to invite user')}</div>
              </div>
              <GoogleReCaptcha
                onSuccess={handleInviteCaptchaSuccess}
                onError={(error) => console.error('CAPTCHA Error:', error)}
              />
            </>
          ) : null}

          {shouldShowContent && (
            <>
              <JSONFormStyled
                fields={tenantData.inviteToAgencyFormFields()}
                ref={formRef}
                onSubmitForm={handleInviteSubmit}
                loading={!formData && loading && !error}
                fetchError={error}
                retryButtonLoading={!formData && loading}
                noOfContentColumns={1}
              />
              <Button type="primary" size="large" onClick={handleOk} block loading={otpLoading}>
                {t('Confirm')}
              </Button>
            </>
          )}
        </Space>
      </DrawerModal>

      {otpVisible && (
        <DrawerModal
          type="primary"
          title={t('OTP Verification')}
          visible={otpVisible}
          okText={t('Confirm')}
          okButtonProps={{ type: 'primary' }}
          loading={validatingOtp}
          onOk={handleOtpOk}
          width={510}
          footer={null}
          onCancel={onCloseModal}
          height={'auto'}
        >
          <OtpVerification
            error={otpError}
            setError={setOtpError}
            phoneNumber={loggedInUserMobile}
            inviteePhoneNumber={phoneNumber}
            onSubmit={handleOtpOk}
            onResend={handleOtpResend}
            otpLoading={otpLoading}
            resendLoading={resendLoading}
          />
        </DrawerModal>
      )}

      {enableInvitationSent && (
        <Modal
          type="primary"
          title={t('Invitation Sent')}
          visible={enableInvitationSent}
          okText={t('Done')}
          okButtonProps={{ type: 'primary' }}
          loading={otpLoading}
          onOk={handleInvitationSentDone}
          width={510}
          footer={null}
          onCancel={onCloseModal}
        >
          <div className="text-muted fs16">
            <div>
              {`${t('Invitation has been sent to "')}`}
              <span className="base-color">{userName}</span>
              {`${t('" to join your agency. ')}`}
            </div>
            <div>{`${t('We will notify you once they accept it.')}`}</div>
          </div>
          <div className="py-24 text-center">
            <Suspense fallback={<Spinner />}>
              <Lottie width={isMobile ? 140 : 200} height={isMobile ? 140 : 200} animationData={sentAnimation} />
            </Suspense>
          </div>
          <div>
            <Button type="primary" size="large" onClick={handleInvitationSentDone} block loading={otpLoading}>
              {t('Done')}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
