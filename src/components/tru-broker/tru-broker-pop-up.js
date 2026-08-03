import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { TruBrokerModal } from './styled';
import TruBrokerCriteriaList from './tru-broker-criteria-list';

const TruBrokerJourneyModal = forwardRef((props, ref) => {
  const { user } = props;
  const [showTruBrokerModal, setShowTruBrokerModal] = useState(false);
  const { t } = useTranslation();

  const showTruBrokerPopUp = () => {
    setShowTruBrokerModal(true);
  };

  useImperativeHandle(ref, () => ({
    showTruBrokerPopUp,
  }));

  return (
    <TruBrokerModal
      visible={showTruBrokerModal}
      title={
        <>
          <div className="fz-16 fw-600">
            {t('Become a TruBroker')}
            <sup>{t('TM')}</sup>
          </div>
          <span className="fz-12 fw-500">
            <Trans i18nKey={'truBrokerBadge'} components={{ sup: <sup />, span: <span /> }} />
          </span>
        </>
      }
      onCancel={() => setShowTruBrokerModal(false)}
      footer={null}
    >
      <TruBrokerCriteriaList user={user} />
    </TruBrokerModal>
  );
});
export default TruBrokerJourneyModal;
