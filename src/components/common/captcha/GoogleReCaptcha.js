import React, { useRef, useState, useMemo } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import tenantConstants from '@constants';
import tenantTheme from '@theme';

import { Button } from '../button/button';
import Spinner from '../spinner/spinner';
import { setCaptchaToken } from '../../../utility/captchaToken';

const GoogleReCaptcha = ({ onSuccess, onError }) => {
  const { t, i18n } = useTranslation();
  const recaptchaRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const captchaConfig = useMemo(() => tenantConstants.CAPTCHA_CONFIG, []);

  const handleCaptchaChange = (token) => {
    setError(null);
    if (token) {
      handleCaptchaSuccess(token);
    }
  };

  const handleCaptchaSuccess = async (token) => {
    try {
      setCaptchaToken(token);

      if (onSuccess) onSuccess(token);
    } catch (error) {
      handleCaptchaError(error?.message || t('Error processing CAPTCHA'));
    }
  };

  const handleCaptchaExpired = () => {
    setError(t('CAPTCHA expired. Please complete it again.'));
    if (recaptchaRef?.current) {
      recaptchaRef?.current?.reset();
    }
  };

  const handleCaptchaError = (errorMessage = t('An error occurred with the CAPTCHA. Please try again.')) => {
    setError(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
  };

  const retryCaptcha = () => {
    setError(null);
    if (recaptchaRef?.current) {
      recaptchaRef?.current?.reset();
    }
  };

  if (!captchaConfig?.enableWithKCOtpEndpoints) {
    return null;
  }

  return (
    <div
      style={{
        textAlign: 'center',
        margin: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {error && (
        <div className="text-center" style={{ marginBottom: '20px' }}>
          <div className="fs16" style={{ marginBottom: '10px', color: tenantTheme['error-color'] }}>
            {error}
          </div>
          <Button size="large" onClick={retryCaptcha}>
            {t('Retry')}
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-center" style={{ marginBottom: '20px' }}>
          <Spinner size="large" />
        </div>
      )}

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={captchaConfig.siteKey}
        onChange={handleCaptchaChange}
        onExpired={handleCaptchaExpired}
        onErrored={handleCaptchaError}
        theme={captchaConfig.theme}
        size={captchaConfig.size}
        hl={i18n?.language}
        onLoadCapture={() => setLoading(false)}
        asyncScriptOnLoad={() => setLoading(true)}
      />

      {!captchaConfig?.siteKey && (
        <div className="fs16 text-center" style={{ marginTop: '10px', color: tenantTheme['error-color'] }}>
          {t('Security verification is temporarily unavailable. Please try again later.')}
        </div>
      )}
    </div>
  );
};

export default GoogleReCaptcha;
