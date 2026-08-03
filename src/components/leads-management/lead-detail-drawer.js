import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Typography } from 'antd';
import { forwardRef, default as React, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useLazyGetLeadDetailQuery,
  useLazyGetLeadInterestsQuery,
  useLazyGetTasksQuery,
  useMarkLeadAsViewedMutation,
} from '../../apis/lms';
import { useGetTourStepsForLms } from '../../hooks';
import { Button, Card, Divider, Drawer, EmptyState, Flex, notification, TextWithIcon, Tag, Icon } from '../common';
import { InfiniteScroll } from '../common/infinite-scroll/infinite-scroll';
import Tour from '../common/tour/tour';
import { ListingContainer } from '../listing-container/ListingContainer';
import { DateTime } from '../table/table-components/date-time';
import { ListingDetailCompact } from '../table/table-components/listing-detail-compact';
import { SourceContent } from '../table/table-components/source-content';
import AddInterestDrawer from './add-interest-drawer';
import LeadDetailDrawerHeader from './lead-detail-drawer-header';
import { LeadSourceCardSkeleton } from './lead-detail-drawer-skeleton';
import AddTaskDrawer from './leads-add-task-drawer';
import { addInterestClickEvent, addTaskClickEvent } from '../../services/analyticsService';
import { PAGE_TYPES } from '../../services/analyticsService/constants';
import CallAnalysisDetailDrawer from './CallAnalysisDetailDrawer';
const { Text, Title } = Typography;

const LeadDetailDrawer = forwardRef((props, ref) => {
  const { refetchLeadListings = () => {} } = props;
  const detailDrawerRef = useRef();
  const addInterestDrawerRef = useRef();
  const addTaskDrawerRef = useRef();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const { t } = useTranslation();
  const [leadData, setLeadData] = useState(null);
  const [leadInterests, setLeadInterests] = useState([]);
  const [tasksTableData, setTasksTableData] = useState(null);
  const [leadId, setLeadId] = useState(null);
  const [activeTab, setActiveTab] = useState('interactions');
  const leadDetailTour = useGetTourStepsForLms(isMobile, null, 'lead_detail');
  const [getLeadDetail, { isLoading: leadDataLoading, isFetching: leadDataFetching, error: leadDataError }] =
    useLazyGetLeadDetailQuery();
  const [getTasks, { isLoading: tasksLoading, isFetching: tasksFetching, error: tasksError }] = useLazyGetTasksQuery();
  const [
    getLeadInterests,
    { isLoading: leadInterestsLoading, isFetching: leadInterestsFetching, error: leadInterestsError },
  ] = useLazyGetLeadInterestsQuery();
  const [markLeadAsViewed] = useMarkLeadAsViewedMutation();
  const user = useSelector((state) => state.app.loginUser?.user);
  const callAnalysisDetailDrawerRef = useRef();
  useEffect(() => {
    if (leadData && detailDrawerRef?.current?.isOpen()) {
      !leadData?.isViewed &&
        (async () => {
          const res = await markLeadAsViewed({ leadId });
          if (res && !res.error) {
            refetchLeadListings();
          }
        })();
    }
  }, [leadData?.isViewed]);

  useImperativeHandle(ref, () => ({
    open(id, data) {
      resetValues();
      setLeadId(id);
      fetchData(id);
      setLeadData({ ...data, createdAt: data?.created_at });
      detailDrawerRef?.current && detailDrawerRef?.current?.openDrawer();
    },
    isDetailDrawerOpen() {
      return detailDrawerRef?.current?.isOpen();
    },
  }));
  const CallAnalysisTag = ({ sourceProps, leadData, onClick }) => {
    const callAnalysisScore = sourceProps?.callAnalysisScore;
    return (
      <Tag
        color="#28B16D24"
        shape="round"
        style={{ lineHeight: '1.5em', paddingInline: '0.5em' }}
        onClick={(e) =>
          callAnalysisDetailDrawerRef.current.open({
            clientInfo: leadData,
            callAnalysisScore: sourceProps?.callAnalysisScore,
            recording_uuid: sourceProps?.recording_uuid,
            interestId: sourceProps?.interestId,
          })
        }
      >
        <Flex align="center" gap="3px">
          <TextWithIcon
            icon="LogoBayutIntelligence"
            iconProps={{ size: '17px' }}
            fontWeight={500}
            value={
              callAnalysisScore?.total ? `${callAnalysisScore?.obtained}/${callAnalysisScore?.total}` : t('Analysing')
            }
            style={{ fontSize: '10px' }}
            gap="3px"
          />
          <Icon className="flipX" icon="IconLeft" size="20px" />
        </Flex>
      </Tag>
    );
  };

  const onInterestClick = (interestId) => (e) => {
    addInterestClickEvent(user, PAGE_TYPES.LEAD_DRAWER, leadId);
    e.stopPropagation();
    addInterestDrawerRef.current.openDrawer({
      leadId,
      userId: leadData?.userId,
      interestId,
    });
  };

  const fetchData = (leadId) => {
    getLeadData(leadId);
    getLeadInterestsData(leadId);
  };

  const resetValues = () => {
    setLeadData(null);
    setActiveTab('interactions');
  };

  const onClickAddTask = () => {
    addTaskClickEvent(user, PAGE_TYPES.LEAD_DRAWER, leadId);
    addTaskDrawerRef?.current && addTaskDrawerRef.current.openDrawer();
  };

  const getLeadData = async (leadId) => {
    const response = await getLeadDetail({ leadId });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        setLeadData(response?.data);
      }
    }
  };
  const getLeadInterestsData = async (leadId, queryObj, mergeData) => {
    const response = await getLeadInterests({ leadId, queryObj });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        setLeadInterests((prev) => {
          return {
            ...response.data,
            list: mergeData && prev?.list?.length ? [...prev?.list, ...response?.data?.list] : response?.data?.list,
          };
        });
      }
    }
  };

  const fetchLeadInterests = (queryObj) => {
    leadId && getLeadInterestsData(leadId, queryObj);
  };

  const getAllTasks = async (leadId, queryObj, mergeData) => {
    const response = await getTasks({ leadId, queryObj });
    if (response) {
      if (response.error) {
      } else {
        setTasksTableData((prev) => {
          return {
            ...response.data,
            list: mergeData && prev?.list?.length ? [...prev?.list, ...response?.data?.list] : response?.data?.list,
          };
        });
      }
    }
  };

  useEffect(() => {
    fetchLeadInterests();
  }, []);

  const renderListingDetail = (record) => {
    const interest = record?.props?.interest;
    const project = interest?.project;
    
    if (project?.id) {
      return (
        <ListingDetailCompact {...record.props} showExternalLink interest={interest} />
      );
    }
    
    return (
      <>
        {record.props.id ? (
          <ListingDetailCompact {...record.props} showExternalLink />
        ) : (
        <Flex className="flex-col" style={{ lineHeight: 1, width: 'fit-content' }}>
          {t('No Interest Found')}
          <Button
            size="small"
            icon="FaSquarePlus"
            iconSize="1em"
            type="link"
            block
            onClick={onInterestClick(record.props.interestId)}
            style={{ justifyContent: 'start', padding: 0 }}
          >
            {t('Add Interest Manually')}
          </Button>
        </Flex>
      )}
      </>
    );
  };

  const renderSourceContent = (record) => {
    return (
      <SourceContent
        {...record.props}
        client_info={leadData}
        characterLimit={400}
        fontWeight="400"
        extra={record.props?.callAnalysisScore && <CallAnalysisTag sourceProps={record.props} leadData={leadData} />}
      />
    );
  };

  const leadInterestsTableData = useMemo(
    () => ({
      table: [
        {
          title: t('Date'),
          dataIndex: 'date',
          key: 'date',
          component: 'DateTime',
        },
        {
          title: t('Interested in'),
          dataIndex: 'listing_detail',
          key: 'listing_detail',
          render: renderListingDetail,
        },
        {
          title: t('Lead Source'),
          dataIndex: 'lead_source',
          key: 'lead_source',
          render: renderSourceContent,
        },
      ],
      list: leadInterests?.list,
      pagination: leadInterests?.pagination,
    }),
    [leadInterests, addInterestDrawerRef],
  );

  const leadsTableTabs = useMemo(
    () => [
      {
        title: 'Interactions',
        slug: 'interactions',
        key: 'interactions',
        tab: <div>{t('Interactions')}</div>,
      },
      {
        title: 'All Tasks',
        slug: 'allTasks',
        key: 'allTasks',
        tab: <div id={tenantData.tourElementIds.lead_detail_all_tasks_tab}>{t('All Tasks')}</div>,
      },
    ],
    [],
  );

  const renderLeadInterestCard = (data) => {
    
    return (
      <>
        <Card>
          {data?.item?.listing_detail?.id ? (
            <ListingDetailCompact {...data?.item?.listing_detail} showExternalLink />
          ) : (
            <Flex className="flex-col" style={{ lineHeight: 1, width: 'fit-content' }}>
              {t('No Interest Found')}
              <Button
                size="small"
                icon="FaSquarePlus"
                iconSize="1em"
                type="link"
                block
                onClick={onInterestClick(data?.item?.listing_detail?.interestId)}
                style={{ justifyContent: 'start', padding: 0 }}
              >
                {t('Add Interest Manually')}
              </Button>
            </Flex>
          )}
          <DateTime {...data?.item?.date} wrapperClass={'flex flexYcenter py-4'} wrapperStyle={{ gap: '8px' }} />
          <SourceContent
            {...data?.item?.lead_source}
            client_info={leadData}
            characterLimit={400}
            fontWeight="400"
            extra={
              data?.item?.lead_source?.callAnalysisScore && (
                <CallAnalysisTag sourceProps={data?.item?.lead_source} leadData={leadData} />
              )
            }
          />
        </Card>
        <Divider style={{ borderWidth: '2px', '--ant-margin-lg': '8px' }} />
      </>
    );
  };

  const renderTasksCard = ({ item }) => {
    return (
      <>
        <Card>
          <Flex align="center" className="mb-12">
            <div style={{ flex: 1 }}>
              <Text className="fz-12" type="secondary">
                {t('Completed Task')}
              </Text>
              <Title level={5} style={{ fontSize: '14px', '--ant-typography-title-margin-top': '4px' }}>
                {tenantUtils.getLocalisedString(item.completedTask.childTask, 'title')}
              </Title>
              <Flex gap={isMobile ? '10px' : '14px'}>
                <DateTime
                  value={item.completedTask.childTask.date}
                  showTime={item.completedTask.childTask.showTime}
                  showPopover={item.completedTask.childTask.showPopover}
                  iconSize="10px"
                  textSize="10px"
                />
              </Flex>
            </div>

            <Divider
              type="vertical"
              style={{ borderWidth: '1px', height: '65px', '--ant-divider-vertical-margin-inline': '20px' }}
            />

            <div style={{ flex: 1 }}>
              <Text className="fz-12" type="secondary">
                {t('Planned Task')}
              </Text>
              <Title level={5} style={{ fontSize: '14px', '--ant-typography-title-margin-top': '4px' }}>
                {tenantUtils.getLocalisedString(item.plannedTask.childTask, 'title')}
              </Title>
              <Flex gap={isMobile ? '10px' : '14px'}>
                <DateTime
                  value={item.plannedTask.childTask.date}
                  showTime={item.plannedTask.childTask.showTime}
                  showPopover={item.plannedTask.childTask.showPopover}
                  iconSize="10px"
                  textSize="10px"
                />
              </Flex>
            </div>
          </Flex>

          {(item.notes?.value || item.notes?.imageUrl) && (
            <Card
              style={{
                backgroundColor: tenantTheme.gray200,
                '--ant-padding-lg': '8px',
                borderRadius: '4px',
              }}
            >
              {item.notes?.value && (
                <Text
                  className="fz-12 mb-4"
                  style={{ display: 'block', width: 300 }}
                  ellipsis={{ tooltip: item.notes.value }}
                >
                  {item.notes.value}
                </Text>
              )}

              {item.notes?.imageUrl && (
                <a href={item.notes.imageUrl} target="_blank" rel="noopener noreferrer">
                  <TextWithIcon
                    icon="FaRegFileImage"
                    value={t('image')}
                    textColor={tenantTheme['primary-color']}
                    textSize={isMobile && '12px'}
                    iconProps={{
                      color: tenantTheme['primary-color'],
                      size: '12px',
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  />
                </a>
              )}
            </Card>
          )}
        </Card>
        <Divider style={{ borderWidth: '2px', '--ant-margin-lg': '8px' }} />
      </>
    );
  };

  const onChangeTab = (slug) => {
    setActiveTab(slug);
    const currentTab = tabsMappings[slug];
    if (currentTab) currentTab.fetchFunction({ page: 1 }, false);
  };

  const renderEmptyState = (tab) => {
    switch (tab) {
      case 'interactions':
        return (
          <EmptyState
            title={t('Error')}
            message={leadDataError}
            buttonLoading={leadDataLoading || leadDataFetching}
            onClick={() => getLeadInterestsData(leadId)}
          />
        );
      case 'allTasks':
        return (
          <EmptyState
            title={t('Error')}
            message={tasksError}
            buttonLoading={tasksLoading || tasksFetching}
            onClick={() => getAllTasks(leadId)}
          />
        );
      default:
        return null;
    }
  };

  const tabsMappings = useMemo(() => {
    return {
      interactions: {
        cardComponent: renderLeadInterestCard,
        fetchFunction: (queryObj, mergeData = true) => getLeadInterestsData(leadId, queryObj, isMobile && mergeData),
        loading: leadInterestsLoading || leadInterestsFetching,
        error: leadInterestsError,
        dataList: leadInterestsTableData?.list,
        pagination: leadInterestsTableData?.pagination,
        tableData: leadInterestsTableData,
      },
      allTasks: {
        cardComponent: renderTasksCard,
        fetchFunction: (queryObj, mergeData = true) => getAllTasks(leadId, queryObj, isMobile && mergeData),
        loading: tasksLoading || tasksFetching,
        error: tasksError,
        dataList: tasksTableData?.list,
        pagination: tasksTableData?.pagination,
        tableData: tasksTableData,
      },
    };
  }, [leadId, tasksTableData, leadInterestsTableData, leadId, isMobile]);

  const renderContent = () => {
    return (
      <>
        {isMobile ? (
          leadDataLoading || leadDataFetching ? (
            <LeadSourceCardSkeleton />
          ) : (
            <Card
              style={{ ...(tabsMappings[activeTab]?.loading && { pointerEvents: 'none', opacity: 0.4 }), padding: 0 }}
              bodyStyle={{ '--ant-padding-lg': 0 }}
              tabList={leadsTableTabs}
              onTabChange={onChangeTab}
              activeTabKey={activeTab}
              defaultActiveTabKey={leadsTableTabs?.[0]?.slug}
              tabProps={{ size: 'middle' }}
              tabBarExtraContent={
                <Button
                  size="small"
                  icon="FaSquarePlus"
                  iconSize="1em"
                  type="link"
                  block
                  onClick={onInterestClick()}
                  style={{ justifyContent: 'start', padding: 0 }}
                >
                  {t('Add Interest Manually')}
                </Button>
              }
              className="lead-detail-drawer"
              id={tenantData.tourElementIds.lead_detail_all_interests}
            >
              {tabsMappings[activeTab]?.error ? (
                <EmptyState message={tabsMappings[activeTab]?.error} onClick={tabsMappings[activeTab]?.fetchFunction} />
              ) : !tabsMappings[activeTab]?.dataList?.length ? (
                <EmptyState type="table" hideRetryButton />
              ) : (
                <InfiniteScroll
                  key={activeTab}
                  CardComponent={tabsMappings[activeTab]?.cardComponent}
                  requestOffset={'auto'}
                  loading={tabsMappings[activeTab]?.loading}
                  containerOffset={'auto'}
                  fetchFunction={(pageNumber) => {
                    tabsMappings[activeTab]?.fetchFunction({ page: pageNumber });
                  }}
                  dataList={tabsMappings[activeTab]?.dataList || []}
                  nextPage={tabsMappings[activeTab]?.pagination?.nextPage}
                />
              )}
            </Card>
          )
        ) : (
          <ListingContainer
            id={tenantData.tourElementIds.lead_detail_all_interests}
            listingsData={tabsMappings[activeTab]?.tableData}
            activeTab={activeTab}
            onChangeTab={onChangeTab}
            renderTableTopRight={leadsTableTabs}
            loading={tabsMappings[activeTab]?.loading}
            error={tabsMappings[activeTab]?.error}
            pagination={tabsMappings[activeTab]?.pagination}
            className="p-0"
            noUrlPush
            listingApi={tabsMappings[activeTab]?.fetchFunction}
            onRetry={tabsMappings[activeTab]?.fetchFunction}
            enableFilters={false}
            emptyState={renderEmptyState(activeTab)}
            tabBarExtraContent={
              <Flex gap={0}>
                <Button size="small" icon="FaSquarePlus" iconSize="1em" type="link" block onClick={onInterestClick()}>
                  {t('Add Interest Manually')}
                </Button>

                <Button
                  id={tenantData.tourElementIds.lead_detail_add_tasks}
                  size="small"
                  icon="FaSquarePlus"
                  iconSize="1em"
                  type="primaryOutlined"
                  block
                  onClick={onClickAddTask}
                >
                  {t('Add Task')}
                </Button>
              </Flex>
            }
          />
        )}
      </>
    );
  };

  return (
    <>
      {leadDetailTour?.SHOW_TOUR && detailDrawerRef?.current?.isOpen() && (
        <Tour steps={leadDetailTour?.steps} onClose={leadDetailTour?.onCloseTour} />
      )}
      <Drawer
        bodyStyle={{ paddingTop: '0', padding: isMobile && '0px' }}
        ref={detailDrawerRef}
        push={false}
        headerStyle={{ paddingInline: isMobile && '12px', alignItems: 'start', border: 'none' }}
        title={
          <LeadDetailDrawerHeader
            leadData={leadData}
            detailDrawerRef={detailDrawerRef}
            fetchData={(leadId) => {
              fetchData(leadId);
              refetchLeadListings();
            }}
            clientId={leadData?.id}
            leadId={leadId}
            leadDataLoading={leadDataLoading}
            showInteractionSources={true}
            leadInterests={leadInterests}
          />
        }
        placement={isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right'}
        width={isMobile ? '100vw' : '50vw'}
        height={isMobile && '100vh'}
        footer={
          isMobile ? (
            <Button
              size="small"
              icon={'FaSquarePlus'}
              iconSize="1em"
              type="primaryOutlined"
              block
              onClick={onClickAddTask}
              id={tenantData.tourElementIds.lead_detail_add_tasks}
            >
              {t('Add Task')}
            </Button>
          ) : null
        }
        style={{ '--ant-line-width': '2px' }}
      >
        {renderContent()}
      </Drawer>
      <AddTaskDrawer
        ref={addTaskDrawerRef}
        id={leadId}
        onTaskAdded={(pageNumber) => {
          refetchLeadListings();
          getAllTasks(leadId, { page: pageNumber }, false);
        }}
      />
      <AddInterestDrawer
        ref={addInterestDrawerRef}
        onSuccess={() => {
          refetchLeadListings();
          getLeadInterestsData(leadId);
        }}
      />
      <CallAnalysisDetailDrawer ref={callAnalysisDetailDrawerRef} />
    </>
  );
});

export default LeadDetailDrawer;
