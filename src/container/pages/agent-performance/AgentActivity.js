import React from 'react';
import { useSelector } from 'react-redux';
import { FiClock } from 'react-icons/fi';
import { IconCriteriaMapping } from './Utils';
import { CalenderIcon, StarIcon, StarShineIcon } from '../../../components/svg';
import { AgentActivitySkeleton } from './AgentPerformanceSkeleton';
import {
  CardShell,
  ActivityHeader,
  ActivityTitle,
  HowToEarnButton,
  ActivityListWrapper,
  ActivityList,
  ActivityFadeOverlay,
  ActivityIconWrapper,
  ActivityContent,
  ActivityDetails,
  ActivityTitleText,
  ActivityDate,
  PointsValue,
  EmptyStateContainer,
  EmptyStateIconWrapper,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateButton,
} from './styled';

const AgentActivity = ({
  activities = [],
  t,
  onHowToEarnClick,
  isMobile = false,
  hideHeaderButton = false,
  showAllActivities = false,
  loading = false,
  isInsideDrawer = false,
  scrollRef = null,
  onScroll = null,
}) => {
  const { locale } = useSelector((state) => state.app.AppConfig);
  if (loading) {
    return <AgentActivitySkeleton isMobile={isMobile} />;
  }
  if ((activities || []).length === 0) {
    return (
      <CardShell
        $isMobile={isMobile}
        style={{
          height: '576px',
          maxHeight: '576px',
          ...(isInsideDrawer ? { boxShadow: 'none' } : {})
        }}
      >
        <ActivityHeader $isMobile={isMobile}>
          {!isInsideDrawer && <ActivityTitle>{t('TruPoints™')}</ActivityTitle>}
        </ActivityHeader>
        <EmptyStateContainer>
          <EmptyStateIconWrapper>
            <StarIcon size={64} />
          </EmptyStateIconWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center' }}>
            <EmptyStateTitle>{t('No TruPoints™ Earned Yet')}</EmptyStateTitle>
            <EmptyStateDescription>
              {t('Earn TruPoints to improve your rank and get featured on the leaderboard')}
            </EmptyStateDescription>
          </div>
          {!hideHeaderButton && (
            <EmptyStateButton onClick={onHowToEarnClick}>{t('How to earn TruPoints™')}</EmptyStateButton>
          )}
        </EmptyStateContainer>
      </CardShell>
    );
  }

  const displayActivities = activities || [];

  const activityListContent = (
    <ActivityListWrapper $isMobile={isMobile} style={isInsideDrawer ? { padding: 0, margin: 0 } : {}}>
      <ActivityList
        $isMobile={isMobile}
        ref={scrollRef}
        onScroll={onScroll}
        style={isInsideDrawer ? { padding: 0, margin: 0 } : {}}
      >
        {displayActivities.map((activity, idx) => {
          const iconConfig = IconCriteriaMapping(activity.type);
          const isLast = idx === displayActivities.length - 1;

          return (
            <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: displayActivities?.length - 1 === idx ? '30px' : '0px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <ActivityIconWrapper $bgColor={iconConfig.bgColor}>
                  <span style={{ color: iconConfig.color, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{iconConfig.icon}</span>
                </ActivityIconWrapper>
                {!isLast && <div style={{ width: '1px', height: '44px', background: '#F0F0F0', flexShrink: 0 }} />}
              </div>

              <ActivityContent $isMobile={isMobile}>
                <ActivityDetails>
                  <ActivityTitleText>
                    {locale === 'ar' && activity.description_l1 ? activity.description_l1 : activity.description || ''}
                  </ActivityTitleText>
                  <ActivityDate>
                    <CalenderIcon size={13} />
                    {activity.date}
                  </ActivityDate>
                </ActivityDetails>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PointsValue>+{activity.points}</PointsValue>
                  <StarShineIcon />
                </div>
              </ActivityContent>
            </div>
          );
        })}
      </ActivityList>
      <ActivityFadeOverlay />
    </ActivityListWrapper>
  );

  if (isInsideDrawer) {
    return activityListContent;
  }

  return (
    <CardShell $isMobile={isMobile} style={{ height: '576px', maxHeight: '576px' }}>
      <ActivityHeader $isMobile={isMobile}>
        <ActivityTitle style={{ fontSize: isMobile ? '14px' : '16px' }}>{t('TruPoints™')}</ActivityTitle>
        {!hideHeaderButton && (
          <HowToEarnButton
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onHowToEarnClick) onHowToEarnClick();
            }}
          >
            {t('How to Earn TruPoints?')}
          </HowToEarnButton>
        )}
      </ActivityHeader>
      {activityListContent}
    </CardShell>
  );
};

export default AgentActivity;
