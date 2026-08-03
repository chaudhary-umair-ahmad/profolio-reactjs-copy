import tenantTheme from '@theme';
import React from 'react';
import { Alert, Icon, TextWithIcon } from '..';

const ErrorMessage = ({ message, asAlert }) => {
  /* {!!errorMsg && <Typography.Text type="danger">{errorMsg}</Typography.Text>} */

  if (asAlert) {
    return (
      !!message && (
        <Alert
          type="error"
          style={{ marginTop: '8px' }}
          showIcon
          className="fz-12"
          icon={<Icon icon="RiErrorWarningLine" />}
          message={<div style={{ color: tenantTheme['danger-color'] }}>{message} </div>}
        />
      )
    );
  }
  return (
    !!message && (
      <TextWithIcon
        icon="RiErrorWarningLine"
        value={<small className="fz-14">{message}</small>}
        iconProps={{ color: tenantTheme['danger-color'], size: 14 }}
        textColor={tenantTheme['danger-color']}
      />
    )
  );
};

export default ErrorMessage;
