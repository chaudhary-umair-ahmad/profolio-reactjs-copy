import surgePostListingEndpoints from '../../common/apis/surgePostListingEndpoints';
import store from '@store';
import { getAppSource } from '../../../store/parentApi';
import { convertQueryObjToString } from '../../../utility/urlQuery';

const newListingFromLicenseQuery = (params) => {
  const {
    source: paramSource,
    ad_license_number,
    advertiser_id,
    license_type,
    license_number,
    is_daily_rental,
    permit_number,
    legal_id,
  } = params || {};
  const source = paramSource ?? getAppSource(store.getState().app.AppConfig);

  if (
    ad_license_number != null &&
    ad_license_number !== '' &&
    advertiser_id != null &&
    advertiser_id !== ''
  ) {
    const query = convertQueryObjToString({
      ad_license_number,
      advertiser_id,
      license_type,
      source,
    });
    return { url: `/api/surge/listings/new?${query}`, method: 'GET' };
  }

  if (
    ad_license_number != null &&
    ad_license_number !== '' &&
    license_number != null &&
    license_number !== ''
  ) {
    const query = convertQueryObjToString({
      ad_license_number,
      license_number,
      license_type,
      source,
    });
    return { url: `/api/surge/listings/new?${query}`, method: 'GET' };
  }

  if (
    is_daily_rental &&
    permit_number != null &&
    permit_number !== '' &&
    legal_id != null &&
    legal_id !== ''
  ) {
    const query = convertQueryObjToString({
      permit_number,
      legal_id,
      is_daily_rental,
      source,
    });
    return { url: `/api/surge/listings/new?${query}`, method: 'GET' };
  }

  return null;
};

const postNewListingEndpoints = {
  ...surgePostListingEndpoints,
  postNewListing: {
    query: (params) => {
      const fromLicense = newListingFromLicenseQuery(params);
      if (fromLicense) return fromLicense;
      return surgePostListingEndpoints.postNewListing.query(params);
    },
  },
};

export default postNewListingEndpoints;
