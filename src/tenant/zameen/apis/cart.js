import tenantTransformers from '@transformers';
import tenantData from '@data';
import tenantUtils from '@utils';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import { TIME_DATE_FORMAT } from '../../../constants/formats';
import { t } from 'i18next';
import { data } from 'browserslist';

const statusMapper = (e) => {
  switch (e?.status) {
    case 'completed':
    case 'Completed':
      return {
        color: 'green',
        label: 'Completed',
        slug: e?.status,
      };
    case 'failed':
    case 'Failed':
      return {
        color: 'red',
        label: t('Failed'),
        slug: e?.status,
      };
    case 'Pending':
    case 'pending':
      return {
        color: 'warning',
        label: t('Pending'),
        slug: e?.status,
      };
    default:
      return {};
  }
};

const getActionsList = (e) => {
  switch (e?.status) {
    case 'failed':
    case 'Failed':
    case 'Pending':
    case 'pending':
      return {
        label: t('Retry'),
        color: 'green',
        type: 'button',
        link: `/checkout?order_id=${e.id}`,
        id: e?.id,
      };
    default:
      return '';
  }
};
const producstMapper = (e) => {
  let orderedProducts = [];
  e.forEach((item) => {
    const index = orderedProducts.findIndex((it) => it.id === item.product.product_id);
    if (index === -1) {
      orderedProducts.push({
        ...tenantData.products?.find((e) => e?.id === item?.product?.product_id),
        id: item?.product.product_id,
        quantity: item?.quantity,
        name: item?.product.product_title,
      });
    } else {
      orderedProducts[index].quantity += item?.quantity;
    }
  });
  return orderedProducts;
};

const ordersDataMapper = (e) => {
  return {
    ...e,
    orderId: e?.id,
    products: { products: producstMapper(e?.order_details) },
    date: { value: e?.order_date, format: TIME_DATE_FORMAT },
    price: { value: e?.total, currency: 'PKR' },
    actions: { actions: [getActionsList(e)] },
    status: { state: statusMapper(e) },
  };
};

const cartApis = {
  getCart: {
    query: (userId, orderId) => {
      return { url: orderId ? `/api/orders/${orderId}` : `/api/surge/carts/current` };
    },
    transformer: (response, meta, args) => {
      return tenantTransformers.cartDataMapper(response, meta, args);
    },
  },

  getMyOrders: {
    query: ({ userId, params }) => {
      return { url: `/api/users/${userId}/orders?${convertQueryObjToString(params)}` };
    },
    transformer: (response) => {
      const ordersData = response;

      return {
        pagination: tenantUtils.getPaginationObject(ordersData.pagination),
        list: ordersData?.orders.map((item) => ordersDataMapper(item)),
        table: [
          {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            component: 'String',
          },
          {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            component: 'Products',
          },
          {
            title: 'Date & Time',
            dataIndex: 'date',
            key: 'date',
            component: 'Date',
          },
          {
            title: 'Order Status',
            dataIndex: 'status',
            key: 'status',
            component: 'OrderStatus',
          },
          {
            title: 'Price (PKR)',
            dataIndex: 'price',
            key: 'price',
            component: 'Price',
          },
          {
            title: 'Action',
            dataIndex: 'actions',
            key: 'actions',
            component: 'OrderActions',
          },
        ],
      };
    },
  },

  deleteCart: {
    query: ({ productList }) => {
      return {
        url: `/api/carts/update`,
        method: 'PUT',
        body: {
          cart: { cart_details_attributes: productList },
        },
      };
    },
    transformer: (response) => {
      const cart = response?.data?.cart;
      return {
        cartProducts: cart?.cart_details?.length ? tenantUtils.cartProductList(cart?.cart_details) : [],
      };
    },
  },

  updateCart: {
    query: ({ productList }) => {
      return {
        url: `/api/carts/update`,
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

  updatePayment: {
    query: ({ data }) => {
      return {
        url: `/api/surge/checkout/update_payment`,
        method: 'POST',
        body: {
          ...data,
        },
      };
    },
  },
};
export default cartApis;
