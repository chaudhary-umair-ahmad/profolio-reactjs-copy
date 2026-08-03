import tenantTheme from '@theme';
import { useSelector } from 'react-redux';
import { EmptyState, LoaderWrapper } from '../../../../components/common';
import { ListingContainer } from '../../../../components/listing-container/ListingContainer';
import { NetworkError } from '../../../../components/svg';
import parentApi from '../../../../store/parentApi';
import CardListingByDate from './CardListingByDate';
import { useGetLocation } from '../../../../hooks';
import { mapQueryStringToFilterObject } from '../../../../utility/urlQuery';

const getReportsDateTypeData = (item) => {
  return [
    {
      title: 'Basic',
      value: item?.basic?.value,
      icon: 'IconBasic',
      iconProps: {
        color: tenantTheme['color-basic'],
        hasBackground: true,
        iconContainerSize: '24px',
        size: '1.1em',
      },
    },
    {
      title: 'Hot',
      value: item?.hot?.value,
      icon: 'IconSuperHot',
      iconProps: {
        color: tenantTheme['color-hot'],
        hasBackground: true,
        iconContainerSize: '24px',
        size: '1em',
      },
    },
    {
      title: 'Signature',
      value: item?.signature?.value,
      icon: 'BsFillLightningChargeFill',
      iconProps: {
        color: tenantTheme['color-signature'],
        hasBackground: true,
        iconContainerSize: '24px',
        size: '.9em',
      },
    },
    {
      title: 'Refresh',
      value: item?.refresh?.value,
      icon: 'MdRefresh',
      iconProps: {
        color: tenantTheme['color-for-rent'],
        hasBackground: true,
        iconContainerSize: '24px',
        size: '1.1em',
      },
    },
    {
      title: 'Photography',
      value: item?.photography?.value,
      icon: 'HiCamera',
      iconProps: {
        color: tenantTheme['color-for-sale'],
        hasBackground: true,
        iconContainerSize: '24px',
        size: '1.1em',
      },
    },
    {
      title: 'Videography',
      value: item?.videography?.value,
      icon: 'HiVideoCamera',
      iconProps: {
        color: tenantTheme['color-clicks'],
        hasBackground: true,
        iconContainerSize: '24px',
        size: '1.1em',
      },
    },
  ];
};

const getServiceTypesDateData = (item) => {
  return [
    {
      value: item?.refresh?.value,
      icon: 'MdRefresh',
      iconProps: {
        color: tenantTheme['color-for-rent'],
        hasBackground: true,
        iconContainerSize: '24px',
      },
    },
    {
      value: item?.photography?.value,
      icon: 'HiCamera',
      iconProps: {
        color: tenantTheme['color-for-sale'],
        hasBackground: true,
        iconContainerSize: '24px',
        size: '1em',
      },
    },
    {
      value: item?.videography?.value,
      icon: 'HiVideoCamera',
      iconProps: {
        color: tenantTheme['color-clicks'],
        hasBackground: true,
        iconContainerSize: '24px',
        size: '1em',
      },
    },
  ];
};

const ListingByDateTable = ({ user, platform }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const loggedInUser = useSelector((state) => state.app.loginUser.user);
  const hookNameForListingHistory = `useGetListingBreakdownTableDataByDateQuery`;
  const useHookForHistory = parentApi[hookNameForListingHistory];
  const location = useGetLocation();
  const { queryObj } = mapQueryStringToFilterObject(location.search);

  const { data, isLoading, isFetching, error, refetch } = useHookForHistory(
    { user: user ? user : loggedInUser, platform: platform?.slug, page: queryObj?.page },
    { refetchOnMountOrArgChange: true },
  );

  return isMobile ? (
    <>
      {!!error ? (
        <EmptyState
          illustration={<NetworkError />}
          title="Error"
          message={error}
          onClick={refetch}
          buttonLoading={isLoading || isFetching}
        />
      ) : isLoading && isFetching ? (
        <ListingContainer
          listingsData={{}}
          skeletonLoading={true}
          loading={true}
          isMain={false}
          enableFilters={false}
        />
      ) : (
        <LoaderWrapper loading={isFetching}>
          <CardListingByDate
            getServiceTypesDateData={getServiceTypesDateData}
            getReportsDateTypeData={getReportsDateTypeData}
            tableData={data}
            disabled={isLoading && isFetching}
            setPageDate={() => {}}
          />
        </LoaderWrapper>
      )}
    </>
  ) : (
    <ListingContainer
      listingsData={data}
      listingApi={refetch}
      skeletonLoading={isFetching}
      loading={isLoading}
      error={error}
      onRetry={refetch}
      renderFiltersAsTopRight
      isMain={false}
    />
  );
};

export default ListingByDateTable;
