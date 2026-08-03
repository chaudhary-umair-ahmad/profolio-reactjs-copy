import { Col, InputNumber, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import { Button } from '../../../../components/common';

export const DetailInput = props => {
  const { quotaCreditObj, totalQuotaCredit, onChange, zone, initialValue = 0, clearInputs, isMobile } = props;
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (clearInputs) {
      setValue(initialValue);
    }
  }, [clearInputs]);

  const checkError = value => {
    if (value > totalQuotaCredit?.available) {
      setError(true);
      return true;
    } else {
      setError(false);
      return false;
    }
  };

  const onValueChange = value => {
    if (value > 0 && value > totalQuotaCredit?.available) {
      setValue(totalQuotaCredit?.available);
    } else if (value < 0 && Math.abs(value) > quotaCreditObj.available) {
      setValue(-quotaCreditObj.available);
    } else {
      setValue(value || 0);
    }
  };

  return (
    <Row gutter={[8]}>
      <Col>
        <Button
          onClick={() => {
            const newValue = (parseFloat(value) - 1).toFixed(2);
            setValue(newValue);
            onChange(newValue, quotaCreditObj, zone, checkError(newValue));
          }}
          icon={'IconRemoveCircle'}
          iconSize={12}
          disabled={value <= 0 && quotaCreditObj.available - Math.abs(value) < 1}
        />
      </Col>
      <Col flex="auto" xs={13}>
        <InputNumber
          value={value}
          onChange={onValueChange}
          controls={false}
          onBlur={() => {
            onChange(value, quotaCreditObj, zone, checkError(value));
          }}
          status={error ? 'error' : undefined}
          style={{ width: '100%' }}
        />
      </Col>
      <Col>
        <Button
          onClick={() => {
            const newValue = (parseFloat(value) + 1).toFixed(2);
            setValue(newValue);
            onChange(newValue, quotaCreditObj, zone, checkError(newValue));
          }}
          icon={'IconAddCircle'}
          iconColor
          iconSize={16}
          disabled={totalQuotaCredit?.available - value < 1}
        />
      </Col>
    </Row>
  );
};
