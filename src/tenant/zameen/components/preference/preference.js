import tenantConstants from '@constants';
import tenantData from '@data';
import { Divider } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Card,
  Group,
  Heading,
  LoaderWrapper,
  Select,
  Switch,
  notification,
} from '../../../../components/common';
import { ActionButton } from '../../../../container/pages/user-settings/style';
import { useGetUserDetailFromTokenQuery, useUpdateUserPreferencesMutation } from '../../../../apis/user';

const UserPreference = () => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [updatePreferences, { isLoading: loading }] = useUpdateUserPreferencesMutation();

  const { data: user, isFetching: fetching } = useGetUserDetailFromTokenQuery({}, { refetchOnMountOrArgChange: true });
  const postUserSetting = async (values, { setStatus, setSubmitting }) => {
    setSubmitting(true);
    const res = await updatePreferences({ id: user?.id, values: values });
    if (res) {
      setSubmitting(false);
      if (res.error) {
        setStatus(res.error);
      } else {
        notification.success(res?.data?.message);
      }
    }
  };
  const defaultPreferences = {
    area_unit: 'marla',
    automated_reports: false,
    currency: tenantConstants.CURRENCY,
    email_notification: false,
    newsletter: false,
  };

  useEffect(() => {
    const preferences = defaultPreferences;
    if (user?.settings?.length) {
      user?.settings?.forEach(
        (e) => (preferences[e?.name] = e?.value == '0' ? false : e?.value == '1' ? true : e?.value),
      );
    }
    formik.setValues(preferences);
  }, [user?.settings]);

  const formik = useFormik({
    initialValues: defaultPreferences,
    onSubmit: postUserSetting,
  });

  return (
    <LoaderWrapper loading={fetching}>
      <form style={{ ...(loading && { pointerEvents: 'none', opacity: 0.4 }) }}>
        <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
          <Heading as={isMobile ? 'h5' : 'h3'} className={isMobile ? 'mb-20' : 'mb-40'}>
            {t('Preferences')}
          </Heading>
          <Group style={{ maxWidth: 502, marginInline: 'auto' }}>
            <Switch
              label={t('Email Notification')}
              desc={t('Allow to to receive email notifications')}
              checked={formik?.values?.email_notification}
              onChange={(e) => {
                formik.setFieldValue('email_notification', e);
              }}
            />
            <Divider className="m-0" />
            <Switch
              label={t('Newsletters')}
              desc={t('Allow to stay updated and receive newsletter')}
              checked={formik?.values?.newsletter}
              onChange={(e) => {
                formik.setFieldValue('newsletter', e);
              }}
            />
            <Divider className="m-0" />
            <Switch
              label={t('Automated Reports')}
              desc={t('Allow to send us reports automatically incase of any issue')}
              checked={formik?.values?.automated_reports}
              onChange={(e) => {
                formik.setFieldValue('automated_reports', e);
              }}
            />
            <Divider className="m-0" />
            <Select
              label={t('Currency')}
              options={tenantData?.currencyList}
              defaultValue={tenantConstants.CURRENCY}
              getOptionValue={(e) => e.slug}
              getOptionLabel={(e) => t(e.title)}
              value={tenantConstants.CURRENCY}
              onChange={(e) => {
                formik.setFieldValue('currency', e);
              }}
            />
            <Select
              label={t('Area Unit')}
              options={tenantData?.areaUnitList}
              defaultValue={formik?.values?.area_unit}
              getOptionValue={(e) => e.slug}
              getOptionLabel={(e) => t(e.title_short)}
              value={formik?.values?.area_unit}
              onChange={(e, option) => {
                formik.setFieldValue('area_unit', option?.value);
              }}
            />
            <Alert message={formik.status} />
            <ActionButton>
              <Button
                type="primary"
                size="large"
                onClick={formik?.handleSubmit}
                disabled={formik?.isSubmitting || loading}
                style={{ paddingInline: 64 }}
              >
                {t('Save Changes')}
              </Button>
            </ActionButton>
          </Group>
        </Card>
      </form>
    </LoaderWrapper>
  );
};

export default UserPreference;
