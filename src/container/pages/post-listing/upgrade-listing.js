import { t } from 'i18next';
import React from 'react';
import { useGetParams, usePageTitle } from '../../../hooks';
import TenantComponents from '@components';

const UpgradeListingPage = TenantComponents.UpgradeListingPage;

function UpgradeListing({ isMobile }) {
  usePageTitle(t('Upgrade Listing - Profolio'));
  const { id } = useGetParams();
  return <UpgradeListingPage id={id} isMobile={isMobile} />;
}

export default UpgradeListing;
