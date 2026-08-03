import tenantTheme from '@theme';
import { Col, Input, Row } from 'antd';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, notification } from '../../components/common';
import { regex } from '../../constants/regex';
import tenantApi from '@api';
import { useUpdateCartMutation } from '../../apis/cart';
import { useLazyGetCustomCreditsPriceQuery } from '../../apis/quotaCredits';
import { getAppSource } from '../../store/parentApi';
export const QuantityControl = ({
  product,
  loggedInUserId,
  cartId,
  cartProducts = [],
  setDisableCheckOut,
  disableAll,
  setDisableAll,
  suffix,
  type,
  setCustomCredits,
  extra,
}) => {
  const [inputQuantity, setInputQuantity] = useState(1);
  const [buttonLoading, setButtonLoading] = useState('');
  const dispatch = useDispatch();
  const [updateCart, { isLoading: updatingQuantity }] = useUpdateCartMutation();

  let { product_id, quantity, item_id, item_type } = type != 'credits' ? product : {};
  const SUPER_HOT_ID = 5;
  const VIDEOGRAPHY_HOT_ID = 14;

  useEffect(() => {
    product && setInputQuantity(product.quantity);
  }, [product]);

  const [getCustomCreditsPrice] = useLazyGetCustomCreditsPriceQuery();

  const updateProductQuantity = async (updateType) => {
    setDisableAll(true);
    let quantityChange;
    type === 'credits' ? (quantity = inputQuantity) : null;
    switch (updateType) {
      case 'increment':
        quantityChange = quantity + 1;
        break;
      case 'decrement':
        quantityChange = quantity >= 2 ? quantity - 1 : 1;
        break;
      case 'input':
        quantityChange = inputQuantity || 1;
        break;
    }
    let productList;
    if (type === 'credits') {
      setButtonLoading(updateType);
      getCreditsPrice(quantityChange);
      setButtonLoading('');
    } else {
      productList = [{ item_id: product_id, quantity: quantityChange, id: item_id, item_type, source: getAppSource() }];

      if (product_id == SUPER_HOT_ID) {
        //Update VideoGraphy quantity when superHot quantity changes
        const videographyProducts = cartProducts?.find((e) => e?.product_id == VIDEOGRAPHY_HOT_ID);
        if (videographyProducts) {
          productList.unshift({
            item_id: VIDEOGRAPHY_HOT_ID,
            quantity: quantityChange,
            item_type: item_type,
            source: getAppSource(),
            // updateType == 'input'
            //   ? cartProducts?.find(e => e?.product_id == VIDEOGRAPHY_HOT_ID)?.quantity + inputQuantity
            //   : updateType == 'increment'
            //   ? cartProducts?.find(e => e?.product_id == VIDEOGRAPHY_HOT_ID)?.quantity + 1
            //   : cartProducts?.find(e => e?.product_id == VIDEOGRAPHY_HOT_ID)?.quantity - 1,
            id: cartProducts?.find((e) => e?.product_id == VIDEOGRAPHY_HOT_ID)?.item_id,
          });
        } else {
          productList.unshift({
            item_id: VIDEOGRAPHY_HOT_ID,
            quantity: quantityChange,
            item_type,
            source: getAppSource(),
          });
        }
      }
      if (quantityChange !== quantity) {
        setButtonLoading(updateType);
        setDisableCheckOut(true);

        const response = await updateCart({ productList: productList, updateRedux: false });
        if (response.error) {
          notification['error'](response.error);
        } else {
          // dispatch(updateCart(response));
        }

        setDisableAll(false);
        setDisableCheckOut(false);
        setButtonLoading('');
      }
    }
  };

  const getCreditsPrice = async (creditsCount) => {
    setDisableAll(true);
    const response = await getCustomCreditsPrice(creditsCount);
    if (response) {
      if (response.error) {
        notification['error'](response.error);
      } else {
        setInputQuantity(parseInt(creditsCount));
        setCustomCredits((prevState) => {
          return {
            ...prevState,
            count: creditsCount,
            price: response?.price,
            nonDiscountedPrice: response?.nonDiscountedPrice,
          };
        });
      }
      setDisableAll(false);
    }
  };

  const debouncedCreditsPrice = useCallback(
    debounce((creditsCount) => getCreditsPrice(creditsCount), 500),
    [],
  );
  const onInputQuantityChange = (event) => {
    const quantity = event?.target?.value;
    if (!quantity) setInputQuantity('');
    else {
      if (regex.naturalNumbers.test(quantity)) {
        setInputQuantity(parseInt(quantity));
        if (type === 'credits') {
          debouncedCreditsPrice(quantity);
        }
      }
    }
  };

  return (
    <>
      <Row align="top" wrap={false} gutter={8}>
        <Col>
          <Button
            onClick={() => updateProductQuantity('decrement')}
            disabled={disableAll || updatingQuantity || quantity === 1}
            loading={buttonLoading === 'decrement'}
            icon="HiMinus"
            iconSize="1em"
            type="primary-light"
            size="large"
            style={{ color: tenantTheme['primary-color'], border: 'none' }}
          />
        </Col>
        <Col>
          <Input
            className="mb-4"
            style={type === 'credits' ? { height: 40 } : { height: 40, width: 50 }}
            size="large"
            value={inputQuantity}
            // disabled={disableAll}
            onChange={(e) => onInputQuantityChange(e)}
            suffix={<span className="fs14 color-gray-dark">{suffix}</span>}
            onBlur={(e) => {
              if (Number(e?.target?.value) !== quantity) {
                updateProductQuantity('input');
              }
            }}
            maxLength={8}
          />
          {extra && extra}
        </Col>
        <Col>
          <Button
            onClick={() => updateProductQuantity('increment')}
            disabled={disableAll || updatingQuantity}
            loading={buttonLoading === 'increment'}
            icon="HiPlus"
            iconSize="1em"
            type="primary-light"
            size="large"
            style={{ color: tenantTheme['primary-color'], border: 'none' }}
          />
        </Col>
      </Row>
    </>
  );
};
