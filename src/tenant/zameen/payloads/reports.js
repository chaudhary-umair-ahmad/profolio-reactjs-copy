import { getVariousDates } from '../../../utility/date';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import { convertArrayToQueryString } from '../../../utility/utility';

export const getListingStatsPayload = ({ listingIDs = [], userIDs = [] }) => {
  let params = {
    start_date: getVariousDates(365)[0],
    end_date: getVariousDates(365)[1],
    user_ids: userIDs,
    offset: '0',
    listing_ids: listingIDs,
    group_by: ['ad_external_id'],
    limit: 10,
  };

  return `${convertQueryObjToString(params)}`;
};

export default { getListingStatsPayload };
