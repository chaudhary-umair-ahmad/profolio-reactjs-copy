import tenantData from '@data';
import tenantTheme from '@theme';
import tenantRoutes from '@routes';
import React, { useEffect, useRef } from 'react';
import { BayutMatchBadge, Button, Card, EmptyState, Filters, Flex, Group, LinkWithIcon, Tag, TextWithIcon, Icon } from '../common';
import LeadDetailDrawer from './lead-detail-drawer';
import { Divider, Pagination, Typography } from 'antd';
import RenderTextLtr from '../render-text/render-text';
import { isWebView, openExternal } from '../../utility/utility';
import { t } from 'i18next';
import { LeadInfo } from '../table/table-components/lead-info';
import { ListingDetailCompact } from '../table/table-components/listing-detail-compact';
import { SourceContent } from '../table/table-components/source-content';
import { TaskDetail } from '../table/table-components/task-detail';
import { LeadSourceCardSkeleton } from './lead-detail-drawer-skeleton';
import AddInterestDrawer from './add-interest-drawer';
import { useSelector } from 'react-redux';
import { getBaseURL } from '../../utility/env';
import { getLocaleForURL } from '../../utility/language';
import { leadDetailClickEvent, addInterestClickEvent } from '../../services/analyticsService';
import { useLocation } from 'react-router-dom';
import { useRouteNavigate } from '../../hooks';
import { convertQueryObjToString, mapQueryStringToFilterObject } from '../../utility/urlQuery';
import AddLeadDrawer from './add-lead-drawer';
import CallAnalysisDetailDrawer from './CallAnalysisDetailDrawer';
import { SideArrowIcon } from '../svg';
const { Title, Text } = Typography;

const LeadListingsMobile = (props) => {
  const {
    leadsData,
    loading = true,
    error,
    pagination,
    showPagination,
    fetchFunction,
    filtersList,
    enableFilters = false,
    showHeader,
  } = props;
  const filterRef = useRef();
  const detailDrawerRef = useRef();
  const addInterestDrawerRef = useRef();
  const addLeadDrawerRef = useRef();
  const user = useSelector((state) => state.app.loginUser.user);
  const IS_WEB_VIEW = isWebView();

  const location = useLocation();
  const navigate = useRouteNavigate();
  const queryObj = mapQueryStringToFilterObject(location.search).queryObj;
  const callAnalysisDetailDrawerrRef = useRef();
  useEffect(() => {
    if (queryObj.leadDrawerId) {
      detailDrawerRef?.current?.open(queryObj.leadDrawerId);
    }
  }, [queryObj.leadDrawerId]);

  const onChangePage = (current) => {
    const { queryObj: currentQueryObj } = mapQueryStringToFilterObject(location.search);
    currentQueryObj.page = current;
    navigate({
      pathname: location.pathname,
      search: convertQueryObjToString({ ...currentQueryObj }),
    });
  };

  const onInterestClick = (item) => (e) => {
    addInterestClickEvent(user, showHeader, item?.client_info?.leadId);
    e.stopPropagation();
    addInterestDrawerRef.current.openDrawer({
      leadId: item?.client_info?.leadId,
      updateInterest: !!item?.listing_detail?.interestId,
      interestId: item?.listing_detail?.interestId,
      userId: item?.listing_detail?.userId,
    });
  };
  const renderFilters = () => {
    return (
      <Filters list={filtersList} applyOnClick ref={filterRef} intialFilterCount={0}>
        {({ renderFiltersMobile, isData }) =>
          isData && (
            <Flex vertical>
              <div className="text-right py-8">{renderFiltersMobile()}</div>
            </Flex>
          )
        }
      </Filters>
    );
  };

  const renderPagination = () => {
    return pagination && leadsData?.list && leadsData?.list?.length > 0 ? (
      <Pagination
        onChange={onChangePage}
        showSizeChanger={false}
        pageSize={pagination?.pageCount || 20}
        defaultCurrent={pagination?.current}
        current={pagination?.current}
        total={pagination?.totalCount}
      />
    ) : null;
  };

  const onClickAddLead = () => {
    addLeadDrawerRef.current.openDrawer();
  };

  const renderCard = (item, index) => {
    return (
      <Card
        id={index === 0 ? tenantData.tourElementIds.leads_dashboard_first_row : null}
        key={index}
        style={{ marginBottom: '4px', position: 'relative', ...(!item?.client_info?.isViewed ? { backgroundColor: tenantTheme['primary-light-4'] } : {})}}
      >
        <Flex justify="space-between" align="flex-start" style={{ marginBottom: '8px' }}>
          <div style={{ flex: 1 }}>
            <LeadInfo 
              {...item?.client_info} 
              hideContactInfo 
              showHeader 
              onAddNameClick={(e) => {
                e.stopPropagation();
                leadDetailClickEvent(user, showHeader, item?.client_info?.leadId);
                detailDrawerRef?.current?.open(item?.client_info?.leadId, item?.client_info);
              }}
            />
          </div>
          <Flex align="center" gap="6px">
            <BayutMatchBadge show={item?.client_info?.source === 'bayut_match'} style={{fontSize: '12px', width: '94px', borderRadius: '34px', height: '20px'}}/>
            <Button
              type="link"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                leadDetailClickEvent(user, showHeader, item?.client_info?.leadId);
                detailDrawerRef?.current?.open(item?.client_info?.leadId, item?.client_info);
              }}
              style={{
                padding: '4px 8px',
                height: 'auto',
                fontSize: '12px',
                color: tenantTheme['primary-color'],
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}
            >
              {t('View Detail')}
            </Button>
          </Flex>
        </Flex>
        <SourceContent
          {...item?.last_interaction}
          hideContent
          extra={
            item?.last_interaction?.callAnalysisScore && (
              <Tag
                color="#28B16D24"
                shape="round"
                style={{ lineHeight: '1.5em', paddingInline: '0.5em' }}
                onClick={(e) => {
                  callAnalysisDetailDrawerrRef.current.open({
                    clientInfo: item?.client_info,
                    callAnalysisScore: item?.last_interaction?.callAnalysisScore,
                    recording_uuid: item?.last_interaction?.recording_uuid,
                    interestId: item?.last_interaction?.interestId,
                  });
                  e.stopPropagation();
                }}
              >
                <Flex align="center" gap="3px">
                  <TextWithIcon
                    icon="LogoBayutIntelligence"
                    iconProps={{ size: '17px' }}
                    fontWeight={500}
                    value={
                      item?.last_interaction?.callAnalysisScore?.total
                        ? `${item?.last_interaction?.callAnalysisScore?.obtained}/${item?.last_interaction?.callAnalysisScore?.total}`
                        : t('Analysing')
                    }
                    style={{ fontSize: '10px' }}
                    gap="3px"
                  />
                  <Icon className="flipX" icon="IconLeft" size="20px" />
                </Flex>
              </Tag>
            )
          }
        />
        <Group template={'1fr auto 1fr'} style={{ alignItems: 'center', marginTop: '5px' }} gap="16px">
          <div>
            <Text style={{ fontSize: '10px' }}> {t('Interested In')}</Text>
            {item?.listing_detail?.id ? (
              <ListingDetailCompact
                showExternalLink
                characterLimit={15}
                {...item?.listing_detail}
                isDashboard={showHeader}
              />
            ) : (
              <Flex
                className="flex-col"
                style={{ lineHeight: 1, paddingInline: '8px', fontSize: '12px' }}
                onClick={(e) => e.stopPropagation()}
              >
                {t('No Interest Found')}

                <Button
                  size="small"
                  icon="FaSquarePlus"
                  iconSize="1em"
                  type="link"
                  block
                  onClick={onInterestClick(item)}
                  style={{ justifyContent: 'start', padding: 0, fontSize: '12px' }}
                >
                  {t('Add Interest Manually')}
                </Button>
              </Flex>
            )}
          </div>
          <Divider type="vertical" style={{ borderWidth: '1px', height: '65px' }} />
          <div>
            <Text style={{ fontSize: '10px' }}> {t('Next Planned Task')}</Text>
            <div>
              <TaskDetail {...item?.tasks_detail} />
            </div>
          </div>
        </Group>
        <Flex gap="10px" style={{ width: '94vw', marginTop: '5px' }}>
          <Button
            size="small"
            icon={'MdMail'}
            iconSize="1em"
            type="primaryOutlined"
            block
            disabled={!item?.client_info?.email}
            onClick={(e) => {
              e.stopPropagation();
              openExternal(item?.client_info?.email, 'email');
            }}
          >
            {t('Email')}
          </Button>


          <Button
            size="small"
            icon="RiWhatsappFill"
            iconColor="#25D366"
            iconSize="1em"
            block
            type="primaryOutlined"
            disabled={!item?.client_info?.whatsapp}
            onClick={(e) => {
              e.stopPropagation();
              openExternal(item?.client_info?.whatsapp, 'whatsapp');
            }}
            >
            {t('WhatsApp')}
          </Button>
          <Button
            size="small"
            icon="IoCall"
            iconSize="1em"
            type="primaryOutlined"
            block
            disabled={!item?.client_info?.phone}
            onClick={(e) => {
              e.stopPropagation();
              openExternal(item?.client_info?.phone);
            }}
          >
            <RenderTextLtr text={t('Call')} />
          </Button>
        </Flex>
      </Card>
    );
  };

  return (
    <div >
      <Flex align="center" justify="space-between" className="px-12">
        {!showHeader && !IS_WEB_VIEW && (
          <Title level={5} className="mb-0 fw-700" style={{ fontSize: '16px', '--ant-font-weight-strong': '700' }}>
            {t('Leads Management')}
          </Title>
        )}
        <Flex align="center" gap="8px">
          {!showHeader && (
            <Button size="small" icon="FaSquarePlus" iconSize="1em" type="primaryOutlined" onClick={onClickAddLead}>
              {t('Add New Lead')}
            </Button>
          )}
          {enableFilters && renderFilters()}
        </Flex>
      </Flex>

      {showHeader && (
        <Flex align="center" justify="space-between" className="p-16" style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '14px' }}>
          <Title level={5} className="mb-0" style={{ fontSize: '14px', '--ant-font-weight-strong': '600', color: '#222222' }}>
            {t('Recent Leads')}
          </Title>
          <LinkWithIcon
            link={!IS_WEB_VIEW ? tenantRoutes.app('', false, user).leads_management.path : null}
            linkTitle={t('View All Leads')}
            color={tenantTheme['primary-color']}
            id={tenantData.tourElementIds.leads_dashboard_view_all_link}
            noUnderline={true}
            onClick={() => {
              if (IS_WEB_VIEW) {
                window.location.href = `${getBaseURL()}${getLocaleForURL()}/lms/leads`;
              }
            }}
            icon={<SideArrowIcon />}
            iconRight={true}
            style={{gap:'6px'}}
          />
        </Flex>
      )}
      {loading ? (
        <LeadSourceCardSkeleton />
      ) : error ? (
        <EmptyState title="Error" message={error} buttonLoading={loading} onClick={fetchFunction} />
      ) : !leadsData?.list?.length ? (
        <EmptyState type="table" hideRetryButton />
      ) : (
        <div id={tenantData.tourElementIds.leads_management_table} style={{ backgroundColor: '#F6F7FB' }}>
          {leadsData?.list?.map((item, index) => renderCard(item, index))}
        </div>
      )}

      {showPagination && renderPagination()}
      <LeadDetailDrawer ref={detailDrawerRef} />
      <AddInterestDrawer ref={addInterestDrawerRef} onSuccess={fetchFunction} />
      <AddLeadDrawer ref={addLeadDrawerRef} onLeadAdded={fetchFunction} />
      <CallAnalysisDetailDrawer ref={callAnalysisDetailDrawerrRef} />
    </div>
  );
};

export default LeadListingsMobile;
