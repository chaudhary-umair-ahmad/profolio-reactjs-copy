import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { Typography } from 'antd';
import moment from 'moment';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLazyGetTabbyPaymentLinkQuery, usePrepareCheckoutMutation } from '../../apis/cart';
import useTabbyPromo from '../../hooks/useTabbyPromo';
import { payButtonUpgradeClickEvent } from '../../services/analyticsService';
import { ListingDateSelect } from '../../tenant/bayut/components/upgrade-listing/style';
import { getBaseURL } from '../../utility/env';
import { isHttpUrl } from '../../utility/utility';
import { Button, DrawerModal, Flex, Group, notification } from '../common';
import { TabbyLogo, TabbyStep1, TabbyStep2, TabbyStep3, TabbyStep4 } from '../svg';
import { TabbyStepper, TransactionCard } from './styled';

const { Title, Text } = Typography;

const Tabby = forwardRef(({ cartId, cartData, setPaymentButtonLoading = () => {}, eventId, creditCardData, setCreditCardData = () => {} }, ref) => {
  const [infoPopUpModalVisible, setInfoPopUpModalVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const { t } = useTranslation();
  const user = useSelector((state) => state.app.loginUser?.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const [prepareCheckout] = usePrepareCheckoutMutation();
  const [getTabbyPaymentLink] = useLazyGetTabbyPaymentLinkQuery();
  const loadTabbyScript = useTabbyPromo('#tabby-promo-container', tenantConstants?.currency, locale, cartData?.total);

  const paymentSteps = [
    {
      text: t('Select your date of birth and proceed to payment'),
    },
    {
      text: t('Click on the Tabby button and proceed on Tabby'),
    },
    {
      text: t(`Complete checkout and Tabby will remind you when it's time to pay.`),
    },
  ];
  const renderStepsTitle = (installmentAmount) => {
    return (
      <div>
        <span className={isMobile ? 'fz-12 fw-400 text-primary' : 'fz-14 fw-400 text-primary'}>
          {tenantConstants.CURRENCY_SYMBOL()}
        </span>{' '}
        <span className={isMobile ? 'fz-14 fw-700 text-primary' : 'fz-18 fw-700 text-primary'}>
          {installmentAmount}
        </span>
      </div>
    );
  };

  const getTabbyPaymentSteps = () => {
    const installmentAmount = Number(cartData?.total) / 4;
    return [
      {
        icon: <TabbyStep1 />,
        title: renderStepsTitle(installmentAmount),
        description: t('Today'),
        percent: 25,
      },
      {
        icon: <TabbyStep2 />,
        title: renderStepsTitle(installmentAmount),
        description: t('In 1 month'),
        percent: 50,
      },
      {
        icon: <TabbyStep3 />,
        title: renderStepsTitle(installmentAmount),
        description: t('In 2 months'),
        percent: 75,
      },
      {
        icon: <TabbyStep4 />,
        title: renderStepsTitle(installmentAmount),
        description: t('In 3 months'),
        percent: 100,
      },
    ];
  };

  useImperativeHandle(ref, () => ({
    onCheckOut,
    isDataComplete: () => {
      return !!dateOfBirth;
    },
  }));

  const onCheckOut = async () => {
    if (!dateOfBirth) {
      notification.error(t('Please select date of birth'));
      setPaymentButtonLoading(false);
    } else {
      setPaymentButtonLoading(true);
      const baseUrl = `${getBaseURL()}/${locale}/content/process-payment`;
      const eventIdParam = eventId ? `&event_id=${eventId}` : '';

      const res = await prepareCheckout({
        // Reuse an existing order across retries / payment-method switches: once a previous
        // request_payment or prepare_checkout call returned an order_id, send that instead
        // of cart_id (mirrors the Checkout.com card flow).
        ...(creditCardData?.order_id ? { order_id: creditCardData.order_id } : { cart_id: cartId }),
        payment_channel: 'tabby',
        success_url: `${baseUrl}?paymentStatus=AUTHORIZED${eventIdParam}`,
        cancel_url: `${baseUrl}?paymentStatus=EXPIRED${eventIdParam}`,
        failure_url: `${baseUrl}?paymentStatus=REJECTED${eventIdParam}`,
        user: { dob: dateOfBirth },
        paymentUrl: 'tabby',
      });
      if (res) {
        setPaymentButtonLoading(false);
        payButtonUpgradeClickEvent(user, 'tabby', !!res?.payment_id, cartData);
        // Persist the order_id so a subsequent attempt (any method) reuses the same order.
        const responseOrderId = res?.data?.order_id ?? res?.data?.payment?.order_id;
        if (responseOrderId) setCreditCardData({ ...(creditCardData || {}), order_id: responseOrderId });
        if (res?.error) {
          notification.error(res?.error);
        } else if (res?.data?.payment_id) {
          const response = await getTabbyPaymentLink({ payment_id: res?.data?.payment_id });
          if (response) {
            setPaymentButtonLoading(false);
            if (response?.error) {
              notification.error(response?.error);
            } else {
              const tabbyRedirectUrl =
                response?.data?.response?.configuration?.available_products?.installments?.[0]?.web_url;
              if (isHttpUrl(tabbyRedirectUrl)) {
                window.open(tabbyRedirectUrl, '_self');
              } else {
                notification.error(t('Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method for your order'));
              }
            }
          }
        }
      }
    }
  };

  const openTabbyInfoModal = () => {
    setInfoPopUpModalVisible(true);
    loadTabbyScript(); // Load the script & attach promo when the modal opens
  };

  return (
    <>
      <DrawerModal
        visible={infoPopUpModalVisible}
        footer={null}
        onCancel={() => {
          setInfoPopUpModalVisible(false);
        }}
        maskClosable={false}
        width={500}
        title={t('Pay with tabby')}
      >
        <Group template={isMobile ? 'initial' : 'repeat(2,1fr)'} gap="16px" style={{ textAlign: isMobile && 'center' }}>
          <div id="tabby-promo-container"></div>
        </Group>
      </DrawerModal>
      <TransactionCard
        style={{ borderWidth: 1 }}
        title={<div className="fw-700">{t('Tabby')}</div>}
        extra={<TabbyLogo size={55} />}
      >
        <Group gap="10px">
          <ListingDateSelect
            className="date-picker"
            style={{ width: '100%' }}
            label={t('Date of Birth')}
            onChange={(date) => {
              setDateOfBirth(date);
            }}
            errorMsg={null}
            labelProps={{ className: 'text-muted', style: { alignSelf: 'center' } }}
            disabledDate={(current) => current && current > moment().endOf('day')}
            showNow={false}
            pickerStyle={{ width: '100%' }}
            placeholder={t('Enter your date of birth')}
            containerClassName="date-picker"
            popupClassName="paymentDatePicker"
            showTime={false}
          />
          <Flex align="center" justify="space-between" className={isMobile ? 'mb-6' : 'mb-8'}>
            <Title level={5} style={{ color: tenantTheme['base-color'] }} className="fz-14">
              {t('Pay in 4. No interest, no fees.')}
            </Title>

            <Button type={'link'} onClick={openTabbyInfoModal}>
              {t('Learn More')}
            </Button>
          </Flex>
        </Group>

        <div className="w-100">
          <span className="text-muted">{t('Use any card.')}</span>
          <TabbyStepper
            items={getTabbyPaymentSteps()?.map((e, index) => ({
              title: e?.title,
              description: <Text className={isMobile ? 'fz-11 text-muted' : 'fz-14 text-muted'}>{e?.description}</Text>,
              icon: e?.icon,
            }))}
            labelPlacement="vertical"
            responsive={false}
            size="small"
            className="ant-stepper-small"
          />
        </div>
      </TransactionCard>
    </>
  );
});

export default Tabby;
