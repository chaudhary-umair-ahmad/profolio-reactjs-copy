import React, { useEffect } from 'react';
import { Spinner } from '../../../components/common';
import { useGetLocation } from '../../../hooks';
import { convertQueryObjToString, mapQueryStringToFilterObject } from '../../../utility/urlQuery';
import { Main } from '../../styled';
import { getLocaleForURL } from '../../../utility/language';
import tenantConstants from '@constants';

function PaymentProcess(props) {
  const { search } = useGetLocation();
  const {
    'cko-payment-id': ckoPaymentId = null,
    order_id = null,
    status = null,
    id = null,
    payment_id,
    paymentStatus,
    event_id = null,
    developers,
  } = mapQueryStringToFilterObject(search)?.queryObj;

  useEffect(() => {
    if (ckoPaymentId || order_id) redirectToCheckout();
  }, [ckoPaymentId, order_id]);

  const paymentType = status ? status : id || payment_id ? 'success' : 'error';

  // Checkout.com Flow redirects the customer (top-level, no iframe) back to the
  // success/failure URL carrying `cko-payment-id`. Forward that — plus the existing
  // tabby/hyperpay context — to /checkout so the result can be verified there.
  const redirectToCheckout = async () => {
    const queryParams = ckoPaymentId
      ? {
          paymentChannel: 'checkout',
          paymentType,
          'cko-payment-id': ckoPaymentId,
        }
      : {
          paymentChannel: payment_id ? 'tabby' : 'hyperpay',
          paymentType,
          order_id,
          paymentStatus,
        };

    if (event_id && tenantConstants?.ENABLE_EVENT_CHECKOUT) {
      queryParams.event_id = event_id;
    }

    if (developers === '1') {
      queryParams.developers = '1';
    }

    window.location.replace(`${getLocaleForURL()}/checkout?${convertQueryObjToString(queryParams)}`);
  };

  return (
    <Main>
      <Spinner type="full" />
    </Main>
  );
}

export default PaymentProcess;
