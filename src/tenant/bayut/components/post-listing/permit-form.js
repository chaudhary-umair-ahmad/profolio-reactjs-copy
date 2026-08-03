import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Card, Flex, Heading, Icon, TextInput } from '../../../../components/common';
import { IconStyled } from '../../../../components/common/icon/IconStyled';
import tenantTheme from '@theme';
import { adLicenseVerificationClickEvent } from '../../../../services/analyticsService';

const PermitForm = ({ formik, handlePermitValidation, loading }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);
  return (
    <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
      <Flex
        className="w-100 m-auto"
        vertical
        align="center"
        justify={!isMobile && 'center'}
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
            {t('Provide Your Property Permit Number')}
          </Heading>
          <div className={cx(isMobile ? 'fz-12' : 'fz-16', 'text-muted')}>
            {t(
              'As per the Ministry of Tourism regulations, you must add a permit number to be able to publish the listing.',
            )}
          </div>
        </div>
        <Flex vertical={isMobile && true} className="mb-24 w-100" gap="20px">
          <TextInput
            key="permitNumber"
            name="permitNumber"
            value={formik.values.permitNumber}
            type="input"
            onChange={(e) => formik.setFieldValue('permitNumber', e?.target?.value)}
            onBlur={() => formik.setFieldTouched('permitNumber', true)}
            errorMsg={
              formik?.errors['permitNumber'] && formik?.touched['permitNumber'] && formik?.errors['permitNumber']
            }
            placeholder={'e.g 10000001'}
            maxLength={8}
            className="w-100"
          />
        </Flex>

        <Button
          className="w-100"
          onClick={() => {
            // adLicenseVerificationClickEvent(user);
            formik.setFieldTouched('permitNumber', true);
            handlePermitValidation();
          }}
          loading={loading}
          type={'primary'}
          size={'large'}
        >
          {t('Continue')}
        </Button>
      </Flex>
    </Card>
  );
};
export default PermitForm;
