import tenantTransformers from '@transformers';
import tenantUtils from '@utils';
import { convertQueryObjToString } from '../../../utility/urlQuery';

const cartApis = {
  getCart: {
    query: (userId, orderId) => {
      return { url: orderId ? `/api/surge/users/${userId}/orders?order_id=${orderId}` : `/api/surge/carts/current` };
    },
    transformer: (response, meta, arg) => tenantTransformers.cartDataMapper(response, meta, arg),
  },

  deleteCart: {
    query: ({ productList }) => {
      return {
        url: `/api/surge/carts/update`,
        method: 'PUT',
        body: {
          cart: { cart_details_attributes: productList },
        },
      };
    },
    transformer: (response) => {
      const cart = response?.cart;
      return {
        cartProducts: cart?.cart_details?.length ? tenantUtils.cartProductList(cart?.cart_details) : [],
      };
    },
  },

  createCart: {
    query: (query) => {
      return { url: `/api/surge/carts`, method: 'POST', body: query };
    },
  },

  updateCart: {
    query: ({ productList, updateRedux }) => {
      return {
        url: `/api/surge/carts/update`,
        method: 'PUT',
        body: {
          cart: { cart_details_attributes: productList },
        },
      };
    },
    transformer: (response, meta, { updateRedux }) => {
      if (updateRedux) {
        const cartDetail = response?.cart;
        return { cartProducts: tenantUtils.cartProductList(cartDetail?.cart_details), cartId: cartDetail.id };
      } else {
        return response;
      }
    },
  },

  requestPayment: {
    query: ({ data }) => {
      return {
        url: `/api/surge/checkout/request_payment`,
        method: 'POST',
        body: {
          ...data,
          success_url: `${window.location.origin}/content/process-payment?status=success`,
          failure_url: `${window.location.origin}/content/process-payment?status=failed`,
        },
      };
    },
  },

  prepareCheckout: {
    query: (arg) => {
      const { paymentUrl = 'hyperpay', ...body } = arg;
      return {
        url: `/api/surge/${paymentUrl}/prepare_checkout`,
        method: 'POST',
        body: body,
      };
    },
    transformer: (res) => {
      return res?.response;
    },
  },

  getTamaraInstallments: {
    query: ({ cartId }) => {
      return {
        url: `/api/surge/hyperpay/get_tamara_installments?${convertQueryObjToString({ cart_id: cartId })}`,
      };
    },
  },
  getTabbyPaymentLink: {
    query: ({ payment_id }) => {
      return {
        url: `/api/surge/tabby/${payment_id}/payment_link`,
      };
    },
  },

  updatePayment: {
    query: ({ data }) => {
      return {
        url: `/api/surge/checkout/update_payment`,
        method: 'POST',
        body: { ...data },
      };
    },
  },
};
export default cartApis;
