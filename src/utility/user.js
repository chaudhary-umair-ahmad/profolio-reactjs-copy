import { jwtDecode } from 'jwt-decode';
import tenantConstants from '@constants';

export const mapUserFromIdToken = (token) => {
  if (token) {
    const kcUser = jwtDecode(token);
    return {
      is_package_user: !!kcUser.realm_roles.find((e) => e === 'profolio-package-user'),
      is_host_user: !!kcUser.realm_roles.find((e) => e === 'profolio-host-user'),
      isCurrencyUser: tenantConstants.IS_CURRENCY_USER,
    };
  }
  return;
};


export const setBadgeLocalStorage = (user) => {
  if (!user?.id) return;

  const badges = [
    {
      hasBadge: user?.is_quality_lister,
      key: `qualityListerShown_${user.id}`,
    },
    {
      hasBadge: user?.is_responsive_broker,
      key: `responsiveBrokerShown_${user.id}`,
    },
    {
      hasBadge: user?.is_super_lister,
      key: `superListerShown_${user.id}`,
    },
  ];

  badges.forEach((badge) => {
    if (!badge.hasBadge) {
      localStorage.setItem(badge.key, JSON.stringify(false));
    }
  });
};
