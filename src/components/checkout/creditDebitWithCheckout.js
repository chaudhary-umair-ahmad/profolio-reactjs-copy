import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import tenantConstants from '@constants';
import { useRequestPaymentMutation } from '../../apis/cart';
import { notification } from '../../components/common';
import CreditCardItem from './creditCardItem';

const CreditDebitWithCheckout = forwardRef(
  (
    {
      cartId,
      orderId,
      creditCardData,
      setCreditCardData,
      setPaymentButtonLoading = () => {},
      eventId,
      onCheckoutFlowCompleted = () => {},
      onCheckout3DSCancelled = () => {},
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { isMobile } = useSelector((state) => state.app.AppConfig);
    const user = useSelector((state) => state.app.loginUser?.user);
    const [paymentSession, setPaymentSession] = useState(null);
    const [requestPayment] = useRequestPaymentMutation();

    // When the user is blocked from paying (KSA: Nafath pending / non-Saudi credit limit),
    // checkout.js already shows the blocking modal. request_payment fires on mount and the BE
    // rejects it — suppress that error toast so we don't stack a flash on top of the popup.
    const isPaymentBlocked =
      (tenantConstants?.ENABLE_NAFATH && !user?.is_nafaz_verified) ||
      (tenantConstants?.LIMIT_CREDIT_PURCHASE && (!user?.is_nafaz_verified || !user?.is_saudi_national));

    // The Flow component renders its own Pay button and drives submit/3DS internally,
    // so this surface no longer exposes the imperative onCheckOut/isDataComplete API.
    useImperativeHandle(ref, () => ({}));

    useEffect(() => {
      let isActive = true;

      // Flow needs a payment session before it can mount, so create one as soon as the
      // card method is selected. Sessions are single-use; a retry re-mounts this surface
      // (via the parent's paymentFailureKey) which creates a fresh session.
      const createSession = async () => {
        setPaymentSession(null);
        try {
          const response = await requestPayment({
            data: {
              ...(creditCardData?.order_id
                ? { order_id: creditCardData.order_id }
                : cartId
                  ? { cart_id: cartId }
                  : orderId
                    ? { order_id: orderId }
                    : {}),
              ...(eventId && { event_id: eventId }),
            },
          });

          if (!isActive) return;

          if (response?.error) {
            if (!isPaymentBlocked) notification.error(response.error);
            setPaymentButtonLoading(false);
            return;
          }

          // BE returns the Flow session under the `response.payment` envelope (with `success`),
          // not under `data`. Support both shapes.
          const sessionData = response?.data?.response?.payment || response?.data?.data;
          if (sessionData?.payment_session_id || sessionData?.id) {
            // CheckoutWebComponents expects the session `id`; the BE names it `payment_session_id`.
            const session = { ...sessionData, id: sessionData.id ?? sessionData.payment_session_id };
            setPaymentSession(session);
            setCreditCardData(sessionData);
          } else if (!isPaymentBlocked) {
            notification.error(t('Your payment could not process'));
          }
        } catch (e) {
          if (isActive && !isPaymentBlocked) notification.error(typeof e === 'string' ? e : JSON.stringify(e));
        }
      };

      createSession();

      return () => {
        isActive = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePaymentError = () => {
      setPaymentButtonLoading(false);
    };

    return (
      <CreditCardItem
        showForm
        paymentSession={paymentSession}
        isMobile={isMobile}
        onPaymentCompleted={onCheckoutFlowCompleted}
        on3DSCancelled={onCheckout3DSCancelled}
        onError={handlePaymentError}
      />
    );
  },
);

export default CreditDebitWithCheckout;
