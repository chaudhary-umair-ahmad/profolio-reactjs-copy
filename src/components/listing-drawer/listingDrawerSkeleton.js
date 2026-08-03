import React from 'react';
import { ImageGallerySkeleton } from './styled';
import { Flex, Skeleton } from '../common';
import cx from 'clsx';
import { useSelector } from 'react-redux';

const ListingDrawerSkeleton = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  return (
    <>
      <ImageGallerySkeleton
        gap="8px"
        template="1fr 32%"
        className={cx('gallery-container')}
        style={{ '--row-template': isMobile ? '40px' : '100px' }}
      >
        <Skeleton style={{ width: '100%', height: isMobile ? 190 : 425 }} />
        <Skeleton style={{ width: '100%', height: isMobile ? 90 : 210 }} />
        <Skeleton style={{ width: '100%', height: isMobile ? 90 : 207 }} />
      </ImageGallerySkeleton>
      <Flex vertical gap="10px" style={{ marginBlockStart: isMobile ? '25px' : '20px' }}>
        <Skeleton block style={{ height: 30 }} />
        <Skeleton block style={{ height: 20, marginBlockEnd: '5px' }} />
        <Flex gap="20px" style={{ marginBlockEnd: '12px' }}>
          <Skeleton style={{ height: 30 }} />
          <Skeleton style={{ height: 30 }} />
          <Skeleton style={{ height: 30 }} />
        </Flex>
        <div>
          <Skeleton block style={{ height: 30, marginBlockEnd: '10px' }} />
          <Skeleton block style={{ height: 60 }} />
        </div>
      </Flex>
    </>
  );
};

export default ListingDrawerSkeleton;
