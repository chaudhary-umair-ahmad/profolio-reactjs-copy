import tenantConstants from '@constants';
import tenantData from '@data';
import store from '@store';
import tenantTransformers from '@transformers';
import tenantUtils from '@utils';
import listingsApis from '../../../apis/listings';
import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import { getEndPointArgs } from '../../../hooks/useRtkCacheUpdate';
import tenantPayloads from '@payloads';

export const postedToZameen = (e) => {
  switch (e) {
    case 'not_listed':
      return false;
    case undefined:
      return false;
    case 'limit':
      return false;
    default:
      return true;
  }
};
export const postedToOLX = (e) => {
  switch (e) {
    case 'not_listed':
      return false;
    case undefined:
      return false;
    default:
      return true;
  }
};

const olxMapper = (e, statsExists = false) => {
  return {
    id: e?.platform?.olx?.platform_listing_id,
    property_id: e?.id,
    slug: 'olx',
    posted: !!e?.platform?.olx?.status ? postedToOLX(e?.platform?.olx?.status) : false,
    consumedQuota: e?.platform?.olx?.consumed_quota,
    status: tenantUtils.listingStatusMapper(e?.platform?.olx?.status, e, 'olx'),
    statusKey: 'status',
    ...(e.listing_purpose && { purpose: e.listing_purpose.title }),
    price: { value: e.price ? e?.price : e?.rental_price, currency: e?.currency },
    location: e.location,
    posted_on: !!e?.platform?.olx && e?.platform?.olx?.posted_at,
    updated_at: !!e?.platform?.olx && e?.platform?.olx?.date_updated,
    hidden: e?.platform?.olx?.hidden,
    ...(!statsExists && { views: 'loading' }),
    category: e?.platform?.olx?.mark?.title,
    public_url: e?.platform?.olx?.public_url,
    icon: 'IconOLX',
    listingPlatformActions: tenantUtils.getListingPlatformActions(e, 'olx'),
    listingRowActions: (refsObject, loading) => {
      const actions = tenantUtils.getListingRowActions(e, 'olx', refsObject, loading);
      return actions;
    },
    ...(!!e?.user && { listingOwner: e?.user }),
  };
};
const zameenMapper = (e, statsExists = false) => {
  return {
    id: e.id,
    property_id: e?.id,
    slug: 'zameen',
    posted_on: e?.platform?.zameen?.posted_at,
    consumedQuota: e?.consumed_quota,
    expiry_date: e?.expiry_date,
    updated_at: e?.updated_at,
    status: tenantUtils.listingStatusMapper(e?.platform?.zameen?.status, e, 'zameen'),
    statusKey: 'status',
    ...(e.listing_purpose && { purpose: e.listing_purpose.title }),
    price: { value: e?.price ? e?.price : e?.rental_price, currency: e?.currency },
    location: e.location,
    hidden: e?.platform?.zameen?.hidden,
    ...(!statsExists && {
      views: e?.listing_stats?.imp_total,
      leads:
        e?.listing_stats?.phone_total +
        e?.listing_stats?.email_total +
        e?.listing_stats?.whatsapp_total +
        e?.listing_stats?.sms_total,
      clicks: e?.listing_stats?.views_count,
    }),
    posted: e?.platform?.zameen?.status ? postedToZameen(e?.platform?.zameen?.status) : false,
    stories: e?.platform?.zameen?.stories,
    category: e?.platform?.zameen?.mark?.title,
    icon: 'IconZameen',
    public_url: e?.platform?.zameen?.public_url,
    listingPlatformActions: tenantUtils.getListingPlatformActions(e, 'zameen'),
    listingRowActions: (refsObject, loading) => {
      const actions = tenantUtils.getListingRowActions(e, 'zameen', refsObject, loading);
      return actions;
    },
    ...(!!e?.user && { listingOwner: e?.user }),
  };
};

export const listingHasUpgrades = (listing, user) => {
  return (
    (!!user?.platforms?.[0] && !listing?.platforms?.zameen) ||
    (!!user?.platforms?.[1] && !listing?.platforms?.olx) ||
    !!(listing?.platforms?.zameen && listing?.platforms?.zameen?.haveUpgrades) ||
    !!(listing?.platforms?.olx && listing?.platforms?.haveUpgrades)
  );
};

export const upsellListingMapper = (listing) => {
  const platforms = {};
  if (postedToZameen(listing.platform?.zameen?.status) || listing?.platform?.zameen?.status == 'limit') {
    platforms.zameen = {
      status: tenantUtils.listingStatusMapper(listing.platform?.zameen?.status),
      isFreeListing: !!(listing?.platform?.zameen?.status === 'limit'),
      haveUpgrades: !!tenantData.getListingActions('shot_listing', listing.platform, 'zameen')?.canApply,
      products: [
        {
          ...tenantData.getListingActions('shot_listing', listing.platform, 'zameen'),
          upgradeTitle: 'Make Listing Super Hot Listing',
          name: 'Super Hot Listing',
        },
        {
          ...tenantData.getListingActions('hot_listing', listing.platform, 'zameen'),
          upgradeTitle: 'Make Listing Hot Listing',
          name: 'Hot Listing',
        },
      ],
      description: 'Better reach on the platform',
    };
  }
  if (postedToOLX(listing?.platform?.olx?.status)) {
    platforms.olx = {
      ...listing.platform.olx,
      status: tenantUtils.listingStatusMapper(listing.platform.olx.status),
      haveUpgrades: !!tenantData.getListingActions('olx_feature', listing.platform, 'olx')?.canApply,
      description: 'Better reach on the platform',
      isFreeListing: false,
      products: [
        {
          ...tenantData.getListingActions('olx_feature', listing.platform, 'olx'),
          upgradeTitle: 'Make Listing Feature',
          name: 'Feature',
        },
      ],
    };
  }
  return platforms;
};

const listingsApiEndpoints = {
  getTruCheckStatuses: () => {
    return {
      url: `/api/statuses?search_class=trucheck`,
    };
  },

  fetchPlotsByQuery: {
    query: ({ parentId, query }) => {
      return {
        url: `https://www.zameen.com/api/plotFinder/parcel/?all=1&externalID=${parentId}${query ? `&query=${query}` : ''}`,
      };
    },
    transformer: (response) => {
      return {
        data: response,
      };
    },
  },

  deleteStory: {
    query: ({ storyId }) => {
      return {
        url: `/api/stories/${storyId}`,
        method: 'DELETE',
      };
    },
    transformer: (response, meta, { listingId }) => {
      if (!!response?.data?.listing) {
        return {
          data: {
            ...zameenMapper(response?.data?.listing, true),
            listing_id: listingId,
            replaceKey: 'platforms.data[0]',
            valueExists: true,
          },
        };
      } else {
        return {
          dontUpdate: true,
          message: 'Story will be Removed Successfully!!',
        };
      }
    },
  },

  getAppliedAutoPlan: {
    query: ({ userId }) => {
      return {
        url: `/api/credit_utilisation_plans/active_plan?user_id=${userId}`,
      };
    },
  },

  applyUtilizationPlan: {
    query: (data) => {
      return {
        url: `/api/credit_utilisation_plans`,
        method: 'POST',
        body: data,
      };
    },
  },

  stopAutoPlan: {
    query: (planId) => {
      return {
        url: `/api/credit_utilisation_plans/${planId}`,
        method: 'DELETE',
      };
    },
    transformer: (response) => {
      return {
        data: {
          ...response?.data?.data,
        },
      };
    },
  },

  fetchListingDetail: {
    query: ({ userId, listingId }) => {
      return {
        url: `/api/listings/${listingId}`,
      };
    },
    transformer: (response) => {
      const active_images = response?.listing?.images;
      const listingImages = active_images.map((e) => ({
        ...e,
        ...imageStateObject('select'),
      }));
      return { active_images: listingImages };
    },
  },

  getMyListings: () => {
    return {
      url: `/api/statuses?search_class=trucheck`,
    };
  },
  getListingsStats: {
    queryFn: async ({ listingIds, userIds, userId }, { getState, dispatch }, extraOptions, baseQuery) => {
      const loginUser = store.getState().app.loginUser?.user;
      const isAgency = loginUser?.agency?.id;
      let user = {};
      if (isAgency) {
        user = loginUser?.agency?.users?.find((e) => e?.id == userId);
      } else {
        user = loginUser;
      }
      if (!user || userId == -1) {
        user = {
          ...loginUser,
          ...loginUser?.agency,
          name: loginUser?.agency?.name,
          name_l1: loginUser?.agency?.name_l1,
          id: -1,
          profile_image: loginUser?.agency?.agency_logo,
          is_agency_admin: true,
        };
      }
      try {
        await Promise.all(
          user?.platforms.map(async (platform) => {
            const payload = tenantPayloads.getListingStatsPayload({
              listingIDs: listingIds?.[platform?.slug],
              userIDs: userIds?.[platform?.slug],
            });

            if (!tenantConstants?.PLATFORM_CONFIGS?.[platform?.slug]?.hasStatsInOwnDb) {
              const result = await baseQuery(`/api/listings/olx_stats?${payload}`);
              const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);

              const { data } = result;

              if (!!data?.stats) {
                dispatch(
                  listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
                    const parsedObj = JSON.parse(JSON.stringify(draftListings));
                    draftListings?.list?.forEach((e) => {
                      const findListing = data?.stats?.items?.length
                        ? data?.stats?.items?.find(
                            (it) =>
                              it?.ad_external_id == e?.platform?.[platform?.slug]?.platform_listing_id ||
                              it?.ad_external_id == e?.id,
                          )
                        : null;

                      e?.platforms?.data?.forEach((platformListing, i) => {
                        e.platforms.data[1] = {
                          ...e?.platforms?.data[1],
                          ...tenantTransformers.updateListingStats(findListing),
                        };
                      });
                    });
                  }),
                );
              }
            }
          }),
        );

        return { data: 'Success' };
      } catch (error) {
        console.error('Failed to fetch listing stats:', error);
        return { error: { status: 'FETCH_FAILED', error: error.message } };
      }
    },
  },

  listingDeleteReasons: {
    query: () => `/api/surge/reasons?q[reason_type_eq]=deletion`,
  },
  deleteListing: {
    query: (params) => {
      const { userId, listingId, platform, action } = params;
      if (platform === 'olx') {
        switch (action?.status) {
          case 'Deleted':
          case 'deleted':
          case 'pDeleted':
          case 'hDeleted':
            return {
              url: `/api/listings/${listingId}/post_to_olx`,
              method: 'POST',
              body: {
                user_id: userId,
              },
            };

          default:
            return {
              url: `/api/listings/${listingId}/olx_status`,
              method: 'PUT',
              body: {
                status: 'delete',
                user_id: userId,
              },
            };
        }
      } else if (platform === 'zameen') {
        switch (action?.status) {
          case 'Deleted':
          case 'deleted':
          case 'pDeleted':
          case 'hDeleted':
            return {
              url: `/api/listings/${listingId}/post_to_zameen`,
              method: 'POST',
              body: {
                user_id: userId,
              },
            };

          default:
            return {
              url: `/api/listings/${listingId}`,
              method: 'DELETE',
              body: {
                user_id: userId,
              },
            };
        }
      }
    },
    afterSuccess: async ({ listingId }, { dispatch, queryFulfilled, getState }) => {
      const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);
      const user = getState().app?.loginUser?.user;
      try {
        const { data } = await queryFulfilled;
        if (!!data?.listing) {
          dispatch(
            listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
              draftListings?.list?.forEach((e, i) => {
                if (e?.id == listingId) {
                  draftListings.list[i] = {
                    ...draftListings?.list?.[i],
                    ...tenantTransformers.listingMapper(data?.listing, user, true),
                  };
                }
              });
            }),
          );
        }
      } catch {
        console.error('Failed to delete the listing.');
      }
    },
  },
  postSavedListing: {
    query: ({ listingId, action, listingStatus, userId }) => {
      let url = '';
      let body = { user_id: userId };

      if (
        action?.slug === 'post' ||
        action?.slug === 'repost' ||
        action?.slug === 'upgrade' ||
        listingStatus === 'post_to'
      ) {
        if (action?.platform === 'zameen') {
          url = `/api/listings/${listingId}/post_to_zameen`;
        } else if (action?.platform === 'olx') {
          url = `/api/listings/${listingId}/post_to_olx`;
        }
      } else if (action?.slug === 'publish') {
        if (action?.platform === 'zameen') {
          url = `/api/listings/${listingId}/publish`;
        } else if (action?.platform === 'olx') {
          return { url: '', method: 'POST', body: null };
        }
      }

      return {
        url,
        method: 'POST',
        body,
      };
    },
    transformer: (response, meta, arg) => {
      const { listingId, action } = arg;

      if (!response || response?.error) {
        return response;
      }

      if (!response?.data?.listing) {
        return {
          ...response,
          dontUpdate: true,
          message: `Listing ${action?.slug === 'publish' ? 'published' : 'posted'} Successfully!`,
        };
      }

      const listing = response?.data?.listing;
      if (action?.platform === 'olx') {
        return {
          data: {
            ...olxMapper(listing, true),
            listing_id: listingId,
            replaceKey: 'platforms.data[1]',
            valueExists: true,
          },
        };
      } else {
        return {
          data: {
            ...zameenMapper(listing, true),
            listing_id: listingId,
            replaceKey: 'platforms.data[0]',
            valueExists: true,
          },
        };
      }
    },
    afterSuccess: async ({ listingId }, { dispatch, queryFulfilled, getState }) => {
      const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);
      const user = getState().app?.loginUser?.user;
      try {
        const { data } = await queryFulfilled;
        if (!!data?.listing) {
          dispatch(
            listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
              draftListings?.list?.forEach((e, i) => {
                if (e?.id == listingId) {
                  draftListings.list[i] = {
                    ...draftListings?.list?.[i],
                    ...tenantTransformers.listingMapper(data?.listing, user, true),
                  };
                }
              });
            }),
          );
        }
      } catch {
        console.error('Failed to upgrade listing');
      }
    },
  },

  getListingDetail: {
    query: ({ listingId, user }) => {
      return {
        url: `/api/listings/${listingId}/edit`,
      };
    },
    transformer: (response) => {
      const listing = response.listing;
      listing.images = listing.images?.sort((image1, image2) => image1.order - image2.order);
      return {
        listing: {
          ...listing,
          listingPrice: { value: listing?.price, currency: tenantConstants.CURRENCY },
          posted_by: { name: listing?.user?.name },
        },
      };
    },
  },

  getUpsellDetail: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const { listingId } = params;
      const user = store.getState().app.loginUser.user;

      const response = await baseQuery(`/api/listings/${listingId}/edit`);

      const listing = response?.data?.listing;
      listing.images = listing.images?.sort((image1, image2) => image1.order - image2.order);
      let data = {
        ...listing,
        listingOwner: listing?.user,
        platforms: tenantTransformers.upsellListingMapper(listing),
        listingHasUpgrades: tenantTransformers.listingHasUpgrades(
          tenantTransformers.upsellListingMapper(listing),
          user,
        ),
        call: { title: '0800-ZAMEEN (92633)', number: '080092633' },
      };
      return { data };
    },
  },

  getApplicableProducts: (listingId) => {
    return {
      url: `/api/surge/products/applicable_products?listing_id=${listingId}`,
      transformer: (res, meta, { productSlug }) => {
       
        const normalizeProduct = (p) => ({
          ...p,
          product_id: p.id,
          product_title: p.title,
          product_title_l1: p.title_l1,
          product_usage_type: p.usage_type,
          credits_required: p.required_quantity,
          product_price: p.price,
        });

        const normalizePlatform = (platformData) => ({
          ...platformData,
          products: (platformData?.products || []).map(normalizeProduct),
          available_credits: platformData?.credits?.available,
        });

        //bayut as default
        const platformData = res?.bayut;
        const normalized = normalizePlatform(platformData);

        return {
          ...normalized,
          applicableProduct: tenantTransformers.getProductDetailToBeApplied(normalized?.products, productSlug),
          products: tenantTransformers.getProductDetails(normalized?.products),
        };
      },
    };
  },

  applyProduct: (query) => {
    return {
      url: `/api/surge/listings/${query?.listingId}/apply_products`,
      method: 'PUT',
      body: query?.body,
      afterSuccess: async ({ listingId }, { dispatch, queryFulfilled, getState }) => {
        const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);
        const user = getState().app?.loginUser?.user;
        try {
          const { data } = await queryFulfilled;
          if (!!data?.listing) {
            dispatch(
              listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
                draftListings?.list?.forEach((e, i) => {
                  if (e?.id == listingId) {
                    draftListings.list[i] = {
                      ...draftListings?.list?.[i],
                      ...tenantTransformers.listingMapper(data?.listing, user, true),
                    };
                  }
                });
              }),
            );
          }
        } catch {
          console.error('Failed to apply upgrade.');
        }
      },
    };
  },

  hideUnhideListings: {
    query: ({ userId, listingId, platform, status }) => {
      const url =
        platform === 'olx' ? `/api/listings/${listingId}/olx_status` : `/api/listings/${listingId}/toggle_visibility`;

      const method = platform === 'olx' ? 'PUT' : 'PATCH';

      const body =
        platform === 'olx'
          ? {
              status: status === 'hidden' ? 'enable' : 'disable',
              user_id: userId,
            }
          : {
              user_id: userId,
            };

      return { url, method, body };
    },
    transformer: (response, meta, listingId, platform) => {
      if (response?.error) {
        return response;
      }

      if (!response?.data?.listing) {
        return {
          ...response,
          dontUpdate: true,
        };
      }

      const listing = response.data.listing;

      return {
        data:
          platform === 'olx'
            ? {
                ...olxMapper(listing, true),
                listing_id: listing?.id,
                replaceKey: 'platforms.data[1]',
                valueExists: true,
              }
            : {
                ...zameenMapper(listing, true),
                listing_id: listing?.id,
                replaceKey: 'platforms.data[0]',
                valueExists: true,
              },
      };
    },
    afterSuccess: async ({ listingId }, { dispatch, queryFulfilled, getState }) => {
      const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);
      const user = getState().app?.loginUser?.user;
      try {
        const { data } = await queryFulfilled;
        if (!!data?.listing) {
          dispatch(
            listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
              draftListings?.list?.forEach((e, i) => {
                if (e?.id == listingId) {
                  draftListings.list[i] = {
                    ...draftListings?.list?.[i],
                    ...tenantTransformers.listingMapper(data?.listing, user, true),
                  };
                }
              });
            }),
          );
        }
      } catch {
        console.error('Failed to hide the listing.');
      }
    },
  },
  postPackageOnListing: {
    query: (params) => {
      const { listingId, action, data = {} } = params;
      const endpoints = {
        shot_listing: {
          url: `/api/listings/${listingId}/mark_superhot`,
          body: { ...data, subject_id: data?.user_id },
          method: 'PATCH',
        },
        hot_listing: {
          url: `/api/listings/${listingId}/mark_hot`,
          body: { ...data, subject_id: data?.user_id },
          method: 'PATCH',
        },
        refresh_listing: {
          url: `/api/listings/${listingId}/refresh`,
          body: { ...data, subject_id: data?.user_id },
          method: 'PATCH',
        },
        story_ad: {
          url: `/api/stories`,
          body: { ...data },
          method: 'POST',
        },
        olx_refresh_listing: {
          url: `/api/listings/${listingId}/apply_olx_credits`,
          body: { product_type: 'olx_refresh_listing', ...data },
          method: 'POST',
        },
        olx_feature: {
          url: `/api/listings/${listingId}/apply_olx_credits`,
          body: { product_type: 'olx_feature', ...data },
          method: 'POST',
        },
        property_videography: {
          url: `/api/listings/${listingId}/verified_property_media`,
          body: { ...data, subject_id: data?.user_id },
          method: 'PATCH',
        },
      };

      return endpoints?.[action?.slug];
    },
    afterSuccess: async ({ listingId }, { dispatch, queryFulfilled, getState }) => {
      const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);
      const user = getState().app?.loginUser?.user;
      try {
        const { data } = await queryFulfilled;
        if (!!data?.listing) {
          dispatch(
            listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
              draftListings?.list?.forEach((e, i) => {
                if (e?.id == listingId) {
                  draftListings.list[i] = {
                    ...draftListings?.list?.[i],
                    ...tenantTransformers.listingMapper(data?.listing, user, true),
                  };
                }
              });
            }),
          );
        } else {
          return { message: 'Credit applied Successfully!' };
        }
      } catch {
        console.error('Failed to apply upgrade.');
      }
    },
  },
};

export default listingsApiEndpoints;
