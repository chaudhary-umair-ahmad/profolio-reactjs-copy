import { t } from 'i18next';
import { isDevelopment } from '../../../utility/env';

const PAYMENT_METHODS = {
  checkout: {
    key: 'creditDebit',
    label: 'Credit/Debit Card',
    icon: 'DebitCardIcon',
    size: 24,
    component: 'CreditDebitWithCheckout',
    hideNewBadge: true,
  },
};

const LANGUAGES = [
  { key: 'ar', label: 'العربية', labelShort: 'العربية', alternate: 'en', rtl: true, darkMode: false },
  { key: 'en', label: 'English', labelShort: 'EN', alternate: 'ar', rtl: false, darkMode: false },
];

const APP_LOGO = {
  title: 'Bayut',
  // qrCodeSrc: `${getBaseURL()}/profolio-assets/images/downloadAppQRCode.svg`,
  icon: { rtl: 'BayutAppArabicLogo', ltr: 'BayutAppLogo' },
  linkIos: {
    en: 'https://apps.apple.com/pk/app/bayut-bahrain/id6740700252',
    ar: 'https://apps.apple.com/pk/app/bayut-bahrain/id6740700252',
  },
  linkPlayStore: {
    en: 'https://play.google.com/store/apps/details?id=com.bayut.bayutbh',
    ar: 'https://play.google.com/store/apps/details?id=com.bayut.bayutbh',
  },
  getLogoText: () => ({
    en: 'Bahrain',
    ar: 'البحرين',
  }),
  getLogoTextPlacement: () => ({
    en: {
      horizontal: 495,
      vertical: 550,
      widht: 140,
      height: 32,
    },
    ar: {
      horizontal: 355,
      vertical: 550,
      widht: 125,
      height: 32,
    },
  }),
};

const USER_LOCATIONS = {
  label: 'Region',
  level: '2',
};

const LISTING_LOCATIONS = {
  label: 'Region',
  level: '2',
};

const PLATFORM_CONFIGS = {
  bayut: { hasStatsInOwnDb: false, refetchStatsOnFilterChange: false },
  dubizzle: { hasStatsInOwnDb: false, refetchStatsOnFilterChange: false },
};

const appConstants = Object.freeze({
  // Unused
  LOCALE: 'ar-BH',
  TIMEZONE: 'Asia/Karachi',
  USER_LOCATIONS,
  LISTING_LOCATIONS,
  TITLE: 'Bayut Bahrain',
  SHORT_TITLE: 'BH',
  COUNTRY_CODE: 'BH',
  PHONE_REGEX: /^(\+973|973)?\d{8}$/,
  PHONE_CODE: '+973',
  CURRENCY: 'BHD',
  CURRENCY_SYMBOL: (str) => (str ? `${t('BHD')}${str}` : t('BHD')),
  LINK_TITLE: 'bayut.bh',
  SOCIAL_SLUG: { FACEBOOK: '', INSTAGRAM: '', X: '', LINKEDIN: '' },
  SHOW_SOCIALS: false,
  FONT_FAMILY_LITE: 'Lato, Droid Arabic Kufi, sans-serif',
  AUTH_TOKEN_COOKIE_KEY: 'byt_cd',
  USER_LOCAL_STORAGE_KEY: 'user_info',
  NUMBER_SYSTEM: 'western',
  PLATFORM_CONFIGS,
  LANGUAGES,
  PAYMENT_METHODS,
  APP_LOGO,
  HIDE_PREFERENCES: true,
  HIDE_LICENSES: true,
  SAVED_SEARCHES_ENABLED: true,
  ALLOW_PACKAGE_UPGRADE: false,
  ENABLE_FAL_LICENSE: false,
  ENABLE_NAFATH: false,
  ENABLE_SMART_CREDITS_UTILISATION: false,
  LOCATION_LEVELS: { city: 2 },
  KC_ENABLED: !isDevelopment,
  SHOW_ACCOUNT_MANAGER: true,
  SHOW_HELP_AND_SUPPORT: false,
  DAILY_RENTAL_ENABLED: false,
  SHOW_NATIONAL_ADDRESS: false,
  IS_CREDIT_CAPPING_ENABLED: false,
  INVITE_USER_TO_AGENCY_ENABLED: false,
  ADD_USER_TO_AGENCY_FORM_ENABLED: false,
  HAS_MEMBER_AREA: true,
  TRUE_CHECK_ENABLED: false,
  HAVE_LOGIN_SCREEN: isDevelopment,
  CONVERT_TO_AGENCY: true,
  SHOW_REGA_DETAIL: false,
  SHOW_REGA_FOOTER: false,
  POST_LISTING_POPUP: false,
  SHOW_SEARCH_HEADER: false,
  SHOW_AMENITIES_ICON: true,
  ZENDESK: false,
  IS_LMS_ENABLED: false,
  MANAGE_QUOTA_ENABLED: false,
  PROFILE_COMPLETION_APPLICABLE: false,
  TRU_BROKER_ENABLED: false,
  OFFPLAN_ENABLED: false,
  ALLOW_CREDITS_TOPTUP: false,
  MULTIPLATFROM_VIEW: false,
  SHOW_PLATFORM_LOGO: true,
  AGENCY_STAFF_HEADER: true,
  CURRENCY_ORDER_SUMMARY: true,
  PITCH_MOBILE_APP: false,
  PUSH_CONTENT_ON_SIDEBAR_EXPAND: false,
  SHOW_PAYMENT_METHODS: false,
  SHOW_FRACTION_CURRENCY: true,
  PITCH_MULTIPLATFORM_PACKAGES: true,
  SHOW_QUALITY_TIP: false,
  IMAGE_ANALYSER: false,
  SERVICE_AREAS_ENABLED: false,
  MONTHLY_CREDIT_PURCHASE: true,
  SHOW_VIDEO_FIELD: false,
  CAPTCHA_CONFIG: {
    siteKey: process.env.REACT_APP_STRAT_RECAPTCHA_KEY,
    theme: 'light',
    size: 'normal',
    enableWithKCOtpEndpoints: true,
  },
});

export default appConstants;
