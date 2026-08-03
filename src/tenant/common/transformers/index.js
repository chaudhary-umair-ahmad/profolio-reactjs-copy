import agency from './agency';
import cart from './cart';
import leads from './leads';
import listings from './listings';
import quotaCredits from './quotaCredits';
import reports from './reports';
import user from './user';
import tenantTransformers from '@tenantTransformers';

// Helper function to resolve transformers
const resolveTransformer = (category, transformer) => tenantTransformers[transformer] ?? category?.[transformer];

// Group all transformer configurations
const transformerGroups = [
  { module: agency, transformers: ['agencyDataMapper', 'agencyStaffDataMapper', 'agencyStaffUserMapper', 'mapSurgeAgencyResponse'] },
  { module: cart, transformers: ['cartDataMapper'] },
  {
    module: leads,
    transformers: [
      'iconMappings',
      'tabItems',
      'productTypes',
      'graphDataMapper',
      'widgetDataMapper',
      'leadsDataMapper',
      'leadInterestsMapper',
      'tasksMapper',
      'getLeadsMapper',
      'leadDetailMapper',
      'interestDetailMapper',
      'phoneStatsMapper',
      'productStatsMapper',
      'transformResponseTimeGraphData',
    ],
  },
  {
    module: listings,
    transformers: [
      'getMyListingsData',
      'productsDataMapper',
      'mapPlatformData',
      'normalizeApplicableProductsResponse',
      'listingMapper',
      'platformMapper',
      'amenitiesDataMapper',
      'dynamicFieldsToFeaturesModalData',
      'updateListingStats',
      'getProductDetailToBeApplied',
      'getProductDetails',
      'postedToBayut',
      'upsellDataMapper',
      'getListingSummaryStats',
      'listingCardMapper',
      'listingDetailMapper',
    ],
  },
  {
    module: quotaCredits,
    transformers: [
      'creditsWidgetMapper',
      'quotaCreditsDataMapper',
      'customCreditsPriceDataMapper',
      'manageTransferQuotaCreditsTransformer',
    ],
  },
  {
    module: reports,
    transformers: [
      'reportsGraphDataMapper',
      'widgetParser',
      'listingPerformanceBreakdownTableMapper',
      'listingBreakdownByDateTableMapper',
      'listingStatsByDataTableTransformer',
    ],
  },
  {
    module: user,
    transformers: [
      'userDetailTransformer',
      'profileDataMapper',
      'settingsDetailDataMapper',
      'truBrokerLeaderboardMapper',
      'mapSurgeLanguagesListResponse',
      'mapSurgeExperienceListResponse',
    ],
  },
];

// Initialize with base tenant transformers
const Transformers = { ...tenantTransformers };

// Add transformers from each group
const addTransformers = (module, transformers) => {
  for (const transformer of transformers) {
    Transformers[transformer] = resolveTransformer(module, transformer);
  }
};

// Process all groups
for (const group of transformerGroups) {
  addTransformers(group.module, group.transformers);
}

export default Transformers;
