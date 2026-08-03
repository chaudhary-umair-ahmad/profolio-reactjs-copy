import { Divider, Progress, Row } from 'antd';
import React from 'react';
import { SkeletonBody } from '../../skeleton/Skeleton';


export const QCSkeleton = ({ isMobile }) => {
    return (
      <>
        <Row justify="start" style={{ gap: isMobile ? 24 : 32 }}>
          {[1, 2, 3].map((e, i) => {
            return (
              <>
                {i !== 0 && <Divider type="vertical" style={{ height: '100%', margin: 0 }} />}
                <div>
                  <SkeletonBody className="mb-2" width={80} style={{ minWidth: 64, width: 64, height: 24 }} />
                  <SkeletonBody style={{ minWidth: 32, width: 32, height: 30 }} />
                </div>
              </>
            );
          })}
        </Row>
        <Progress showInfo={false} loading />
      </>
    );
  };