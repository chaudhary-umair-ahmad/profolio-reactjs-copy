import tenantConstants from '@constants';
import TenantComponents from '@components';
import tenantTheme from '@theme';
import { Collapse, Space, Typography } from 'antd';
import cx from 'clsx';
import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useCreateCartMutation } from '../../../../apis/cart';
import { useApplyProductMutation } from '../../../../apis/listings';
import { useGetUpsellDetailQuery } from '../../../../apis/postlisting';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Flex,
  Heading,
  Icon,
  notification,
  ProductTag,
  Skeleton,
  Spinner,
  Text,
} from '../../../../components/common';
import { ActionButton } from '../../../../container/pages/user-settings/style';
import { Main } from '../../../../container/styled';
import { useRouteNavigate } from '../../../../hooks';
import UpsellDesktop from '../../../../static/lottie/bayutUpsellDesktop.json';
import UpsellMobile from '../../../../static/lottie/bayutUpsellMobile.json';
import { getAppSource } from '../../../../store/parentApi';
import { capitalizeFirstLetter, formatPrice } from '../../../../utility/utility';
import { CollapseRadio, CollapseStyled, UpSellImage } from './style';
import { pageViewUpsellEvent, upgradeButtonUpsellClickEvent } from '../../../../services/analyticsService';
const Lottie = lazy(() => import('../../../../components/common/lottie/lottie'));
const { Panel } = Collapse;

const UpgradeListingPage = (props) => {
  const listingId = props?.id;
  const { t } = useTranslation();
  const navigate = useRouteNavigate();
  const [disabled, setDisable] = useState(false);
  const [selection, setSelection] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [applyProduct] = useApplyProductMutation();
  const [createCart, _] = useCreateCartMutation();
  const { isMobile, locale, isMultiPlatform } = useSelector((state) => state.app.AppConfig);

  const platformProductSlugs = { bayut: 'hot-listing', dubizzle: 'feature' };

  const {
    data: upsellData,
    isLoading: loading,
    error,
  } = useGetUpsellDetailQuery(
    {
      listing_id: listingId,
      platformProductSlugs,
    },
    { skip: !listingId, refetchOnMountOrArgChange: true },
  );

  const { descriptionMsg, headingMsg, listing, currency, platforms = {} } = upsellData || {};
  const user = useSelector((state) => state.app.loginUser.user);
  useEffect(() => {
    const listingForAnalytics = upsellData?.listing?.listing ?? upsellData?.listing;
    if (listingForAnalytics && user) {
      pageViewUpsellEvent(user, listingForAnalytics);
    }
  }, [upsellData, user]);
  useEffect(() => {
    if (upsellData && platforms && typeof platforms === 'object') {
      setSelection(() => {
        const data = {};
        Object.keys(platforms).forEach((pl) => {
          data[pl] = (platforms[pl]?.products || []).map((e) => ({ ...e, selected: true }));
        });
        return data;
      });
    }
  }, [upsellData]);

  const getTotal = (currency) => {
    return Object.values(selection || {})?.reduce((total, platform) => {
      platform?.forEach((prod) => {
        if (prod?.selected) {
          currency === tenantConstants.CURRENCY
            ? (total += prod?.price?.[prod?.activeDuration] || 0)
            : (total += prod?.requiredCredits?.[prod?.activeDuration] || 0);
        }
      });
      return total;
    }, 0);
  };

  const getRequiredCredits = (platform) => {
    let total = 0;
    selection?.[platform]?.forEach((prod) => {
      total += prod?.requiredCredits[prod?.activeDuration] || 0;
    });
    return total;
  };

  const getMissingCredits = (platform) => {
    let total = 0;
    const availableCredits = platforms?.[platform]?.availableCredits || 0;
    const required = getRequiredCredits(platform) || 0;

    if (required > availableCredits) {
      total = required - availableCredits;
    }
    return total;
  };

  const applyProducts = async () => {
    setButtonLoading(true);
    const selectedProducts = Object.values(selection).flatMap((platform) =>
      platform.filter((item) => item?.selected === true),
    );
    const selectedIds = selectedProducts.map((item) => item.id);
    const appliedProductTitle = selectedProducts.map((item) => item.appliedTitle);
    const payload = {
      product_ids: selectedIds,
    };
    const response = await applyProduct({ listingId, body: payload });
    upgradeButtonUpsellClickEvent(user, response, appliedProductTitle, response?.data?.listing);
    if (response) {
      setButtonLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        notification.success(t('Listing Updated Successfully'));
        navigate('/listings');
      }
    }
  };

  const createUpsellCart = async () => {
    setButtonLoading(true);
    const total_credits = Object.keys(selection || {}).reduce((acc, platform) => acc + (getMissingCredits(platform) || 0), 0);

    const rows = [];
    Object.keys(selection || {}).forEach((platform) => {
      if (getMissingCredits(platform) <= 0) return;
      selection[platform]
        ?.filter((item) => item?.selected)
        ?.forEach((item) => {
          const cup = platforms?.[platform]?.creditUnitPrice;
          const w =
            currency === tenantConstants.CURRENCY
              ? cup
                ? (item?.price?.[item?.activeDuration] || 0) / cup
                : item?.requiredCredits?.[item?.activeDuration] || 0
              : item?.requiredCredits?.[item?.activeDuration] || 0;
          rows.push({ item, quantity: Math.max(0, Math.round(w)) });
        });
    });

    const cart = {
      total_credits,
      listing_expiry_days: listing?.listingExpiryDays,
      source: getAppSource(),
      listing_id: listingId,
      cart_details_attributes: rows.map((row) => ({
        item_id: row.item?.id,
        item_type: 'Product',
        source: getAppSource(),
        quantity: row.quantity,
      })),
    };
    const response = await createCart(cart);
    if (!response?.error) {
      setButtonLoading(false);
      if (response) {
        navigate(`/checkout?cart_id=${response?.data?.cart?.id}&upgrade_listing=true`, {
          state: {
            disposition: listing?.disposition?.slug,
            status: listing?.status?.slug,
            interactedFrom: 'upsell',
          },
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (
      currency === tenantConstants.CURRENCY ||
      Object.keys(selection).reduce((acc, platform) => (acc += getMissingCredits(platform) || 0), 0) > 0
    ) {
      createUpsellCart();
    } else {
      applyProducts();
    }
  };

  const currencyHandler = (prod, currency, availableCredits) => {
    if (t(currency) === t(tenantConstants.CURRENCY)) {
      return (
        <div className="fs12 color-gray-lightest">
          {prod?.price[prod?.activeDuration]} {tenantConstants.CURRENCY_SYMBOL()} {t('Required')}
        </div>
      );
    } else {
      return (
        <div className="fs12 color-gray-lightest">
          {prod?.requiredCredits[prod?.activeDuration]}
          {`/${formatPrice(availableCredits)}`} {t('Credits')}
        </div>
      );
    }
  };

  const handleCheck = (plat, prod) => {
    setSelection((prevSelection) => {
      const updatedSelection = { ...prevSelection };

      if (!updatedSelection[plat]) {
        updatedSelection[plat] = [];
      }

      const productIndex = updatedSelection[plat].findIndex((e) => e.slug === prod.slug);

      if (productIndex !== -1) {
        updatedSelection[plat][productIndex].selected = !updatedSelection[plat][productIndex].selected;
      } else {
        updatedSelection[plat].push({ ...prod, selected: true });
      }

      const hasSelectedProducts = Object.values(updatedSelection).some((products) =>
        products.some((product) => product.selected),
      );
      setDisable(!hasSelectedProducts);

      return updatedSelection;
    });
  };

  const iconMapping = {
    bayut: locale === 'ar' ? 'BayutLogoAr' : 'BayutLogoEn',
    dubizzle: locale === 'ar' ? 'DubizzleLogoAr' : 'DubizzleLogo',
  };

  const panelDesc = Object.entries(selection)
    ?.map(([platform]) => {
      const products = upsellData?.platforms?.[platform]?.products ?? [];
      const productNames = products
        .map((prod) => prod.name)
        .filter(Boolean)
        .join(', ');

      return productNames ? `${t(productNames)} ${t('on')} ${t(capitalizeFirstLetter(platform))}` : null;
    })
    ?.filter(Boolean)
    ?.join(` ${t('and')} `);

  const posted =
    useMemo(() => {
      return Object.keys(platforms || {}).reduce((result, plat) => {
        return result && platforms?.[plat]?.isPosted;
      }, false);
    }, [platforms]) || false;

  const allProductsEmpty =
    useMemo(() => {
      return Object.keys(platforms || {}).every((plat) => (platforms?.[plat]?.products || []).length === 0);
    }, [platforms]) || false;

  return user?.is_credit_user ? (
    <Main>
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
          <EmptyState title={''} message={error} />
        ) : upsellData ? (
          <>
            <Card bodyStyle={{ padding: isMobile ? 16 : '24px 40px 32px', marginBottom: isMobile && '20px' }}>
              <div className={cx('color-gray-lightest text-center ', isMobile ? 'mb-16' : 'mb-24')}>
                <UpSellImage>
                  <Suspense fallback={<Spinner />}>
                    <Lottie animationData={isMobile ? UpsellMobile : UpsellDesktop} />
                  </Suspense>
                </UpSellImage>

                <Heading style={{ color: tenantTheme['base-color'] }} as={isMobile ? 'h4' : 'h2'} className="mb-4">
                  {t(headingMsg)}
                </Heading>
                {t(descriptionMsg)}
                {isMultiPlatform &&
                  ` ${t('on')} ${Object.keys(platforms || {})
                    .filter((platform) => platforms[platform]?.isPosted)
                    .map((platform) => t(capitalizeFirstLetter(platform)))
                    .join(` ${t('and')} `)}`}
              </div>
              {Object.values(selection)?.flatMap((platform) => platform)?.length > 0 ? (
                <>
                  <div className={isMobile ? 'mb-4' : 'mb-8'}>
                    <CollapseStyled
                      activeKey={1}
                      style={{ backgroundColor: 'white', borderRadius: '12px' }}
                      className={cx('mb-24', 'listing-card')}
                      bordered={false}
                    >
                      <Panel
                        key={1}
                        showArrow={false}
                        header={
                          <>
                            <TenantComponents.Product
                              title={t('Get More Leads with an Upgrade')}
                              icon={'UpgradeIcon'}
                              iconSize={20}
                              // iconColor={tenantTheme['white']}
                              iconBackgroundColor="transparent"
                              description={`${t('Secure top slots upgrading to')} ${panelDesc}`}
                              price={
                                <CollapseRadio checked={true}>
                                  {t(currency)} {getTotal(currency)}
                                </CollapseRadio>
                              }
                            />
                          </>
                        }
                      >
                        <div style={{ marginInlineStart: '35px' }}>
                          <Flex vertical={isMobile} align="center" gap="30px">
                            {Object.keys(platforms)?.length > 0
                              ? Object.keys(platforms)?.map((plat) => {
                                  return platforms[plat]?.products?.map((prod) => {
                                    const selected = selection?.[plat]?.find((e) => e?.slug == prod?.slug)?.selected;
                                    return (
                                      <div key={prod?.slug} className={isMobile ? 'w-100' : ''}>
                                        <Flex align="center" justify={isMobile ? 'space-between' : ''} gap="8px">
                                          <Flex align="center" gap="8px">
                                            <Checkbox value={selected} onChange={() => handleCheck(plat, prod)} />{' '}
                                            <Icon
                                              size="50px"
                                              style={{
                                                height: '20px',
                                                marginTop: plat === 'dubizzle' && '-5px',
                                              }}
                                              icon={iconMapping[plat] || undefined}
                                            />
                                          </Flex>
                                          <ProductTag
                                            key={prod?.slug}
                                            icon={prod?.icon}
                                            iconColor={prod?.iconColor}
                                            color={prod?.color}
                                            iconProps={prod?.iconProps}
                                            hideIconInTag={prod?.hideIconInTag}
                                            size={12}
                                            name={prod?.name ?? prod?.title}
                                          />
                                        </Flex>
                                        <Text>
                                          {currencyHandler(prod, currency, platforms[plat]?.availableCredits)}
                                        </Text>
                                      </div>
                                    );
                                  });
                                })
                              : null}
                          </Flex>
                        </div>
                      </Panel>
                    </CollapseStyled>
                  </div>
                  <Flex style={{ alignItems: 'center' }}>
                    {Object.keys(selection).reduce((acc, platform) => (acc += getMissingCredits(platform) || 0), 0) >
                      0 &&
                      currency === 'Credits' && (
                        <Alert
                          style={{ padding: 0, maxWidth: '320px' }}
                          className={isMobile ? 'mb-16' : 'mb-0'}
                          showIcon
                          type=""
                          icon={
                            <Icon
                              className="color-gray-dark"
                              icon="HiInformationCircle"
                              size={16}
                              style={{ marginTop: '2px' }}
                            />
                          }
                          message={
                            <div
                              className={cx('color-gray-light', isMobile ? 'fz-12' : 'fz-14')}
                              style={{ paddingBlockStart: !isMobile && '3px', lineHeight: isMobile && 1.5 }}
                            >
                              {t('Insufficient Credits')}
                              {'.'} {t('Pay')}{' '}
                              <strong className="color-primary">
                                {tenantConstants.CURRENCY_SYMBOL()}{' '}
                                {formatPrice(
                                  Math.round(
                                    Object.keys(selection).reduce(
                                      (acc, platform) =>
                                        (acc +=
                                          getMissingCredits(platform) * platforms[platform]?.creditUnitPrice || 0),
                                      0,
                                    ),
                                  ),
                                )}
                              </strong>{' '}
                              {t('for the additional {{credits}} credits at checkout', {
                                credits: Object.keys(selection).reduce(
                                  (acc, platform) => (acc += getMissingCredits(platform) || 0),
                                  0,
                                ),
                              })}
                            </div>
                          }
                        />
                      )}
                    {
                      <ActionButton style={{ alignItems: 'center', flex: 'auto' }}>
                        <div className="color-gray-lightest">
                          <div>{t('Total')}</div>
                          <Typography.Text className="fs16">
                            <strong>
                              {t(currency)} {getTotal(currency)}
                            </strong>
                          </Typography.Text>
                        </div>
                        <Button
                          style={{ maxWidth: isMobile ? '178px' : '190px', width: '100%' }}
                          onClick={() => {
                            handleSubmit();
                          }}
                          type="primary"
                          loading={buttonLoading}
                          disabled={disabled}
                        >
                          {t('Continue')}
                        </Button>
                      </ActionButton>
                    }
                  </Flex>
                </>
              ) : !posted ? (
                <div className={cx('color-gray-lightest text-center ', isMobile ? 'mb-16' : 'mb-24')}>
                  {t('No Products Applicable')}
                </div>
              ) : (
                posted &&
                allProductsEmpty && (
                  <div className={cx('color-gray-lightest text-center ', isMobile ? 'mb-16' : 'mb-24')}>
                    {t('Products have been successfully applied')}
                  </div>
                )
              )}
            </Card>
          </>
        ) : (
          <Card bodyStyle={{ padding: isMobile ? 16 : '24px 40px 32px' }}>
            <EmptyState type={'table'} hideRetryButton />
          </Card>
        )}
      </div>
    </Main>
  ) : (
    <EmptyState title={''} message={t('You are not authorised to access this page!')} hideRetryButton />
  );
};

export default UpgradeListingPage;
