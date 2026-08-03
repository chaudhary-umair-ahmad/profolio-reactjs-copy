import tenantConstants from '@constants';
import tenantFilters from '@filters';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Card } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Group, Button, Flex, Tag } from '../../../../components/common/index.js';
import { TabsStyled } from '../../../../components/common/radio-button/styled.js';
import { ListingCardContainer } from '../../../../components/listing-card-container/ListingCardContainer.js';
import { ListingContainer } from '../../../../components/listing-container/ListingContainer';
import PostListingButton from '../../../../components/post-listing-button/post-listing-button.js';
import { ListingBanner } from '../../../../components/styled.js';
import { EmptyListing, IconNoAdLicense } from '../../../../components/svg.js';
import { Main } from '../../../../container/styled';
import { useGetLocation, usePageTitle, useRouteNavigate } from '../../../../hooks';
import {
  getAdLicenseClickEvent,
  pageViewMyListingEvent,
  trackRequestsClickEvent,
} from '../../../../services/analyticsService/index.js';
import { getBaseURL, TENANT_KEY } from '../../../../utility/env';
import { mapQueryStringToFilterObject } from '../../../../utility/urlQuery';
import { mapQueryParams } from '../../../../utility/utility.js';
import listingStates from '../../../common/components/listing/listings.json';
import { listingsFilterClickEvent } from '../../../../services/analyticsService/index.js';

import {
  useGetListingsStatsQuery,
  useGetMyListingsQuery,
  useGetTruCheckStatusesQuery,
  useGetAdLicenseRequestsQuery,
} from '../../../../apis/listings.js';
import { CreditsQuota } from '../../../../components/widgets/index.js';
import { AdLicenseTab, StaticTabs } from './constants.js';

const Listings = () => {
  const { t } = useTranslation();

  usePageTitle(
    `${t(`Your Property Listings Dashboard | `)} ${t(tenantConstants.TITLE)}`,
    t(
      "Your one-stop listings page for the ads you have posted on Bayut! Whether you're selling your villa or renting out an apartment, easily view, manage, upgrade and analyze all your property listings in one place.",
    ),
  );
  const { user } = useSelector((state) => state.app.loginUser);
  const { isMobile, isMemberArea, isMultiPlatform, locale } = useSelector((state) => state.app.AppConfig);
  const users = useSelector((state) => state.app.userGroup.list);
  const dispatch = useDispatch();
  const location = useGetLocation();
  const navigate = useRouteNavigate();
  const { queryObj } = mapQueryStringToFilterObject(location.search);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdLicenseTab, setIsAdLicenseTab] = useState(queryObj?.tab === StaticTabs.AD_LICENSE);

  const { data: truCheckStatus } = useGetTruCheckStatusesQuery({}, { skip: !tenantConstants.TRUE_CHECK_ENABLED });
  useEffect(() => {
    if (queryObj?.isPackageUser === 'true') {
      if (isMemberArea) {
        navigate('/packages');
      } else {
        navigate(`${tenantRoutes.app()?.dashboard?.path}?trubroker=true`);
      }
    }
  }, [queryObj?.isPackageUser, isMemberArea]);

  const filtersList = useMemo(() => {
    const filters = isAdLicenseTab
      ? tenantFilters.getAdLicenseFilters(user, users)
      : tenantFilters.getMyListingsFilters(user, users, locale, truCheckStatus);

    return filters.map((filter) => {
      return {
        ...filter,
        onClick: () => listingsFilterClickEvent(user, filter.label, tabTitle),
      };
    });
  }, [user, users, locale, truCheckStatus, isAdLicenseTab]);

  useEffect(() => {
    if (isAdLicenseTab) {
      trackRequestsClickEvent(user);
    }
  }, [isAdLicenseTab]);

  const mappedParams = useMemo(() => mapQueryParams(queryObj, filtersList), [queryObj, filtersList]);

  const {
    data: tableData,
    isLoading: listingsLoading,
    isFetching: listingFetching,
    refetch,
    error,
  } = useGetMyListingsQuery({ mappedParams, userId: user?.id }, { refetchOnMountOrArgChange: true });

  const tableColumns = useMemo(() => {
    const statusFilter = queryObj?.['f[nested.platform_listings.status.slug]'];
    return {
      table: isAdLicenseTab
        ? tenantUtils.adLicenseTableColumnMapper()
        : tenantUtils.listingTableColumnMapper(
            user,
            tableData?.statuses_and_dispositions?.find((s) => s.slug === statusFilter || s.id == statusFilter)?.slug,
            refetch,
          ),
    };
  }, [tenantUtils, tableData?.statuses_and_dispositions, queryObj, user, isAdLicenseTab, refetch]);

  const listingIds = tenantUtils.getListingIdsForOvationStats(user, tableData?.list);
  const userIds = tenantUtils.getUserIdsForOvationStats(user, tableData?.list);

  const { isLoading: statsLoading, isFetching: statsFetching } = useGetListingsStatsQuery(
    {
      listingIds: listingIds,
      userId: user?.id,
      userIds,
    },
    {
      skip: !tableData?.list?.length || listingsLoading || listingFetching,
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: adLicenseData,
    isLoading: adLicenseLoading,
    isFetching: adLicenseFetching,
    refetch: refetchAdLicense,
    error: adLicenseError,
  } = useGetAdLicenseRequestsQuery(
    { mappedParams, userId: user?.id },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [tab, setTab] = useState(
    queryObj?.['f[nested.platform_listings.status.slug]'] || queryObj?.tab || tableData?.statuses?.[0]?.key?.toString(),
  );

  const [tabTitle, setTabTitle] = useState(() => {
    return tableData?.statuses?.find((status) => status?.key?.toString() === tab)?.title || '';
  });

  useEffect(() => {
    const raw = queryObj?.['f[nested.platform_listings.status.slug]'];
    const tabKeyFromFilter = tableData?.statuses_and_dispositions?.find((s) => s.slug === raw || s.id == raw)?.id;
    const newTab =
      queryObj?.tab ||
      (tabKeyFromFilter != null ? String(tabKeyFromFilter) : raw) ||
      tableData?.statuses?.[0]?.key?.toString();
    setTab(newTab);
    setIsAdLicenseTab(queryObj?.tab === StaticTabs.AD_LICENSE);

    if (queryObj?.tab === StaticTabs.AD_LICENSE) {
      setTabTitle('Ad License Requests');
    } else {
      setTabTitle(tableData?.statuses?.find((status) => status?.key?.toString() === newTab)?.title || '');
    }
  }, [tableData, location.search, queryObj]);

  useEffect(() => {
    pageViewMyListingEvent(user);
  }, [location.search]);

  const renderQuotaCreditsMobile = (platformKey, platform) => {
    return (
      <CreditsQuota
        platform={platform}
        setUserId={() => {}}
        key={platformKey}
        usersPermission={false}
        loggedInUser={user}
        userId={user.id}
        widgetGap={!isMobile && '0px'}
        rowHeight={isMobile ? '50px' : '34px'}
        user={user}
      />
    );
  };
  const onChangeTab = (e) => {
    let obj;
    if (e === StaticTabs.AD_LICENSE) {
      // Remove listing-specific filters and add ad license tab
      obj = { tab: StaticTabs.AD_LICENSE };
    } else {
      // Remove ad license tab and add listing filters
      const { tab, ...restQuery } = queryObj;
      const slug = tableData?.statuses_and_dispositions?.find((s) => s.id == e)?.slug;
      obj = { ...restQuery, [tableData?.tabFilterKey]: slug ?? e };
    }

    const decodedParams = Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
    setSearchParams(decodedParams);
  };

  const emptyState = useMemo(() => {
    if (isAdLicenseTab) {
      return {
        title: t("No Ad License Requests"),
        subtitle: t("Don't have any AD license? you can easily generate one through Bayut"),
        illustration: <IconNoAdLicense size="120px" color={tenantTheme['primary-light-2']} />,
        button: (
          <Flex align="center">
            <Button
              type={'link'}
              onClick={() => {
                getAdLicenseClickEvent(user);
                navigate('/ad-license');
              }}
            >
              {t('Get an Ad License')}
            </Button>
            <Tag
              color={tenantTheme['danger-color']}
              style={{
                '--tag-color': '#fff',
                '--tag-font-size': '10px',
                padding: '3px 6px',
                'border-radius': '16px',
                fontWeight: 700,
              }}
            >
              {t('NEW')}
            </Tag>
          </Flex>
        ),
      };
    }

    return {
      title: listingStates.listingStates[tab]?.title,
      subtitle: listingStates.listingStates[tab]?.subtitle,
      illustration: <EmptyListing color={tenantTheme['primary-light-2']} />,
      button: <PostListingButton />,
    };
  }, [tab, isAdLicenseTab, t, navigate, tenantTheme]);

  const renderStatesTabs = useCallback(() => {
    const regularTabs =
      tableData?.statuses?.map((e) => ({
        key: e?.key,
        label: e?.tab,
      })) || [];

    const allTabs = [...regularTabs, AdLicenseTab(adLicenseData, t('Ad License Requests'))];

    return (
      <TabsStyled
        className="mb-0"
        defaultActiveKey={tab || tableData?.statuses?.[0]?.key?.toString()}
        onChange={(e) => {
          onChangeTab(e);
        }}
        items={allTabs}
      />
    );
  }, [tableData?.statuses, tab, t, onChangeTab]);

  const currentData = isAdLicenseTab ? adLicenseData : tableData;
  const currentLoading = isAdLicenseTab ? adLicenseLoading : listingsLoading;
  const currentFetching = isAdLicenseTab ? adLicenseFetching : listingFetching;
  const currentError = isAdLicenseTab ? adLicenseError : error;
  const currentRefetch = isAdLicenseTab ? refetchAdLicense : refetch;

  const renderBanner = () =>
    isMemberArea && (
      <Card styles={{ body: { padding: isMobile && 0 } }}>
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
            href={tenantRoutes.app('', false, user).prop_shop.path}
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
          <ListingCardContainer
            listingsData={
              isAdLicenseTab ? { ...currentData, table: tableColumns.table } : { ...tableData, ...tableColumns }
            }
            renderTableTopRight={renderStatesTabs}
            pagination={isAdLicenseTab ? adLicenseData?.pagination : tableData?.pagination}
            renderFiltersAsTopRight
            fetchData={currentRefetch}
            skeletonLoading={currentLoading}
            showPagination
            loading={currentLoading}
            error={currentError}
            emptyState={emptyState}
            renderBanner={renderBanner}
            filtersList={filtersList}
          />
        </Main>
      ) : (
        <>
          <ListingContainer
            filtersList={filtersList}
            listingsData={
              isAdLicenseTab ? { ...currentData, table: tableColumns.table } : { ...tableData, ...tableColumns }
            }
            listingApi={currentRefetch}
            activeTab={isAdLicenseTab ? StaticTabs.AD_LICENSE : Number(tab)}
            renderTableTopRight={
              tableData?.statuses ? [...tableData?.statuses, AdLicenseTab(adLicenseData, t('Ad License Requests'))] : []
            }
            onChangeTab={onChangeTab}
            loading={currentFetching || (isAdLicenseTab ? false : statsLoading)}
            error={currentError}
            onRetry={currentRefetch}
            title={isMemberArea ? t('My Listings') : undefined}
            emptyState={emptyState}
            renderBanner={renderBanner}
            disableTabsOnLoading
            customTabs={renderStatesTabs()}
          />
        </>
      )}
    </>
  );
};

export default Listings;
