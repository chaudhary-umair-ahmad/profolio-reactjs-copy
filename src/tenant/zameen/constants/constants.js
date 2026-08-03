import { isProduction } from '../../../utility/env';

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

const APP_LOGO = {
  title: 'Zameen',
  icon: { rtl: '', ltr: 'IconZameenMobileApp' },
  linkIos: {
    en: 'https://apps.apple.com/us/app/zameen-no-1-property-portal/id903880271?utm_source=profolio&utm_medium=banner&utm_campaign=app_adoption',
  },
  // qrCodeSrc: `${getBaseURL()}/profolio-assets/images/downloadAppQRCode.svg`,
  linkPlayStore: {
    en: 'https://play.google.com/store/apps/details?id=com.zameen.zameenapp&hl=en&utm_source=profolio&utm_medium=banner&utm_campaign=app_adoption&hl=en',
  },
};

const LANGUAGES = [{ key: 'en', label: 'EN', rtl: false, darkMode: false }];

const USER_LOCATIONS = {
  label: 'City',
  level: '3',
};

const LISTING_LOCATIONS = {
  label: 'City',
  level: '3',
};

const PLATFORM_CONFIGS = {
  zameen: { hasStatsInOwnDb: true, refetchStatsOnFilterChange: true },
  olx: { hasStatsInOwnDb: false, refetchStatsOnFilterChange: false },
};
const appConstants = Object.freeze({
  // Unused
  LOCALE: 'en-PK',
  TIMEZONE: 'Asia/Karachi',
  USER_LOCATIONS,
  LISTING_LOCATIONS,
  TITLE: 'Zameen',
  SHORT_TITLE: 'PK',
  COUNTRY_CODE: 'PK',
  CURRENCY: 'PKR',
  CURRENCY_SYMBOL: (str) => (str ? `${'Rs.'}${str}` : 'Rs.'),
  LANGUAGES,
  KC_ENABLED: false,
  SHOW_ACCOUNT_MANAGER: false,
  INVITE_USER_TO_AGENCY_ENABLED: false,
  ADD_USER_TO_AGENCY_FORM_ENABLED: true,
  IS_CREDIT_CAPPING_ENABLED: false,
  TRUE_CHECK_ENABLED: false,
  APP_SOURCE: 'profolio2',
  HAS_MEMBER_AREA: false,
  AUTH_TOKEN_COOKIE_KEY: isProduction ? 'zn_cd' : 'access-token',
  HAVE_LOGIN_SCREEN: !isProduction,
  CONVERT_TO_AGENCY: false,
  PROFILE_COMPLETION_APPLICABLE: false,
  TRU_BROKER_ENABLED: false,
  SHOW_REGA_DETAIL: false,
  SHOW_REGA_FOOTER: false,
  DAILY_RENTAL_ENABLED: false,
  LOCATION_LEVELS: { city: 3 },
  SHOW_SEARCH_HEADER: true,
  LINK_TITLE: 'zameen.com',
  SOCIAL_SLUG: { FACEBOOK: '', INSTAGRAM: '', X: '', LINKEDIN: '' },
  SHOW_SOCIALS: true,
  PAYMENT_METHODS,
  APP_LOGO,
  HIDE_PREFERENCES: false,
  HIDE_LICENSES: true,
  SAVED_SEARCHES_ENABLED: false,
  ALLOW_PACKAGE_UPGRADE: false,
  ENABLE_FAL_LICENSE: false,
  ENABLE_NAFATH: false,
  ENABLE_SMART_CREDITS_UTILISATION: false,
  SHOW_AMENITIES_ICON: false,
  NUMBER_SYSTEM: 'indian',
  ZENDESK: true,
  IS_LMS_ENABLED: false,
  MANAGE_QUOTA_ENABLED: true,
  DISABLE_PENDING_USER_CONTROLS: true,
  PLATFORM_CONFIGS: PLATFORM_CONFIGS,
  NOTIFICATION_CENTER_ENABLED: false,
  SHOW_PLATFORM_LOGO: false,
  AGENCY_STAFF_HEADER: false,
  SHOW_PAYMENT_METHODS: true,
  SHOW_FRACTION_CURRENCY: false,
  MULTIPLATFROM_VIEW: true,
  SHOW_PAGE_ALERTS: false,
  CONTRACTS_ENABLED: true,
  PITCH_MOBILE_APP: false,
  PUSH_CONTENT_ON_SIDEBAR_EXPAND: false,
  PITCH_MULTIPLATFORM_PACKAGES: false,
  SHOW_QUALITY_TIP: true,
  PUSH_NOTIFICATIONS_ENABLED: false,
  IMAGE_ANALYSER: false,
  SERVICE_AREAS_ENABLED: false,
  MONTHLY_CREDIT_PURCHASE: true,
  SHOW_VIDEO_FIELD: true,
  SHOW_AGENCY_STAFF_SEATS_STATS: true,
  CAPTCHA_CONFIG: {
    siteKey: process.env.REACT_APP_STRAT_RECAPTCHA_KEY,
    theme: 'light',
    size: 'normal',
    enableWithKCOtpEndpoints: false,
  },
  ZAMEEN_KEY: true
});

export default appConstants;
