import tenantUtils from '@utils';
import { t } from 'i18next';

export const cartDataMapper = (response, meta, arg) => {
  if (arg?.orderId) {
    const { id, status, details } = response?.data?.orders?.items[0];
    if (status === 'completed') {
      return { error: `Order is in ${status} state` };
    }
    return {
      cartProducts: tenantUtils.cartProductList(
        details.map((e) => ({
          id: e.id,
          product_id: e.product.id,
          product: { id: e.product.id, title: e.product.name, slug: e.product_slug, price: e.unit_price },
          quantity: e.quantity,
          price: e.unit_price,
          source: 'profolio',
        })),
      ),
      cartId: id,
      source: 'profolio',
    };
  } else if (!response?.cart?.cart_details?.length) {
    const cart = response?.cart || {};
    const normalizedCart = {
      id: cart?.id,
      source: cart?.source,
      amount: cart?.net_amount,
      total_amount: cart?.amount,
      total_credits: cart?.total_credits,
      user_available_credits: cart?.user_available_credits,
      listing_id: cart?.listing_id, 
      purchased_full_credits: cart?.purchased_full_credits, 
      discount: cart?.discount,
      available_channels: cart?.available_channels ?? [],
    };

    return {
      cartId: normalizedCart?.id,
      source: normalizedCart?.source,
      total: normalizedCart?.amount,
      oldTotal: normalizedCart?.total_amount,
      totalCredits: normalizedCart?.total_credits,
      availableCredits: normalizedCart?.user_available_credits,
      listing_id: normalizedCart?.listing_id,
      purchasedFullCredits: normalizedCart?.purchased_full_credits,
      cartProducts: [{ title: t('Credits'), quantity: normalizedCart?.total_credits, price: normalizedCart?.total_amount }],
      discount: normalizedCart?.discount,
      available_channels: normalizedCart?.available_channels,
    };
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
      cartProducts: tenantUtils.cartProductList(normalizedCartDetails),
      cartId: cart?.id,
      source: cart?.source,
      total: cart?.net_amount,
      adjustment_amount: cart?.refundable_amount,
      discount: cart?.discount,
      oldTotal: cart?.amount,
      totalCredits: cart?.total_credits,
      availableCredits: cart?.user_available_credits,
      listing_id: cart?.listing_id,
      purchasedFullCredits: cart?.purchased_full_credits,
      available_channels: cart?.available_channels,
    };
  }
};

export default { cartDataMapper };
