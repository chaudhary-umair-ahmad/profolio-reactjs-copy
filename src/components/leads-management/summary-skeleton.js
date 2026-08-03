import React from 'react';
import { Flex } from '../common';
import { SkeletonBody } from '../skeleton/Skeleton';
const SummarySkeleton = () => {
  return (
    <Flex vertical gap="16px" className={'mb-20'}>
      <Flex
        justify="space-between"
        align="center"
        style={{
          padding: '12px',
          borderRadius: 8,
          background: '#f5f5f5',
        }}
      >
        <Flex align="center" gap="8px">
          <SkeletonBody type="title" style={{ width: 120, height: 20 }} />
        </Flex>
        <Flex align="center" justify="center" style={{ width: 80, height: 80 }}>
          <SkeletonBody className="mb-8" type="avatar" style={{ width: 60, height: 60 }} />
        </Flex>
      </Flex>

      <SkeletonBody type="paragraph" />

      <Flex
        vertical
        gap="12px"
        style={{
          padding: '12px',
          background: '#f5f5f5',
        }}
      >
        <SkeletonBody type="title" style={{ height: 18 }} />
        {[1, 2, 3].map((_, index) => (
          <Flex justify="space-between" key={index}>
            <SkeletonBody type="title" style={{ height: 15 }} />
            <SkeletonBody type="title" style={{ height: 15 }} />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default SummarySkeleton;
