import tenantData from '@data';
import tenantPayloads from '@payloads';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import tenantTransformers from '@transformers';

const postNewListingEndpoints = {
  getPriceCheck: {
    query: ({ price, purpose, area, propertyType, locationSelect }) => {
      const areaUnitSlug = tenantData.areaUnitList.find((e) => e.id === area.unit)?.slug;
      const payload = {
        location_id: locationSelect,
        type_id: propertyType,
        purpose_id: purpose,
        area: (area.value * tenantData.areaMapings[areaUnitSlug]['square_feet']).toFixed(0),
        price: price,
      };
      return { url: `/api/listings/price_check?${convertQueryObjToString(payload)}` };
    },
  },
  postNewListing: {
    query: ({ user, values }) => {
      const payload = tenantPayloads.getPostNewListingPayload(user, values);
      return { url: `/api/listings`, method: 'POST', body: payload };
    },
  },
  updateListing: {
    query: ({ user, listingId, values, listing }) => {
      const payload = tenantPayloads.getUpdateListingPayload(user, listingId, values, listing);
      return { url: `/api/listings/${listingId}`, method: 'PUT', body: payload };
    },
  },

  getAmenities: {
    query: (purposeId) => {
      return {
        url: `/api/amenities${purposeId ? `?purpose_id=${purposeId}` : ''}`,
      };
    },
    transformer: (response) => tenantTransformers.amenitiesDataMapper(response?.amenities),
  },

  getQualityCriteria: {
    query: () => {
      return {
        url: `/api/listings/listing_score_metrics`,
      };
    },
    transformer: (response) => {
      return response?.score_metrics;
    },
  },

  fetchCrossCityDetail: {
    query: (params) => {
      return {
        url: `/api/listings/find_cross_city?subject_id=${params?.id}&city_id=${params?.cityId}`,
      };
    },
    transformer: (response) => {
      const obj = response?.CrossCity;
      const data =
        Object.keys(obj)?.length > 0
          ? {
              assigned_cities: obj?.assigned_cities,
              olx: {
                mapped: obj?.olx?.mapped || true,
                restricted: !obj?.olx?.mapped
                  ? false
                  : !obj?.olx?.bypass && obj?.olx?.cross_city_allowed - obj?.olx?.cross_city_consumed < 1,
              },
              zameen: {
                mapped: obj?.zameen?.mapped || true,
                restricted: !obj?.zameen?.mapped
                  ? false
                  : !obj?.zameen?.bypass && obj?.zameen?.cross_city_allowed - obj?.zameen?.cross_city_consumed < 1,
              },
            }
          : undefined;

      return data;
    },
  },
};

export default postNewListingEndpoints;
