import store from '@store';
import tenantUtils from '@utils';
import React, { useCallback, useEffect, useState } from 'react';
import LeadListingsTable from '../../../components/leads-management/lead-listings';
import tenantTheme from '@theme';
import { Avatar, EmptyState, Flex, Group, Button, LinkWithIcon, Modal, Dropdown, Icon, Text } from '../../../components/common';
import { IconSwitch } from '../../../components/svg';
import { CardMetaStyled } from '../user-settings/style';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import LeadsBreakdownGraph from '../../../components/leads-management/leads-breakdown-graph';
import { Main } from '../../styled';
import { useGetProductStatsQuery, useGetInsightsStatsQuery, useGetResponseTimeMetricsQuery, useGetResponseTimeGraphQuery, useGetUserPerformanceQuery } from '../../../apis/lms';
import { useLeadsDashboardData } from '../../../hooks/useLeadsDashboardData';
import parentApi from '../../../store/parentApi';
import { getEndPointArgs } from '../../../hooks/useRtkCacheUpdate';
import { useGetTourStepsForLms } from '../../../hooks';
import Tour from '../../../components/common/tour/tour';
import { personaFilterClickEvent, pageViewLeadsDashboard } from '../../../services/analyticsService';
import LeadsDashboardCard from '../../../components/leads-management/leads-dashboard-cards';
import { callInsightsTitleStats, formatCallData, formatWhatsappData, formatCallTimeStats, formatWhatsappTimeStats, totalLeadsTitleStats, whatsappTitleStats, formatAgentPerformanceTable } from './utils';
import TotalLeadsCard from '../../../components/leads-management/total-leads-card';
import { TotalLeadsCardSkeleton, LeadsDashboardCardSkeleton } from '../../../components/leads-management/leads-dashboard-cards-skeleton';
import { formatNumberString } from '../../../utility/utility';
import { ListingContainer } from '../../../components/listing-container/ListingContainer';
import AgentPerformanceListingsMobile from '../../../components/leads-management/agent-performance-listings-mobile';
import moment from 'moment';
import ViewTrendsGraph from '../../../components/leads-management/view-trends-graph';
import {  Popover as PopoverAntd } from 'antd';
import tenantConstants from '@constants';


const LeadsDashboard = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user: loginUser } = useSelector((state) => state.app.loginUser);
  const { agencyUsers, selectedUser, IS_AGENCY, filterObj, handleUserFilterChange, onLeadsBreakdownFilterChange } =
    useLeadsDashboardData();
  const leadListingsTable = useSelector(
    (state) =>
      parentApi.endpoints.getLeads.select(getEndPointArgs('getLeads', store.getState().parentApi))(state)?.data,
  );
  const leadsDashboardTour = useGetTourStepsForLms(isMobile, leadListingsTable?.list, 'dashboard');
  const [isAgentsModalOpen, setAgentsModalOpen] = useState(false);
  const [isViewTrendModalOpen, setViewTrendModalOpen] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  const [callGraphDateRange, setCallGraphDateRange] = useState(null);
  const [whatsappGraphDateRange, setWhatsappGraphDateRange] = useState(null);
  const [modalPage, setModalPage] = useState(1);
  useEffect(() => {
    pageViewLeadsDashboard(loginUser);
  }, []);

  const {
    data: leadsBreakdownData,
    isLoading: leadsBreakdownDataLoading,
    isFetching: leadsBreakdownDataFetching,
    error: leadsBreakdownDataError,
  } = useGetProductStatsQuery(
    {
      selectedUser,
      params: filterObj,
    },
    { skip: !selectedUser?.id || !tenantConstants.LMS_ENABLED.IS_LEADS_BREAKDOWN_ENABLED, refetchOnMountOrArgChange: true },
  );

  const {
    data: callInsightsData,
    isLoading: callInsightsLoading,
  } = useGetInsightsStatsQuery(
    {
      selectedUser,
      params: filterObj,
      identifier: 'call',
    },
    { skip: !selectedUser?.id || !tenantConstants.LMS_ENABLED.IS_INSIGHTS_ENABLED, refetchOnMountOrArgChange: true},
  );

  const {
    data: whatsappInsightsData,
    isLoading: whatsappInsightsLoading,
  } = useGetInsightsStatsQuery(
    {
      selectedUser,
      params: filterObj,
      identifier: 'whatsapp',
    },
    { skip: !selectedUser?.id || !tenantConstants.LMS_ENABLED.IS_INSIGHTS_ENABLED, refetchOnMountOrArgChange: true },
  );

  const {
    data: callResponseTimeMetrics,
    isLoading: callResponseTimeLoading,
  } = useGetResponseTimeMetricsQuery(
    {
      selectedUser,
      params: filterObj,
      identifier: 'call',
    },
    { skip: !selectedUser?.id || !tenantConstants.LMS_ENABLED.IS_INSIGHTS_ENABLED, refetchOnMountOrArgChange: true },
  );

  const {
    data: whatsappResponseTimeMetrics,
    isLoading: whatsappResponseTimeLoading,
  } = useGetResponseTimeMetricsQuery(
    {
      selectedUser,
      params: filterObj,
      identifier: 'whatsapp',
    },
    { skip: !selectedUser?.id || !tenantConstants.LMS_ENABLED.IS_INSIGHTS_ENABLED, refetchOnMountOrArgChange: true},
  );

  const callGraphFilterObj = callGraphDateRange
    ? { ...filterObj, start_date: callGraphDateRange.startDate, end_date: callGraphDateRange.endDate }
    : filterObj;

  const whatsappGraphFilterObj = whatsappGraphDateRange
    ? { ...filterObj, start_date: whatsappGraphDateRange.startDate, end_date: whatsappGraphDateRange.endDate }
    : filterObj;

  const { data: callResponseTimeGraph } = useGetResponseTimeGraphQuery(
    {
      selectedUser,
      params: callGraphFilterObj,
      identifier: 'call',
    },
    { skip: !selectedUser?.id || isViewTrendModalOpen !== 'call' || !tenantConstants.LMS_ENABLED.IS_INSIGHTS_ENABLED, refetchOnMountOrArgChange: true},
  );

  const { data: whatsappResponseTimeGraph } = useGetResponseTimeGraphQuery(
    {
      selectedUser,
      params: whatsappGraphFilterObj,
      identifier: 'whatsapp',
    },
    { skip: !selectedUser?.id || isViewTrendModalOpen !== 'whatsapp' || !tenantConstants.LMS_ENABLED.IS_INSIGHTS_ENABLED, refetchOnMountOrArgChange: true},
  );

  const { data: userPerformanceData, isFetching: userPerformanceFetching, error: userPerformanceError } = useGetUserPerformanceQuery(
    { params: filterObj, page: 1, per_page: tenantConstants.LMS_ENABLED.AGENT_PERFORMANCE_DASHBOARD_PER_PAGE },
    { skip: !filterObj || !tenantConstants.LMS_ENABLED.IS_PERFORMANCE_ENABLED, refetchOnMountOrArgChange: true }
  );

  const { data: userPerformanceModalData, isFetching: userPerformanceModalFetching, error: userPerformanceModalError } = useGetUserPerformanceQuery(
    { params: filterObj, page: modalPage, per_page: tenantConstants.LMS_ENABLED.AGENT_PERFORMANCE_MODAL_PER_PAGE },
    { skip: !filterObj || !isAgentsModalOpen || !tenantConstants.LMS_ENABLED.IS_PERFORMANCE_ENABLED, refetchOnMountOrArgChange: true }
  );

  const agentPerformanceTable = formatAgentPerformanceTable(userPerformanceData);
  const agentPerformanceModalTable = formatAgentPerformanceTable(userPerformanceModalData);

  const graphData = isViewTrendModalOpen === 'call' ? callResponseTimeGraph : whatsappResponseTimeGraph;

  const callResponseRates = graphData?.callResponseRates || [];
  const whatsappResponseRates = graphData?.whatsappResponseRates || [];
  const callAvgResponseTime = graphData?.callAvgResponseTime || [];
  const whatsappAvgResponseTime = graphData?.whatsappAvgResponseTime || [];
  const labels = graphData?.labels?.map(date => moment(date).format('MMM DD')) || [];
  const summaryData = graphData?.summary || null;

  const handleGraphDateRangeChange = (startDate, endDate) => {
    const formattedDateRange = {
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    };

    if (isViewTrendModalOpen === 'call') {
      setCallGraphDateRange(formattedDateRange);
    } else if (isViewTrendModalOpen === 'whatsapp') {
      setWhatsappGraphDateRange(formattedDateRange);
    }
  };

  const handleModalPageChange = (params) => {
    setModalPage(params?.page || 1);
  };

  const handleModalOpen = () => {
    setModalPage(1);
    setAgentsModalOpen(true);
  };

  const renderUserSelect = useCallback(() => {
    return (
      <Flex
        wrap
        align="center"
        justify="space-between"
        gap={isMobile ? '6px' : null}
        //className={isMobile && 'px-12 mb-8'}
        style={{ marginBottom: '12px', marginTop: isMobile ? '12px' : '0px', marginLeft: isMobile ? '12px' : '0px' }}
      >
        <CardMetaStyled
          className="p-0 "
          gap="8px"
          avatar={
            <Avatar iconSize={24} src={selectedUser?.profile_image} style={{ alignSelf: 'center', verticalAlign: 'middle' }} />
          }
          style={{
            gap: isMobile ? '6px' : '8px',
          }}
          titleFontWeight="700"
          title={
            <Flex gap="8px" align="center" justify="center" style={{ height: '100%' }}>
              <span style={{ fontWeight: '600', color: '#222222' }} >{tenantUtils.getLocalisedString(selectedUser, 'name')}</span>
              {loginUser?.user_role_within_agency === 'owner' && (
                <Dropdown
                  placement="bottomLeft"
                  options={agencyUsers}
                  getOptionLabel={(op) =>
                    op
                      ? `${op.name || ''} ${op.id === loginUser?.id ? t('(Me)') : op.id === -1 ? t('(Agency)') : ''}`
                      : ''
                  }
                  getOptionValue={(op) => op.id}
                  onChange={(option) => {
                    personaFilterClickEvent(loginUser, option);
                    handleUserFilterChange(option);
                  }}
                  suffixIcon="ChevronDown"
                  suffixIconProps={{ color: tenantTheme['primary-color'] }}
                  placeholder=""
                  iconSize="22px"
                  type="primary"
                  style={{
                    display: 'flex',
                    width: '24px',
                    height: '24px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#E1F2F0',
                    border: 'none',
                    borderRadius: '400px',
                    gap: '0px',
                    cursor: 'pointer',
                  }}
                  groupStyle={{ minWidth: 'auto' }}
                  horizontal
                  value={null}
                  accentColor={tenantTheme['primary-color']}
                  inputLoading={false}
                  popupMatchSelectWidth={false}
                />
              )}
            </Flex>
          }
        />
      </Flex>
    );
  }, [selectedUser?.id, loginUser, agencyUsers]);

  const isCardsLoading = !selectedUser?.id;

  return (
    <Main>
      {leadsBreakdownDataError ? (
        <EmptyState
          title={t('Error')}
          message={leadsBreakdownDataError}
          buttonLoading={leadsBreakdownDataLoading || leadsBreakdownDataFetching}
        />
      ) : (
        <>
          {leadsDashboardTour?.SHOW_TOUR &&
            !!leadListingsTable?.list?.length && ( //Use cache here
              <Tour steps={leadsDashboardTour?.steps} onClose={leadsDashboardTour.onCloseTour} />
            )}
          <Group gap='8px'>
              {renderUserSelect()}
              {tenantConstants.LMS_ENABLED.IS_INSIGHTS_ENABLED && tenantConstants.LMS_ENABLED.IS_TOTAL_LEADS_ENABLED &&
                <>
                  <div className='flex' style={{ height: isMobile ? '143px' : '224px', gap: '8px', overflow: 'auto' }}>
                    {isCardsLoading ? (
                      <>
                        <TotalLeadsCardSkeleton />
                        <LeadsDashboardCardSkeleton />
                        <LeadsDashboardCardSkeleton />
                      </>
                    ) : (
                      <>
                        <TotalLeadsCard title={totalLeadsTitleStats} value={formatNumberString(totalLeads, { maximumFractionDigits: 0 })}/>
                        <LeadsDashboardCard
                          data={formatCallData(callInsightsData?.insights) || []}
                          stats={formatCallTimeStats(callResponseTimeMetrics)}
                          title={callInsightsTitleStats}
                          onViewTrendClick={() => setViewTrendModalOpen('call')}
                          showTooltip={loginUser && !loginUser?.is_call_tracking_enabled}
                          tooltipText={t('Your call tracking is currently disabled. Contact us at')}
                        />
                        <LeadsDashboardCard
                          data={formatWhatsappData(whatsappInsightsData?.insights)}
                          stats={formatWhatsappTimeStats(whatsappResponseTimeMetrics)}
                          title={whatsappTitleStats}
                          onViewTrendClick={() => setViewTrendModalOpen('whatsapp')}
                          showTooltip={loginUser && !loginUser?.is_whatsapp_tracking_enabled}
                          tooltipText={t('Your WhatsApp tracking is currently disabled. Contact us at')}
                        />
                      </>
                    )}
                  </div>
                </>
              }

            <ViewTrendsGraph
              visible={!!isViewTrendModalOpen}
              onCancel={() => setViewTrendModalOpen(false)}
              title={isViewTrendModalOpen === 'call' ? t('View Call Trends') : t('View Whatsapp Trends')}
              labels={labels}
              callResponseRates={callResponseRates}
              whatsappResponseRates={whatsappResponseRates}
              callAvgResponseTime={callAvgResponseTime}
              whatsappAvgResponseTime={whatsappAvgResponseTime}
              isViewTrendModalOpen={isViewTrendModalOpen}
              callsData={isViewTrendModalOpen === 'call' ? formatCallData(callInsightsData?.insights): formatWhatsappData(whatsappInsightsData?.insights)}
              callStats={isViewTrendModalOpen === 'call' ? formatCallTimeStats(callResponseTimeMetrics) : formatWhatsappTimeStats(whatsappResponseTimeMetrics)}
              onDateRangeChange={handleGraphDateRangeChange}
              summaryData={summaryData}
            />
            {tenantConstants.LMS_ENABLED.IS_LEADS_BREAKDOWN_ENABLED && (
               <div>
               <LeadsBreakdownGraph
                 graphData={leadsBreakdownData?.graphData}
                 widgetData={leadsBreakdownData?.widgetData}
                 loading={leadsBreakdownDataLoading || leadsBreakdownDataFetching || !selectedUser?.id}
                 onFilterChange={onLeadsBreakdownFilterChange}
                 filterObj={filterObj}
               />
             </div>
            )}

            {IS_AGENCY && tenantConstants.LMS_ENABLED.IS_PERFORMANCE_ENABLED && (
               <div>
               {isMobile ? (<>
                 <AgentPerformanceListingsMobile
                   selectedUser={selectedUser}
                   IS_AGENCY={IS_AGENCY}
                   filtersList={[]}
                   showHeader={false}
                   enableFilters={false}
                   showPagination={true}
                   performanceData={userPerformanceData}
                   isFetching={userPerformanceFetching}
                   error={userPerformanceError}
                 />
               </>):(
                 <>
                  <ListingContainer
                    listingContainerStyle={{ padding: '16px', paddingBottom: '0px', backgroundColor: '#ffffff', borderRadius: '8px' }}
                    title={t('Agent Performance')}
                    titleFontSize="18px"
                    listingsData={agentPerformanceTable}
                    loading={userPerformanceFetching}
                    error={userPerformanceError}
                    enableFilters={false}
                    showPagination={false}
                    paginationOnBottom={false}
                    actionBtn={
                      <div onClick={(e)=>{ e.preventDefault();  handleModalOpen(); }}>
                        <LinkWithIcon
                          id={'agent_performance_view_agents'}
                          linkTitle={t('View All Agents')}
                          icon={<IconSwitch />}
                          link={'#'}
                          color={tenantTheme['primary-color']}
                          noUnderline={true}
                        />
                      </div>
                    }
                    onRow={() => ({
                      style: {
                        borderBottom: '1px solid #F0F0F0',
                      },
                    })}
                  />
                  <Modal
                    title={t('Agent Performance')}
                    visible={isAgentsModalOpen}
                    onCancel={()=>setAgentsModalOpen(false)}
                    footer={null}
                    width={'90%'}
                  >
                    <ListingContainer
                      title={''}
                      titleFontSize="18px"
                      listingsData={agentPerformanceModalTable}
                      listingApi={handleModalPageChange}
                      loading={userPerformanceModalFetching}
                      error={userPerformanceModalError}
                      enableFilters={false}
                      showPagination={true}
                      noUrlPush={true}
                      listingContainerStyle={{ padding: 0 }}
                      onRow={() => ({
                        style: {
                          borderBottom: '1px solid #F0F0F0',
                        },
                      })}
                    />
                  </Modal>
                 </>
               )}

             </div>
            )}
            <LeadListingsTable
              enablePagination={false}
              showHeader
              isDashboard
              hideTour
              selectedUser={selectedUser}
              IS_AGENCY={IS_AGENCY}
              setTotalLeads={setTotalLeads}
              listingContainerStyle={{ padding: '16px', paddingBottom: '0px', backgroundColor: '#ffffff', borderRadius: '8px' }}
              titleFontSize="18px"
            />
          </Group>
        </>
      )}
    </Main>
  );
};

export default LeadsDashboard;
