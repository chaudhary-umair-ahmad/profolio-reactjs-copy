import tenantUtils from '@utils';
import tenantData from '@data';

export const cartDataMapper = (response, meta, arg) => {
  if (arg?.orderId) {
    const { id, status, order_details } = response?.order;
    if (status === 'completed') {
      return { error: `Order is in ${status} state` };
    }

    return {
      available_channels: response?.order?.available_channels,
      cartProducts: tenantUtils.cartProductList(
        order_details?.map((e) => ({
          id: e.id,
          product_id: e.product?.product_id,
          product: {
            id: e.product?.product_id,
            title: e.product?.product_title,
            slug: tenantData.quotaCreditProducts?.find((pr) => pr?.id == e?.product?.product_id)?.slug,
            price: e.price,
          },
          quantity: e.quantity,
          price: e.price,
          products: e?.products,
          item_type: e?.product_type,
          source: 'profolio',
        })),
      ),
      cartId: id,
      source: 'profolio',
    };
  }
  
  if (!response?.cart?.cart_details?.length) {
    return { cartProducts: [] };
  } else {
    const cart = response?.cart || {};
    
    const normalizedCartDetails = (cart?.cart_details || []).map((item) => ({
      id: item?.id,
      quantity: item?.item_quantity,
      price: item?.item_price,
      source: item?.source,
      item_id: item?.item_id,
      item_type: item?.item_type,
      installment_rule_id: item?.installment_rule_id,
      item_title: item?.item_title,
      item_title_l1: item?.item_title_l1,
      item_slug: item?.item_slug,
      item_image: item?.item_image,
      crm_item_id: item?.crm_item_id,
      platform_id: item?.platform_id,
      product_id: item?.product_id,
    }));

    return {
      available_channels: cart?.available_channels,
      cartProducts: tenantUtils.cartProductList(normalizedCartDetails),
      cartId: cart?.id,
      source: cart?.source,
    };
  }
};

const getActiveProductsMapper = (response) => {
  const productsByPlatform = { zameen: [], olx: [] };
  if (response) {
    if (response.error) {
      return response;
    } else if (!response?.products || response?.products?.length === 0) {
      return {
        platformProducts: productsByPlatform,
        products: [],
      };
    } else if (response?.products) {
      const productList = response?.products;
      productList &&
        productList?.length > 0 &&
        productList?.forEach((product) => {
          const { product_id, key: slug } = product;
          if (slug && slug.includes('olx')) {
            productsByPlatform.olx.push({
              ...tenantData.getListingActions(slug),
              ...product,
              product_id,
              price: tenantUtils.makePriceForPackage('olx', product),
            });
          } else {
            productsByPlatform.zameen.push({
              ...tenantData.getListingActions(slug),
              ...product,
              product_id,
              price: tenantUtils.makePriceForPackage('zameen', product),
            });
          }
        });
      return {
        platformProducts: productsByPlatform,
        products: productList.map((e) => ({ ...tenantData.getListingActions(e.key), ...e })),
      };
    }
  }
};

export default { cartDataMapper, getActiveProductsMapper };
