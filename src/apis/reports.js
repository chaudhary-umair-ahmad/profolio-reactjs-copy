import tenantData from '@data';
import rtkApis from '@rtkApis';
import parentApi from '../store/parentApi';

const reportsApis = parentApi.injectEndpoints({
  endpoints: (build) => {
    return {
      ...tenantData?.platformList.reduce((acc, platform) => {
        acc[`getListingReportsWidgetSummaryFor${platform?.slug}`] = build.query({
          queryFn: rtkApis[`getListingReportsWidgetSummaryFor${platform?.slug}`]?.queryFn,
        });
        return acc;
      }, {}),
      ...tenantData?.platformList.reduce((acc, platform) => {
        acc[`getListingReportsGraphFor${platform?.slug}`] = build.query({
          queryFn: rtkApis[`getListingReportsGraphFor${platform?.slug}`]?.queryFn,
        });
        return acc;
      }, {}),
      ...tenantData?.platformList.reduce((acc, platform) => {
        acc[`getListingStatsTableDataByDateFor${platform?.slug}`] = build.query({
          queryFn: rtkApis[`getListingStatsTableDataByDateFor${platform?.slug}`]?.queryFn,
        });
        acc[`getListingsBreakdownWidgetDataFor${platform?.slug}`] = build.query({
          queryFn: rtkApis[`getListingsBreakdownWidgetDataFor${platform?.slug}`]?.queryFn,
        });
        return acc;
      }, {}),
      getListingStatsBreakdownTableData: build.query({
        queryFn: rtkApis['getListingStatsBreakdownTableData']?.queryFn,
      }),
      getListingBreakdownTableDataByDate: build.query({
        queryFn: rtkApis[`getListingBreakdownTableDataByDate`]?.queryFn,
      }),
    };
  },
});

export const {} = reportsApis;

export default reportsApis;
