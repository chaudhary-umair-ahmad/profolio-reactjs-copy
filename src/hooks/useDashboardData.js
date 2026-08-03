import tenantConstants from '@constants';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { useEffect, useMemo, useCallback, useState } from 'react';
import tenantData from '@data';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PostListingButton from '../components/post-listing-button/post-listing-button';
import { EmptyListing } from '../components/svg';
import { setDashboardSelectedUser } from '../store/appSlice';
import listingStates from '../tenant/zameen/components/listing/listings.json';
import { convertQueryObjToString, mapQueryStringToFilterObject } from '../utility/urlQuery';
import useGetLocation from './useGetLocation';
import { useGetListingsStatsQuery, useGetMyListingsQuery } from '../apis/listings';
import { useFetchContractsDetailsQuery } from '../apis/user';
import { pageViewDashboardEvent } from '../services/analyticsService';

export const useDashboardData = (platform) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useGetLocation();

  const { selectedUser: user } = useSelector((state) => state.app.Dashboard);
  const { user: loginUser } = useSelector((state) => state.app.loginUser);
  const { queryObj } = mapQueryStringToFilterObject(location.search);

  const {} = useFetchContractsDetailsQuery(undefined, { skip: user?.contracts || !tenantConstants?.CONTRACTS_ENABLED });
  const appUsers = useSelector((state) => state.app.userGroup.list);

  const {
    data: listingsTableData,
    isLoading: listingsLoading,
    isFetching: listingsFetching,
    refetch: refetchTableData,
    error: tableError,
  } = useGetMyListingsQuery(
    {
      mappedParams: convertQueryObjToString({
        ...(user?.id != -1 && { ['q[user_id_eq]']: user?.id }),
        ...(platform && { [`q[posted_on_${platform?.slug}_true]`]: true }),
      }),
      userId: user?.id,
    },
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
    },
  );
  const listingIds = tenantUtils.getListingIdsForOvationStats(user, listingsTableData?.list);
  const userIds = tenantUtils.getUserIdsForOvationStats(user, listingsTableData?.list);

  const {} = useGetListingsStatsQuery(
    {
      listingIds,
      userId: user?.id,
      userIds,
    },
    {
      skip: !listingsTableData?.list?.length || !!listingsLoading || !!listingsFetching,
      refetchOnMountOrArgChange: true,
    },
  );

  const tableColumns = useMemo(
    () => ({
      table: tenantUtils.listingTableColumnMapper(user),
    }),
    [tenantUtils, listingsTableData?.statuses_and_dispositions, queryObj, user],
  );

  const users = useMemo(() => {
    if (loginUser?.agency) {
      return [
        {
          ...loginUser,
          ...loginUser?.agency,
          name: loginUser?.agency?.name,
          name_l1: loginUser?.agency?.name_l1,
          id: -1,
          profile_image: loginUser?.agency?.agency_logo,
          is_agency_admin: true,
        },
        ...appUsers,
      ]?.map((user) => ({
        ...user,
        name: tenantUtils.getLocalisedString(user, 'name'),
        isLoggedinUser: user?.id == -1 || user?.id == loginUser?.id,
        is_agency_admin: user?.id == -1,
        isCurrencyUser: user?.is_credit_user,
      }));
    } else return [];
  }, [loginUser?.agency]);

  const handleUserFilterChange = (selectedUser) => {
    const isSelf = selectedUser?.id != null && selectedUser?.id === loginUser?.id;
    const merged = isSelf ? { ...loginUser, ...selectedUser } : { ...selectedUser };
    dispatch(
      setDashboardSelectedUser({
        ...merged,
        external_id: merged?.external_id ?? loginUser?.external_id,
        platform_mapping: merged?.platform_mapping ?? loginUser?.platform_mapping,
        is_agency_admin: selectedUser?.id == -1,
        isCurrencyUser: !!selectedUser?.is_credit_user,
      }),
    );
  };

  useEffect(() => {
    if (!user?.id || !loginUser?.id) {
      if (!!loginUser?.is_agency_admin) {
        dispatch(
          setDashboardSelectedUser({
            ...loginUser,
            ...loginUser?.agency,
            name: loginUser?.agency?.name,
            name_l1: loginUser?.agency?.name_l1,
            id: -1,
            profile_image: loginUser?.agency?.agency_logo,
            isLoading: false,
            isLoggedinUser: true,
          }),
        );
      } else if (!loginUser?.is_agency_admin) {
        dispatch(setDashboardSelectedUser({ ...loginUser, isLoading: false }));
      }
    }
  }, [loginUser?.id, loginUser?.agency?.platforms, user?.id]);

  const emptyState = useMemo(
    () => ({
      title: t(listingStates.listingStates.Active.title),
      subtitle: t(listingStates.listingStates.Active.subtitle),
      illustration: <EmptyListing color={tenantTheme['primary-light-2']} />,
      button: <PostListingButton />,
    }),
    [],
  );

  return {
    handleUserFilterChange,
    agencyUsers: users,
    emptyState,
    listingsTableData,
    listingsLoading,
    listingsFetching,
    refetchTableData,
    tableError,
    tableColumns,
  };
};
