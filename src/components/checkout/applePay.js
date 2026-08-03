import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import { Divider, Typography } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery, usePrepareCheckoutMutation } from '../../apis/cart';
import { payButtonUpgradeClickEvent } from '../../services/analyticsService';
import { Group, Modal, notification, TextWithIcon } from '../common';
import { ApplePayIcon } from '../svg';
import PaymentWidgetIframe from './pamentWidgetIframe';
import { TransactionCard } from './styled';
const { Text } = Typography;

const ApplePay = forwardRef(({ cartId, setPaymentButtonLoading = () => {} }, ref) => {
  const [checkoutDetails, setCheckoutDetails] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector((state) => state.app.loginUser?.user);
  const { locale, isMobile } = useSelector((state) => state.app.AppConfig);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: cartData } = useGetCartQuery({ userId: user?.id });
  const [prepareCheckout] = usePrepareCheckoutMutation();

  useImperativeHandle(ref, () => ({
    onCheckOut,
  }));

  const onCheckOut = async () => {
    setPaymentButtonLoading(true);
    const res = await prepareCheckout({ cart_id: cartId, payment_channel: 'apple_pay' });
    if (res) {
      payButtonUpgradeClickEvent(user, 'apple_pay', !!res?.payment_id, cartData);
      if (res?.error) {
        setPaymentButtonLoading(false);
        notification.error(res?.error);
      } else if (res?.data?.payment_id) {
        setCheckoutDetails(res);
        setModalVisible(true);
      }
    }
  };

  return (
    <TransactionCard
      style={{ borderWidth: 1 }}
      title={<div className="fw-700">{t('Apple Pay')}</div>}
      extra={<ApplePayIcon size="50px" />}
    >
      <TextWithIcon
        icon="VerificationIcon"
        iconProps={{ size: '24px' }}
        title={t('Another step will appear to securely submit your payment information.')}
        textColor={tenantTheme['gray800']}
      />

      <Divider />

      <Text type="secondary">
        {t(
          'By continuing, you allow to charge your Apple Pay for this payment and future payments in accordance with their terms.',
        )}
      </Text>
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => {
          setPaymentButtonLoading(false);
          setModalVisible(false);
          notification.error(t('Payment Cancelled'));
          navigate(tenantRoutes?.app('', false, user)?.prop_shop?.path);
        }}
        maskClosable={false}
      >
        <Group template={isMobile ? 'initial' : 'repeat(2,1fr)'} gap="16px" style={{ textAlign: isMobile && 'center' }}>
          <div>{t('Click Apple to proceed:')}</div>
          <PaymentWidgetIframe
            checkoutDetails={checkoutDetails}
            brands={'APPLEPAY'}
            customStyles={`
           .wpwl-apple-pay-button{-webkit-appearance: -apple-pay-button !important;}
          `}
            iframeOptions={{
              locale: locale,
              applePay: {
                displayName: 'Bayut',
                total: { label: 'Bayut' },
                supportedNetworks: ['mada', 'masterCard', 'visa'],
              },
            }}
          />
        </Group>
      </Modal>
    </TransactionCard>
  );
});

export default ApplePay;
