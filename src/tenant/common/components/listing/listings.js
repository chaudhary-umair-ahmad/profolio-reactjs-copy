import tenantConstants from '@constants';
import tenantFilters from '@filters';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useGetListingsStatsQuery } from '../../../../apis/listings.js';
import { TabsStyled } from '../../../../components/common/radio-button/styled.js';
import PostListingButton from '../../../../components/post-listing-button/post-listing-button.js';
import { EmptyListing } from '../../../../components/svg.js';
import { Main } from '../../../../container/styled';
import { useGetLocation, usePageTitle } from '../../../../hooks';
import { mapQueryStringToFilterObject } from '../../../../utility/urlQuery';
import { mapQueryParams } from '../../../../utility/utility.js';
import listingStates from './listings.json';
import { MyListingCardContainer } from './myListingCardContainer.js';
import { MyListingContainer } from './myListingContainer.js';
import { Group, Card } from '../../../../components/common';
import { getBaseURL, TENANT_KEY } from '../../../../utility/env';
import { ListingBanner } from '../../../../components/styled.js';
import tenantRoutes from '@routes';
import { CreditsQuota } from '../../../../components/widgets/index.js';
import { useGetMyListingsQuery } from '../../../../apis/listings.js';
import { pageViewMyListingEvent } from '../../../../services/analyticsService/index.js';
const Listings = () => {
  const { t } = useTranslation();

  usePageTitle(
    `${t(`Your Property Listings Dashboard | `)} ${t(tenantConstants.TITLE)}`,
    t(
      "Your one-stop listings page for the listings you have posted on Bayut! Whether you're selling your villa or renting out an apartment, easily view, manage, upgrade and analyze all your property listings in one place.",
    ),
  );
  const { user } = useSelector((state) => state.app.loginUser);
  const { isMobile, isMemberArea, isMultiPlatform, locale } = useSelector((state) => state.app.AppConfig);
  const users = useSelector((state) => state.app.userGroup.list);
  const location = useGetLocation();
  const { queryObj } = mapQueryStringToFilterObject(location.search);
  const [searchParams, setSearchParams] = useSearchParams();

  const filtersList = useMemo(() => tenantFilters.getMyListingsFilters(user, users, locale), [user, users, locale]);
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
      table: tenantUtils.listingTableColumnMapper(user),
    }),
    [tenantUtils, user],
  );

  const listingIds = tenantUtils.getListingIdsForOvationStats(user, tableData?.list);
  const userIds = tenantUtils.getUserIdsForOvationStats(user, tableData?.list);

  const { isLoading: statsLoading } = useGetListingsStatsQuery(
    {
      listingIds,
      userId: user?.id,
      userIds,
    },
    {
      skip: !tableData?.list?.length || listingsLoading || listingFetching,
      refetchOnMountOrArgChange: true,
    },
  );

  const [tab, setTab] = useState(queryObj?.['f[nested.platform_listings.status.slug]'] || tableData?.statuses?.[0]?.key?.toString());

  useEffect(() => {
    const raw = queryObj?.['f[nested.platform_listings.status.slug]'];
    const tabKeyFromFilter = tableData?.statuses_and_dispositions?.find((s) => s.slug === raw || s.id == raw)?.id;
    const newTab =
      (tabKeyFromFilter != null ? String(tabKeyFromFilter) : raw) || tableData?.statuses?.[0]?.key?.toString();
    setTab(newTab);
  }, [tableData, location.search, queryObj]);

  useEffect(() => {
    pageViewMyListingEvent(user);
  }, [location.search]);
  const onChangeTab = (e) => {
    const { tab, ...restQuery } = queryObj;
    const slug = tableData?.statuses_and_dispositions?.find((s) => s.id == e)?.slug;
    const obj = { ...restQuery, [tableData?.tabFilterKey]: slug ?? e };
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

  const renderStatesTabs = useCallback(() => {
    return (
      tableData?.statuses && (
        <TabsStyled
          className="mb-0"
          defaultActiveKey={tab || tableData?.statuses?.[0]?.key?.toString()}
          onChange={(e) => {
            onChangeTab(e);
          }}
          items={tableData?.statuses?.map((e) => ({
            key: e?.key,
            label: e?.tab,
          }))}
        />
      )
    );
  }, [tableData?.statuses, tab]);
  const renderQuotaCreditsMobile = (platformKey, platform) => {
    return (
      <CreditsQuota
        platform={platform}
        setUserId={() => {}}
        key={platformKey}
        usersPermission={false}
        loggedInUser={user}
        userId={user.id}
        widgetGap={!isMobile && '30px'}
        rowHeight={isMobile ? '50px' : '34px'}
        user={user}
      />
    );
  };
  const renderBanner = () =>
    isMemberArea && (
      <Card bodyStyle={{ padding: isMobile && 0 }}>
        <Group template={!isMobile ? 'repeat(2, 1fr)' : ''} gap="12px" style={{ alignItems: 'center' }}>
          <ListingBanner
            bannerPath={`${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/banner-faces-2.jpg`}
            template={'1fr'}
            breakTag={false}
            className={'listing-banner align-items-start'}
            titleFontWeight="700"
            listColor="#fff"
            titleColor="#fff"
            listItems={false}
            title={t('Get a business package and enjoy exclusive benefits')}
            subtitle={t('Access Profolio, manage agency staff, view lead reports and much more')}
            titleAsH1
            href={tenantRoutes.app('', false, user).prop_shop?.path}
          />
          {user?.platforms.map((platform) => {
            return <div key={platform?.key}>{renderQuotaCreditsMobile(platform?.slug, platform)}</div>;
          })}
        </Group>
      </Card>
    );
  return (
    <>
      {isMobile ? (
        <Main style={{ paddingBlock: '0 8px' }}>
          <MyListingCardContainer
            listingsData={{ ...tableData, ...tableColumns }}
            renderTableTopRight={renderStatesTabs}
            pagination={tableData?.pagination}
            renderFiltersAsTopRight
            fetchData={refetch}
            skeletonLoading={listingsLoading}
            showPagination
            loading={listingsLoading || listingFetching}
            error={error}
            emptyState={emptyState}
            filtersList={filtersList}
            renderBanner={renderBanner}
          />
        </Main>
      ) : (
        <>
          <MyListingContainer
            filtersList={filtersList}
            listingsData={{ ...tableData, ...tableColumns }}
            activeTab={Number(tab)}
            tableTabs={tableData?.statuses}
            onChangeTab={onChangeTab}
            loading={listingFetching || statsLoading}
            error={error}
            onRetry={refetch}
            title={t('My Listings')}
            emptyState={emptyState}
            renderBanner={renderBanner}
          />
        </>
      )}
    </>
  );
};

export default Listings;
