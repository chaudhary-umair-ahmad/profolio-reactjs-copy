import tenantConstants from '@constants';
import tenantTheme from '@theme';
import TenantComponents from '@components';
import { Collapse, Divider, Radio, Space, Typography } from 'antd';
import cx from 'clsx';
import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useCreateCartMutation } from '../../../../apis/cart';
import { useApplyProductMutation } from '../../../../apis/listings';
import { useLazyGetUpsellDetailQuery } from '../../../../apis/postlisting';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';
import SuccessfulPaymentModal from '../../../../components/checkout/successfulPaymentModal';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Group,
  Heading,
  Icon,
  NationalDayGift,
  notification,
  Popover,
  Skeleton,
  Spinner,
} from '../../../../components/common';
import CreditInfo from '../../../../components/credits-info/credits-info';
import PitchPackageModal from '../../../../components/pitch-package-modal/pitchPackageModal';
import { TIME_DATE_FORMAT } from '../../../../constants/formats';
import { ActionButton } from '../../../../container/pages/user-settings/style';
import { Main } from '../../../../container/styled';
import { useRouteNavigate } from '../../../../hooks';
import { pageViewUpsellEvent } from '../../../../services/analyticsService';
import UpsellDesktop from '../../../../static/lottie/bayutUpsellDesktop.json';
import UpsellMobile from '../../../../static/lottie/bayutUpsellMobile.json';
import { getTimeDateString } from '../../../../utility/date';
import { formatPrice } from '../../../../utility/utility';
import { CollapseCard, CollapseRadio, CollapseStyled, UpSellImage } from './style';
import tenantUtils from '@utils';
import { useLocation } from 'react-router-dom';
import { setDashboardSelectedUser } from '../../../../store/appSlice';
import { mapQueryStringToFilterObject } from '../../../../utility/urlQuery';
import { getBaseURL } from '../../../../utility/env';
import LimitNonSaudiNationalModal from '../../../../components/limitNonSaudiNationalModal/LimitNonSaudiNationalModal';
const Lottie = lazy(() => import('../../../../components/common/lottie/lottie'));
import tenantRoutes from '@routes';
import useNationalDay from '../../../../hooks/useNationalDay';
const RadioGroup = Radio.Group;
const { Panel } = Collapse;

const UpgradeListingPage = (props) => {
  const listingId = props?.id;
  const { t } = useTranslation();
  const { isNationalDayActive } = useNationalDay();
  const [total, setTotal] = useState(0);
  const [successModalData, setSuccessModalData] = useState(null);
  const [serviceSelected, setServiceSelected] = useState({});
  const [activeProduct, setActiveProduct] = useState(null);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [pitchPackageVisible, setPitchPackageVisible] = useState(false);
  const user = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const navigate = useRouteNavigate();
  const serviceRefs = useRef({});
  const [applyProduct] = useApplyProductMutation();
  const { isMemberArea } = useSelector((state) => state.app.AppConfig);
  const [getUpsellDetail, { data: upsellData, isLoading: loading, error, refetch }] = useLazyGetUpsellDetailQuery();

  const [createCart, _] = useCreateCartMutation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { queryObj } = mapQueryStringToFilterObject(location.search);

  useEffect(() => {
    queryObj?.nafath_verified &&
      (user?.is_saudi_national
        ? notification.success(t('Nafath Verification Complete!'))
        : isMemberArea
          ? navigate(tenantRoutes.app()?.listings?.path)
          : navigate(tenantRoutes.app()?.dashboard.path));
  }, [queryObj?.nafath_verified]);

  useEffect(() => {
    upsellData?.ksa?.listing && pageViewUpsellEvent(user, upsellData?.ksa?.listing);
  }, [upsellData]);

  useEffect(() => {
    getUpsellDetail({
      listing_id: listingId,
    });
  }, [upsellData]);

  useEffect(() => {
    if (listingId && location?.state?.listingDispositionSlug == 'ad-in-review') {
      tenantUtils.showTruBrokerStatusNotification(user);
      dispatch(setDashboardSelectedUser({ ...user }));
    }
  }, [user?.active_listings_count]);

  useEffect(() => {
    handleInitialSelection();
  }, [upsellData]);

  useEffect(() => {
    handleTotal();
  }, [serviceSelected, activeProduct]);

  const tierAmount = (tierMap, duration) => {
    if (tierMap == null) return 0;
    if (typeof tierMap !== 'object' || Array.isArray(tierMap)) {
      const n = Number(tierMap);
      return Number.isFinite(n) ? n : 0;
    }
    const d = duration != null && duration !== '' ? String(duration) : '30';
    const raw = tierMap[d] ?? tierMap[Number(d)] ?? tierMap['30'] ?? tierMap[30];
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  };

  const handleTotal = () => {
    const availableCredits = upsellData?.ksa?.availableCredits;
    const creditUnitPrice = upsellData?.ksa?.creditUnitPrice ?? 0;
    const pricingKey = availableCredits ? 'requiredCredits' : 'price';
    let total = 0;
    if (activeProduct) {
      const precomputed = Number(activeProduct.activePrice);
      total += Number.isFinite(precomputed)
        ? precomputed
        : tierAmount(
            availableCredits ? activeProduct.requiredCredits : activeProduct.price,
            activeProduct.activeDuration,
          );
    }
    selectedProducts.forEach((key) => {
      const service = upsellData?.ksa?.subServices?.find((e) => e.id == key);
      if (service) {
        total += tierAmount(service?.[pricingKey], service?.activeDuration);
      }
    });
    setTotal(total);

    const shortfall = Math.max(0, total - (availableCredits ?? 0));
    setRequiredAmount({
      credits: shortfall,
      amount: shortfall * creditUnitPrice,
    });
  };

  const handleInitialSelection = () => {
    let signatureProduct = null;
    if (!upsellData?.ksa?.isPosted) {
      signatureProduct = upsellData?.ksa?.applicableProducts?.find((e) => e.slug === 'signature-listing');
      setActiveProduct({
        ...signatureProduct,
        activePrice: upsellData?.ksa?.availableCredits
          ? signatureProduct?.requiredCredits[signatureProduct?.activeDuration]
          : signatureProduct?.price[signatureProduct?.activeDuration],
      });
    } else {
      setActiveProduct(null);
    }
  };

  const selectedProducts = useMemo(() => {
    const products = [];
    activeProduct?.id && products.push(activeProduct?.id);
    Object.keys(serviceSelected).forEach((e) => {
      serviceSelected[e] && products.push(parseInt(e));
    });
    return products;
  }, [activeProduct, serviceSelected]);

  const applyProducts = async (isPosted) => {
    setButtonLoading(true);
    const form_values = Object.keys(serviceRefs.current).reduce((acc, key) => {
      if (serviceRefs.current[key]) {
        acc[key] = serviceRefs.current[key].getValues();
      }
      return acc;
    }, {});
    const serviceKeys = ['photography-service', 'videography-service', 'drone-footage-service'];
    const add_ons = serviceKeys.reduce((acc, slug) => {
      if (form_values[slug]) {
        const service = upsellData?.ksa?.subServices?.find((s) => s.slug === slug);
        acc.push({
          product_id: service?.id,
          comments: form_values[slug].comments || null,
          requested_at: getTimeDateString(form_values[slug].requested_at, TIME_DATE_FORMAT, false, true),
        });
      }
      return acc;
    }, []);
    const payload = {
      product_ids: selectedProducts,
      ...(add_ons.length > 0 && { add_ons }),
    };
    const response = await applyProduct({ listingId, body: payload });
    if (response) {
      setButtonLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        if (!isPosted) {
          // postListingClickEvent(user, response?.status, listingData )
          notification.success(t('Listing Posted Successfully'));
        } else {
          // upgradeButtonUpsellClickEvent(user, response )
          notification.success(t('Listing Updated Successfully'));
        }
        !isPosted ? setSuccessModalData({ listing_id: listingId }) : navigate('/listings');
      }
    }
  };

  const createUpsellCart = async () => {
    setButtonLoading(true);
    const form_values = Object.keys(serviceRefs.current).reduce((serviceRef, key) => {
      serviceRef[key] = serviceRefs.current[key]?.getValues();
      return serviceRef;
    }, {});

    const currency = upsellData?.ksa?.currency;
    const currentCredits = upsellData?.ksa?.availableCredits ?? 0;
    const creditUnitPrice = upsellData?.ksa?.creditUnitPrice;
    const total_credits = currency === 'Credits' ? total - currentCredits : total / creditUnitPrice;

    const availableCredits = upsellData?.ksa?.availableCredits;
    const useCreditPricing = !!availableCredits;
    const lineCreditsForProductId = (productId) => {
      if (activeProduct?.id == productId) {
        const raw = activeProduct?.activePrice ?? 0;
        return useCreditPricing ? raw : raw / (creditUnitPrice || 1);
      }
      const service = upsellData?.ksa?.subServices?.find((e) => e.id == productId);
      if (!service) return 0;
      const key = useCreditPricing ? 'requiredCredits' : 'price';
      const raw = service?.[key]?.[30] ?? 0;
      return useCreditPricing ? raw : raw / (creditUnitPrice || 1);
    };

    const cart = {
      total_credits,
      listing_expiry_days: activeProduct?.activeDuration || upsellData?.ksa?.listing?.expiry_days,
      source: 'profolio',
      listing_id: listingId,
      cart_details_attributes: [],
    };

    cart.cart_details_attributes = selectedProducts.map((item) => {
      const quantity = Math.max(0, Math.round(lineCreditsForProductId(item)));
      const service = upsellData?.ksa?.subServices?.find((e) => e.id == item);
      if (service) {
        return {
          item_id: item,
          item_type: 'Product',
          source: 'profolio',
          quantity,
          add_on_details: {
            description: form_values[service.slug]?.comments || null,
            requested_at: getTimeDateString(form_values[service.slug]?.requested_at, TIME_DATE_FORMAT, false, true),
          },
        };
      }
      return { item_id: item, item_type: 'Product', source: 'profolio', quantity };
    });
    const response = await createCart(cart);
    if (!response?.error) {
      setButtonLoading(false);
      if (response) {
        navigate(`/checkout?cart_id=${response?.data?.cart?.id}&upgrade_listing=true`, {
          state: {
            disposition: upsellData?.ksa?.listing?.disposition?.slug,
            status: upsellData?.ksa?.listing?.status?.slug,
            interactedFrom: 'upsell',
          },
        });
      }
    } else if (response?.error) {
      notification.error(response.error);
      setButtonLoading(false);
    }
  };

  const handleCheckout = async () => {
    const currentCredits = upsellData?.ksa?.availableCredits;
    const isPosted = upsellData?.ksa?.isPosted;
    let isValid = true;

    const serviceRefsKeys = Object.keys(serviceRefs.current);
    const errorPromises = serviceRefsKeys.map(async (key) => {
      const serviceRef = serviceRefs.current[key];
      if (serviceRef) {
        serviceRef.handleSubmit();
        const errors = await serviceRef.getErrors();
        if (errors) {
          isValid = false;
        }
        return errors;
      } else {
        return true;
      }
    });
    await Promise.all(errorPromises);
    if (isValid) {
      if (total > currentCredits) {
        createUpsellCart();
      } else {
        applyProducts(isPosted);
      }
    }
  };


  const getProductsData = async () => {
    // refetch({
    //   listingId: listingId,
    //   platforms: user?.platforms,
    //   upSell: true,
    //   listingDetailResponse: listingDataResponse,
    // });
  };

  const onChangeCheckbox = (service, platform) => () => {
    const updatedSelectedServices = {
      ...serviceSelected,
      [service.id]: !serviceSelected[service.id],
    };
    setServiceSelected(updatedSelectedServices);
  };

  const onClickProduct = (prod, platform) => {
    const availableCredits = upsellData?.[platform?.slug]?.availableCredits;
    if (activeProduct?.id != prod.id) {
      setActiveProduct({
        ...prod,
        activePrice: availableCredits ? prod.requiredCredits[prod.activeDuration] : prod.price[prod.activeDuration],
      });
    } else if (upsellData?.[platform?.slug]?.isPosted) {
      setActiveProduct(null);
    }
  };


  const renderAlert = (platform) => {
    return (
      <>
        {!!upsellData?.[platform?.slug]?.availableCredits && total > upsellData?.[platform?.slug]?.availableCredits && (
          <Alert
            style={{ padding: 0 }}
            className={isMobile ? 'mb-16' : 'mb-24'}
            showIcon
            type=""
            icon={
              <Icon className="color-gray-dark" icon="HiInformationCircle" size={16} style={{ marginTop: '2px' }} />
            }
            message={
              <div
                className={cx('color-gray-light', isMobile ? 'fz-12' : 'fz-14')}
                style={{ paddingBlockStart: !isMobile && '3px', lineHeight: isMobile && 1.5 }}
              >
                {t('Insufficient Credits')}
                {'.'} {t('Pay')}{' '}
                <strong className="color-primary">
                  {tenantConstants.CURRENCY_SYMBOL()}
                  {formatPrice(Math.round(requiredAmount?.amount))}
                </strong>{' '}
                {t(`for the additional {{credits}} credits at checkout`, { credits: requiredAmount?.credits })}
              </div>
            }
          />
        )}
      </>
    );
  };

  const currencyHandler = (prod, currency) => {
    if (currency != 'Credits') {
      return (
        <div>
          {currency}{' '}
          {activeProduct && prod.id === activeProduct?.id
            ? prod.price[activeProduct?.activeDuration]
            : prod.price[prod?.activeDuration]}
        </div>
      );
    } else {
      return (
        <div>
          <strong className="fs16">
            {activeProduct && prod.id === activeProduct.id
              ? prod.requiredCredits[activeProduct?.activeDuration]
              : prod.requiredCredits[prod?.activeDuration]}{' '}
          </strong>
          {t('Credits')}
          {/* <div className="fs12 color-gray-lightest">{t('Credits Required')}</div> */}
        </div>
      );
    }
  };

  return user?.is_credit_user ? (
    user?.platforms.map((platform) => (
      <Main key={platform?.slug}>
        <LimitNonSaudiNationalModal actionSource="upgrade" />
        <div style={{ maxWidth: 800, marginInline: 'auto' }}>
          {loading ? (
            <Card bodyStyle={{ padding: isMobile ? 16 : '24px 40px 32px' }}>
              <Space size={16} direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                <Skeleton type="image" active />
                <Skeleton type="title" active />
                {[1, 2, 3].map((e) => (
                  <Skeleton key={e} type="button" style={{ height: 90 }} size={'large'} block active />
                ))}
              </Space>
            </Card>
          ) : error ? (
            <EmptyState title={''} message={error} onClick={getProductsData} />
          ) : upsellData ? (
            <>
              <Card bodyStyle={{ padding: isMobile ? 16 : '24px 40px 32px' }}>
                {/* {upsellData?.[platform?.slug]?.isPosted && (
              <Button type="link" size="large" style={{ height: 40 }} href="/listings">
                {t('Skip')}
              </Button>
            )} */}
                <div className={cx('color-gray-lightest text-center ', isMobile ? 'mb-16' : 'mb-24')}>
                  <UpSellImage>
                    <Suspense fallback={<Spinner />}>
                      <Lottie animationData={isMobile ? UpsellMobile : UpsellDesktop} />
                    </Suspense>
                  </UpSellImage>

                  <Heading style={{ color: tenantTheme['base-color'] }} as={isMobile ? 'h4' : 'h2'} className="mb-4">
                    {t(upsellData?.[platform?.slug]?.headingMsg)}
                  </Heading>
                  {t(upsellData?.[platform?.slug]?.descriptionMsg)}
                </div>

                {!!upsellData?.[platform?.slug]?.applicableProducts?.length && (
                  <div className={isMobile ? 'mb-4' : 'mb-8'}>
                    <Heading className="mb-12" as="h6" style={{ fontWeight: '700' }}>
                      {t('Upgrade your listing to get more leads')}
                    </Heading>

                    <RadioGroup style={{ width: '100%' }} value={activeProduct?.id}>
                      {upsellData?.[platform?.slug]?.applicableProducts?.map((prod, index) => (
                        <CollapseStyled
                          key={index}
                          activeKey={null}
                          style={{ backgroundColor: 'white' }}
                          className={cx('mb-12', activeProduct?.id == prod.id && 'listing-card')}
                          onChange={() => onClickProduct(prod, platform)}
                        >
                          <Panel
                            key={prod.id}
                            showArrow={false}
                            // style={{ marginBottom: isMobile ? 10 : 12 }}
                            header={
                              <>
                                <TenantComponents.Product
                                  title={t(prod.title)}
                                  icon={prod.icon}
                                  iconColor={prod.iconColor}
                                  iconSize={14}
                                  dropDown={
                                    upsellData?.[platform?.slug]?.availableCredits <
                                      prod?.requiredCredits[prod?.activeDuration] &&
                                    !upsellData?.[platform?.slug]?.isPosted && (
                                      <>
                                        <Tooltip
                                          placement="top"
                                          title={t('This listing will expire based on the ad license expiry date.')}
                                        >
                                          <>
                                            <Icon
                                              icon="AiOutlineInfoCircle"
                                              size="1em"
                                              color={tenantTheme['primary-color']}
                                              style={{ marginBottom: -22}}
                                            />
                                          </>
                                        </Tooltip>
                                      </>
                                    )
                                  }
                                  description={t(prod.description)}
                                  isRecommended={prod.isRecommended}
                                  price={
                                    (prod?.slug === 'basic-listing' && isNationalDayActive) ?
                                      <NationalDayGift /> :
                                      <CollapseRadio key={index} value={prod.id}>
                                        {currencyHandler(prod, upsellData?.[platform?.slug]?.currency)}
                                      </CollapseRadio>
                                  }
                                />
                              </>
                            }
                          ></Panel>
                        </CollapseStyled>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {!!upsellData?.[platform?.slug]?.subServices?.length && (
                  <div className={isMobile ? 'mb-16' : 'mb-24'}>
                    <Heading className="mb-12" as="h6" style={{ fontWeight: '700' }}>
                      {t('Add additional services to stand out')}
                    </Heading>

                    <Card style={{ borderWidth: 1 }}>
                      <Group gap="12px">
                        {upsellData?.[platform?.slug]?.subServices &&
                          upsellData?.[platform?.slug]?.subServices?.map((service, i) => (
                            // <div onClick={onChangeCheckbox(service, platform)} style={{ cursor: 'pointer' }}>
                            <TenantComponents.Product
                              key={i}
                              title={t(service.title)}
                              description={t(service.description)}
                              icon={service.icon}
                              iconColor={service.iconColor}
                              iconSize={14}
                              price={
                                <div className="align-center-v color-primary" style={{ gap: 6 }}>
                                  {upsellData?.[platform?.slug]?.availableCredits == 0 &&
                                    upsellData?.[platform?.slug]?.currency}
                                  <strong className="fs16">
                                    {upsellData?.[platform?.slug]?.availableCredits
                                      ? service.requiredCredits[service?.activeDuration]
                                      : service.price[service?.activeDuration]}
                                  </strong>
                                  {upsellData?.[platform?.slug]?.availableCredits > 0 && t('Credits')}
                                  <Checkbox
                                    onChange={onChangeCheckbox(service, platform)}
                                    value={serviceSelected[service?.id]}
                                    id={service.id}
                                    style={{ marginInlineStart: 8 }}
                                  />
                                </div>
                              }
                              discountedPrice={upsellData?.[platform?.slug]?.availableCredits ? '' : service.oldPrice}
                              className="align-items-center"
                              extra={
                                serviceSelected?.[service.id] && (
                                  <CollapseCard
                                    style={{ borderWidth: 0 }}
                                    styles={{ body: { padding: 16 } }}
                                    className="collapse-card"
                                  >
                                    <TenantComponents.ServiceOptions
                                      ref={(el) => (serviceRefs.current[service.slug] = el)}
                                      template={isMobile ? 'initial' : 'repeat(2,1fr)'}
                                      style={{ alignItems: 'baseline' }}
                                    />
                                  </CollapseCard>
                                )
                              }
                            />
                            // </div>
                          ))}
                      </Group>
                    </Card>
                  </div>
                )}
                {(!!upsellData?.[platform?.slug]?.applicableProducts.length ||
                  !!upsellData?.[platform?.slug]?.subServices.length) &&
                  upsellData?.[platform?.slug]?.availableCredits > 0 && (
                    <CreditInfo
                      className={'mb-16'}
                      cardStyle={{ width: '100%' }}
                      isMobile={isMobile}
                      loading={loading}
                      user={user}
                    />
                  )}
                {renderAlert(platform)}
                {isMobile && (
                  <Button
                    style={{ marginInlineEnd: 'auto' }}
                    onClick={() => {
                      upsellData?.[platform?.slug]?.isPosted
                        ? navigate(`/listings`)
                        : navigate(`/post-listing/${listingId}`);
                    }}
                    type="link"
                    size={!isMobile && 'large'}
                    // loading={buttonLoading}
                    disabled={buttonLoading}
                    className="p-0"
                  >
                    {upsellData?.[platform?.slug]?.isPosted ? t('View All Listings') : t('Edit Listing')}
                  </Button>
                )}

                {(!!upsellData?.[platform?.slug]?.applicableProducts.length ||
                  !!upsellData?.[platform?.slug]?.subServices.length) && (
                  <>
                    {!isMobile && <Divider style={{ marginBlock: '12px 24px' }} />}
                    <ActionButton>
                      {!isMobile && (
                        <Button
                          style={{ marginInlineEnd: 'auto' }}
                          onClick={() => {
                            upsellData?.[platform?.slug]?.isPosted
                              ? navigate(`/listings`)
                              : navigate(`/post-listing/${listingId}`);
                          }}
                          type="link"
                          size={isMobile ? 'small' : 'large'}
                          // loading={buttonLoading}
                          disabled={buttonLoading}
                          className="p-0"
                        >
                          {upsellData?.[platform?.slug]?.isPosted ? t('View All Listings') : t('Edit Listing')}
                        </Button>
                      )}
                      <div className="color-gray-lightest">
                        <div>{t('Total')}</div>
                        <Typography.Text className="fs16">
                          <strong>{total}</strong>{' '}
                          {upsellData?.[platform?.slug]?.currency === 'Credits'
                            ? t('Credits')
                            : tenantConstants.CURRENCY_SYMBOL()}
                        </Typography.Text>
                      </div>

                      <Button
                        style={{ maxWidth: isMobile ? '178px' : '190px', width: '100%' }}
                        onClick={() => {
                          !user.is_package_user ? setPitchPackageVisible(true) : handleCheckout();
                        }}
                        type="primary"
                        // size={isMobile ? 'middle' : 'large'}
                        disabled={
                          upsellData?.[platform?.slug]?.isPosted
                            ? !selectedProducts.length
                            : !activeProduct?.id || (user?.is_nafaz_verified && !user?.is_saudi_national)
                        }
                        loading={buttonLoading}
                      >
                        {upsellData?.[platform?.slug]?.isPosted ? t('Upgrade') : t('Post Listing')}
                      </Button>
                    </ActionButton>
                  </>
                )}
              </Card>
              {isMobile && <div style={{ height: 20 }}></div>}
            </>
          ) : (
            <Card bodyStyle={{ padding: isMobile ? 16 : '24px 40px 32px' }}>
              <EmptyState type={'table'} hideRetryButton />
            </Card>
          )}
        </div>
        <PitchPackageModal
          visible={pitchPackageVisible}
          setIsVisible={setPitchPackageVisible}
          onContinue={handleCheckout}
        />
        <SuccessfulPaymentModal data={successModalData} setData={setSuccessModalData} />
      </Main>
    ))
  ) : (
    <EmptyState title={''} message={t('You are not authorised to access this page!')} hideRetryButton />
  );
};

export default UpgradeListingPage;
