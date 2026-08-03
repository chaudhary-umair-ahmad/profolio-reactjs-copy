import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Flex, Modal } from 'antd';
import { FiX } from 'react-icons/fi';
import DataTable from '../../../components/common/dataTable/dataTable';
import { getBadgeIcon } from './Utils';
import { BottomSheetDrawer } from '../../../components/common/drawerPopover/styled';
import { LeaderboardSkeleton } from './AgentPerformanceSkeleton';
import { useLazyGetTruBrokerLeaderboardDataQuery } from '../../../apis/user';
import {
  CardShell,
  LeaderboardCardHeader,
  LeaderboardTitle,
  ViewLeaderboardButton,
  CurrentUserCard,
  UserLeft,
  UserAvatar,
  UserName,
  UserPosition,
  UserPoints,
  LeaderboardTableWrapper,
  LeaderboardTableContent,
  LeaderboardFadeOverlay,
} from './styled';
import { getBaseURL } from '../../../utility/env';
import { InfoIconLeaderboard } from '../../../components/svg';
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

const formatRankWithSuffix = (rank) => {
  if (!rank) return null;
  const suffix = getRankSuffix(rank);
  return (
    <span style={{ display: 'inline-block', position: 'relative', lineHeight: 1 }}>
      {rank}
      <sup
        style={{
          fontSize: '8px',
          lineHeight: 0,
          position: 'relative',
          verticalAlign: 'baseline',
          top: '-0.3em',
        }}
      >
        {suffix}
      </sup>
    </span>
  );
};

const LeaderboardContent = ({
  currentUser,
  columns,
  tableData,
  t,
  isMobile,
  showUserCard = true,
  pagination = null,
  onPageChange = null,
  loading = false,
  tableStyle = {},
  isModal = false,
  locale = 'en',
  tableKey = null,
}) => {
  return (
    <>
      {currentUser && showUserCard && (
        <CurrentUserCard
          $isMobile={isMobile}
          style={isMobile && isModal ? { border: '1px solid #CCDFE1', borderRadius: '8px' } : {}}
        >
          <UserLeft>
            <UserAvatar $isMobile={isMobile}>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} />
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
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </UserAvatar>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <UserName>{locale === 'ar' && currentUser.name_l1 ? currentUser.name_l1 : currentUser.name}</UserName>
              <div style={{ fontSize: '12px', color: '#4F4F4F', fontWeight: 400 }}>
                {locale === 'ar' && currentUser.agency_l1 ? currentUser.agency_l1 : currentUser.agency}
              </div>
            </div>
          </UserLeft>
          <div style={{ textAlign: 'right' }}>
            <UserPosition>
              {currentUser.rank
                ? `${currentUser.rank}${getRankSuffix(currentUser.rank)} ${t('Position')}`
                : t('Not Ranked')}
            </UserPosition>
            <UserPoints>
              <span>{currentUser.truPoints}</span> {t('TruPoints™')}
            </UserPoints>
          </div>
        </CurrentUserCard>
      )}
      {isModal && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', marginTop: '16px' }}>
          <InfoIconLeaderboard size={isMobile ? '20px' : '16px'} />
          <div style={{ fontSize: '12px', color: '#4F4F4F', fontWeight: 600, marginLeft: '4px' }}>
            {t('Ranks are updated every Thursday, based on last 90 days data.')}
          </div>
        </div>
      )}

      <LeaderboardTableWrapper style={tableStyle?.height ? { height: tableStyle.height } : {}}>
        <LeaderboardTableContent
          style={{
            marginTop: showUserCard ? '12px' : '16px',
            ...(isMobile && isModal ? { border: '1px solid #E6E6E6', borderRadius: '8px' } : {}),
          }}
        >
          <DataTable
            key={`leaderboard-table-${tableKey}-${loading}`}
            tableStyle={{
              ...tableStyle,
              height: '560px',
              overflowY: isModal ? 'hidden' : 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="hide-scrollbar"
            columns={columns}
            data={tableData}
            showPagination={false}
            paginationOnBottom={pagination && onPageChange && pagination.total_pages > 1}
            pagination={
              pagination
                ? {
                    pageCount: isMobile ? 5 : 7,
                    totalCount: pagination.total_count,
                    current: pagination.current_page,
                    totalPages: pagination.total_pages,
                  }
                : null
            }
            noUrlPush
            fetchData={({ page }) => onPageChange(page)}
            pageSize={isMobile ? 5 : 7}
            loading={loading}
            onRow={() => ({
              style: {
                borderBottom: '1px solid #f0f0f0',
              },
            })}
            emptyState={{
              title: t('No rankings available'),
              subtitle: '',
            }}
          />
        </LeaderboardTableContent>
        {!pagination && <LeaderboardFadeOverlay />}
      </LeaderboardTableWrapper>
    </>
  );
};

const Leaderboard = ({
  items = [],
  currentUser = null,
  t,
  onViewLeaderboard,
  isMobile = false,
  modalVisible: externalModalVisible,
  onModalClose,
  loading = false,
  getLeaderboardData,
  isModal = false,
}) => {
  const [internalModalVisible, setInternalModalVisible] = useState(false);
  const modalVisible = externalModalVisible !== undefined ? externalModalVisible : internalModalVisible;
  const setModalVisible = externalModalVisible !== undefined ? onModalClose || (() => {}) : setInternalModalVisible;
  const bottomSheetRef = useRef();
  const [modalPage, setModalPage] = useState(1);
  const [modalData, setModalData] = useState([]);
  const [modalPagination, setModalPagination] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const locale = useSelector((state) => state.app.AppConfig.locale);

  const [getModalLeaderboardData] = useLazyGetTruBrokerLeaderboardDataQuery();

  useEffect(() => {
    if (modalVisible) {
      setModalLoading(true);
      const perPage = isMobile ? 5 : 7;
      getModalLeaderboardData({ page: modalPage, per_page: perPage })
        .unwrap()
        .then((response) => {
          if (response?.list) {
            const formattedItems = response.list.map((item) => {
              const badges = [];
              if (item.is_tru_broker) badges.push('TruBroker');
              if (item.is_quality_lister) badges.push('Quality Lister');
              if (item.is_responsive_broker) badges.push('Responsive Broker');
              if (item.is_super_lister) badges.push('Super Lister');

              return {
                rank: item?.rank,
                name: item?.name,
                name_l1: item?.name_l1,
                avatar: item?.profile_image || null,
                badges: badges,
                truPoints: item.score,
              };
            });
            setModalData(formattedItems);
            setModalPagination(response.pagination);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch leaderboard data:', error);
        })
        .finally(() => {
          setModalLoading(false);
        });
    }
  }, [modalVisible, modalPage, getModalLeaderboardData, isMobile]);

  useEffect(() => {
    if (!modalVisible) {
      setModalPage(1);
      setModalData([]);
      setModalPagination(null);
    }
  }, [modalVisible]);

  useEffect(() => {
    if (isMobile && modalVisible && bottomSheetRef.current) {
      bottomSheetRef.current.openDrawer();
    } else if (isMobile && !modalVisible && bottomSheetRef.current && bottomSheetRef.current.isOpen()) {
      bottomSheetRef.current.closeDrawer();
    }
  }, [modalVisible, isMobile]);

  const handlePageChange = (page) => {
    setModalPage(page);
  };

  const columns = useMemo(() => {
    if (isMobile) {
      return [
        {
          title: () => <span style={{ paddingLeft: '16px' }}>{t('Agent')}</span>,
          dataIndex: 'name',
          key: 'agent',
          width: 300,
          ellipsis: true,
          align: 'left',
          render: (name, record) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                maxWidth: '300px',
                marginLeft: isModal ? '0px' : '10px',
              }}
            >
              <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {record.avatar ? (
                    <img
                      src={record.avatar?.sizes?.thumbnail ? record.avatar.sizes.thumbnail : `${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
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
                        fontSize: '18px',
                        fontWeight: '600',
                      }}
                    >
                      {name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                {record.rank && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '37px',
                      left: '10px',
                      minWidth: '22px',
                      height: '15px',
                      background: '#FFFFFF',
                      color: '#000000',
                      borderRadius: '20px',
                      paddingTop: '4px',
                      paddingRight: '6px',
                      paddingBottom: '4px',
                      paddingLeft: '6px',
                      boxShadow: '0px 4px 12px 0px #CBCBCB',
                      fontSize: '10px',
                      fontWeight: 700,
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatRankWithSuffix(record.rank)}
                  </div>
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '7px',
                  minWidth: 0,
                  marginTop: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#222222',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    lineHeight: '1.2',
                  }}
                >
                  {locale === 'ar' && record.name_l1 ? record.name_l1 : name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  {(record.badges || []).length > 0 ? (
                    (record.badges || []).map((badge, badgeIdx) => (
                      <span key={badgeIdx} title={badge}>
                        {getBadgeIcon(badge)}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '12px', color: '#8c8c8c' }}>-</span>
                  )}
                </div>
              </div>
            </div>
          ),
        },
        {
          title: t('TruPoints™'),
          dataIndex: 'truPoints',
          key: 'truPoints',
          align: 'left',
          render: (truPoints) => (
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#222222' }}>{truPoints || '-'}</div>
          ),
        },
      ];
    }

    return [
      {
        title: t('Position'),
        dataIndex: 'rank',
        key: 'rank',
        width: 100,
        render: (rank) => <div>{rank ? `${rank}${getRankSuffix(rank)}` : '-'}</div>,
      },
      {
        title: t('TruBroker'),
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => (
          <Flex align="center" gap={10}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {record.avatar ? (
                <img
                  src={record.avatar?.sizes?.thumbnail ? record.avatar.sizes.thumbnail : `${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
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
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div style={{ maxWidth: '270px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {locale === 'ar' && record.name_l1 ? record.name_l1 : record.name}
            </div>
          </Flex>
        ),
      },
      {
        title: t('Badges'),
        dataIndex: 'badges',
        key: 'badges',
        width: 150,
        render: (badges) => {
          return (
            <Flex align="center" gap={4}>
              {(badges || []).length > 0 ? (
                (badges || []).map((badge, badgeIdx) => (
                  <span key={badgeIdx} title={badge}>
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
        title: t('TruPoints'),
        dataIndex: 'truPoints',
        key: 'truPoints',
        width: 100,
        align: 'right',
        render: (truPoints) => truPoints,
      },
    ];
  }, [t, isMobile]);

  const tableData = useMemo(() => {
    const data = (items || []).map((item, idx) => ({
      ...item,
      key: item.rank || idx,
    }));
    return data;
  }, [items]);

  const modalTableData = useMemo(() => {
    const data = (modalData || []).map((item, idx) => ({
      ...item,
      key: item.rank || idx,
    }));
    return data;
  }, [modalData]);

  if (loading && items.length === 0) {
    return <LeaderboardSkeleton isMobile={isMobile} />;
  }

  if (isModal) {
    return isMobile ? (
      <BottomSheetDrawer
        ref={bottomSheetRef}
        rootClassName="bottom-sheet"
        placement="bottom"
        onCloseDrawer={() => setModalVisible(false)}
        className="drawer-container"
        height="90vh"
        title={t('Leaderboard')}
        bodyStyle={{ padding: 0 }}
        footer={null}
      >
        <div style={{ padding: '20px 16px' }}>
          <LeaderboardContent
            currentUser={currentUser}
            columns={columns}
            tableData={modalTableData}
            t={t}
            isMobile={isMobile}
            isModal={isModal}
            showUserCard={true}
            pagination={modalPagination}
            onPageChange={handlePageChange}
            loading={modalLoading}
            locale={locale}
            tableKey={`leaderboard-modal-${modalPage}`}
          />
        </div>
      </BottomSheetDrawer>
    ) : (
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        centered
        title={null}
        closable={false}
        styles={{
          header: { display: 'none' },
          body: { padding: 0 },
          content: {
            padding: '0px',
            paddingTop: '20px',
            paddingBottom: '20px',
            borderRadius: 12,
            overflow: 'hidden',
          },
        }}
      >
        <LeaderboardCardHeader
          $isMobile={isMobile}
          style={{ marginBottom: '20px', paddingLeft: '24px', paddingRight: '24px' }}
        >
          <LeaderboardTitle $isMobile={isMobile}>
            {t('TruBroker')}
            <span style={{ fontWeight: 500 }}>{t('™')}</span> {t('Leaderboard')}
          </LeaderboardTitle>
          <div style={{ cursor: 'pointer' }} onClick={() => setModalVisible(false)}>
            <FiX size={20} color="#A3A3A3" />
          </div>
        </LeaderboardCardHeader>
        <div style={{ borderBottom: '1px solid #f0f0f0' }} />

        <div
          style={{
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '20px',
            height: '780px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <LeaderboardContent
            currentUser={currentUser}
            columns={columns}
            tableData={modalTableData}
            t={t}
            isMobile={isMobile}
            showUserCard={true}
            pagination={modalPagination}
            onPageChange={handlePageChange}
            loading={modalLoading}
            tableStyle={{ height: '100%', overflowY: 'hidden' }}
            isModal={true}
            locale={locale}
            tableKey={`leaderboard-modal-${modalPage}`}
          />
        </div>
      </Modal>
    );
  }

  return (
    <CardShell
      $isMobile={isMobile}
      style={{
        height: '576px',
        maxHeight: '576px',
        padding: isMobile ? '0px' : '2px 16px 16px 16px',
        paddingTop: isMobile ? '10px' : '2px',
      }}
    >
      <LeaderboardCardHeader $isMobile={isMobile} style={isMobile ? { padding: '2px 16px 0px 16px' } : {}}>
        <LeaderboardTitle $isMobile={isMobile}>
          <span style={{ fontWeight: 500 }}>{t('Tru')}</span>
          {t('Broker')}
          <span style={{ fontWeight: 500 }}>{t('™')}</span> {t('Leaderboard')}
        </LeaderboardTitle>
        <ViewLeaderboardButton
          href="#"
          $isMobile={isMobile}
          onClick={(e) => {
            e.preventDefault();
            setModalVisible(true);
            if (onViewLeaderboard) onViewLeaderboard();
          }}
        >
          {t('View Leaderboard')}
        </ViewLeaderboardButton>
      </LeaderboardCardHeader>

      <LeaderboardContent
        tableStyle={{
          height: '420px',
          overflowY: 'hidden',
          borderBottom: 'none',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
        currentUser={currentUser}
        columns={columns}
        tableData={tableData}
        t={t}
        isMobile={isMobile}
        showUserCard={true}
        loading={loading}
        locale={locale}
      />
    </CardShell>
  );
};

export default Leaderboard;
