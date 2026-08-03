import React from 'react';
import { Skeleton, Flex } from 'antd';
import {
  ProfileHeaderWrapper,
  UserCardSection,
  StatsPanel,
  StatTile,
  TruBrokerBannerContainer,
  BannerContent,
  BadgeCard,
  CardShell,
  ActivityHeader,
  ActivityList,
  LeaderboardCardHeader,
} from './styled';

export const AgentProfileCardSkeleton = ({ isMobile = false }) => {
  return (
    <ProfileHeaderWrapper style={{ padding: isMobile ? '16px' : '20px' }}>
      <Flex align="center" gap={12} as={UserCardSection}>
        <Skeleton.Avatar active size={64} shape="circle" />
        <Flex vertical gap={4} style={{ flex: 1 }}>
          <Skeleton.Input active size="small" style={{ width: isMobile ? 120 : 180, height: 20 }} />
          <Skeleton.Input active size="small" style={{ width: isMobile ? 100 : 150, height: 16 }} />
        </Flex>
      </Flex>

      <Flex gap={16} align="stretch" as={StatsPanel}>
        <StatTile style={{ padding: isMobile ? '12px' : '16px', flex: 1 }}>
          <Flex gap={12} align="center" style={{ marginBottom: '8px' }}>
            <Skeleton.Avatar active size={40} shape="square" />
            <Flex vertical gap={4} style={{ flex: 1 }}>
              <Skeleton.Input active size="small" style={{ width: 60, height: 14 }} />
              <Skeleton.Input active size="small" style={{ width: 40, height: 18 }} />
            </Flex>
          </Flex>
          <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
        </StatTile>

        <StatTile style={{ padding: isMobile ? '12px' : '16px', flex: 1 }}>
          <Flex gap={12} align="center" style={{ marginBottom: '8px' }}>
            <Skeleton.Avatar active size={40} shape="square" />
            <Flex vertical gap={4} style={{ flex: 1 }}>
              <Skeleton.Input active size="small" style={{ width: 70, height: 14 }} />
              <Skeleton.Input active size="small" style={{ width: 50, height: 18 }} />
            </Flex>
          </Flex>
          <Skeleton.Input active size="small" style={{ width: 60, height: 14 }} />
        </StatTile>
      </Flex>
    </ProfileHeaderWrapper>
  );
};

export const TruBrokerSkeleton = ({ isMobile = false }) => {
  return (
    <TruBrokerBannerContainer $isMobile={isMobile} style={{ padding: isMobile ? '16px' : '24px' }}>
      <BannerContent $isMobile={isMobile}>
        <Flex vertical gap={12} style={{ flex: 1 }}>
          <Skeleton.Input active size="default" style={{ width: isMobile ? 200 : 280, height: 24 }} />
          <Skeleton.Input active size="small" style={{ width: '100%', maxWidth: 400, height: 16 }} />
          <Skeleton.Input active size="small" style={{ width: '80%', maxWidth: 350, height: 16 }} />
        </Flex>
      </BannerContent>
    </TruBrokerBannerContainer>
  );
};

export const AgentBadgeSkeleton = ({ isMobile = false }) => {
  return (
    <BadgeCard $isMobile={isMobile} style={{ padding: isMobile ? '16px' : '20px', width: '100%', flex: 1 }}>
      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        <Skeleton.Avatar active size={24} shape="circle" />
      </div>

      <Flex gap={8} align="center" style={{ marginBottom: isMobile ? '10px' : '12px' }}>
        <Skeleton.Avatar active size={isMobile ? 24 : 32} shape="circle" />
        <Skeleton.Input active size="small" style={{ width: 120, height: 20 }} />
      </Flex>

      <Flex vertical gap={4} style={{ marginBottom: isMobile ? '14px' : '18px' }}>
        <Skeleton.Input active size="small" style={{ width: '100%', height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: '80%', height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 60, height: 14, marginTop: 4 }} />
      </Flex>

      <Flex vertical gap={12}>
        {[1, 2].map((i) => (
          <div key={i}>
            <Flex justify="space-between" style={{ marginBottom: 6 }}>
              <Skeleton.Input active size="small" style={{ width: 80, height: 12 }} />
              <Skeleton.Input active size="small" style={{ width: 40, height: 12 }} />
            </Flex>
            <Skeleton.Input active size="small" style={{ width: '100%', height: 8 }} block />
          </div>
        ))}
      </Flex>
    </BadgeCard>
  );
};

export const LeaderboardSkeleton = ({ isMobile = false }) => {
  return (
    <CardShell $isMobile={isMobile} style={{ height: '600px', maxHeight: '600px', padding: isMobile ? '16px' : '20px' }}>
      <LeaderboardCardHeader $isMobile={isMobile} style={{ marginBottom: '16px' }}>
        <Skeleton.Input active size="default" style={{ width: 180, height: 20 }} />
        <Skeleton.Input active size="small" style={{ width: 120, height: 16 }} />
      </LeaderboardCardHeader>

      <div
        style={{
          padding: isMobile ? '12px' : '16px',
          background: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        <Flex justify="space-between" align="center">
          <Flex gap={12} align="center">
            <Skeleton.Avatar active size={isMobile ? 40 : 48} shape="circle" />
            <Flex vertical gap={4}>
              <Skeleton.Input active size="small" style={{ width: 120, height: 16 }} />
              <Skeleton.Input active size="small" style={{ width: 80, height: 12 }} />
            </Flex>
          </Flex>
          <Flex vertical gap={4} align="flex-end">
            <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
            <Skeleton.Input active size="small" style={{ width: 100, height: 16 }} />
          </Flex>
        </Flex>
      </div>

      <Flex vertical gap={12} style={{ marginTop: '16px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Flex key={i} justify="space-between" align="center" style={{ padding: '12px 0' }}>
            <Flex gap={12} align="center" style={{ flex: 1 }}>
              <Skeleton.Input active size="small" style={{ width: 40, height: 16 }} />
              <Skeleton.Avatar active size={isMobile ? 32 : 40} shape="circle" />
              <Skeleton.Input active size="small" style={{ width: isMobile ? 80 : 120, height: 16 }} />
            </Flex>
            <Flex gap={8}>
              <Skeleton.Avatar active size={20} shape="circle" />
              <Skeleton.Avatar active size={20} shape="circle" />
            </Flex>
            <Skeleton.Input active size="small" style={{ width: 50, height: 16 }} />
          </Flex>
        ))}
      </Flex>
    </CardShell>
  );
};

export const AgentActivitySkeleton = ({ isMobile = false }) => {
  return (
    <CardShell $isMobile={isMobile} style={{ height: '600px', maxHeight: '600px', padding: isMobile ? '16px' : '20px' }}>
      <ActivityHeader $isMobile={isMobile} style={{ marginBottom: '16px' }}>
        <Skeleton.Input active size="default" style={{ width: 120, height: 20 }} />
        <Skeleton.Input active size="small" style={{ width: 140, height: 16 }} />
      </ActivityHeader>

      <ActivityList $isMobile={isMobile}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Flex key={i} gap={16} align="flex-start" style={{ marginBottom: '20px' }}>
            <Flex vertical align="center" gap={4}>
              <Skeleton.Avatar active size={40} shape="circle" />
              {i !== 5 && <div style={{ width: '2px', height: '44px', background: '#f0f0f0' }} />}
            </Flex>

            <Flex justify="space-between" align="center" style={{ flex: 1, paddingTop: '8px' }}>
              <Flex vertical gap={4} style={{ flex: 1 }}>
                <Skeleton.Input active size="small" style={{ width: isMobile ? 140 : 200, height: 14 }} />
                <Skeleton.Input active size="small" style={{ width: 80, height: 12 }} />
              </Flex>
              <Skeleton.Input active size="small" style={{ width: 60, height: 20 }} />
            </Flex>
          </Flex>
        ))}
      </ActivityList>
    </CardShell>
  );
};

export const TeamPerformanceTableSkeleton = ({ isMobile = false }) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: isMobile ? '16px' : '20px',
        border: '1px solid #f0f0f0',
      }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: '20px' }}>
        <Skeleton.Input active size="default" style={{ width: 180, height: 24 }} />
        <Skeleton.Button active size="default" style={{ width: 120 }} />
      </Flex>

      <Flex gap={8} style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton.Button key={i} active size="small" style={{ width: 100 }} />
        ))}
      </Flex>

      <Flex
        justify="space-between"
        style={{
          padding: '12px 16px',
          background: '#fafafa',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton.Input key={i} active size="small" style={{ width: isMobile ? 60 : 100, height: 14 }} />
        ))}
      </Flex>

      {[1, 2, 3, 4, 5].map((i) => (
        <Flex
          key={i}
          justify="space-between"
          align="center"
          style={{
            padding: '16px',
            borderBottom: i !== 5 ? '1px solid #f0f0f0' : 'none',
          }}
        >
          <Flex gap={12} align="center" style={{ flex: 1 }}>
            <Skeleton.Avatar active size={40} shape="circle" />
            <Flex vertical gap={4}>
              <Skeleton.Input active size="small" style={{ width: isMobile ? 80 : 120, height: 14 }} />
              <Skeleton.Input active size="small" style={{ width: isMobile ? 60 : 100, height: 12 }} />
            </Flex>
          </Flex>
          {!isMobile && (
            <>
              <Skeleton.Input active size="small" style={{ width: 60, height: 14 }} />
              <Skeleton.Input active size="small" style={{ width: 60, height: 14 }} />
            </>
          )}
          <Skeleton.Input active size="small" style={{ width: 50, height: 14 }} />
        </Flex>
      ))}
    </div>
  );
};

