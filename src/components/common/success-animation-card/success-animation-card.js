import { Typography } from 'antd';
import Flex from '../flex';
import Lottie from '../lottie/lottie';
import congratulationAnimation from './congratulationLottie.json';
import { useSelector } from 'react-redux';
const { Text, Title } = Typography;

const TitleDescriptionWithAnimation = ({ renderImage = () => {}, title, description }) => {
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  return (
    <Flex vertical justify="center" align="center" gap="15px" style={{ height: isMobile ? '200px' : '245px' }}>
      <div className="congrats-lottie">
        <Lottie animationData={congratulationAnimation} loop={false} autoplay={false} />
      </div>
      {renderImage()}
      <div className="text-center">
        <Title level={isMobile ? 4 : 3} className="mb-4">
          {title}
        </Title>
        <Text type="secondary" className="d-block" style={{ width: '35ch' }}>
          {description}
        </Text>
      </div>
    </Flex>
  );
};
export default TitleDescriptionWithAnimation;
