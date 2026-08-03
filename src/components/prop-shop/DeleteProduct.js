import tenantData from '@data';
import React from 'react';
import { Button, notification } from '../../components/common';
import { useDeleteCartMutation } from '../../apis/cart';

export const DeleteProduct = ({
  loggedInUserId,
  cartId,
  cartProducts = [],
  product,
  setDisableCheckOut,
  disableAll,
  setDisableAll,
}) => {
  const [deleteCart, { isLoading: deletingProduct }] = useDeleteCartMutation();
  const deleteProductFromCart = async () => {
    setDisableAll(true);
    setDisableCheckOut(true);

    const productList = [
      {
        id: product?.item_id,
        item_id: product?.product_id,
        quantity: product?.quantity,
        item_type: product?.item_type,
        [`_destroy`]: true,
        source: 'profolio',
      },
    ];

    if (product?.product_id == 5) {
      //Remove VideoGraphy when add superHot
      productList?.unshift({
        item_id: 14,
        id: cartProducts?.find((e) => e?.product_id == 14)?.item_id,
        quantity: product?.quantity,
        item_type: product?.item_type,
        [`_destroy`]: true,
        source: tenantData.source,
      });
    }
    const response = await deleteCart({ productList: productList });
    if (response.error) {
      notification['error'](response.error);
    }
    setDisableCheckOut(false);
    setDisableAll(false);
  };
  return (
    <Button
      type="text"
      danger
      onClick={() => {
        deleteProductFromCart();
      }}
      icon="HiOutlineTrash"
      loading={deletingProduct}
      disabled={disableAll}
    />
  );
};
