import tenantTheme from '@theme';
import { Col, Row, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { Card, Divider, Flex, Group, Skeleton, TextWithIcon } from '../../components/common';
import { DATE_BEFORE_TIME_FORMAT } from '../../constants/formats';
import { HistoryDot, HistoryPackage } from '../../container/pages/credits-usage/styled';
import { getTimeDateString } from '../../utility/date';
import tenantUtils from '@utils';
import TruBrokerActivityListSkeleton from './tru-broker-activity-skeleton';
const { Title } = Typography;

const ActivityList = ({ item, loading }) => {
  const { isMobile } = useSelector((state) => state.app.AppConfig);

  return loading || !item ? (
    <TruBrokerActivityListSkeleton />
  ) : (
    <Row gutter={isMobile ? 8 : 16} wrap={false} style={{ paddingBlockEnd: isMobile ? 16 : 24 }}>
      <Col flex={isMobile ? '32px' : '38px'}>
        <HistoryPackage>
          <HistoryDot style={{ '--dot-color': `${tenantTheme['primary-color']}70` }} />
          <Divider
            style={{ '--ant-color-split': `${tenantTheme['primary-color']}20` }}
            type="vertical"
            orientation="center"
          />
        </HistoryPackage>
      </Col>
      <Col flex="auto">
        <Card style={{ borderWidth: 1 }}>
          <Flex justify="space-between" align="center">
            <div>
              <Title level={5} className="mb-2" style={{ fontSize: isMobile && '14px' }}>
                {tenantUtils.getLocalisedString(item, 'description')}
              </Title>
              <TextWithIcon
                title={getTimeDateString(item?.created_at, DATE_BEFORE_TIME_FORMAT, false, false)}
                icon={'FiCalendar'}
                iconProps={{ size: '12px' }}
                className="color-gray-dark"
                textColor={tenantTheme['gray700']}
                textSize={isMobile && '12px'}
              />
            </div>
            <TextWithIcon
              title={'+' + item?.points}
              icon={'SvgStarGradient'}
              iconProps={{ size: isMobile ? '16px' : '20px' }}
              textColor={tenantTheme['primary-color']}
              textSize={isMobile ? '16px' : '20px'}
              fontWeight="700"
            />
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};
export default ActivityList;
