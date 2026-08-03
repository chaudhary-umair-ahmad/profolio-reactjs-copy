import React, { useRef, useState } from 'react';
import { Card, Button, Flex, Tag, TextWithIcon, Icon, EmptyState, Spinner, LinkWithIcon } from '../common';
import { Divider, Typography, Pagination, Drawer } from 'antd';
import { useSelector } from 'react-redux';
import { mapQueryStringToFilterObject } from '../../utility/urlQuery';
import { useLocation } from 'react-router-dom';
import { openExternal, formatNumberString } from '../../utility/utility';
import { t } from 'i18next';
import tenantTheme from '@theme';
import LeadDetailDrawer from './lead-detail-drawer';
import AddInterestDrawer from './add-interest-drawer';
import AddLeadDrawer from './add-lead-drawer';
import CallAnalysisDetailDrawer from './CallAnalysisDetailDrawer';
import { leadDetailClickEvent, addInterestClickEvent } from '../../services/analyticsService';
import { SideArrowIcon } from '../svg';
import { AgentPerformanceCardSkeleton } from './lead-detail-drawer-skeleton';

const { Title, Text } = Typography;

const AgentPerformanceListingsMobile = ({
  selectedUser,
  IS_AGENCY,
  filtersList = [],
  showHeader = false,
  enableFilters = false,
  showPagination = true,
  performanceData,
  isFetching,
  error,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetPage, setBottomSheetPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);

  const location = useLocation();
  const user = useSelector((state) => state.app.loginUser.user);
  const { queryObj } = mapQueryStringToFilterObject(location.search);

  const detailDrawerRef = useRef();
  const addInterestDrawerRef = useRef();
  const addLeadDrawerRef = useRef();
  const callAnalysisDetailDrawerRef = useRef();

  const fetchData = () => {};

  const onClickAddLead = () => {
    addLeadDrawerRef.current.openDrawer();
  };

  const onChangePage = (page) => {
    setCurrentPage(page);
  };

  const onChangeBottomSheetPage = (page) => {
    setBottomSheetPage(page);
    setExpandedCard(null);
  };

  const toggleCardExpansion = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const openBottomSheet = () => {
    setIsBottomSheetOpen(true);
    setBottomSheetPage(1);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setExpandedCard(null);
  };

  const renderAgentPerformanceCard = (item, index) => {
    const cardId = item?.user_id || `card-${index}`;
    const isExpanded = expandedCard === cardId;
    const agentName = item?.user_name || '-';
    const agentEmail = item?.user_email || '-';
    const agentPhone = item?.user_mobile || '-';

    return (
      <Card
        key={cardId}
        style={{
          width: '100%',
          minheight: !isExpanded ? '89px' : '100%',
          marginBottom: index === performanceData?.users?.slice(0, 4)?.length - 1 ? '0' : '4px',
        }}
      >
        <div style={{ gap: '12px', display: 'flex', flexDirection: 'column' }}>
          <Flex gap="12px">
            <img
              src={item?.user_profile_imgae || require(`../../static/img/pages/no-data.svg`)}
              alt={agentName}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
            <Flex align="flex-start" gap="5px" vertical justifyContent="space-between">
              <div>
                <Flex align="center">
                  <Text style={{ fontSize: '14px', fontWeight: '600' }}>{agentName}</Text>
                </Flex>

                <Flex align="flex-start" vertical justifyContent="space-between" gap="5px">
                  <Flex align="center" gap="5px">
                    <Icon icon="AgentEmailIcon" size="12px" color="#767676" />
                    <Text style={{ fontSize: '12px', color: '#767676', fontWeight: '400', lineHeight: '14px' }}>
                      {agentEmail}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="5px">
                    <Icon icon="AgentPhoneIcon" size="12px" color="#767676" />
                    <Text style={{ fontSize: '12px', color: '#767676', fontWeight: '400', lineHeight: '14px' }}>
                      {agentPhone}
                    </Text>
                  </Flex>
                </Flex>
              </div>
            </Flex>
          </Flex>

          <Flex
            align="center"
            gap="4px"
            onClick={() => toggleCardExpansion(cardId)}
            style={{
              color: tenantTheme['primary-color'],
              padding: '3px 8px',
              height: '26px',
              width: '165px',
              border: 'none',
              background: '#0061690F',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '102px',
              cursor: 'pointer',
            }}
          >
            <Text style={{ fontSize: '12px', fontWeight: '500', color: tenantTheme['primary-color'] }}>
              {t('View Performance Detail')}
            </Text>
            <Icon
              icon={isExpanded ? 'UpArrowIcon' : 'DownArrowIcon'}
              size="16px"
              style={{ color: tenantTheme['primary-color'] }}
            />
          </Flex>
        </div>

        <div
          style={{
            maxHeight: isExpanded ? '1000px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease-in-out',
            opacity: isExpanded ? 1 : 0,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '373px',
              gap: '8px',
              paddingTop: isExpanded ? '16px' : '0',
              transition: 'padding-top 0.3s ease-in-out',
            }}
          >
            <div
              style={{
                backgroundColor: '#F5FBFB',
                padding: '16px',
                borderRadius: '6px',
                minHeight: '89px',
                width: '100%',
              }}
            >
              <Flex align="center" gap="8px" className="mb-8">
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Icon icon="LeadsAndTasksIcon" size="20px" color="#25D366" />
                </div>
                <Text style={{ fontSize: '14px', fontWeight: '600', color: '#006169' }}>{t('Lead & Task')}</Text>
              </Flex>

              <Flex justify="space-between">
                <div>
                  <Text
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '##222222',
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    {t('Total Leads')}
                  </Text>
                  <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                    {formatNumberString(item?.total_leads || 0, { maximumFractionDigits: 0 })}
                  </Text>
                </div>

                <div>
                  <Text
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '##222222',
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    {t('Total Tasks')}
                  </Text>
                  <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                    {formatNumberString(item?.total_tasks || 0, { maximumFractionDigits: 0 })}
                  </Text>
                </div>
              </Flex>
            </div>

            <div
              style={{
                backgroundColor: '#F5FBFB',
                padding: '16px',
                borderRadius: '6px',
                minHeight: '89px',
                width: '100%',
              }}
            >
              <Flex align="center" gap="8px" className="mb-8">
                <Icon icon="RiWhatsappFill" size="20px" color="#25D366" />
                <Text style={{ fontSize: '14px', fontWeight: '600', color: '#006169' }}>{t('WhatsApp')}</Text>
              </Flex>

              <Flex justify="space-between">
                <div>
                  <Text
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '##222222',
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    {t('Response Rate')}
                  </Text>
                  <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                    {Math.round(item?.whatsapp_insights?.response_rate || 0)}%
                  </Text>
                </div>
                <div>
                  <Text
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '##222222',
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    Avg Resp. Time
                  </Text>
                  <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                    {item?.whatsapp_insights?.avg_response_time || 0}
                  </Text>
                </div>
              </Flex>
            </div>
            <div
              style={{
                backgroundColor: '#F5FBFB',
                padding: '16px',
                borderRadius: '6px',
                minHeight: '89px',
                width: '100%',
              }}
            >
              <Flex align="center" gap="8px" className="mb-8">
                <Icon icon="CallsIcon" size="20px" color="#25D366" />
                <Text style={{ fontSize: '14px', fontWeight: '600', color: '#006169' }}>{t('Calls')}</Text>
              </Flex>

              <Flex justify="space-between">
                <div>
                  <Text
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '##222222',
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    {t('Response Rate')}
                  </Text>
                  <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                    {Math.round(item?.call_insights?.response_rate || 0)}%
                  </Text>
                </div>
                <div>
                  <Text
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '##222222',
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    Avg Duration
                  </Text>
                  <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                    {item?.call_insights?.avg_call_duration || 0}
                  </Text>
                </div>
                <div>
                  <Text
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '##222222',
                      marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  {t('Avg Response Time')}
                </Text>
                <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                  {item?.call_insights?.avg_response_time || 0}
                </Text>
              </div>
            </Flex>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderBottomSheetPagination = () => {
    return paginationData && performanceData?.users && performanceData?.users?.length > 0 ? (
      <Pagination
        onChange={onChangeBottomSheetPage}
        showSizeChanger={false}
        pageSize={paginationData?.totalPages || 20}
        current={paginationData?.current || 1}
        total={paginationData?.totalCount || 0}
        style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}
      />
    ) : null;
  };

  if (isFetching) {
    return (
      <div style={{ paddingTop: '16px', backgroundColor: '#ffffff' }}>
        <Flex
          align="center"
          justify="space-between"
          className="px-12 mb-8"
          style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '14px' }}
        >
          <Text style={{ fontSize: '14px', fontWeight: '600' }}>{t('Agent Performance')}</Text>
          <LinkWithIcon
            linkTitle={t('View All Agents')}
            icon={<SideArrowIcon />}
            color={tenantTheme['primary-color']}
            onClick={openBottomSheet}
            iconRight={true}
            noUnderline={true}
            style={{ gap: '6px' }}
          />
        </Flex>
        <AgentPerformanceCardSkeleton />
      </div>
    );
  }

  if (error) {
    return <EmptyState title={t('Error')} message={error} buttonLoading={isLoading} onClick={fetchData} />;
  }

  if (!performanceData?.users?.length && !isLoading) {
    return (
      <EmptyState
        type="table"
        hideRetryButton
        title={t('No Agent Performance Found')}
        message={t('No agent performance data available')}
      />
    );
  }

  return (
    <div style={{ paddingTop: '16px', backgroundColor: '#ffffff' }}>
      <Flex
        align="center"
        justify="space-between"
        className="px-12 mb-8"
        style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '14px' }}
      >
        <Text style={{ fontSize: '14px', fontWeight: '600' }}>{t('Agent Performance')}</Text>
        <LinkWithIcon
          linkTitle={t('View All Agents')}
          icon={<SideArrowIcon />}
          color={tenantTheme['primary-color']}
          onClick={openBottomSheet}
          iconRight={true}
          noUnderline={true}
          style={{ gap: '6px' }}
        />
      </Flex>

      <div style={{ backgroundColor: '#F6F7FB' }}>
        {performanceData?.users?.slice(0, 4).map((item, index) => renderAgentPerformanceCard(item, index))}
      </div>

      <Drawer
        title={<Text style={{ fontSize: '18px', fontWeight: '700' }}>{t('All Agents')}</Text>}
        placement="bottom"
        height="85vh"
        open={isBottomSheetOpen}
        onClose={closeBottomSheet}
        closable={false}
        extra={<Icon icon="IoMdClose" onClick={closeBottomSheet} style={{ cursor: 'pointer' }} />}
        styles={{
          body: { padding: '16px 12px', overflowY: 'auto', background: '#F5F5F5' },
        }}
      >
        {error ? (
          <EmptyState title={t('Error')} message={error} buttonLoading={isFetching} onClick={fetchData} />
        ) : !performanceData?.users?.length && !isFetching ? (
          <EmptyState
            type="table"
            hideRetryButton
            title={t('No Agents Found')}
            message={t('No agent data available')}
          />
        ) : (
          <>
            {isFetching ? (
              <AgentPerformanceCardSkeleton />
            ) : (
              <>
                {performanceData?.users?.map((item, index) => renderAgentPerformanceCard(item, index))}
                {renderBottomSheetPagination()}
              </>
            )}
          </>
        )}
      </Drawer>

      <LeadDetailDrawer ref={detailDrawerRef} refetchLeadListings={fetchData} />
      <AddInterestDrawer ref={addInterestDrawerRef} onSuccess={fetchData} />
      <AddLeadDrawer ref={addLeadDrawerRef} onLeadAdded={fetchData} />
      <CallAnalysisDetailDrawer ref={callAnalysisDetailDrawerRef} />
    </div>
  );
};

export default AgentPerformanceListingsMobile;
