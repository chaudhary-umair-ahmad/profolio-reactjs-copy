import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from 'antd';
import { FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Drawer } from '../../../components/common';
import AgentActivity from './AgentActivity';
import { DrawerHeader, DrawerContent, DrawerContentWrapper, DrawerFadeOverlay } from './styled';
import { InfoIconLeaderboard } from '../../../components/svg';
import { useLazyGetTruPointsActivityLogsDataQuery } from '../../../apis/user';
import { formattedActivityData } from './Utils';
import Spinner from '../../../components/common/spinner/spinner';

const ActivityDrawer = ({ visible, onClose, activities = [], t, isMobile = false, onHowToEarnClick }) => {
  const activityDrawerRef = useRef();
  const scrollContainerRef = useRef(null);
  const [allActivities, setAllActivities] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [getTruPointsActivityLogsData, { isLoading: activityLoading }] = useLazyGetTruPointsActivityLogsDataQuery();
  const user = useSelector((state) => state.app?.loginUser?.user);

  useEffect(() => {
    if (visible && activityDrawerRef.current) {
      activityDrawerRef.current.openDrawer();
    } else if (!visible && activityDrawerRef.current && activityDrawerRef.current.isOpen()) {
      activityDrawerRef.current.closeDrawer();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setAllActivities([]);
      setPagination(null);
      setIsLoadingMore(false);
    }
  }, [visible]);

  const fetchActivities = useCallback(
    async (page, append = false) => {
      setIsLoadingMore(true);

      try {
        const response = await getTruPointsActivityLogsData({
          page,
          userId: user?.id,
          per_page: 20,
        }).unwrap();

        if (response) {
          const formatted = formattedActivityData(response);
          setAllActivities((prev) => (append ? [...prev, ...formatted] : formatted));
          setPagination(response.pagination);
        }
      } catch (error) {
      } finally {
        setIsLoadingMore(false);
      }
    },
    [user?.id, getTruPointsActivityLogsData],
  );

  useEffect(() => {
    if (visible && user?.id && allActivities.length === 0 && !isLoadingMore) {
      fetchActivities(1, false);
    }
  }, [visible, user?.id, allActivities.length, isLoadingMore, fetchActivities]);

  const handleScroll = useCallback(
    (e) => {
      const target = e.currentTarget || e.target || scrollContainerRef.current;
      if (!target) return;

      const { scrollTop, scrollHeight, clientHeight } = target;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isNearBottom = distanceFromBottom < 200;

      if (isNearBottom && pagination?.next_page && !isLoadingMore && !activityLoading) {
        fetchActivities(pagination.next_page, true);
      }
    },
    [pagination, isLoadingMore, activityLoading, fetchActivities],
  );

  return (
    <Drawer
      ref={activityDrawerRef}
      width={isMobile ? '100%' : 600}
      title={null}
      footer={null}
      onCloseDrawer={onClose}
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
      headerStyle={{ display: 'none' }}
    >
      <DrawerHeader
        $isMobile={isMobile}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1F1F1F' }}>{t('TruPoints Activity')}</p>
        <button
          onClick={onClose}
          aria-label={t('Close')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiX size={20} color="#A3A3A3" />
        </button>
      </DrawerHeader>

      <div
        style={{
          padding: '20px 20px 0px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <InfoIconLeaderboard />
        <span style={{ fontSize: '12px', color: '#4F4F4F', fontWeight: 600 }}>
          {t('This data is based on the last 90 days.')}
        </span>
      </div>

      <DrawerContentWrapper>
        <DrawerContent $isMobile={isMobile}>
          <AgentActivity
            activities={allActivities.length > 0 ? allActivities : activities}
            t={t}
            isMobile={isMobile}
            onHowToEarnClick={onHowToEarnClick}
            hideHeaderButton={true}
            showAllActivities={true}
            isInsideDrawer={true}
            loading={activityLoading && allActivities.length === 0}
            scrollRef={scrollContainerRef}
            onScroll={handleScroll}
          />
          {isLoadingMore && allActivities.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <Spinner size="small" />
            </div>
          )}
        </DrawerContent>
        {!pagination || !pagination.next_page ? <DrawerFadeOverlay /> : null}
      </DrawerContentWrapper>

      <div
        style={{
          width: '100%',
          padding: '20px',
          paddingTop: '0px',
        }}
      >
        <Button
          size="large"
          block
          onClick={() => {
            if (onHowToEarnClick) {
              onHowToEarnClick();
            }
          }}
          style={{
            height: '48px',
            fontSize: '14px',
            fontWeight: 700,
            borderRadius: '8px',
            backgroundColor: '#F2FAFA',
            borderColor: '#CCDFE1',
            color: '#006169',
          }}
        >
          {t('How to Earn TruPoints™')}
        </Button>
      </div>
    </Drawer>
  );
};

export default ActivityDrawer;
