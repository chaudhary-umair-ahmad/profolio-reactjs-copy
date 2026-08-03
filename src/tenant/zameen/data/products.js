export const getListingActions = (productSlug, listingDetail, platformSlug) => {
  switch (productSlug) {
    case 'premium_listing':
      return {
        id: 2,
        type: 'icon',
        icon: 'IconPremiumCredits',
        iconProps: { color: '#00a651' },
        iconColor: '#00a651',
        description: 'Better reach on the platform',
        propShopTagLine: 'Get an ad slot for 30 days to post your listing',
        orderSummaryTitle: 'Listing',
        platform: 'zameen',
        itemType: 'package',
        filterValue: 'C',
        propShopTitle: 'Listing',
        adOns: true,
        adOnsProducts: [13],
        item_type: 'Product',
      };
    case 'shot_listing':
      return {
        id: 5,
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
        orderSummaryTitle: 'Super Hot Credits',
        platform: 'zameen',
        canApplyOnUpgrade: true,
        canUtilize: true,
        title: 'Apply Super Hot',
        appliedTitle: 'Super Hot Listing Applied',
        name: 'Super Hot',
        slug: 'shot_listing',
        slug_alt: 'superhot',
        itemType: 'product',
        item_type: 'Product',
        filterValue: 'A',
        adOns: true,
        adOnsProducts: [14],
        ...(listingDetail && {
          applied:
            !!listingDetail?.[platformSlug]?.superhot_upto &&
            !!(new Date() < new Date(listingDetail?.[platformSlug]?.superhot_upto)),
          canApply: !listingDetail?.[platformSlug]?.superhot_upto
            ? true
            : !!(new Date() > new Date(listingDetail?.[platformSlug]?.superhot_upto)),
          time_to_expiry:
            new Date() > new Date(listingDetail?.[platformSlug]?.superhot_upto)
              ? undefined
              : listingDetail?.[platformSlug]?.superhot_upto,
        }),
      };
    case 'super_hot_listing_package':
      return {
        id: 16,
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
        orderSummaryTitle: 'Super Hot Credits',
        platform: 'zameen',
        canApplyOnUpgrade: true,
        canUtilize: true,
        title: 'Apply Super Hot',
        appliedTitle: 'Super Hot Listing Applied',
        name: 'Super Hot',
        slug: 'super_hot_listing_package',
        slug_alt: 'superhot',
        itemType: 'package',
        filterValue: 'A',
        adOns: true,
        adOnsProducts: [14],
        item_type: 'Package',
        ...(listingDetail && {
          applied:
            !!listingDetail?.[platformSlug]?.superhot_upto &&
            !!(new Date() < new Date(listingDetail?.[platformSlug]?.superhot_upto)),
          canApply: !listingDetail?.[platformSlug]?.superhot_upto
            ? true
            : !!(new Date() > new Date(listingDetail?.[platformSlug]?.superhot_upto)),
          time_to_expiry:
            new Date() > new Date(listingDetail?.[platformSlug]?.superhot_upto)
              ? undefined
              : listingDetail?.[platformSlug]?.superhot_upto,
        }),
      };

    case 'hot_listing_package':
      return {
        id: 15,
        actionType: 'credit',
        type: 'icon',
        icon: 'IconHot',
        color: '#ffa900',
        iconColor: '#f60',
        iconProps: { size: '1.2em', color: '#ffa900' },
        textColor: 'white',
        description: 'Sell Listings 15x Faster',
        propShopTagLine: 'Get an ad slot for 30 days and place your ad above normal listings',
        propShopTitle: 'Hot Listing',
        orderSummaryTitle: 'Hot Credits',
        platform: 'zameen',
        canApplyOnUpgrade: true,
        canUtilize: true,
        title: 'Apply Hot',
        appliedTitle: 'Hot Listing Applied',
        slug: 'hot_listing_package',
        slug_alt: 'hot',
        name: 'Hot',
        itemType: 'package',
        item_type: 'Package',
        filterValue: 'B',
        ...(listingDetail && {
          applied:
            !!listingDetail?.[platformSlug]?.hot_upto &&
            !!(new Date() < new Date(listingDetail?.[platformSlug]?.hot_upto)),
          canApply: !listingDetail?.[platformSlug]?.hot_upto
            ? true
            : !!(new Date() > new Date(listingDetail?.[platformSlug]?.hot_upto)),
          time_to_expiry:
            new Date() > new Date(listingDetail?.[platformSlug]?.hot_upto)
              ? undefined
              : listingDetail?.[platformSlug]?.hot_upto,
        }),
      };

    case 'hot_listing':
      return {
        id: 4,
        actionType: 'credit',
        type: 'icon',
        icon: 'IconHot',
        color: '#ffa900',
        iconColor: '#f60',
        iconProps: { size: '1.2em', color: '#ffa900' },
        textColor: 'white',
        description: 'Sell Listings 15x Faster',
        propShopTagLine: 'Get an ad slot for 30 days and place your ad above normal listings',
        propShopTitle: 'Hot Listing',
        orderSummaryTitle: 'Hot Credits',
        platform: 'zameen',
        canApplyOnUpgrade: true,
        canUtilize: true,
        title: 'Apply Hot',
        appliedTitle: 'Hot Listing Applied',
        slug: 'hot_listing',
        slug_alt: 'hot',
        name: 'Hot',
        itemType: 'product',
        item_type: 'Product',
        filterValue: 'B',
        ...(listingDetail && {
          applied:
            !!listingDetail?.[platformSlug]?.hot_upto &&
            !!(new Date() < new Date(listingDetail?.[platformSlug]?.hot_upto)),
          canApply: !listingDetail?.[platformSlug]?.hot_upto
            ? true
            : !!(new Date() > new Date(listingDetail?.[platformSlug]?.hot_upto)),
          time_to_expiry:
            new Date() > new Date(listingDetail?.[platformSlug]?.hot_upto)
              ? undefined
              : listingDetail?.[platformSlug]?.hot_upto,
        }),
      };
    case 'refresh_listing':
      return {
        id: 1,
        actionType: 'credit',
        type: 'icon',
        icon: 'MdRefresh',
        iconColor: '#0793EA',
        color: '#0793EA',
        description: 'Place your property at the top',
        propShopTagLine: 'Refresh the time of your posted listings and bring them to the top again',
        propShopTitle: 'Refresh Credits',
        orderSummaryTitle: 'Refresh Credits',
        platform: 'zameen',
        canUtilize: true,
        title: 'Apply Refresh Property',
        appliedTitle: 'Refresh Property Applied',
        name: 'Refresh Property',
        slug: 'refresh_listing',
        itemType: 'item',
        item_type: 'Product',
        ...(listingDetail && {
          applied:
            !!listingDetail?.[platformSlug]?.refresh_upto &&
            !!(new Date() < new Date(listingDetail?.[platformSlug]?.refresh_upto)),
          canApply: !listingDetail?.[platformSlug]?.refresh_upto
            ? true
            : !!(new Date() > new Date(listingDetail?.[platformSlug]?.refresh_upto)),
          // canApply: !listingDetail?.time_to_mark_refresh && !!zameenCreditsAvailable && zameenCreditsAvailable >= 1,
          time_to_expiry:
            new Date() > new Date(listingDetail?.[platformSlug]?.refresh_upto)
              ? undefined
              : listingDetail?.[platformSlug]?.refresh_upto,
        }),
      };
    case 'property_videography':
      return {
        id: 14,
        actionType: 'credit',
        type: 'icon',
        icon: 'HiVideoCamera',
        iconProps: { size: '1.2em', color: '#ffa900' },
        iconColor: '#ffa900',
        description: 'Bring your property to life with our captivating videography service.',
        propShopTagLine: 'Bring your property to life with our captivating videography service.',
        alertMessage: 'Service only available in Karachi, Lahore & Islamabad.',
        propShopTitle: 'Verified Videography Credits',
        orderSummaryTitle: 'Verified Videography Credits',
        platform: 'zameen',
        canUtilize: true,
        title: 'Zameen Verfied Services',
        appliedDescription: 'Editing the listing will remove the verified check.',
        appliedTitle: 'Verified service already applied to listing.',
        pendingTitle: 'Request for Verified Service is already in process.',
        name: 'Verified Videography Credits',
        slug: 'property_videography',
        itemType: 'item',
        item_type: 'Product',
        ...(listingDetail && {
          applied: listingDetail?.[platformSlug]?.is_verified == 1,
          pending:
            listingDetail?.[platformSlug]?.is_verified == 0 &&
            (listingDetail?.[platformSlug]?.is_photo_verified || listingDetail?.[platformSlug]?.is_video_verified),
          canApply:
            !listingDetail?.[platformSlug]?.is_verified == 1 &&
            !listingDetail?.[platformSlug]?.is_photo_verified &&
            !listingDetail?.[platformSlug]?.is_video_verified,
          time_to_expiry: null,
        }),
        requiresDate: true,
      };
    case 'property_photography':
      return {
        id: 13,
        actionType: 'credit',
        type: 'icon',
        icon: 'HiCamera',
        iconProps: { size: '1.2em', color: '#0793ea' },
        iconColor: '#0793ea',
        description: `Upgrade your property's visual appeal with our premium professional photoshoot service.`,
        propShopTagLine: `Upgrade your property's visual appeal with our premium professional photoshoot service.`,
        alertMessage: 'Service only available in Karachi, Lahore & Islamabad.',
        propShopTitle: 'Verified Photography Credits',
        orderSummaryTitle: 'Verified Photography Credits',
        platform: 'zameen',
        canUtilize: true,
        title: 'Verified Photography Credits',
        appliedTitle: 'Videography Credits Applied',
        name: 'Verified Photography Credits',
        slug: 'property_photography',
        itemType: 'item',
        item_type: 'Product',
        ...(listingDetail && {
          applied: listingDetail?.[platformSlug]?.is_verified !== 0,
          canApply: listingDetail?.[platformSlug]?.is_verified == 0,
          time_to_expiry: null,
        }),
        requiresDate: true,
      };
    case 'story_ad':
      return {
        id: 12,
        actionType: 'credit',
        type: 'icon',
        icon: 'IconStoryAd',
        // iconProps: { color: '#00a651' },
        iconColor: '#00a651',
        description: 'Better reach on the platform',
        propShopTagLine: 'Get more exposure by posting your listing in the story',
        propShopTitle: 'Story Ad Credits',
        orderSummaryTitle: 'Story Ad Credits',
        platform: 'zameen',
        title: 'Apply Story Ad',
        appliedTitle: 'Zameen Stories',
        name: 'Story Ad',
        slug: 'story_ad',
        iconSize: '1em',
        item_type: 'Product',
        itemType: 'item',
        item_type: 'Product',
        opaque: true,
        ...(listingDetail?.[platformSlug]?.stories?.length > 0
          ? {
              applied:
                !!listingDetail?.[platformSlug]?.stories?.[0]?.expired_at &&
                !!(new Date() < new Date(listingDetail?.[platformSlug]?.stories?.[0]?.expired_at)),
              canApply: !listingDetail?.[platformSlug]?.stories?.[0]?.expired_at
                ? true
                : !!(new Date() > new Date(listingDetail?.[platformSlug]?.stories?.[0]?.expired_at)),
              time_to_expiry:
                new Date() > new Date(listingDetail?.[platformSlug]?.stories?.[0]?.expired_at)
                  ? undefined
                  : listingDetail?.[platformSlug]?.stories?.[0]?.published_at,
            }
          : {
              applied: false,
              canApply: true,
              time_to_expiry: undefined,
            }),
      };
    // OLX
    case 'olx_premium_listing':
      return {
        type: 'icon',
        icon: 'IconStoryAdCredits',
        iconProps: { color: '#00a651' },
        iconColor: '#00a651',
        description: 'Better reach on the platform',
        propShopTagLine: 'Better reach on the platform',
        propShopTitle: 'Listing Quota',
        platform: 'olx',
        itemType: 'item',
        item_type: 'Product',
      };
    case 'olx_refresh_listing':
      return {
        id: 10,
        actionType: 'credit',
        type: 'icon',
        icon: 'RiArrowUpFill',
        iconColor: '#1f1f1f',
        color: '#2874ff',
        iconProps: {
          hasBackground: true,
          iconBackgroundColor: '#2874ff1a',
          color: '#1f1f1f',
          size: '.9em',
          style: { padding: 4 },
        },
        item_type: 'Product',
        iconBackgroundColor: '#2874ff',
        description: 'Better reach on the platform',
        propShopTagLine: 'Better reach on the platform',
        propShopTitle: 'Boost Credits',
        platform: 'olx',
        title: 'Apply Boost property',
        appliedTitle: 'Boost Property Applied',
        name: 'Boost property',
        slug: 'olx_refresh_listing',
        itemType: 'item',
        item_type: 'Product',
        ...(listingDetail && {
          applied:
            !!listingDetail?.[platformSlug]?.boosted_upto &&
            !!(new Date() < new Date(listingDetail?.[platformSlug]?.boosted_upto)),
          canApply: !listingDetail?.[platformSlug]?.boosted_upto
            ? true
            : !!(new Date() > new Date(listingDetail?.[platformSlug]?.boosted_upto)),
          time_to_expiry:
            new Date() > new Date(listingDetail?.[platformSlug]?.boosted_upto)
              ? undefined
              : listingDetail?.[platformSlug]?.boosted_upto,
        }),
      };
    case 'olx_feature':
      return {
        id: 11,
        actionType: 'credit',
        type: 'icon',
        icon: 'IconF',
        color: '#ffec74',
        iconProps: {
          hasBackground: true,
          color: '#ffec74',
          size: '.9em',
          style: {
            '--icon-bg-color': '#ffec74',
            padding: 4,
          },
        },
        item_type: 'Product',
        iconColor: '#1f1f1f',
        description: 'Better reach on the platform',
        propShopTagLine: 'Better reach on the platform',
        propShopTitle: 'Feature Credits',
        platform: 'olx',
        canApplyOnUpgrade: true,
        opaque: true,
        title: 'Apply Feature property',
        appliedTitle: 'Feature Property Applied',
        name: 'Feature',
        slug: 'olx_feature',
        slug_alt: 'featured',
        itemType: 'item',
        item_type: 'Product',
        ...(listingDetail && {
          applied:
            !!listingDetail?.[platformSlug]?.featured_upto &&
            !!(new Date() < new Date(listingDetail?.[platformSlug]?.featured_upto)),
          canApply: !listingDetail?.[platformSlug]?.featured_upto
            ? true
            : !!(new Date() > new Date(listingDetail?.[platformSlug]?.featured_upto)),
          time_to_expiry:
            new Date() > new Date(listingDetail?.[platformSlug]?.featured_upto)
              ? undefined
              : listingDetail?.[platformSlug]?.featured_upto,
        }),
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
        actionType: 'quota',
        type: 'Button',
        title: 'Publish Now',
        slug: productSlug,
        applied: false,
        canApply: true,
        name: 'publish',
        platform: 'zameen',
        icon: 'IconZameen',
      };

    default:
      return;
  }
};

export const quotaCreditProducts = [
  {
    id: 1,
    crm_id: 31,
    title: 'Refresh Credits',
    type: 'credit',
    duration: 365,
    slug: 'refresh_listing',
    price: '240',
    image: null,
    platformSlug: 'zameen',
    listingType: 'Refresh',
  },
  {
    id: 2,
    crm_id: 11,
    title: 'Listing Quota',
    type: 'quota',
    duration: 999,
    slug: 'premium_listing',
    price: '3000',
    platformSlug: 'zameen',
    listingType: 'Listing',

    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/premium-listing.jpg',
  },
  {
    id: 4,
    crm_id: 12,
    title: 'Hot Credits',
    type: 'credit',
    duration: 365,
    slug: 'hot_listing',
    price: '4800',
    platformSlug: 'zameen',
    listingType: 'Hot',
    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/hot-listing.jpg',
  },
  {
    id: 15,
    crm_id: 12,
    title: 'Hot Listing',
    type: 'package',
    duration: 365,
    slug: 'hot_listing_package',
    price: '4800',
    platformSlug: 'zameen',
    listingType: 'Hot',
    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/hot-listing.jpg',
  },
  {
    id: 5,
    crm_id: 54,
    title: 'Super Hot Credits',
    type: 'credit',
    duration: 365,
    slug: 'shot_listing',
    price: '18000',
    platformSlug: 'zameen',
    listingType: 'Super Hot',
    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/superhot-listing.jpg',
  },
  {
    id: 16,
    crm_id: 54,
    title: 'Super Hot Listing',
    type: 'package',
    duration: 365,
    slug: 'super_hot_listing_package',
    price: '18000',
    platformSlug: 'zameen',
    listingType: 'Super Hot',
    image:
      'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/superhot-listing.jpg',
  },
  {
    id: 13,
    crm_id: 54,
    title: 'Verified Photography Credits',
    type: 'credit',
    duration: 365,
    slug: 'property_photography',
    price: '3600',
    platformSlug: 'zameen',
    listingType: 'Verified Photography',
    // image:
    //   'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/superhot-listing.jpg',
  },

  {
    id: 14,
    crm_id: 54,
    title: 'Verified Videography Credits',
    type: 'credit',
    duration: 365,
    slug: 'property_videography',
    price: '12000',
    platformSlug: 'zameen',
    listingType: 'Verified Videography',
    // image:
    //   'https://35032beae2695ca54eb4-e70e51a7e06dfa1ec801031c9e0043e8.ssl.cf1.rackcdn.com/common/adv/superhot-listing.jpg',
  },
  {
    id: 9,
    crm_id: 266,
    title: 'Listing Quota',
    type: 'quota',
    duration: 30,
    slug: 'olx_premium_listing',
    price: '300',
    platformSlug: 'olx',
    listingType: 'Listing',
    image: null,
  },
  {
    id: 10,
    crm_id: 267,
    title: 'Boost Credits',
    type: 'credit',
    duration: 365,
    slug: 'olx_refresh_listing',
    price: '80',
    platformSlug: 'olx',
    listingType: 'Boost',
    image: null,
  },
  {
    id: 11,
    crm_id: 265,
    title: 'Feature Credits',
    type: 'credit',
    duration: 365,
    slug: 'olx_feature',
    price: '4000',
    platformSlug: 'olx',
    listingType: 'Feature',
    image: null,
  },
  {
    id: 12,
    crm_id: 269,
    title: 'Story Ad Credits',
    type: 'credit',
    duration: 365,
    slug: 'story_ad',
    price: '1000',
    platformSlug: 'zameen',
    listingType: 'Story Ad',
    image: null,
  },
];

export const products = quotaCreditProducts.map((e) => ({
  ...getListingActions(e.slug),
  ...e,
}));

export const productDependents = {
  zameen: {},
  olx: {},
};

export default {
  productDependents,
  products,
  quotaCreditProducts,
  getListingActions,
};
