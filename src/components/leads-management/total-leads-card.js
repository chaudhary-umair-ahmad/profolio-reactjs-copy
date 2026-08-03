import { useSelector } from 'react-redux';
import { Card, Icon } from '../common';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const TotalLeadsCard = ({ title = {}, value = '0' } = {}) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { t } = useTranslation();

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
        }}
      >
        <Icon size={isMobile ? '30px' : '44px'} icon={title?.icon || 'TotalLeadsIcon'} />
        <Text
          level={5}
          style={{
            fontSize: isMobile ? '16px' : '20px',
            fontWeight: '400',
            marginTop: isMobile ? '10px' : '18px',
            color: '#222222',
          }}
        >
          {t(title?.title)}
        </Text>
        <Text
          level={5}
          style={{
            fontSize: isMobile ? '32px' : '34px',
            fontWeight: '700',
            color: '#222222',
            marginTop: isMobile ? '-5px' : '0px',
          }}
        >
          {value}
        </Text>
      </div>
    </Card>
  );
};

export default TotalLeadsCard;
