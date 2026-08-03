import { useSelector } from 'react-redux';
import { CarouselSwiperDashboard } from '../../container/pages/dashboard/styled';
import { Flex } from '../common';
import TruBrokerCard from './tru-broker';
import { useMemo } from 'react';
import tenantConstants from '@constants';
import TenantComponents from '@components';

const TruBrokerAndProfileCard = ({ user }) => {
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const { rtl } = useSelector((state) => state.app.AppConfig);

  const carouselSettings = useMemo(
    () => ({
      pagination: { clickable: true, dynamicBullets: true },
      spaceBetween: 10,
      slidesPerView: 1.1,
      rtl: rtl,
    }),
    [],
  );

  const isNotTruBroker = () => {
    return !user?.is_tru_broker && !user?.tru_broker_start_date;
  };
  const renderTruBrokerAndProfileBanner = () => {
    return !isMobile ? (
      <Flex vertical style={{ width: '100%' }}>
        {tenantConstants.PROFILE_COMPLETION_APPLICABLE && <TenantComponents.ProfileCompletionAlert user={user} />}
        <TruBrokerCard user={user} />
      </Flex>
    ) : user?.profile_completion?.score < 100 ? (
      // <CarouselSwiperDashboard className="dashboard-slider" swiperOptions={carouselSettings}>
      <Flex vertical style={{ width: '100%' }}>
        {tenantConstants.PROFILE_COMPLETION_APPLICABLE && <TenantComponents.ProfileCompletionAlert user={user} />}
        <TruBrokerCard style={{ flex: 'auto' }} user={user} />
      </Flex>
    ) : (
      // </CarouselSwiperDashboard>
      <TruBrokerCard style={{ flex: 'auto' }} user={user} />
    );
  };

  return isNotTruBroker() && tenantConstants.TRU_BROKER_ENABLED ? (
    renderTruBrokerAndProfileBanner()
  ) : !tenantConstants.TRU_BROKER_ENABLED && tenantConstants.PROFILE_COMPLETION_APPLICABLE ? (
    <TenantComponents.ProfileCompletionBanner />
  ) : null;
};
export default TruBrokerAndProfileCard;
