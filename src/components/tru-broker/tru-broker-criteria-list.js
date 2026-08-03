import tenantTheme from '@theme';
import tenantRoutes from '@routes';
import tenantConstants from '@constants';
import TenantComponents from '@components';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CustomCard, Flex, Group } from '../../components/common';
import { CarouselSwiperProfile } from './styled';

const TruBrokerCriteriaList = ({ showCarousel, user, verifiedIcon='SvgIconCheck', unverifiedIcon='SvgRadio', noBackground=false, isMobileToggle=false, containerStyle, ...props }) => {
  const { t } = useTranslation();
  const completeProfileModalRef = useRef();
  const { rtl } = useSelector((state) => state.app.AppConfig);
  const { isMobile } = useSelector((state) => state.app.AppConfig);

  const swiperOptions = useMemo(
    () => ({
      pagination: { clickable: true, dynamicBullets: true },
      spaceBetween: 10,
      slidesPerView: !isMobile ? 1.8 : 1,
      rtl: rtl,
      breakpoints: {
        1200: {
          slidesPerView: 1.5,
          slidesPerGroup: 1,
        },
        1400: {
          slidesPerView: 1.7,
          slidesPerGroup: 2,
        },

        1600: {
          slidesPerView: 1.8,
          slidesPerGroup: 2,
        },
      },
    }),
    [],
  );

  const truBrokerSteps = useMemo(
    () => [
      {
        key: 1,
        isVerified: user?.profile_completion?.score === 100,
        title: t('Complete Profile'),
        onClick: () => {
          user?.profile_completion?.score < 100 &&
            completeProfileModalRef.current &&
            completeProfileModalRef.current.showCompletionPopUp();
        },
      },
      {
        key: 2,
        isVerified: user?.active_listings_count >= 2,
        title: t('2+ Active Listings'),
        link: user?.active_listings_count < 2 && tenantRoutes.app('', false, user).post_listing.path,
        internalLink: true,
      },
      {
        key: 3,
        isVerified: user?.package,
        title: t('Active Bayut Package'),
        link: !user?.package && tenantRoutes.app('', false, user).prop_shop.path,
        internalLink: true,
      },
    ],
    [],
  );
  const renderTruBrokerSteps = () => {
    return truBrokerSteps?.map((e, index) => (
      <React.Fragment key={index}>
        <CustomCard
          avatarIcon={e?.isVerified ? verifiedIcon : unverifiedIcon}
          iconSize={16}
          internalLink={e?.internalLink}
          title={e?.title}
          checkBoxEnabled={true}
          link={e?.link}
          {...(!noBackground && { cardBackground: e?.isVerified && tenantTheme['primary-light-4'] })}
          isVerified={e?.isVerified}
          onClick={e?.onClick}
          cursor={!e?.isVerified ? 'pointer' : 'default'}
          disabled={!user?.isLoggedinUser}
          fontSize="12"
          {...props}
        />
      </React.Fragment>
    ));
  };

  return (
    <>
      {!!showCarousel ? (
        isMobile ? (
          <CarouselSwiperProfile className="profile-slide" swiperOptions={swiperOptions}>
            {renderTruBrokerSteps()}
          </CarouselSwiperProfile>
        ) : (
          <Group template={'repeat(3,1fr)'} gap={isMobile ? '12px' : '16px'} style={{ width: '100%' }}>
            {renderTruBrokerSteps()}
          </Group>
        )
      ) : isMobileToggle ? (
        <Flex vertical gap={12} style={containerStyle}>
          {renderTruBrokerSteps()}
        </Flex>
      ) : (
        renderTruBrokerSteps()
      )}
      {tenantConstants.PROFILE_COMPLETION_APPLICABLE && (
        <TenantComponents.CompleteProfilePopUp ref={completeProfileModalRef} />
      )}
    </>
  );
};
export default TruBrokerCriteriaList;
