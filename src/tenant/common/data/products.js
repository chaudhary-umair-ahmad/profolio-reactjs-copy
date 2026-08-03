import tenantTheme from '@theme';
import { TENANT_KEY } from '../../../utility/env';

export const getListingActions = (productSlug, listingDetail, platformSlug) => {
  switch (productSlug) {
    case 'basic-listing-dubizzle':
      return {
        id: 1,
        actionType: 'credit',
        type: 'icon',
        icon: 'IconBasic',
        iconColor: tenantTheme['color-basic'],
        iconProps: { color: tenantTheme['color-basic'], size: '1.4em' },
        description: 'Get standard visibility and leads',
        propShopTagLine: 'Get an ad slot for 30 days to post your listing',
        orderSummaryTitle: 'Basic Listing Dubizzle',
        platform: 'dubizzle',
        itemType: 'item',
        filterValue: 'C',
        propShopTitle: 'Listing',
        slug: 'basic-listing-dubizzle',
        slug_alt: 'basic',
        requestTitle: 'Post Listing',
        name: 'Basic',
        infoMessage: 'The expiry date of the upgrade will be set to {{expiry_days}} days',
      };

    case 'basic-listing':
      return {
        id: 1,
        actionType: 'credit',
        type: 'icon',
        icon: 'IconBasic',
        iconColor: tenantTheme['color-basic'],
        iconProps: { color: tenantTheme['color-basic'], size: '1.4em' },
        description: 'Get standard visibility and leads',
        propShopTagLine: 'Get an ad slot for 30 days to post your listing',
        orderSummaryTitle: 'Basic Listing Bayut',
        platform: 'bayut',
        itemType: 'item',
        filterValue: 'C',
        propShopTitle: 'Listing',
        slug: 'basic-listing',
        slug_alt: 'basic',
        name: 'Basic',
        requestTitle: 'Post Listing',
        infoMessage: 'The expiry date of the upgrade will be set to {{expiry_days}} days',
      };
    case 'hot-listing':
      return {
        id: 2,
        actionType: 'credit',
        type: 'icon',
        icon: 'IconSuperHot',
        color: tenantTheme['color-hot'],
        iconColor: tenantTheme['color-hot'],
        iconProps: { size: '1.2em', color: '#C13636' },
        tagColor: '#fff',
        tagIconColor: tenantTheme['color-hot'],
        platformIcon: 'BayutSmallLogo',
        textColor: 'white',
        description: 'Get enhanced visibility and leads',
        propShopTagLine: 'Get a listing slot for 30 days and place your listings above normal listings',
        propShopTitle: 'Hot Listing',
        orderSummaryTitle: 'Hot Listing',
        platform: 'bayut',
        canApplyOnUpgrade: true,
        canUtilize: true,
        title: 'Mark Hot',
        appliedTitle: 'Hot Listing',
        slug: 'hot-listing',
        slug_alt: 'hot',
        name: 'Hot',
        itemType: 'package',
        filterValue: 'B',
        applied: !!listingDetail?.bayut?.products_information?.['hot-listing']?.is_applied,
        canApply: !!listingDetail?.bayut?.products_information?.['hot-listing']?.is_applicable,
        time_to_expiry: listingDetail?.bayut?.products_information?.['hot-listing']?.till_date,
        requestTitle: 'Request Hot Upgrade',
        infoMessage: 'The expiry date of the upgrade will be set to {{expiry_days}} days',
      };
    case 'refresh':
      return {
        id: 4,
        actionType: 'credit',
        type: 'icon',
        icon: 'MdRefresh',
        iconColor: '#479EEB',
        color: '#479EEB',
        iconProps: { size: '1.2em', color: '#479EEB' },
        description: 'Place your property at the top',
        propShopTagLine: 'Refresh the time of your posted listings and bring them to the top again',
        propShopTitle: 'Refresh Credits',
        orderSummaryTitle: 'Refresh Credits',
        platform: 'bayut',
        platformIcon: 'MdRefresh',
        canUtilize: true,
        title: 'Mark Refresh',
        appliedTitle: 'Refresh Listing',
        name: 'Refresh Property',
        slug: 'refresh',
        slug_alt: 'refresh',
        itemType: 'item',
        applied: !!listingDetail?.bayut?.products_information?.refresh?.is_applied,
        canApply: !!listingDetail?.bayut?.products_information?.refresh?.is_applicable,
        time_to_expiry: listingDetail?.bayut?.products_information?.refresh?.till_date,
        requestTitle: 'Request Refresh Upgrade',
        infoMessage: 'The listing will be refreshed and it will get higher visibility',
      };
    case 'boost-to-top':
      return {
        id: 5,
        actionType: 'credit',
        type: 'icon',
        icon: 'MdRefresh',
        iconColor: '#479EEB',
        color: '#479EEB',
        iconProps: { size: '1.2em', color: '#479EEB' },
        description: 'Place your property at the top',
        propShopTagLine: 'Refresh the time of your posted listings and bring them to the top again',
        propShopTitle: 'Boost to Top',
        orderSummaryTitle: 'Boost to Top',
        platform: 'dubizzle',
        canUtilize: true,
        title: 'Boost to Top',
        appliedTitle: 'Boost to Top',
        name: 'Boost to Top',
        slug: 'boost-to-top',
        slug_alt: 'boost-to-top',
        itemType: 'item',
        applied: !!listingDetail?.dubizzle?.products_information?.refresh?.is_applied,
        canApply: !!listingDetail?.dubizzle?.products_information?.refresh?.is_applicable,
        time_to_expiry: listingDetail?.dubizzle?.products_information?.refresh?.till_date,
        requestTitle: 'Request Boost to Top',
        infoMessage: 'The listing will be boosted to top and will get higher visbility',
      };
    case 'feature':
      return {
        id: 4,
        actionType: 'credit',
        type: 'icon',
        icon: TENANT_KEY === 'eg' ? 'FeaturedIconEg' : 'FeaturedIconOman',
        iconColor: '#FFBA3C',
        color: '#',
        iconProps: { size: '1.2em', color: '#FFBA3C' },
        platformIcon: 'DubizzleFlameLogo',
        description: 'Place your property at the top',
        propShopTagLine: 'Refresh the time of your posted listings and bring them to the top again',
        propShopTitle: 'Featured',
        orderSummaryTitle: 'Feature Listing',
        platform: 'dubizzle',
        canUtilize: true,
        title: 'Mark Feature',
        appliedTitle: 'Feature Listing',
        name: 'Featured',
        slug: 'feature',
        slug_alt: 'feature',
        itemType: 'item',
        applied: !!listingDetail?.dubizzle?.products_information?.feature?.is_applied,
        canApply: !!listingDetail?.dubizzle?.products_information?.feature?.is_applicable,
        time_to_expiry: listingDetail?.dubizzle?.products_information?.feature?.till_date,
        requestTitle: 'Request Featured upgrade',
        infoMessage: 'The expiry date of the upgrade will be set to {{expiry_days}} days',
        hideIconInTag: true,
      };

    default:
  }
};

export const quotaCreditProducts = [
  {
    title: 'Basic Listing',
    type: 'credit',
    duration: 365,
    slug: 'basic-listing',
    price: '200',
    image: null,
    platformSlug: 'bayut',
  },
  {
    title: 'Hot Listing',
    type: 'credit',
    duration: 999,
    slug: 'hot-listing',
    price: '2500',
    platformSlug: 'bayut',
    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/premium-listing.jpg',
  },
  {
    title: 'Refresh Listing',
    type: 'credit',
    duration: 30,
    slug: 'refresh',
    price: '300',
    platformSlug: 'bayut',
    image: null,
  },
  {
    title: 'Basic Listing Dubizzle',
    type: 'credit',
    duration: 30,
    slug: 'basic-listing-dubizzle',
    price: '300',
    platformSlug: 'dubizzle',
    image: null,
  },
  {
    title: 'Feature',
    type: 'credit',
    duration: 30,
    slug: 'feature',
    price: '300',
    platformSlug: 'dubizzle',
    image: null,
  },
  {
    title: 'Boost to Top',
    type: 'credit',
    duration: 30,
    slug: 'boost-to-top',
    price: '300',
    platformSlug: 'dubizzle',
    image: null,
  },
];

export const products = quotaCreditProducts.map((e) => ({
  ...getListingActions(e.slug),
  ...e,
}));

export const productDependents = {
  bayut: {},
  dubizzle: {},
};

export const getTagProps = (productsInfo) => {
  if (productsInfo?.['hot-listing']?.is_applied) {
    return getListingActions('hot-listing');
  }
  if (productsInfo?.['feature']?.is_applied) {
    return getListingActions('feature');
  }
};

export default {
  productDependents,
  products,
  quotaCreditProducts,
  getListingActions,
  getTagProps,
};
