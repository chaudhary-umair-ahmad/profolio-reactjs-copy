import React, { useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Divider, Form } from 'antd';

import { getContactDetailsValidationSchema } from '../../constants/validationSchemas';
import MobileVerification from '../mobile-number-verification/mobile-verification';
import { Card, TextInput, RadioButtons, Group, Select } from '../common';
import { AGE_OPTIONS } from '../../container/pages/payment/constants';
import tenantUtils from '@utils';
import { getLocalizedFieldName } from '../../utility/utility';

const ContactDetailsForm = forwardRef(({ disableFields = true, targetGender }, ref) => {
  const user = useSelector((state) => state.app.loginUser.user);
  const { isMobile, locale } = useSelector((state) => state?.app?.AppConfig);

  const { t } = useTranslation();

  const validationSchema = getContactDetailsValidationSchema(t, locale, targetGender);

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      name: user?.[getLocalizedFieldName('name', locale)] || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      license: user?.agency?.fALLicenseNumber || '',
      gender: user?.gender || '',
      age: user?.age_group?.value || null,
    },
    validationSchema,
  });

  useEffect(() => {
    if (user?.agency?.fALLicenseNumber && !formik?.values?.license) {
      formik.setFieldValue('license', user?.agency?.fALLicenseNumber || '');
    }
  }, [user?.agency?.fALLicenseNumber]);

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const errors = await formik.validateForm();
      const hasErrors = Object.keys(errors).length > 0;

      if (hasErrors) {
        Object.keys(errors).forEach((field) => {
          formik.setFieldTouched(field, true);
        });
        return { isValid: false, errors, values: formik.values };
      }

      return { isValid: true, values: formik.values };
    },
    getValues: () => formik.values,
    isValid: formik.isValid,
    isDirty: formik.dirty,
  }));

  return (
    <Card className="mb-20">
      <div className="fw-700 fs16">{t('Contact Details')}</div>
      <Divider />
      <Form>
        <Group
          className="mb-16"
          template={isMobile ? 'initial' : 'repeat(2, 1fr)'}
          gap={isMobile ? '16px' : '44px'}
          style={{ alignItems: 'start' }}
        >
          <TextInput
            name="name"
            label={t('Name')}
            placeholder={t('Enter Name')}
            handleChange={(event) => {
              formik.setFieldValue('name', event.target.value);
            }}
            value={formik.values.name}
            maxLength={200}
            disabled={disableFields && !!user?.[getLocalizedFieldName('name', locale)]}
            errorMsg={formik?.touched?.name && formik?.errors?.name ? formik?.errors?.name : ''}
          />

          <TextInput
            name="email"
            label={t('Email')}
            placeholder={t('Enter Email')}
            handleChange={(event) => {
              formik.setFieldValue('email', event.target.value);
            }}
            value={formik.values.email}
            disabled={disableFields && !!user?.email}
            errorMsg={formik?.touched?.email && formik?.errors?.email ? formik?.errors?.email : ''}
          />

          <MobileVerification
            key="phone"
            name="phone"
            value={formik?.values?.['phone']}
            label={t('Phone Number')}
            defaultCountry="SA"
            countrySelectProps={{ disabled: true }}
            disabled={disableFields && !!user?.mobile}
            errorMsg={formik?.touched?.phone && formik?.errors?.phone ? formik?.errors?.phone : ''}
            onChange={(value) => {
              formik.setFieldValue(`phone`, !!value ? value : '', true);
            }}
            canVerify={false}
          />

          <TextInput
            name="license"
            label={t('FAL/WAFI License')}
            placeholder={t('Enter License Number')}
            handleChange={(event) => {
              formik.setFieldValue('license', event.target.value);
            }}
            value={formik.values.license}
            // disabled={disableFields && !!user?.agency?.fALLicenseNumber}
            errorMsg={formik?.touched?.license && formik?.errors?.license ? formik?.errors?.license : ''}
            isOptional
          />

          <RadioButtons
            name="gender"
            label={t('Gender')}
            value={formik?.values['gender']}
            handleChange={(e) => {
              formik.setFieldValue('gender', e?.target?.value, true);
            }}
            buttonList={[
              { key: 'male', label: t('Male') },
              { key: 'female', label: t('Female') },
            ]}
            disabled={disableFields && !!user?.gender}
            errorMsg={formik?.touched?.gender && formik?.errors?.gender ? formik?.errors?.gender : ''}
            shape="round"
          />

          <Select
            name="age"
            label={t('Age')}
            placeholder={t('Select Age Group')}
            value={formik.values.age}
            options={AGE_OPTIONS}
            getOptionLabel={(option) => tenantUtils.getLocalisedString(option, 'label')}
            getOptionValue={(option) => option.value}
            onChange={(value) => {
              formik.setFieldValue('age', value);
            }}
            disabled={disableFields && !!user?.age_group}
            errorMsg={formik?.touched?.age && formik?.errors?.age ? formik?.errors?.age : ''}
          />
        </Group>
      </Form>
    </Card>
  );
});

export default ContactDetailsForm;
