import React from 'react';
import { Card, EmptyState, LicenseSkeleton, LoaderWrapper } from '../../../components/common';
import LicenseCard from '../../../components/license-card/license-card';
import AddLicenseEmptyState from '../../../components/add-license/add-license';
import { useSelector } from 'react-redux';
import { useGetUserActiveLicensesQuery } from '../../../apis/user';

const Licenses = () => {
  const loggedInUser = useSelector((state) => state.app.loginUser);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const {
    data: licenseData,
    isLoading: loading,
    isFetching: fetching,
    error,
    refetch,
  } = useGetUserActiveLicensesQuery(
    loggedInUser?.user?.agency
      ? { id: loggedInUser?.user?.agency?.id, type: 'Agency' }
      : { id: loggedInUser?.user?.id, type: 'User' },
    {
      skip: !loggedInUser?.user,
      refetchOnMountOrArgChange: true,
    },
  );

  return loading ? (
    <LicenseSkeleton />
  ) : error ? (
    <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
      <EmptyState
        message={error}
        title={''}
        type="table"
        onClick={() => refetch()}
      />
    </Card>
  ) : (
    <LoaderWrapper loading={fetching}>
      {licenseData?.licenses?.length ? (
        <LicenseCard licenseData={licenseData?.licenses} isMobile={isMobile} />
      ) : (
        <AddLicenseEmptyState />
      )}
    </LoaderWrapper>
  );
};

export default Licenses;
