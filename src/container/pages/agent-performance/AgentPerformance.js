import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TenantComponents from '@components';
import AgentProfileCard from './AgentProfileCard';
import TruBroker from './TruBroker';
import { BadgesData, formattedActivityData, formattedTruPointsData, hexToRgba, leaderboardItems } from './Utils';
import { useTranslation } from 'react-i18next';
import AgentBages from './AgentBages';
import { useGetUserBadgesCriteriaQuery } from '../../../apis/lms';
import {
  useLazyGetTruBrokerLeaderboardDataQuery,
  useLazyGetTruPointsActivityLogsDataQuery,
  useLazyGetTruPointsCriteriaDataQuery,
  useLazyGetTeamPerformanceDataQuery,
} from '../../../apis/user';
import Leaderboard from './LeaderBoard';
import AgentActivity from './AgentActivity';
import TruPoints from './TruPoints';
import AgentBagesInfo from './AgentBagesInfo';
import TeamPerformanceTable from './TeamPerformanceTable';
import ActivityDrawer from './ActivityDrawer';
import { useLeadsDashboardData } from '../../../hooks';
import {
  AgentProfileCardSkeleton,
  TruBrokerSkeleton,
  AgentBadgeSkeleton,
  LeaderboardSkeleton,
  AgentActivitySkeleton,
  TeamPerformanceTableSkeleton,
} from './AgentPerformanceSkeleton';

const AgentPerformance = () => {
  const user = useSelector((state) => state.app?.loginUser?.user);
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const { IS_AGENCY } = useLeadsDashboardData();
  const { t } = useTranslation();
  const [truPointsModalVisible, setTruPointsModalVisible] = useState(false);
  const [leaderboardModalVisible, setLeaderboardModalVisible] = useState(false);
  const [badgesInfoModalVisible, setBadgesInfoModalVisible] = useState(false);
  const [activityDrawerVisible, setActivityDrawerVisible] = useState(false);
  const { data: badgesCriteriaData } = useGetUserBadgesCriteriaQuery();

  const [getLeaderboardData, { data: leaderboardData, isLoading: leaderboardLoading }] =
    useLazyGetTruBrokerLeaderboardDataQuery();
  const [getTruPointsCriteriaData, { data: truPointsCriteriaData }] = useLazyGetTruPointsCriteriaDataQuery();
  const [getTruPointsActivityLogsData, { data: truPointsActivityLogsData, isLoading: activityLoading }] =
    useLazyGetTruPointsActivityLogsDataQuery();
  const [getTeamPerformanceData, { data: teamPerformanceData, isLoading: teamPerformanceLoading }] =
    useLazyGetTeamPerformanceDataQuery();
  const [badgeFilters, setBadgeFilters] = useState([]);
  const [teamPerformancePage, setTeamPerformancePage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const badgeCongratsModalRef = useRef();
  const badgeQueueRef = useRef([]);
  const hasInitializedBadgesRef = useRef(false);

  useEffect(() => {
    getLeaderboardData({ page: 1, per_page: 10 });
    getTruPointsCriteriaData();
    getTruPointsActivityLogsData({ page: 1, userId: user?.id });
  }, [getLeaderboardData, getTruPointsCriteriaData, getTruPointsActivityLogsData]);

  useEffect(() => {
    if (user && badgesCriteriaData) {
      setInitialLoading(false);
    }
  }, [user, badgesCriteriaData]);

  const buildTeamPerformanceQuery = (badges, page = 1) => {
    const params = [];
    if (badges && badges.length > 0) {
      badges.forEach((badge) => params.push(`badge[]=${encodeURIComponent(badge)}`));
    }
    params.push(`page=${page}`);
    // Some backends use `per_page` instead of `limit`; send both for compatibility.
    params.push(`per_page=5`);
    return params.join('&');
  };

  useEffect(() => {
    const queryParams = buildTeamPerformanceQuery(badgeFilters, teamPerformancePage);
    getTeamPerformanceData(queryParams);
  }, [badgeFilters, teamPerformancePage, getTeamPerformanceData]);

  useEffect(() => {
    setTeamPerformancePage(1);
  }, [badgeFilters]);

  const handleTeamPerformancePageChange = (page) => {
    setTeamPerformancePage(page);
  };


  const handleModalClose = React.useCallback(() => {
    if (badgeQueueRef.current.length > 0) {
      const nextBadge = badgeQueueRef.current.shift();
      badgeCongratsModalRef?.current?.showModal(nextBadge.type);
      localStorage.setItem(nextBadge.key, JSON.stringify(true));
    }
  }, []);

  useEffect(() => {
    if (!user?.id || !badgeCongratsModalRef?.current || hasInitializedBadgesRef.current) return;

    const badges = [
      {
        type: 'isQualityLister',
        hasBadge: user?.is_quality_lister,
        key: `qualityListerShown_${user?.id}`,
      },
      {
        type: 'isResponsiveBroker',
        hasBadge: user?.is_responsive_broker,
        key: `responsiveBrokerShown_${user?.id}`,
      },
      {
        type: 'isSuperLister',
        hasBadge: user?.is_super_lister,
        key: `superListerShown_${user?.id}`,
      },
      {
        type: 'isTruBroker',
        hasBadge: user?.is_tru_broker,
        key: `truBrokerShown_${user?.id}`,
      },
    ];

    const badgesToShow = badges.filter(
      (badge) => badge.hasBadge && JSON.parse(localStorage.getItem(badge.key)) !== true,
    );

    if (badgesToShow.length > 0) {
      badgeQueueRef.current = badgesToShow;
      hasInitializedBadgesRef.current = true;

      const firstBadge = badgeQueueRef.current.shift();
      badgeCongratsModalRef.current.showModal(firstBadge.type);
      localStorage.setItem(firstBadge.key, JSON.stringify(true));
    }
  }, [user]);
  const currentUser = React.useMemo(() => {
    if (!user) return null;

    return {
      name: user?.name,
      name_l1: user?.name_l1,
      agency: user?.agency?.name,
      agency_l1: user?.agency?.name_l1,
      rank: user?.rank,
      truPoints: user?.score,
      avatar: user?.profile_image?.[0]?.gallerythumb || user?.profile_image,
    };
  }, [user]);

  const name = user?.name;
  const avatar = user?.profile_image?.[0]?.gallerythumb;
  const email = user?.email;
  const phone = user?.phone_number;
  const isTruBroker = user?.is_tru_broker;
  const rank = user?.rank;
  const score = user?.score;

  const userData = {
    name,
    avatar,
    email,
    phone,
    isTruBroker,
    rank,
    score,
    ...user,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        paddingLeft: isMobile ? '0' : '12px',
        paddingRight: isMobile ? '0' : '12px',
        overflow: 'hidden',
        gap: isMobile ? '8px' : '12px',
      }}
    >
      {initialLoading ? (
        <AgentProfileCardSkeleton isMobile={isMobile} />
      ) : (
        <AgentProfileCard
          user={userData}
          rank={rank}
          truPoints={score}
          publicProfileUrl={''}
          onLeaderboardClick={() => setLeaderboardModalVisible(true)}
          onActivityClick={() => setActivityDrawerVisible(true)}
        />
      )}

      {initialLoading ? <TruBrokerSkeleton isMobile={isMobile} /> : <TruBroker userData={userData} />}

      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '8px' : '12px',
        }}
      >
        {initialLoading
          ? [1, 2, 3].map((i) => <AgentBadgeSkeleton key={i} isMobile={isMobile} />)
          : BadgesData(badgesCriteriaData, userData).map((badge, i, arr) => (
              <AgentBages
                key={i}
                badge={badge}
                isMobile={isMobile}
                t={t}
                onLearnMoreClick={() => setBadgesInfoModalVisible(true)}
                hexToRgba={hexToRgba}
                user={userData}
                isLast={i === arr?.length - 1}
              />
            ))}
      </div>
      {!IS_AGENCY && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '8px' : '12px',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{ flex: isMobile ? 'unset' : 1, width: isMobile ? '100%' : 'auto', minWidth: 0, display: 'flex' }}
          >
            {leaderboardLoading && !leaderboardData ? (
              <LeaderboardSkeleton isMobile={isMobile} />
            ) : (
              <Leaderboard
                items={leaderboardItems(leaderboardData)?.items || []}
                currentUser={currentUser}
                t={t}
                isMobile={isMobile}
                onViewLeaderboard={() => setLeaderboardModalVisible(true)}
                modalVisible={leaderboardModalVisible}
                onModalClose={() => setLeaderboardModalVisible(false)}
                loading={leaderboardLoading}
                getLeaderboardData={getLeaderboardData}
              />
            )}
          </div>
          <div
            style={{ flex: isMobile ? 'unset' : 1, width: isMobile ? '100%' : 'auto', minWidth: 0, display: 'flex' }}
          >
            {activityLoading && !truPointsActivityLogsData ? (
              <AgentActivitySkeleton isMobile={isMobile} />
            ) : (
              <AgentActivity
                activities={formattedActivityData(truPointsActivityLogsData)}
                t={t}
                isMobile={isMobile}
                onHowToEarnClick={() => {
                  setTruPointsModalVisible(true);
                }}
              />
            )}
          </div>
        </div>
      )}
      <Leaderboard
        items={leaderboardItems(leaderboardData)?.items || []}
        currentUser={currentUser}
        t={t}
        isMobile={isMobile}
        onViewLeaderboard={() => setLeaderboardModalVisible(true)}
        modalVisible={leaderboardModalVisible}
        onModalClose={() => setLeaderboardModalVisible(false)}
        loading={leaderboardLoading}
        getLeaderboardData={getLeaderboardData}
        isModal={true}
      />
      {IS_AGENCY &&
        (teamPerformanceLoading && !teamPerformanceData ? (
          <TeamPerformanceTableSkeleton isMobile={isMobile} />
        ) : (
          <TeamPerformanceTable
            teamPerformanceData={teamPerformanceData}
            isMobile={isMobile}
            onFilterChange={setBadgeFilters}
            loading={teamPerformanceLoading}
            onPageChange={handleTeamPerformancePageChange}
          />
        ))}
      <ActivityDrawer
        visible={activityDrawerVisible}
        onClose={() => setActivityDrawerVisible(false)}
        activities={formattedActivityData(truPointsActivityLogsData)}
        t={t}
        isMobile={isMobile}
        onHowToEarnClick={() => {
          setActivityDrawerVisible(false);
          setTruPointsModalVisible(true);
        }}
      />
      <TruPoints
        visible={truPointsModalVisible}
        onClose={() => setTruPointsModalVisible(false)}
        t={t}
        isMobile={isMobile}
        tasks={formattedTruPointsData(truPointsCriteriaData)}
      />
      <AgentBagesInfo
        visible={badgesInfoModalVisible}
        onClose={() => setBadgesInfoModalVisible(false)}
        t={t}
        isMobile={isMobile}
        onTruPointsClick={() => {
          setBadgesInfoModalVisible(false);
          setTruPointsModalVisible(true);
        }}
      />
      <TenantComponents.BadgeCongratsModal ref={badgeCongratsModalRef} onClose={handleModalClose} />
    </div>
  );
};

export default AgentPerformance;
