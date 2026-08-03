import tenantFilters from '@filters';
import tenantConstants from '@constants';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ListingContainerMobile } from '../../../../components/listing-container-mobile/ListingContainerMobile';
import { ListingContainer } from '../../../../components/listing-container/ListingContainer';
import parentApi from '../../../../store/parentApi';
import { mapQueryStringToFilterObject } from '../../../../utility/urlQuery';
import { useGetLocation } from '../../../../hooks';

const ListingStatsByDateTable = ({ user, section }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const loggedInUser = useSelector((state) => state.app.loginUser.user);
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.[section]);
  const platforms = useMemo(
    () => (user ? user?.platforms : loggedInUser?.platforms),
    [user?.platforms?.length, loggedInUser?.platforms?.length],
  );
  const [tab, setTab] = useState(platforms?.[0]?.key);
  const location = useGetLocation();
  const { queryObj } = mapQueryStringToFilterObject(location.search);
  const [pageNumber, setPageNumber] = useState(1);
  const hookName = `useGetListingStatsTableDataByDateFor${tab}Query`;
  const useHook = parentApi[hookName];

  useEffect(() => {
    if (!!platforms?.length && !tenantConstants.MULTIPLATFROM_VIEW) {
      setTab(selectedPlatform?.slug || platforms?.[0]?.key);
    }
  }, [selectedPlatform]);

  const {
    data: tableData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useHook
    ? useHook(
        {
          user: user ? user : loggedInUser,
          page: pageNumber,
          date_between: queryObj?.date_between && decodeURIComponent(queryObj?.date_between),
          purpose: queryObj?.purpose && decodeURIComponent(queryObj?.purpose),
          userId: queryObj?.user_id && queryObj?.user_id,
        },
        { skip: !tab, refetchOnMountOrArgChange: true },
      )
    : {};

  const filtersList = useMemo(() => tenantFilters.getLeadsReportsFilters(user?.agency?.users, user), [user]);

  return isMobile ? (
    <ListingContainerMobile
      title={t('Traffic and Leads by date')}
      listingsData={tableData}
      loading={isLoading || isFetching}
      listingApi={refetch}
      tabList={
        tenantConstants.MULTIPLATFROM_VIEW
          ? platforms?.length > 1
            ? platforms?.map(({ key, label }) => ({ key, tab: label }))
            : []
          : []
      }
      activeTab={tab}
      onChangeTab={(e) => {
        setTab(e?.target?.value);
        setPageNumber(1);
      }}
      showPagination
      pageSize={tableData?.pagination?.pageCount}
      renderFiltersAsTopRight={false}
      setPageNumber={setPageNumber}
      filtersList={filtersList}
    />
  ) : (
    <div>
      <ListingContainer
        title={t('Traffic and Leads by date')}
        filtersList={filtersList}
        listingsData={tableData}
        loading={isLoading || isFetching}
        error={error}
        onRetry={refetch}
        listingApi={(params) => setPageNumber(params?.page)}
        renderTableTopRight={
          tenantConstants.MULTIPLATFROM_VIEW
            ? platforms?.length > 1
              ? platforms?.map(({ key, label }) => ({ key, tab: label }))
              : []
            : null
        }
        activeTab={tab}
        onChangeTab={(key) => {
          setTab(key);
        }}
        pageSize={tableData?.pagination?.pageCount}
        showPagination
        renderFiltersAsTopRight={false}
        isMain={false}
        noUrlPush={true}
        intialFilterCount={filtersList?.length}
      />
    </div>
  );
};

export default ListingStatsByDateTable;
