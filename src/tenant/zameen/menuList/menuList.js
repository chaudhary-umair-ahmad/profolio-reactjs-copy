import { t } from 'i18next';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';
import { useSelector } from 'react-redux';

const menus = (user) => {
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
    },
    {
      key: 'property-management',
      icon: 'MyListingIcon',
      title: t('Property Management'),
      list: [
        { title: t('All Listings'), path: '/listings', key: 'all-listings', hideTopBar: true },
        {
          title: t('Auto Utilization'),
          path: '/auto-utilization/auto_apply',
          basePath: '/auto-utilization',
          key: 'auto-utilization',
          isAgencyPage: true,
        },
      ],
    },
    {
      key: 'quota-credits',
      icon: 'SideMenuQuota',
      title: t('Quota and Credits'),
      path: '/quota-and-credits',
      isPremiumUserPage: true,
    },
    {
      key: 'inbox',
      icon: 'SideMenuInbox',
      title: t('Inbox'),
      path: '/inbox/received',
      basePath: '/inbox',
    },
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
          title: t('Listing Reports'),
          path: '/reports/listing-reports',
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
    {
      key: 'prop-shop',
      icon: 'SideMenuPropShop',
      title: t('Prop Shop'),
      list: [
        { title: t('Buy Products'), path: '/prop-shop', key: 'buy-products' },
        { title: t('Order History'), path: '/my-orders', key: 'order-history' },
      ],
    },
  ];
};

export const menuList = (permissions, isAgency, isPremiumUser) => {
  const { user } = useSelector((state) => state.app.loginUser);
  const newMenuList = menus(user);
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
