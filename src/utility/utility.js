import tenantConstants from '@constants';
import tenantData from '@data';
import { t } from 'i18next';
import React from 'react';
import store from '@store';
import { getBaseURL, getClassifiedBaseURL, TENANT_KEY } from './env';
import { numberToWords } from './numberToWords';
import { convertQueryObjToString } from './urlQuery';
import { getLocaleForURL } from './language';
import Algolia from '../services/algolia';

/**
 * Return ellipsis of a given string
 * @param {string} text
 * @param {number} size
 */
const ellipsis = (text, size) => {
  return `${text.split(' ').slice(0, size).join(' ')}...`;
};

const stSlash = (path) => {
  if (path) {
    if (path.endsWith('/')) {
      return stSlash(path.slice(0, path.length - 1));
    }
    if (path.endsWith('*')) {
      return stSlash(path.slice(0, path.length - 2));
    }
    return path;
  }
  return '';
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getMaxForChart(data) {
  let max = 0;
  for (const key in data) {
    const maxValueFromArray =
      data[key].length > 0
        ? data[key].reduce((a, b) => {
            return Math.max(a, b);
          })
        : 0;
    if (maxValueFromArray > max) {
      max = maxValueFromArray;
    }
  }

  if (max >= 0 && max <= 5) {
    return !max ? 1 : max;
  }
  if (max > 5 && max <= 10) {
    return Math.ceil(max / 2) * 2;
  }
  if (max > 10 && max <= 100) {
    return Math.ceil(max / 10) * 10;
  }
  if (max > 100 && max <= 1000) {
    return Math.ceil(max / 100) * 100;
  }
  if (max > 1000 && max <= 10000) {
    return Math.ceil(max / 1000) * 1000;
  }
  return max;
}

function getStepForChart(data) {
  let max = getMaxForChart(data);
  if (max >= 0 && max <= 5) {
    return 1;
  }
  if (max > 5 && max <= 10) {
    return 2;
  }
  if (max > 10 && max <= 50) {
    return 10;
  }
  if (max > 50 && max <= 100) {
    return 20;
  }
  if (max > 100 && max <= 500) {
    return 100;
  }
  if (max > 500 && max <= 1000) {
    return 200;
  }
  if (max > 1000 && max <= 2000) {
    return 500;
  }
  if (max > 2000 && max <= 5000) {
    return 1000;
  }
  if (max > 5000 && max <= 10000) {
    return 2000;
  }
  return parseInt(max / 7) - (parseInt(max / 7) % 10);
}

const getResultGroup = (noOfDays, isLegion = false) => {
  if (isLegion) {
    if (noOfDays > 364) {
      return { result_group: 'year' };
    } else if (noOfDays > 89) {
      return { result_group: 'month' };
    } else return { result_group: 'day' };
  } else {
    if (noOfDays > 364) {
      return { result_group: 'yy' };
    } else if (noOfDays > 90) {
      return { result_group: 'mm' };
    } else if (noOfDays > 14) {
      return { result_group: 'ww' };
    } else return { result_group: 'dd' };
  }
};

const formatPrice = (value) => {
  if (value) {
    const [integerPart] = value?.toString()?.split('.');
    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return value;
};

const isNoGraph = (obj) => {
  if (Array.isArray(obj)) {
    return obj.every((value) => value === 0);
  }
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      if (!isNoGraph(obj[key])) {
        return false;
      }
    }
  }
  return true;
};
export const numberFormat = (value, format, options) => {
  return new Intl.NumberFormat(format, options).format(value);
};

export const formatCompactedNumber = (num, dashForNone, intl) => {
  if (intl) {
    const { locale } = store.getState().app.AppConfig;
    return locale == 'en' ? capitalizeFirstLetter(numberToWords(num, false, locale, true)) : null;
    // return new Intl.NumberFormat().format(num);
  }

  if (tenantConstants.NUMBER_SYSTEM == 'western') {
    switch (true) {
      case null:
      case undefined:
      case '' && dashForNone:
        return '-';
      case num >= 0 && num < 1000:
        return num.toFixed(num % 1 ? 2 : 0);
      case num >= 1000 && num < 1000000:
        return (num / 1000).toFixed((num / 1000) % 1 ? 2 : 0) + t('Thousand');
      case num >= 1000000 && num < 1000000000:
        return (num / 1000000).toFixed((num / 1000000) % 1 ? 2 : 0) + t('Million');
      case num >= 1000000000 && num < 1000000000000:
        return (num / 1000000000).toFixed((num / 1000000000) % 1 ? 2 : 0) + t('Billion');
      case num >= 1000000000000 && num < 1000000000000000:
        return (num / 1000000000000).toFixed((num / 1000000000000) % 1 ? 2 : 0) + t('Trillion');
      case num >= 1000000000000000:
        return (num / 1000000000000000).toFixed((num / 1000000000000000) % 1 ? 2 : 0) + t('Quadrillion');
      default:
        return num;
    }
  } else {
    switch (true) {
      case null:
      case undefined:
      case '' && dashForNone:
        return '-';
      case num >= 0 && num < 1000:
        return num.toFixed(num % 1 ? 2 : 0);
      case num >= 1000 && num < 100000:
        return (num / 1000).toFixed((num / 1000) % 1 ? 2 : 0) + t('Thousand');
      case num >= 100000 && num < 10000000:
        return (num / 100000).toFixed((num / 100000) % 1 ? 2 : 0) + t('Lakh');
      case num >= 10000000 && num < 1000000000:
        return (num / 10000000).toFixed((num / 10000000) % 1 ? 2 : 0) + t('Crore');
      case num >= 1000000000:
        return (num / 1000000000).toFixed((num / 1000000000) % 1 ? 2 : 0) + t('Arab');
    }
  }
};

const formatNumberString = (num, options) => {
  const { dashForNone, fractionDigits, ...rest } = options || {};
  if (!num) {
    if (dashForNone) {
      return '-';
    }
    return 0;
  }

  if (options?.notation == 'compact') return formatCompactedNumber(Number(num), dashForNone);
  const fracDigits = !!fractionDigits ? (Number(num) % 1 ? fractionDigits : 0) : Number(num) % 1 ? 2 : 0;
  return new Intl.NumberFormat('en-PK', {
    ...(fracDigits <= 2 && { minimumFractionDigits: 0 }),
    maximumFractionDigits: fracDigits,
    ...rest,
  }).format(num);
};

export const getLocalizedFieldName = (fieldName, locale = 'en') => {
  const currentLocale = locale || store?.getState()?.app?.AppConfig?.locale;
  return currentLocale === 'en' ? fieldName : `${fieldName}_l1`;
};

const LocaliseCurrencyFromPrice = (inputString) => {
  const { locale } = store.getState().app.AppConfig;
  const regex = /^-?([A-Za-z]{3})\s*([\d,]+(?:\.\d+)?)/;
  //TO DO Make single regex
  const regexwithDash = /^-([A-Za-z]{3})\s*([\d,]+)$/;
  const match = inputString.match(regex) ? inputString.match(regex) : inputString.match(regexwithDash);

  if (match) {
    const currency = match[1].toUpperCase();
    const value = match[2];
    const currencySymbol = tenantConstants.CURRENCY_SYMBOL() || currency;

    if (match[0].includes('-')) {
      return locale === 'en' ? (
        <>
          -{currencySymbol} {value}
        </>
      ) : (
        <>
          {currencySymbol} {value}-
        </>
      );
    } else {
      return (
        <>
          {currencySymbol} {value}
        </>
      );
    }
  } else {
    return inputString;
  }
};

const formatPriceValue = (
  priceValue,
  currencyOptions,
  showCurrency = true,
  fractionDigits,
  localiseCurrency = true,
) => {
  if (!isNaN(Number(priceValue))) {
    if (currencyOptions?.notation == 'compact')
      return showCurrency
        ? tenantConstants.CURRENCY_SYMBOL(
            ' ' + formatCompactedNumber(Number(priceValue), currencyOptions?.dashForNone, currencyOptions?.intl),
          )
        : formatCompactedNumber(Number(priceValue), currencyOptions?.dashForNone, currencyOptions?.intl);
    const fracDigits = !!fractionDigits
      ? Number(priceValue) % 1
        ? fractionDigits
        : 0
      : Number(priceValue) % 1
        ? 2
        : 0;
    let formattedPrice = new Intl.NumberFormat('en-PK', {
      currency: tenantConstants.CURRENCY,
      style: 'currency',
      currencyDisplay: 'symbol',
      ...(fracDigits <= 2 && { minimumFractionDigits: 0 }),
      maximumFractionDigits: fracDigits,
      ...currencyOptions,
    }).format(priceValue);

    return localiseCurrency ? LocaliseCurrencyFromPrice(formattedPrice) : formattedPrice;
  }
  return '-';
};

export const generateUUID = () => {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

// Array Objects

const assignDefaultValueToObject = (obj, value) => {
  let newObj = new Proxy(obj, { get: (target, name) => (target.hasOwnProperty(name) ? target[name] : value) });
  return newObj;
};

const getUniqueArrayByObjKey = (array, key) => {
  return [
    ...new Map(
      array.map((item) => [Array.isArray(key) ? key.map((e) => item[e]).join('-') : item[key], item]),
    ).values(),
  ];
};

const getOBJValueByKey = (object, path, defval = null) => {
  if (!path) return defval;
  if (typeof path === 'string') path = path.split('.');
  return path.reduce((xs, x) => (xs && xs[x] ? xs[x] : defval), object);
};

const getPlatformsAndProducts = (platforms) => {
  if (!platforms) return { products: { platforms: {} }, platforms: [] };
  const quotaCreditProducts = store.getState()?.app?.products?.data?.length
    ? store.getState().app?.products?.data
    : tenantData.products;
  const userProducts = {};
  const userPlatforms = [];

  tenantData.platformList.forEach(({ responseKey, key, ...rest }) => {
    const platform = platforms[responseKey];
    if (platform?.mapped) {
      userProducts[key] = quotaCreditProducts?.filter((e) => e?.platform === key);
      userPlatforms.push({ key, ...rest });
    }
  });

  return {
    products: { platforms: userProducts },
    platforms: userPlatforms,
  };
};

const getKeyValueFromObject = (obj, path, assignValue, valueExists) => {
  const a = { ...obj };
  let value = a;
  const keys = path
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.');

  keys.forEach((item, index) => {
    if (item in value) {
      if (index == keys.length - 1 && assignValue) {
        if (valueExists) {
          value[item] = { ...value[item], ...assignValue };
        } else {
          value[item] = assignValue;
        }
      } else {
        value = value[item];
      }
    } else {
      return;
    }
  });
  return assignValue ? a : value;
};

const getErrorString = (error) => {
  const errors =
    error?.response?.data?.errors || error?.response?.data?.error_description || error?.response?.data?.error;
  if (errors) {
    if (typeof errors === 'string') return errors;
    if (typeof errors === 'object')
      return Object.keys(errors)
        .map((key) => errors[key])
        .join(', ');
  }
  if (error && error.response?.data?.message) return error.response?.data?.message;
  if (error && error.message) return error.message;
  if (error && typeof error?.error === 'string') return error?.error;
  if (error && typeof error === 'string') return error;
};

// Checkout.com Flow `update_payment` is read-only and returns `{ data: { status, message } }`.
// These status buckets drive the post-payment UX (tabby/hyperpay shapes are kept for back-compat).
const CHECKOUT_FLOW_SUCCESS_STATUSES = ['Authorized', 'Captured', 'Paid', 'Pending', 'Intended', 'Unpaid'];
const CHECKOUT_FLOW_PENDING_STATUSES = ['Pending', 'Intended', 'Unpaid'];
const CHECKOUT_FLOW_ABANDONED_STATUSES = ['Expired', 'Cancelled'];

const getSurgeUpdatePaymentStatus = (mutationResult) =>
  mutationResult?.data?.data?.status || mutationResult?.data?.response?.payment?.status || null;

const isSurgeUpdatePaymentSuccessful = (mutationResult) => {
  if (!mutationResult || mutationResult.error) return false;
  const payment = mutationResult?.data?.response?.payment;
  if (payment?.approved === true) return true;
  return CHECKOUT_FLOW_SUCCESS_STATUSES.includes(getSurgeUpdatePaymentStatus(mutationResult));
};

const isSurgeUpdatePaymentPending = (mutationResult) => {
  if (!mutationResult || mutationResult.error) return false;
  return CHECKOUT_FLOW_PENDING_STATUSES.includes(getSurgeUpdatePaymentStatus(mutationResult));
};

const isSurgeUpdatePaymentAbandoned = (mutationResult) => {
  if (!mutationResult || mutationResult.error) return false;
  return CHECKOUT_FLOW_ABANDONED_STATUSES.includes(getSurgeUpdatePaymentStatus(mutationResult));
};

const getSurgeUpdatePaymentSuccessModalData = (mutationResult) => {
  const payment = mutationResult?.data?.response?.payment;
  const inner = mutationResult?.data?.data;
  if (payment?.approved === true) return payment;
  if (CHECKOUT_FLOW_SUCCESS_STATUSES.includes(payment?.status)) return { ...payment, approved: true };
  if (CHECKOUT_FLOW_SUCCESS_STATUSES.includes(inner?.status)) return { approved: true, ...inner };
  return null;
};

const getErrorAllResponse = (response) => {
  let errorArray = [];
  response.forEach((e) => e?.error && errorArray.push(e.error));
  return errorArray.join(', ');
};

const formatMobile = (data, type) => {
  const replaceNumber = (number) => {
    let mobileNumberList;
    if (TENANT_KEY === 'zameen') {
      if (number.startsWith('03')) {
        mobileNumberList = number.replace('03', '+923');
      } else if (number.startsWith('+923')) {
        mobileNumberList = number;
      } else if (number?.startsWith('042')) {
        mobileNumberList = number?.replace('042', '+9242');
      } else if (number?.startsWith('92')) {
        mobileNumberList = number?.replace('92', '+92');
      } else if (number?.startsWith('--92')) {
        mobileNumberList = number?.replace('--92', '+92');
      } else if (number?.startsWith('--03')) {
        mobileNumberList = number?.replace('--03', '+923');
      } else if (number?.startsWith('+92-')) {
        mobileNumberList = number?.replace('+92-', '+92');
      } else if (number?.startsWith('-92')) {
        mobileNumberList = number?.replace('-92', '+92');
      } else if (number?.startsWith('3')) {
        mobileNumberList = number?.replace('3', '+923');
      } else if (number?.startsWith('-3')) {
        mobileNumberList = number?.replace('-3', '+923');
      } else if (number?.startsWith('--3')) {
        mobileNumberList = number?.replace('--3', '+923');
      } else if (number?.startsWith('+92')) {
        mobileNumberList = number;
      } else if (number === '-' || number === '--') {
        mobileNumberList = '';
      } else {
        mobileNumberList = `${number}`;
      }
    } else if (TENANT_KEY === 'bayut') {
      if (number === null) {
        number = '';
      }
      if (number?.startsWith('0')) {
        number = '';
      }
      if (number?.includes('-')) {
        number = number?.replace(/-/g, '');
      }
      if (number?.startsWith('966')) {
        number = number?.replace('966', '+966');
      }
      const cleanedNumber = number.replace(/[^\d+]/g, '');
      if (tenantConstants.PHONE_REGEX.test(cleanedNumber)) {
        mobileNumberList = cleanedNumber;
      } else if (cleanedNumber === '-' || cleanedNumber === '--') {
        mobileNumberList = '';
      } else {
        mobileNumberList = `${number}`;
      }
    }

    return mobileNumberList;
  };
  try {
    if (type === 'singleNumber') {
      return replaceNumber(
        typeof data === 'string'
          ? data.replaceAll('-', '')
          : typeof data === 'object' && data[0]
            ? data[0].replaceAll('-', '')
            : '',
      );
    } else {
      if (typeof data === 'string') {
        return [replaceNumber(data.replaceAll('-', ''))];
      } else if (typeof data === 'object') {
        return data.map((item) => replaceNumber(item.replaceAll('-', '')));
      } else {
        return '';
      }
    }
  } catch (error) {
    return typeof data === 'string' ? '' : [''];
  }
};

const allowInput = (type, value, limit) => {
  if (!value) return true;
  const regex = {
    number: new RegExp('^(\\d|[1-9]\\d' + `{1,${limit ? limit : 12}})` + '(?:[.]\\d{0,2})?$'),
    text: new RegExp(`^(.|[\f\n\r\t\v]){1,${limit ? limit : 250}}$`),
  };
  return regex[type].test(value);
};

const isWebView = () => {
  const userAgent = navigator.userAgent || '';
  const isIOSWebView = /AppleWebKit/.test(userAgent) && !/Safari/.test(userAgent);
  const isAndroidWebView = /com\.bayut\.bayutsaapp/.test(userAgent);
  return isIOSWebView || isAndroidWebView;
};

export const openExternalUrl = (url) => {
  try {
    const { protocol } = new URL(url, window.location.origin);
    if (protocol === 'http:' || protocol === 'https:') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch {
    /* invalid or empty url → no-op */
  }
};

/**
 * True only if `url` is an absolute http(s) URL. Use to gate a backend-provided
 * URL before putting it in an href or navigating to it, so a javascript:/data:
 * value can't execute. These display URLs are always absolute, so relative paths
 * are not expected (and return false).
 */
export const isHttpUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const openExternal = (value, type = 'phone') => {
  switch (type) {
    case 'email':
      window.open(`mailto:${value}`, '_blank');
      break;
    case 'whatsapp':
      window.open(`https://wa.me/${value}`, '_blank');
      break;
    default:
      window.open(`tel:${value}`, '_blank');
  }
};
const joinBytItems = (array, separator) => {
  const filtered = array.filter((e) => !!e);
  return filtered.map((e, i) => {
    if (typeof separator === 'string') {
      return i + 1 < filtered.length ? e + separator : e;
    } else {
      return i + 1 < filtered.length ? (
        <React.Fragment key={i}>
          {e}
          {separator}
        </React.Fragment>
      ) : (
        e
      );
    }
  });
};

const mapQueryParams = (params, filtersList) => {
  if (!params) return '';
  if (params && !filtersList?.length) return convertQueryObjToString(params);
  const decodedParams = Object.entries(params).reduce((acc, [key, value]) => {
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});

  let queryParams = [];
  let listItems = [];
  const processedKeys = [];
  let unitKey = null;

  filtersList.forEach((item) => {
    if (item?.subList?.length) {
      item.subList.forEach((subListItem) => {
        const paramValue = decodedParams[subListItem.key];
        if (paramValue) {
          listItems.push(subListItem);
          processedKeys.push(subListItem.key);
        }
      });
    } else {
      const paramValue = decodedParams[item.key];
      if (paramValue) {
        listItems.push(item);
        processedKeys.push(item.key);
      }
    }
  });

  listItems.forEach((item) => {
    if (item?.queryParamKey) {
      const paramValue = decodedParams[item?.key];
      const values = paramValue.split(',');
      if (typeof item.queryParamKey === 'string') {
        values.forEach((value) => {
          queryParams.push(`${item.queryParamKey}=${value}`);
        });
      } else if (Array.isArray(item.queryParamKey)) {
        item.queryParamKey.forEach((key, index) => {
          queryParams.push(`${key}=${values[index] || ''}`);
          if (item.queryParamKey?.[2]) unitKey = item.queryParamKey?.[2];
        });
      } else if (typeof item.queryParamKey === 'function') {
        values.forEach((value) => {
          queryParams.push(item.queryParamKey(value));
        });
      }
    }
  });

  Object.keys(decodedParams).forEach((paramKey) => {
    if (!processedKeys.includes(paramKey)) {
      // O(n) lookup
      const paramValue = decodedParams[paramKey];
      queryParams.push(`${paramKey}=${paramValue}`);
    }
  });
  if (unitKey) queryParams = queryParams.filter((param) => !param.startsWith(unitKey));

  return queryParams.join('&');
};

function convertArrayToQueryString(arr, paramName) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return '';
  }

  const queryString = arr.map((item) => `${paramName}[]=${item}`).join('&');
  return queryString;
}

const getCurrentLocationPath = (currentPath) => {
  return currentPath?.pathname?.split('/').pop();
};

const getLoginPath = () => {
  const redirectedUrl = window.location.href;
  const localePath = getLocaleForURL();

  const path = tenantConstants.HAVE_LOGIN_SCREEN
    ? `${window.location.origin}${localePath}/signin`
    : `${getClassifiedBaseURL()}${localePath}/${TENANT_KEY === 'zameen' ? 'login.html?r=' : 'account?externalRedirectPath='}${
        redirectedUrl ? redirectedUrl : `${getBaseURL()}/${localePath}`
      }`;
  return path;
};
const getPositionSuffix = (number) => {
  const suffixArray = ['th', 'st', 'nd', 'rd'];
  if (number == 1 || number == 2 || number == 3) {
    return suffixArray[number];
  }
  return suffixArray[0];
};

const getMissingOptions = async (selectedValues, initialOptions) => {
  if (!selectedValues?.length || !initialOptions?.length) return [];

  const initialOptionIds = new Set(initialOptions.map((opt) => opt.id));
  const missingIds = selectedValues.filter((id) => !initialOptionIds.has(id));

  if (!missingIds.length) return [];

  try {
    const queryObject = Algolia.getMultipleCitiesByID(missingIds);
    const response = await Algolia.getLocationsIndex().search('', queryObject);

    return response?.hits
      ? response.hits.map((op) => ({
          ...op,
          id: op.location_id,
          title: op?.title || '',
        }))
      : [];
  } catch (error) {
    console.error('Error fetching options from Algolia:', error);
    return [];
  }
};

const getRangeArray = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

/** True when API returned a non-empty REGA payload (hides UI for `{}`, null, etc.). */
export const hasRegaDetailsContent = (regaDetails) =>
  regaDetails != null &&
  typeof regaDetails === 'object' &&
  !Array.isArray(regaDetails) &&
  Object.keys(regaDetails).length > 0;

export const normalizeSurgeListingsResponse = (data) => {
  if (!data?.listings || !Array.isArray(data.listings)) {
    return data;
  }
  const listings = data.listings.map((listing) => {
    const normalized = { ...listing };

    // user: from posted_by; external_id from posted_by.platform_mapping.<slug>.external_id (e.g. bayut)
    if (listing?.posted_by && !listing.user) {
      const pb = listing.posted_by;
      const platformMapping = pb.platform_mapping;
      const externalId =
        platformMapping?.bayut?.external_id ??
        platformMapping?.dubizzle?.external_id ??
        null;
      const platform =
        platformMapping &&
        Object.fromEntries(
          Object.entries(platformMapping).filter(([, v]) => v && typeof v === 'object').map(([k, v]) => [
            k,
            { id: v.platform_id, external_id: v.external_id ?? null },
          ]),
        );
      normalized.user = {
        id: pb.id,
        external_id: externalId,
        ...pb,
        ...(Object.keys(platform || {}).length > 0 && { platform }),
      };
    }

    // location.breadcrumb: new API has breadcrumbs
    if (listing?.location && listing.location.breadcrumbs && !listing.location.breadcrumb) {
      normalized.location = { ...listing.location, breadcrumb: listing.location.breadcrumbs };
    }

    // image: new API has images[] with sizes; old expects single image with full, large, medium, thumbnail, small (+ optional listing_id, filename, is_main_image, image_type)
    if (!listing.image) {
      if (listing?.images?.length) {
        const mainImg = listing.images.find((i) => i?.main === 1) || listing.images[0];
        if (mainImg?.sizes) {
          normalized.image = {
            id: mainImg.id,
            full: mainImg.sizes.full,
            large: mainImg.sizes.large,
            medium: mainImg.sizes.medium,
            thumbnail: mainImg.sizes.thumbnail,
            small: mainImg.sizes.small,
            default: mainImg.main ? 1 : 0,
            order: mainImg.order,
            status: mainImg.status,
            is_unique: mainImg.is_unique,
            uuid: mainImg.uuid,
            listing_id: listing.id,
            filename: mainImg.uuid,
            rejection_reason: mainImg.rejection_reason ?? null,
            is_rega_image: mainImg.is_rega_image ?? false,
            is_main_image: mainImg.main ? 1 : 0,
            image_type: mainImg.image_type ?? 'listing_image',
          };
        }
      } else {
        normalized.image = null;
      }
    }
    // images_count: old API had at root; new has only images.length
    if (listing.images_count == null) {
      normalized.images_count = listing?.images?.length ?? 0;
    }

    // platforms: new API has platform_listings[]; old expects platforms.bayut, platforms.dubizzle
    if (listing?.platform_listings?.length && !listing.platforms) {
      const platformsObj = {};
      listing.platform_listings.forEach((pl) => {
        const slug = pl?.platform?.slug;
        if (!slug) return;
        const productsArray = pl?.products_information || [];
        const productsInfo = productsArray.reduce((acc, p) => {
          if (p?.slug) acc[p.slug] = { ...p, platform_id: p.platform_id };
          return acc;
        }, {});
        const contact = pl?.contact_details || listing?.posted_by;
        platformsObj[slug] = {
          id: pl.id,
          user_id: contact?.id,
          platform_id: pl?.platform?.id,
          listing_id: pl?.listing_id,
          platform_listing_id: pl?.platform_listing_id,
          products_information: productsInfo,
          status: pl?.status,
          disposition: pl?.disposition,
          created_at: pl?.created_at,
          updated_at: pl?.updated_at,
          expires_at: pl?.expiry_date,
          expiry_date: pl?.expiry_date,
          posted_at: pl?.posted_at,
          url: pl?.url,
          url_l1: pl?.url_l1,
          show_on_web: pl?.show_on_web,
          rega_expiry_date: pl?.rega_info?.rega_details?.license_info?.end_date ?? null,
          ...(pl?.rega_info?.rega_details && Object.keys(pl.rega_info.rega_details).length > 0 && { rega_details: pl.rega_info.rega_details }),
          ...(contact && {
            user: {
              id: contact.id,
              external_id:
                contact.external_id ||
                listing?.posted_by?.platform_mapping?.[slug]?.external_id,
            },
          }),
        };
      });
      normalized.platforms = platformsObj;
    }

    // listing_type: new API has listing_category (name, slug, name_l1); old expects { id, title, title_l1, slug }
    if (listing?.listing_category && !listing.listing_type) {
      const cat = listing.listing_category;
      normalized.listing_type = {
        id: cat.id,
        title: cat.name,
        title_l1: cat.name_l1,
        slug: cat.slug,
      };
    }

    // listing_purpose: new API has listing_category.purpose / purpose_l1; old expects { id, title, title_l1, slug }
    if (listing?.listing_category && !listing.listing_purpose) {
      const cat = listing.listing_category;
      const purposeSlug = cat.purpose ? cat.purpose.toLowerCase().replace(/\s+/g, '-') : null;
      normalized.listing_purpose = purposeSlug
        ? { id: cat.parent_id || cat.id, title: cat.purpose, title_l1: cat.purpose_l1, slug: purposeSlug }
        : null;
    }

    // area_unit: area_unit_value (size) + area_unit.name (metric; fallback value).
    if (!listing.area_unit && listing?.dynamic_data?.dynamic_fields) {
      const fields = listing.dynamic_data.dynamic_fields;
      const au = fields.area_unit;
      if (au != null || fields.area_unit_value != null) {
        normalized.area_unit = {
          id: au?.id,
          value: fields.area_unit_value,
          name: au?.label ?? au?.value,
          name_l1: au?.label_l1 ?? au?.value_l1,
        };
      }
    }

    // beds (root): new API has dynamic_data.dynamic_fields.beds (object with value/label)
    if (listing?.beds == null && listing?.dynamic_data?.dynamic_fields?.beds != null) {
      const beds = listing.dynamic_data.dynamic_fields.beds;
      normalized.beds = typeof beds === 'object' && beds.value != null ? beds.value : beds;
    }

    // baths (root): new API has dynamic_data.dynamic_fields.baths (object with value/label)
    if (listing?.baths == null && listing?.dynamic_data?.dynamic_fields?.baths != null) {
      const baths = listing.dynamic_data.dynamic_fields.baths;
      normalized.baths = typeof baths === 'object' && baths.value != null ? baths.value : baths;
    }

    // area (root): new API has dynamic_data.dynamic_fields.area or area_unit_value; some consumers expect listing.area
    if (listing?.area == null && listing?.dynamic_data?.dynamic_fields) {
      const fields = listing.dynamic_data.dynamic_fields;
      const areaValue = fields?.area ?? fields?.area_unit_value;
      if (areaValue != null) normalized.area = areaValue;
    }

    // created_at, expiry_date, expiry_days at root: new API has these inside platform_listings[]
    if (!listing.created_at && listing?.platform_listings?.length) {
      normalized.created_at = listing.platform_listings[0].created_at;
    }
    if (!listing.expiry_date && listing?.platform_listings?.length) {
      const first = listing.platform_listings[0];
      normalized.expiry_date = first.expiry_date;
      if (first.expiry_date && !listing.expiry_days) {
        const expiryDate = new Date(first.expiry_date);
        const now = new Date();
        normalized.expiry_days = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      }
    }
    if (listing.expiry_days != null) normalized.expiry_days = listing.expiry_days;

    // rega_details at root: new API has platform_listings[].rega_info.rega_details
    if (!listing.rega_details && listing?.platform_listings?.length) {
      const withRega = listing.platform_listings.find((pl) => pl?.rega_info?.rega_details && Object.keys(pl.rega_info.rega_details).length > 0);
      if (withRega?.rega_info?.rega_details) {
        normalized.rega_details = withRega.rega_info.rega_details;
      } else {
        normalized.rega_details = {};
      }
    }

    // status and disposition at root: old API had these; new has only per platform_listing – take from first platform
    if (!listing.status && listing?.platform_listings?.length) {
      normalized.status = listing.platform_listings[0].status;
    }
    if (!listing.disposition && listing?.platform_listings?.length) {
      normalized.disposition = listing.platform_listings[0].disposition;
    }

    // date: old had "date"; use posted_at or created_at
    if (!listing.date && (listing.posted_at || normalized.created_at)) {
      normalized.date = listing.posted_at || normalized.created_at;
    }

    // edited_at: old had at root; new has updated_at per platform_listing
    if (!listing.edited_at && listing?.platform_listings?.length) {
      const updated = listing.platform_listings.map((pl) => pl.updated_at).filter(Boolean).sort().pop();
      if (updated) normalized.edited_at = updated;
    }

    return normalized;
  });
  return { ...data, listings };
};

const allocateCartLineQuantities = (weights, total) => {
  const n = weights.length;
  const T = Math.max(0, Math.round(Number(total) || 0));
  if (n === 0) return [];
  if (T === 0) return Array(n).fill(0);
  const w = weights.map((x) => Math.max(0, Number(x) || 0));
  const W = w.reduce((s, x) => s + x, 0);
  if (W <= 0) {
    const q = Array(n).fill(0);
    q[0] = T;
    return q;
  }
  const exact = w.map((wi) => (T * wi) / W);
  const floors = exact.map((x) => Math.floor(x));
  let rem = T - floors.reduce((s, f) => s + f, 0);
  const order = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac);
  const qty = [...floors];
  for (let k = 0; k < rem; k++) {
    qty[order[k].i]++;
  }
  return qty;
};

/**
 * Surge: credits may be a number or a duration map ({ "30": 40, "2": 5 }).
 * For maps, tries key (e.g. listing expiry days), then defaultExpiryDays (product default_expiry_days), then "30".
 */
const resolveCreditsRequired = (creditsRequired, key, defaultExpiryDays) => {
  if (creditsRequired == null) return undefined;
  if (typeof creditsRequired === 'object' && !Array.isArray(creditsRequired)) {
    for (const k of [key, defaultExpiryDays, '30']) {
      if (k === undefined || k === null || k === '') continue;
      const raw = creditsRequired[String(k)];
      if (raw != null && raw !== '') {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
      }
    }
    return undefined;
  }
  const n = Number(creditsRequired);
  return Number.isNaN(n) ? undefined : n;
};

export {
  allowInput,
  assignDefaultValueToObject,
  capitalizeFirstLetter,
  ellipsis,
  formatMobile,
  formatNumberString,
  formatPrice,
  formatPriceValue,
  getErrorAllResponse,
  getErrorString,
  getSurgeUpdatePaymentSuccessModalData,
  isSurgeUpdatePaymentSuccessful,
  isSurgeUpdatePaymentPending,
  isSurgeUpdatePaymentAbandoned,
  getMaxForChart,
  getOBJValueByKey,
  getResultGroup,
  getStepForChart,
  getPlatformsAndProducts,
  getUniqueArrayByObjKey,
  stSlash,
  isWebView,
  openExternal,
  joinBytItems,
  mapQueryParams,
  convertArrayToQueryString,
  isNoGraph,
  getCurrentLocationPath,
  getLoginPath,
  getPositionSuffix,
  getMissingOptions,
  getRangeArray,
  resolveCreditsRequired,
  allocateCartLineQuantities,
};
