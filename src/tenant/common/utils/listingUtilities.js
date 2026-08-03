import { t } from 'i18next';
import tenantTheme from '@theme';
import tenantConstants from '@constants';
import { getListingActions } from '../../common/data/products';
import { BayutLogoAr, BayutLogoEn, DubizzleLogo, DubizzleLogoAr } from '../../../components/svg';
import { isGCCTenant } from '@/utility/env';

export const getListingRowActionsConfig = (user) => {
  const platformActions = {
    bayut: (isMultiPlatform) =>
      isMultiPlatform
        ? ['listing_detail_drawer', 'edit_listing', 'refresh_listing', 'listing_detail', 'delete_listing']
        : ['listing_detail_drawer', 'edit_listing', 'listing_detail', 'delete_listing'],

    dubizzle: (isMultiPlatform) =>
      isMultiPlatform
        ? [
            'listing_detail_drawer',
            'edit_listing',
            'boost_to_top',
            'listing_detail_dubizzle',
            'delete_listing_dubizzle',
          ]
        : ['listing_detail_drawer', 'edit_listing', 'listing_detail_dubizzle', 'delete_listing_dubizzle'],
  };

  return user?.platforms?.reduce((acc, platform) => {
    if (platformActions[platform.slug]) {
      acc[platform.slug] = platformActions[platform.slug](user?.isMultiPlatform);
    }
    return acc;
  }, {});
};

export const listingPlatformActions = (user, platformSlug) => {
  const isMultiPlatform = user?.isMultiPlatform;

  switch (platformSlug) {
    case 'bayut':
      return isMultiPlatform ? ['hot-listing'] : ['hot-listing', 'refresh'];

    case 'dubizzle':
      return isMultiPlatform ? ['feature'] : ['feature', 'boost-to-top'];

    default:
      return [];
  }
};

export const dispositionDependentPlatformActions = {
  publish:
    'not-posted,payment-failed,deleted,expired,sold,service-suspended,completed,insufficient-credits,info-completed,fal-license-expired,contract-expired',
};

export const dispositionDependentRowActions = {
  edit_listing:
    'not-posted,payment-failed,draft,live,expired,invalid-license,service-suspended,completed,insufficient-credits,info-completed,fal-license-expired,sold,contract-expired',
  listing_detail: 'live',
  listing_detail_dubizzle: 'live',
  refresh_listing: 'live',
  boost_to_top: 'live',
  listing_detail_drawer:
    'live,ad-in-review,changes-in-review,payment-pending,ready-for-moderation,pending-nafaz-verification,deleted,rejected,sold,expired,deleted-by-ops,fal-license-expired,ad-license-expired,contract-expired,unauthorized-fal-license',
  delete_listing:
    'live,not-posted,payment-failed,ad-in-review,changes-in-review,rega-expired,invalid-license,service-suspended,completed,insufficient-credits,info-completed',
  delete_listing_dubizzle:
    'live,not-posted,payment-failed,rega-expired,ad-in-review,changes-in-review,invalid-license,service-suspended,completed,insufficient-credits,info-completed',
};

export const listingStatusMapper = (status, data, platform) => {
  switch (status) {
    case 'active':
      return { color: 'green', label: t('Active'), slug: status };
    case 'draft':
      return { color: '', label: t('Draft'), slug: status };
    case 'removed':
      return { color: 'red', label: t('Removed'), slug: status };
    case 'pending':
      return { color: 'warning', label: t('Pending'), slug: status };
    default:
      return { color: '#c00', label: t('Not Posted'), slug: 'not_posted' };
  }
};
export const listingDispositionMapper = (disposition) => {
  switch (disposition?.slug) {
    case 'live':
      return {
        color: tenantTheme['secondary-color'],
        label: t('Live'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
      };
    case 'not-posted':
      return {
        color: '',
        label: t('Not Posted'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
      };
    case 'ad-in-review':
      return {
        color: '',
        label: t('Ad In Review'),
        slug: disposition?.slug,
        description: disposition?.description,

        description_l1: disposition?.description_l1,
      };
    case 'changes-in-review':
      return {
        color: tenantTheme['warning-color'],
        label: t('Changes In Review'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
      };
    case 'completed':
      return {
        color: '',
        label: t('Completed'),
        description: disposition?.description,
        slug: disposition?.slug,
        description_l1: disposition?.description_l1,
      };
    case 'payment-pending':
      return {
        color: '',
        label: t('Payment Pending'),
        description: disposition?.description,
        slug: disposition?.slug,
        description_l1: disposition?.description_l1,
      };
    case 'ready-for-moderation':
      return {
        color: '',
        label: t('Ready for moderation'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
      };

    case 'deleted':
      return {
        color: '',
        label: t('Deleted'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
      };
    case 'rejected':
      return {
        color: tenantTheme['warning-color'],
        label: t('Rejected'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
      };
    case 'service-suspended':
      return {
        color: 'red',
        label: t('Service Suspended'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
        comments: '',
      };

    case 'expired':
      return {
        color: 'red',
        label: t('Expired'),
        description: disposition?.description,
        slug: disposition?.slug,
        description_l1: disposition?.description_l1,
      };
    case 'sold':
      return {
        color: 'red',
        label: t('Sold'),
        description: disposition?.description,
        slug: disposition?.slug,
        description_l1: disposition?.description_l1,
      };
    case 'deleted-by-ops':
      return {
        color: 'red',
        label: t('Deleted'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
      };

    case 'insufficient-credits':
      return {
        color: '',
        label: t('Insufficient Credits'),
        slug: disposition?.slug,
        description: disposition?.description,
        description_l1: disposition?.description_l1,
      };

    case 'info-completed':
      return {
        color: '',
        label: t('Info Completed'),
        description_l1: disposition?.description_l1,
        slug: disposition?.slug,
        description: disposition?.description,
      };
    default:
      return {
        color: '',
        label: t('Not Posted'),
        description_l1: disposition?.description_l1,
        slug: 'not-posted',
        description: disposition?.description,
      };
  }
};

export const showPlatformAction = (status, slug) => {
  const index = dispositionDependentPlatformActions[slug]?.split(',').findIndex((e) => e === status);
  return index != -1;
};

export const showRowActions = (status, slug) => {
  const index = dispositionDependentRowActions[slug]?.split(',')?.findIndex((e) => e === status);
  return index != -1;
};

export const getListingPlatformActions = (listing, user, platformSlug) => {
  const actions = listingPlatformActions(user, platformSlug)?.filter((e) =>
    showPlatformAction(listing?.disposition?.slug, e),
  );
  let listingActions = [];
  !!actions?.length > 0 &&
    actions.forEach((e) => {
      listingActions.push({
        ...getListingActions(e, listing?.platforms),
      });
    });

  return listingActions;
};

export const getRowActionList = (
  item,
  slug,
  refObject,
  loading,
  editable = true,
  previewAble = true,
  deletable = true,
) => {
  switch (slug) {
    case 'refresh_listing':
      return {
        disabled:
          loading ||
          !!item?.platforms?.bayut?.products_information?.['refresh']?.is_applied ||
          !item?.platforms?.bayut?.products_information?.['refresh']?.is_applicable,
        iconType: 'refresh',
        platform: 'bayut',
        slug: 'refresh',
        onClick: () => {
          refObject?.applyRefresh('refresh');
        },
      };
    case 'boost_to_top':
      return {
        disabled:
          loading ||
          !!item?.platforms?.dubizzle?.products_information?.['boost-to-top']?.is_applied ||
          !item?.platforms?.dubizzle?.products_information?.['boost-to-top']?.is_applicable,
        platform: 'dubizzle',
        iconType: 'boost-to-top',
        onClick: (value) => {
          refObject?.applyBoostToTop('boost-to-top');
        },
      };
    case 'edit_listing':
      if (editable) {
        return {
          iconType: 'edit',
          icon: 'MdEdit',
          disabled: loading,
          onClick: () => {
            refObject?.showEditListingPage();
          },
        };
      } else {
        return null;
      }
    case 'listing_detail':
      if (previewAble) {
        return {
          iconType: 'preview-on-bayut',
          disabled: loading || !item?.platforms?.bayut?.url,
          href: item?.platforms?.bayut?.url,
          platform: 'bayut',
        };
      } else {
        return null;
      }
    case 'listing_detail_dubizzle':
      if (previewAble) {
        return {
          iconType: 'preview-on-dubizzle',
          disabled: loading || !item?.platforms?.dubizzle?.url,
          href: item?.platforms?.dubizzle?.url,
          platform: 'dubizzle',
        };
      } else {
        return null;
      }
    case 'listing_detail_drawer':
      if (previewAble) {
        return {
          disabled: loading,
          iconType: 'detail-drawer',
          onClick: () => {
            refObject?.showListingDetail();
          },
        };
      } else {
        return null;
      }
    case 'delete_listing':
      if (deletable) {
        return {
          iconType: 'delete',
          disabled: loading,
          platform: 'bayut',
          onClick: () => {
            refObject?.showDeleteListingModal();
          },
        };
      } else {
        return null;
      }
    case 'delete_listing_dubizzle':
      if (deletable) {
        return {
          iconType: 'delete',
          disabled: loading,
          platform: 'dubizzle',
          onClick: () => {
            refObject?.showDeleteListingDubizzleModal();
          },
        };
      } else {
        return null;
      }
    default:
      break;
  }
};

export const getListingRowActions = (item, refObject, loading, user) => {
  const listingRowActions = getListingRowActionsConfig(user);
  const uniqueActions = new Set();
  const filteredActions = user?.platforms?.flatMap((platform) =>
    listingRowActions?.[platform.slug]
      ?.filter((action) => {
        const isValid = showRowActions(item?.platforms?.[platform?.slug]?.disposition?.slug, action);
        if (isValid && !uniqueActions.has(action)) {
          uniqueActions.add(action);
          return true;
        }
        return false;
      })
      .map((action) => getRowActionList(item, action, refObject, loading)),
  );

  if (!user?.isMultiPlatform) {
    return filteredActions;
  }

  const groups = [
    { key: '1', label: 'common', type: 'group', children: [] },
    {
      key: '2',
      label: 'bayut',
      logo_ar: <BayutLogoAr size="50px" style={{ height: '20px' }} />,
      logo: <BayutLogoEn size="50px" style={{ height: '20px' }} />,
      type: 'group',
      children: [],
    },
    {
      key: '3',
      label: 'dubizzle',
      logo_ar: <DubizzleLogoAr size="50px" style={{ height: '20px', marginBottom: '5px' }} />,
      logo: <DubizzleLogo size="50px" style={{ height: '20px', marginBottom: '5px' }} />,
      type: 'group',
      children: [],
    },
  ];

  const ungroupedActions = [];

  filteredActions.forEach((action) => {
    const platform = action?.platform;
    if (platform) {
      const group = groups.find((g) => g.label === platform);
      if (group) {
        group.children.push(action);
      }
    } else {
      ungroupedActions.push(action);
    }
  });

  const groupedActions = groups.filter((group) => group.children.length > 0);
  return [...ungroupedActions, ...groupedActions];
};

const listingTableColumnMapper = (user) => {
  return [
    {
      title: null,
      dataIndex: 'property',
      key: 'property',
      component: 'ListingPurpose',
      className: 'col-property',
    },
    ...(user?.platforms?.map((platform) => {
      return {
        title: null,
        slug: platform?.slug,
        dataIndex: `platforms`,
        key: `platforms.${platform?.slug}`,
        component: 'PlatformListing',
      };
    }) || []),
    {
      title: null,
      dataIndex: 'platforms',
      key: 'listingPlatformActions',
      component: 'PlatformListingActions',
    },
    {
      title: null,
      dataIndex: 'platforms',
      key: 'listing_actions',
      component: 'TableListingActions',
      fixed: 'right',
      width: 180,
    },
  ];
};

const getDateFieldsByStatus = (status, is_autorenewal_on) => {
  switch (status) {
    case 'active':
      return {
        'Posted on': 'posted_on',
        ...(is_autorenewal_on ? { 'Renewing on': 'renewing_on' } : { 'Expiring on': 'expiry_date' }),
      };
    case 'draft':
      return {
        'Created on': 'created_at',
        'Last updated on': 'updated_at',
      };

    case 'pending':
      return {
        'Uploaded on': 'posted_on',
        ...(is_autorenewal_on ? { 'Renewing on': null } : { 'Expiring on': null }),
      };
    case 'removed':
      return {
        'Posted on': 'posted_on',
        // 'Removed on': 'removed_at',
      };
    default:
      return {
        'Posted on': 'posted_on',
        ...(is_autorenewal_on ? { 'Renewing on': 'renewing_on' } : { 'Expiring on': 'expiry_date' }),
      };
  }
};

const getStatusBasedTagProps = (listingStatus) => {
  switch (listingStatus) {
    case 'removed':
      return {
        icon: 'BsTrash',
        iconProps: {},
        name: 'Removed',
        disable_listing: true,
      };
  }
};

const getListingIdsForOvationStats = (user, list) => {
  if(isGCCTenant) {
    return Object.fromEntries(
      user?.platforms?.map((platform) => {
        const ids = list
          ?.map((listing) =>
            listing?.platforms?.[platform?.slug]?.platform_listing_id ?? listing?.id,
          )
          .filter((id) => id !== undefined);
        return [platform?.slug, ids];
      }) || [],
    );
  }

  return Object.fromEntries(
    user?.platforms?.map((platform) => {
      const ids = list
        ?.map((listing) =>
          platform?.slug === 'dubizzle' ? listing?.platforms?.[platform?.slug]?.platform_listing_id : listing?.id,
        )
        .filter((id) => id !== undefined);
      return [platform?.slug, ids];
    }) || [],
  );
  };
const getUserIdsForOvationStats = (user, list) => {
  return Object.fromEntries(
    user?.platforms?.map((platform) => {
      const ids = new Set(
        list
          ?.map((item) => {
            const platformUser = item?.platforms?.[platform?.slug]?.user;
            if (platformUser) {
              return tenantConstants.KC_ENABLED
                ? (platformUser?.platform_mapping?.[platform?.slug]?.external_id || platformUser?.external_id)
                : platformUser?.id?.toString();
            }
          })
          .filter((id) => id !== undefined),
      );
      if (ids.size === 0) {
        const fallbackId = tenantConstants.KC_ENABLED
          ? user?.platform_mapping?.[platform?.slug]?.external_id
          : user?.id?.toString();
        if (fallbackId) ids.add(fallbackId);
      }
      return [platform?.slug, Array.from(ids)];
    }) || [],
  );
};

export default {
  getListingRowActions,
  getRowActionList,
  getListingPlatformActions,
  showRowActions,
  showPlatformAction,
  listingDispositionMapper,
  listingStatusMapper,
  listingPlatformActions,
  dispositionDependentPlatformActions,
  dispositionDependentRowActions,
  listingTableColumnMapper,
  getDateFieldsByStatus,
  getStatusBasedTagProps,
  getListingIdsForOvationStats,
  getUserIdsForOvationStats,
};
