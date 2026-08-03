import tenantData from '@data';
import tenantConstants from '@constants';
import TenantComponents from '@components';
import tenantFilters from '@filters';
import tenantTheme from '@theme';
import { Col, Divider, List, Row, Skeleton, Typography } from 'antd';
import cx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ChartjsDonutChart } from '../../../components/charts/chartjs';
import {
  Button,
  Card,
  DrawerModal,
  EmptyState,
  Filters,
  Flex,
  Heading,
  LoaderWrapper,
  notification,
  Number,
} from '../../../components/common';
import { InfiniteScroll } from '../../../components/common/infinite-scroll/infinite-scroll';
import Statistic from '../../../components/common/statistic';
import { HistoryBreakdown } from '../../../components/credits-usage/history-breakdown';
import { ProductBreakdown } from '../../../components/credits-usage/product-breakdown';
import PostListingButton from '../../../components/post-listing-button/post-listing-button';
import { EmptyCreditUsagePlaceholder } from '../../../components/svg';
import { useGetLocation, usePageTitle } from '../../../hooks';
import { pageViewCreditUsageEvent } from '../../../services/analyticsService';
import { mapQueryStringToFilterObject } from '../../../utility/urlQuery';
import { Main } from '../../styled';
import CreditCalculatorModal from '../credits-calculator/creditCalculator';
import { ChartContainer } from './styled';
import {
  useLazyGetConsumptionSummaryDataQuery,
  useLazyGetConsumptionHistoryDataQuery,
} from '../../../apis/quotaCredits';
import PlatformSwitch from '../../../components/platform-switch/platform-switch';
import { useNavigate } from 'react-router-dom';
import { TitleStyled } from '../../../components/styled';

const { Text } = Typography;

const CreditsUsage = () => {
  const { t } = useTranslation();
  const filterRef = useRef();
  usePageTitle(t('Credits Usage - Profolio'));

  const { user } = useSelector((state) => state.app.loginUser);

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const products = useSelector((state) => state.app.products?.products);
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.creditUsage);

  const users = useSelector((state) => state.app.userGroup.list);
  const [showModal, setShowModal] = useState(false);
  const [usageBreakdown, setUsageBreakdown] = useState(null);
  const [usageHistoryData, setUsageHistoryData] = useState({});
  const [usageHistoryDataList, setUsageHistoryDataList] = useState({});
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const CreditTopUps = TenantComponents.CreditTopUps;
  const location = useGetLocation();
  const navigate = useNavigate();
  const { queryObj } = mapQueryStringToFilterObject(location.search);
  const [lastQueryObj, setLastQueryObj] = useState(null);
  const filterList = useMemo(
    () => tenantFilters.getCreditsUsageFilters(products, users, selectedPlatform),
    [products, users, selectedPlatform],
  );
  const isMultiPlatform = user?.isMultiPlatform;

  const [
    getConsumptionHistoryData,
    { isLoading: usageHistoryLoading, isFetching: usageHistoryFetching, error: usageHistoryError },
  ] = useLazyGetConsumptionHistoryDataQuery();

  const [
    getConsumptionSummaryData,
    { isLoading: usageDataLoading, isFetching: usageDataFetching, error: usageDataError },
  ] = useLazyGetConsumptionSummaryDataQuery();

  useEffect(() => {
    getUsageHistoryData(queryObj, 1, false);
  }, [location.search, selectedPlatform?.id]);

  useEffect(() => {
    getUsageBreakdownData();
    pageViewCreditUsageEvent(user);
  }, []);

  const handleFetchData = (type) => {
    if (type === 'credits-history') {
      getUsageHistoryData();
    }
    if (type === 'credits-usage') {
      getUsageBreakdownData();
    }
  };

  const renderCreditTopUpModal = () => {
    return (
      <DrawerModal
        title={t('Credit Top-Up')}
        visible={topUpModalVisible}
        onCancel={() => setTopUpModalVisible(false)}
        footer={null}
        width={880}
        bodyStyle={{ padding: 0 }}
      >
        <CreditTopUps header={false} bodyStyle={{ padding: '16px 24px' }} style={{ borderRadius: 0, border: 'none' }} />
      </DrawerModal>
    );
  };

  const dountData = useCallback(
    (platform) => {
      const chartData = usageBreakdown?.[platform?.slug]?.chartData;
      const isEmptyData = chartData?.total === 0;

      return {
        data: [
          {
            data: isEmptyData ? [100] : [...chartData?.datasets[0]?.data],
            backgroundColor: isEmptyData ? tenantTheme.gray200 : [...chartData?.datasets[0]?.backgroundColor],
            borderWidth: 0,
          },
        ],
        options: {
          cutoutPercentage: 50,
          legend: { display: false },
          animation: {
            duration: isEmptyData ? 0 : 1000,
          },
          tooltips: { enabled: !isEmptyData },
        },
      };
    },
    [usageBreakdown],
  );

  const getUsageHistoryData = async (params, page = 1, reset) => {
    const cachedData = usageHistoryData?.[selectedPlatform?.slug]?.data || [];
    const queryChangeFlag = JSON?.stringify(lastQueryObj) === JSON?.stringify(params);

    if (cachedData?.length && !reset && queryChangeFlag) {
      return;
    }

    const response = await getConsumptionHistoryData(
      {
        params: {
          ...params,
          ...(isMultiPlatform &&
            !tenantConstants.MULTIPLATFROM_VIEW &&
            selectedPlatform?.id && { platform_id: selectedPlatform?.id }),
        },
        page: page,
        platforms: user?.platforms,
        filtersList: filterList,
      },
      { skip: isMultiPlatform && !selectedPlatform?.id },
    );

    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        user?.platforms?.map((platform) => {
          const platformSlug = platform?.slug;
          const platformData = response?.data?.[platformSlug]?.data;

          if (platformData) {
            setUsageHistoryDataList((prevData) => {
              if (!queryChangeFlag) prevData = null;

              const updatedData = prevData?.[platformSlug]?.data || [];
              const keyOffset = response?.data?.[platformSlug]?.pagination?.current_page || 0;
              const newData = platformData.map((item, index) => ({
                ...item,
                key: keyOffset + index,
              }));

              return {
                ...prevData,
                [platformSlug]: { data: updatedData.length ? [...updatedData, ...newData] : newData },
              };
            });

            setUsageHistoryData((prevData) => {
              if (!queryChangeFlag) prevData = null;

              return {
                ...prevData,
                [platformSlug]: response?.data?.[platformSlug],
              };
            });
          }
        });
        setLastQueryObj(params);
      }
    }
  };

  const getUsageBreakdownData = async () => {
    const response = await getConsumptionSummaryData({ platforms: user?.platforms });

    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        setUsageBreakdown(response?.data);
      }
    }
  };

  const renderFilters = () => (
    <Filters
      list={filterList}
      isMobile={isMobile}
      loading={usageHistoryLoading || usageHistoryFetching}
      applyOnClick
      ref={filterRef}
      intialFilterCount={0}
    >
      {({ renderTags, renderFiltersMobile, isData }) =>
        isData && (
          <Flex vertical>
            <Flex align="center" justify={'space-between'} className={cx('mb-0 w-100')}>
              <TitleStyled className="mb-0 py-16">{t('Credits Usage History')}</TitleStyled>

              <div className="text-right">{renderFiltersMobile()}</div>
            </Flex>
            <div className={cx(isMobile && 'px-16', 'w-100 d-flex justify-content-end')}>{renderTags()}</div>
          </Flex>
        )
      }
    </Filters>
  );

  const renderChild = () => (
    <>
      {isMultiPlatform && !tenantConstants.MULTIPLATFROM_VIEW && (
        <div
          className="stickyHeadingBorad mb-12"
          style={{ textAlign: 'end', paddingBottom: '6px', '--top-space': '70px' }}
        >
          <PlatformSwitch
            section="creditUsage"
            platformChange={() => {
              navigate(location.pathname, { replace: true });
            }}
            platformSwitchStyle={{ width: isMobile && '100%', minWidth: !isMobile && '300px' }}
          />
        </div>
      )}
      <div>
        <Row gutter={isMobile ? 0 : { lg: 16, xxl: 24 }}>
          <Col xs={24} lg={8} xxl={7}>
            <LoaderWrapper loading={usageDataLoading || usageDataFetching}>
              {usageDataFetching ? (
                <>
                  <Skeleton.Button style={{ height: 20 }} className="mb-4" />
                  <Card className={cx(isMobile && 'mb-20')} bodyStyle={{ padding: isMobile ? 16 : 24 }}>
                    {[1].map((e) => (
                      <Skeleton key={e} active paragraph={{ rows: 10 }} />
                    ))}
                  </Card>
                </>
              ) : (
                <div className={!isMobile ? 'posSticky' : null} style={{ top: 94 }}>
                  <Card
                    title={
                      <Flex align="center" justify="space-between">
                        <TitleStyled className="mb-0 py-16">{t('Credits Usage')}</TitleStyled>
                        {tenantConstants?.ALLOW_CREDITS_TOPTUP && (
                          <Button
                            className={isMobile ? 'px-16' : null}
                            onClick={() => {
                              setTopUpModalVisible(true);
                            }}
                            type="primaryOutlined"
                            icon={'CgArrowTopRightO'}
                            // className="w-100"
                            size={'small'}
                          >
                            {t('Top-Up your Credits')}
                          </Button>
                        )}
                        {renderCreditTopUpModal()}
                      </Flex>
                    }
                    className={cx(isMobile && 'mb-20', 'w-100')}
                    bodyStyle={{ padding: isMobile ? 16 : 24 }}
                    style={{ '--card-title-width': '100%', '--card-title-align': 'start', '--title-padding': 0 }}
                  >
                    <Text style={{ marginBlockEnd: '16px' }} type="secondary">
                      {t('Status of your current package')}
                    </Text>
                    {!usageDataError ? (
                      usageBreakdown &&
                      usageBreakdown?.[selectedPlatform?.slug]?.details?.length &&
                      usageBreakdown?.[selectedPlatform?.slug]?.by_products?.length &&
                      usageBreakdown?.[selectedPlatform?.slug]?.by_products?.length ? (
                        <>
                          <Card
                            style={{
                              backgroundColor: tenantTheme['primary-light-4'],
                              marginTop: 16,
                            }}
                          >
                            <Row className={'mb-0'} style={{ gap: 16, marginBottom: 20 }}>
                              {usageBreakdown?.[selectedPlatform?.slug]?.details?.map((e, index) => (
                                <React.Fragment key={index}>
                                  <Statistic
                                    title={t(e?.label)}
                                    value={e?.value}
                                    formatter={<Number value={e?.value ? e.value : 0} compact={false} />}
                                    isMobile={isMobile}
                                    fontSize={isMobile ? '1.14286em' : '1.28571em'}
                                    trends={false}
                                  />
                                  {index + 1 !== usageBreakdown?.[selectedPlatform?.slug]?.details?.length && (
                                    <Divider
                                      type="vertical"
                                      orientation="center"
                                      style={{ height: 30, alignSelf: 'center', marginInline: 0 }}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </Row>
                          </Card>
                          <ChartContainer>
                            <ChartjsDonutChart
                              labels={usageBreakdown?.[selectedPlatform?.slug]?.chartData?.labels}
                              showAvailableCredits={false}
                              datasets={dountData(selectedPlatform)?.data}
                              options={dountData(selectedPlatform)?.options}
                            />
                          </ChartContainer>
                          <Heading as="h6">{t('Usage Breakdown')}</Heading>
                          <List split={false} size="small">
                            {usageBreakdown?.[selectedPlatform?.slug]?.by_products?.map((item, i) => (
                              <ProductBreakdown
                                key={i}
                                title={item?.title}
                                value={item?.used_credits}
                                icon={item?.icon}
                                iconColor={item?.iconColor}
                              />
                            ))}
                          </List>
                        </>
                      ) : (
                        <EmptyState type="table" hideRetryButton />
                      )
                    ) : (
                      <EmptyState
                        message={usageDataError?.error}
                        title=""
                        onClick={() => handleFetchData('credits-usage')}
                      />
                    )}
                  </Card>
                </div>
              )}
            </LoaderWrapper>
          </Col>
          <Col xs={24} lg={16} xxl={17}>
            <Card
              bodyStyle={{ padding: isMobile ? '16px 8px' : 24 }}
              style={{
                maxHeight: 'calc(100vh)',
                overflow: 'hidden',
                '--card-title-width': '100%',
                '--title-padding': 0,
              }}
              className={!usageHistoryData?.[selectedPlatform?.slug]?.data?.length ? 'empty-state-credits' : null}
              title={usageHistoryLoading ? <></> : renderFilters()}
            >
              <LoaderWrapper loading={usageHistoryLoading || usageHistoryFetching}>
                {!usageHistoryError ? (
                  (usageHistoryFetching || usageHistoryLoading) &&
                  !usageHistoryData?.[selectedPlatform?.slug]?.data?.length ? (
                    <>
                      <Card>
                        {[1, 2, 3].map((e) => (
                          <Card key={e} className="mb-16 p-8">
                            <Skeleton.Button style={{ height: 150 }} block />
                          </Card>
                        ))}
                      </Card>
                    </>
                  ) : usageHistoryData?.[selectedPlatform?.slug]?.data?.length ? (
                    <div
                      style={{
                        ...(usageHistoryLoading && { pointerEvents: 'none', opacity: 0.4 }),
                        paddingInline: isMobile ? 4 : 40,
                      }}
                    >
                      <InfiniteScroll
                        CardComponent={HistoryBreakdown}
                        itemKey="key"
                        loading={usageHistoryLoading || usageHistoryFetching}
                        containerOffset={216}
                        requestOffset={340}
                        fetchFunction={(page) => getUsageHistoryData(queryObj, page, true)}
                        dataList={usageHistoryDataList?.[selectedPlatform?.slug]?.data}
                        nextPage={usageHistoryData?.[selectedPlatform?.slug]?.pagination?.next_page}
                      />
                    </div>
                  ) : (
                    usageHistoryData?.[selectedPlatform?.slug]?.data?.length === 0 && (
                      <EmptyState
                        type="table"
                        hideRetryButton
                        message={t('Your credits usage for the month will appear here')}
                        title={t('No Credits Usage this Month')}
                        button={<PostListingButton />}
                        illustration={<EmptyCreditUsagePlaceholder />}
                      />
                    )
                  )
                ) : (
                  <EmptyState message={usageHistoryError} title="" onClick={() => handleFetchData('credits-history')} />
                )}
              </LoaderWrapper>
            </Card>
          </Col>
        </Row>
        <CreditCalculatorModal visible={showModal} setShowModal={setShowModal} />
      </div>
    </>
  );
  return (
    <Main className="pb-24" handleScroll={true} role="presentation">
      {renderChild()}
    </Main>
  );
};

export default CreditsUsage;
