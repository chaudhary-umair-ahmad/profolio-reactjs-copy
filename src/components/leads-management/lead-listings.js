import tenantData from '@data';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import { t } from 'i18next';
import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useGetLeadsQuery } from '../../apis/lms';
import { useGetLocation, useGetTourStepsForLms } from '../../hooks';
import {
  addInterestClickEvent,
  addTaskClickEvent,
  applyFilterLeadsClickEvent,
  leadDetailClickEvent,
} from '../../services/analyticsService';
import { PAGE_TYPES } from '../../services/analyticsService/constants';
import { mapQueryStringToFilterObject } from '../../utility/urlQuery';
import { openExternal } from '../../utility/utility';
import { Button, Flex, LinkWithIcon, Tag, TextWithIcon, Icon } from '../common';
import Tour from '../common/tour/tour';
import { ListingContainer } from '../listing-container/ListingContainer';
import { IconSwitch } from '../svg';
import { ListingDetailCompact } from '../table/table-components/listing-detail-compact';
import { MorePropertiesPopover } from '../table/table-components/more-properties-popover';
import AddInterestDrawer from './add-interest-drawer';
import AddLeadDrawer from './add-lead-drawer';
import LeadDetailDrawer from './lead-detail-drawer';
import LeadListingsMobile from './lead-listings-mobile';
import AddTaskDrawer from './leads-add-task-drawer';
import CallAnalysisDetailDrawer from './CallAnalysisDetailDrawer';
import { SourceContent } from '../table/table-components/source-content';
import { TaskDetail } from '../table/table-components/task-detail';
const LeadListingsTable = (props) => {
  const {
    enableFilters = false,
    enablePagination = true,
    isDashboard = false,
    selectedUser,
    filtersList,
    IS_AGENCY,
    setTotalLeads = () => {},
    listingContainerStyle,
    titleFontSize = "16px",
  } = props;
  const location = useGetLocation();
  const params = new URLSearchParams(location.search);
  const keys = [...params.keys()];
  const addTaskDrawerRef = useRef();
  const addLeadDrawerRef = useRef();
  const { queryObj } = mapQueryStringToFilterObject(window.location.search);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const detailDrawerRef = useRef();
  const addInterestDrawerRef = useRef();
  const callAnalysisDetailDrawerRef = useRef();
  const {
    data: leadsTable,
    error,
    isLoading: loading,
    isFetching: fetching,
    refetch: fetchData,
  } = useGetLeadsQuery(
    {
      params: { ...(!IS_AGENCY && { [`f[user_id]`]: selectedUser?.id?.toString() }), ...queryObj },
      filtersList: filtersList,
    },
     { skip: !selectedUser?.id, refetchOnMountOrArgChange: true},
  );
  const leadsManagementTour = useGetTourStepsForLms(isMobile, leadsTable?.list, 'management');
  const user = useSelector((state) => state.app.loginUser.user);


  useEffect(() => {
    if (queryObj.leadDrawerId) {
      detailDrawerRef?.current?.open(queryObj.leadDrawerId);
    }
  }, [queryObj.leadDrawerId]);

  useEffect(() => {
    setTotalLeads(leadsTable?.totalLeads ?? 0);
  }, [leadsTable?.totalLeads]);

  useEffect(() => {
    applyFilterLeadsClickEvent(user, keys);
  }, [location?.search]);
  const onInterestClick = (record) => (e) => {
    addInterestClickEvent(user, isDashboard, record?.props?.leadId);
    e.stopPropagation();
    addInterestDrawerRef.current.openDrawer(record.props);
  };

  const onClickAddLead = () => {
    addLeadDrawerRef.current.openDrawer();
  };

  const onAddTaskClick = (leadId) => (e) => {
    addTaskClickEvent(PAGE_TYPES.LEAD_TABLE, leadId);
    e.stopPropagation();
    addTaskDrawerRef?.current && addTaskDrawerRef?.current?.openDrawer(leadId);
  };

  const renderLeadDetail = (record) => {
    const interest =  record?.props?.interest
    const project = interest?.project
    if (project?.id) {
      return (
        <ListingDetailCompact showExternalLink {...record.props} isDashboard={isDashboard} interest={interest} />

      );
    }
    
    return record?.props?.id ? (
      <ListingDetailCompact showExternalLink {...record.props} isDashboard={isDashboard} />
    ) : (
      <Flex
        className="flex-col"
        style={{ lineHeight: 1, paddingInline: '8px', width: 'fit-content' }}
        onClick={(e) => e.stopPropagation()}
      >
        {t('No Interest Found')}
        <Button
          size="small"
          icon="FaSquarePlus"
          iconSize="1em"
          type="link"
          block
          onClick={onInterestClick(record)}
          style={{ justifyContent: 'start', padding: 0 }}
        >
          {t('Add Interest Manually')}
        </Button>
        {!!record?.props?.interests_count && (
          <MorePropertiesPopover
            title={`+ ${record?.props?.interests_count} ${t('more properties')}.`}
            count={record?.props?.interests_count}
            leadId={record?.props?.leadId}
            isDashboard={isDashboard}
          />
        )}
      </Flex>
    );
  };
  const renderSourceContent = (record) => {
    return (
      <SourceContent
        {...record.props}
        client_info={record?.props?.client_info}
        characterLimit={400}
        fontWeight="400"
        extra={
          record?.props?.callAnalysisScore && (
            <Tag
              color="#28B16D24"
              shape="round"
              style={{ lineHeight: '1.5em', paddingInline: '0.5em' }}
              onClick={(e) => {
                callAnalysisDetailDrawerRef.current.open({
                  clientInfo: record?.props?.client_info,
                  callAnalysisScore: record?.props?.callAnalysisScore,
                  recording_uuid: record?.props?.recording_uuid,
                  interestId: record?.props?.interestId,
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
                    record?.props?.callAnalysisScore?.total
                      ? `${record?.props?.callAnalysisScore?.obtained}/${record?.props?.callAnalysisScore?.total}`
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
    );
  };
  const getActionButtons = useCallback((contact) => {
    const leadId = contact?.leadId;

    return [
      {
        iconType: 'email',
        title: t('Email'),
        onClick: () => openExternal(contact?.email, 'email'),
        disabled: !contact?.email,
      },
      {
        iconType: 'phone',
        title: t('Call'),
        onClick: () => openExternal(contact?.phone, 'phone'),
        disabled: !contact?.phone,
      },
      {
        iconType: 'whatsapp',
        title: t('Whatsapp'),
        onClick: () => openExternal(contact?.whatsapp, 'whatsapp'),
        disabled: !contact?.whatsapp,
        iconColor: '#25D366',
        style: { color: '#25D366' },
      },
      {
        iconType: 'add-task',
        title: t('Add Task'),
        onClick: () => {
          addTaskClickEvent(PAGE_TYPES.LEAD_TABLE, leadId);
          addTaskDrawerRef?.current && addTaskDrawerRef?.current?.openDrawer(leadId);
        },
      },
    ];
  }, []);

  const leadsTableData = useMemo(() => {
    if (!leadsTable?.list) return null;
    const updatedList = leadsTable.list.map((lead) => {
      const contact = lead?.client_info;
      return {
        ...lead,
        actions: {
          ...lead.actions,
          actionsList: getActionButtons(contact),
        },
      };
    });

    const handleAddNameClick = (e, clientInfoProps) => {
      e?.stopPropagation();
      const leadId = clientInfoProps?.leadId
      if (leadId) {
        leadDetailClickEvent(user, isDashboard, leadId);
        detailDrawerRef?.current?.open(leadId, clientInfoProps);
      }
    };

    return {
      table: [
        { 
          title: t('Lead Details'), 
          dataIndex: 'client_info', 
          key: 'client_info', 
          component: 'LeadInfo',
          onAddNameClick: handleAddNameClick
        },
        {
          title: t('Last Interaction'),
          dataIndex: 'last_interaction',
          key: 'last_interaction',
          render: renderSourceContent,
        },
        {
          title: t('Interested in'),
          dataIndex: 'listing_detail',
          key: 'listing_detail',
          render: renderLeadDetail,
        },
        {
          title: t('Next Planned Task'),
          dataIndex: 'tasks_detail',
          key: 'tasks_detail',
          render: (tasks_detail, record) => {
            if (!tasks_detail?.props?.childTask) {
              const leadId = record?.client_info?.props?.leadId || record?.last_interaction?.leadId || record?.id;
              return (
                <div onClick={(e) => e?.stopPropagation()}>
                  <Button
                    size="small"
                    icon="FaSquarePlus"
                    iconSize="1em"
                    type="link"
                    onClick={(e) => {
                      e?.stopPropagation();
                      if (leadId) {
                        onAddTaskClick(leadId)(e);
                      }
                    }}
                    style={{
                      justifyContent: 'start',
                      padding: '8px 28px',
                      fontSize: '14px',
                      backgroundColor: '#F2FAFA',
                      border: '1px solid #CCDFE1',
                      borderRadius: '6px',
                    }}
                  >
                    {t('Add Task')}
                  </Button>
                </div>
              );
            }
            return <TaskDetail {...tasks_detail?.props} />;
          },
        },
        {
          title: t('Actions'),
          key: 'actions',
          dataIndex: 'actions',
          component: 'TableActions',
        },
      ],
      list: updatedList,
      pagination: leadsTable?.pagination,
    };
  }, [leadsTable]);

  return (
    <>
      {leadsManagementTour?.SHOW_TOUR && !isDashboard && !leadsTable?.loading && (
        <Tour steps={leadsManagementTour?.steps} onClose={leadsManagementTour?.onCloseTour} />
      )}

      {isMobile ? (
        <LeadListingsMobile
          showHeader={isDashboard}
          filtersList={filtersList}
          loading={loading || fetching}
          enableFilters={enableFilters}
          error={error}
          pagination={leadsTableData?.pagination}
          leadsData={leadsTableData}
          fetchFunction={fetchData}
          showPagination={enablePagination}
        />
      ) : (
        <>
          <ListingContainer
            listingContainerStyle={{ padding: '0px', ...listingContainerStyle }}
            titleFontSize={titleFontSize}
            id={tenantData.tourElementIds.leads_management_table}
            filtersList={filtersList}
            title={isDashboard ? t('Recent Leads') : ''}
            listingsData={leadsTableData}
            loading={loading || fetching}
            error={error}
            pagination={leadsTableData?.pagination}
            paginationOnBottom={enablePagination}
            onRow={(record, index) => {
              return {
                id: index === 0 ? tenantData.tourElementIds.leads_dashboard_first_row : '',
                onClick: () => {
                  leadDetailClickEvent(user, isDashboard, record?.client_info?.props?.leadId);
                  detailDrawerRef?.current?.open(record?.client_info?.props?.leadId, record?.client_info.props);
                },
                style: {
                  borderBottom: '1px solid #F0F0F0',
                  ...( !record?.client_info?.props?.isViewed ? { backgroundColor: tenantTheme['primary-light-4'] } : {} ),
                },
              };
            }}
            onRetry={fetchData}
            enableFilters={enableFilters}
            rowClassName="pointer"
            actionBtn={
              isDashboard && (
                <LinkWithIcon
                  id={tenantData.tourElementIds.leads_dashboard_view_all_link}
                  linkTitle={t('View All Leads')}
                  icon={<IconSwitch />}
                  link={tenantRoutes.app('', false, user).leads_management.path}
                  color={tenantTheme['primary-color']}
                  noUnderline={true}
                />
              )
            }
            intialFilterCount={filtersList?.length}
            renderFiltersExtra={() =>
              !isDashboard && (
                <Button
                  style={{ height: 42 }}
                  icon="FaSquarePlus"
                  iconSize="1em"
                  type="primaryOutlined"
                  onClick={onClickAddLead}
                >
                  {t('Add New Lead')}
                </Button>
              )
            }
          />
          <LeadDetailDrawer ref={detailDrawerRef} refetchLeadListings={fetchData} />
          <AddTaskDrawer ref={addTaskDrawerRef} onTaskAdded={fetchData} />
          <AddLeadDrawer ref={addLeadDrawerRef} onLeadAdded={fetchData} />
          <AddInterestDrawer ref={addInterestDrawerRef} onSuccess={fetchData} />
          <CallAnalysisDetailDrawer ref={callAnalysisDetailDrawerRef} />
        </>
      )}
    </>
  );
};

export default LeadListingsTable;
