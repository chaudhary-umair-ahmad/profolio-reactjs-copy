import React, { useState } from 'react';
import { Button, Group, Modal, TextInput, Select } from '../../../components/common';
import { RadioPill } from '../../../components/common/radio-button/styled';
import CreditRequiredCard from './creditRequired';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const CreditCalculatorModal = ({ visible, setShowModal }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //const [showModal, setShowModal] = useState(true);
  const [isExpanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (inputValue.trim() === '' && !isExpanded) {
      setErrorMessage(t('Please enter a Price'));
    } else {
      setExpanded(!isExpanded);
    }
  };

  const handleChange = e => {
    setInputValue(e.target.value);
    setErrorMessage('');
  };

  const handleBlur = () => {
    if (inputValue.trim() === '') {
      setErrorMessage(t('Please enter a Price'));
    } else {
      setErrorMessage('');
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setShowModal(false);
        setExpanded(false);
        setInputValue('');
        setErrorMessage('');
      }}
      footer={null}
    >
      <Group>
        <>
          <div>
            <h2>{t('Credits Calculator')}</h2>
            <p>{t('Determine credits required to publish listings and apply products')}</p>
          </div>
          <div>
            <p>{t('Purpose')}</p>
            <div>
              <RadioPill shape="round">{t('Sale')}</RadioPill>
              <RadioPill shape="round">{t('Rent')}</RadioPill>
            </div>
          </div>
          <div>
            <p>{t('Location')}</p>
            <Select placeholder={t('Select Location')} showSearch={true} />
          </div>
          <div>
            <p>{t('Price')}</p>
            <TextInput
              type="input"
              placeholder={t('Enter Price')}
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errorMessage && (
              <Typography.Paragraph type="danger" className="mb-0 fs12">
                {errorMessage}
              </Typography.Paragraph>
            )}
          </div>
          <Button type="primary" size="large" onClick={handleExpand}>
            {t('Calculate Credits')}
          </Button>
        </>

        {isExpanded && <CreditRequiredCard />}
      </Group>
    </Modal>
  );
};

export default CreditCalculatorModal;
