import tenantConstants from '@constants';
import TenantComponents from '@components';
import PlatfromSwitch from '../../../components/platform-switch/platform-switch';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import { usePageTitle } from '../../../hooks';
import { Main } from '../../styled';
import '../../../apis/reports'; //Preloading reports Apis. TODO Rtkq
import { pageViewListingReportEvent } from '../../../services/analyticsService';
import ReportsListingsSection from '../../../components/widgets/ReportsListingsSection';

function ListingReports({ user }) {
  usePageTitle(t('Listing Report - Profolio'));
  const loggedInUser = useSelector((state) => state.app.loginUser.user);

  const platforms = useMemo(
    () => (user ? user?.platforms : loggedInUser?.platforms),
    [user?.platforms?.length, loggedInUser?.platforms?.length],
  );
  const isMultiPlatform = useMemo(() => platforms?.length > 1, [platforms?.length]);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  useEffect(() => {
    pageViewListingReportEvent(loggedInUser);
  }, []);

  return (
    <Main>
      {isMultiPlatform && !tenantConstants.MULTIPLATFROM_VIEW && (
        <div className="stickyHeadingBorad mb-0" style={{ textAlign: 'end', '--top-space': '70px', '--padding': 0 }}>
          <PlatfromSwitch
            size={isMobile && 'small'}
            section={'listing_reports'}
            platformSwitchStyle={{
              marginBlock: '8px',
              width: isMobile && '100%',
              minWidth: !isMobile && '300px',
            }}
          />
        </div>
      )}
      <ReportsListingsSection rootClassName="mb-16" user={user ? user : loggedInUser} section={'listing_reports'} />
      <TenantComponents.ListingBreakDownByDateTable user={user ? user : loggedInUser} />
    </Main>
  );
}
export default ListingReports;
