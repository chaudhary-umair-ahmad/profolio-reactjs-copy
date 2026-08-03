import tenantConstants from '@constants';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Form, Input, Space, Typography } from 'antd';
import cx from 'clsx';
import debounce from 'lodash/debounce';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  Popover,
  Select,
  TextWithIcon,
  notification,
} from '../../../../../components/common';
import { regex } from '../../../../../constants/regex';
import { useRouteNavigate } from '../../../../../hooks';
import { getTopUpClickEvent, suggestCreditsClickEvent } from '../../../../../services/analyticsService';
import { convertQueryObjToString } from '../../../../../utility/urlQuery';
import { formatNumberString } from '../../../../../utility/utility';
import { CreditTopUpCard } from '../styled';
import { useCreateCartMutation } from '../../../../../apis/cart';
import { useGetMonthRulesQuery, useGetActiveProductsQuery } from '../../../../../apis/common';
import { useLazyGetCustomCreditsPriceQuery } from '../../../../../apis/quotaCredits';

const { Text } = Typography;

export const CreditTopUps = forwardRef(({ redirectUrl, header = true, bodyStyle, style }, ref) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const navigate = useRouteNavigate();
  const { t } = useTranslation();

  const [disableAll, setDisableAll] = useState(false);
  const [inputQuantity, setInputQuantity] = useState();
  const [customCredits, setCustomCredits] = useState({ count: 1, price: 0, nonDiscountedPrice: 0, durationMonths: null });
  const inputRef = useRef(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const { isMemberArea } = useSelector((state) => state.app.AppConfig);
  const { user } = useSelector((state) => state.app.loginUser);

  useEffect(() => {
    if (!disableAll && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [disableAll]);
  useImperativeHandle(ref, () => ({
    clearState() {
      setDisableAll(false);
      setInputQuantity('');
      setCustomCredits({ count: 0, price: 0, nonDiscountedPrice: 0, durationMonths: null });
      setSelectedDuration(null);
    },
  }));
  const isNonPackageUser = () => {
    return isMemberArea || !!user?.is_custom_package_allowed;
  };
  const {
    data: monthRules,
    error,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGetMonthRulesQuery(undefined, { skip: !isNonPackageUser(), refetchOnMountOrArgChange: true });
  const { data: productsData, isLoading: productsLoading, error: productsError } = useGetActiveProductsQuery();
  const creditProductId = productsData?.products?.find((product) => product?.slug === 'credit')?.id;
  
  const [getCustomCreditsPrice] = useLazyGetCustomCreditsPriceQuery();
  const [createCart, _] = useCreateCartMutation();
  const renderMonthsTooltip = () => {
    return (
      <Popover
        placement="top"
        content={
          <div style={{ maxWidth: '300px', width: '100%' }}>{t('Enter atleast 100 credits to increase duration')}</div>
        }
        action="hover"
      >
        <>
          <Icon icon="AiOutlineInfoCircle" iconProps={{ color: '#222' }} />
        </>
      </Popover>
    );
  };
  const handleCheckout = async () => {
    getTopUpClickEvent(user, customCredits?.count);
    let cart;
    cart = {
      total_credits: customCredits?.count,
      ...(!!isNonPackageUser() && { duration_in_months: selectedDuration }),
      source: "profolio",
      listing_id: null,
      listing_expiry_days: null,
      cart_details_attributes: [
        {
          item_id: creditProductId,
          item_type: "Product",
          source: "profolio",
          quantity: customCredits?.count
        }
      ]
    };
    setDisableAll(true);
    const response = await createCart({ cart });
    if (response.error) {
      notification?.error(response?.error);
    } else {
      navigate(
        `/checkout?${convertQueryObjToString({ cart_id: response?.data?.cart?.id, ...(redirectUrl && { redirectUrl }) })}`,
      );
    }
    setDisableAll(false);
  };
  const getMonthDurations = (value) => {
    let options = monthRules?.reduce((acc, data) => {
      if (parseInt(value) >= data?.min_range && parseInt(value) <= data?.max_range) {
        return acc.concat(data?.months);
      }
      return acc;
    }, []);
    return options;
  };

  const isProfolioUser = () => {
    if (selectedDuration >= 6 && parseInt(inputQuantity) >= 100) {
      return true;
    }
    return false;
  };
  const renderFieldSubText = () => {
    return !isProfolioUser() ? (
      <div>
        <Trans i18nKey="unlockProfolio" values={{ credits: 1500 }} components={{ sup: <sup /> }} />
      </div>
    ) : (
      <div>
        <Trans i18nKey="accessProfolio" components={{ sup: <sup /> }} />
      </div>
    );
  };

  const renderFooterText = () => {
    if (tenantConstants.MONTH_DURATION_FOR_CREDITS) {
      const months = customCredits?.durationMonths;
      const monthWord = Number(months) === 1 ? t('month') : t('months');
      return (
        <div style={{ color: tenantTheme['base-color'] }}>
          {t('All credits will be allocated upfront and will remain valid for {{months}} {{monthWord}}', {
            months,
            monthWord,
          })}
        </div>
      );
    }
    return !!isNonPackageUser() ? (
      <div style={{ color: tenantTheme['base-color'] }}>
        {inputQuantity && selectedDuration > 1
          ? `${inputQuantity} ${t('credits will be allocated upfront and will remain valid for the next')} ${selectedDuration} ${t(
              ' months',
            )}`
          : t('All credits will be allocated upfront and will remain valid for the selected duration')}
      </div>
    ) : (
      <div style={{ color: tenantTheme['base-color'] }}>
        {t('All credits will be allocated upfront and will remain valid for the selected duration')}
      </div>
    );
  };

  const getCreditsPrice = async (creditsCount, duration) => {
    setDisableAll(true);
    const response = await getCustomCreditsPrice(
      !!isNonPackageUser() && duration
        ? { total_credits: creditsCount, duration_in_months: duration }
        : { total_credits: creditsCount },
    );
    if (response) {
      if (response.error) {
        notification['error'](response.error);
      } else {
        setCustomCredits((prevState) => {
          return {
            ...prevState,
            count: creditsCount,
            price: response?.data?.price,
            nonDiscountedPrice: response?.data?.nonDiscountedPrice,
            durationMonths: response?.data?.durationMonths,
          };
        });
      }
      setDisableAll(false);
    }
  };
  const debouncedCreditsPrice = useCallback(
    debounce((creditsCount, duration) => getCreditsPrice(creditsCount, duration), 700),
    [],
  );

  const onInputQuantityChange = (event, callDebounce) => {
    suggestCreditsClickEvent(user, customCredits?.count);
    const quantity = event?.target?.value;
    if (!quantity) {
      setInputQuantity('');
      setSelectedDuration(null);
      setCustomCredits({ count: 0, price: 0, nonDiscountedPrice: 0, durationMonths: null });
    } else {
      if (regex.naturalNumbers.test(quantity)) {
        setInputQuantity(parseInt(quantity));
        const duration =
          getMonthDurations(quantity)?.length > 1 ? selectedDuration : getMonthDurations(quantity)?.[0]?.id;
        setSelectedDuration(duration);
        if (!!callDebounce) {
          debouncedCreditsPrice(quantity, duration);
        } else {
          getCreditsPrice(quantity);
        }
      }
    }
  };

  return (
    <CreditTopUpCard
      className="topUpCard"
      styles={{ body: { padding: isMobile ? 16 : 24, ...bodyStyle } }}
      style={{ borderRadius: isMobile && 0, ...style }}
    >
      <Flex vertical gap="24px" className={isMobile && 'mb-16'}>
        <div>
          <Heading as={isMobile ? 'h6' : 'h5'} style={{ fontWeight: '700' }} className="mb-4">
            {!!isNonPackageUser() ? t('Custom Package & Credits') : t('Credit Top-up')}
          </Heading>
          <Text type="secondary" className={isMobile && 'fz-12'}>
            {t(
              'Ran out of credits? Add more credits to your account to post more listings and avail more services seamlessly.',
            )}
          </Text>
        </div>
        <div className="mb-24">
          <Flex
            className="mb-8"
            template={isMobile ? 'initial' : undefined}
            align="start"
            gap={isMobile ? '16px' : '24px'}
          >
            <Form layout="vertical" style={{ maxWidth: 340, width: '100%' }}>
              <Form.Item className="mb-0" label={t('Total Credits')}>
                <Input
                  // ref={inputRef}
                  placeholder={t('Enter the number of credits')}
                  className="w-100 fw-600"
                  style={{ height: 43 }}
                  size="large"
                  value={inputQuantity}
                  disabled={disableAll}
                  onChange={(e) => {
                    onInputQuantityChange(e, true);
                  }}
                  maxLength={6}
                />{' '}
              </Form.Item>
            </Form>
            {!!isNonPackageUser() && !tenantConstants.HIDE_DROP_DOWN_CREDITS && (
              <>
                {' '}
                <div style={{ alignSelf: 'center', marginBlockStart: '35px' }}>
                  <Icon icon="MdClose" size={16} color="#DEDEDE" />
                </div>
                <Select
                  label={t('Duration')}
                  inputLoading={disableAll}
                  disabled={!inputQuantity || getMonthDurations(inputQuantity)?.length == 1}
                  placeholder={t('Select Months')}
                  size="default"
                  renderPopover={
                    (!inputQuantity || getMonthDurations(inputQuantity)?.length == 1) && renderMonthsTooltip
                  }
                  value={selectedDuration}
                  options={getMonthDurations(inputQuantity)}
                  getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'value')}
                  getOptionValue={(e) => e?.id}
                  onChange={(e) => {
                    setSelectedDuration(e);
                    inputQuantity && debouncedCreditsPrice(parseInt(inputQuantity), e);
                  }}
                  labelProps={{
                    color: '#222',
                    className: 'align-center-v',
                    style: { gap: '6px', '--label-font-weight': '400' },
                  }}
                  style={{ maxWidth: 340, width: '100%' }}
                ></Select>
              </>
            )}
          </Flex>

          {!!isNonPackageUser() && (
            <TextWithIcon
              textSize={isMobile && '11px'}
              style={!isMobile ? { textWrap: 'noWrap' } : {}}
              icon={!isProfolioUser() ? 'UnlockIcon' : 'GiCheckMark'}
              iconProps={{ color: tenantTheme['primary-color'], size: 16 }}
              title={renderFieldSubText()}
            />
          )}
        </div>
      </Flex>
      <Card
        className="creditCard"
        bodyStyle={{ padding: '12px 16px' }}
        style={{ backgroundColor: tenantTheme['primary-light-4'], borderWidth: 0 }}
      >
        <Flex vertical={isMobile && true} justify="space-between" gap="20px">
          <div>
            <Flex gap="8px" className={'mb-4'}>
              <Text className="fw-700">{t('Total Credits')}</Text>
              <TextWithIcon
                align="center"
                justify="center"
                value={inputQuantity ? inputQuantity : 0}
                icon="IconTotalCredit"
                fontWeight="700"
                gap="6px"
              />
            </Flex>

            {!(tenantConstants.MONTH_DURATION_FOR_CREDITS && !customCredits?.durationMonths) && (
              <TextWithIcon
                textSize={isMobile && '12px'}
                iconProps={{ color: tenantTheme['primary-color'], size: '1em' }}
                icon="IoTimeOutline"
                value={renderFooterText()}
              />
            )}
          </div>

          <Flex
            justify={isMobile ? 'space-between' : undefined}
            align="center"
            gap="40px"
            className={isMobile ? 'w-100' : undefined}
          >
            <Flex gap={isMobile ? '12px' : '16px'}>
              {customCredits?.price > 0 && inputQuantity && (
                <div>
                  <Text type="secondary" className="d-block fz-14 fw-700 text-right text-left">
                    {t('Total')}
                  </Text>
                  <Text
                    className={cx(isMobile ? 'fz-14' : 'fz-16', 'fw-700')}
                    style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span className="fw-400">{tenantConstants.CURRENCY_SYMBOL()}</span>
                    {formatNumberString(customCredits?.price, false)}
                  </Text>
                </div>
              )}
              {customCredits?.nonDiscountedPrice > customCredits?.price && (
                <Space
                  size={4}
                  className="color-gray-dark"
                  justify="end"
                  style={{ alignSelf: 'end', marginBottom: '1px', fontSize: isMobile && '12px' }}
                >
                  <span style={{ whiteSpace: 'nowrap', textDecoration: 'line-through', color: tenantTheme['black'] }}>
                    {tenantConstants.CURRENCY_SYMBOL()}
                    {formatNumberString(customCredits?.nonDiscountedPrice, { fractionDigits: 1 })}
                  </span>
                </Space>
              )}
            </Flex>
            <Button
              onClick={handleCheckout}
              loading={disableAll}
              disabled={disableAll || !inputQuantity}
              style={{ minWidth: isMobile ? '120px' : '187px' }}
              size={isMobile ? 'small' : 'large'}
              type="primary"
            >
              {!!isNonPackageUser() ? t('Proceed to Payment') : t('Get Top-up')}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </CreditTopUpCard>
  );
});
