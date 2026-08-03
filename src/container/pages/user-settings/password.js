import tenantConstants from '@constants';
import { Formik, useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { useChangePasswordMutation } from '../../../apis/user';
import { KC_REQUESTS } from '../../../keycloak/requests';
import { getRequestHeaders } from '../../../store/parentApi';
import { Alert, Button, Card, Group, TextInput, notification } from '../../../components/common';
import { regex } from '../../../constants/regex';
import { ActionButton } from './style';

const UserPassword = () => {
  const { t } = useTranslation();
  const [changePassword] = useChangePasswordMutation();
  const user = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const auth = useSelector((state) => state.auth.login);
  const submitPasswordForm = async (values, { setStatus }) => {
    formik?.setSubmitting(true);

    let response;

    if (tenantConstants.KC_ENABLED) {
      response = await KC_REQUESTS.change_password.request(
        {
          old_password: values?.oldPassword,
          new_password: values?.newPassword,
        },
        getRequestHeaders(auth, {}, KC_REQUESTS.change_password.url),
      );
    } else {
      response = await changePassword({ userId: user?.id, values: values, auth: auth });
    }

    formik?.setSubmitting(false);
    if (response?.error) {
      setStatus(t(response?.error_description || response?.error));
    } else {
      notification.success(t(response?.data?.message || response?.message || 'Password Updated Successfully'));
      formik?.resetForm();
    }
  };

  const getPasswordValidation = () =>
    yup.string().required(t('Please Enter Your New Password')).min(8, t('Password must be at least 8 characters'));

  const getConfirmPasswordValidation = () =>
    yup
      .string()
      .required(t('Please Confirm Your Password'))
      .oneOf([yup.ref('newPassword'), null], t("Passwords don't match!"))
      .min(8, t('Password must be at least 8 characters'));

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: yup.object().shape({
      oldPassword: yup.string().required(t('Please Enter your Password')),
      newPassword: tenantConstants.KC_ENABLED
        ? getPasswordValidation().test('regex', t('Password is not valid'), (value) =>
            value ? regex.password.test(value) : true,
          )
        : getPasswordValidation(),
      confirmPassword: tenantConstants.KC_ENABLED
        ? getConfirmPasswordValidation().test('regex', t('Password is not valid'), (value) =>
            value ? regex.password.test(value) : true,
          )
        : getConfirmPasswordValidation(),
    }),
    onSubmit: submitPasswordForm,
  });

  return (
    <Formik onSubmit={formik?.handleSubmit}>
      <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
        <Group style={{ maxWidth: 500, marginInline: 'auto' }}>
          <TextInput
            label={t('Enter Old Password')}
            placeholder={t('Enter Old Password')}
            value={formik?.values?.oldPassword}
            handleChange={formik.handleChange('oldPassword')}
            handleBlur={formik.handleBlur('oldPassword')}
            errorMsg={formik?.touched?.oldPassword && formik?.errors.oldPassword && formik?.errors.oldPassword}
            inputType="password"
          />
          <TextInput
            label={t('Enter New Password')}
            placeholder={t('Enter New Password')}
            value={formik?.values?.newPassword}
            handleChange={formik.handleChange('newPassword')}
            handleBlur={formik.handleBlur('newPassword')}
            errorMsg={formik?.touched?.newPassword && formik?.errors.newPassword && formik?.errors.newPassword}
            inputType="password"
          />
          <TextInput
            label={t('Confirm Password')}
            placeholder={t('Confirm Password')}
            value={formik?.values?.confirmPassword}
            handleChange={formik.handleChange('confirmPassword')}
            handleBlur={formik.handleBlur('confirmPassword')}
            errorMsg={
              formik?.touched?.confirmPassword && formik?.errors.confirmPassword && formik?.errors.confirmPassword
            }
            inputType="password"
          />
          <Alert message={formik.status} />
          <ActionButton>
            <Button
              type="primary"
              size="large"
              style={{ paddingInline: 64 }}
              onClick={formik?.handleSubmit}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            >
              {t('Confirm')}
            </Button>
          </ActionButton>
        </Group>
      </Card>
    </Formik>
  );
};

export default UserPassword;
