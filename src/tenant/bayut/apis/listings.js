import tenantConstants from '@constants';
import tenantTransformers from '@transformers';
import tenantPayloads from '@payloads';
import tenantUtils from '@utils';
import { getEndPointArgs } from '../../../hooks/useRtkCacheUpdate';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import { resolveCreditsRequired } from '../../../utility/utility';
import listingsApis from '../../../apis/listings';
import store from '@store';
import { formatListingDetailResponse } from '../../common/transformers/drawerListingDetail';


const resolveIsListingPosted = (listing) => {
  if (!listing) return undefined;
  if (listing.is_posted != null) return listing.is_posted;
  const rows = listing.platform_listings;
  if (!Array.isArray(rows) || rows.length === 0) return undefined;
  const row =
    rows.find((pl) => pl?.platform?.slug === 'bayut') ??
    rows.find((pl) => pl?.platform?.slug === 'ksa') ??
    rows[0];
  return row?.is_posted;
};

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

      const memberPlatforms = user?.platforms;
      const platformsForStats =
        Array.isArray(memberPlatforms) && memberPlatforms.length > 0 ? memberPlatforms : loginUser?.platforms ?? [];

      try {
        await Promise.all(
          platformsForStats.map(async (platform) => {
            const platformUserIds = userIds?.[platform?.slug];
            const platformListingIds = listingIds?.[platform?.slug];
            if (!platformUserIds?.length || !platformListingIds?.length) return;

            const payload = tenantPayloads.getListingStatsPayload({
              listingIDs: platformListingIds,
              userIDs: platformUserIds,
            });
            const result = await baseQuery(`/api/surge/ovation/stats?${payload}`);
            const listingQueryArgs = getEndPointArgs('getMyListings', getState().parentApi);
            const { data } = result;

            dispatch(
              listingsApis.util.updateQueryData('getMyListings', listingQueryArgs, (draftListings) => {
                draftListings.list?.forEach((listing) => {
                  const findListing = data?.stats?.items?.find((it) => it?.ad_external_id == listing?.id);

                  const platformListing = listing?.platforms?.data[0];

                  if (platformListing) {
                    if (listing.platforms?.data) {
                      listing.platforms.data[0] = {
                        ...platformListing,
                        ...tenantTransformers.updateListingStats(findListing),
                      };
                    }
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
    query: (purposeId) => `/api/surge/reasons?q[listing_category_id_eq]=${purposeId}&q[reason_type_eq]=deletion`,
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
            draftListings?.list?.forEach((e, i) => {
              if (e?.id == listingId) {
                const stats = {
                  views: e?.platforms?.data[0]?.views,
                  clicks: e?.platforms?.data[0]?.clicks,
                  leads: e?.platforms?.data[0]?.leads,
                };
                draftListings.list[i] = {
                  ...draftListings?.list?.[i],
                  ...tenantTransformers.listingMapper(data?.listing, user, false, stats),
                };
              }
            });
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
      url: `/api/surge/products/applicable_products?${convertQueryObjToString(body?.requestParams)}`,
      transformer: (res, meta, { productSlug, upSell, platforms, dataMapper, listingDetailResponse }) => {
        // Normalize new API response to match old structure
        const normalizeProduct = (p) => ({
          ...p,
          product_id: p.id,
          product_title: p.title,
          product_title_l1: p.title_l1,
          product_usage_type: p.usage_type,
          credits_required: (() => {
            const src = p.required_quantity ?? p.credits_required;
            if (src != null && typeof src === 'object' && !Array.isArray(src)) return src;
            return resolveCreditsRequired(src, p.default_expiry_days, p.default_expiry_days);
          })(),
          product_price: (() => {
            const src = p.price ?? p.product_price;
            if (src != null && typeof src === 'object' && !Array.isArray(src)) return src;
            return resolveCreditsRequired(src, p.default_expiry_days, p.default_expiry_days);
          })(),
        });

        const normalizePlatform = (platformData) => ({
          ...platformData,
          products: (platformData?.products || []).map(normalizeProduct),
          available_credits: platformData?.credits?.available,
        });

        if (upSell && res) {
          const normalized = {};
          Object.keys(res || {}).forEach((key) => {
            if (key !== 'success' && res[key]?.products) {
              normalized[key] = normalizePlatform(res[key]);
            }
          });
          return {
            ...normalized,
            data: tenantTransformers.mapPlatformData(normalized, platforms, listingDetailResponse),
          };
        }

        const platformData = res?.bayut; //deafult is bayut platform
        const normalized = normalizePlatform(platformData);

        return {
          ...normalized,
          applicableProduct: tenantTransformers.getProductDetailToBeApplied(normalized?.products, productSlug),
          products: tenantTransformers.getProductDetails(normalized?.products),
        };
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
        isListingPosted:
          resolveIsListingPosted(listing) ??
          resolveIsListingPosted(rawListingResponse?.listing),
        listingExpiryDays: listing?.expiry_days ?? rawListingResponse?.listing?.expiry_days,
      };

      const applicableRaw = results?.[1]?.value?.data;
      const normalizedApplicable = tenantTransformers.normalizeApplicableProductsResponse?.(applicableRaw) ?? applicableRaw;
      const bayutData = normalizedApplicable?.bayut;

      return {
        data: {
          ksa: bayutData ? tenantTransformers.upsellDataMapper(bayutData, listingDetails) : null,
        },
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
                    const stats = {
                      views: e?.platforms?.data[0]?.views,
                      clicks: e?.platforms?.data[0]?.clicks,
                      leads: e?.platforms?.data[0]?.leads,
                    };
                    draftListings.list[i] = {
                      ...draftListings?.list?.[i],
                      ...tenantTransformers.listingMapper(data?.listing, user, false, stats),
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
                  const stats = {
                    views: e?.platforms?.data[0]?.views,
                    clicks: e?.platforms?.data[0]?.clicks,
                    leads: e?.platforms?.data[0]?.leads,
                  };
                  draftListings.list[i] = {
                    ...draftListings?.list?.[i],
                    ...tenantTransformers.listingMapper(data?.listing, user, false, stats),
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

  getOffplanProjects: {
    query: () => {
      return `/api/surge/projects`;
    },
    transformer: (res) => {
      return res?.projects;
    },
  },

  getAdLicenseRequests: {
    query: (params) => {
      return `/api/surge/ad_license_requests?${params?.mappedParams || ''}`;
    },
    transformer: (res) => {
      return {
        ...res,
        list:
          res?.ad_license_requests?.map((request) => ({
            ...request,
            ad_license_info: {
              ...request,
            },
            actions: {
              jarvis_stages: request.jarvis_stages,
              id: request.id,
              purpose_id: request.purpose_id,
            },
          })) || [],
        pagination: tenantUtils.getPaginationObject(res?.pagination) || null,
      };
    },
  },
};

export default listingsApiEndpoints;
