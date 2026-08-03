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
    en: 'https://apps.apple.com/pk/app/bayut-jordan/id6740282818',
    ar: 'https://apps.apple.com/pk/app/bayut-jordan/id6740282818',
  },
  linkPlayStore: {
    en: 'https://play.google.com/store/apps/details?id=com.bayut.bayutjo',
    ar: 'https://play.google.com/store/apps/details?id=com.bayut.bayutjo',
  },
  getLogoText: () => ({
    en: 'Jordan',
    ar: 'الأردن',
  }),
  getLogoTextPlacement: () => ({
    en: {
      horizontal: 510,
      vertical: 550,
      widht: 140,
      height: 32,
    },
    ar: {
      horizontal: 335,
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
  LOCALE: 'ar-JO',
  TIMEZONE: 'Asia/Karachi',
  USER_LOCATIONS,
  LISTING_LOCATIONS,
  TITLE: 'Bayut Jordan',
  SHORT_TITLE: 'JO',
  COUNTRY_CODE: 'JO',
  PHONE_REGEX: /^(\+962|962|00962)?7[789]\d{7}$/,
  PHONE_CODE: '+962',
  CURRENCY: 'JOD',
  CURRENCY_SYMBOL: (str) => (str ? `${t('JOD')}${str}` : t('JOD')),
  LINK_TITLE: 'bayut.jo',
  SOCIAL_SLUG: {
    FACEBOOK: 'Bayut-Jordan-102481077812171/',
    INSTAGRAM: 'bayutjo/?igshid=4s68gvmcbl6a',
    X: 'BayutJo?s=09',
    LINKEDIN: 'bayut-jordan/about/',
  },
  SHOW_SOCIALS: true,
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
  PUSH_NOTIFICATIONS_ENABLED: false,
  IMAGE_ANALYSER: false,
  // Show completion status (Ready / Off-plan) on sell listings and the post-listing form.
  SHOW_COMPLETION_STATUS_FOR_SELL: true,
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
