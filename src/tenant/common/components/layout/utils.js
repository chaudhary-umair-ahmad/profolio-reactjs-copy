import tenantTheme from '@theme';
import tenantConstants from '@constants';
import Cookies from 'js-cookie';
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../../components/common';
import { getClassifiedBaseURL } from '../../../../utility/env';
import { t } from 'i18next';

export const currencyArabicConversionUnitList = [
  { slug: 'AED', label: 'AED', alt_label: t('United Arab Emirates (AED)') },
  { slug: 'EUR', label: 'EUR', alt_label: t('European Union (EUR)') },
  { slug: 'GBP', label: 'GBP', alt_label: t('United Kingdom (GBP)') },
  { slug: 'INR', label: 'INR', alt_label: t('India (INR)') },
  { slug: 'PKR', label: 'PKR', alt_label: t('Pakistan (PKR)') },
  { slug: 'RUB', label: 'RUB', alt_label: t('Russian Federation (RUB)') },
  {
    slug: 'SAR',
    label: 'SAR',
    alt_label: (
      <span>
        {t('Saudi Arabia ')}
        {'('}
        <span className="currency-Saudi_Riyal_Symbol"></span>
        {')'}
      </span>
    ),
  },
  { slug: 'USD', label: 'USD', alt_label: t('United States of America (USD)') },
  { slug: 'OMR', label: 'OMR', alt_label: t('Oman (OMR)') },
  { slug: 'QAR', label: 'QAR', alt_label: t('Qatar (QAR)') },
  { slug: 'JOD', label: 'JOD', alt_label: t('Jordan (JOD)') },
  { slug: 'CNY', label: 'CNY', alt_label: t('Chinese Yuan (CNY)') },
  { slug: 'BHD', label: 'BHD', alt_label: t('Bahrain (BHD)') },
];
export const areaRangeUnitList = [
  { slug: 'SQFT', alt_label: 'Square Feet', label: 'Sq. ft.' },
  { slug: 'SQYD', alt_label: 'Square Yards', label: 'Sq. yd.' },
  { slug: 'SQM', alt_label: 'Square Meters', label: 'Sq. m.' },
];

const getParsedCookie = (cookieName) => {
  const fetchCookie = Cookies.get(cookieName);
  if (!fetchCookie) return null;
  try {
    return JSON.parse(fetchCookie);
  } catch {
    return null;
  }
};

export const getCookieUnits = (t) => {
  const settings = getParsedCookie('settings');
  return { currency: settings?.currency || tenantConstants.CURRENCY, area: settings?.area || 'SQM' };
};

export const setCookieUnits = (obj) => {
  const settingsCookie = Cookies.get('settings');
  const settingsObj = settingsCookie ? (() => {
    try {
      return JSON.parse(decodeURIComponent(settingsCookie));
    } catch {
      return {};
    }
  })() : {};
  const newCookie = JSON.stringify({ ...settingsObj, ...obj });
  Cookies.set('settings', newCookie);
};

export const getLink = (title, path, external, icon, locale, isNotClassified) => {
  const pathLocale = locale ? (locale == 'ar' ? '' : `/${locale}`) : '';
  const p = external ? `${!isNotClassified ? getClassifiedBaseURL() : ''}${pathLocale}${path}` : path;
  return external ? (
    <a style={{ color: tenantTheme['dark-color'] }} href={p}>
      {title}
    </a>
  ) : (
    <Link style={{ color: tenantTheme['dark-color'] }} to={p}>
      {title} {icon && <Icon icon={icon} />}
    </Link>
  );
};
