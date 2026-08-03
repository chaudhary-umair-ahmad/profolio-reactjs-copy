import agencyApis from './agency';
import listingsApis from './listings';
import cartApis from './cart';
import reportsApis from './reports';
import quotaCreditsApis from './quotaCredits';
import leadsEndpoints from './leads';
import postNewListingEndpoints from './postListing';
import commonApiEndpoints from './common';
import userApiEndpoints from './user';
import { TENANT_KEY } from '../../../utility/env';

const Apis = Object.freeze({
  key: TENANT_KEY,
  ...userApiEndpoints,
  ...commonApiEndpoints,
  ...postNewListingEndpoints,
  ...agencyApis,
  ...listingsApis,
  ...cartApis,
  ...reportsApis,
  ...quotaCreditsApis,
  ...leadsEndpoints,
});

export default Apis;
