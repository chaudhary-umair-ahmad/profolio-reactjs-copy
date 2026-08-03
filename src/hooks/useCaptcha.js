import { useState, useCallback } from 'react';
import tenantConstants from '@constants';
import { getCaptchaToken } from '../utility/captchaToken';

export const useCaptcha = () => {
  const [captchaSolved, setCaptchaSolved] = useState(false);

  const isCaptchaRequired = tenantConstants.CAPTCHA_CONFIG?.enableWithKCOtpEndpoints;
  const shouldShowCaptcha = isCaptchaRequired && !captchaSolved;
  const shouldShowContent = !isCaptchaRequired || captchaSolved;

  const checkCaptchaToken = useCallback(
    (onNoToken, onHasToken) => {
      if (isCaptchaRequired) {
        const captchaToken = getCaptchaToken();
        if (!captchaToken) {
          if (onNoToken) onNoToken();
          return false;
        }
      }
      if (onHasToken) onHasToken();

      return true;
    },
    [isCaptchaRequired],
  );

  const handleCaptchaSuccess = useCallback((onSuccess) => {
    setCaptchaSolved(true);
    if (onSuccess) {
      onSuccess();
    }
  }, []);

  const resetCaptcha = useCallback(() => {
    setCaptchaSolved(false);
  }, []);

  const resetCaptchaAndTrigger = useCallback((onReset) => {
    setCaptchaSolved(false);
    if (onReset) {
      onReset();
    }
  }, []);

  return {
    captchaSolved,
    isCaptchaRequired,
    shouldShowCaptcha,
    shouldShowContent,
    checkCaptchaToken,
    handleCaptchaSuccess,
    resetCaptcha,
    resetCaptchaAndTrigger,
  };
};

export default useCaptcha;
