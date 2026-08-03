import listingsApis from './listings';
import agencyApis from './agency';
import cartApis from './cart';
import quotaCreditsApis from './quotaCredits';
import postListingApis from './postListing';
import reportsApis from './reports';
import truBrokerApis from './truBroker';
import commonApiEndpoints from './common';
import userApiEndpoints from './user';
import packageEndpoints from './packages';
import { TENANT_KEY } from '../../../utility/env';

const Apis = Object.freeze({
  key: TENANT_KEY,
  ...userApiEndpoints,
  ...commonApiEndpoints,
  ...agencyApis,
  ...listingsApis,
  ...cartApis,
  ...quotaCreditsApis,
  ...postListingApis,
  ...reportsApis,
  ...truBrokerApis,
  ...packageEndpoints,
});

export default Apis;
