import tenantTheme from '@theme';

export const getListingActions = (productSlug, listingDetail, platformSlug) => {
  const getServiceStatus = (serviceSlug) => {
    const { status, is_applied } = listingDetail?.products_information?.[serviceSlug] || {};
    return {
      applied: is_applied && status === 'completed',
      pending: is_applied && status === 'requested',
    };
  };

  switch (productSlug) {
    case 'basic-listing':
      return {
        id: 1,
        actionType: 'quota',
        type: 'icon',
        icon: 'IconBasic',
        iconColor: tenantTheme['color-basic'],
        iconProps: { color: tenantTheme['color-basic'], size: '1.4em' },
        description: 'Get standard visibility and leads',
        propShopTagLine: 'Get an ad slot for 30 days to post your listing',
        orderSummaryTitle: 'Basic Listing',
        platform: 'ksa',
        itemType: 'item',
        filterValue: 'C',
        propShopTitle: 'Listing',
        slug: 'basic-listing',
        slug_alt: 'basic',
        name: 'Basic',
      };
    case 'credit':
      return {
        id: 7,
        actionType: 'credit',
        type: 'icon',
        icon: 'IconSuperHot',
        iconColor: '#c00',
        iconProps: { size: '1.2em', color: '#c00' },
        color: '#c00',
        textColor: 'white',
        description: 'Sell Listings 25x Faster',
        propShopTagLine: 'Get an ad slot for 30 days and place your ad at the top of search results',
        propShopTitle: 'Super Hot Listing',
        orderSummaryTitle: 'Credits',
        platform: 'ksa',
        canApplyOnUpgrade: true,
        canUtilize: true,
        title: 'Credit',
        appliedTitle: 'Super Hot Listing Applied',
        name: 'Credit',
        slug: 'credit',
        slug_alt: 'credit',
        itemType: 'item',
        filterValue: 'A',
      };
    case 'signature-listing':
      return {
        id: 3,
        actionType: 'credit',
        type: 'icon',
        icon: 'BsFillLightningChargeFill',
        color: tenantTheme['color-signature'],
        iconColor: tenantTheme['color-signature'],
        iconProps: { size: '1em', color: tenantTheme['color-signature'] },

        textColor: 'white',
        description: 'Get maximum visibility and leads',
        propShopTagLine: 'Get an ad slot for 30 days and place your ad at the top of search results',
        propShopTitle: 'Super Hot Listing',
        orderSummaryTitle: 'Signature Listing',
        platform: 'ksa',
        canApplyOnUpgrade: true,
        canUtilize: true,
        title: 'Mark Signature',
        appliedTitle: 'Signature Listing',
        name: 'Signature',
        slug: 'signature-listing',
        slug_alt: 'signature',
        itemType: 'package',
        filterValue: 'A',
        adOns: true,
        adOnsProducts: [14],

        applied: !!listingDetail?.products_information?.['signature-listing']?.is_applied,
        canApply: !!listingDetail?.products_information?.['signature-listing']?.is_applicable,
        time_to_expiry: listingDetail?.products_information?.['signature-listing']?.end_date,
        requestTitle: 'Request Signature Upgrade',
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
        iconProps: { size: '1.2em', color: tenantTheme['color-hot'] },
        tagColor: '#fff',
        tagIconColor: tenantTheme['color-hot'],
        textColor: 'white',
        description: 'Get enhanced visibility and leads',
        propShopTagLine: 'Get an ad slot for 30 days and place your ad above normal listings',
        propShopTitle: 'Hot Listing',
        orderSummaryTitle: 'Hot Listing',
        platform: 'ksa',
        canApplyOnUpgrade: true,
        canUtilize: true,
        title: 'Mark Hot',
        appliedTitle: 'Hot Listing',
        slug: 'hot-listing',
        slug_alt: 'hot',
        name: 'Hot',
        itemType: 'package',
        filterValue: 'B',
        applied: !!listingDetail?.products_information?.['hot-listing']?.is_applied,
        canApply: !!listingDetail?.products_information?.['hot-listing']?.is_applicable,
        time_to_expiry: listingDetail?.products_information?.['hot-listing']?.end_date,

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
        platform: 'zameen',
        canUtilize: true,
        title: 'Mark Refresh',
        appliedTitle: 'Refresh Listing',
        name: 'Refresh Property',
        slug: 'refresh',
        slug_alt: 'refresh',
        itemType: 'item',
        applied: !!listingDetail?.products_information?.refresh?.is_applied,
        canApply: !!listingDetail?.products_information?.refresh?.is_applicable,
        time_to_expiry: listingDetail?.products_information?.refresh?.end_date,

        requestTitle: 'Request Refresh Upgrade',
        infoMessage: 'The listing will be refreshed and it will get higher visibility',
      };
    case 'videography-service':
      return {
        id: 6,
        actionType: 'credit',
        type: 'icon',
        icon: 'HiVideoCamera',
        iconProps: { size: '1.2em', color: '#FFA900' },
        iconColor: '#FFA900',
        description: "Professional property videography by Bayut's experts",
        propShopTagLine: 'Bring your property to life with our captivating videography service.',
        alertMessage: 'Service only available in Karachi, Lahore & Islamabad.',
        propShopTitle: 'Verified Videography Credits',
        orderSummaryTitle: 'Videography Service',
        platform: 'ksa',
        canUtilize: true,
        title: 'Request Videography Service',
        // appliedDescription: 'Editing the listing will remove the verified check.',
        appliedTitle: 'Videography Service Applied',
        pendingTitle: 'Videography Service Requested',
        name: 'Verified Videography Credits',
        slug: 'videography-service',
        itemType: 'item',
        ...getServiceStatus('videography-service'),
        canApply: !!listingDetail?.products_information?.['videography-service']?.is_applicable,
        requested_at: listingDetail?.products_information?.['videography-service']?.end_date,
        isAddOn: true,
        requestTitle: 'Request Videography Service',
        infoMessage: '',
      };
    case 'photography-service':
      return {
        id: 5,
        actionType: 'credit',
        type: 'icon',
        icon: 'HiCamera',
        iconProps: { size: '1.2em', color: '#5462AF' },
        iconColor: '#5462AF',
        description: `Property photos by Bayut’s professionals`,
        propShopTagLine: `Upgrade your property's visual appeal with our premium professional photoshoot service.`,
        alertMessage: 'Service only available in Karachi, Lahore & Islamabad.',
        propShopTitle: 'Verified Photography Credits',
        orderSummaryTitle: 'Photography Service',
        platform: 'ksa',
        canUtilize: true,
        title: 'Request Photography Service',
        appliedTitle: 'Photography Service Applied',
        pendingTitle: 'Photography Service Requested',
        name: 'Verified Photography Credits',
        slug: 'photography-service',
        itemType: 'item',
        ...getServiceStatus('photography-service'),
        canApply: !!listingDetail?.products_information?.['photography-service']?.is_applicable,
        requested_at: listingDetail?.products_information?.['photography-service']?.end_date,
        isAddOn: true,
        requestTitle: 'Request Photography Service',
        infoMessage: '',
      };

    case 'drone-footage-service':
      return {
        id: 8,
        actionType: 'credit',
        type: 'icon',
        icon: 'DroneIcon',
        iconProps: { size: '1.2em', color: '#79cdd1' },
        iconColor: '#79cdd1',
        propShopTitle: 'Drone Service',
        orderSummaryTitle: 'Drone Footage Service',
        platform: 'ksa',
        canUtilize: true,
        title: 'Request Drone Footage',
        appliedTitle: 'Drone Footage Service Applied',
        pendingTitle: 'Drone Footage Service Requested',
        slug: 'drone-footage-service',
        itemType: 'item',
        canApply: !!listingDetail?.products_information?.['drone-footage-service']?.is_applicable,
        ...getServiceStatus('drone-footage-service'),
        requested_at: listingDetail?.products_information?.['drone-footage-service']?.end_date,
        requestTitle: 'Request Drone Footage Service',
        isAddOn: true,
      };
    case 'post':
      return {
        actionType: 'quota',
        type: 'Button',
        title: 'Post to',
        slug: productSlug,
        name: 'post',
        applied: false,
        canApply: true,
        ...(!platformSlug
          ? {}
          : platformSlug === 'zameen'
            ? { icon: 'IconZameen', platform: platformSlug }
            : { icon: 'IconOLX', platform: platformSlug }),
      };
    case 'repost':
      return {
        actionType: 'quota',
        type: 'Button',
        title: 'Re-post to',
        slug: productSlug,
        applied: false,
        canApply: true,
        name: 'repost',
        ...(!platformSlug
          ? {}
          : platformSlug === 'zameen'
            ? { icon: 'IconZameen', platform: platformSlug }
            : { icon: 'IconOLX', platform: platformSlug }),
      };
    case 'upgrade':
      return {
        actionType: 'quota',
        type: 'Button',
        title: 'Upgrade',
        slug: productSlug,
        applied: false,
        canApply: true,
        name: 'upgrade',
        ...(!platformSlug
          ? {}
          : platformSlug === 'zameen'
            ? { icon: 'IconZameen', platform: platformSlug }
            : { icon: 'IconOLX', platform: platformSlug }),
      };
    case 'publish':
      return {
        id: 1,
        actionType: 'quota',
        type: 'Button',
        title: 'Publish Now',
        slug: productSlug,
        applied: !!listingDetail?.is_posted,
        canApply: !listingDetail?.is_posted,
        name: 'publish',
        platform: 'ksa',
        // icon: 'IconBayut',
      };
    default:
  }
};

export const quotaCreditProducts = [
  {
    id: 1,
    crm_id: 31,
    title: 'Basic Listing',
    type: 'quota',
    duration: 365,
    slug: 'basic-listing',
    price: '200',
    image: null,
    platformSlug: 'ksa',
  },
  {
    id: 2,
    crm_id: 11,
    title: 'Hot Listing',
    type: 'credit',
    duration: 999,
    slug: 'hot-listing',
    price: '2500',
    platformSlug: 'ksa',
    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/premium-listing.jpg',
  },
  {
    id: 3,
    crm_id: 12,
    title: 'Signature Listing',
    type: 'credit',
    duration: 365,
    slug: 'signature-listing',
    price: '4000',
    platformSlug: 'KSA',
    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/hot-listing.jpg',
  },
  {
    id: 7,
    crm_id: 54,
    title: 'Credit',
    type: 'credit',
    duration: 365,
    slug: 'credit',
    price: '15000',
    platformSlug: 'ksa',
    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/superhot-listing.jpg',
  },
  {
    id: 5,
    crm_id: 54,
    title: 'Photography Service',
    type: 'credit',
    duration: 365,
    slug: 'photography-service',
    price: '3000',
    platformSlug: 'ksa',
    // image:
    //   'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/superhot-listing.jpg',
  },
  {
    id: 8,
    crm_id: null,
    title: 'Drone Footage Service',
    type: 'credit',
    slug: 'drone-footage-service',
    price: '3000',
    platformSlug: 'ksa',
  },
  {
    id: 6,
    crm_id: 54,
    title: 'Videography Service',
    type: 'credit',
    duration: 365,
    slug: 'videography-service',
    price: '7000',
    platformSlug: 'ksa',
    // image:
    //   'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/superhot-listing.jpg',
  },
  {
    id: 4,
    crm_id: 266,
    title: 'Refresh Listing',
    type: 'quota',
    duration: 30,
    slug: 'refresh',
    price: '300',
    platformSlug: 'ksa',
    image: null,
  },
];

export const products = quotaCreditProducts.map((e) => ({
  ...getListingActions(e.slug),
  ...e,
}));

export const productDependents = {
  zameen: {
    ['shot_listing']: 'premium_listing',
    ['hot_listing']: 'premium_listing',
  },
  olx: {},
};

export const getTagProps = (productsInfo) => {
  if (productsInfo?.['signature-listing']?.is_applied) {
    return getListingActions('signature-listing');
  }
  if (productsInfo?.['hot-listing']?.is_applied) {
    return getListingActions('hot-listing');
  }
  return getListingActions('basic-listing');
};

export default {
  productDependents,
  products,
  quotaCreditProducts,
  getListingActions,
  getTagProps,
};
