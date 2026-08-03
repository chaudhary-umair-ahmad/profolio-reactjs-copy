import { t } from 'i18next';
import { getListingActions } from '../data/products';
import tenantConstants from '@constants';

export const listingRowActions = {
  zameen: [
    'edit_listing',
    'listing_detail',
    'unhide_listing',
    'hide_listing',
    'delete_listing',
    'listing_detail_drawer',
  ],
  olx: ['edit_listing', 'listing_detail_olx', 'delete_listing'],
};

export const listingplatformActions = {
  zameen: [
    'shot_listing',
    'hot_listing',
    'refresh_listing',
    'story_ad',
    'post',
    'repost',
    'upgrade',
    'publish',
    'property_videography',
  ],
  olx: ['olx_feature', 'olx_refresh_listing', 'post', 'repost', 'upgrade'],
};

export const statusDependentPlatformActions = {
  shot_listing: 'on,pending,active,edited',
  hot_listing: 'on,pending,,active,edited',
  refresh_listing: 'on,pending,active,edited',
  property_videography: 'on,pending,active,edited',
  story_ad: 'on,pending,active,edited',
  olx_feature: 'on,pending,active',
  olx_refresh_listing: 'on,pending,active',
  post: 'not_listed,not_posted',
  repost: 'deleted,pDeleted,Deleted,hDeleted,expired,inactive',
  upgrade: 'downgraded',
  publish: 'limit',
};

export const statusDependentRowActions = {
  edit_listing: 'on,pending,limit,active,edited,hidden,Rejected,rejected',
  listing_detail: 'on,active,edited',
  delete_listing: 'on,pending,active,edited,hidden', // Zameen/OLX Delete
  hide_listing: 'on,active,edited,', // Zameen hide
  unhide_listing: 'hidden', // Zameen unhide
  disable_listing: 'active', // OLX hide
  enable_listing: 'hidden', // OLX unhide
};

export const listingStatusMapper = (status, data, platform) => {
  if (data?.platform?.[platform]?.hidden) {
    return { color: '', label: 'Hidden', slug: 'hidden' };
  } else if (data?.platform?.[platform]?.deleted) {
    return { color: 'red', label: 'Deleted', slug: status };
  }

  switch (status) {
    case 'active':
    case 'on':
      return { color: 'green', label: t('Active'), slug: status };
    case 'inactive':
      return { color: 'red', label: t('In Active'), slug: status };
    case 'not_listed':
      return { color: '', label: t('Not Posted'), slug: status };
    case 'edited':
      return { color: '', label: t('Edited'), slug: status };
    case 'expired':
      return { color: 'red', label: t('Expired'), slug: status };
    case 'archived':
    case 'Archived':
      return { color: 'red', label: t('Archived'), slug: status };
    case 'sold':
    case 'Sold':
      return { color: 'red', label: t('Sold'), slug: status };
    case 'downgraded':
    case 'Downgraded':
      return { color: 'red', label: t('Downgraded'), slug: status };
    case 'Pending':
    case 'pending':
    case 'crit_pending':
      return { color: 'warning', label: t('Pending'), slug: 'pending' };
    case 'limit':
      return { color: '', label: t('Not Published'), slug: status };
    case 'Rejected':
    case 'rejected':
    case 'soft_rejected':
      return { color: 'red', label: t('Rejected'), slug: status, comments: data?.rejection_reason };
    case 'Deleted':
    case 'deleted':
    case 'pDeleted':
    case 'hDeleted':
      return { color: 'red', label: t('Deleted'), slug: status };
    default:
      return { color: '', label: t('Not Posted'), slug: 'not_posted' };
  }
};

export const showPlatformAction = (status, slug) => {
  const index = statusDependentPlatformActions[slug].split(',').findIndex((e) => e === status);
  return index != -1;
};

export const showRowActions = (status, slug) => {
  const index = statusDependentRowActions[slug]?.split(',')?.findIndex((e) => e === status);
  return index != -1;
};

export const getListingPlatformActions = (listing, platformSlug) => {
  const actions = listingplatformActions?.[platformSlug]?.filter((e) =>
    showPlatformAction(listingStatusMapper(listing?.platform?.[platformSlug]?.status, listing, platformSlug)?.slug, e),
  );
  let listingActions = [];
  !!actions?.length > 0 &&
    actions.forEach((e) => {
      listingActions.push({
        ...getListingActions(e, listing?.platform, platformSlug),
      });
    });

  return listingActions;
};

export const getRowActionList = (slug, refObject, loading, user) => {
  switch (slug) {
    case 'edit_listing':
      return {
        iconType: 'edit',
        disabled: loading,
        onClick: () => {
          refObject?.showEditListingPage();
        },
      };
    case 'listing_detail':
      return {
        iconType: 'preview-on-zameen',
        disabled: loading,
        onClick: () => {
          refObject?.showListingOnClassified();
        },
      };
    case 'listing_detail_drawer':
      return {
        iconType: 'listing-detail-drawer',
        disabled: loading,
        onClick: () => {
          refObject?.showListingDetail();
        },
      };
    case 'listing_detail_olx':
      return {
        iconType: 'preview-on-olx',
        disabled: loading,
        onClick: () => {
          refObject?.showListingOnClassified();
        },
      };
    case 'disable_listing':
      return {
        iconType: 'disable',
        disabled: loading,
        onClick: () => {
          refObject?.showHideListingModal();
        },
      };
    case 'hide_listing':
      return {
        iconType: 'hide',
        disabled: loading,
        onClick: () => {
          refObject?.showHideListingModal();
        },
      };
    case 'enable_listing':
      return {
        iconType: 'enable',
        color: 'red',
        disabled: loading,
        onClick: () => {
          refObject?.showUnhideListingModal();
        },
      };
    case 'unhide_listing':
      return {
        iconType: 'unhide',
        color: 'red',
        disabled: loading,
        onClick: () => {
          refObject?.showUnhideListingModal();
        },
      };
    case 'delete_listing':
      return {
        slug: 'delete_listing',
        iconType: 'delete',
        disabled: loading,
        onClick: () => {
          refObject?.showDeleteListingModal();
        },
      };
    case 'change_listing_owner':
      return (
        user?.is_admin && {
          iconType: 'change-owner',
          disabled: loading,
          onClick: () => {
            refObject?.showChangeListingOwnerModal();
          },
        }
      );
    default:
      break;
  }
};

export const getListingRowActions = (item, platform, refObject, loading) => {
  const actions = listingRowActions?.[platform]
    ?.filter((e) => showRowActions(listingStatusMapper(item?.platform?.[platform]?.status, item, platform)?.slug, e))
    .map((e) => getRowActionList(e, refObject, loading));
  return actions;
};

const listingTableColumnMapper = () => {
  return [
    {
      title: 'Property',
      dataIndex: 'property',
      key: 'property',
      component: 'ListingPurpose',
      className: 'col-property col-property-xs',
      fixed: 'left',
    },
    {
      title: 'Platform',
      dataIndex: 'platforms',
      key: 'platform',
      component: 'Platform',
    },
    {
      title: 'Stats',
      dataIndex: 'platforms',
      key: 'views,clicks',
      component: 'Stats',
      showLabel: true,
    },
    // { title: 'Leads', dataIndex: 'platforms', key: 'leads', component: 'Stats' },
    {
      title: 'Posted On',
      dataIndex: 'platforms',
      key: 'posted_on',
      component: 'Date',
    },
    {
      title: 'Status',
      dataIndex: 'platforms',
      key: 'status',
      component: 'PlatformStatus',
    },
    {
      title: 'Quota',
      dataIndex: 'platforms',
      key: 'consumedQuota',
      component: 'Stats',
    },
    {
      title: 'Upgrades',
      dataIndex: 'platforms',
      key: 'platform_actions',
      component: 'PlatformListingActions',
      className: 'col-platform-actions',
    },
    {
      title: 'Listing Actions',
      dataIndex: 'platforms',
      key: 'listing_actions',
      component: 'TableListingActions',
      fixed: 'right',
      width: 250,
      className: 'col-listing-actions',
    },
  ];
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
  return Object.fromEntries(
    user?.platforms?.map((platform) => {
      const ids = list
        ?.map((listing) =>
          platform?.slug === 'olx' ? listing?.platform?.[platform?.slug]?.platform_listing_id : listing?.id,
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
                ? platformUser?.external_id
                : platformUser?.id?.toString();
            }
          })
          .filter((id) => id !== undefined),
      );
      return [platform?.slug, Array.from(ids)];
    }) || [],
  );
};

export default {
  getListingRowActions,
  getListingIdsForOvationStats,
  getRowActionList,
  getListingPlatformActions,
  showRowActions,
  showPlatformAction,
  listingStatusMapper,
  listingTableColumnMapper,
  getStatusBasedTagProps,
  getUserIdsForOvationStats,
  statusDependentRowActions,
  statusDependentPlatformActions,
  listingplatformActions,
  listingRowActions,
};
