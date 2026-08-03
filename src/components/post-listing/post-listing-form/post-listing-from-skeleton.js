import { Col, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Icon, Skeleton } from '../../common';
import { BlockTitle, CardListing } from './styled';

const PostListingSkeleton = ({ title, children, icon, loading, renderTitleOnMobile = false }) => {
  const { t } = useTranslation();
  const isMob = useSelector((state) => state.app.AppConfig.isMobile);
  const renderTitle = (icon = 'MdCircle', title = t('Block title goes here')) => {
    return (
      <Col xs={24} lg={5} style={{ alignSelf: 'self-start' }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col xs={4} lg={24}>
            {loading ? (
              <Skeleton type="avatar" size={isMob ? 40 : 52} className="mb-8" />
            ) : (
              <Icon icon={icon} width={isMob ? 40 : 52} height={isMob ? 40 : 52} />
            )}
          </Col>
          <Col xs={20} lg={24}>
            {loading ? <Skeleton type="title" width={100} /> : <BlockTitle>{title}</BlockTitle>}
          </Col>
        </Row>
      </Col>
    );
  };

  return (
    <CardListing>
      <Row align="middle" gutter={[32, 16]}>
        {(renderTitleOnMobile || !isMob) && renderTitle(icon, title)}
        <Col xs={24} lg={19}>
          {children}
        </Col>
      </Row>
    </CardListing>
  );
};
export default PostListingSkeleton;
