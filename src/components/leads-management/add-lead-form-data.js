import * as Yup from 'yup';
import tenantConstants from '@constants';
import { strings } from '../../constants/strings';
import { regex } from '../../constants/regex';

export const getAddLeadInitialValues = () => ({
  name: null,
  phone: '',
  whatsapp: '',
  email: null,
  interest: null,
});

export const getAddLeadValidationSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t('Please enter name')),
    phone: Yup.string()
      .required(t('Please enter phone number'))
      .test('format', t(strings.im.phone), (value) => {
        if (!value) return true;
        return tenantConstants.PHONE_REGEX ? tenantConstants.PHONE_REGEX.test(value) : true;
      }),
    email: Yup.string()
      .optional()
      .nullable()
      .test('', t(strings.enter_valid_email_msg), function (value) {
        if (!value) return true;
        const isValidEmail = regex.emailRegex.test(value);
        if (!isValidEmail) {
          return false;
        }
        return true;
      }),
    whatsapp: Yup.string()
      .optional()
      .nullable()
      .test('format', t(strings.im.phone), (value) => {
        if (!value) return true;
        return tenantConstants.PHONE_REGEX ? tenantConstants.PHONE_REGEX.test(value) : true;
      }),
  });
