import { Steps, Typography } from 'antd';
import moment from 'moment';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import tenantTheme from '@theme';
import { Flex, Group, Modal, notification, TextWithIcon } from '../common';
import Statistic from '../common/statistic';
import { TamaraLogo } from '../svg';
import PaymentWidgetIframe from './pamentWidgetIframe';
import { PaymentCard, TransactionCard } from './styled';
import { payButtonUpgradeClickEvent } from '../../services/analyticsService';
import { useLazyGetTamaraInstallmentsQuery, usePrepareCheckoutMutation } from '../../apis/cart';
import tenantConstants from '@constants';

const { Title, Text } = Typography;

const whyTamara = [
  { icon: 'CompliantIcon', text: 'Sharia-compliant' },
  { icon: 'CiCreditCardOff', text: 'No late fees' },
  { icon: 'CiFaceSmile', text: 'Quick and easy' },
];

function getDayAndMonthFromNow(monthsToAdd, startDate = new Date(), format = 'D MMM') {
  return moment(startDate).add(monthsToAdd, 'months').format(format);
}

const Tamara = forwardRef(
  ({ cartId, cartData, onChangeInstallment, fetchCartDetails, setPaymentButtonLoading }, ref) => {
    const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
    const [tamaraInstallments, setTamaraInstallments] = useState(null);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [checkoutDetails, setCheckoutDetails] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const locale = useSelector((state) => state.app.AppConfig.locale);
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.app.loginUser);

    const [prepareCheckout] = usePrepareCheckoutMutation();
    const [getTamaraInstallments, { isLoading: installmentsLoading }] = useLazyGetTamaraInstallmentsQuery();

    useEffect(() => {
      setPaymentButtonLoading(true);
      fetchTamaraInstallments();
      return () => {
        onChangeInstallment(null);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      onCheckOut,
    }));

    const onCheckOut = async () => {
      const res = await prepareCheckout({
        cart_id: cartId,
        payment_channel: 'TAMARA',
        payment_option: selectedInstallment?.payment_type,
        no_of_installments: selectedInstallment?.instalment,
      });
      if (res) {
        payButtonUpgradeClickEvent(user, 'TAMARA', !!res?.payment_id, cartData);
        if (res?.error) {
          notification.error(res?.error);
        } else if (res?.payment_id) {
          setCheckoutDetails(res);
          setModalVisible(true);
        }
      }
    };

    const fetchTamaraInstallments = async () => {
      const res = await getTamaraInstallments({ cartId });
      if (res) {
        setPaymentButtonLoading(false);
        if (res?.error) {
        } else {
          onChangeInstallment(res?.data?.available_payment_labels?.[0]?.instalment);
          setSelectedInstallment(res?.data?.available_payment_labels?.[0]);
          setTamaraInstallments(res);
        }
      }
    };

    const renderAvailablePaymentType = () => {
      return (
        <>
          <Title level={5} style={{ color: tenantTheme['primary-color'] }} className=" mb-0">
            {t('Easy Monthly Installments')}
          </Title>
          <Group template={true ? ' initial ' : 'repeat(2,1fr)'}>
            {tamaraInstallments?.available_payment_labels?.map((e, index) => (
              <PaymentCard
                style={{ borderWidth: 1, scrollSnapAlign: 'start' }}
                key={index}
                className={selectedInstallment?.key == e?.key ? '' : ''}
                onClick={() => {
                  onChangeInstallment(e?.instalment);
                  setSelectedInstallment(e);
                }}
              >
                <Statistic
                  titleColor={tenantTheme['base-color']}
                  contentColor={tenantTheme['gray600']}
                  fontWeight="400"
                  titleFontWeight="700"
                  titleFontSize="14px"
                  title={t(`Split in ${e?.instalment}`)}
                  icon={'EuroSignLogo'}
                  iconProps={{
                    hasBackground: true,
                    size: '16px',
                    iconContainerSize: '28px',
                    color: tenantTheme['primary-color'],
                  }}
                  trends={false}
                  fontSize="14px"
                  value={e[`description_${locale}`]}
                  key={e?.payment_type}
                  textColor={selectedInstallment?.payment_type == e?.payment_type && tenantTheme['primary-color']}
                />
              </PaymentCard>
            ))}
          </Group>
        </>
      );
    };

    const renderInstallmentsSteps = () => {
      return (
        <Steps
          items={Array.from({ length: selectedInstallment?.instalment })?.map((e, index) => ({
            title: index == 0 ? t('Now') : getDayAndMonthFromNow(index),
            description: (
              <Text className="fz-18 text-primary fw-700">
                <span className="fz-14 fw-400 px-2">{tenantConstants.CURRENCY_SYMBOL()}</span>
                {cartData?.total / selectedInstallment?.instalment}
              </Text>
            ),
            percent: 50,
          }))}
          labelPlacement="vertical"
          className="payment-steps"
        />
      );
    };

    const renderWhyTamara = () => {
      return (
        <div>
          <Title level={5} className="mb-16" style={{ fontSize: '14px' }}>
            {t('Why Tamara')}
          </Title>
          <Flex vertical={isMobile && true} align={isMobile ? 'start' : 'center'} gap={isMobile ? '20px' : '40px'}>
            {whyTamara?.map((e, i) => (
              <TextWithIcon
                key={i}
                icon={e.icon}
                iconProps={{ color: tenantTheme['base-color'], size: '24px' }}
                textColor={tenantTheme['gray700']}
                title={t(e.text)}
              />
            ))}
          </Flex>
        </div>
      );
    };

    return (
      <TransactionCard
        style={{ borderWidth: 1 }}
        title={<div className="fw-700">{t('Tamara')}</div>}
        extra={<TamaraLogo size={55} />}
        loading={installmentsLoading}
      >
        <Group gap="32px">
          {renderAvailablePaymentType()}
          {selectedInstallment?.instalment > 1 && renderInstallmentsSteps()}
          {renderWhyTamara()}
        </Group>
        <Modal
          visible={modalVisible}
          footer={null}
          onCancel={() => {
            fetchCartDetails();
            setModalVisible(false);
          }}
        >
          <PaymentWidgetIframe checkoutDetails={checkoutDetails} brands={'TAMARA'} iframeOptions={{ locale: locale }} />
        </Modal>
      </TransactionCard>
    );
  },
);

export default Tamara;
