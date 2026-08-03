import { Col, Row } from 'antd';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import tenantTheme from '@theme';
import { useGetBankingDetailsQuery, useSaveBankDetailsMutation } from '../../../apis/user';
import { Button, Card, LoaderWrapper, notification, TextWithIcon } from '../../../components/common';
import { JSONFormStyled } from '../../../components/common/json-form/json-form';
import { stringValidationYup } from '../../../helpers';
import {
  Group,
  Flex,
  Icon,
  Tag
} from '../../../components/common';
import { ActionButton } from './style';
import { AlertStyled } from '../../../components/common/alert/styled';

const BankDetail = () => {
  const { t } = useTranslation();
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const formRef = useRef();

  const { data: bankDetails, isFetching: fetching } = useGetBankingDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [saveBankDetails, { isLoading: saving }] = useSaveBankDetailsMutation();

  const fields = useMemo(
    () => ({
      bankName: {
        type: 'input',
        value: '',
        validation: () => stringValidationYup(t('Please enter bank name')).nullable()
                          .min(2, t('Bank name must be at least 2 characters'))
                          .max(100, t('Bank name must be at most 100 characters')),
        props: {
          label: 'Bank Name',
          placeholder: 'Enter your bank name',
          minLength: 2,
          maxLength: 100,
        },
      },
      accountTitle: {
        type: 'input',
        value: '',
        validation: () => stringValidationYup(t('Please enter account title')).nullable()
                          .min(2, t('Account title must be at least 2 characters'))
                          .max(100, t('Account title must be at most 100 characters')),
        props: {
          label: 'Account Title',
          placeholder: 'Enter your account title',
          minLength: 2,
          maxLength: 100,
        },
      },
      ibanNumber: {
        type: 'input',
        value: '',
        validation: () =>
          stringValidationYup(t('Please enter IBAN number')).nullable().length(24, t('IBAN must be 24 characters')),
        props: {
          label: 'IBAN Number',
          placeholder: 'Enter your IBAN Number',
          minLength: 24,
          maxLength: 24,
        },
      },
      accountNumber: {
        type: 'input',
        value: '',
        validation: () => stringValidationYup(t('Please enter account number')).nullable()
                          .min(5, t('Account number must be at least 5 characters'))
                          .max(20, t('Account number must be at most 20 characters')),
        props: {
          label: 'Account Number',
          placeholder: 'Enter your account number',
          minLength: 5,
          maxLength: 20,
        },
      },
      swiftCode: {
        type: 'input',
        value: '',
        validation: () =>
          stringValidationYup(
            t('Please enter swift code'),
            /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
            t('Invalid SWIFT code format'),
          )
            .nullable()
            .min(6, t('SWIFT code must be at least 6 characters'))
            .max(12, t('SWIFT code must be at most 12 characters')),
        props: {
          label: 'SWIFT Code',
          placeholder: 'Enter your SWIFT Code',
          minLength: 6,
          maxLength: 12,
        },
      },
    }),
    [t],
  );

  const handleSubmit = async (values) => {
    try {
      const result = await saveBankDetails({
        forUpdate: !!bankDetails,
        body: {
          banking_detail: {
            bank_name: values?.bankName,
            account_title: values?.accountTitle,
            account_number: values?.accountNumber,
            iban: values?.ibanNumber,
            swift_code: values?.swiftCode,
          }
        },
      });
      if (result?.error) {
        notification.error(result?.error || t('Failed to save bank details'));
      } else {
        notification.success(t(result?.data?.message || 'Bank details saved successfully'));
      }
    } catch (err) {
      notification.error(t('Failed to save bank details'));
    }
  };

  const formFieldValues = bankDetails ?? {};

  const renderStatusChip = () => {
    const status = bankDetails?.status?.slug;
    if (!status){
      return <></>
    }

    const color = status === 'verified' ? 'green' : status === 'pending-verification' ? 'yellow' : 'red';
    return (
      <Tag color={color} shape="round" size="12px">
        <Flex className="base-color" gap="4px" align="center">
          {rtl ? bankDetails?.status?.name_l1 : bankDetails?.status?.name}

          {status === 'verified' && <Icon icon="PiSealCheckFill" color={tenantTheme['info-color-alt']} />}
        </Flex>
      </Tag>
    )
  }

  const renderRejectionReason = () => {
    if (bankDetails?.status?.slug !== 'rejected' || !bankDetails?.rejection_reason?.length){
      return <></>;
    }

    return <AlertStyled className='mt-20' type="error" message={bankDetails?.rejection_reason} />
  }

  return (
    <Group gap="16px">
      <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
        <LoaderWrapper loading={fetching || saving}>
          <div style={{ paddingInline: isMobile ? 4 : 40 }}>
            <Flex justify="flex-end" width="100%">
              {renderStatusChip()}
            </Flex>
            <JSONFormStyled
              fields={fields}
              formFieldValues={formFieldValues}
              ref={formRef}
              onSubmitForm={handleSubmit}
              noOfContentColumns={2}
              groupGap="24px 54px"
            />
            {renderRejectionReason()}
            <Row>
              <Col xs={24} style={{ maxWidth: 880, margin: '18px auto 0' }}>
                <ActionButton>
                  <Button
                    type="primary"
                    size="large"
                    disabled={fetching || saving}
                    loading={saving}
                    onClick={async () => {
                      const form = formRef.current;
                      if (!form) return;
                      const errors = await form.validateForm();
                      if (errors && Object.keys(errors).length > 0) {
                        const touched = Object.keys(errors).reduce(
                          (acc, k) => ({ ...acc, [k]: true }),
                          {},
                        );
                        form.setTouched(touched);
                        form.setErrors(errors);
                        return;
                      }
                      form.handleSubmit();
                    }}
                    style={{ paddingInline: 64 }}
                  >
                    {t('Save')}
                  </Button>
                </ActionButton>
              </Col>
            </Row>
          </div>
        </LoaderWrapper>
      </Card>
    </Group>
  );
};

export default BankDetail;
