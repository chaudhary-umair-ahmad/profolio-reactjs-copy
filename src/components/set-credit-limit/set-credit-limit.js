import tenantTheme from '@theme';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { regex } from '../../constants/regex';
import { Avatar, Button, Card, DataTable, Flex, Group, Modal, Number, TextInput, notification } from '../common';
import { Text } from '../common/textWithIcon/styled';
import SetCappingLimit from '../set-capping-limit/set-capping-limit';
import { CreditLimitPopup } from '../table/styled';
import { useUpdateAgencyStaffUserCappingMutation } from '../../apis/agency';

const SetStaffCreditLimit = ({ inputValues, copyToAllValue, form, total_agency_credits }) => {
  const updatedValues = inputValues.map((obj) => ({
    ...obj,
    key: obj?.id,
  }));
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const columns = [
    {
      title: 'Staff Details',
      width: isMobile ? '40%' : '50%',
      dataIndex: 'staff_user_details',
      key: 'staff_user_details',
      render: (record) => (
        <Flex gap="10px" align="center">
          <div>
            <Avatar size={34} src={record.image} style={{ margin: 0, padding: 1 }} />
          </div>
          <div>
            {record.user_name && (
              <div className="fw-700" style={{ paddingInlineEnd: '4px', whiteSpace: isMobile && 'break-spaces' }}>
                {record.user_name}
              </div>
            )}
          </div>
        </Flex>
      ),
    },
    {
      title: 'Set Limit',
      width: isMobile ? '60%' : '50%',
      dataIndex: 'user_credit_details',
      key: 'user_credit_details',
      component: 'SetCappingLimit',
      render: (record) => (
        <SetCappingLimit
          data={record}
          copyToAllValue={copyToAllValue}
          form={form}
          total_agency_credits={total_agency_credits}
        />
      ),
    },
  ];
  return <DataTable columns={columns} data={updatedValues} />;
};

const SetCreditsLimit = ({ isVisible, setIsVisible, data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser.user);
  const [copyToAllValue, setCopyToAllValue] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState('');

  const [updateAgencyUserCapping, { isLoading: loading }] = useUpdateAgencyStaffUserCappingMutation();
  const parentKey = data?.owner_id;

  useEffect(() => {
    if (isVisible && data?.cappedUsersList) {
      data.cappedUsersList.map((e) => {
        form.setFieldValue(`quantity_${e?.id}`, e?.user_credit_details?.total_available_credits);
      });
    }
  }, [isVisible, data?.cappedUsersList, form]);

  const onQuantityChange = (event) => {
    const quantity = event?.target?.value;
    if (!quantity) {
      form.setFieldsValue({ [`quantity_${parentKey}`]: '' });
    } else {
      if (regex.naturalNumbers.test(quantity)) {
        form.setFieldsValue({ [`quantity_${parentKey}`]: parseInt(quantity) });
        const newValue = form.getFieldValue(`quantity_${parentKey}`);
        setQuantity(newValue);
        const errorMsg = validateQuantity(parseInt(quantity));
        setError(errorMsg);
      }
    }
  };

  const handleCopyToAll = () => {
    if (form.getFieldValue(`quantity_${parentKey}`) == '') {
      setError(t('Please enter a value to copy to staff users'));
    }
    !error && setCopyToAllValue(form.getFieldValue([`quantity_${parentKey}`]));
  };

  const compareQuantityWithUsedCredits = (value) => {
    let quantityCheck = false;
    data?.cappedUsersList?.map((e) => {
      if (value && value < e?.credits?.ksa?.used) {
        quantityCheck = true;
      }
    });
    return quantityCheck;
  };

  const validateQuantity = (value) => {
    if (value > data?.total_agency_credits) {
      return `${t('Quantity cannot exceed ')}${data?.total_agency_credits}${t(' credits')}`;
    }
    if (value < 0) {
      return t('Quantity cannot be less than 0');
    }
    if (!!compareQuantityWithUsedCredits(value)) {
      return t(`Quantity can not be less than already used credits of any staff user`);
    }
    return '';
  };

  const handleSetMaxCredit = () => {
    const currentValue = form.getFieldValue(`quantity_${parentKey}`);
    if (currentValue != data?.total_agency_credits) {
      form.setFieldsValue({ [`quantity_${parentKey}`]: data?.total_agency_credits });
      const newValue = form.getFieldValue(`quantity_${parentKey}`);
      setQuantity(newValue);
      setError('');
    } else {
      form.setFieldsValue({ [`quantity_${parentKey}`]: '' });
    }
  };

  const handleModalOk = async () => {
    try {
      await form.validateFields();
      const payload = {
        users: data?.cappedUsersList?.map((e) => ({
          user_id: e?.id,
          cap_value: form.getFieldValue([`quantity_${e?.id}`]),
        })),
      };
      const response = await updateAgencyUserCapping({ agencyId: user?.agency?.id, ...payload });
      if (response) {
        if (response?.error) {
          notification.error(response?.error);
        } else {
          form.setFieldValue(`quantity_${parentKey}`, '');
          setIsVisible(false);
          setError('');
          setCopyToAllValue('');
        }
      }
    } catch (error) {}
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsVisible(false);
    setError('');
    setCopyToAllValue('');
  };

  return (
    <Modal
      width={770}
      visible={isVisible}
      title={t('Set Credits Limit')}
      okText={t('Apply')}
      onCancel={handleModalCancel}
      onOk={handleModalOk}
      bodyStyle={{ padding: isMobile ? 16 : 24 }}
      loading={loading}
    >
      <Form form={form}>
        <Card
          className={isMobile ? 'mb-16' : 'mb-32'}
          style={{ borderWidth: 1, borderRadius: '4px', backgroundColor: tenantTheme['primary-light-4'] }}
        >
          <Flex gap="20px" className="totalCredit" justify="space-between">
            <Text className="text-muted" style={{ color: tenantTheme['text-color-secondary'] }}>
              {t('Total')}
            </Text>
            <Text>
              <span className="fw-700" style={{ marginInlineEnd: '8px' }}>
                <Number compact={false} value={data?.total_agency_credits} dashForNone={false} />
              </span>
              <span style={{ color: tenantTheme['text-color-secondary'] }}>{t('Credits')}</span>
            </Text>
          </Flex>
        </Card>

        <CreditLimitPopup>
          <Group
            template={isMobile ? '1fr' : '310px 1fr'}
            gap={isMobile && '5px'}
            style={{ alignItems: 'center' }}
            className="mb-12"
          >
            <Text className="fw-700 fz-14">{t('Set Limit')}</Text>
            <Flex align="start" gap={isMobile ? '6px' : '10px'}>
              <Form.Item
                validateStatus={error ? 'error' : ''}
                help={error}
                name={`quantity_${parentKey}`}
                initialValue={''}
                className="mb-0"
                rules={[
                  {
                    validator: (_, value) =>
                      validateQuantity(value) ? Promise.reject(new Error(validateQuantity(value))) : Promise.resolve(),
                  },
                ]}
              >
                <TextInput
                  className="w-100"
                  style={{ height: 40 }}
                  size="small"
                  onChange={(e) => onQuantityChange(e)}
                  type="number"
                  maxLength={10}
                  placeholder={t('Set credits for all')}
                  suffix={
                    <Button
                      type="primaryOutlined"
                      style={{ fontSize: isMobile && '12px', height: '28px', borderWidth: 0 }}
                      disabled={isVisible && form.getFieldValue(`quantity_${parentKey}`) == data?.total_agency_credits}
                      shape="round"
                      onClick={handleSetMaxCredit}
                    >
                      {t('Set Max Credits')}
                    </Button>
                  }
                  onBlur={(e) => {
                    if (e?.target?.value == '') {
                      isVisible && form.setFieldValue(`quantity_${parentKey}`, '');
                      setError('');
                    }
                  }}
                />
              </Form.Item>
              <Button
                size={isMobile && 'small'}
                onClick={handleCopyToAll}
                type="primary"
                style={{ height: 40 }}
                disabled={isVisible && !parseInt(form.getFieldValue(`quantity_${parentKey}`))}
              >
                {t('Apply To All')}
              </Button>
            </Flex>
          </Group>
        </CreditLimitPopup>
        <SetStaffCreditLimit
          inputValues={data?.cappedUsersList}
          copyToAllValue={copyToAllValue}
          form={form}
          total_agency_credits={data?.total_agency_credits}
        />
      </Form>
    </Modal>
  );
};
export default SetCreditsLimit;
