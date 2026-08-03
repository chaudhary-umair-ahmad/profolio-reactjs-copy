import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NationalDayGiftContainer, GiftIcon, FreeText } from './styled';
import useNationalDay from '../../../hooks/useNationalDay';
import NationalDayImgEn from '../../../static/img/national-day-gift-en.png'
import NationalDayImgAr from '../../../static/img/national-day-gift-ar.png'

const NationalDayGift = () => {
  const { t } = useTranslation();
  const { locale } = useSelector((state) => state?.app?.AppConfig);
  const { isNationalDayActive } = useNationalDay();
  const { isMobile } = useSelector((state) => state.app.AppConfig);

  if (!isNationalDayActive) {
    return;
  }

  return (
    <NationalDayGiftContainer isMobile={isMobile}>
      <GiftIcon
        src={locale === 'ar' ? NationalDayImgAr : NationalDayImgEn}
        alt={t('National Day Gift')}
      />

      <FreeText>{t('FREE')}</FreeText>
    </NationalDayGiftContainer>
  );
};

export default NationalDayGift;
