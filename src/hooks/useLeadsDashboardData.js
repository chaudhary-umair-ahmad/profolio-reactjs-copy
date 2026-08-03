import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLmsDashboardSelectedUser } from '../store/appSlice';

export const useLeadsDashboardData = () => {
  const { user: loginUser } = useSelector((state) => state.app.loginUser);
  const { selectedUser } = useSelector((state) => state.app.LmsDashboard);

  const [filterObj, setFilterObj] = useState({});

  const dispatch = useDispatch();

  const IS_AGENCY = selectedUser?.id == -1;

  const agencyUsers = useMemo(() => {
    if (loginUser?.agency?.users?.length) {
      return [
        {
          ...loginUser,
          name: loginUser?.agency?.name,
          name_l1: loginUser?.agency?.name_l1,
          id: -1,
          profile_image: loginUser?.agency?.agency_logo,
          is_agency_admin: true,
        },
        ...loginUser?.agency?.users,
      ];
    } else return [];
  }, [loginUser?.agency]);

  useEffect(() => {
    if (!selectedUser?.id || !loginUser?.id) {
      if (!!loginUser?.is_agency_admin && !!loginUser?.agency?.platforms) {
        dispatch(
          setLmsDashboardSelectedUser({
            ...loginUser,
            name: loginUser?.agency?.name,
            name_l1: loginUser?.agency?.name_l1,
            id: -1,
            profile_image: loginUser?.agency?.agency_logo,
          }),
        );
      } else if (!loginUser?.is_agency_admin) {
        dispatch(setLmsDashboardSelectedUser({ ...loginUser, isLoading: false }));
      }
    }
  }, [loginUser?.id, loginUser?.agency?.platforms, selectedUser?.id]);

  const handleUserFilterChange = (option) => {
    dispatch(setLmsDashboardSelectedUser({ ...option }));
  };

  const onLeadsBreakdownFilterChange = (filtersObj) => {
    setFilterObj(filtersObj);
  };
  return { agencyUsers, selectedUser, IS_AGENCY, filterObj, handleUserFilterChange, onLeadsBreakdownFilterChange };
};
