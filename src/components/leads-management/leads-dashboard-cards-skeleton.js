import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Skeleton, Flex } from '../common';

export const TotalLeadsCardSkeleton = () => {
  const isMobile = useSelector((state) => state?.app?.AppConfig?.isMobile);

  return (
    <Card
      style={{
        minWidth: isMobile ? '143px' : '200px',
        height: '100%',
        background: 'linear-gradient(349.82deg, #FFFFFF 24.14%, #F2FAFA 95.61%)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        borderWidth: '0px',
      }}
    >
      <div
        style={{
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Skeleton type="avatar" size={isMobile ? 30 : 44} active={false} />
        <Skeleton
          type="button"
          style={{
            height: isMobile ? 16 : 20,
            width: isMobile ? '80px' : '100px',
            marginTop: isMobile ? '10px' : '18px',
          }}
          active={false}
        />
        <Skeleton
          type="button"
          style={{
            height: isMobile ? 32 : 34,
            width: isMobile ? '100px' : '120px',
            marginTop: '14px',
          }}
          active={false}
        />
      </div>
    </Card>
  );
};

export const LeadsDashboardCardSkeleton = () => {
  const isMobile = useSelector((state) => state?.app?.AppConfig?.isMobile);

  return (
    <Card
      headStyle={{
        padding: '0px',
        borderBottom: 'none',
      }}
      bodyStyle={{
        padding: '0px',
        height: '300px',
      }}
      style={{
        width: 'fit-content',
        padding: '16px',
        '--ant-padding': 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: isMobile ? '314px' : '450px',
      }}
    >
      <div
        style={{
          gap: '4px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Flex align="center" gap="8px">
            <Skeleton type="avatar" size={isMobile ? 24 : 36} active={false} />
            <Skeleton type="button" style={{ height: isMobile ? 16 : 20, width: '120px' }} active={false} />
          </Flex>
          {!isMobile && <Skeleton type="button" style={{ height: 28, width: '100px' }} active={false} />}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isMobile ? (
            <>
              {[1, 2].map((index) => (
                <React.Fragment key={index}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <Skeleton type="button" style={{ height: 14, width: '60px' }} active={false} />
                    <Skeleton type="button" style={{ height: isMobile ? 16 : 20, width: '80px' }} active={false} />
                  </div>
                  {index < 2 && (
                    <div
                      style={{
                        width: '1px',
                        height: '40px',
                        backgroundColor: '#e9ecef',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {[1, 2, 3].map((index) => (
                <React.Fragment key={index}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <Skeleton type="button" style={{ height: 14, width: '60px' }} active={false} />
                    <Skeleton type="button" style={{ height: 20, width: '80px' }} active={false} />
                  </div>
                  {index < 3 && (
                    <div
                      style={{
                        width: '1px',
                        height: '40px',
                        backgroundColor: '#e9ecef',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
        {isMobile && <Skeleton type="button" style={{ height: 12, width: '80px' }} active={false} />}
        {!isMobile && (
          <div
            style={{
              borderRadius: '4px',
              gap: '12px',
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            {[1, 2].map((index) => (
              <Flex
                key={index}
                align="center"
                style={{
                  padding: '8px 12px 8px 12px',
                  backgroundColor: '#F7F7F7',
                  display: 'flex',
                  width: '100%',
                  borderRadius: '4px',
                }}
              >
                <Skeleton type="avatar" size={32} active={false} />
                <Flex vertical gap="2px" style={{ marginLeft: '8px' }}>
                  <Skeleton type="button" style={{ height: 14, width: '80px' }} active={false} />
                  <Skeleton type="button" style={{ height: 14, width: '60px' }} active={false} />
                </Flex>
              </Flex>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
