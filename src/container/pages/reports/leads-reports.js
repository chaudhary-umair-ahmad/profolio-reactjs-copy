import tenantConstants from '@constants';
import TenantComponents from '@components';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Group } from '../../../components/common';
import ReportsLeadsTrafficSection from '../../../components/widgets/ReportsLeadsTrafficSection';
import { usePageTitle } from '../../../hooks';
import { pageViewLeadsReportEvent } from '../../../services/analyticsService';
import { Main } from '../../styled';
import PlatfromSwitch from '../../../components/platform-switch/platform-switch';

function LeadsReports({ platform = 'ksa', user }) {
  const { t } = useTranslation();
  usePageTitle(t('Leads & Reach Reports - Profolio'));
  const loggedInUser = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const { isMultiPlatform } = loggedInUser;
  useEffect(() => {
    pageViewLeadsReportEvent(loggedInUser);
  }, []);

  return (
    <>
      <Main>
        {isMultiPlatform && !tenantConstants.MULTIPLATFROM_VIEW && (
          <div className="stickyHeadingBorad mb-0" style={{ textAlign: 'end', '--top-space': '70px', '--padding': 0 }}>
            <PlatfromSwitch
              platformSwitchStyle={{
                marginBlock: '8px',
                width: isMobile && '100%',
                minWidth: !isMobile && '300px',
              }}
              size={isMobile && 'small'}
              section={'leads_reports'}
            />
          </div>
        )}
        <Group gap="24px">
          <ReportsLeadsTrafficSection
            chartTitle={t('Breakdown By Date')}
            isDashboard={false}
            user={user ? user : loggedInUser}
            section={'leads_reports'}
          />
          <TenantComponents.ListingStatsByDateTable user={user ? user : loggedInUser} section={'leads_reports'} />
        </Group>
      </Main>
    </>
  );
}

export default LeadsReports;
