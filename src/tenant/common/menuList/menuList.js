import tenantConstants from '@constants';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';
import {
  addPropertyEvent,
  pageViewPackageScreenEvent,
  pageViewInboxEvent,
  myListingClickEvent,
} from '../../../services/analyticsService';

const menus = (user, t) => {
  return [
    {
      key: 'dashboard',
      icon: 'SideMenuDashboard',
      title: t('Overview'),
      path: '/dashboard',
    },
    {
      key: 'post-listing',
      icon: 'PostListingIcon',
      title: t('Post Listing'),
      path: '/post-listing',
      onClick: () => addPropertyEvent(user, null, true),
    },
    {
      key: 'all-listings',
      icon: 'MyListingIcon',
      title: t('My Listings'),
      path: '/listings',
      onClick: () => {
        myListingClickEvent(user, true);
      },
    },
    ...(user && user.isCurrencyUser
      ? [
          {
            key: 'credits_usage',
            icon: 'SideMenuQuota',
            title: t('Credits Usage'),
            path: '/credits-usage',
          },
        ]
      : []),
    ...(!tenantConstants.HIDE_INBOX
      ? [
          {
            key: 'inbox',
            icon: 'SideMenuInbox',
            title: t('Inbox'),
            path: '/inbox/received',
            basePath: '/inbox',
            onClick: () => pageViewInboxEvent(user),
          },
        ]
      : []),
    ...(user?.is_lms_enabled && tenantConstants.IS_LMS_ENABLED && !tenantConstants.HIDE_REPORTS
      ? [
        {
          key: 'leads',
          icon: 'DashboardLmsIcon',
          title: t('TruLeads'),
          path: '/lms/truleads',
        },
        ]
      : []),
      ...(tenantConstants.AGENT_PERFORMANCE_ENABLED
        ? [
            {
              key: 'agent-performance',
              icon: 'AgentPerformanceIcon',
              title: t('Agent Performance'),
              path: '/agent-performance',
            },
          ]
        : []),
    ...(user && user.isCurrencyUser && !tenantConstants.HIDE_REPORTS
      ? [
          {
            key: 'reports',
            icon: 'SideMenuReports',
            title: t('Reports'),
            isPremiumUserPage: true,
            list: [
              {
                title: t('Summary'),
                path: '/reports/summary',
                key: 'summary',
                isPremiumUserPage: true,
              },
              {
                title: t('Listing Report'),
                path: '/reports/listing-report',
                key: 'listing-reports',
                isPremiumUserPage: true,
              },
              {
                title: t('Leads & Reach Report'),
                path: '/reports/leads-reports',
                key: 'leads-reports',
                isPremiumUserPage: true,
              },
            ],
          },
        ]
      : []),
    {
      key: 'agency-staff',
      icon: 'SideMenuAgency',
      title: t('Agency Staff'),
      path: '/agency-staff',
      permission: PERMISSIONS_TYPE.STAFF,
      isAgencyPage: true,
    },
    {
      key: 'settings',
      icon: 'IoSettingsOutline',
      title: t('Settings'),
      path: '/user-settings/user-profile',
      basePath: '/user-settings',
    },
    ...(user && user.isCurrencyUser
      ? [
          {
            key: 'prop-shop',
            icon: 'SideMenuPropShop',
            path: '/packages',
            title: t('Credits & Packages'),
            onClick: () => pageViewPackageScreenEvent(user),
          },
        ]
      : []),
  ];
};

export const menuList = (permissions, isAgency, isPremiumUser) => {
  const { user } = useSelector((state) => state.app.loginUser);
  const { t } = useTranslation();
  let newMenuList = menus(user, t);
  const sList = [];
  const filterItems = (e, list) => {
    if (!isAgency && e.isAgencyPage) {
    } else if (!isPremiumUser && e.isPremiumUserPage) {
    } else if (permissions && e.permission) {
      permissions[e.permission] && list.push(e);
    } else if (e.list) {
      const subList = [];
      e.list.forEach((e) => filterItems(e, subList));
      e.list = subList;
      list.push(e);
    } else {
      list.push(e);
    }
  };
  newMenuList.forEach((e) => filterItems(e, sList));

  return sList;
};
