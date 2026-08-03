import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { Badge, Col, Radio, Row, Skeleton, Space } from 'antd';
import cx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, EmptyState, Flex, Group, RadioButtons, notification } from '../../../../components/common';
import { QuantityControl } from '../../../../components/prop-shop/QuantityControl';
import { ActionButton } from '../../../../container/pages/user-settings/style';
import { useRouteNavigate } from '../../../../hooks';
import actions from '../../../../redux/cart/actions';
import { formatNumberString } from '../../../../utility/utility';
import Package from './package';
import { ProductList, ProductsListing, PropShopCard, ValidAlert } from './styled';
import { useCreateCartMutation } from '../../../../apis/cart';
import { useLazyGetPackagesQuery } from '../../../../apis/common';
import { useLazyGetCustomCreditsPriceQuery } from '../../../../apis/quotaCredits';

const ActiveProducts = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useRouteNavigate();
  const { user } = useSelector((state) => state.app.loginUser);
  const [createCart, _] = useCreateCartMutation();

  const { isMobile, isMemberArea, rtl } = useSelector((state) => state.app.AppConfig);
  const [getPackages, { error: isError, isLoading }] = useLazyGetPackagesQuery({ rtl: rtl });

  const [activeState, setActiveState] = useState({
    activeTab: null,
    activePlan: 1,
    activePackage: null,
    activeDuration: 12,
  });
  const [disableAll, setDisableAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [propShopData, setPropShopData] = useState();
  const [error, setError] = useState(null);
  const [customCredits, setCustomCredits] = useState({
    count: 1,
    price: 0,
    nonDiscountedPrice: 0,
  });

  const packageDurations = useMemo(
    () => [
      { id: 1, label: t('1 Year'), durationInMonths: 12 },
      { id: 2, label: t('6 Months'), durationInMonths: 6 },
    ],
    [],
  );

  const tabList = useMemo(
    () => [...(isMemberArea ? [{ key: 'packages', tab: t('Packages') }] : []), { key: 'add-ons', tab: t('Add-Ons') }],
    [isMemberArea],
  );

  useEffect(() => {
    fetchData();
    setActiveState({ ...activeState, activeTab: tabList?.[0]?.key });
  }, []);

  const renderSkeleton = (key) => {
    const skeletons = {
      packages: (
        <>
          <Row align="center" className="mb-24">
            <RadioButtons
              key="packageDurations"
              name="packageDurations"
              value={activeState.activePlan}
              buttonList={packageDurations.map((item) => {
                return {
                  key: item.id,
                  label: item.label,
                  badge: item.discount && (
                    <Badge count={t('Save ') + item.discount + '%'} style={{ marginInlineStart: 6, marginTop: -4 }} />
                  ),
                };
              })}
              isButton
              radioGroupGap="0"
            />
          </Row>
          <Group>
            {[1, 2, 3, 4].map(() => (
              <Card>
                <Package loading />
              </Card>
            ))}
            <ActionButton>
              <Skeleton.Input />
            </ActionButton>
          </Group>
        </>
      ),
      'add-ons': <></>,
      current_plan: <></>,
    };

    return skeletons[key];
  };
  const [getCustomCreditsPrice] = useLazyGetCustomCreditsPriceQuery();

  const getCreditsPrice = async () => {
    const response = await getCustomCreditsPrice(customCredits?.count);
    if (response) {
      if (response.error) {
        setError(response.error);
        notification.error(response.error);
      } else {
        setCustomCredits((prevState) => {
          return {
            ...prevState,
            price: response?.price,
            nonDiscountedPrice: response?.nonDiscountedPrice,
          };
        });
      }
    }
  };
  const fetchData = (durationInMonths) => {
    if (isMemberArea) {
      getPackagesData(durationInMonths, user?.platforms);
    }
    getCreditsPrice();
  };

  const getPackagesData = async (durationInMonths, platforms) => {
    setLoading(true);
    const response = await getPackages({ months: durationInMonths, platforms });
    if (response) {
      setLoading(false);
      if (response.error) {
        notification.error(response.error);
        setError(response.error);
      } else {
        setPropShopData(response);
      }
    }
  };

  const handleRetry = () => {
    fetchData();
  };

  const handleDurationChange = (e) => {
    setActiveState(() => {
      return { ...activeState, activePlan: e.id, activeDuration: e?.durationInMonths, activePackage: null };
    });
  };

  const handleCheckout = async () => {
    setDisableAll(true);
    setButtonLoading(true);
    let cart;
    if (activeState.activePackage) {
      cart = {
        source: 'profolio',
        cart_details_attributes: [{ item_id: activeState.activePackage?.id, source: 'profolio', item_type: 'Package' }],
      };
    } else {
      cart = { total_credits: customCredits?.count, source: 'profolio' };
    }
    const response = await createCart(cart);

    if (response.error) {
      notification.error(response.error);
    } else {
      navigate(`/checkout?cart_id=${response?.id}`, {
        state: {
          interactedFrom: 'manage-listings',
        },
      });
    }
    setButtonLoading(false);
    setDisableAll(false);
  };

  const displayCustomCreditsPrice = () => {
    return (
      <Flex gap="8px" className={isMobile && 'fs12'}>
        <Space size={4} className={cx('color-primary', !isMobile && 'fs18')}>
          {tenantConstants.CURRENCY_SYMBOL()}
          <strong className="fw-700">{formatNumberString(customCredits?.price, { fractionDigits: 1 })}</strong>
        </Space>
        {customCredits?.nonDiscountedPrice > customCredits?.price && (
          <Space size={4} className="color-gray-dark" justify="end">
            {tenantConstants.CURRENCY_SYMBOL()}
            <span
              style={{
                textDecoration: 'line-through' + tenantTheme['danger-color'],
              }}
            >
              {formatNumberString(customCredits?.nonDiscountedPrice, { fractionDigits: 1 })}
            </span>
          </Space>
        )}
      </Flex>
    );
  };
  const renderPropShopData = (platform) => {
    const contentList = {
      packages: (
        <>
          <Row align="center" className="mb-24">
            <RadioButtons
              key="packageDurations"
              name="packageDurations"
              value={activeState.activePlan}
              handleChange={(e) => {
                const selectedDuration = packageDurations.find((item) => item.id === e.target.value);
                handleDurationChange(selectedDuration);
              }}
              buttonList={packageDurations.map((item) => {
                return {
                  key: item.id,
                  label: item.label,
                  badge: item.discount && (
                    <Badge count={t('Save ') + item.discount + '%'} style={{ marginInlineStart: 6, marginTop: -4 }} />
                  ),
                };
              })}
              isButton
              radioGroupGap="0"
            />
          </Row>
          <Group>
            <ProductsListing value={activeState?.activePackage?.id}>
              {propShopData?.[platform?.slug]?.packageData?.[activeState?.activeDuration] &&
                propShopData?.[platform?.slug]?.packageData?.[activeState?.activeDuration]?.map((item) => (
                  <ProductList>
                    <Radio
                      key={item.id}
                      value={item.id}
                      onClick={() => {
                        setActiveState({ ...activeState, activePackage: item });
                      }}
                      className="radio-lg"
                    >
                      <Package
                        title={item?.name}
                        icon={item?.icon}
                        monthlyCredits={item?.credits_per_month}
                        yearlyCredits={item?.yearlyCredits}
                        iconProps={item?.iconProps}
                        packageColor={item?.packageColor}
                        price={item?.price}
                        discountedPrice={item?.oldPrice}
                        extraCredits={item?.extraCredits}
                      />
                    </Radio>
                  </ProductList>
                ))}
            </ProductsListing>
            <ActionButton>
              <Button
                type="primary"
                size="large"
                className="px-54"
                onClick={handleCheckout}
                disabled={!activeState?.activePackage || disableAll}
                loading={buttonLoading}
              >
                {t('Continue')}
              </Button>
            </ActionButton>
          </Group>
        </>
      ),
      'add-ons': (
        <Card
          style={{ maxWidth: 630, marginInline: isMobile ? -16 : 0 }}
          bodyStyle={{ padding: isMobile ? '18px 16px' : '20px 24px' }}
        >
          <div className={cx('fs16 fw-700', isMobile ? 'mb-16' : 'mb-20')}>{t('How many credits do you need?')}</div>
          <Row justify="space-between">
            <Col>
              <QuantityControl
                disableAll={disableAll}
                setDisableAll={setDisableAll}
                setDisableCheckOut={(value) => dispatch(actions.cartDisableCheckout(value))}
                suffix={t('Credits')}
                type="credits"
                setCustomCredits={setCustomCredits}
                extra={displayCustomCreditsPrice()}
              />
            </Col>

            <Col flex={isMobile ? '100%' : 'none'}>
              {!isMobile && (
                <Button
                  disabled={disableAll}
                  onClick={() => {
                    handleCheckout();
                  }}
                  loading={buttonLoading}
                  type="primary"
                  size="large"
                  className="mb-8"
                  block
                >
                  {t('Buy')}
                </Button>
              )}

              <ValidAlert
                icon="IoMdTime"
                textColor={tenantTheme['text-color-secondary']}
                iconProps={{
                  color: tenantTheme['primary-color'],
                }}
                value={
                  <>
                    {t('Valid for')}
                    <strong className="color-primary"> {t('30 Days')}</strong>
                  </>
                }
              />
            </Col>
          </Row>
          {isMobile && (
            <ActionButton>
              <div className="fs16 lhn">
                <div className="color-gray-dark fs12">{t('Total')}</div>
                {tenantConstants.CURRENCY_SYMBOL()}
                <strong className="fw800"> {formatNumberString(customCredits?.price, { fractionDigits: 1 })}</strong>
              </div>
              <Button
                disabled={disableAll}
                onClick={() => {
                  handleCheckout();
                }}
                loading={buttonLoading}
                type="primary"
                size="large"
              >
                {t('Proceed To Pay')}
              </Button>
            </ActionButton>
          )}
        </Card>
      ),
    };
    return contentList[activeState.activeTab];
  };

  const onTabChange = (key) => {
    setActiveState({ ...activeState, activeTab: key, activePackage: null });
  };

  return loading ? (
    <PropShopCard
      tabProps={{ size: 'large' }}
      tabList={tabList}
      activeTabKey={activeState.activeTab}
      bodyStyle={{ padding: isMobile ? 16 : 24 }}
    >
      {renderSkeleton(activeState?.activeTab)}
    </PropShopCard>
  ) : error ? (
    <EmptyState title={''} message={error} onClick={handleRetry} />
  ) : !isMemberArea || (propShopData && Object.keys(propShopData).length != 0) ? (
    user?.platforms?.map((platform) => (
      <>
        <PropShopCard
          tabProps={{ size: 'large' }}
          tabList={tabList}
          activeTabKey={activeState.activeTab}
          onTabChange={onTabChange}
          bodyStyle={{ padding: isMobile ? 16 : 24 }}
        >
          {renderPropShopData(platform)}
        </PropShopCard>
      </>
    ))
  ) : (
    <EmptyState type={'table'} hideRetryButton />
  );
};

export default ActiveProducts;
