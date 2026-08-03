import tenantConstants from '@constants';
import tenantFilters from '@filters';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Tabs } from '../../../../components/common';
import { TabsStyled } from '../../../../components/common/radio-button/styled';
import { ListingCardContainer } from '../../../../components/listing-card-container/ListingCardContainer';
import { ListingContainer } from '../../../../components/listing-container/ListingContainer';
import PostListingButton from '../../../../components/post-listing-button/post-listing-button';
import { EmptyListing } from '../../../../components/svg';
import { Main } from '../../../../container/styled';
import { useGetLocation, useRouteNavigate } from '../../../../hooks';
import {
  useGetListingsStatsQuery,
  useGetMyListingsQuery,
  useLazyGetListingsStatsQuery,
} from '../../../../apis/listings';
import { mapQueryStringToFilterObject } from '../../../../utility/urlQuery';
import { mapQueryParams } from '../../../../utility/utility';
import ApplyBulkRefresh from './bulk-refresh';
import listingStates from './listings.json';

const Listings = () => {
  const { user } = useSelector((state) => state.app.loginUser);
  const users = useSelector((state) => state.app.userGroup.list);
  const dispatch = useDispatch();
  const [selectedListings, setSelectedListings] = useState([]);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const location = useGetLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { queryObj } = mapQueryStringToFilterObject(location.search);
  const filtersList = useMemo(() => tenantFilters.getMyListingsFilters(user, users), [user, users]);

  const mappedParams = useMemo(() => mapQueryParams(queryObj, filtersList), [queryObj, filtersList]);

  const {
    data: tableData,
    isLoading: listingsLoading,
    isFetching: listingFetching,
    refetch,
    error,
  } = useGetMyListingsQuery({ mappedParams, userId: user?.id }, { refetchOnMountOrArgChange: true });

  const tableColumns = useMemo(
    () => ({
      table: tenantUtils.listingTableColumnMapper(
        tableData?.statuses_and_dispositions?.find((e) => e.id == queryObj?.['q[status_id_eq]'])?.slug,
        user,
      ),
    }),
    [tenantUtils, tableData?.statuses_and_dispositions, queryObj, user],
  );

  const listingIds = tenantUtils.getListingIdsForOvationStats(user, tableData?.list);
  const userIds = tenantUtils.getUserIdsForOvationStats(user, tableData?.list);

  const { isLoading: statsLoading } = useGetListingsStatsQuery(
    {
      listingIds: listingIds,
      userId: user?.id,
      userIds: userIds,
    },
    {
      skip: !tableData?.list?.length || listingsLoading || listingFetching,
      refetchOnMountOrArgChange: true,
    },
  );

  const updateSelectedListings = ({ listings, selected, multiple, clearSelectedItems = false }) => {
    let updatedListings = [...selectedListings];
    if (!clearSelectedItems) {
      if (selected) {
        if (multiple) {
          listings?.forEach((e) => {
            updatedListings = [...updatedListings, e];
          });
        } else {
          updatedListings = [...updatedListings, listings];
        }
      } else {
        if (multiple) {
          listings?.forEach((e) => {
            const index = updatedListings?.findIndex((it) => it?.id === e?.id);
            if (index != -1) {
              updatedListings?.splice(index, 1);
            }
          });
        } else {
          const listingIndex = selectedListings?.findIndex((e) => e?.id === listings?.id);
          if (listingIndex != -1) {
            updatedListings.splice(listingIndex, 1);
          }
        }
      }
    } else {
      updatedListings = [];
    }
    setSelectedListings(updatedListings);
  };

  const [tab, setTab] = useState('');
  const navigate = useRouteNavigate();

  useEffect(() => {
    const { queryObj } = mapQueryStringToFilterObject(location.search);
    tableData?.tabFilterKey &&
      setTab(queryObj?.['q[firmstate]'] || queryObj?.[tableData?.tabFilterKey] || tableData?.statuses?.[0]?.key);
  }, [tableData?.tabFilterKey, tableData?.statuses, location.search]);

  const renderStatesTabs = useCallback(() => {
    return (
      tableData?.statuses && (
        <TabsStyled
          className="mb-0"
          defaultActiveKey={tab || tableData?.statuses?.[0]?.key?.toString()}
          onChange={onChangeTab}
          items={tableData?.statuses?.map((e) => ({
            key: e?.key,
            label: e?.tab,
          }))}
        />
      )
    );
  }, [tableData?.statuses, tab]);

  const getRowSelection = () => {
    return {
      type: 'checkbox',
      preserveSelectedRowKeys: true,
      selectedRowKeys: selectedListings ? selectedListings?.map((e) => e?.id) : [],
      onSelect: (record, selected) => {
        if (selected) {
          record.selected = true;
          record.listingOwner = tableData?.user;
        }
        updateSelectedListings({ listings: { ...record, id: record?.key }, selected, multiple: false });
      },
      onSelectAll: (selected, selectedRows, currentSelectedRows) => {
        let listings = [];
        currentSelectedRows?.forEach((e) => {
          e.selected = selected;
          e.listingOwner = tableData?.list?.find((data) => data?.id == e?.key)?.user;
          listings.push({ ...e, id: e?.key });
        });
        updateSelectedListings({ listings: listings, selected, multiple: true });
      },
    };
  };

  const onChangeTab = (e) => {
    const obj = { ...queryObj, [tableData?.tabFilterKey]: e };
    const decodedParams = Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
    setSearchParams(decodedParams);
  };
  const emptyState = useMemo(
    () => ({
      title: listingStates.listingStates[tab]?.title,
      subtitle: listingStates.listingStates[tab]?.subtitle,
      illustration: <EmptyListing color={tenantTheme['primary-light-2']} />,
      button: <PostListingButton />,
    }),
    [tab],
  );

  return (
    <>
      {isMobile ? (
        <Main style={{ paddingBlock: '0 8px' }}>
          <ListingCardContainer
            filtersList={filtersList}
            listingsData={{ ...tableData, ...tableColumns }}
            renderTableTopRight={renderStatesTabs}
            pagination={tableData?.pagination}
            renderFiltersAsTopRight
            fetchData={refetch}
            skeletonLoading={listingsLoading && listingFetching}
            showPagination
            loading={listingFetching}
            error={error}
            scrollToShowMore
            selectedListings={[]}
            setSelectedListings={(data) => dispatch(updateSelectedListings(data))}
            emptyState={emptyState}
          />
        </Main>
      ) : (
        <>
          <ListingContainer
            filtersList={filtersList}
            listingsData={{ ...tableData, ...tableColumns }}
            listingApi={refetch}
            activeTab={tab}
            renderTableTopRight={tableData?.statuses}
            onChangeTab={onChangeTab}
            loading={listingFetching}
            error={error}
            onRetry={refetch}
            rowSelection={tab === 'Active' && tableData?.list?.length ? getRowSelection() : undefined}
            emptyState={emptyState}
            disableTabsOnLoading
          />
        </>
      )}
      <ApplyBulkRefresh
        fetchData={refetch}
        selectedListings={selectedListings}
        updateSelectedListings={updateSelectedListings}
      />
    </>
  );
};

export default Listings;
