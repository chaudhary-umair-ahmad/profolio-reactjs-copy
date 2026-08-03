import tenantFilters from '@tenantFilters';
import getAddInterestFilters from './add-interest-fitlers';
import getCreditsUsageFilters from './creditsUsageFilters';
import getLeadsStaffFilters from './leads-staff-filters';
import getLeadsReportsFilters from './leadsReportsFilters';
import getMyListingsFilters from './listingFilters';
import getQuotaCreditsFilters from './quotaCreditsFilters';
import getAdLicenseFilters from './adLicenseFilters';
import tenantConstants from '@constants';

const getLmsFilters = () => {
  if (tenantConstants.IS_LMS_ENABLED) {
    return {
      getLeadsStaffFilters,
      getAddInterestFilters,
    };
  }
  return {};
};

let filters = {
  getCreditsUsageFilters,
  getLeadsReportsFilters,
  getMyListingsFilters,
  getQuotaCreditsFilters,
  getAdLicenseFilters,
  ...getLmsFilters(),
  ...tenantFilters,
};
export default filters;
