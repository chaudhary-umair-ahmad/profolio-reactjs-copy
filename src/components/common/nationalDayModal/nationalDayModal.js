import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button } from '../button/button';
import { NationalDayModalContainer, ImageSection, ContentSection } from './styled';
import nationalDayImage from '../../../static/img/national-day.png';
import nationalDayMobileImage from '../../../static/img/nationa-day-mobile.png';
import { Modal } from '@/components/common';
import Icon from '../icon/icon';
import useNationalDay from '../../../hooks/useNationalDay';
import { useSelector } from 'react-redux';

const NationalDayModal = () => {
  const { t } = useTranslation();
  const { isNationalDayActive, enabled } = useNationalDay();
  const { is_package_user } = useSelector((state) => state.app.loginUser?.user || {});
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !isNationalDayActive) {
      setIsVisible(false);
      return;
    }

    const shouldShow = () => {
      // Check if modal was shown today
      const lastShown = localStorage.getItem('nationalDayModalLastShown');
      const todayDate = dayjs().format('YYYY-MM-DD');

      return lastShown !== todayDate;
    };

    if (shouldShow()) {
      setIsVisible(true);
      // Mark as shown today
      localStorage.setItem('nationalDayModalLastShown', dayjs().format('YYYY-MM-DD'));
    } else {
      setIsVisible(false);
    }
  }, [enabled, isNationalDayActive]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePostListing = () => {
    handleClose();
    navigate('/post-listing');
  };

  return (
    <>
      <Modal
        visible={isVisible && !!is_package_user}
        onCancel={handleClose}
        footer={null}
        width={isMobile ? '95%' : 800}
        centered
        closable={true}
        className="national-day-modal"
        closeIcon={<Icon icon="IoMdClose" color={'#fff'} size={20} />}
        styles={{
          body: { padding: 0 },
        }}
      >
        <NationalDayModalContainer isMobile={isMobile}>
          {isMobile ? (
            <>
              <ImageSection isMobile={true}>
                <img
                  src={nationalDayMobileImage}
                  alt={t('Saudi National Day')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </ImageSection>
              <ContentSection isMobile={true}>
                <h2>
                  {t('Free Basic Listings for Saudi National Day!')}
                </h2>

                <p>
                  {t('Celebrate Saudi National Day with Bayut!')}<br />
                  {t('Post your listings on Bayut KSA for FREE and boost your reach.')}
                </p>
                <p style={{ color: 'black', fontWeight: 600, marginBottom: 30 }}>
                  {t('Hurry! It is a limited-time offer!')}
                </p>

                <Button
                  type="primary"
                  size="large"
                  onClick={handlePostListing}
                  style={{
                    width: '100%',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {t('Post Listing')}
                </Button>
              </ContentSection>
            </>
          ) : (
            <>
              <ContentSection isMobile={false}>
                <h2>
                  {t('Free Basic Listings for Saudi National Day!')}
                </h2>

                <p>
                  {t('Celebrate Saudi National Day with Bayut!')}<br />
                  {t('Post your listings on Bayut KSA for FREE and boost your reach.')}
                </p>
                <p style={{ color: 'black', fontWeight: 600, marginBottom: 30 }}>
                  {t('Hurry! It is a limited-time offer!')}
                </p>

                <Button
                  type="primary"
                  size="large"
                  onClick={handlePostListing}
                  style={{
                    width: '40%',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {t('Post Listing')}
                </Button>
              </ContentSection>
              <ImageSection isMobile={false}>
                <img
                  src={nationalDayImage}
                  alt={t('Saudi National Day')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </ImageSection>
            </>
          )}
        </NationalDayModalContainer>
      </Modal>
    </>
  );
};

export default NationalDayModal;
