import tenantData from '@data';
import tenantTheme from '@theme';
import { Row, Space, Spin, Table } from 'antd';
import cx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useGetLocation, useRouteNavigate } from '../../hooks';
import { useUpdateCartMutation } from '../../apis/cart';
import { HasVerifiedCheck } from '../../tenant/zameen/components/listing/listing-platform-actions/styled';
import { convertQueryObjToString, mapQueryStringToFilterObject } from '../../utility/urlQuery';
import { OverviewProductCard } from '../auto-utilisation/styled';
import { Button, Card, EmptyState, Group, Heading, Icon, notification } from '../common';
import { DeleteProduct } from './DeleteProduct';
import { QuantityControl } from './QuantityControl';
import { ProductTable } from './Style';
import { useGetActiveProductsQuery } from '../../apis/common';
import { formatPrice } from '../../utility/utility';
import { getAppSource } from '../../store/parentApi';
const Product = ({
  title,
  description,
  alertMessage,
  icon,
  iconColor,
  iconBackgroundColor,
  hasVerifiedCheck,
  price,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <OverviewProductCard>
      <HasVerifiedCheck>
        <Icon styled iconProps={{ color: iconColor, iconContainerSize: '1.8em' }} icon={icon || 'MdOutlineCircle'} />
        {hasVerifiedCheck && <Icon className="icon-check" icon="HiCheck" />}
      </HasVerifiedCheck>
      <div className="cart-single__info">
        <Row style={{ gap: '10px', fontSize: '13px' }}>
          <Heading as="h6">{title}</Heading>
          {hasVerifiedCheck && (
            <div
              style={{
                backgroundColor: '#e5f2e5',
                color: '#198c19',
                paddingInline: '10px',
                borderRadius: '5px',
              }}
            >
              {t('Recommended')}
            </div>
          )}
        </Row>
        <div className="color-gray-lightest mb-8">{description}</div>
        {alertMessage && (
          <div className="color-gray-lightest mb-8" style={{}}>
            {t(alertMessage)}
          </div>
        )}
        {rest.isMobile && (
          <div className="text-muted">
            {t('Price')} <span className="semiBold">{price}</span>
          </div>
        )}
      </div>
    </OverviewProductCard>
  );
};

const ActionButton = ({ action, buttonState, cartLoading, disableAll, setDisableAll }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleClick = async () => {
    setLoading(true);
    setDisableAll(true);
    const dataFetched = await action();
    if (dataFetched) {
      // dispatch(updateCart(dataFetched));
    }
    setDisableAll(false);
    setLoading(false);
  };
  return (
    <div className={cx('table-action')}>
      <Button
        type="primary"
        onClick={() => handleClick()}
        // icon={buttonState ? 'MdDone' : 'MdAdd'}
        disabled={buttonState}
        loading={loading}
        // block
      >
        {t('Add To Cart')}
      </Button>
    </div>
  );
};

const ActiveProducts = ({ isMobile, setDisableProceedButton, cartData, inError, isCartLoading }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [disableAll, setDisableAll] = useState(false);
  const navigate = useRouteNavigate();
  const location = useGetLocation();

  const { data: activeProducts, refetch } = useGetActiveProductsQuery();

  useEffect(() => {
    setDisableProceedButton(disableAll);
  }, [disableAll]);

  const platformList = tenantData?.platformList?.map((e) => e.key);

  const loggedInUser = useSelector((state) => state.app.loginUser.user);

  const rtl = useSelector((state) => state.app.AppConfig.rtl);

  const [updateCart, { isLoading: cartUpdating }] = useUpdateCartMutation();

  const addQueryProduct = async (product_id, queryObj) => {
    const product = tenantData?.products?.find((product) => product?.id == product_id) || {};

    let quantity = 1;
    let existingProduct = null;
    if (cartData?.cartProducts?.length) {
      existingProduct = cartData?.cartProducts?.find((product) => product?.product_id == product_id);
      if (existingProduct) quantity += existingProduct?.quantity;
    }

    setDisableAll(true);
    const response = await updateCart({
      productList: [
        {
          item_id: product_id,
          quantity: quantity,
          source: getAppSource(),
          item_type: product?.item_type,
          ...(existingProduct && { id: existingProduct?.item_id }),
        },
      ],
      updateRedux: true,
    });

    if (response) {
      setDisableAll(false);
      if (!response?.error) {
        // dispatch(updateCart(response));
      }
      delete queryObj.product_id;
      navigate(
        {
          pathname: location.pathname,
          search: convertQueryObjToString(queryObj),
        },
        { replace: true },
      );
    }
  };

  useEffect(() => {
    const { queryObj } = mapQueryStringToFilterObject(location.search);
    const { product_id } = queryObj;
    const isZameenProduct = tenantData.quotaCreditProducts?.find((e) => e?.id == product_id)?.platformSlug === 'zameen';
    if (!isZameenProduct) {
      delete queryObj.product_id;
      navigate(
        {
          pathname: location.pathname,
          search: convertQueryObjToString(queryObj),
        },
        { replace: true },
      );
    } else if (product_id && isZameenProduct && !isCartLoading) {
      addQueryProduct(product_id, queryObj);
    }
  }, [location.search, isCartLoading]);

  const addProductToCart = async (product) => {
    const { product_id, id } = product;
    const isCartEmpty = !cartData?.cartProducts?.length;
    const productList = [
      { item_id: product_id || id, quantity: 1, source: getAppSource(), item_type: product?.item_type },
    ];
    isCartEmpty && setDisableAll(true);
    const response = await updateCart({
      productList: productList,
      updateRedux: false,
    });
    if (response.error) {
      notification.error(response.error);
      return null;
    } else return response;
  };

  const isProductAdded = (product_id) => {
    if (!cartData?.cartProducts || !cartData?.cartProducts.length) return false;
    const index = cartData.cartProducts.findIndex((product) => product.product_id === product_id);
    if (index === -1) return false;
    return true;
  };

  const productTableData = {};
  if (cartData && activeProducts?.platformProducts) {
    platformList.forEach((platform) => {
      const tableData = (productTableData[platform] = []);
      activeProducts?.platformProducts[platform]?.map((data) => {
        const {
          product_id,
          propShopTitle,
          price,
          iconColor,
          propShopTagLine,
          alertMessage,
          icon,
          itemType,
          adOns,
          adOnsProducts = [],
        } = data;
        const disableAddToCartButton = isProductAdded(product_id);
        tableData.push({
          key: product_id,
          product: (
            <Product
              title={t(propShopTitle)}
              description={t(propShopTagLine)}
              alertMessage={t(alertMessage)}
              icon={icon}
              iconColor={iconColor}
              hasVerifiedCheck={data?.slug === 'property_videography' || data?.slug === 'property_photography'}
            />
          ),
          price: <div className="cart-single-t-price">Rs. {formatPrice(price)}</div>,
          itemType: itemType,
          adOns,
          adOnsProducts,
          action: disableAddToCartButton ? (
            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              {/* <div className="ant-row ant-row-no-wrap ant-row-middle" style={{ gap: 10 + 'px' }}> */}
              <QuantityControl
                product={cartData.cartProducts.find((e) => e.product_id == product_id)}
                loggedInUserId={loggedInUser.id}
                cartId={cartData.cartId}
                cartProducts={cartData?.cartProducts}
                disableAll={disableAll}
                setDisableAll={setDisableAll}
                setDisableCheckOut={(value) => {}}
              />
              <DeleteProduct
                loggedInUserId={loggedInUser.id}
                cartId={cartData.cartId}
                product={cartData.cartProducts.find((e) => e.product_id == product_id)}
                cartProducts={cartData?.cartProducts}
                disableAll={disableAll}
                setDisableAll={setDisableAll}
                setDisableCheckOut={(value) => {}}
              />
              {/* </div> */}
            </Space>
          ) : (
            <ActionButton
              action={() => addProductToCart(data)}
              buttonState={disableAddToCartButton}
              cartLoading={isCartLoading}
              disableAll={disableAll}
              setDisableAll={setDisableAll}
            />
          ),
        });
      });
    });
  }

  const getExpandedRowKeys = () => {
    const adOnsActions = tenantData.products?.filter((e) => !!e?.adOns);
    const expandedRows = [];
    adOnsActions?.length &&
      adOnsActions?.forEach((e) => {
        if (
          cartData?.cartProducts?.length &&
          !!cartData?.cartProducts?.find((it) => it?.product_id == e?.id)?.quantity
        ) {
          expandedRows.push(e.id);
        }
      });
    return expandedRows;
  };

  const renderExpandedRow = (record) => {
    const { adOnsProducts = [] } = record;
    const expandedProducts = tenantData.products.filter((e) => adOnsProducts?.includes(e?.id));
    const tableSourceData = [];
    expandedProducts?.length &&
      expandedProducts?.forEach((e) => {
        const disableAddToCartButton = isProductAdded(e?.id);
        tableSourceData.push({
          id: e.id,
          key: e.id,
          product: (
            <Product
              title={t(e?.propShopTitle)}
              description={t(e?.propShopTagLine)}
              alertMessage={t(e?.alertMessage)}
              icon={e?.icon}
              iconColor={e?.iconColor}
              hasVerifiedCheck={e?.slug === 'property_videography' || e?.slug === 'property_photography'}
            />
          ),
          price: <div className="cart-single-t-price">Rs. {formatPrice(e?.price)}</div>,
          itemType: e?.itemType,
          action: disableAddToCartButton ? (
            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              <QuantityControl
                product={cartData.cartProducts.find((it) => it.product_id == e?.id)}
                loggedInUserId={loggedInUser.id}
                cartId={cartData.cartId}
                disableAll={disableAll}
                setDisableAll={setDisableAll}
                setDisableCheckOut={(value) => {}}
              />
              <DeleteProduct
                loggedInUserId={loggedInUser.id}
                cartId={cartData.cartId}
                product={cartData.cartProducts.find((it) => it.product_id == e?.id)}
                disableAll={disableAll}
                setDisableAll={setDisableAll}
                setDisableCheckOut={(value) => {}}
              />
            </Space>
          ) : (
            <ActionButton
              action={() => addProductToCart(e)}
              buttonState={disableAddToCartButton}
              cartLoading={isCartLoading}
              disableAll={disableAll}
              setDisableAll={setDisableAll}
            />
          ),
        });
      });
    return (
      <>
        <Card
          title={t('Add-Ons')}
          bodyStyle={{ padding: 0 }}
          headStyle={{
            background: 'linear-gradient(to bottom, #e7f3ef 0%, #fff 100%)',
            borderBottom: 'none',
          }}
          style={{ borderColor: tenantTheme['primary-color'], overflow: 'hidden' }}
        >
          <Table pagination={false} dataSource={tableSourceData} showHeader={false}>
            <Table.Column dataIndex="product" key="product" width="60%" />
            <Table.Column dataIndex="price" key="price" width={120} />
            <Table.Column dataIndex={'action'} key="action" width="25%" />
          </Table>
        </Card>
      </>
    );
  };

  const renderProductsCards = (data, platform) => {
    return data?.length
      ? data?.map((it, i) => {
          const product = tenantData.products?.find((e) => e?.id == it?.key || e.id == it) || {};
          const disableAddToCartButton = isProductAdded(product.id);
          const productExists =
            !!cartData?.cartProducts?.length && cartData?.cartProducts?.find((e) => e?.product_id == product.id);
          const productPrice = activeProducts?.platformProducts[platform]?.find((e) => e?.id == product?.id)?.price;
          return (
            <div key={i}>
              <Card key={i}>
                <Product
                  className="mb-8"
                  title={t(product?.propShopTitle)}
                  description={t(product?.propShopTagLine)}
                  alertMessage={t(product?.alertMessage)}
                  icon={product?.icon}
                  iconColor={product?.iconColor}
                  price={productPrice || product?.price}
                  isMobile={isMobile}
                  hasVerifiedCheck={
                    product?.slug === 'property_videography' || product?.slug === 'property_photography'
                  }
                />
                <Space className="mb-16" style={{ display: 'flex', marginInlineStart: '72px' }}>
                  {disableAddToCartButton ? (
                    <>
                      <QuantityControl
                        product={
                          cartData?.cartProducts?.length &&
                          cartData.cartProducts.find((e) => e.product_id == product.id)
                        }
                        loggedInUserId={loggedInUser.id}
                        cartId={cartData.cartId}
                        cartProducts={cartData?.cartProducts}
                        disableAll={disableAll}
                        setDisableAll={setDisableAll}
                        setDisableCheckOut={(value) => {}}
                      />
                      <DeleteProduct
                        loggedInUserId={loggedInUser.id}
                        cartId={cartData.cartId}
                        product={
                          cartData?.cartProducts?.length &&
                          cartData.cartProducts.find((e) => e.product_id == product.id)
                        }
                        cartProducts={cartData?.cartProducts}
                        disableAll={disableAll}
                        setDisableAll={setDisableAll}
                        setDisableCheckOut={(value) => {}}
                      />
                    </>
                  ) : (
                    !isCartLoading && (
                      <ActionButton
                        action={() => addProductToCart(product)}
                        buttonState={disableAddToCartButton}
                        cartLoading={isCartLoading}
                        disableAll={disableAll}
                        setDisableAll={setDisableAll}
                      />
                    )
                  )}
                </Space>
                {it.adOns && productExists && renderProductsCards(it.adOnsProducts, platform)}
              </Card>
            </div>
          );
        })
      : null;
  };

  return (
    <>
      {platformList.map((platform, i) => {
        return (
          platform === 'zameen' && (
            <Card key={i}>
              <Heading as={'h2'}>{t('Listings')}</Heading>
              <ProductTable>
                {isCartLoading ? (
                  <div className="sd-spin">
                    <Spin />
                  </div>
                ) : inError ? (
                  <EmptyState loading={isCartLoading} onClick={refetch} />
                ) : (
                  <div className="table-cart">
                    {isMobile ? (
                      <Group gap="8px">
                        {renderProductsCards(
                          productTableData?.[platform]?.filter((e) => e?.itemType === 'package'),
                          platform,
                        )}
                      </Group>
                    ) : (
                      <Table
                        pagination={false}
                        dataSource={productTableData?.[platform]?.filter((e) => e?.itemType === 'package')}
                        locale={{ emptyText: isCartLoading ? 'Loading...' : 'No records found' }}
                        expandable={{
                          expandedRowRender: (record) => renderExpandedRow(record),
                          rowExpandable: (record) => {
                            return (
                              !!record?.adOns &&
                              !!cartData?.cartProducts?.length &&
                              !!cartData?.cartProducts?.find((e) => e?.product_id == record?.key)?.quantity
                            );
                          },
                          expandIconColumnIndex: -1,
                          expandedRowKeys: getExpandedRowKeys(),
                        }}
                      >
                        <Table.Column title={t('Product')} dataIndex="product" key="product" width="60%" />
                        <Table.Column title={t('Price')} dataIndex="price" key="price" width={120} />
                        <Table.Column title="" dataIndex={'action'} key="action" width="25%" />
                      </Table>
                    )}
                  </div>
                )}
              </ProductTable>
            </Card>
          )
        );
      })}
      {platformList?.map((platform, i) => {
        return (
          !!loggedInUser.products?.platforms[platform] &&
          platform === 'zameen' && (
            <Card key={i}>
              <Row>
                <Space align="center">
                  <Heading as={'h2'}>{t('Credits')}</Heading>
                  <Heading as={'h5'}>{t('(Only applicable on already posted listings)')}</Heading>
                </Space>
              </Row>
              <ProductTable>
                {isCartLoading ? (
                  <div className="sd-spin">
                    <Spin />
                  </div>
                ) : inError ? (
                  <EmptyState loading={isCartLoading} onClick={refetch} />
                ) : (
                  <div className="table-cart">
                    {isMobile ? (
                      <Group gap="8px">
                        {renderProductsCards(
                          productTableData?.[platform]?.filter((e) => e?.itemType === 'item'),
                          platform,
                        )}
                      </Group>
                    ) : (
                      <Table
                        pagination={false}
                        dataSource={productTableData?.[platform]?.filter((e) => e?.itemType === 'item')}
                        locale={{ emptyText: isCartLoading ? 'Loading...' : 'No records found' }}
                      >
                        <Table.Column title={t('Product')} dataIndex="product" key="product" width="60%" />
                        <Table.Column title={t('Price')} dataIndex="price" key="price" width={120} />
                        <Table.Column title="" dataIndex={'action'} key="action" width="25%" />
                      </Table>
                    )}
                  </div>
                )}
              </ProductTable>
            </Card>
          )
        );
      })}
    </>
  );
};

export default ActiveProducts;
