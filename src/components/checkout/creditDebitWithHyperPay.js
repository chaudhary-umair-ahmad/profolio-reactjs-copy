import { Divider, Typography } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, notification, TextWithIcon } from '../common';
import { MasterVisaIcon } from '../svg';
import PaymentWidgetIframe from './pamentWidgetIframe';
import { TransactionCard } from './styled';
import tenantTheme from '@theme';
import { payButtonUpgradeClickEvent } from '../../services/analyticsService';
import { usePrepareCheckoutMutation } from '../../apis/cart';
const { Text } = Typography;

const CreditDebitWithHyperPay = forwardRef((props, ref) => {
  const { cartId, setPaymentButtonLoading, fetchCartDetails } = props;
  const [checkoutDetails, setCheckoutDetails] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const { user } = useSelector((state) => state.app.loginUser);
  const cartData = useSelector((state) => state.app.cart.data);
  const [prepareCheckout] = usePrepareCheckoutMutation();

  useImperativeHandle(ref, () => ({
    onCheckOut,
  }));

  const onCheckOut = async () => {
    setPaymentButtonLoading(true);
    const res = await prepareCheckout({ cart_id: cartId, payment_channel: 'AMEX' });
    if (res) {
      payButtonUpgradeClickEvent(user, 'credit_debit_with_hyperPay', !!res?.payment_id, cartData);
      if (res?.error) {
        notification.error(res?.error);
      } else if (res?.payment_id) {
        setCheckoutDetails(res);
        setModalVisible(true);
      }
    }
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => {
          fetchCartDetails();
          setModalVisible(false);
          setPaymentButtonLoading(false);
        }}
      >
        <PaymentWidgetIframe
          checkoutDetails={checkoutDetails}
          brands={'VISA MASTER'}
          locale={locale}
          iframeOptions={{
            locale: locale,
          }}
          useIframe={false}
        />
      </Modal>
      <TransactionCard
        style={{ borderWidth: 1 }}
        title={<div className="fw-700">Credit / Debit Card</div>}
        extra={<MasterVisaIcon />}
      >
        <TextWithIcon
          icon="VerificationIcon"
          iconProps={{ size: '24px' }}
          title="Another step will appear to securely submit your payment information."
          textColor={tenantTheme['gray800']}
        />

        <Divider />
        <Text type="secondary">
          By continuing, you allow to charge your Credit / Debit Card for this payment and future payments in accordance
          with their terms.
        </Text>
      </TransactionCard>
    </>
  );
});

export default CreditDebitWithHyperPay;
