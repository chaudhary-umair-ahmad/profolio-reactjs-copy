import tenantTheme from '@theme';
import { Col, Row, Skeleton, Space } from 'antd';
import React from 'react';
import { Card, Group, Heading, Icon } from '../../../components/common';
import { useSelector } from 'react-redux';

const LicenseSkeleton = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  return (
    <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
      <Heading as={isMobile ? 'h5' : 'h3'} className={isMobile ? 'mb-12' : 'mb-20'}>
        <Skeleton.Input shape="round" size="small" style={{ height: 20 }} />
      </Heading>
      <Group>
        <Card
          style={{
            backgroundColor: tenantTheme['primary-light-4'],
            borderColor: tenantTheme['primary-light-3'],
            borderWidth: 1,
          }}
          bodyStyle={{ padding: isMobile ? 16 : 20 }}
        >
          <Row align="space-between">
            <Col xs={24} md={18}>
              <Group gap="6px" className={isMobile ? 'mb-8' : null}>
                <Group template="1fr auto" gap="6px" className="align-items-center">
                  <Group template="initial" gap="6px">
                    <Space align="center" size={6}>
                      <Skeleton.Button shape="round" style={{ height: 20 }} />
                      <Icon icon="GoDotFill" color={tenantTheme['primary-light-2']} size={12} />
                      <Skeleton.Button shape="round" style={{ height: 20 }} />
                    </Space>
                    <div className="mb-8">
                      <Skeleton.Button shape="round" style={{ width: isMobile ? 100 : 200 }} />
                    </div>
                  </Group>
                  {isMobile && (
                    <div>
                      <Skeleton.Button size="small" shape="round" />
                    </div>
                  )}
                </Group>
                <span className={isMobile ? 'fw-600' : 'fs16 fw-600'}>
                  <Skeleton.Input size="large" style={{ height: 20 }} />
                </span>
                <Space align="center" size={6}>
                  <Skeleton.Button shape="round" size="large" style={{ height: 20 }} />
                  <Icon icon="GoDotFill" color={tenantTheme['primary-light-2']} size={12} />
                  <Skeleton.Button shape="round" size="large" style={{ height: 20 }} />
                </Space>
                <Space align="center" size={6}>
                  <Skeleton.Avatar />
                  <Skeleton.Input shape="round" size="small" style={{ height: 20 }} />
                </Space>
              </Group>
            </Col>
            <Col xs={24} md={6}>
              <Group
                style={{
                  height: '100%',
                  alignContent: 'space-between',
                  justifyItems: 'end',
                  '--template': isMobile ? 'auto auto' : '1fr',
                  justifyContent: 'space-between',
                }}
              >
                {!isMobile && (
                  <div>
                    <Skeleton.Button shape="round" />
                  </div>
                )}
                <div>
                  <Space.Compact style={{ gap: 8 }}>
                    <Skeleton.Button shape="round" size="large" style={{ height: 20 }} />
                  </Space.Compact>
                </div>
                <div className="">
                  <Skeleton.Input shape="round" size="small" style={{ height: 20 }} />
                </div>
              </Group>
            </Col>
          </Row>
        </Card>
      </Group>
    </Card>
  );
};
export default LicenseSkeleton;
