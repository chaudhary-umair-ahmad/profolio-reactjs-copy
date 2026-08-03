import tenantUtils from '@utils';
import tenantConstants from '@constants';
import TenantComponents from '@components';
import { Card, Typography } from 'antd';
import cx from 'clsx';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  CarouselSwiper,
  Flex,
  Group,
  Heading,
  notification,
  Segmented,
  Skeleton,
} from '../../../../../components/common/index.js';
import { BannerContainer } from '../../../../../components/styled.js';
import { useGetLocation, useRouteNavigate } from '../../../../../hooks';
import { packageMonthClickEvent } from '../../../../../services/analyticsService/index.js';
import { convertQueryObjToString, mapQueryStringToFilterObject } from '../../../../../utility/urlQuery.js';
import { CardPackages } from '../styled.js';
import { PackageCard } from './packageCard.js';
import { PackageCardMobile } from './packageCardMobile.js';
import { PackageCardList } from './styled.js';
import { useGetQuotaCreditsWidgetDataQuery } from '../../../../../apis/quotaCredits.js';
import { useCreateCartMutation } from '../../../../../apis/cart.js';
import { useGetPackagesQuery } from '../../../../../apis/common.js';
import { getRangeArray } from '../../../../../utility/utility.js';
import { getClassifiedBaseURL } from '../../../../../utility/env.js';
import { getLocaleForURL } from '../../../../../utility/language.js';

const { Text } = Typography;

const packageDurations = () => [
  { key: 12, label: t('1 Year'), value: 12 },
  { key: 6, label: t('6 Months'), value: 6 },
];

const PackagesCardSkeleton = (props) => {
  const { isMemberArea } = useSelector((state) => state.app.AppConfig);
  const items = getRangeArray(1, 5);

  return (
    <Group template={`repeat(${items?.length}, 1fr)`}>
      {items.map((e) => (
        <Skeleton key={e} style={{ height: '600px', width: isMemberArea ? '300px' : '230px' }} />
        // <Skeleton key={e} style={{ height: '400px', width: isMemberArea ? '300px' : '400px' }} />
      ))}
    </Group>
  );
};
const PackageCardSkeletonMobile = () => {
  return <Skeleton style={{ height: '500px', width: '100%' }} />;
};

const OfferedPackages = (props) => {
  const navigate = useRouteNavigate();
  const location = useGetLocation();
  const { redirectUrl = '' } = mapQueryStringToFilterObject(location.search)?.queryObj;
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.packages);
  const { isMobile, rtl, isMemberArea } = useSelector((state) => state.app.AppConfig);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { package_id, package_slug } = mapQueryStringToFilterObject(location?.search)?.queryObj;
  const [activePackageDuration, setActivePackageDuration] = useState(packageDurations()[0]);
  const {
    data: packageData,
    error: isError,
    isLoading,
    isFetching,
  } = useGetPackagesQuery(
    { rtl: rtl, is_multi_platform: tenantConstants?.PITCH_MULTIPLATFORM_PACKAGES },
    { skip: !selectedPlatform },
  );
  const [createCart, _] = useCreateCartMutation();
  const { user } = useSelector((state) => state.app.loginUser);
  const PACKAGES_COUNT_MAX = 4;
  const PACKAGES_COUNT = useMemo(
    () => packageData?.packageData?.[activePackageDuration.key]?.length || 0,
    [packageData, activePackageDuration],
  );

  const {
    data: quotaCreditsData,
    isLoading: loading,
    isFetching: fetching,
    error,
    refetch,
  } = useGetQuotaCreditsWidgetDataQuery(
    { ...(user?.id != -1 ? { ['q[user_id_eq]']: user?.id } : {}) },
    {
      skip: !user?.id || !tenantConstants.ALLOW_PACKAGE_UPGRADE,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (package_id || package_slug) {
      if (isMemberArea) {
        onGetPackageClick(Number(package_id));
      } else {
        if (package_slug == user?.package?.slug) {
          notification.error(t('You have already bought this Package'));
          window.open(`${getClassifiedBaseURL()}${getLocaleForURL()}/advertise-with-us/`, '_self');
        } else {
          onGetPackageClick(Number(package_id));
        }
      }
    }
  }, [package_id]);

  const handlePackageDurationChange = (value) => {
    setActivePackageDuration(packageDurations().find((e) => e.key == value));
    packageMonthClickEvent(user, value);
  };

  const [swiperInstance, setSwiperInstance] = useState(null);

  const settings = useMemo(
    () => ({
      slidesPerView: Math.min(PACKAGES_COUNT_MAX, PACKAGES_COUNT),
      spaceBetween: 20,
      navigation: false,
      pagination: false,
      scrollbar: { draggable: true },
      rtl: rtl,
      breakpoints: {
        1366: { slidesPerView: Math.min(4, PACKAGES_COUNT), spaceBetween: 20 },
        1024: { slidesPerView: Math.min(3, PACKAGES_COUNT), spaceBetween: 15 },
        768: { slidesPerView: Math.min(2, PACKAGES_COUNT), spaceBetween: 10 },
        600: { slidesPerView: Math.min(1, PACKAGES_COUNT), spaceBetween: 10 },
        480: { slidesPerView: Math.min(1.5, PACKAGES_COUNT), spaceBetween: 8 },
        320: { slidesPerView: Math.min(1.2, PACKAGES_COUNT), spaceBetween: 5 },
      },
      onSwiper: (swiper) => {
        setSwiperInstance(swiper);
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);

        swiper.on('slideChange', () => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        });

        swiper.on('breakpoint', () => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        });

        swiper.on('resize', () => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        });
      },
    }),
    [PACKAGES_COUNT],
  );

  const onGetPackageClick = async (id, onSuccess = () => {}, packageName, credits = null) => {
    let cart;
    if (id) {
      const packageQty = Math.max(0, Math.round(Number(credits) || 0)) || 1;
      cart = {
        source: 'profolio',
        total_credits: credits,
        listing_id: null,
        listing_expiry_days: null,
        cart_details_attributes: [{ item_id: id, source: 'profolio', item_type: 'Package', quantity: packageQty }],
      };
    }
    const response = await createCart( { cart } );
    if (response) {
      onSuccess();
      if (!response.error) {
        navigate(
          `/checkout?${convertQueryObjToString({
            cart_id: response?.data?.cart?.id,
            ...(redirectUrl && { redirectUrl }),
          })}`,
          { state: { interactedFrom: 'packages', package_type: packageName } },
        );
      }
    }
  };

  const renderPackagesDesktop = () => {
    return packageData?.packageData?.[activePackageDuration.key]?.map((pkg, index) => (
      <PackageCard
        key={pkg.id}
        packageData={pkg}
        onGetPackageClick={(id, onCall, name, credits ) => onGetPackageClick(id, onCall, name, credits)}        
        refundable_amount={packageData?.refundable_amount}
        packageDuration={activePackageDuration?.label}
      />
    ));
  };

  const renderPackagesMobile = () => {
    return packageData?.packageData?.[activePackageDuration.key]?.map((pkg, index) => (
      <PackageCardMobile
        key={pkg.id}
        packageData={pkg}
        onGetPackageClick={(id, onCall , name, credits)=> onGetPackageClick(id, onCall, name, credits)}
        refundable_amount={packageData?.refundable_amount}
      />
    ));
  };

  const renderDesktop = () => (
    <CardPackages template="200px minmax(0, 1fr)" className="mb-0" isRtl={rtl}>
      <div>
        <Text type="secondary" className="d-block fz-14 mb-4">
          {t('Package Duration')}
        </Text>
        <Segmented
          size="small"
          key="packageDurations"
          name="packageDurations"
          value={activePackageDuration.key}
          options={packageDurations()}
          onChange={handlePackageDurationChange}
        />
        <div style={{ marginBlockStart: tenantConstants?.PITCH_MULTIPLATFORM_PACKAGES ? '165px' : '119px' }}>
          <Heading as="h5" className="mb-32">
            {t('Benefits')}
          </Heading>
        </div>
        {packageData?.benefits?.map((benefit, index) => (
          <div key={index} style={{ height: '33px' }}>
            {tenantUtils.getLocalisedString(benefit, 'name')}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <div className="card-container">
          {isLoading ? (
            <PackagesCardSkeleton />
          ) : (
            <CarouselSwiper swiperOptions={settings}>{renderPackagesDesktop()}</CarouselSwiper>
          )}
        </div>
        {PACKAGES_COUNT > PACKAGES_COUNT_MAX && (
          <>
            <Button
              type="primaryOutlined"
              icon="IoIosArrowForward"
              className="next-btn flipX"
              disabled={isEnd}
              onClick={() => swiperInstance?.slideTo(swiperInstance.slides.length - 1)}
              style={{ border: 0, borderRadius: '50%' }}
            />
            <Button
              type="primaryOutlined"
              icon="IoIosArrowBack"
              className="prev-btn flipX"
              disabled={isBeginning}
              onClick={() => swiperInstance?.slideTo(0)}
              style={{ borderRadius: '50%', border: 0 }}
            />
          </>
        )}
      </div>
    </CardPackages>
  );

  const renderMobile = () => (
    <CardPackages isRtl={rtl} style={!isLoading && isFetching ? { opacity: 0.6, pointerEvents: 'none' } : {}}>
      <Flex justify="space-between" align="center" className="mb-12">
        <div>
          <Text type="secondary" className="d-block fz-14 mb-4">
            {t('Package Duration')}
          </Text>

          <Segmented
            size="small"
            key="packageDurations"
            name="packageDurations"
            value={activePackageDuration.key}
            options={packageDurations()}
            onChange={handlePackageDurationChange}
          />
        </div>

        <Flex gap="12px">
          <Button
            className="flipX"
            type="primaryOutlined"
            icon="IoIosArrowBack"
            onClick={() => swiperInstance?.slidePrev()}
            style={{ border: 0, borderRadius: '50%' }}
          />
          <Button
            className="flipX"
            type="primaryOutlined"
            icon="IoIosArrowForward"
            onClick={() => swiperInstance?.slideNext()}
            style={{ border: 0, borderRadius: '50%' }}
          />
        </Flex>
      </Flex>
      {!packageData ? (
        <PackageCardSkeletonMobile />
      ) : (
        <CarouselSwiper swiperOptions={settings}>{renderPackagesMobile()}</CarouselSwiper>
      )}
    </CardPackages>
  );

  return (
    <PackageCardList>
      <Card className="packages-card mb-8" style={{ borderWidth: 0 }} styles={{ body: { padding: 16 } }}>
        {(isMemberArea || !user?.package) && (
          <BannerContainer
            color="#71A7AC"
            breakTag={false}
            className={'package-banner'}
            title={t('Get a business package and enjoy exclusive benefits')}
            listColor="#fff"
            titleColor="#fff"
            titleFontWeight="500"
            listItems={false}
            subtitle={!isMobile && t('Access Profolio, manage agency staff, view lead reports and much more')}
            titleAsH1
          />
        )}
        {!isMemberArea && user?.package && !isMobile && (
          <Flex justify="space-between" align={'center'} className="mb-16">
            <Heading
              className={cx('text-primary ', isMobile ? 'mb-8' : 'mb-0')}
              style={{ fontWeight: '700' }}
              as={isMobile ? 'h5' : 'h3'}
            >
              {quotaCreditsData?.[selectedPlatform?.slug]?.current_package_details?.next_disbursement_date &&
              tenantConstants.ALLOW_PACKAGE_UPGRADE
                ? t('Upgrade your Package to get More Benefits')
                : t('Get a Package According to Your Business Needs')}
            </Heading>
          </Flex>
        )}
        {isMobile ? renderMobile() : renderDesktop()}
      </Card>

      {tenantConstants?.ALLOW_CREDITS_TOPTUP && <TenantComponents.CreditTopUps redirectUrl={redirectUrl} />}
    </PackageCardList>
  );
};
export default OfferedPackages;
