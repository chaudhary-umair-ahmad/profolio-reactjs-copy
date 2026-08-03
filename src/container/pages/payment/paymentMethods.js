import tenantTheme from '@theme';
import cx from 'clsx';
import { default as React } from 'react';
import { useTranslation } from 'react-i18next';
import CheckoutComponents from '../../../components/checkout';
import { Group, TextWithIcon } from '../../../components/common';
import { PaymentCard, PaymentContainer } from './styled';
import { Badge } from 'antd';
import tenantConstants from '@constants';

const PaymentMethods = (props) => {
  const { isMobile, checkoutRef, paymentMethods, selectedMethod, handleChangeSelectedMethod } = props;
  const { t } = useTranslation();

  const renderSelectedPaymentMethodComponent = () => {
    const SelectedPaymentMethodComponent = CheckoutComponents[selectedMethod?.component];
    return <SelectedPaymentMethodComponent ref={checkoutRef} {...props} />;
  };

  const renderPaymentItem = (e) => {
    return (
      <PaymentCard
        style={{ borderWidth: 1, scrollSnapAlign: 'start' }}
        className={selectedMethod?.key == e?.key ? 'active-card' : ''}
        onClick={() => handleChangeSelectedMethod(e)}
        key={e.id}
      >
        <TextWithIcon
          vertical
          align="start"
          icon={e?.icon}
          title={t(e?.label)}
          iconProps={{ size: e?.size }}
          fontWeight={700}
          key={e?.key}
          textColor={selectedMethod?.key == e?.key && tenantTheme['primary-color']}
          textSize={isMobile && '12px'}
        />
      </PaymentCard>
    );
  };

  return (
    <>
      {paymentMethods?.length > 1 && tenantConstants.SHOW_PAYMENT_METHODS && (
        <PaymentContainer title={<div className="fw-700">{t('Payment Method')}</div>}>
          <Group
            template={'repeat(4,1fr)'}
            gap="12px"
            className={cx('pointer mb-24', isMobile && 'scroll-x')}
            style={{
              width: '100%',
              ...(isMobile && {
                '--box-width': '355px',
                '--scrollbar-width': 'none',
                scrollSnapType: 'x mandatory',
              }),
            }}
          >
            {paymentMethods?.map((e) =>
              !e?.hideNewBadge ? (
                <Badge.Ribbon
                  key={e.id} // Ensure a unique key
                  text={t('NEW')}
                  color="red"
                  placement="end"
                  style={{ fontSize: '12px' }}
                >
                  {renderPaymentItem(e)}
                </Badge.Ribbon>
              ) : (
                renderPaymentItem(e)
              ),
            )}
          </Group>
        </PaymentContainer>
      )}
      {selectedMethod && <div>{renderSelectedPaymentMethodComponent()}</div>}
    </>
  );
};
export default PaymentMethods;
