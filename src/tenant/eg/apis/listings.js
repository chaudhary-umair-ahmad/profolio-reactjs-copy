import tenantUtils from '@utils';
import tenantTransformers from '@transformers';
import tenantPayloads from '@payloads';
import tenantData from '@data';
import store from '@store';
import { getEndPointArgs } from '../../../hooks/useRtkCacheUpdate';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import { resolveCreditsRequired } from '../../../utility/utility';
import listingsApis from '../../../apis/listings';
import { formatListingDetailResponse } from '../../common/transformers/drawerListingDetail';

const listingsApiEndpoints = {
  getTruCheckStatuses: () => {
    return {
      url: `/api/surge/statuses?search_class=trucheck`,
    };
  },

  getMyListings: () => {
    return {
      url: `/api/surge/statuses?search_class=trucheck`,
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
            const platformUserIds = userIds?.[platform?.slug];
            const platformListingIds = listingIds?.[platform?.slug];
            if (!platformUserIds?.length || !platformListingIds?.length) return;

            const payload = tenantPayloads.getListingStatsPayload({
              listingIDs: platformListingIds,
              userIDs: platformUserIds,
              platformId: platform?.id,
            });

            const result = await baseQuery(`/api/surge/ovation/stats?${payload}`);
            const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);

            const { data } = result;

            dispatch(
              listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
                draftListings.list?.forEach((listing) => {
                  const findListing = data?.stats?.items?.find((it) =>
                    (it?.ad_external_id == listing?.platforms?.[platform?.slug]?.platform_listing_id) || it?.ad_external_id == listing?.id
                  );
                  const platformListing = listing?.platforms?.[platform?.slug];
                  if (platformListing) {
                    listing.platforms[platform?.slug] = {
                      ...platformListing,
                      ...tenantTransformers.updateListingStats(findListing),
                    };
                  }
                });
              }),
            );
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
    query: (body) => {
      return {
        url: `/api/surge/listings/${body?.listingId}`,
        method: 'DELETE',
        body: body,
      };
    },
    afterSuccess: async ({ listingId }, { dispatch, queryFulfilled, getState }) => {
      const user = getState().app?.loginUser?.user;
      const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);
      try {
        const { data } = await queryFulfilled;

        dispatch(
          listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
            if (draftListings?.list) {
              draftListings.list = draftListings.list.map((listing) =>
                listing.id === listingId
                  ? tenantTransformers.listingMapper(data?.listing, user, false, listing)
                  : listing,
              );
            }
          }),
        );
      } catch {
        console.error('Failed to delete the listing.');
      }
    },
  },

  deleteListingFromDubizzle: {
    query: (body) => {
      return {
        url: `/api/surge/listings/${body?.listingId}/destroy_platform_listing`,
        method: 'POST',
        body: { platform_slug: 'dubizzle' },
      };
    },
    afterSuccess: async ({ listingId }, { dispatch, queryFulfilled, getState }) => {
      const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);
      try {
        await queryFulfilled;

        dispatch(
          listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
            if (draftListings?.list) {
              draftListings.list = draftListings.list.filter((listing) => listing.id !== listingId);
            }
          }),
        );
      } catch {
        console.error('Failed to delete the listing.');
      }
    },
  },

  fetchListingDetail: {
    query: ({ userId, listingId }) => {
      return {
        url: `/api/surge/users/${userId}/listings/${listingId}?include=active_images`,
      };
    },
    transformer: (response) => {
      const active_images = response?.data?.data?.active_images;
      const listingImages = active_images.map((e) => ({
        ...e,
        ...imageStateObject('select'),
      }));
      return { active_images: listingImages };
    },
  },

  getApplicableProducts: (body) => {
    return {
      url: `/api/surge/products/applicable_products?${body?.requestParams ? convertQueryObjToString(body?.requestParams) : ''}`,
      transformer: (res, meta, { platformProductSlugs }) => {
        const normalizeProduct = (p) => ({
          ...p,
          product_id: p.id,
          product_title: p.title,
          product_title_l1: p.title_l1,
          product_usage_type: p.usage_type,
          credits_required: resolveCreditsRequired(p.required_quantity, p.default_expiry_days),
          product_price: resolveCreditsRequired(p.price, p.default_expiry_days),
        });
        const normalizePlatform = (platformData) => ({
          ...platformData,
          products: (platformData?.products || []).map(normalizeProduct),
          available_credits: platformData?.credits?.available,
        });
        const platforms = tenantData.platformList;
        let data = {};
        platforms?.forEach((e) => {
          if (res?.[e?.slug]) {
            const normalized = normalizePlatform(res[e?.slug]);
            data[e?.slug] = {
              ...normalized,
              applicableProduct: tenantTransformers.getProductDetailToBeApplied(
                normalized,
                platformProductSlugs?.[e?.slug],
              ),
              products: tenantTransformers.getProductDetails(normalized?.products),
            };
          }
        });
        return data;
      },
    };
  },

  getUpsellDetail: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const requestParams = {
        listing_id: params?.listing_id,
        ...(params?.platformProductSlugs &&
          typeof params.platformProductSlugs === 'object' && {
            platformProductSlugs: JSON.stringify(params.platformProductSlugs),
          }),
      };
      const queryString = convertQueryObjToString(requestParams);

      const apiCalls = [
        baseQuery({ url: `/api/surge/listings/${params?.listing_id}/edit` }),
        baseQuery({ url: `/api/surge/products/applicable_products?${queryString}` }),
      ];

      const results = await Promise.allSettled(apiCalls);

      const rawListingResponse = results?.[0]?.value?.data;
      const formattedListingResponse = rawListingResponse?.listing
        ? formatListingDetailResponse(rawListingResponse)
        : rawListingResponse;
      const listing = formattedListingResponse?.listing ?? rawListingResponse?.listing;

      const listingDetails = {
        ...rawListingResponse,
        listing,
        isListingPosted: listing?.is_posted ?? rawListingResponse?.listing?.is_posted,
        listingExpiryDays: listing?.expiry_days ?? rawListingResponse?.listing?.expiry_days,
      };

      const applicableRaw = results?.[1]?.value?.data;
      const normalizedApplicable = tenantTransformers.normalizeApplicableProductsResponse?.(applicableRaw) ?? applicableRaw;

      return {
        data: tenantTransformers.upsellDataMapper(
          normalizedApplicable,
          listingDetails,
          params?.platformProductSlugs,
        ),
      };
    },
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
                    let updateListing = { ...draftListings.list[i] };
                    tenantData.platformList.forEach((platform) => {
                      if (updateListing?.platforms?.[platform?.slug]) {
                        updateListing.platforms[platform?.slug] = {
                          ...updateListing.platforms[platform?.slug],
                          ...tenantTransformers.platformMapper(data?.listing, user, platform, false),
                        };
                      }
                    });
                    (updateListing.platforms.listingRowActions = (refsObject, loading) => {
                      const actions = tenantUtils.getListingRowActions(data?.listing, refsObject, loading, user);
                      return actions;
                    }),
                      (draftListings.list[i] = updateListing);
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

  updateAutoRenew: {
    query: ({ autoRenewId, listingId, productId }) => {
      return {
        url: autoRenewId ? `/api/surge/auto_renewable_items/${autoRenewId}` : '/api/surge/auto_renewable_items',
        method: autoRenewId ? 'DELETE' : 'POST',
        body: !autoRenewId
          ? {
              auto_renewable_item: {
                auto_renewable_id: listingId,
                auto_renewable_type: 'Listing',
                product_id: productId,
              },
            }
          : {},
      };
    },
    transformer: (response, meta, { listingId, productId }) => {
      if (response) {
        if (response?.data?.auto_renewable_item) {
          return {
            ...response?.data?.auto_renewable_item,
            isApplied: !!response?.data?.auto_renewable_item?.auto_renewable_id,
            id: response?.data?.auto_renewable_item?.id,
            renewing_on: response?.data?.auto_renewable_item?.renewing_on,
            listing_id: listingId,
            replaceKey: 'platforms.auto_renewable_item',
            valueExists: true,
          };
        } else {
          return {
            isApplied: false,
            id: null,
            renewing_on: null,
            listing_id: listingId,
            replaceKey: 'platforms.auto_renewable_item',
            valueExists: true,
          };
        }
      }
    },
  },

  postPackageOnListing: {
    query: (params) => {
      const endpoints = {
        shot_listing: {
          url: `/api/surge/listings/${listingId}/mark_superhot`,
          body: { ...data, subject_id: data?.user_id },
          method: 'PATCH',
        },
        hot_listing: {
          url: `/api/surge/listings/${listingId}/mark_hot`,
          body: { ...data, subject_id: data?.user_id },
          method: 'PATCH',
        },
        refresh_listing: {
          url: `/api/surge/listings/${listingId}/refresh`,
          body: { ...data, subject_id: data?.user_id },
          method: 'PATCH',
        },
        story_ad: {
          url: `/api/surge/stories`,
          body: { ...data },
          method: 'POST',
        },
        olx_refresh_listing: {
          url: `/api/surge/listings/${listingId}/apply_olx_credits`,
          body: { product_type: 'olx_refresh_listing', ...data },
          method: 'POST',
        },
        olx_feature: {
          url: `/api/surge/listings/${listingId}/apply_olx_credits`,
          body: { product_type: 'olx_feature', ...data },
          method: 'POST',
        },
        property_videography: {
          url: `/api/surge/listings/${listingId}/verified_property_media`,
          body: { ...data, subject_id: data?.user_id },
          method: 'PATCH',
        },
      };
      const { listingId, action, data = {} } = params;

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

  getListingCardDetail: {
    query: ({ listingId }) => {
      return `/api/surge/listings/${listingId}/edit`;
    },
    transformer: (res) => {
      return tenantTransformers.listingCardMapper(res);
    },
  },
};

export default listingsApiEndpoints;
