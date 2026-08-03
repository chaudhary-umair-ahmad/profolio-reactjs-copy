/**
 * In-memory store for the short-lived, single-use reCAPTCHA token.
 *
 * The token is intentionally NOT persisted to localStorage: localStorage is
 * readable by any same-origin script, so an XSS could exfiltrate it. Keeping it
 * in a module-scoped variable confines it to the current tab's JS runtime and
 * clears it automatically on reload. It is set right after the captcha is
 * solved and consumed (read + cleared) on the very next KC OTP request, so a
 * cross-reload lifetime is not required.
 */
let captchaToken = null;

export const setCaptchaToken = (token) => {
  captchaToken = token || null;
};

export const getCaptchaToken = () => captchaToken;

export const clearCaptchaToken = () => {
  captchaToken = null;
};
