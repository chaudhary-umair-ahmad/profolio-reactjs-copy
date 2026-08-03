import * as Yup from 'yup';
import tenantConstants from '@constants';
import { strings } from './strings';
import { regex } from './regex';

export const getContactDetailsValidationSchema = (t, locale = 'en', targetGender = null) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('Please enter name'))
      .test('language',
        locale === 'en'
          ? t('Name should only contain English characters')
          : t('Name should only contain Arabic characters'),
        (value) => {
          if (!value) return true;
          return locale === 'en'
            ? regex.englishRegex.test(value)
            : regex.arabicRegex.test(value);
        }
      ),
    email: Yup.string()
      .required(t('Please enter email'))
      .test('email', t(strings.enter_valid_email_msg), (value) => {
        if (!value) return true;
        return regex.emailRegex.test(value);
      }),
    phone: Yup.string()
      .required(t('Please enter phone number'))
      .test('format', t(strings.im.phone), (value) => {
        if (!value) return true;
        return tenantConstants.PHONE_REGEX ? tenantConstants.PHONE_REGEX.test(value) : true;
      }),
    license: Yup.string().nullable().optional(),
    gender: Yup.string()
      .required(t('Please select gender'))
      .test('target-gender', t('Selected gender is not allowed for this event'), (value) => {
        if (targetGender === 'both' || !targetGender) return true;
        return value === targetGender;
      }),
    age: Yup.number()
      .required(t('Please select age group'))
      .oneOf([1, 2, 3, 4], t('Please select a valid age group'))
      .typeError(t('Please select a valid age group')),
  });
};
