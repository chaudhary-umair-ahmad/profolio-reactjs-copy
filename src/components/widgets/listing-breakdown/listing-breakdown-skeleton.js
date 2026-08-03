import { Row, Space } from 'antd';
import cx from 'clsx';
import React from 'react';
import { Card, Group, TextWithIcon } from '../../common';
import { SkeletonBody } from '../../skeleton/Skeleton';

export const ListingBreakdownWidgetSkeleton = ({ isMobile, style }) => {
  return (
    <>
      <Row
        className={cx(isMobile ? 'px-16' : 'px-4', 'mb-8')}
        justify="space-between"
        style={{ minHeight: 34, alignItems: 'end', columnGap: 24, rowGap: 4 }}
      >
        <TextWithIcon
          className={cx(isMobile ? 'fz-14' : 'fz-16')}
          fontWeight={700}
          loading
          loadingProps={{ avatarSize: 24, rectSize: 'small' }}
        />
      </Row>
      <Card
        className="flex justify-content-center flex-grow"
        style={{ minHeight: 'calc(100% - 42px)', flexDirection: 'column', ...style }}
        bodyStyle={{ padding: isMobile ? '16px 12px' : '16px 24px' }}
      >
        <Group template="repeat(3, 1fr)" gap={isMobile ? '24px 8px' : '24px 28px'}>
          {[1, 2, 3, 4, 5, 6].map((e) => {
            return (
              <Space.Compact style={{ gap: 8 }} key={e}>
                <SkeletonBody className="mb-8" type="avatar" width={32} />
                <div>
                  <SkeletonBody style={{ borderRadius: 4, height: 16 }} />
                  <div>
                    <SkeletonBody type="button" style={{ borderRadius: 4, minWidth: 30, width: 30, height: 24 }} />
                  </div>
                </div>
              </Space.Compact>
            );
          })}
        </Group>
      </Card>
    </>
  );
};
