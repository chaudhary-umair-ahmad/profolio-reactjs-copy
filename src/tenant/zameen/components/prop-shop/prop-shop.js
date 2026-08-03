import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetCartQuery } from '../../../../apis/cart';
import { Card, Group } from '../../../../components/common';
import ActiveProducts from '../../../../components/prop-shop/ActiveProducts';
import OrderSummary from '../../../../components/prop-shop/Ordersummary';
import { Main } from '../../../../container/styled';
import { useGetMatch, useRouteNavigate } from '../../../../hooks';

function PropShop(props) {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [disableProceedButton, setDisableProceedButton] = useState(false);
  const { isExact } = useGetMatch();
  const user = useSelector((state) => state.app.loginUser.user);
  const { data: cartData, error: cartError, isLoading: isCartLoading, refetch } = useGetCartQuery({ userId: user.id });
  const navigate = useRouteNavigate();
  const { t } = useTranslation();

  const handleCheckout = () => {
    navigate(`/checkout?cart_id=${cartData.cartId}`);
  };

  return (
    <>
      <Main>
        <div className={isExact ? 'cartWraper' : 'checkoutWraper'}>
          <Row gutter={32} justify="center" style={{ rowGap: 16 }}>
            <Col xxl={13} lg={16} xs={24}>
              <Group gap="16px">
                <ActiveProducts
                  isMobile={isMobile}
                  setDisableProceedButton={setDisableProceedButton}
                  cartData={cartData}
                  inError={cartError}
                  isCartLoading={isCartLoading}
                />
              </Group>
            </Col>
            <Col xxl={7} lg={8} xs={24}>
              <Card className="mb-24" bodyStyle={{ padding: 24 }}>
                <OrderSummary
                  checkoutButtonText={t('Proceed To Payment')}
                  handleCheckout={handleCheckout}
                  disableProceedButton={disableProceedButton}
                  showIcon={false}
                  buttonProps={{
                    style: {
                      '--btn-bg-color': '#009f2b',
                      '--btn-content-color': '#fff',
                      height: 52,
                    },
                  }}
                  cartData={cartData}
                  getCartData={refetch}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Main>
    </>
  );
}

export default PropShop;
