import React, { useMemo, useState } from 'react';
import { Flex, Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import DataTable from '../../../components/common/dataTable/dataTable';
import { getBadgeIcon, getBadgeIconTeamPerformance } from './Utils';
import { TextWithIcon, Select } from '../../../components/common';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import tenantTheme from '@theme';
import RenderTextLtr from '../../../components/render-text/render-text';
import { TeamPerformanceTableSkeleton } from './AgentPerformanceSkeleton';
import { RankIcon, ScoreIcon, ScoreTrupoints, TruPointsTeamsIcon } from '../../../components/svg';
import { useSelector } from 'react-redux';

const getRankSuffix = (rank) => {
  if (!rank) return '';
  const j = rank % 10;
  const k = rank % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

const formatTeamPerformanceData = (teamPerformanceData) => {
  if (!teamPerformanceData?.team_performance || !Array.isArray(teamPerformanceData.team_performance)) {
    return [];
  }

  return teamPerformanceData.team_performance.map((item) => {
    const badges = [];
    if (item.is_tru_broker) badges.push('TruBroker');
    if (item.badges?.active && Array.isArray(item.badges.active)) {
      item.badges.active.forEach((badge) => {
        if (badge) {
          let badgeName = badge;
          if (typeof badge === 'object') {
            badgeName = badge.name || badge.slug || badge;
          }
          if (badgeName && !badges.includes(badgeName)) {
            badges.push(badgeName);
          }
        }
      });
    }

    return {
      key: item.id,
      id: item.id,
      name: item.name,
      name_l1: item.name_l1,
      email: item.email,
      mobile: item.mobile,
      profile_image: item.profile_image,
      badges: badges,
      rank: item.rank,
      tru_points: item.tru_points,
      image_score: item.quality_core?.image_score,
      feature_score: item.quality_core?.feature_score,
      whatsapp_response_rate: item.responsiveness?.whatsapp_response_rate,
      call_response_rate: item.responsiveness?.call_response_rate,
      active_listings_count: item.total_active_listings?.active_listing_count || 0,
    };
  });
};

const TeamPerformanceTable = ({
  teamPerformanceData,
  isMobile = false,
  onFilterChange,
  loading = false,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const [selectedBadges, setSelectedBadges] = useState([]);
  const locale = useSelector((state) => state.app.AppConfig.locale);


  const tableData = useMemo(() => {
    return formatTeamPerformanceData(teamPerformanceData);
  }, [teamPerformanceData]);

  const badgeOptions = [
    { title: t('TruBroker'), value: 'tru_broker' },
    { title: t('Quality Lister'), value: 'quality_lister' },
    { title: t('Responsive Broker'), value: 'responsive_broker' },
    { title: t('Super Lister'), value: 'super_lister' },
  ];

  const handleBadgeFilterChange = (value) => {
    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
    setSelectedBadges(selectedValues);
    if (onFilterChange) {
      onFilterChange(selectedValues);
    }
  };

  const columns = useMemo(() => {
    return [
      {
        title: t('Staff'),
        dataIndex: 'name',
        key: 'staff',
        width: isMobile ? 200 : 280,
        fixed: 'left',
        render: (name, record) => (
          <Flex gap={10} align="center">
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              {record.profile_image ? (
                <img
                  src={record.profile_image}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0e8073',
                    color: '#fff',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: '600',
                  }}
                >
                  {name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <Flex vertical>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#222222' }}>{locale === 'ar' ? record.name_l1 : record.name || record.name}</div>
              {record.email && (
                <TextWithIcon
                  icon="MdMail"
                  iconProps={{ size: '12px', color: tenantTheme.gray500 }}
                  textColor={'#767676'}
                  value={record.email}
                  fontWeight={400}
                  textSize="12px"
                />
              )}
              {record.mobile && (
                <TextWithIcon
                  icon="MdPhone"
                  iconProps={{ size: '12px', color: tenantTheme.gray500 }}
                  textColor={'#767676'}
                  value={<RenderTextLtr text={record.mobile} />}
                  textSize="12px"
                  fontWeight={400}
                />
              )}
            </Flex>
          </Flex>
        ),
      },
      {
        title: t('Badges'),
        dataIndex: 'badges',
        key: 'badges',
        width: isMobile ? 100 : 150,
        render: (badges) => {
          return (
            <Flex align="center" gap={4}>
              {(badges || []).length > 0 ? (
                (badges || []).map((badge, badgeIdx) => (
                  <span key={badgeIdx}>
                    {getBadgeIcon(badge)}
                  </span>
                ))
              ) : (
                <span>-</span>
              )}
            </Flex>
          );
        },
      },
      {
        title: t('Rank & TruPoints™'),
        dataIndex: 'rank',
        key: 'rank_trupoints',
        width: isMobile ? 140 : 180,
        render: (rank, record) => (
          <Flex vertical gap={4}>
            <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#222222' ,   gap: '6px', display: 'flex', alignItems: 'center', }}>
            {rank && <RankIcon />}
              {rank ? `${rank}${getRankSuffix(rank)}` : '-'}
             
            </div>
            <div
              style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#222222',
                gap: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ScoreTrupoints />
              {record.tru_points}
            </div>
          </Flex>
        ),
      },
      {
        title: t('Quality Score'),
        dataIndex: 'quality_core',
        key: 'quality_score',
        width: isMobile ? 150 : 200,
        render: (_, record) => (
          <Flex vertical gap={4}>
            <div style={{ fontSize: isMobile ? '12px' : '14px', display: 'flex', gap: '6px' }}>
              <span style={{ color: tenantTheme.gray700 }}>{t('Image Score')}</span>
              <span style={{ fontWeight: 700 }}>{record.image_score?.toFixed(2)}%</span>
            </div>
            <div style={{ fontSize: isMobile ? '12px' : '14px', display: 'flex', gap: '6px' }}>
              <span style={{ color: tenantTheme.gray700 }}>{t('Features Score')}</span>
              <span style={{ fontWeight: 700 }}>{record.feature_score?.toFixed(2)}%</span>
            </div>
          </Flex>
        ),
      },
      {
        title: t('Responsiveness'),
        dataIndex: 'responsiveness',
        key: 'responsiveness',
        width: isMobile ? 150 : 200,
        render: (_, record) => (
          <Flex vertical gap={4}>
            <div style={{ fontSize: isMobile ? '12px' : '14px', display: 'flex', gap: '6px' }}>
              <span style={{ color: tenantTheme.gray700 }}>{t('Call')}</span>
              <span style={{ fontWeight: 700 }}>{record.call_response_rate?.toFixed(0)}%</span>
            </div>
            <div style={{ fontSize: isMobile ? '12px' : '14px', display: 'flex', gap: '6px' }}>
              <span style={{ color: tenantTheme.gray700 }}>{t('WhatsApp')}</span>
              <span style={{ fontWeight: 700 }}>{record.whatsapp_response_rate?.toFixed(0)}%</span>
            </div>
          </Flex>
        ),
      },
      {
        title: t('Active Listings'),
        dataIndex: 'active_listings_count',
        key: 'active_listings',
        width: isMobile ? 120 : 150,
        align: 'center',
        render: (count) => <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 600 }}>{count}</div>,
      },
    ];
  }, [t, isMobile]);

  if (loading && !teamPerformanceData) {
    return <TeamPerformanceTableSkeleton isMobile={isMobile} />;
  }

  if (!teamPerformanceData?.team_performance) {
    return null;
  }

  const MobileCardView = ({ record, index }) => {
    const metricsCards = [
      {
        title: t('Rank'),
        value: record.rank ? `${record?.rank}${getRankSuffix(record.rank)}` : t('Not Ranked'),
        icon: <RankIcon />,
        valueFontSize: '14px',
        valueFontWeight: 600,
        showIconInValue: true,
      },
      {
        title: t('TruPoints'),
        value: record?.tru_points,
        icon: <TruPointsTeamsIcon />,
        valueFontSize: '14px',
        valueFontWeight: 600,
        showIconInValue: true,
      },
      {
        title: t('Image Score'),
        value: `${record?.image_score?.toFixed(2)}%`,
        valueFontSize: '14px',
        valueFontWeight: 700,
        showIconInValue: false,
      },
      {
        title: t('Features Score'),
        value: `${record?.feature_score?.toFixed(2)}%`,
        valueFontSize: '14px',
        valueFontWeight: 700,
        showIconInValue: false,
      },
      {
        title: t('Call'),
        value: `${record?.call_response_rate?.toFixed(0)}%`,
        valueFontSize: '14px',
        valueFontWeight: 700,
        showIconInValue: false,
      },
      {
        title: t('WhatsApp'),
        value: `${record?.whatsapp_response_rate?.toFixed(0)}%`,
        valueFontSize: '14px',
        valueFontWeight: 700,
        showIconInValue: false,
      },
      {
        title: t('Active Listings'),
        value: record?.active_listings_count || 0,
        valueFontSize: '14px',
        valueFontWeight: 700,
        showIconInValue: false,
      },
    ];

    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          height: '300px',
          width: '375px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          borderBottom: index !== tableData.length - 1 ? '1px solid #f0f0f0' : 'none',
        }}
      >
        <Flex gap={12} align="space-between" style={{ width: '100%' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              overflow: 'hidden',
              flexShrink: 0,
              borderRadius: '8px',
            }}
          >
            {record.profile_image ? (
              <img
                src={record.profile_image}
                alt={record.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0e8073',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: '700',
                }}
              >
                {record.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <Flex vertical style={{ flex: 1, minWidth: 0, justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#222222' }}>{record.name}</div>
            {record.email && (
              <TextWithIcon
                icon="MdMail"
                iconProps={{ size: '11px', color: tenantTheme.gray500 }}
                textColor={'#767676'}
                value={record.email}
                textSize="11px"
              />
            )}
            {record.mobile && (
              <TextWithIcon
                icon="MdPhone"
                iconProps={{ size: '11px', color: tenantTheme.gray500 }}
                textColor={'#767676'}
                value={<RenderTextLtr text={record.mobile} />}
                textSize="11px"
              />
            )}
          </Flex>
        </Flex>

        <div>
          <Flex align="center" gap={8} wrap="wrap">
            {(record.badges || []).length > 0 ? (
              (record.badges || []).map((badge, badgeIdx) => (
                <span key={badgeIdx}>
                  {getBadgeIconTeamPerformance(badge)}
                </span>
              ))
            ) : (
              <span style={{ color: tenantTheme.gray500, fontSize: '14px' }}>-</span>
            )}
          </Flex>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {metricsCards.map((metric, index) => (
            <div
              key={index}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '13px', color: '#626262' }}>{metric.title}</div>
              {metric.icon && metric.showIconInValue && (
                <div
                  style={{
                    fontSize: metric.valueFontSize,
                    fontWeight: metric.valueFontWeight,
                    color: '#222222',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {metric.value}
                  <span style={{ marginLeft: '4px'}}>{metric.icon}</span>
                </div>
              )}
              {(!metric.icon || !metric.showIconInValue) && (
                <>
                  {metric.icon && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                      }}
                    >
                      {metric.icon}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: metric.valueFontSize,
                      fontWeight: metric.valueFontWeight,
                      color: '#222222',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: metric.icon ? '20px' : '0',
                    }}
                  >
                    {metric.value}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: isMobile ? '12px' : '16px',
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        style={{
          marginBottom: isMobile ? '12px' : '16px',
          padding: isMobile ? '0' : '0',
          flexDirection: 'row',
          gap: isMobile ? '12px' : '16px',
          width: '100%',
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: isMobile ? 700 : 600,
            margin: 0,
            color: '#222222',
            fontWeight: 700,
            width: '60%',
          }}
        >
          {t("Your Team's Performance ")}
        </h3>
        <div style={{ minWidth: isMobile ? '40%' : '250px', width: isMobile ? '40%' : 'auto' }}>
          <Select
            mode="multiple"
            placeholder={t('Filter by Badges')}
            value={selectedBadges}
            onChange={handleBadgeFilterChange}
            options={badgeOptions}
            getOptionValue={(item) => item?.value}
            getOptionLabel={(item) => item?.title}
            allowClear
            style={{ width: '100%' }}
            maxTagCount="responsive"
            mobileCompactHeight={isMobile}
          />
        </div>
      </Flex>

      {isMobile ? (
        <>
          {loading ? (
            <TeamPerformanceTableSkeleton isMobile={isMobile} />
          ) : tableData.length === 0 ? (
            <EmptyState type="table" hideRetryButton />
          ) : (
            <>
              {tableData.map((record, index) => (
                <MobileCardView key={record.key} index={index} record={record} />
              ))}
              {teamPerformanceData?.pagination && teamPerformanceData.pagination.total_pages > 1 && onPageChange && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                  <Pagination
                    current={teamPerformanceData.pagination.current_page}
                    total={teamPerformanceData.pagination.total_count}
                    pageSize={5}
                    onChange={onPageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          loading={loading}
          showPagination={false}
          paginationOnBottom={
            teamPerformanceData?.pagination && onPageChange && teamPerformanceData.pagination.total_pages > 1
          }
          pagination={
            teamPerformanceData?.pagination
              ? {
                  pageCount: 5,
                  totalCount: teamPerformanceData.pagination.total_count,
                  current: teamPerformanceData.pagination.current_page,
                  totalPages: teamPerformanceData.pagination.total_pages,
                }
              : null
          }
          noUrlPush
          fetchData={({ page }) => onPageChange && onPageChange(page)}
          pageSize={5}
          tableClass="team-performance-table"
        />
      )}
    </div>
  );
};

export default TeamPerformanceTable;
