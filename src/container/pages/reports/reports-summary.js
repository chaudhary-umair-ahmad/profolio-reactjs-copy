import tenantConstants from '@constants';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReportsLeadsTrafficSection from '../../../components/widgets/ReportsLeadsTrafficSection';
import { usePageTitle } from '../../../hooks';
import { pageViewReportSummaryEvent } from '../../../services/analyticsService';
import { Main } from '../../styled';
import ReportsListingsSection from '../../../components/widgets/ReportsListingsSection';
import PlatfromSwitch from '../../../components/platform-switch/platform-switch';

const ReportsSummary = () => {
  const { t } = useTranslation();
  usePageTitle(t('Reports Summary - Profolio'));
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser.user);
  const { isMultiPlatform } = user;

  useEffect(() => {
    pageViewReportSummaryEvent(user);
  }, [user]);

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
              section={'reports_summary'}
            />
          </div>
        )}
        <ReportsListingsSection rootClassName="mb-16" user={user} section={'reports_summary'} />
        <ReportsLeadsTrafficSection
          chartTitle={t('Breakdown By Date')}
          isDashboard={false}
          user={user}
          section={'reports_summary'}
        />
      </Main>
    </>
  );
};

export default ReportsSummary;

ReportsSummary.propTypes = {
  isDashboard: PropTypes.bool,
};
