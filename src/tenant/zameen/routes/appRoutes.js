import { PERMISSIONS_TYPE } from '../../../constants/permissions';

const getUserSettingsRoutes = (path, user) => [
  {
    path: `${path}/user-profile`,
    route: '/user-profile',
    Component: 'UserProfilePage',
    name: 'User Settings',
    icon: 'FiUser',
    key: 'user-profile',
  },
  ...(user && !!user.is_agency_admin
    ? [
        {
          path: `${path}/agency-profile`,
          name: 'Agency Settings',
          Component: 'AgencyPage',
          icon: 'SideMenuSetting',
          key: 'agency-profile',
          isAgencyPage: true,
        },
      ]
    : []),
  {
    path: `${path}/preferences`,
    route: '/preferences',
    Component: 'UserPreferencePage',
    name: 'Preferences',
    icon: 'VscSettings',
    key: 'preferences',
  },
  {
    path: `${path}/change-password`,
    route: '/change-password',
    Component: 'ChangePasswordPage',
    name: 'Change Password',
    icon: 'MdPassword',
    key: 'change-password',
  },
];

const getInboxSubRoutes = (path, countDetails) => {
  return [
    {
      key: 'received',
      path: `${path}/received`,
      route: '/received/*',
      Component: 'InboxPage',
      name: 'Inbox',
      icon: 'FiInbox',
      label: 'Inbox',
      badge: countDetails && countDetails['unread_conversations_count'],
      type: 'inbox',
      sub: [{ path: `${path}/received/:id`, route: '/received/:id', Component: 'MailDetailViewPage', canReply: true }],
    },
    {
      key: 'trash',
      path: `${path}/trash`,
      route: '/trash',
      Component: 'TrashPage',
      name: 'Trash',
      icon: 'FiTrash2',
      badge: '',
      type: 'deleted',
      label: 'Trash',
      value: 'trash',
      sub: [{ path: `${path}/trash/:id`, route: ':id', Component: 'MailDetailViewPage', canReply: false }],
    },
  ];
};

const app = (path = '', asArray, user = {}, userCount) => {
  const isPremiumUser = user.type !== 'free';
  const permissions = user.permissions;
  const isAgency = user.agency;

  const routes = {
    dashboard: {
      path: `${path}/dashboard`,
      Component: 'Dashboard',
    },
    post_listing: {
      path: `${path}/post-listing`,
      Component: 'PostListingPage',
    },
    update_listing: {
      path: `${path}/post-listing/:id`,
      Component: 'PostListingPage',
    },
    upgrade_listing: {
      path: `${path}/post-listing/:id/upgrade`,
      Component: 'UpgradeListingPage',
    },
    listings: {
      path: `${path}/listings`,
      Component: 'ListingsPage',
    },
    auto_utilization: {
      path: `${path}/auto-utilization/*`,
      Component: 'AutoUtilizationPage',
      exact: false,
      isAgencyPage: true,
    },
    prop_shop: {
      path: `${path}/prop-shop`,
      Component: 'PropShopPage',
    },
    quota_credits: {
      path: `${path}/quota-and-credits`,
      Component: 'QuotaCreditsPage',
      isPremiumUserPage: true,
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
    inbox: {
      path: `${path}/inbox/*`,
      Component: 'InboxPage',
      exact: false,
      subRoutes: getInboxSubRoutes(path, userCount),
    },
    reports_summary: {
      path: `${path}/reports/summary`,
      Component: 'ReportsSummaryPage',
      isPremiumUserPage: true,
    },
    listing_reports: {
      path: `${path}/reports/listing-reports`,
      Component: 'ListingReportsPage',
      isPremiumUserPage: true,
    },
    leads_reports: {
      path: `${path}/reports/leads-reports`,
      Component: 'LeadsReports',
      isPremiumUserPage: true,
    },
    my_orders: {
      path: `${path}/my-orders`,
      Component: 'MyOrdersPage',
    },
    settings: {
      path: `${path}/user-settings/*`,
      route: `${path}/user-settings`,
      Component: 'UserSettingsPage',
      exact: false,
      subRoutes: getUserSettingsRoutes(path, user),
    },
    others: [
      {
        path: `${path}/checkout`,
        Component: 'CheckoutPage',
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
      if (!isAgency && e.isAgencyPage) {
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
    signin: {
      path: `${path}/signin`,
      Component: 'SignInPage',
    },
    signup: {
      path: `${path}/signup`,
      Component: 'SignUpPage',
    },
    forgot_password: {
      path: `${path}/forgot-password`,
      Component: 'ForgotPasswordPage',
    },
  };
  if (asArray) {
    const list = [
      ...Object.keys(routes)
        .filter((e) => e !== 'others')
        .map((e) => routes[e]),
    ];
    return list;
  }
  return routes;
};

const publicRoutes = () => [
  { path: '/content/process-payment', Component: 'PaymentProcess' },
  { path: '/maintenance', Component: 'Maintenance' },
];

const redirectToAppPath = () => {
  const path = window.location.pathname;
  const pathsToRedirect = ['/profolio', '/user-settings/profile', '/agency-settings'];
  const hasPathToRedirect = pathsToRedirect.find((e) => path.includes(e));

  if (hasPathToRedirect) {
    if (hasPathToRedirect === '/user-settings/profile' && path.includes('/profile')) {
      return '/user-settings/user-profile';
    } else if (hasPathToRedirect === '/agency-settings') {
      return '/user-settings/agency-profile';
    } else {
      return app().dashboard.path;
    }
  } else {
    return;
  }
};

export default { app, auth, publicRoutes, redirectToAppPath };
