import { Col, Row } from 'antd';
import { BlockTitle, CardListing } from '@components/post-listing/styled';
import { Icon, Skeleton } from '@/components/common';
import { useSelector } from 'react-redux';

const CardBlock = ({ title, children, icon, loading, renderTitleOnMobile = false }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const renderTitle = (icon = 'MdCircle', title = t('Block title goes here')) => {
    return (
      <Col xs={24} lg={5} style={{ alignSelf: 'self-start' }}>
        <Row align="middle" gutter={[16, 0]}>
          <Col xs={4} lg={24}>
            {loading ? (
              <Skeleton type="avatar" size={isMobile ? 40 : 52} className="mb-8" />
            ) : (
              <Icon icon={icon} width={isMobile ? 40 : 52} height={isMobile ? 40 : 52} />
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
        {(renderTitleOnMobile || !isMobile) && renderTitle(icon, title)}
        <Col xs={24} lg={19}>
          {children}
        </Col>
      </Row>
    </CardListing>
  );
};

export default CardBlock;
