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
  icon: { rtl: 'BayutAppArabicLogo', ltr: 'BayutAppLogo' },
  linkIos: {
    en: 'https://apps.apple.com/sa/app/bayut-oman/id6736895230',
    ar: 'https://apps.apple.com/sa/app/bayut-oman/id6736895230',
  },
  // qrCodeSrc: `${getBaseURL()}/profolio-assets/images/downloadAppQRCode.svg`,
  linkPlayStore: {
    en: 'https://play.google.com/store/apps/details?id=com.bayut.bayutoman',
    ar: 'https://play.google.com/store/apps/details?id=com.bayut.bayutoman',
  },
  getLogoText: () => ({
    en: 'Oman',
    ar: 'عُمان',
  }),
  getLogoTextPlacement: () => ({
    en: {
      horizontal: 525,
      vertical: 550,
      widht: 140,
      height: 32,
    },
    ar: {
      horizontal: 320,
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
  LOCALE: 'ar-OM',
  TIMEZONE: 'Asia/Karachi',
  USER_LOCATIONS,
  LISTING_LOCATIONS,
  TITLE: 'Bayut Oman',
  SHORT_TITLE: 'OM',
  COUNTRY_CODE: 'OM',
  PHONE_REGEX: /^(\+968|968|00968)?\d{8}$/,
  PHONE_CODE: '+968',
  CURRENCY: 'OMR',
  CURRENCY_SYMBOL: (str) => (str ? `${t('OMR')}${str}` : t('OMR')),
  LINK_TITLE: 'bayut.om',
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
  KC_ENABLED:  !isDevelopment,
  SHOW_ACCOUNT_MANAGER: true,
  SHOW_HELP_AND_SUPPORT: true,
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
  IS_LMS_ENABLED: true,
  LMS_ENABLED:{
    IS_INSIGHTS_ENABLED: false,
    IS_PERFORMANCE_ENABLED: false,
    IS_LEADS_ENABLED: true,
    IS_LEADS_BREAKDOWN_ENABLED: true,
    IS_TOTAL_LEADS_ENABLED: false,
    AGENT_PERFORMANCE_DASHBOARD_PER_PAGE: 4,
    AGENT_PERFORMANCE_MODAL_PER_PAGE: 5,
  },
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
  NOTIFICATION_CENTER_ENABLED: false,
  PITCH_MULTIPLATFORM_PACKAGES: true,
  UPSELL_SERVICES: false,
  SHOW_QUALITY_TIP: false,
  PUSH_NOTIFICATIONS_ENABLED: false,
  IMAGE_ANALYSER: false,
  // Show completion status (Ready / Off-plan) on sell listings and the post-listing form.
  SHOW_COMPLETION_STATUS_FOR_SELL: true,
  SHOW_VERIFIED_ICON: true,
  SERVICE_AREAS_ENABLED: true,
  MONTHLY_CREDIT_PURCHASE: true,
  SHOW_VIDEO_FIELD: false,
  ROOM_PROPERTY_TYPE_ENABLED: true,
  CAPTCHA_CONFIG: {
    siteKey: process.env.REACT_APP_STRAT_RECAPTCHA_KEY,
    theme: 'light',
    size: 'normal',
    enableWithKCOtpEndpoints: true,
  },
});

export default appConstants;
