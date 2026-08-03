import tenantTheme from '@theme';
import constants from './constants';
import { Icon } from '../../../components/common';
import { getBaseURL, getClassifiedBaseURL } from '../../../utility/env';
import amenities from './amenities.json';
import { getLocaleForURL } from '../../../utility/language';
import React from 'react';
import { IconRent } from '@/components/svg';

const platformList = [
  {
    id: 1,
    key: 'ksa',
    icon: '',
    label: 'KSA',
    name: 'KSA',
    title: 'KSA',
    slug: 'ksa',
    platform_slug: 'bayut',
    value: 'ksa',
    brandColor: tenantTheme['primary-color'],
    logo: '',
    responseKey: 'bayut',
    getLogo: ({ locale, ...rest }) => {
      return (
        <Icon
          icon={locale === 'ar' ? 'BayutLogoAr' : 'BayutLogoEn'}
          size="60px"
          style={{ height: '15px', marginTop: '12px' }}
          {...rest}
        />
      );
    },
  },
];

const helpAndSupportUrls = {
  aboutProfolio: {
    en: 'https://help.bayut.sa/hc/en-us/categories/16333193987090-Property-and-Profolio-Management',
    ar: 'https://help.bayut.sa/hc/ar/categories/16563831651474',
  },
  aboutRega: {
    en: 'https://help.bayut.sa/hc/en-us/categories/18347574773906-REGA-Compliances',
    ar: 'https://help.bayut.sa/hc/ar/categories/16563915089426',
  },
  faqs: {
    en: `https://help.bayut.sa/hc/en-us/categories/16333324007186-Client-Engagement-and-Support`,
    ar: 'https://help.bayut.sa/hc/ar/categories/16563960315794',
  },
};

const categoryProductsMapping = {
  shot_listing: {
    value: 'A',
  },
  hot_listing: {
    value: 'B',
  },
  premium_listing: {
    value: 'C',
  },
  refresh_listing: {
    value: 'D',
  },
  olx_feature: {
    value: 'A',
  },
  olx_refresh_listing: {
    value: 'B',
  },
};
export const purposeList = [
  {
    id: 1,
    key: 'sell',
    icon: 'IconPropertyBuy',
    label: 'Sell',
    name: 'Sell',
    title: 'Sell',
    slug: 'sell',
    value: 'sell',
  },
  {
    id: 2,
    key: 'rent',
    icon: 'IconPropertyRent',
    label: 'Rent',
    name: 'Rent',
    title: 'Rent',
    slug: 'rent',
    value: 'rent',
  },
  {
    id: 4,
    key: 'dailyrental',
    icon: 'IconRental',
    label: 'Daily Rentals',
    name: 'Daily Rental',
    title: 'Daily Rentals',
    slug: 'daily-rental',
    value: 'dailyrental',
  },
];
export const areaMapings = {
  square_meters: {
    square_feet: 10.7639,
    square_yards: 1.19599,
    square_meters: 1,
    marla: 0.048,
    kanal: 0.002,
  },
  square_yards: {
    square_feet: 9,
    square_meters: 0.836127,
    square_yards: 1,
    marla: 0.04,
    kanal: 0.002,
  },
  square_feet: {
    square_yards: 0.111111,
    square_meters: 0.092903,
    square_feet: 1,
    marla: 0.004444444,
    kanal: 0.0002222222,
  },
  marla: {
    square_yards: 25,
    square_meters: 21,
    square_feet: 225,
    marla: 1,
    kanal: 0.0500001,
  },
  kanal: {
    square_yards: 500,
    square_meters: 418.06368,
    square_feet: 4500,
    marla: 20,
    kanal: 1,
  },
};

const rentalFrequencyList = [
  {
    key: 3,
    label: 'Monthly',
    slug: 'monthly',
  },
  {
    key: 4,
    label: 'Yearly',
    slug: 'yearly',
  },
];

const AD_LICENSE_PURPOSE_LIST = [
  {
    key: 1,
    label: 'Sell',
    slug: 'sell',
    price: 600,
    icon: 'IconHome',
  },
  {
    key: 2,
    label: 'Rent',
    slug: 'rent',
    price: 250,
    icon: 'IconRent',
  },
];

const AD_LICENSE_PROPERTY_TYPE_LIST = [
  {
    key: 1,
    label: 'Residential',
    slug: 'residential',
    icon: 'IconResidential',
  },
  {
    key: 2,
    label: 'Commercial',
    slug: 'commercial',
    icon: 'IconCommercial',
  },
];

const areaUnitList = [
  // {
  //   id: 5,
  //   title: 'Marla',
  //   title_short: 'Marla',
  //   slug: constants.AREA_UNIT.MARLA,
  //   conversion_rate_sqft: 0.004444444,
  // },
  // {
  //   id: 1,
  //   title: 'Square Feet',
  //   title_short: 'Sq. Ft.',
  //   slug: constants.AREA_UNIT.SQUARE_FEET,
  //   conversion_rate_sqft: 1,
  // },
  {
    id: 2,
    title: 'Square Meters',
    title_short: 'Sq. M.',
    slug: constants.AREA_UNIT.SQUARE_METER,
    conversion_rate_sqft: 0.09290304,
  },

  // {
  //   id: 3,
  //   title: 'Square Yards',
  //   title_short: 'Sq. Yd.',
  //   slug: constants.AREA_UNIT.SQUARE_YARD,
  //   conversion_rate_sqft: 0.111111111,
  // },
  // {
  //   id: 6,
  //   title: 'Kanal',
  //   title_short: 'Kanal',
  //   slug: constants.AREA_UNIT.KANAL,
  //   conversion_rate_sqft: 0.0002222222,
  // },
];

const propertyPriceList = [
  { id: 0, key: 'least_expensive', label: 'Least Expensive', name: 'Least Expensive' },
  { id: 1, key: 'most_expensive', label: 'Most Expensive', name: 'Most Expensive' },
];

const orderOfApplicationOfCreditsList = [
  { id: 0, key: 'highest_to_lowest', label: 'Highest to Lowest', name: 'Highest to Lowest' },
  { id: 1, key: 'lowest_to_highest', label: 'Lowest to Highest', name: 'Lowest to Highest' },
];

const bedroomsList = [
  { key: '-1', label: 'Studio' },
  { key: '1', label: '1' },
  { key: '2', label: '2' },
  { key: '3', label: '3' },
  { key: '4', label: '4' },
  { key: '5', label: '5' },
  { key: '6', label: '6' },
  { key: '7', label: '7' },
  { key: '8', label: '8' },
  { key: '9', label: '9' },
  { key: '10', label: '10' },
  { key: '11', label: '10+' },
];

const bathroomsList = [
  { key: '1', label: '1' },
  { key: '2', label: '2' },
  { key: '3', label: '3' },
  { key: '4', label: '4' },
  { key: '5', label: '5' },
  { key: '6', label: '6' },
  { key: '7', label: '7' },
  { key: '8', label: '8' },
  { key: '9', label: '9' },
  { key: '10', label: '10' },
  { key: '11', label: '10+' },
];

const videoHostsList = [
  { value: 'youtube', label: 'Youtube', icon: 'AiFillYoutube', color: '#FF0000' },
  // { value: 'dailymotion', label: 'Dailymotion', icon: 'FaDailymotion', color: '#00aaff' },
  // { value: 'vimeo', label: 'Vimeo', icon: 'FaVimeoSquare', color: '#86c9ef' },
];

const phoneCodeList = [{ id: 1, title: '+92' }];

const currencyList = [{ id: 1, title: 'PKR', slug: 'pkr' }];

const products_Mapping = {
  shot_listing: {
    mark: 'A',
  },
  hot_listing: {
    mark: 'B',
  },
  refresh_listing: {
    mark: 'C',
  },
  story_ad: {
    mark: 'D',
  },
};

const getNavbarLinks = (locale) => {
  const pathLocale = getLocaleForURL();
  return [
    {
      href: `${getClassifiedBaseURL()}/blog${pathLocale}`,
      imgSrc:
        locale === 'en'
          ? `${getBaseURL()}/profolio-assets/images/bayut-blog-en-logo.png`
          : `${getBaseURL()}/profolio-assets/images/bayut-blog-ar-logo.png`,
      imgProps: { width: '70px', paddingBlockStart: '6px', marginInlineEnd: locale == 'ar' ? '-0.5px' : '0' },
    },
    {
      href: `${getClassifiedBaseURL()}${pathLocale}/brokers/`,
      title: 'Find my Agent',
    },
    {
      href: `${getClassifiedBaseURL()}${pathLocale}/invest-in-saudi/`,
      title: 'Invest In Saudi',
      showNewTag: true,
    },
    {
      href: `${getClassifiedBaseURL()}${pathLocale}/bayut-academy/`,
      title: 'Bayut Academy',
    },
    {
      href: `${getClassifiedBaseURL()}${pathLocale}/stays/become-host`,
      title: 'Become a Host',
    },
    {
      title: 'More',
      dropdown: [
        // {
        //   href: `${getClassifiedBaseURL()}${pathLocale}/bayut-expos/`,
        //   title: 'Bayut Expos',
        // },
        {
          href: `${getClassifiedBaseURL()}${pathLocale}/home-loan-finder/`,
          title: 'Home Loan Finder',
        },
        // {
        //   href: `${getClassifiedBaseURL()}${pathLocale}/new-projects/`,
        //   title: 'New Projects',
        // },
      ],
    },
  ];
};

export default {
  platformList,
  categoryProductsMapping,
  purposeList,
  areaMapings,
  rentalFrequencyList,
  areaUnitList,
  propertyPriceList,
  orderOfApplicationOfCreditsList,
  bedroomsList,
  bathroomsList,
  videoHostsList,
  phoneCodeList,
  currencyList,
  products_Mapping,
  helpAndSupportUrls,
  getNavbarLinks,
  amenities,
  AD_LICENSE_PURPOSE_LIST,
  AD_LICENSE_PROPERTY_TYPE_LIST,
};
