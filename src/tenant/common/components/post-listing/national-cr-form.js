import tenantTheme from '@theme';
import { Divider, Typography } from 'antd';
import cx from 'clsx';
import React from 'react';
import { Button, Card, Flex, Heading, Icon, TextInput } from '../../../../components/common';
import { IconStyled } from '../../../../components/common/icon/IconStyled';
import { getClassifiedBaseURL } from '../../../../utility/env';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { crVerificationContinueClickEvent } from '../../../../services/analyticsService';
import { verifyFALLicenseClickEvent } from '../../../../services/analyticsService';
import { nationalIdVerificationClickEvent } from '../../../../services/analyticsService';
const { Text } = Typography;

const NationalCRForm = ({ formik, advertiserId, loading, isPermit = false }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const verifier = isPermit ? 'Permit Number' : 'ad license';

  const handleContinueClick = () => {
    if (advertiserId === 'nationalID') {
      nationalIdVerificationClickEvent(user);
    } else if (advertiserId === 'crID') {
      crVerificationContinueClickEvent(user);
    }
    formik?.handleSubmit();
  };

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
            <Icon
              icon={advertiserId == 'nationalID' ? 'IDCardIcon' : 'BuildingIcon'}
              size={isMobile ? '54px' : '70px'}
            />
          </IconStyled>
          <Heading as={isMobile ? 'h6' : 'h2'} className={isMobile ? 'mb-0' : 'mb-8'} style={{ fontWeight: '700' }}>
            {advertiserId == 'nationalID'
              ? t('Provide Your National ID Number')
              : t('Provide Your Commercial Registry Number')}
          </Heading>
          <Text className={isMobile ? 'fz-12' : 'fz-16'} type="secondary">
            {advertiserId == 'nationalID'
              ? t(`Your ${verifier} will be verified against the provided ID.`)
              : t(`Your ${verifier} will be verified against the provided CR Number`)}
          </Text>
        </div>
        <Flex className="mb-24 w-100" vertical={isMobile} gap="20px">
          <TextInput
            key="advertiserId"
            name="advertiserId"
            value={formik?.values?.advertiserId}
            type="input"
            onChange={(e) => formik.setFieldValue('advertiserId', e?.target?.value)}
            onBlur={() => formik.setFieldTouched('advertiserId', true)}
            errorMsg={
              formik?.errors['advertiserId'] && formik?.touched['advertiserId'] && formik?.errors['advertiserId']
            }
            placeholder={advertiserId == 'nationalID' ? 'e.g 1100000000' : 'e.g 7010000000'}
            maxLength={10}
            className="w-100"
          />
        </Flex>

        <Button
          className="w-100"
          onClick={handleContinueClick} // Trigger event handler
          loading={loading}
          block
          type={'primary'}
          size={'large'}
        >
          {t('Continue')}
        </Button>
        {advertiserId == 'crID' && !isPermit && (
          <>
            <Divider
              style={{ fontSize: 14, color: tenantTheme['gray600'], '--ant-color-split': tenantTheme['gray400'] }}
            >
              {t('OR')}
            </Divider>
            <Button
              style={{ padding: 0, height: 0, '--btn-padding-y': 0 }}
              size={isMobile ? 'small' : 'large'}
              type={'link'}
              onClick={() => {
                verifyFALLicenseClickEvent(user);
              }}
              href={`${getClassifiedBaseURL()}/${locale}/verification/rega/?redirectPath=${window.location.href}`}
            >
              {t('Permanently Skip this step by verifying your FAL License')}
            </Button>
          </>
        )}
      </Flex>
    </Card>
  );
};
export default NationalCRForm;
