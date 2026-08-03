import tenantData from '@data';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButtons } from '../../../components/common';
import { ListingContainer } from '../../../components/listing-container/ListingContainer';
import ReportsLeadsTrafficSection from '../../../components/widgets/ReportsLeadsTrafficSection';
import { useFetchOnQueryUpdate } from '../../../hooks';
import {
  setTrafficPlatformFilter,
  setTrafficTableData,
  setTrafficWidgetData,
  setTrafficWidgetDateRange,
} from '../../../redux/trafficSummary/actionCreator';
import { Main } from '../../styled';

function TrafficReports() {
  const trafficSummary = useSelector((state) => state.TrafficSummary);
  const { widgetData, tableData } = trafficSummary;
  const platforms = tenantData.platformList.map((platform) => platform.slug);
  const [tab, setTab] = useState(tenantData.platformList[0].key);
  const user = useSelector((state) => state.app.loginUser.user);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const { fetchData: fetchTableData } = useFetchOnQueryUpdate(
    (params) => {
      dispatch(setTrafficTableData(params, tab));
    },
    [tab],
  );

  const onDateRangeChange = (dateRange) => {
    dispatch(setTrafficWidgetDateRange({ date_between: dateRange }));
  };

  const handleFilterChange = (filterObj, platformKey, updateFilterOnly = false) => {
    if (platformKey) {
      !updateFilterOnly && fetchWidgetData({ ...widgetData[platformKey]?.filterObj, ...filterObj }, platformKey);
      dispatch(setTrafficPlatformFilter(filterObj, platformKey));
    } else {
      platforms.forEach((platform) => {
        !updateFilterOnly && fetchWidgetData({ ...widgetData[platform]?.filterObj, ...filterObj }, platform);
        dispatch(setTrafficPlatformFilter(filterObj, platformKey));
      });
    }
  };

  const fetchWidgetData = (params, platformKey) => {
    dispatch(setTrafficWidgetData(params, platformKey, !widgetData[platformKey]));
  };
  useEffect(() => {
    platforms.forEach((platform) => {
      !!user.products.platforms[platform] && fetchWidgetData(widgetData[platform]?.filterObj, platform);
    });
  }, []);

  const renderPlatformTabs = useCallback(() => {
    return (
      !tableData.error && (
        <RadioButtons
          value={tab}
          handleChange={(e) => {
            setTab(e.target.value);
          }}
          buttonList={[
            ...tenantData.platformList
              .filter((e) => !!user.products.platforms[e.slug])
              .map((item) => ({ ...item, disabled: false })),
          ]}
          loading={tableData?.loading}
          disabled={tableData?.loading}
        />
      )
    );
  }, [tableData, tab]);

  useEffect(() => {
    let platformLoadingArray = tenantData.platformList.map((platform) => {
      return widgetData[platform.key]?.loading;
    });
    const loadingState = platformLoadingArray.reduce((initial, next) => {
      return initial || next;
    });
    setLoading(loadingState);
  }, [widgetData]);

  const { t } = useTranslation();
  return (
    <>
      <Main>
        <ReportsLeadsTrafficSection
          chartTitle={t('Breakdown By Date')}
          data={widgetData}
          dateRange={widgetData.date_between}
          setDateRange={(dateFilter) => {
            onDateRangeChange(dateFilter);
          }}
          fetchWidgetData={fetchWidgetData}
          onFilterChange={handleFilterChange}
          loading={loading}
        />
        <ListingContainer
          title={t('Reach On Listings')}
          listingsData={tableData}
          listingApi={(params) => fetchTableData(params)}
          renderTableTopRight={renderPlatformTabs}
          loading={tableData.loading}
          error={tableData.error}
          onRetry={fetchTableData}
          pageSize={20}
          showPagination
          renderFiltersAsTopRight={false}
          isMain={false}
        />
      </Main>
    </>
  );
}

export default TrafficReports;
