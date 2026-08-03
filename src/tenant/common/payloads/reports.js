import { getVariousDates } from '../../../utility/date';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import { convertArrayToQueryString } from '../../../utility/utility';

export const getListingStatsPayload = ({ listingIDs = [], userIDs = [], platformId }) => {
  let params = {
    ...(platformId && { platform_id: platformId }),
    start_date: getVariousDates(365)[0],
    end_date: getVariousDates(365)[1],
    ['group_by']: ['ad_external_id'],
  };

  return `${convertQueryObjToString(params)}&${convertArrayToQueryString([1, 2], 'category_ids')}&${convertArrayToQueryString(userIDs, 'user_external_ids')}&${convertArrayToQueryString(listingIDs, 'ad_external_ids')}`;
};

export default { getListingStatsPayload };
