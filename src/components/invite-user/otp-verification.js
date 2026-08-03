import InputOtp from '@onefifteen-z/react-input-otp';
import tenantTheme from '@theme';
import tenantConstants from '@constants';
import { Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextWithIcon, notification, GoogleReCaptcha } from '../../components/common';
import { useCaptcha } from '../../hooks/useCaptcha';

export const OtpVerification = ({ error, setError, phoneNumber, onSubmit, onResend, resendLoading, otpLoading }) => {
  const { t } = useTranslation();
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [enableResend, setEnableResend] = useState(false);

  const {
    shouldShowCaptcha,
    shouldShowContent,
    checkCaptchaToken,
    handleCaptchaSuccess: hookHandleCaptchaSuccess,
    resetCaptchaAndTrigger,
  } = useCaptcha();

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setEnableResend(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleResend = async () => {
    const hasToken = checkCaptchaToken(
      () => resetCaptchaAndTrigger()
    );

    if (hasToken) {
      await proceedWithResend();
    }
  };

  const proceedWithResend = async () => {
    setOtpCode('');
    const response = await onResend();
    if (response?.error) {
      setError(true);
      notification.error(response.error);
    } else {
      setTimer(60);
      setEnableResend(false);
      setError(null);
    }
  };

  const handleCaptchaSuccess = () => {
    hookHandleCaptchaSuccess(() => proceedWithResend());
  };

  const handleOtpChange = (value) => {
    setOtpCode(value);
  };

  const handleSubmit = () => {
    onSubmit(otpCode);
  };

  return (
    <Space size={20} direction="vertical" className="text-center w-100">
      {shouldShowCaptcha ? (
        <>
          <div className="text-muted fs16 text-center">
            <div>{t('Please complete the verification to resend OTP to:')}</div>
            <div className="base-color">{phoneNumber}</div>
          </div>
          <GoogleReCaptcha
            onSuccess={handleCaptchaSuccess}
            onError={(error) => console.error('CAPTCHA Error:', error)}
          />
        </>
      ) : null}

      {shouldShowContent && (
        <>
          <div className="text-muted fs16">
            {t(`You've received a 4-digit code on: `)}
            <strong className="base-color">{phoneNumber}</strong>
          </div>

          <InputOtp
            error={error}
            errorMessage={t('Incorrect OTP')}
            otpLength={4}
            onChange={handleOtpChange}
            value={otpCode}
            wrapperClass="flex justify-content-center dir-ltr"
          />
          <Space size={4} align="center" className="text-muted fs16 semiBold">
            <TextWithIcon
              icon="RxCounterClockwiseClock"
              iconProps={{ size: 18, color: tenantTheme['primary-light-1'] }}
              textColor={tenantTheme['primary-light-1']}
              gap={6}
              title={timer}
            />
          </Space>
          <div>
            <div className="text-muted">{t(`I didn't receive any code`)}</div>
            <Button type="link" disabled={!enableResend} onClick={handleResend} loading={resendLoading}>
              {t('Resend OTP')}
            </Button>
          </div>
          <Button type="primary" size="large" onClick={handleSubmit} block loading={otpLoading}>
            {t('Continue')}
          </Button>
        </>
      )}
    </Space>
  );
};
