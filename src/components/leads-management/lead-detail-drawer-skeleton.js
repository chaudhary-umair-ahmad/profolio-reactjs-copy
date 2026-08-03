import React from 'react';
import { Flex, Group, Skeleton } from '../common';
import { useSelector } from 'react-redux';

export const LeadSourceCardSkeleton = () => {
  return (
    <>
      <Flex vertical gap="10px" className="mb-12">
        {[1, 2, 3, 4].map((e) => (
          <Skeleton key={e} style={{ height: '150px', width: '100%', borderRadius: 0 }} />
        ))}
      </Flex>
    </>
  );
};

export const LeadDetailHeaderSkeleton = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  return (
    <Flex vertical gap="12px">
      {/* <Skeleton style={{ height: '28px', width: '100px' }} />
      <Skeleton style={{ height: '40px', width: '200px' }} />
      <Skeleton style={{ height: '20px', width: '300px' }} /> */}
      <Group template={'repeat(auto-fit, minmax(10ch, 1fr))'} className="w-100">
        <Skeleton style={{ height: '40px', width: '100%' }} />
        <Skeleton style={{ height: '40px', width: '100%' }} />
        <Skeleton style={{ height: '40px', width: '100%' }} />
        {!isMobile && <Skeleton style={{ height: '40px', width: '100%' }} />}
      </Group>
    </Flex>
  );
};

export const AgentPerformanceCardSkeleton = () => {
  return (
    <>
      <Flex vertical gap="4px" style={{ backgroundColor: '#F6F7FB' }}>
        {[1, 2].map((e) => (
          <Skeleton key={e} style={{ height: '100px', width: '100%', borderRadius: 0 }} />
        ))}
      </Flex>
    </>
  );
};
