import tenantConstants from '@constants';
import store from '@store';
import tenantData from '@data';
import i18n, { t } from 'i18next';
import { TrucheckSubIcon } from '../../../components/utilities/icons';
import { actionButtonListingsClickEvent, applyDiscountEvent } from '../../../services/analyticsService';
import { setOpenDiscountListingsSession } from './openDiscountListingsSession';

export const listingRowActions = {
  ksa: [
    'trucheck',
    'listing_detail',
    'listing_detail_drawer',
    'edit_listing',
    'sell_rent_listing',
    'booking',
    'delete_listing',
  ],
};

const isFalOtpVerificationEnabled = tenantConstants?.ENABLE_FAL_LICENSE_OTP_VERIFICATION;

export const listingplatformActions = (user) => {
  return user?.isCurrencyUser
    ? {
        ksa: [
          'signature-listing',
          'hot-listing',
          'refresh',
          'publish',
          'photography-service',
          'videography-service',
          'drone-footage-service',
        ],
      }
    : {
        ksa: ['hot-listing', 'publish'],
      };
};

export const dispositionDependentPlatformActions = {
  ['signature-listing']: 'live',
  ['hot-listing']: 'live',
  ['refresh']: 'live',
  ['photography-service']: 'live',
  ['videography-service']: 'live',
  ['drone-footage-service']: 'live',
  publish:
    'not-posted,deleted,expired,sold,service-suspended,completed,payment-failed,insufficient-credits,info-completed,fal-license-expired,contract-expired ,pending-nafaz-verification,pending-otp-verification',
};

export const dispositionDependentRowActions = {
  edit_listing:
    'not-posted,payment-failed,draft,live,rejected,expired,invalid-license,service-suspended,completed,insufficient-credits,info-completed,deleted,fal-license-expired,sold,contract-expired,pending-nafaz-verification',
  listing_detail: 'live',
  listing_detail_drawer:
    'live,ad-in-review,changes-in-review,payment-pending,ready-for-moderation,pending-nafaz-verification,deleted,rejected,sold,expired,deleted-by-ops,fal-license-expired,ad-license-expired,contract-expired,unauthorized-fal-license',
  delete_listing:
    'live,not-posted,payment-failed,rega-expired,invalid-license,service-suspended,completed,insufficient-credits,info-completed,pending-nafaz-verification,pending-otp-verification',
  ...(tenantConstants?.TRU_CHECK_ENABLED ? { trucheck: 'live' } : {}),
  sell_rent_listing:
    'not-posted,payment-failed,draft,live,rejected,expired,invalid-license,service-suspended,completed,insufficient-credits,info-completed,deleted,fal-license-expired,sold,contract-expired,pending-nafaz-verification',
  booking: 'live',
};

export const listingStatusMapper = (status) => {
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
      return { color: '', label: t('Not Posted'), slug: 'not_posted' };
  }
};

export const listingDispositionMapper = (disposition, data) => {
  switch (disposition?.slug) {
    case 'live':
      return { ...disposition, label: t(disposition?.name), color: 'green' };
    case 'not-posted':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'ad-in-review':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'changes-in-review':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'completed':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'payment-pending':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'ready-for-moderation':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'deleted':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'rejected':
      return { ...disposition, label: t(disposition?.name), color: 'red', comments: data?.rejection_reason };
    case 'service-suspended':
      return { ...disposition, label: t(disposition?.name), color: 'red' };
    case 'expired':
      return { ...disposition, label: t(disposition?.name), color: 'red' };
    case 'rega-expired':
      return { ...disposition, label: t(disposition?.name), color: 'red' };
    case 'invalid-license':
      return { ...disposition, label: t(disposition?.name), color: 'red' };
    case 'sold':
      return { ...disposition, label: t(disposition?.name), color: 'red' };
    case 'deleted-by-ops':
      return { ...disposition, label: t(disposition?.name), color: 'red' };
    case 'pending-nafaz-verification':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'pending-otp-verification':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'insufficient-credits':
      return { ...disposition, label: t(disposition?.name), color: '' };
    case 'info-completed':
      return { ...disposition, label: t(disposition?.name), color: '' };
    default:
      return { ...disposition, label: t(disposition?.name), color: '' };
  }
};

export const showPlatformAction = (status, slug) => {
  const index = dispositionDependentPlatformActions[slug].split(',').findIndex((e) => e === status);
  return index != -1;
};

export const showRowActions = (status, slug) => {
  const index = dispositionDependentRowActions[slug]?.split(',')?.findIndex((e) => e === status);
  return index != -1;
};

export const getListingPlatformActions = (listing, platformSlug, user) => {
  const actions = listingplatformActions(user)?.[platformSlug]?.filter((e) =>
    showPlatformAction(listingDispositionMapper(listing?.disposition)?.slug, e),
  );
  let listingActions = [];
  !!actions?.length > 0 &&
    actions.forEach((e) => {
      if (
        isFalOtpVerificationEnabled &&
        e === 'publish' &&
        listing?.disposition?.slug === 'pending-otp-verification' &&
        listing?.otp_attempts >= 3
      ) {
        return;
      }
      listingActions.push({
        ...tenantData.getListingActions(e, listing?.platforms?.[platformSlug], platformSlug),
      });
    });

  return listingActions;
};
const getTrucheckTooltip = (slug) => {
  switch (slug) {
    case 'active':
      return t('TruCheck Active');
    case 'rejected':
      return t('TruCheck Rejected');
    case 'expired':
      return t('TruCheck Expired');
    case 'pending':
      return t('TruCheck Pending');
    case 'eligible':
      return t('TruCheck Eligible');
    case 'deleted':
      return t('TruCheck Deleted');
    default:
      return t('TruCheck Eligible');
  }
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
  const { user } = store.getState().app.loginUser;
  const query = new URLSearchParams(location.search);
  const statusId = query.get('q[status_id_eq]');
  switch (slug) {
    case 'trucheck': {
      return {
        iconType: 'trucheck',
        slug: 'trucheck',
        disabled: loading,
        tooltipLabel: getTrucheckTooltip(item?.trucheck?.current_trucheck?.status?.slug),
        icon: <TrucheckSubIcon iconSlug={item?.trucheck?.current_trucheck?.status?.slug} />,
        verified: true,
        onClick: () => {
          actionButtonListingsClickEvent(user, statusId, 'trucheck');
          refObject?.trucheckModal();
        },
      };
    }
    case 'edit_listing':
      if (editable) {
        return {
          iconType: 'edit',
          disabled: loading,
          onClick: () => {
            actionButtonListingsClickEvent(user, statusId, 'edit');
            refObject?.showEditListingPage();
          },
        };
      } else {
        return null;
      }
    case 'sell_rent_listing': {
      // Discount availability is driven entirely by the backend `discount_applicable` flag — it
      // already encodes REGA/purpose/off-plan eligibility — plus the per-tenant feature flag.
      if (tenantConstants.SHOW_LISTING_DISCOUNT_TAG && item?.discount_applicable === true) {
        return {
          iconType: 'sell-rent-listing',
          disabled: loading,
          tooltipLabel: t('Apply Discount'),
          onClick: () => {
            setOpenDiscountListingsSession(item?.id);
            applyDiscountEvent(user, {
              discountApplied: item?.discount_applied,
              pageTitle: typeof document !== 'undefined' ? document.title : '',
              language: i18n.language,
            });
            refObject?.showEditListingPage();
          },
        };
      }
      return null;
    }
    case 'booking':
      if (item?.listing_purpose.slug == 'daily-rental') {
        return {
          iconType: 'booking',
          disabled: loading,
          onClick: () => {
            actionButtonListingsClickEvent(user, statusId, 'booking');
            refObject?.showBookingModal(item);
          },
        };
      } else {
        return null;
      }
    case 'listing_detail':
      if (previewAble) {
        return {
          iconType: 'preview-on-bayut',
          disabled: loading,
          onClick: () => {
            actionButtonListingsClickEvent(user, statusId, 'view_on_bayut');
            refObject?.showListingOnClassified();
          },
        };
      } else {
        return null;
      }

    case 'listing_detail_drawer':
      if (previewAble) {
        return {
          iconType: 'detail-drawer',
          disabled: loading,
          onClick: () => {
            actionButtonListingsClickEvent(user, statusId, 'preview');
            refObject?.showListingDetail();
          },
        };
      } else {
        return null;
      }

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
      if (deletable) {
        if (
          isFalOtpVerificationEnabled &&
          item?.disposition?.slug === 'pending-otp-verification' &&
          item?.otp_attempts >= 3
        ) {
          return null;
        }
        return {
          slug: 'delete_listing',
          iconType: 'delete',
          disabled: loading,
          onClick: () => {
            actionButtonListingsClickEvent(user, statusId, 'delete');
            refObject?.showDeleteListingModal();
          },
        };
      } else {
        return null;
      }
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
    ?.filter((e) => showRowActions(listingDispositionMapper(item?.disposition, item, platform)?.slug, e))
    .map((e) => getRowActionList(item, e, refObject, loading));
  return actions;
};

const adLicenseTableColumnMapper = () => {
  return [
    {
      title: 'Property Listing',
      dataIndex: 'ad_license_info',
      key: 'ad_license_info',
      component: 'AdLicenseListing',
      className: 'col-property',
    },
    {
      title: 'Property Deed Number',
      dataIndex: 'deed_number',
      key: 'deed_number',
      component: 'String',
    },
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'request_id',
      component: 'String',
    },
    {
      title: 'Status',
      dataIndex: 'ad_license_info',
      key: 'status',
      component: 'AdLicenseStatus',
    },
    {
      title: 'Requested On',
      dataIndex: 'ad_license_info',
      key: 'requested_on',
      component: 'AdLicenseRequestedOn',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      component: 'AdLicenseActions',
      fixed: 'right',
      width: 120,
      className: 'col-actions',
    },
  ];
};

const listingTableColumnMapper = (user, disposition = '', refetchListings) => {
  switch (disposition) {
    case 'active':
      return [
        {
          title: 'Property',
          dataIndex: 'property',
          key: 'property',
          component: 'ListingPurpose',
          className: 'col-property',
        },
        ...(user?.isCurrencyUser
          ? [
              {
                title: 'Timeline',
                dataIndex: 'platforms',
                key: 'auto_renewable_item',
                component: 'ExpiryRenewal',
              },
            ]
          : []),
        { title: 'Performance', dataIndex: 'platforms', key: 'stats', component: 'ListingStats' },
        {
          title: 'Status',
          dataIndex: 'platforms',
          key: 'disposition',
          component: 'PlatformStatus',
        },
        {
          title: 'Upgrades',
          dataIndex: 'platforms',
          key: 'platform_actions',
          component: 'PlatformListingActions',
          className: 'col-platform-actions',
        },
        {
          title: 'Actions',
          dataIndex: 'platforms',
          key: 'listing_actions',
          component: 'TableListingActions',
          fixed: 'right',
          width: 180,
          className: 'col-listing-actions',
        },
      ];
    case 'draft':
      return [
        {
          title: 'Property',
          dataIndex: 'property',
          key: 'property',
          component: 'ListingPurpose',
          className: 'col-property',
        },
        ...(user?.isCurrencyUser
          ? [
              {
                title: 'Timeline',
                dataIndex: 'platforms',
                key: 'auto_renewable_item',
                component: 'ExpiryRenewal',
              },
            ]
          : []),
        {
          title: 'Status',
          dataIndex: 'platforms',
          key: 'disposition',
          component: 'PlatformStatus',
        },
        {
          title: 'Publish',
          dataIndex: 'platforms',
          key: 'platform_actions',
          component: 'PlatformListingActions',
          className: 'col-platform-actions',
          refetchListings,
        },
        {
          title: 'Actions',
          dataIndex: 'platforms',
          key: 'listing_actions',
          component: 'TableListingActions',
          fixed: 'right',
          width: 180,
          className: 'col-listing-actions',
        },
      ];
    case 'pending':
      return [
        {
          title: 'Property',
          dataIndex: 'property',
          key: 'property',
          component: 'ListingPurpose',
          className: 'col-property',
        },
        ...(user?.isCurrencyUser
          ? [
              {
                title: 'Timeline',
                dataIndex: 'platforms',
                key: 'auto_renewable_item',
                component: 'ExpiryRenewal',
              },
            ]
          : []),
        {
          title: 'Status',
          dataIndex: 'platforms',
          key: 'disposition',
          component: 'PlatformStatus',
        },
        {
          title: 'Actions',
          dataIndex: 'platforms',
          key: 'listing_actions',
          component: 'TableListingActions',
          fixed: 'right',
          width: 180,
          className: 'col-listing-actions',
        },
      ];
    case 'removed':
      return [
        {
          title: 'Property',
          dataIndex: 'property',
          key: 'property',
          component: 'ListingPurpose',
          className: 'col-property',
        },
        ...(user?.isCurrencyUser
          ? [
              {
                title: 'Timeline',
                dataIndex: 'platforms',
                key: 'auto_renewable_item',
                component: 'ExpiryRenewal',
              },
            ]
          : []),
        { title: 'Performance', dataIndex: 'platforms', key: 'stats', component: 'ListingStats' },
        {
          title: 'Status',
          dataIndex: 'platforms',
          key: 'disposition',
          component: 'PlatformStatus',
        },
        {
          title: 'Publish',
          dataIndex: 'platforms',
          key: 'platform_actions',
          component: 'PlatformListingActions',
          className: 'col-platform-actions',
        },
        {
          title: 'Actions',
          dataIndex: 'platforms',
          key: 'listing_actions',
          component: 'TableListingActions',
          fixed: 'right',
          width: 180,
          className: 'col-listing-actions',
        },
      ];
    default:
      return [
        {
          title: 'Property',
          dataIndex: 'property',
          key: 'property',
          component: 'ListingPurpose',
          className: 'col-property',
        },
        // {
        //   title: 'Quality',
        //   dataIndex: 'health',
        //   key: 'health',
        //   component: 'Health',
        // },
        ...(user?.isCurrencyUser
          ? [
              {
                title: 'Timeline',
                dataIndex: 'platforms',
                key: 'auto_renewable_item',
                component: 'ExpiryRenewal',
              },
            ]
          : []),
        { title: 'Performance', dataIndex: 'platforms', key: 'stats', component: 'ListingStats' },

        // {
        //   title: 'Posted On',
        //   dataIndex: 'platforms',
        //   key: 'posted_on',
        //   component: 'Date',
        // },
        {
          title: 'Status',
          dataIndex: 'platforms',
          key: 'disposition',
          component: 'PlatformStatus',
        },
        {
          title: 'Upgrades',
          dataIndex: 'platforms',
          key: 'platform_actions',
          component: 'PlatformListingActions',
          className: 'col-platform-actions',
          refetchListings,
        },
        {
          title: 'Actions',
          dataIndex: 'platforms',
          key: 'listing_actions',
          component: 'TableListingActions',
          fixed: 'right',
          width: 180,
          className: 'col-listing-actions',
        },
      ];
  }
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

const getListingIdsForOvationStats = (user, list) => {
  return Object.fromEntries(
    user?.platforms?.map((platform) => {
      const ids = list?.map((listing) => listing?.id).filter((id) => id !== undefined);
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
            const platformUser = item?.posted_by?.platform_mapping?.[platform?.slug];
            if (platformUser) {
              return tenantConstants.KC_ENABLED
                ? platformUser?.external_id
                : platformUser?.external_id;
            }
          })
          .filter((id) => id !== undefined),
      );
      return [platform?.slug, Array.from(ids)];
    }) || [],
  );
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
export default {
  getListingRowActions,
  getRowActionList,
  getListingPlatformActions,
  showRowActions,
  showPlatformAction,
  listingDispositionMapper,
  listingStatusMapper,
  listingplatformActions,
  dispositionDependentPlatformActions,
  dispositionDependentRowActions,
  listingRowActions,
  listingTableColumnMapper,
  getDateFieldsByStatus,
  getStatusBasedTagProps,
  getListingIdsForOvationStats,
  adLicenseTableColumnMapper,
  getUserIdsForOvationStats,
};
