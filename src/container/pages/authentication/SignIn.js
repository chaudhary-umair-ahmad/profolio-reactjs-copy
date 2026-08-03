import { Form, Input, Radio } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Heading } from '../../../components/common';
import { RadioButtonStyled } from '../../../components/common/radio-button/styled';
import { AuthWrapper } from './style';
import tenantConstants from '@constants';
import { setAppTokens } from '../../../store/authSlice';
import Cookies from 'js-cookie';
import { cookieDomain } from '../../../utility/env';
import { useLoginMutation } from '../../../store/authApi';
import { getAppLanguage } from '../../../utility/language';

const SignIn = () => {
  const { t } = useTranslation();
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [login, { isLoading, isError, error }] = useLoginMutation();

  // `error` can be a string (transformed backend error) or an object (e.g. a fetch/network failure
  // shaped `{ message }`). Antd's <Alert message> renders its child directly, so passing the object
  // throws "Objects are not valid as a React child" and white-screens the page. Coerce to a string.
  const loginErrorMessage =
    typeof error === 'string' ? error : error?.message || error?.error || t('Something went wrong, please try again');

  const handleSubmit = async (values) => {
    const response = await login(values).unwrap();

    // TODO Add to a hook
    if (response?.data) {
      dispatch(
        setAppTokens({
          token: response?.data?.access_token,
          authenticated: !!response?.data?.access_token,
          initialized: true,
        }),
      );
      response.data.user &&
        Cookies.set(tenantConstants.AUTH_TOKEN_COOKIE_KEY, response.data.access_token, {
          secure: true,
          sameSite: 'Lax',
          path: '/',
          ...(cookieDomain && { domain: cookieDomain }),
        });
    }

    // onLogin(values);
  };

  const onChangeLanguage = (event) => {
    const lang = tenantConstants.LANGUAGES?.find((e) => e.key == event.target.value);
    const currentLanguage = getAppLanguage();
    const pathDirectories = window.location.pathname.split('/');
    let newPath;
    if (pathDirectories[1] !== lang.key) {
      if (window.location.pathname.includes(`/${currentLanguage?.key}`)) {
        newPath = [window.location.pathname.replace(`/${currentLanguage?.key}`, `/${lang?.key}`)];
      } else {
        newPath = [pathDirectories[0], lang?.key, pathDirectories.slice(1)];
      }
    }
    window.location.pathname = newPath.join('/');
  };

  return (
    <AuthWrapper>
      <div className="auth-contents" style={{ height: 'inherit' }}>
        <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            {t('Sign in to')} <span className="text-primary">{t('Profolio')}</span>
          </Heading>
          <Form.Item
            name="email"
            rules={[
              { message: t('Please input email'), required: true },
              { message: t('Please enter valid email'), type: 'email' },
            ]}
            initialValue=""
            label={t('Email Address')}
          >
            <Input placeholder={t('Email')} />
          </Form.Item>
          <Form.Item
            name="password"
            initialValue=""
            label={t('Password')}
            rules={[{ message: t('Please enter password'), required: true }]}
          >
            <Input.Password placeholder={t('Password')} />
          </Form.Item>
          {!isLoading && error && <Alert message={loginErrorMessage} style={{ marginBottom: 16 }} />}
          <Form.Item>
            <Button
              className="btn-signin"
              htmlType="submit"
              type="primary"
              size="large"
              loading={isLoading}
              disabled={isLoading}
            >
              {t('Sign In')}
            </Button>
          </Form.Item>

          <Radio.Group value={locale} style={{ width: '100%' }} size="small" onChange={onChangeLanguage}>
            {tenantConstants.LANGUAGES?.length > 1 &&
              tenantConstants.LANGUAGES?.map((e) => (
                <RadioButtonStyled key={e.label} value={e.key}>
                  {e.label}
                </RadioButtonStyled>
              ))}
          </Radio.Group>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export default SignIn;
