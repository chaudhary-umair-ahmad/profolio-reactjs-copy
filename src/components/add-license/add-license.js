import React from 'react';
import { getClassifiedBaseURL } from '../../utility/env';
import { Button, Card, EmptyState } from '../common';
import { Group } from '../common';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const AddLicenseEmptyState = () => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  return (
    <Card bodyStyle={{ padding: isMobile ? 16 : 20 }}>
      <Group template={'280px'} gap={'32px'} className="justify-content-center">
        <EmptyState
          illustration={<img src={require(`../../static/img/pages/no-data.svg`)} alt="no-data" />}
          title="No License Added"
          message={t('Add your FAL License for an easier ad posting experience and get a "Verified" badge.')}
          hideRetryButton
          className={'licenseData'}
          style={{ paddingBottom: 0 }}
        />
        <Button
          style={{ maxWidth: '235px', marginInline: 'auto' }}
          type={'primary'}
          size="large"
          href={`${getClassifiedBaseURL()}/${locale}/verification/rega/?redirectPath=${window.location.href}`}
          className="w-100"
        >
          {t('Add FAL license')}
        </Button>
      </Group>
    </Card>
  );
};
export default AddLicenseEmptyState;
