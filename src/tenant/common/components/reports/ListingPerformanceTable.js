import { Divider, Row } from 'antd';
import { useSelector } from 'react-redux';
import { Card, EmptyState, Group, Skeleton } from '../../../../components/common';
import { NetworkError } from '../../../../components/svg';
import ListingPerformance from '../../../../container/pages/reports/listing-performance';
import parentApi from '../../../../store/parentApi';
import CardListingPerformance from './CardListingPerformance';
import { useState } from 'react';

const ListingPerformanceTable = ({ user, platform }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const loggedInUser = useSelector((state) => state.app.loginUser.user);
  const hookName = `useGetListingStatsBreakdownTableDataQuery`;
  const useHook = parentApi[hookName];
  const [page, setPage] = useState(1);

  const {
    data: listingPerformance,
    isLoading: listingPerformanceLoading,
    isFetching: listingPerformanceFetching,
    error: listingPerformanceError,
    refetch: refetchListingPerformance,
  } = useHook(
    { user: user ? user : loggedInUser, platform: platform?.slug, page: page },
    { refetchOnMountOrArgChange: true },
  );

  const refetchListingWithNewArgs = (params) => {
    setPage(params?.page);
  };

  return isMobile ? (
    <>
      {listingPerformanceLoading && listingPerformanceFetching && (
        <>
          <Group gap="8px">
            {[1, 2, 3].map((e) => (
              <Card key={e}>
                <Group template="106px 1fr" gap=".571rem">
                  <Skeleton type="image" active={false} style={{ borderRadius: 6, width: '100%', height: '100%' }} />
                  <Group template="initial" gap="4px">
                    <Skeleton type="paragraph" />
                  </Group>
                </Group>
                <Divider style={{ marginBlock: 8 }} />
                <Row align="middle" justify="space-between">
                  <div>
                    <Skeleton style={{ height: 14 }} />
                    <div>
                      <Skeleton style={{ width: 106, height: 20 }} />
                    </div>
                  </div>
                  <Group template="repeat(5, 1fr)" gap="4px">
                    {[1, 2, 3, 4, 5].map((e) => {
                      return <Skeleton key={e} type="avatar" active={false} />;
                    })}
                  </Group>
                </Row>
              </Card>
            ))}
          </Group>
        </>
      )}
      {!!listingPerformanceError && (
        <EmptyState
          illustration={<NetworkError />}
          title="Error"
          message={listingPerformanceError}
          onClick={() => {
            onRetry();
          }}
          buttonLoading={listingPerformanceLoading || listingPerformanceFetching}
        />
      )}
      {
        <CardListingPerformance
          tableData={listingPerformance}
          disabled={!!listingPerformanceLoading || !!listingPerformanceFetching}
          setPage={() => {}}
        />
      }
    </>
  ) : (
    <ListingPerformance
      isMain={false}
      listingPerformance={listingPerformance}
      loading={listingPerformanceLoading || listingPerformanceFetching}
      error={listingPerformanceError}
      refetch={refetchListingWithNewArgs}
    />
  );
};

export default ListingPerformanceTable;
