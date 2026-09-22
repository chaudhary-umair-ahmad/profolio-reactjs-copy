import tenantConstants from '@constants';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';

const getUserSettingsRoutes = (path, user) => [
  {
    path: `${path}/user-profile`,
    Component: 'UserProfilePage',
    name: 'User Settings',
    icon: 'FiUser',
    key: 'user-profile',
  },
  ...(user && user.is_agency_admin && user.is_package_user
    ? [
        {
          path: `${path}/agency-profile`,
          Component: 'AgencyPage',
          name: 'Agency Settings',
          icon: 'SideMenuSetting',
          key: 'agency-profile',
          isAgencyPage: true,
        },
      ]
    : []),
  ...(!tenantConstants.HIDE_LICENSES && user && !user.is_agency_admin && user.is_package_user
    ? [
        {
          path: `${path}/licenses`,
          route: '/licenses',
          Component: 'LicensesPage',
          name: 'Licenses',
          icon: 'PiIdentificationCard',
          badge: '',
          key: 'licenses',
        },
      ]
    : []),
  ...(!tenantConstants.HIDE_LICENSES && user && user.is_agency_admin && user.is_package_user
    ? [
        {
          path: `${path}/licenses`,
          Component: 'AgencyLicensesPage',
          name: 'Licenses',
          icon: 'PiIdentificationCard',
          badge: '',
          key: 'licenses',
          isAgencyPage: true,
        },
      ]
    : []),
  ...(!tenantConstants.HIDE_PREFERENCES && user && user.is_package_user
    ? [
        {
          path: `${path}/preferences`,
          Component: 'UserPreferencePage',
          name: 'Preferences',
          icon: 'VscSettings',
          key: 'preferences',
        },
      ]
    : []),
  ...(tenantConstants.SHOW_BANK_DETAIL ? [{
    path: `${path}/bank-detail`,
    Component: 'BankDetailPage',
    name: 'Bank Detail',
    icon: 'FiCreditCard',
    key: 'bank-detail',
  }] : []),
  {
    path: `${path}/change-password`,
    Component: 'ChangePasswordPage',
    name: 'Change Password',
    icon: 'MdPassword',
    key: 'change-password',
  },
];

const getInboxSubRoutes = (path, countDetails) => [];

const app = (path = '', asArray, user = {}) => {
  const isPremiumUser = user && user.is_package_user;
  const permissions = user && user.permissions;
  const isAgency = user && user.agency;
  const isMemberArea = user && !user.is_package_user;

  const routes = {
    dashboard: {
      path: `${path}/dashboard`,
      Component: 'Dashboard',
    },
    listings: {
      path: `${path}/listings`,
      Component: 'ListingsPage',
      isMemberArea: true,
    },
    post_listing: {
      path: `${path}/post-listing`,
      Component: 'PostListingLandingPage',
      isMemberArea: true,
    },
    update_listing: {
      path: `${path}/post-listing/:id`,
      Component: 'PostListingPage',
      isMemberArea: true,
    },
    upgrade_listing: {
      path: `${path}/post-listing/:id/upgrade`,
      Component: 'UpgradeListingPage',
      isMemberArea: true,
    },
    credits_usage: {
      path: `${path}/credits-usage`,
      Component: 'CreditsUsage',
    },
    ...(user &&
      !!user.is_agency_admin && {
        agency_staff: {
          path: `${path}/agency-staff`,
          Component: 'AgencyStaffPage',
          permission: PERMISSIONS_TYPE.STAFF,
          isAgencyPage: true,
        },
      }),
    invite_user: {
      path: `${path}/invite`,
      Component: 'InviteUserPage',
      isMemberArea: true,
    },
    ad_license: {
      path: `${path}/ad-license`,
      Component: 'AdLicense',
      isMemberArea: true,
    },
    ...(!tenantConstants.HIDE_INBOX
      ? {
          inbox: {
            path: `${path}/inbox/*`,
            Component: 'InboxPage',
            exact: false,
            subRoutes: getInboxSubRoutes(path),
          },
        }
      : {}),
    ...(!tenantConstants.HIDE_REPORTS
      ? {
          reports_summary: {
            path: `${path}/reports/summary`,
            Component: 'ReportsSummaryPage',
            isPremiumUserPage: true,
          },
          listing_report: {
            path: `${path}/reports/listing-report`,
            Component: 'ListingReportsPage',
            isPremiumUserPage: true,
          },
          leads_reports: {
            path: `${path}/reports/leads-reports`,
            Component: 'LeadsReports',
            isPremiumUserPage: true,
          },
        }
      : {}),
    ...(user &&
      user.isCurrencyUser && {
        prop_shop: {
          path: `${path}/packages`,
          Component: 'PropShopPage',
          isMemberArea: true,
        },
      }),
    settings: {
      path: `${path}/user-settings/*`,
      route: `${path}/user-settings`,
      Component: 'UserSettingsPage',
      exact: false,
      isMemberArea: true,
      subRoutes: getUserSettingsRoutes(path, user),
    },
    ...(user?.is_lms_enabled &&
      tenantConstants.IS_LMS_ENABLED &&
      !tenantConstants.HIDE_REPORTS && {
        leads_dashboard: {
          path: `${path}/lms/truleads`,
          Component: 'LeadsDashboard',
          isMemberArea: true,
        },
        leads_management: {
          path: `${path}/lms/leads`,
          Component: 'LeadsManagement',
          isMemberArea: true,
        },
        lms_dashboard: {
          path: `${path}/lms/lms-dashboard`,
          Component: 'LeadsDashboard',
          isMemberArea: true,
        },
      }),
      ...(tenantConstants.AGENT_PERFORMANCE_ENABLED && {
        agent_performance: {
          path: `${path}/agent-performance`,
          Component: 'AgentPerformance',
          isMemberArea: true,
        },
      }),
    others: [
      {
        path: `${path}/checkout`,
        Component: 'CheckoutPage',
        isMemberArea: true,
      },
    ],
  };

  if (asArray) {
    const list = [
      ...Object.keys(routes)
        .filter((e) => e !== 'others')
        .map((e) => routes[e]),
      ...routes.others,
    ];
    return list.filter((e) => {
      if (isMemberArea) {
        return !!e.isMemberArea;
      } else if (!isAgency && e.isAgencyPage) {
        return false;
      } else if (!isPremiumUser && e.isPremiumUserPage) {
        return false;
      } else return permissions && e.permission ? !!permissions[e.permission] : true;
    });
  }
  return routes;
};

const auth = (path = '', asArray) => {
  const routes = {
    signin: { path: `${path}/signin`, Component: 'SignInPage' },
  };
  if (asArray) {
    return [
      ...Object.keys(routes)
        .filter((e) => e !== 'others')
        .map((e) => routes[e]),
    ];
  }
  return routes;
};

const publicRoutes = () => [
  /* A page that exists to be measured: every component in every state, with
     the real theme and the overlays rendered in place. Never in production. */
  ...(process.env.REACT_APP_ENVIRONMENT !== 'production'
    ? [{ path: '/design-capture', Component: 'DesignCapture' }]
    : []),
  { path: '/content/process-payment', Component: 'PaymentProcess' },
  { path: '/maintenance', Component: 'Maintenance' },
  ...(tenantConstants?.ENABLE_EVENT_CHECKOUT ? [{ path: '/event-checkout', Component: 'EventCheckoutPage' }] : []),
  ...(tenantConstants?.ALLOW_MAGIC_POST_AD ? [{ path: '/post-ad/:id', Component: 'PostAd' }] : []),
];

const redirectToAppPath = () => {
  const path = window.location.pathname;
  const pathsToRedirect = ['/profolio', '/user-settings/profile', '/agency-settings'];
  const hasPathToRedirect = pathsToRedirect.find((e) => path.includes(e));

  if (hasPathToRedirect) {
    if (hasPathToRedirect === '/user-settings/profile' && path.includes('/profile')) {
      return path.replace('/profile', '/user-profile');
    } else if (hasPathToRedirect === '/agency-settings') {
      if (path.includes('/licenses')) {
        return '/user-settings/licenses';
      } else {
        return '/user-settings/agency-profile';
      }
    } else {
      return app().dashboard.path;
    }
  } else {
    return;
  }
};

export default { app, auth, publicRoutes, redirectToAppPath };
