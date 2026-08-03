import React from 'react';
import { Divider, Flex, Skeleton } from '../common';
import { useSelector } from 'react-redux';

const AddInterestDrawerSkeleton = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  return [1, 2, 3].map((_, i) => (
    <React.Fragment key={i}>
      <Flex
        align="center"
        gap="10px"
        justify="space-between"
        className="listing-card-check"
        style={{ paddingBlock: 24 }}
      >
        <Flex align="center" gap="10px" style={{ flex: 1 }}>
          <Skeleton style={{ height: '113px', width: '106px' }} />
          <Flex vertical gap="4px" style={{ width: isMobile ? '100%' : '230px' }}>
            <Skeleton style={{ height: '24px', width: '90%' }} />
            <Skeleton style={{ height: '22px', width: '70%' }} />
            <Skeleton style={{ height: '17px', width: '50%' }} />
            <Skeleton style={{ height: '14px', width: '80%' }} />
            <Skeleton style={{ height: '16px', width: '100%' }} />
          </Flex>
        </Flex>
        <Skeleton style={{ height: '18px', width: '18px', minWidth: 'auto' }} />
      </Flex>
      <Divider style={{ marginBlock: 0 }} />
    </React.Fragment>
  ));
};

export default AddInterestDrawerSkeleton;
