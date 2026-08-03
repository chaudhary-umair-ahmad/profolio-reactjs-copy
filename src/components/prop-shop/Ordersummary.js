import tenantData from '@data';
import tenantUtils from '@utils';
import { Col, Divider, Row, Space } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, EmptyState, Icon, Number, Skeleton, Alert, Flex } from '../../components/common';
import { formatPrice } from '../../utility/utility';
import { IllustrationEmptyCart } from '../svg';
import { OrderSummaryFull } from './Style';
import tenantConstants from '@constants';
import { useGetLocation } from '../../hooks';
import { MultiPlatformIcon } from '../svg';
import cx from 'clsx';
import MultiPlatform from '../common/multiplatform';
const OrderSummary = ({
  checkoutButtonText,
  handleCheckout,
  buttonProps,
  disableProceedButton,
  showIcon = true,
  proceedButtonLoading,
  hidePrice,
  installmentStr,
  cartData,
  isCartLoading,
  inError,
  getCartData,
  hideCheckoutButton = false,
}) => {
  const products = tenantData.products;
  const { t } = useTranslation();
  const user = useSelector((state) => state.app.loginUser.user);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const location = useGetLocation();
  const params = new URLSearchParams(location.search);
  const isPostListing = params.get('post_listing') === 'true';
  const IS_LISTING_CART = !!cartData?.listing_id;
  const HIDE_CREDITS_INFO = !!cartData?.purchasedFullCredits;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const total = useMemo(() => {
    if (!cartData || !cartData.cartProducts) return 0;

    return cartData.cartProducts.reduce((acc, product) => {
      const { quantity, price } = product;
      return acc + quantity * price;
    }, 0);
  }, [cartData?.cartProducts]);

  const creditsTotal = useMemo(() => {
    if (!cartData || !cartData.cartProducts) return 0;

    return cartData.cartProducts.reduce((total, product) => {
      const { quantity } = product;
      return total + quantity;
    }, 0);
  }, [cartData?.cartProducts]);

  const getTotalPayableAmount = useCallback(() => {
    if (cartData?.serviceCharges > 0) {
      return cartData?.total + cartData?.serviceCharges;
    } else {
      return cartData?.total;
    }
  }, [cartData]);

  const cartProductsData = useMemo(() => {
    if (!cartData || !cartData.cartProducts) return [];
    return cartData.cartProducts.map((product) => {
      const { item_id, price, quantity, slug, platformSlug, itemType, products } = product;
      return {
        key: item_id,
        quantity,
        slug,
        platformSlug,
        itemType,
        products,
        title: <div className="summary-list-title">{tenantUtils.getLocalisedString(product, 'title')}</div>,
        price: user?.isCurrencyUser ? (
          <>
            <div className="cart-single-t-price">
              <Number
                type="price"
                compact={false}
                {...(tenantConstants?.SHOW_FRACTION_CURRENCY ? { fraction: true } : {})}
                value={price}
              />
            </div>
          </>
        ) : (
          <div className="cart-single-t-price">
            <Number
              type="price"
              compact={false}
              {...(tenantConstants?.SHOW_FRACTION_CURRENCY ? { fraction: true } : {})}
              value={price * quantity}
            />
          </div>
        ),
      };
    });
  }, [cartData, user?.isCurrencyUser]);

  return (
    <Row align="center" justify="space-between">
      {!cartData?.cartProducts && isCartLoading ? (
        <Skeleton type="input" />
      ) : inError ? (
        <EmptyState loading={isCartLoading} onClick={getCartData} />
      ) : !cartData?.cartProducts?.length > 0 ? (
        <EmptyState
          illustration={<IllustrationEmptyCart />}
          className="empty-state-propshop"
          title={t('No Items')}
          message={t('Added in cart')}
          hideRetryButton={true}
        />
      ) : (
        <OrderSummaryFull>
          <div className="fw-700 fs16">{t('Order Summary')}</div>
          <Divider />
          <div className="order-items">
            {cartProductsData.map((item, index) => {
              const productDetails = { ...products?.find((pr) => pr?.slug === item?.slug) };
              const dependents = item?.products;
              if (dependents) {
                const dependentProducts = dependents.map((dependent) => {
                  const listingActionData = tenantData.getListingActions?.(dependent?.slug) || {};
                  return {
                    ...dependent,
                    ...listingActionData,
                  };
                });
                return (
                  <div key={index}>
                    <Row align="center" justify="space-between">
                      <p className="mb-0">{t(productDetails?.propShopTitle)}</p>
                      {item.price}
                    </Row>
                    {dependentProducts?.map((e) => {
                      return (
                        <Row>
                          <Space align="center" size={4} className="fs12">
                            <span>{t(e?.orderSummaryTitle)}</span>
                            <strong>({item.quantity}x)</strong>
                          </Space>
                        </Row>
                      );
                    })}
                  </div>
                );
              } else {
                return (
                  <Row key={index} align="middle">
                    <Col xs={12} className="color-gray-dark">
                      <Space align="center" size={4} style={{ whiteSpace: 'nowrap' }}>
                        {t(productDetails?.orderSummaryTitle) || item.title}
                        {tenantConstants?.CURRENCY_ORDER_SUMMARY &&
                          item.itemType !== 'Package' &&
                          `(${formatPrice(item.quantity)} ${t(item.quantity === 1 ? 'Credit' : 'Credits')})`}
                        {!IS_LISTING_CART && item.quantity > 1 && <strong> ({formatPrice(item.quantity)})</strong>}
                      </Space>
                    </Col>
                    <Col xs={12} className="text-right">
                      {IS_LISTING_CART ? (
                        cartData?.availableCredits > 0 ? (
                          <>
                            <strong>{tenantConstants?.CURRENCY_ORDER_SUMMARY ? item?.price : item.quantity}</strong>{' '}
                            {!tenantConstants?.CURRENCY_ORDER_SUMMARY && t('Credits')}
                          </>
                        ) : hidePrice ? (
                          ''
                        ) : (
                          item.price
                        )
                      ) : hidePrice ? (
                        ''
                      ) : (
                        item.price
                      )}
                    </Col>
                  </Row>
                );
              }
            })}
            {user?.isCurrencyUser && (
              <>
                {cartData?.availableCredits > 0 &&
                  IS_LISTING_CART &&
                  !HIDE_CREDITS_INFO &&
                  !tenantConstants?.CURRENCY_ORDER_SUMMARY && (
                    <>
                      <Divider className="m-0" />
                      <Row align="middle">
                        <Col xs={12} className="color-gray-dark">
                          {t('Total')}
                        </Col>
                        <Col xs={12} className="text-right">
                          <strong>{creditsTotal}</strong> {t('Credits')}
                        </Col>
                      </Row>
                      <Row align="middle">
                        <Col xs={12} className="color-gray-dark">
                          {t('Available')}
                        </Col>
                        <Col xs={12} className="text-right">
                          <strong>{cartData?.availableCredits}</strong> {t('Credits')}
                        </Col>
                      </Row>
                      <Divider className="m-0" />
                      <Row align="middle">
                        <Col xs={12} className="color-gray-dark">
                          {t('Required')}
                        </Col>
                        <Col xs={12} className="text-right">
                          <strong>{cartData?.totalCredits}</strong> {t('Credits')}
                        </Col>
                      </Row>
                    </>
                  )}
                {tenantConstants?.CURRENCY_ORDER_SUMMARY && <Divider className="m-0" />}
                {cartData?.oldTotal && cartData?.oldTotal > cartData?.total && (
                  <Row align="center" justify="space-between">
                    <span>{t('Discount')}:</span>
                    <Number
                      className="color-success fw-700"
                      type="price"
                      value={'-' + cartData?.discount}
                      {...(tenantConstants?.SHOW_FRACTION_CURRENCY ? { fraction: true } : {})}
                      compact={false}
                    />
                  </Row>
                )}

                {cartData?.adjustment_amount && (
                  <Row align="center" justify="space-between">
                    <span>{t('Adjustment Price')}:</span>
                    <Number type={'price'} value={'-' + cartData?.adjustment_amount} compact={false} />
                  </Row>
                )}
              </>
            )}

            {cartData?.serviceCharges > 0 && (
              <Row align="center" justify="space-between">
                <span>{t('Service Charges')}:</span>
                <Number type={'price'} value={cartData?.serviceCharges} compact={false} />
              </Row>
            )}
            <Row align="center" justify="space-between" className="mb-8">
              <span>{user?.isCurrencyUser ? t('Total Payable') : t('Total')}:</span>
              <Number
                className="color-primary fw-700"
                type="price"
                value={getTotalPayableAmount() || total}
                {...(tenantConstants?.SHOW_FRACTION_CURRENCY ? { fraction: true } : {})}
                compact={false}
              />
            </Row>
            {!!installmentStr && <span>{t(`${installmentStr}`)}</span>}
            {/* Checkout.com Flow renders its own Pay button, so the external one is hidden for that method. */}
            {!hideCheckoutButton && (
              <Button
                type="primary"
                size="large"
                disabled={
                  cartData?.disableCheckOut ||
                  disableProceedButton ||
                  (tenantConstants?.LIMIT_CREDIT_PURCHASE && (!user?.is_nafaz_verified || !user?.is_saudi_national))
                }
                onClick={handleCheckout}
                loading={proceedButtonLoading}
                block
                {...buttonProps}
                className="mb-16"
              >
                <span>{checkoutButtonText}</span>
                {showIcon && <Icon icon={!rtl ? 'FiArrowRight' : 'FiArrowLeft'} />}
              </Button>
            )}
          </div>
          {user?.isMultiPlatform && tenantConstants?.CURRENCY_ORDER_SUMMARY && isPostListing && (
            <>
              <Alert
                style={{ padding: 0 }}
                className={'mb-16'}
                showIcon
                type=""
                icon={
                  <Icon className="color-gray-dark" icon="HiInformationCircle" size={16} style={{ marginTop: '2px' }} />
                }
                message={
                  <Flex
                    align="center"
                    className={cx('color-gray-light', 'fz-14')}
                    style={{ paddingBlockStart: '3px', lineHeight: 1.5 }}
                    wrap={isMobile}
                  >
                    {t('Pay')}
                    <Number
                      className="color-primary fw-700"
                      type="price"
                      value={getTotalPayableAmount() || total}
                      compact={false}
                      {...(tenantConstants?.SHOW_FRACTION_CURRENCY ? { fraction: true } : {})}
                      style={{ marginInline: '4px', marginTop: '2px' }}
                    />
                    {t('to post your listing on')}
                    <MultiPlatform style={{ height: '20px', marginInline: '2px' }} />
                  </Flex>
                }
              />
            </>
          )}
        </OrderSummaryFull>
      )}
    </Row>
  );
};

export default OrderSummary;
