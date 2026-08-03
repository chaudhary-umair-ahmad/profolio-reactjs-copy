import tenantTheme from '@theme';
import { Row, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Group, TextWithIcon } from '../../../../components/common';
import Statistic from '../../../../components/common/statistic';
import { ListingContainer } from '../../../../components/listing-container/ListingContainer';
import ReportsListingsSection from '../../../../components/widgets/ReportsListingsSection';
import ListingPerformance from '../../../../container/pages/reports/listing-performance';
import { getTimeDateString } from '../../../../utility/date';

function ListingsSummary({ showTable = true, widgetData, tableData, fetchTableData, fetchWidgetData }) {
  const { t } = useTranslation();
  const [activeTabKey, setActiveTabKey] = useState('by-date');
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);

  const [page, setPage] = useState(1);
  const tabList = useMemo(
    () => [
      { key: 'by-date', tab: 'Listing By Date' },
      { key: 'by-performance', tab: 'Listing Performance' },
    ],
    [],
  );

  // useEffect(() => {
  //   showTable &&
  //     activeTabKey === 'by-performance' &&
  //     user.id &&
  //     dispatch(setListingPerformanceTableData(user.id, { page }, listingPerformance));
  // }, [page, activeTabKey, showTable]);

  // const onRetry = () => {
  //   activeTabKey === 'by-performance' &&
  //     user.id &&
  //     dispatch(setListingPerformanceTableData(user.id, { page }, listingPerformance));
  // };

  const getContent = () => ({
    'by-date': isMobile ? (
      <Group gap="6px">
        {tableData?.list?.map((item) => {
          return (
            <Card>
              <Group template="repeat(4, 1fr)" gap="4px">
                <Statistic title={t('Posted Listing')} value={item?.active_listings?.value} />
                <Statistic title={t('Basic')} value={item?.basic?.value} />
                <Statistic title={t('Hot')} value={item?.hot?.value} />
                <Statistic title={t('Signature')} value={item?.signature?.value} />
              </Group>
              <Row align="middle" justify="space-between">
                <Space.Compact style={{ gap: 16 }}>
                  <Statistic title={t('For Rent')} value={item?.rent?.value} />
                  <Statistic title={t('For Sale')} value={item?.sale?.value} />
                </Space.Compact>
                <TextWithIcon
                  icon="RxCounterClockwiseClock"
                  iconProps={{ size: '1em', color: tenantTheme.gray600 }}
                  title={item?.date?.value ? getTimeDateString(item?.date?.value) : '-'}
                />
              </Row>
            </Card>
          );
        })}
      </Group>
    ) : (
      <ListingContainer
        listingsData={tableData}
        listingApi={(params) => fetchTableData(params)}
        skeletonLoading={!tableData.list?.length && tableData.loading}
        loading={tableData.loading}
        error={tableData.error}
        onRetry={fetchTableData}
        renderFiltersAsTopRight
        isMain={false}
        noUrlPush
      />
    ),
    'by-performance': <ListingPerformance isMain={false} />,
  });

  return (
    <>
      <ReportsListingsSection rootClassName="mb-16" data={widgetData} fetchWidgetData={fetchWidgetData} />
      {showTable && (
        <Card
          bodyStyle={{ backgroundColor: isMobile && tenantTheme['layout-body-background'], padding: 0 }}
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={(key) => setActiveTabKey(key)}
        >
          {getContent(isMobile)[activeTabKey]}
        </Card>
      )}
    </>
  );
}
export default ListingsSummary;
