import { Col, Form, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { regex } from '../../constants/regex';
import { Button, TextInput } from '../common';
import { CreditLimitPopup } from '../table/styled';
import { useSelector } from 'react-redux';
const { Text } = Typography;

const SetCappingLimit = ({ data, copyToAllValue, form, total_agency_credits }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const { t } = useTranslation();
  const { user_id, used_credits, total_available_credits } = data;
  const [quantity, setQuantity] = useState(form?.getFieldValue(`quantity_${user_id}`));

  const validateQuantity = (value) => {
    if (value > total_agency_credits) {
      return `${t('Quantity cannot exceed ')}${total_agency_credits}${t(' credits')}`;
    } else if (value < 0) {
      return t(`Quantity cannot be less than 0`);
    } else if (value == '') {
      return t(`Please enter value`);
    } else if (value < parseInt(used_credits)) {
      return t(`The Credit limit must be greater than or equal to used credits`);
    } else {
      return ``;
    }
  };

  const onQuantityChange = (event) => {
    if (event?.target?.value == '') {
      setQuantity(form?.getFieldValue(`quantity_${user_id}`));
      const errorMsg = validateQuantity(event?.target?.value);
      form?.setFields([{ name: `quantity_${user_id}`, errors: errorMsg ? [errorMsg] : [] }]);
    } else {
      if (regex.naturalNumbers.test(event?.target?.value)) {
        form?.setFieldValue(`quantity_${user_id}`, parseInt(event?.target?.value));
        setQuantity(form?.getFieldValue(`quantity_${user_id}`));
        const errorMsg = validateQuantity(parseInt(event?.target?.value));
        form?.setFields([{ name: `quantity_${user_id}`, errors: errorMsg ? [errorMsg] : [] }]);
      }
    }
  };

  const handleSetMaxCredit = () => {
    form?.setFieldValue(`quantity_${user_id}`, total_agency_credits);
    setQuantity(total_agency_credits);
    form?.setFields([{ name: `quantity_${user_id}`, errors: [] }]);
  };

  useEffect(() => {
    if (copyToAllValue != '') {
      setQuantity(copyToAllValue);
      form?.setFieldValue(`quantity_${user_id}`, copyToAllValue);
    }
  }, [copyToAllValue]);

  return (
    <CreditLimitPopup className={isMobile && 'text-limit'}>
      <Row align="top" wrap={false} gutter={8}>
        <Col className="w-100">
          <Form.Item
            className="mb-0"
            initialValue={total_available_credits}
            name={`quantity_${user_id}`}
            rules={[
              {
                validator: (_, value) =>
                  validateQuantity(value) ? Promise.reject(new Error(validateQuantity(value))) : Promise.resolve(),
              },
            ]}
          >
            <TextInput
              groupStyle={{ gap: '2px', width: !isMobile && '370px' }}
              className="mb-0"
              style={{ height: 40 }}
              size="small"
              type="number"
              onChange={(e) => onQuantityChange(e)}
              suffix={
                <Button
                  type="primaryOutlined"
                  style={{
                    height: '28px',
                    fontSize: isMobile && '12px',
                    borderWidth: 0,
                  }}
                  disabled={parseInt(form?.getFieldValue(`quantity_${user_id}`)) == total_agency_credits}
                  shape="round"
                  onClick={() => handleSetMaxCredit()}
                >
                  {t('Set Max Credits')}
                </Button>
              }
              maxLength={10}
              extra={() => {
                return (
                  <Text type="secondary" className="fz-12">
                    {t('Used Credits: ')}
                    <span style={{ color: '#222' }}>{used_credits}</span>
                  </Text>
                );
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </CreditLimitPopup>
  );
};
export default SetCappingLimit;
