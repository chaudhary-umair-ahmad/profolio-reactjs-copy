import tenantData from '@data';
import React, { useEffect, useState } from 'react';
import { ListingContainer } from '../../../../components/listing-container/ListingContainer';
import ReportsLeadsTrafficSection from '../../../../components/widgets/ReportsLeadsTrafficSection';
import { Main } from '../../../../container/styled';

function LeadsSummary({
  showTable = true,
  chartTitle,
  tableTitle,
  style,
  widgetData,
  tableData,
  onDateRangeChange,
  onFilterChange,
  fetchTableData,
  fetchWidgetData,
  renderTableTopRight,
}) {
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
      <Main style={{ ...style }}>
        <ReportsLeadsTrafficSection
          chartTitle={chartTitle}
          data={widgetData}
          dateRange={widgetData.date_between}
          setDateRange={(dateRange) => {
            onDateRangeChange(dateRange);
          }}
          onFilterChange={onFilterChange}
          fetchWidgetData={fetchWidgetData}
          loading={loading}
        />
        {showTable && (
          <ListingContainer
            title={tableTitle}
            listingsData={tableData}
            loading={tableData.loading}
            error={tableData.error}
            onRetry={fetchTableData}
            listingApi={(params) => fetchTableData(params)}
            renderTableTopRight={renderTableTopRight}
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

export default LeadsSummary;
