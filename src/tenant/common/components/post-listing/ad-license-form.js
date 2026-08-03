import TenantComponents from '@components';
import cx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Card, Flex, Heading, Icon, Tag, TextInput } from '../../../../components/common';
import { IconStyled } from '../../../../components/common/icon/IconStyled';
import tenantTheme from '@theme';
import {
  adLicenseVerificationClickEvent,
  getAdLicenseClickEvent,
  viewAdEvent,
} from '../../../../services/analyticsService';
import { Divider, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const AdLicenseForm = ({ formik, handleAdLicenseValidation, loading }) => {
  const [licenseModalVisible, setLicenseModalVisible] = useState(false);

  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);
  const navigate = useNavigate();

  useEffect(() => {
    viewAdEvent(user);
  }, []);

  return (
    <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
      <Flex
        className="w-100 m-auto"
        vertical
        align="center"
        justify={!isMobile ? 'center' : undefined}
        style={{ minHeight: '410px', maxWidth: '560px' }}
      >
        <div className={cx(isMobile ? 'mb-20' : 'mb-32', 'text-center')}>
          <IconStyled
            className={cx(isMobile ? 'mb-20' : 'mb-24', 'm-auto')}
            style={{
              '--icon-styled-width': isMobile ? '94px' : '124px',
              background: tenantTheme['primary-color-1'],
            }}
          >
            <Icon icon="LicenseIcon" size={isMobile ? '54px' : '70px'} />
          </IconStyled>

          <Heading as={isMobile ? 'h6' : 'h2'} className={isMobile ? 'mb-0' : 'mb-8'} style={{ fontWeight: '700' }}>
            {t('Enter Ad License Number')}
          </Heading>
          <div className={cx(isMobile ? 'fz-12' : 'fz-16', 'text-muted')}>
            {t(
              'As per the real estate brokerage regulations, you must add an advertisement license to be able to publish it.',
            )}
          </div>
          <Button
            type={'link'}
            style={{ padding: '4px', textDecoration: 'underline' }}
            onClick={() => setLicenseModalVisible(true)}
          >
            {t('Learn More')}
          </Button>
        </div>
        <Flex vertical={isMobile} className="mb-24 w-100" gap="20px">
          <TextInput
            key="adLicense"
            name="adLicense"
            value={formik.values.adLicense}
            type="input"
            onChange={(e) => formik.setFieldValue('adLicense', e?.target?.value)}
            onBlur={() => formik.setFieldTouched('adLicense', true)}
            errorMsg={formik?.errors['adLicense'] && formik?.touched['adLicense'] && formik?.errors['adLicense']}
            placeholder={'e.g 7200000001'}
            maxLength={10}
            className="w-100"
          />
        </Flex>

        <Button
          className="w-100"
          onClick={() => {
            adLicenseVerificationClickEvent(user);
            formik.setFieldTouched('adLicense', true);
            handleAdLicenseValidation();
          }}
          loading={loading}
          type={'primary'}
          size={'large'}
        >
          {t('Continue')}
        </Button>
        <Divider type="horizontal">
          <Text className={'fz-14 text-muted'}>{t('OR')}</Text>
        </Divider>
        <Card
          className="creditCard"
          style={{ backgroundColor: tenantTheme['primary-light-4'], borderWidth: 0, width: '100%' }}
        >
          <Flex align="center" justify="space-between">
            <Flex vertical>
              <Text className="fw-700 fz-16">{t("Don't have an Ad License")}</Text>
              <Text className="fz-14">{t('Get one through Bayut, starting from SAR 250.')}</Text>
            </Flex>
            <Flex align="center">
              <Button
                type={'link'}
                onClick={() => {
                  getAdLicenseClickEvent(user, true);
                  navigate('/ad-license');
                }}
              >
                {t('Get an Ad License')}
              </Button>
              <Tag
                color={tenantTheme['danger-color']}
                style={{
                  '--tag-color': '#fff',
                  '--tag-font-size': '10px',
                  padding: '3px 6px',
                  'border-radius': '16px',
                  fontWeight: 700,
                }}
              >
                {t('NEW')}
              </Tag>
            </Flex>
          </Flex>
        </Card>
        {licenseModalVisible && (
          <TenantComponents.LicenseValidationGuide
            licenseModalVisible={licenseModalVisible}
            setLicenseModalVisible={setLicenseModalVisible}
          />
        )}
      </Flex>
    </Card>
  );
};
export default AdLicenseForm;
