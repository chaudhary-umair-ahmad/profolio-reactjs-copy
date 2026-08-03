import { getBaseURL, isDevelopment } from '../../../utility/env';
import { isLiteExperienceURL, isMobile, isSafari } from '../../../utility/general';
import { isKeycloakDisabledForPath } from '../../../utility/helpers';

const PAYMENT_METHODS = {
  checkout: {
    key: 'creditDebit',
    label: 'Credit/Debit Card',
    icon: 'DebitCardIcon',
    size: 24,
    component: 'CreditDebitWithCheckout',
    hideNewBadge: true,
  },
  tamara: { key: 'tamara', label: 'Tamara', icon: 'TamaraLogo', size: 50, height: 25, component: 'Tamara' },
  tabby: { key: 'tabby', label: 'Tabby', icon: 'TabbyLogo', size: 50, height: 25, component: 'Tabby' },
  apple_pay: {
    key: 'applePay',
    label: 'Apple Pay',
    icon: 'ApplePayIcon',
    size: 50,
    component: 'ApplePay',
    hide: !isMobile() && !isSafari(),
  },
};

const LANGUAGES = [
  { key: 'ar', label: 'العربية', labelShort: 'العربية', alternate: 'en', rtl: true, darkMode: false },
  { key: 'en', label: 'English', labelShort: 'EN', alternate: 'ar', rtl: false, darkMode: false },
];

const APP_LOGO = {
  title: 'Bayut',
  icon: { rtl: 'BayutAppArabicLogo', ltr: 'BayutAppLogo' },
  qrCodeSrc: `${getBaseURL()}/profolio-assets/images/downloadAppQRCode.svg`,
  linkIos: {
    en: 'https://apps.apple.com/app/apple-store/id1504036401?pt=121218764&ct=app_adoption&mt=8',
    ar: 'https://apps.apple.com/app/apple-store/id1504036401?pt=121218764&ct=app_adoption&mt=8',
  },
  linkPlayStore: {
    en: `https://play.google.com/store/apps/details?id=com.bayut.bayutsaapp&referrer=utm_source%3D${isLiteExperienceURL() ? '3Dweb_platform' : '3Dprofolio'}%26utm_medium%3Dqr%26utm_campaign%3Dapp_adoption`,
    ar: `https://play.google.com/store/apps/details?id=com.bayut.bayutsaapp&referrer=utm_source%3D${isLiteExperienceURL() ? '3Dweb_platform' : '3Dprofolio'}%26utm_medium%3Dqr%26utm_campaign%3Dapp_adoption`,
  },
  getLogoText: (isMemberArea = false) => ({
    en: !isMemberArea ? 'KSA' : 'Saudi Arabia',
    ar: 'السعودية',
  }),
  getLogoTextPlacement: () => ({
    en: {
      horizontal: 495,
      vertical: 550,
      widht: 170,
      height: 32,
    },
    ar: {
      horizontal: 393,
      vertical: 550,
      widht: 125,
      height: 36,
    },
  }),
};

const USER_LOCATIONS = {
  label: 'City',
  level: '3',
};

const LISTING_LOCATIONS = {
  label: 'City',
  level: '3',
};

const PLATFORM_CONFIGS = {
  bayut: { hasStatsInOwnDb: false, refetchStatsOnFilterChange: false },
};

const PURPOSE_LIST = [
  {
    id: 9,
    name: 'Ad License Sell',
    price: '600',
    purpose_id: 1,
  },
  {
    id: 10,
    name: 'Ad License Rent',
    price: '250',
    purpose_id: 2,
  },
];

const appConstants = Object.freeze({
  // Unused
  TIMEZONE: 'Asia/Karachi',
  LOCALE: 'ar-SA',
  USER_LOCATIONS,
  LISTING_LOCATIONS,
  TITLE: 'Bayut KSA',
  SHORT_TITLE: 'KSA',
  COUNTRY_CODE: 'SA',
  PHONE_REGEX: /^\+9665\d{8}$/,
  PHONE_CODE: '+966',
  CURRENCY: 'SAR',
  CURRENCY_SYMBOL: (str) => <span className="currency-Saudi_Riyal_Symbol">{str}</span>,
  LINK_TITLE: 'bayut.sa',
  SOCIAL_SLUG: { FACEBOOK: 'BayutKSA', INSTAGRAM: 'BayutKSA', X: 'BayutKSA', LINKEDIN: 'BayutKSA' },
  SHOW_SOCIALS: true,
  FONT_FAMILY_LITE: 'Lato, Droid Arabic Kufi, sans-serif',
  AUTH_TOKEN_COOKIE_KEY: 'byt_cd',
  USER_LOCAL_STORAGE_KEY: 'user_info',
  NUMBER_SYSTEM: 'western',
  PLATFORM_CONFIGS,
  /** Post / edit listing form (tenant-specific UI). Other tenants omit or use `{}`. */
  FORM: {
    HIDE_PURPOSE_SELECT: true,
    PROPERTY_TYPE_AS_SELECT: true,
    USE_LISTING_CATEGORIES_FOR_PROPERTY_TYPE_ON_EDIT: true,
    PROPERTY_TYPE_FIELD_LABEL: 'Property Type',
    /**
     * Property-type radio order for project-attached listings, matched against the
     * `external_id` field on rows from `/api/surge/listing_categories`.
     *
     *   3  → Apartment
     *   4  → Villa
     *   6  → Floor
     *   12 → Chalet
     *   9  → Residential Land
     *   14 → Office
     *   16 → Showroom
     *   46 → Townhouse
     */
    PROJECT_LISTING_PROPERTY_TYPE_ORDER: [3, 4, 6, 12, 9, 14, 16, 46],
  },
  LANGUAGES,
  PAYMENT_METHODS,
  APP_LOGO,
  HIDE_PREFERENCES: false,
  HIDE_LICENSES: false,
  SAVED_SEARCHES_ENABLED: true,
  ALLOW_PACKAGE_UPGRADE: true,
  ENABLE_FAL_LICENSE: true,
  ENABLE_FAL_LICENSE_OTP_VERIFICATION: true,
  ENABLE_NAFATH: true,
  ENABLE_SMART_CREDITS_UTILISATION: true,
  LOCATION_LEVELS: { city: 2 },
  KC_ENABLED: !isDevelopment && !isKeycloakDisabledForPath(),
  AD_LICENSE_CREATION_ENABLED: true,
  MY_BOOKINGS_PATH: '/stays/my-bookings',
  HOST_DASHBOARD_PATH: '/host/dashboard',
  SHOW_ACCOUNT_MANAGER: true,
  SHOW_HELP_AND_SUPPORT: true,
  DAILY_RENTAL_ENABLED: true,
  BOOKING_IGNORE_EXPIRY: true,
  SHOW_NATIONAL_ADDRESS: true,
  IS_CREDIT_CAPPING_ENABLED: true,
  INVITE_USER_TO_AGENCY_ENABLED: true,
  ADD_USER_TO_AGENCY_FORM_ENABLED: false,
  HAS_MEMBER_AREA: true,
  TRUE_CHECK_ENABLED: true,
  HAVE_LOGIN_SCREEN: isDevelopment,
  CONVERT_TO_AGENCY: true,
  SHOW_REGA_DETAIL: true,
  SHOW_REGA_FOOTER: true,
  SHOW_REPORT_TO_REGA: true,
  FOOTER_ADVERTISE_WITH_BAYUT: true,
  FOOTER_BAYUT_STUDIOS: true,
  PROFILE_COMPLETION_APPLICABLE: true,
  TRU_BROKER_ENABLED: false,
  AGENT_PERFORMANCE_ENABLED: true,
  POST_LISTING_POPUP: true,
  SHOW_SEARCH_HEADER: false,
  SHOW_AMENITIES_ICON: true,
  ZENDESK: false,
  OFFPLAN_ENABLED: false,
  TRU_CHECK_ENABLED: true,
  SHOW_PAGE_ALERTS: true,
  NOTIFICATION_CENTER_ENABLED: true,
  IS_LMS_ENABLED: true,
  LMS_ENABLED: {
    IS_INSIGHTS_ENABLED: true,
    IS_PERFORMANCE_ENABLED: true,
    IS_LEADS_ENABLED: true,
    IS_LEADS_BREAKDOWN_ENABLED: true,
    IS_TOTAL_LEADS_ENABLED: true,
    AGENT_PERFORMANCE_DASHBOARD_PER_PAGE: 4,
    AGENT_PERFORMANCE_MODAL_PER_PAGE: 5,
  },
  MANAGE_QUOTA_ENABLED: false,
  SHOW_PLATFORM_LOGO: false,
  AGENCY_STAFF_HEADER: false,
  SHOW_PAYMENT_METHODS: true,
  SHOW_FRACTION_CURRENCY: true,
  PITCH_MOBILE_APP: true,
  PUSH_CONTENT_ON_SIDEBAR_EXPAND: true,
  ALLOW_LISTING_REFRESH: true,
  ALLOW_CREDITS_TOPTUP: true,
  PITCH_MULTIPLATFORM_PACKAGES: false,
  UPSELL_SERVICES: true,
  SHOW_QUALITY_TIP: false,
  SHOW_LISTING_DISCOUNT_TAG: true,
  PUSH_NOTIFICATIONS_ENABLED: true,
  IMAGE_ANALYSER: true,
  // Show completion status (Ready / Off-plan) on sell listings and the post-listing form.
  SHOW_COMPLETION_STATUS_FOR_SELL: true,
  SERVICE_AREAS_ENABLED: true,
  DAILY_RENTAL_REDIRECTION: true,
  AUTO_TRANSLATE_CONTENT: true,
  /** Post listing title/description: AR-first in Arabic UI, EN/AR payload alignment, LTR island, icon column layout (Bayut only). */
  LOCALE_AWARE_GENERATE_CONTENT_FIELDS: true,
  IS_CURRENCY_USER: true,
  LIMIT_CREDIT_PURCHASE: true,
  ALLOW_MAGIC_POST_AD: true,
  MONTHLY_CREDIT_PURCHASE: false,
  HIDE_AUTO_RENEWAL: true,
  HIDE_TIMELINE_DATA: true,
  SHOW_VIDEO_FIELD: true,
  CONTACT_PHONE: '+966501234567',
  CONTACT_EMAIL: 'support@bayut.sa',
  WHATSAPP_NUMBER: '+966501234567',
  NATIONAL_DAY_MODAL_ENABLED: true,
  NATIONAL_DAY_MODAL_START_DATE: '2025-09-21',
  NATIONAL_DAY_MODAL_END_DATE: '2025-09-27',
  PURPOSE_LIST,
  NON_REDIRECT_PATHS: [{ path: '/checkout' }],
  CAPTCHA_CONFIG: {
    siteKey: process.env.REACT_APP_STRAT_RECAPTCHA_KEY,
    theme: 'light',
    size: 'normal',
    enableWithKCOtpEndpoints: false,
  },
  ENABLE_EVENT_CHECKOUT: false,
  TRUBROKER_PREFERENCE_ENABLED: true,
  ENABLE_PROJECT_PARAM_IN_LEAD_LISTINGS: true,
  NAVIGATE_TO_ADD_PROPERTY: true,
  SHOW_BANK_DETAIL: false,
  MONTH_DURATION_FOR_CREDITS: true,
  HIDE_DROP_DOWN_CREDITS: true,
  BAYUT_MATCHING_LEAD: true,
  LEAD_NUDGE_TOAST_ENABLED: true,
  HIDE_INBOX: true,
  PLATFORM_KEY: true
});

export default appConstants;
