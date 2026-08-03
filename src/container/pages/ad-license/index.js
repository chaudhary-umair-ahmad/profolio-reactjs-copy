import tenantTheme from '@theme';
import TenantComponents from '@components';
import { Col, Row } from 'antd';
import { Button, Heading } from '@/components/common';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CreateAdLicense = props => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const AdLicensePage = TenantComponents.AdLicensePage || <></>;

  return (
    <Row style={{ marginBlockStart: '20px' }}>
      <Col xs={24} lg={18} xxl={15} style={{ margin: 'auto' }}>
        <Button
          size="small"
          className="mb-8"
          style={{ border: 0 }}
          type="primaryOutlined"
          icon="IoMdArrowRoundBack"
          onClick={() => navigate(-1)}
          iconSize="14px"
        >
          {' '}
          {t('Back')}
        </Button>
        <Heading as="h2" className="fs20 mb-4 ">
          {t('Get a New Ad License')}
        </Heading>
        <AdLicensePage />
      </Col>
    </Row>
  )
}

export default CreateAdLicense;
