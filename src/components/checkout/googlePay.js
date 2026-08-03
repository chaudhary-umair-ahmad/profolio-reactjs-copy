import { Divider, Typography } from 'antd';
import React from 'react';
import { TextWithIcon } from '../common';
import { GooglePayIcon } from '../svg';
import { TransactionCard } from './styled';
import tenantTheme from '@theme';
const { Text } = Typography;

const GooglePay = ({ item, extra, title }) => {
  return (
    <TransactionCard
      style={{ borderWidth: 1 }}
      title={<div className="fw-700">Google Pay</div>}
      extra={<GooglePayIcon size="50px" />}
    >
      <TextWithIcon
        icon="VerificationIcon"
        iconProps={{ size: '24px' }}
        title="Another step will appear to securely submit your payment information."
        textColor={tenantTheme['gray800']}
      />

      <Divider />

      <Text type="secondary">
        By continuing, you allow to charge your Google Pay for this payment and future payments in accordance with their
        terms.
      </Text>
    </TransactionCard>
  );
};

export default GooglePay;
