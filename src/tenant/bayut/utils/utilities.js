import tenantConstants from '@constants';
import tenantData from '@data';
import { t } from 'i18next';
import notification from '../../../components/common/notification/notifications';
import { getAPIBaseURL } from '../../../utility/env';
import { products } from '../data/products';
import { areaMapings } from '../data/staticLists';
import { getAppLanguage } from '../../../utility/language';

const apiEndpoint = () => `${getAPIBaseURL()}/api`;

const getPaginationObject = (obj) => {
  return {
    current: obj?.current_page,
    from: obj?.from,
    to: obj?.to,
    nextPage: obj?.next_page ? obj?.next_page : obj?.current_page === obj?.total_pages ? null : obj?.current_page + 1,
    prevPage: obj?.prev_page ? obj?.prev_page : obj?.current_page === 1 ? null : obj?.current_page - 1,
    totalCount: obj?.total_count ? obj?.total_count : obj?.total_records,
    totalPages: obj?.total_pages ? obj?.total_pages : obj?.total_pages,
    pageCount: obj?.per_page || 10,
  };
};

export const makePriceForPackage = (platform, product) => {
  const dependents = tenantData.productDependents?.[platform]?.[product?.key]?.split(',');
  let dependentsTotalPrice = 0;
  dependents?.forEach((dep) => {
    dependentsTotalPrice =
      parseInt(tenantData.quotaCreditProducts?.find((e) => e?.slug == dep)?.price) + dependentsTotalPrice;
  });
  const totalPackagePrice = dependentsTotalPrice
    ? dependentsTotalPrice + parseInt(product?.product_price)
    : parseInt(product?.product_price);
  return totalPackagePrice;
};

export const getQueryParams = (filterObj) => {
  const filters = !!Object.keys(filterObj) && Object.keys(filterObj)?.length > 0 ? Object.keys(filterObj) : [];
  let check = [];
  filters.forEach((key) => {
    if (key === tenantConstants.VALUE_EQUALS_KEY('id')) {
      check.push(`q[listing_id_eq]=${filterObj[key]}`);
    } else if (key === tenantConstants.VALUE_EQUALS_KEY('ad_license')) {
      check.push(`q[ad_license_eq]=${filterObj[key]}`);
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('location')) {
      const values = filterObj[key].split(',');
      values.forEach((e) => {
        check.push(`q[location_id_in][]=${e}`);
      });
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('type')) {
      const values = filterObj[key].split(',');
      values.forEach((e) => {
        check.push(`q[type_id_in][]=${e}`);
      });
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('purpose')) {
      const values = filterObj[key].split(',');
      values.forEach((e) => {
        check.push(`q[purpose_id_in][]=${e}`);
      });
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('platform')) {
      check.push(`q[posted_on_${filterObj[key]}_true]=true`);
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('mark')) {
      const values = filterObj[key].split(',');
      values.forEach((e) => {
        check.push(`q[flag_eq]=${e}`);
      });
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('date_between')) {
      const values = filterObj[key].split(',');
      check.push(`q[created_at_gteq]=${values[0]}&q[created_at_lteq]=${values[1]}`);
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('price_between')) {
      const values = filterObj[key].split(',');
      check.push(`q[price_gteq]=${values[0]}&q[price_lteq]=${values[1]}`);
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('area_between')) {
      const values = filterObj[key].split(',');
      check.push(`q[area_unit_value_gteq]=${values[0]}&q[area_unit_value_lteq]=${values[1]}`);
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('user_id')) {
      check.push(`q[user_id_eq]=${filterObj[key]}`);
    } else if (key.includes('mapping')) {
      check.push(`q[status_id_eq]=${filterObj[key]}`);
    } else if (key === tenantConstants.VALUE_EQUALS_KEY('consumed_on_id')) {
      check.push(`q[consumed_on_id_eq]=${filterObj[key]}`);
    } else if (key === tenantConstants.VALUE_IN_ARRAY_KEY('product_id_in')) {
      check.push(`q[product_id_in][]=${filterObj[key]}`);
    }
  });
  return check.join('&');
};

const getMultipleValues = (filterObj, key) => {
  const arr = Object.keys(filterObj)?.length > 0 ? Object.keys(filterObj)?.filter((e) => e.includes(key)) : [];
  return arr.map((e) => filterObj[e]).join(',');
};

const getParams = (filterObj) => {
  const obj = {};
  const filterArray = Object.keys(filterObj)?.length > 0 ? Object.keys(filterObj) : [];

  filterArray &&
    filterArray?.forEach((item) => {
      if (item.includes('listing_id')) {
        obj[`filter[id]`] = filterObj[item];
      } else if (item.includes('ad_license')) {
        obj[`filter[ad_license]`] = filterObj[item];
      } else if (item.includes('location_id')) {
        obj['filter[location]'] = getMultipleValues(filterObj, 'location_id');
      } else if (item.includes('type_id')) {
        obj['filter[type]'] = getMultipleValues(filterObj, 'type_id');
      } else if (item.includes('purpose_id')) {
        obj['filter[purpose]'] = getMultipleValues(filterObj, 'purpose_id');
      } else if (item.includes('posted_on')) {
        obj['filter[platform]'] = item?.includes('zameen') ? 'zameen' : 'olx';
      } else if (item.includes('flag')) {
        obj['filter[mark]'] = getMultipleValues(filterObj, 'flag');
      } else if (item.includes('created_at')) {
        obj['filter[date_between]'] = getMultipleValues(filterObj, 'created_at');
      } else if (item.includes('price')) {
        obj['filter[price_between]'] = getMultipleValues(filterObj, 'price');
      } else if (item.includes('area')) {
        obj['filter[area_between]'] = getMultipleValues(filterObj, 'area');
      } else if (item.includes('user_id')) {
        obj['filter[user_id]'] = getMultipleValues(filterObj, 'user_id');
      } else if (item.includes('firmstate')) {
        obj['mapping'] = filterObj[item];
      } else if (item.includes('mapping')) {
        obj['mapping'] = filterObj[item];
      } else if (item?.startsWith('filter')) {
        obj[item] = filterObj[item];
      } else if (item.includes('consumed_on_id')) {
        obj[`filter[consumed_on_id]`] = filterObj[item];
      } else if (item.includes('product_id_in')) {
        obj[`filter[product_id_in]`] = filterObj[item];
      }
    });

  return obj;
};

const mapFilterBeforeFetch = (filterObj) => {
  if (
    window.location.pathname === '/listings' ||
    window.location.pathname === `/${getAppLanguage()?.key}/listings` ||
    window.location.pathname === '/credits-usage' ||
    window.location.pathname === `/${getAppLanguage()?.key}/credits-usage`
  ) {
    const filterParams = getQueryParams(filterObj);
    return { filterObj, filterParams };
  } else {
    return { filterObj, filterParams: undefined };
  }
};

const mapFilterAfterFetch = (filterObj) => {
  if (
    window.location.pathname === '/listings' ||
    window.location.pathname === `/${getAppLanguage()?.key}/listings` ||
    window.location.pathname === '/credits-usage' ||
    window.location.pathname === `/${getAppLanguage()?.key}/credits-usage`
  ) {
    return getParams(filterObj);
  } else {
    return filterObj;
  }
};
//TODO : HANDLE PRODUCT_ID AND iTEM_ID CONFLICT FOR PLATFORMS
const cartProductList = (productList) => {
  return productList?.map((product) => {
    // const allProducts = [...products, ...packages];

    const allProducts = products;
    const pro = allProducts?.find((e) => e?.slug === product?.item_slug);
    const { id, item_id, quantity, price, item_type } = product;
    const platformSlug = product?.item_id == 11 || product?.item_id == 10 || product?.item_id == 9 ? 'olx' : 'zameen';
    return {
      id: id,
      product_id: item_id,
      title: getLocalisedString(product, 'item_title'),
      quantity,
      slug: pro?.slug || product.item_slug,
      image: pro?.image,
      price: makePriceForPackage(platformSlug, { key: product?.item_slug, product_price: price }),
      itemType: item_type,
      platformSlug,
    };
  });
};

export const getLocalisedString = (e, str, showOriginal) => {
  const path = getAppLanguage();
  if (e?.[str] && typeof e?.[str] === 'object') {
    return e?.[str]?.[path?.key];
  }
  if (path.key == 'ar') {
    return showOriginal ? e?.[`${str}_l1`] : e?.[`${str}_l1`] || e?.[str];
  }
  return e?.[str];
};
export const getPermissionsObj = (val) => ({
  inbox: val,
  leads: val,
  listings: val,
  profile: val,
  staff: val,
  stats: val,
});

export const areaUnitConvert =
  (convertTo) =>
  (convertFrom, values = []) => {
    let convertedValues = [];
    values.map((item) => {
      convertedValues.push(Math.floor(item * areaMapings[convertFrom][convertTo]));
    });
    return convertedValues;
  };

const formatMobile = (data, type) => {
  const replaceNumber = (number) => {
    let mobileNumberList;
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

const getTitleForAppliedProduct = (productId) => {
  return tenantData?.quotaCreditProducts?.find((e) => e?.id == productId)?.title;
};

const showTruPointsCriteriaSuccessNotification = (successMessage, productId) => {
  if (productId) {
    const productTitle = getTitleForAppliedProduct(productId);
    if (productTitle == 'Hot Listing') {
      notification.success(t("You've earned 15 TruPoints for applying Hot"));
    } else if (productTitle == 'Signature Listing') {
      notification.success(t("You've earned 20 TruPoints for applying Signature"));
    }
  } else if (successMessage) {
    notification.success(successMessage);
  }
};
const showTruBrokerStatusNotification = (user) => {
  if (user?.profile_completion?.score == 100 && user?.package && user?.active_listings_count >= 2) {
    if (!user?.is_tru_broker) {
      notification.success(t('Your TruBroker status will be updated shortly!'));
    }
  }
};

export default {
  apiEndpoint,
  getPaginationObject,
  mapFilterAfterFetch,
  mapFilterBeforeFetch,
  cartProductList,
  getLocalisedString,
  getPermissionsObj,
  areaUnitConvert,
  formatMobile,
  makePriceForPackage,
  showTruPointsCriteriaSuccessNotification,
  showTruBrokerStatusNotification,
};
