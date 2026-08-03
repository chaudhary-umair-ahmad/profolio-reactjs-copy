import { getCaptchaToken, clearCaptchaToken } from '../utility/captchaToken';
import { getKCBaseURL, kcClientId, kcRealm } from '../utility/env';
import tenantConstants from '@constants';

const kcRequestBaseURL = () => `${getKCBaseURL()}/auth/realms/${kcRealm}`;

export const KC_REQUESTS = {
  name: {
    url: `${kcRequestBaseURL()}/user-profile/attributes`,
    body: (val) => ({ name: val }),
    request: async (val, headers = {}) => {
      try {
        const response = await fetch(`${kcRequestBaseURL()}/user-profile/attributes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify({ name: val }),
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  email: {
    url: `${kcRequestBaseURL()}/user-profile/email/generate-challenge`,
    body: (val) => ({ email: val }),
    request: async (val, headers = {}) => {
      try {
        const payload = { email: val };

        if (tenantConstants?.CAPTCHA_CONFIG?.enableWithKCOtpEndpoints) {
          const captchaToken = getCaptchaToken();
          if (captchaToken) {
            payload.captcha = captchaToken;
            clearCaptchaToken();
          }
        }

        const response = await fetch(`${kcRequestBaseURL()}/user-profile/email/generate-challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  verify_email: {
    url: `${kcRequestBaseURL()}/user-profile/email/verify-challenge`,
    body: (res, code) => ({ token: res.token, code: code }),
    request: async (res, code, headers = {}) => {
      try {
        const response = await fetch(`${kcRequestBaseURL()}/user-profile/email/verify-challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify({ token: res?.token, code: code }),
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  resend_verify_email: {
    url: `${kcRequestBaseURL()}/user-profile/email/resend-challenge`,
    body: (res, medium) => ({ medium: medium, token: res?.token }),
    request: async (res, medium, headers = {}) => {
      try {
        const payload = { medium: medium, token: res?.token };

        if (tenantConstants?.CAPTCHA_CONFIG?.enableWithKCOtpEndpoints) {
          const captchaToken = getCaptchaToken();
          if (captchaToken) {
            payload.captcha = captchaToken;
            clearCaptchaToken();
          }
        }

        const response = await fetch(`${kcRequestBaseURL()}/user-profile/email/resend-challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  mobile: {
    url: `${kcRequestBaseURL()}/user-profile/phone-number`,
    body: (val) => ({ phone_number: val, challenge_medium: 'sms' }),
    request: async (val, headers = {}) => {
      try {
        const payload = { phone_number: val, challenge_medium: 'sms' };

        if (tenantConstants?.CAPTCHA_CONFIG?.enableWithKCOtpEndpoints) {
          const captchaToken = getCaptchaToken();
          if (captchaToken) {
            payload.captcha = captchaToken;
            clearCaptchaToken();
          }
        }

        const response = await fetch(`${kcRequestBaseURL()}/user-profile/phone-number`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  verify_mobile: {
    url: `${kcRequestBaseURL()}/user-profile/phone-number/verify-challenge`,
    body: (res, code) => ({ token: res.token, code: code }),
    request: async (res, code, headers = {}) => {
      try {
        const response = await fetch(`${kcRequestBaseURL()}/user-profile/phone-number/verify-challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify({ token: res?.token, code: code }),
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  resend_verify_mobile: {
    url: `${kcRequestBaseURL()}/user-profile/phone-number/resend-challenge`,
    body: (res, medium) => ({ medium: medium, token: res.token }),
    request: async (res, medium, headers = {}) => {
      try {
        const payload = { medium: medium, token: res?.token };

        if (tenantConstants?.CAPTCHA_CONFIG?.enableWithKCOtpEndpoints) {
          const captchaToken = getCaptchaToken();
          if (captchaToken) {
            payload.captcha = captchaToken;
            clearCaptchaToken();
          }
        }

        const response = await fetch(`${kcRequestBaseURL()}/user-profile/phone-number/resend-challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  change_password: {
    url: `${kcRequestBaseURL()}/user-profile/credentials/password`,
    request: async (body, headers = {}) => {
      try {
        const response = await fetch(`${kcRequestBaseURL()}/user-profile/credentials/password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(body),
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  logout: {
    url: `${kcRequestBaseURL()}/protocol/openid-connect/logout`,
    body: (refresh_token) => {
      const data = new URLSearchParams();
      data.append('client_id', kcClientId);
      data.append('refresh_token', refresh_token);
      return data;
    },
    request: async (refresh_token, headers = {}) => {
      try {
        const data = new URLSearchParams();
        data.append('client_id', kcClientId);
        data.append('refresh_token', refresh_token);

        const response = await fetch(`${kcRequestBaseURL()}/protocol/openid-connect/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers,
          },
          body: data,
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  passwordless_login_initiate: {
    request: async (phone_number, headers = {}) => {
      try {
        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('client_id', 'frontend');
        data.append('scope', 'openid');
        data.append('type', 'phone');
        data.append('phone_number', phone_number);

        const response = await fetch(`${kcRequestBaseURL()}/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers,
          },
          body: data,
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  passwordless_login_generate_challenge: {
    request: async (phone_number, headers = {}) => {
      try {
        const payload = {
          client_id: 'frontend',
          medium: 'sms',
          phone_number: phone_number,
        };

        if (tenantConstants?.CAPTCHA_CONFIG?.enableWithKCOtpEndpoints) {
          const captchaToken = getCaptchaToken();
          if (captchaToken) {
            payload.captcha = captchaToken;
            clearCaptchaToken();
          }
        }

        const response = await fetch(
          `${kcRequestBaseURL()}/passwordless-login/phone-number/generate-challenge`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: JSON.stringify(payload),
            credentials: 'include',
          },
        );

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
  passwordless_login_verify: {
    request: async (phone_number, token, code, headers = {}) => {
      try {
        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('client_id', 'frontend');
        data.append('scope', 'openid');
        data.append('type', 'phone_code');
        data.append('action', 'verify');
        data.append('phone_number', phone_number);
        data.append('token', token);
        data.append('code', code);

        const response = await fetch(`${kcRequestBaseURL()}/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers,
          },
          body: data,
          credentials: 'include',
        });

        const text = await response?.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        return { error: error?.message || 'Something went wrong' };
      }
    },
  },
};
