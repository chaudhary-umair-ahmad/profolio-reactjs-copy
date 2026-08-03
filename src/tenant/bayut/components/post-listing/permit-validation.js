import TenantComponents from '@components';
import { Col, Row } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Button } from '../../../../components/common';
import { Main } from '../../../../container/styled';
import PermitForm from './permit-form';

const PermitValidation = ({ postNewListing, setShowPermitField, crVerificationContinueClickEvent }) => {
  const [fieldToShow, setFieldToShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const advertiserId = fieldToShow?.type;

  const getValidationSchema = () => {
    return yup.object().shape({
      permitNumber: yup
        .number()
        .required(t('Please enter Permit number to continue'))
        .test('len', t('Please enter a valid Permit number'), (value) => value && String(value).length === 8)
        .test(
          'starts-with',
          t('Please enter a valid Permit number'),
          (value) => value && /^(10|50)/.test(String(value)),
        )
        .typeError(t('Please enter a valid Permit number')),
      advertiserId: yup.number().when([], {
        is: () => advertiserId === 'nationalID',
        then: () =>
          yup
            .number()
            .required(t('Please enter National ID'))
            .test('len', t('Please enter a valid national ID number'), (value) => value && String(value).length === 10)
            .typeError(t('Please enter a valid national ID number')),
        otherwise: () =>
          yup
            .number()
            .required(t('Please enter CR Number'))
            .test('len', t('Please enter a valid CR number'), (value) => value && String(value).length === 10)
            .typeError(t('Please enter a valid CR number')),
      }),
    });
  };

  const getInitialValues = () => {
    return {
      permitNumber: '',
      advertiserId: '',
    };
  };

  const handleSubmit = (submittedValues) => {
    setLoading(true);
    postNewListing(
      {
        is_daily_rental: true,
        permit_number: submittedValues?.permitNumber,
        legal_id: submittedValues?.advertiserId,
      },
      (response) => {
        if (response?.error?.data?.redirect_screen === 'Permit Number') setFieldToShow(false);
        setLoading(false);
      },
    );
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: getValidationSchema(),
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const handlePermitValidation = async () => {
    if (formik?.values?.permitNumber && !formik?.errors?.permitNumber) {
      if (formik?.values?.permitNumber?.startsWith('10')) {
        setFieldToShow({ type: 'crID' });
      } else if (formik?.values?.permitNumber?.startsWith('50')) {
        setFieldToShow({ type: 'nationalID' });
      }
    }
  };

  useEffect(() => {
    formik && formik.setValues(getInitialValues());
  }, []);

  return (
    <Main>
      <Row>
        <Col xs={24} lg={18} xxl={15} style={{ margin: 'auto' }}>
          <Button
            size="small"
            className="mb-8"
            style={{ border: 0 }}
            type="primaryOutlined"
            icon="IoMdArrowRoundBack"
            onClick={() => {
              !fieldToShow ? setShowPermitField(false) : setFieldToShow(false);
            }}
            iconSize="14px"
          >
            {' '}
            {t('Back')}
          </Button>
          {fieldToShow ? (
            <TenantComponents.NationalCRForm
              formik={formik}
              advertiserId={advertiserId}
              loading={loading}
              crVerificationContinueClickEvent={crVerificationContinueClickEvent}
              isPermit={true}
            />
          ) : (
            <PermitForm formik={formik} handlePermitValidation={handlePermitValidation} loading={loading} />
          )}
        </Col>
      </Row>
    </Main>
  );
};
export default PermitValidation;
