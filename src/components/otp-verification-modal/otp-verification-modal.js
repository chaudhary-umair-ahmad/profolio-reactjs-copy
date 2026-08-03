import tenantConstants from '@constants';
import InputOtp from '@onefifteen-z/react-input-otp';
import tenantTheme from '@theme';
import { Space } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLazyGetUserOtpQuery, useVerifyUserOtpMutation } from '../../apis/user';
import { KC_REQUESTS } from '../../keycloak/requests';
import { getRequestHeaders } from '../../store/parentApi';
import { Button, DrawerModal, notification, TextWithIcon, GoogleReCaptcha } from '../common';
import RenderTextLtr from '../render-text/render-text';
import { useCaptcha } from '../../hooks/useCaptcha';

const OtpVerificationModal = forwardRef(
  (
    {
      value,
      onCancelModal = () => {},
      onSuccess = () => {},
      onFail = () => {},
      otpFor = 'mobile',
      okText,
      width,
      customVerifyFunction,
      customResendFunction,
      disableActions = false,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const [otpCode, setOtpCode] = useState('');
    const [timer, setTimer] = useState(60);
    const [otpModalShow, setOtpModalShow] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [customVerifyLoading, setCustomVerifyLoading] = useState(false);
    const [verificationData, setVerificationData] = useState(false);
    const [otpForItem, setOtpFor] = useState(otpFor);
    const [actualValue, setActualValue] = useState(null);
    const [isResending, setIsResending] = useState(false);
    const { user } = useSelector((state) => state.app.loginUser);
    const auth = useSelector((state) => state.auth.login);
    const [getOtp] = useLazyGetUserOtpQuery();

    const phoneValue = actualValue || value;

    const [verifyOTP, { isLoading: otpVerifyLoading, error: verifyOtpError }] = useVerifyUserOtpMutation();

    const {
      shouldShowCaptcha,
      shouldShowContent,
      checkCaptchaToken,
      handleCaptchaSuccess,
      resetCaptchaAndTrigger,
    } = useCaptcha();

    useEffect(() => {
      let countdown;
      if (otpModalShow) {
        if (timer > 0) {
          countdown = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
        }
      }
      return () => clearInterval(countdown);
    }, [timer, otpModalShow]);

    useEffect(() => {
      otpFor && setOtpFor(otpFor);
    }, [otpFor]);

    useImperativeHandle(ref, () => ({
      onVerify: onSendOtp,
      showModal: (otpType = 'mobile') => {
        setOtpCode('');
        setOtpFor(otpType);
        setOtpModalShow(true);
        setTimer(60);
      },
    }));

    const mediums = { email: 'email', mobile: 'sms' };

    const onSendOtp = async (val, otpF = 'mobile') => {
      setOtpCode('');
      otpF && setOtpFor(otpF);
      setActualValue(val);
      setIsResending(false);

      const hasToken = checkCaptchaToken(
        () => {
          setTimer(0);
          resetCaptchaAndTrigger(() => setOtpModalShow(true));
        }
      );

      if (hasToken) {
        await proceedWithOtpRequest(val, otpF);
      }
    };

    const proceedWithOtpRequest = async (val, otpF) => {
      const endpoint = KC_REQUESTS?.[otpF];
      setTimer(60);
      const response = await (tenantConstants.KC_ENABLED
        ? endpoint?.request(val, getRequestHeaders(auth, {}, endpoint?.url))
        : getOtp({ id: user?.id, val, otpF }));
      if (response?.error) {
        notification.error(t(response?.error_description || response?.error));
        onFail();
      } else {
        setOtpModalShow(true);
        tenantConstants.KC_ENABLED && setVerificationData(response?.data || response);
      }
    };

    const onCaptchaSuccess = () => {
      handleCaptchaSuccess(() => {
        if (isResending) {
          proceedWithResendOtp();
        } else {
          proceedWithOtpRequest(phoneValue, otpForItem);
        }
      });
    };

    const proceedWithResendOtp = async () => {
      const endpoint = KC_REQUESTS?.[`resend_verify_${otpForItem}`];
      setResendLoading(true);
      setTimer(60);
      const response = await (tenantConstants.KC_ENABLED
        ? endpoint?.request(verificationData, mediums[otpForItem], getRequestHeaders(auth, {}, endpoint?.url))
        : getOtp(user?.id, phoneValue, otpForItem));
      if (response?.error) {
        setResendLoading(false);
        notification.error(t(response?.error_description || response?.error));
      } else {
        setResendLoading(false);
        setOtpCode('');
        setIsResending(false);
      }
    };

    const onResendOtp = async () => {
      if (customResendFunction) {
        setResendLoading(true);
        try {
          const response = await customResendFunction(value);
          if (response?.error) {
            notification.error(t(response?.error_description || response?.error));
          } else {
            setOtpCode('');
            setTimer(60);
            notification.success(t('OTP sent successfully'));
          }
        } finally {
          setResendLoading(false);
        }
        return;
      }

      setIsResending(true);

      const hasToken = checkCaptchaToken(
        () => {
          setTimer(0);
          resetCaptchaAndTrigger();
        }
      );

      if (hasToken) {
        await proceedWithResendOtp();
      }
    };

    const onVerifyOtp = async () => {
      if (!otpCode) {
        notification.error(t('Please enter OTP to verify!'));
      } else {
        const verifyEndpoint = KC_REQUESTS?.[`verify_${otpForItem}`];
        const data = { [otpForItem]: phoneValue, otp: otpCode };

        let response;

        if (customVerifyFunction) {
          setCustomVerifyLoading(true);
          response = await customVerifyFunction(phoneValue, otpCode);
          setCustomVerifyLoading(false);
        } else {
          response = await (tenantConstants.KC_ENABLED
            ? verifyEndpoint?.request(verificationData, otpCode, getRequestHeaders(auth, {}, verifyEndpoint?.url))
            : verifyOTP({ id: user?.id, values: data, otpForItem }));
        }

        if (response?.error) {
          notification.error(t(response?.error_description || response?.error));
          onFail();
          // notification.error(response?.response?.data?.error_description);
        } else {
          setOtpModalShow(false);
          setOtpCode('');
          const successMessage = response?.data?.message || response?.message || t(`${otpForItem === 'email' ? 'Email' : 'Phone Number'} Verified Successfully`);
          notification.success(t(successMessage));
          onSuccess();
        }
      }
    };

    const onCloseOtpModal = () => {
      setOtpModalShow(false);
      onCancelModal();
    };

    return (
      <DrawerModal
        title={t('OTP Verification')}
        visible={otpModalShow}
        destroyOnClose
        onCancel={onCloseOtpModal}
        width={width}
        footer={null}
      >
        <Space size={20} direction="vertical" className="text-center w-100">
          {shouldShowCaptcha ? (
            <>
              <div className="text-muted fs16 text-center">
                <div>{t('Please complete the verification to send OTP to:')}</div>
                <div className="base-color">
                  {otpForItem === 'mobile' ? <RenderTextLtr text={phoneValue} /> : phoneValue}
                </div>
              </div>
              <GoogleReCaptcha onSuccess={onCaptchaSuccess}/>
            </>
          ) : (
            <div className="text-muted fs16 flex" style={{ justifyContent: 'center' }}>
              {t(`You've received a 4-digit code on: `)}
              {<strong className="base-color">{otpForItem === 'mobile' ? <RenderTextLtr text={phoneValue} /> : phoneValue}</strong>}
            </div>
          )}

          {shouldShowContent && (
            <>
              <InputOtp
                error={verifyOtpError}
                errorMessage={t('Incorrect OTP')}
                otpLength={4}
                onChange={(value) => setOtpCode(value)}
                value={otpCode}
                wrapperClass="flex justify-content-center dir-ltr"
              />
              <Space size={4} align="center" className="text-muted fs16 semiBold">
                {!!timer && (
                  <TextWithIcon
                    icon="RxCounterClockwiseClock"
                    iconProps={{ size: 18, color: tenantTheme['primary-light-1'] }}
                    textColor={tenantTheme['primary-light-1']}
                    gap={'6px'}
                    title={`00:${timer?.toString()}`}
                  />
                )}
              </Space>
              <div>
                <div className="text-muted">{t(`I didn't receive any code`)}</div>
                <Button
                  type="link"
                  disabled={!!timer || disableActions}
                  onClick={onResendOtp}
                  loading={resendLoading}
                >
                  {t('Resend OTP')}
                </Button>
              </div>
            </>
          )}

          {shouldShowContent && (
            <Button
              type="primary"
              size="large"
              onClick={onVerifyOtp}
              block
              loading={customVerifyFunction ? customVerifyLoading : otpVerifyLoading}
              disabled={disableActions}
          >
              {okText || t('Continue')}
            </Button>
          )}
        </Space>
      </DrawerModal>
    );
  },
);

export default OtpVerificationModal;
