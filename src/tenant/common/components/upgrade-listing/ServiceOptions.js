import React, { forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Group, TextInput } from '../../../../components/common';
import { t } from 'i18next';
import { useFormik } from 'formik';
import { ListingDateSelect } from './style';
import * as yup from 'yup';
import dayjs from 'dayjs';

const ServiceOptions = forwardRef(({ template, gap, className, style }, ref) => {
  const formik = useFormik({
    initialValues: { comments: null, requested_at: null },
    validationSchema: yup.object({
      // comments: yup
      //   .string()
      //   .nullable()
      //   .required(t('Comments are required')),
      requested_at: yup.string().nullable().required(t('Date and time are required')),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {},
  });

  useImperativeHandle(ref, () => {
    return {
      getValues: () => formik?.values,
      handleSubmit: () => formik.submitForm(),
      getErrors: async () => {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length) {
          return errors;
        }
        return null;
      },
      resetForm: () => formik.resetForm(),
      getFormObj: () => formik,
    };
  }, [formik]);

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = (current) => {
    const isFridayOrSaturday = current && (current.day() === 5 || current.day() === 6);
    const isPastOrToday = current && current < moment().endOf('day');

    return isFridayOrSaturday || isPastOrToday;
  };
  const disabledDateTime = () => ({
    disabledHours: () => [...range(0, 9), ...range(19, 24)],
  });

  return (
    <>
      <Group template={template} gap={gap} className={className} style={style}>
        <ListingDateSelect
          className="date-picker"
          value={formik?.values?.['requested_at'] ? dayjs(formik.values['requested_at']) : null}
          style={{ width: '100%' }}
          label={t('Date & Time')}
          onChange={(date) => {
            formik.setFieldValue('requested_at', date);
          }}
          errorMsg={
            formik?.errors['requested_at'] && formik?.touched['requested_at'] && formik?.errors?.['requested_at']
          }
          labelProps={{ className: 'text-muted', style: { alignSelf: 'center' } }}
          disabledDate={disabledDate}
          showNow={false}
          pickerStyle={{ width: '100%' }}
          disabledTime={disabledDateTime}
          placeholder={t('Select date & time')}
          containerClassName="date-picker"
          popupClassName="date-dropdown"
        />
        <TextInput
          name="comments"
          type="text"
          label={t('Comments')}
          placeholder={t('e.g Please call before visiting')}
          value={formik?.values?.['comments']}
          handleChange={formik?.handleChange}
          handleBlur={formik?.handleBlur}
          errorMsg={formik?.errors['comments'] && formik?.touched['comments'] && formik?.errors['comments']}
        />
      </Group>
    </>
  );
});

export default ServiceOptions;
