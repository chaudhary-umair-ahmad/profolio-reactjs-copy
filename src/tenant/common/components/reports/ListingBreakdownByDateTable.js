import tenantTheme from '@theme';
import tenantConstants from '@constants';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card } from '../../../../components/common';
import ListingByDateTable from './ListingByDateTable';
import ListingPerformanceTable from './ListingPerformanceTable';

const ListingBreakDownByDateTable = ({ user }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [activeTabKey, setActiveTabKey] = useState('by-performance');
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.listing_reports);

  const tabList = useMemo(
    () => [
      { key: 'by-performance', tab: t('Listing Performance') },
      { key: 'by-date', tab: t('Listing By Date') },
    ],
    [],
  );

  const onChangeTab = (e) => {
    setActiveTabKey(e);
  };

  const getContent = () => ({
    'by-performance': (
      <ListingPerformanceTable user={user} platform={!tenantConstants.MULTIPLATFROM_VIEW ? selectedPlatform : null} />
    ),
    'by-date': (
      <ListingByDateTable user={user} platform={!tenantConstants.MULTIPLATFROM_VIEW ? selectedPlatform : null} />
    ),
  });

  return (
    <Card
      bodyStyle={{
        backgroundColor: isMobile && tenantTheme['layout-body-background'],
        paddingInline: 0,
        paddingBlockStart: 1,
      }}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={(e) => onChangeTab(e)}
    >
      {getContent()[activeTabKey]}
    </Card>
  );
};

export default ListingBreakDownByDateTable;
