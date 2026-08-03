import React from 'react';
import { ListingContainer } from '../../../components/listing-container/ListingContainer';

function ListingPerformance({ listingPerformance, loading, error, refetch, ...rest }) {
  return (
    <ListingContainer
      listingsData={listingPerformance}
      listingApi={(params) => {
        refetch(params);
      }}
      loading={loading}
      error={error}
      onRetry={refetch}
      pageSize={listingPerformance?.pagination?.pageCount}
      showPagination
      noUrlPush={true}
      renderFiltersAsTopRight
      {...rest}
    />
  );
}

export default ListingPerformance;
