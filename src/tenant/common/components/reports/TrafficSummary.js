import tenantData from '@data';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListingContainer } from '../../../../components/listing-container/ListingContainer';
import ReportsLeadsTrafficSection from '../../../../components/widgets/ReportsLeadsTrafficSection';
import { Main } from '../../../../container/styled';

function TrafficSummary({
  showTable = true,
  chartTitle,
  tableTitle,
  widgetData,
  tableData,
  onDateRangeChange,
  onFilterChange,
  fetchTableData,
  fetchWidgetData,
  renderTableTopRight,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let platformLoadingArray = tenantData.platformList.map((platform) => {
      return widgetData[platform.key]?.loading;
    });
    const loadingState = platformLoadingArray.reduce((initial, next) => {
      return initial || next;
    });
    setLoading(loadingState);
  }, [widgetData]);

  return (
    <>
      <Main>
        <ReportsLeadsTrafficSection
          chartTitle={t(chartTitle)}
          data={widgetData}
          dateRange={widgetData.date_between}
          setDateRange={(dateFilter) => {
            onDateRangeChange(dateFilter);
          }}
          fetchWidgetData={fetchWidgetData}
          onFilterChange={onFilterChange}
          loading={loading}
        />
        {showTable && (
          <ListingContainer
            title={t(tableTitle)}
            listingsData={tableData}
            listingApi={(params) => fetchTableData(params)}
            renderTableTopRight={renderTableTopRight}
            loading={tableData.loading}
            error={tableData.error}
            onRetry={fetchTableData}
            pageSize={20}
            showPagination
            renderFiltersAsTopRight={false}
            isMain={false}
          />
        )}
      </Main>
    </>
  );
}

export default TrafficSummary;
