import TenantComponents from '@components';
import { Col, Row } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Button, notification } from '../../../../components/common';
import { Main } from '../../../../container/styled';
import { useLazyGetLicenseValidityQuery } from '../../../../apis/postlisting';

const LicenseValidation = ({ postNewListing, setShowAdLicenseField }) => {
  const [fieldToShow, setFieldToShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const advertiserId = fieldToShow?.show_nafaz_id ? 'nationalID' : 'crID';

  const [getLicenseValidity] = useLazyGetLicenseValidityQuery();

  const getValidationSchema = () => {
    return yup.object().shape({
      adLicense: yup
        .number()
        .required(t('Please enter AD License to continue'))
        .test(
          'len',
          t('Please enter a valid advertisement license number'),
          (value) => value && String(value).length === 10,
        )
        .test(
          'starts-with',
          t('Please enter a valid advertisement license number'),
          (value) => value && /^(71|72)/.test(String(value)),
        )
        .typeError(t('Please enter AD License to continue')),
      advertiserId: yup.number().when([], {
        is: () => advertiserId === 'nationalID',
        then: () =>
          yup
            .number()
            .required(t('Please enter National ID'))
            .test('len', t('Please enter a valid national ID number'), (value) => value && String(value).length === 10)
            .typeError(t('Please enter National ID')),
        otherwise: () =>
          yup
            .number()
            .required(t('Please enter CR Number'))
            .test('len', t('Please enter a valid CR number'), (value) => value && String(value).length === 10)
            .typeError(t('Please enter CR Number')),
      }),
    });
  };
  const getInitialValues = () => {
    return {
      adLicense: '',
      advertiserId: '',
    };
  };
  const handleSubmit = (submittedValues) => {
    setLoading(true);
    postNewListing(
      {
        ad_license_number: submittedValues?.adLicense,
        advertiser_id: submittedValues?.advertiserId,
        license_type: fieldToShow?.license_type,
      },
      () => {
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
  useEffect(() => {
    formik && formik.setValues(getInitialValues());
  }, []);

  const handleAdLicenseValidation = async () => {
    if (formik?.values?.adLicense && !formik?.errors?.adLicense) {
      setLoading(true);
      const response = await getLicenseValidity(formik?.values?.adLicense);
      if (response) {
        setLoading(false);
        if (response?.error) {
          const errMsg =
            typeof response.error === 'string'
              ? response.error
              : response.error?.errorMessage || response.error?.message || t('Something went wrong');
          notification.error(errMsg);
        } else if (response?.data?.license_number) {
          postNewListing({
            ad_license_number: formik?.values?.adLicense,
            license_number: response?.data?.license_number,
            license_type: response?.data?.license_type,
          });
        } else {
          setFieldToShow(response?.data);
        }
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
              !fieldToShow ? setShowAdLicenseField(false) : setFieldToShow(false);
            }}
            iconSize="14px"
          >
            {' '}
            {t('Back')}
          </Button>
          {fieldToShow ? (
            <TenantComponents.NationalCRForm formik={formik} advertiserId={advertiserId} loading={loading} />
          ) : (
            <TenantComponents.AdLicenseForm
              formik={formik}
              handleAdLicenseValidation={handleAdLicenseValidation}
              loading={loading}
            />
          )}
        </Col>
      </Row>
    </Main>
  );
};
export default LicenseValidation;
