import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { DrawerModal } from '../common';
import SuccessModalContent from '../success-modal/successModalContent';
import { useTranslation } from 'react-i18next';
import { getBaseURL } from '../../utility/env';
import { useSelector } from 'react-redux';

const LimitNonSaudiNationalModal = forwardRef(({ clickTrigger = false, imageWidth, actionSource }, ref) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);
  const [visible, setVisible] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      open: () => setVisible(true),
      close: () => setVisible(false),
    }),
    [],
  );
  useEffect(() => {
    !clickTrigger && user?.is_nafaz_verified && setVisible(!user?.is_saudi_national);
  }, [clickTrigger, user?.is_nafaz_verified, user?.is_saudi_national]);

  const modalData = useMemo(
    () => ({
      checkout: {
        title: 'Credit Purchase not Permitted',
        description:
          'In compliance with the Real Estate Brokerage Law in Saudi Arabia, only licensed Saudi national real estate brokers are eligible to purchase packages and credits to post listings on the Bayut platform.',
        image: `${getBaseURL()}/profolio-assets/images/limit-credits.svg`,
      },
      upgrade: {
        title: 'Unable to Post Listing',
        description:
          'In compliance with the Real Estate Brokerage Law in Saudi Arabia, only Saudi nationals real estate brokers are permitted to post listings. We appreciate your understanding and cooperation.',
        image: `${getBaseURL()}/profolio-assets/images/limit-post-listing.svg`,
      },
    }),
    [],
  );
  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <DrawerModal
      type="primary"
      visible={visible}
      okButtonProps={{ type: 'primary' }}
      onCancel={handleCancel}
      footer={null}
    >
      <SuccessModalContent
        title={t(modalData[actionSource].title)}
        description={t(modalData[actionSource].description)}
        image={modalData[actionSource].image}
        imageWidth={imageWidth || 105}
        maxWidth={450}
        imageStyle={{ marginBottom: 26 }}
      />
    </DrawerModal>
  );
});

export default LimitNonSaudiNationalModal;
