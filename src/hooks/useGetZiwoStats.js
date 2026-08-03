import { useDispatch, useSelector } from 'react-redux';
import tenantApi from '@api';
import tenantConstants from '@constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
// import { setLeadsBifurcations as setDashboardBifurcations } from '../redux/dashboard/actionCreators';
// import { setLeadsBifurcations as setReportsBifurcations } from '../redux/reportsSummary/actionCreators';

const useGetZiwoStats = (platform, isDashboard, currentChildTab) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => (isDashboard ? state.app.Dashboard.selectedUser : state.app.loginUser?.user));
  const { filterObj } = useSelector(
    (state) => (isDashboard ? state.Dashboard.leadsData[platform] : state.ReportSummary.leadsData[platform]) || {},
  );

  const setBifurcationsData = useCallback(
    (platform, childTabKey, data) =>
      isDashboard
        ? setDashboardBifurcations(platform, childTabKey, data)
        : setReportsBifurcations(platform, childTabKey, data),
    [isDashboard],
  );
  useEffect(() => {
    getBifurcationsData();
  }, [currentChildTab, user, filterObj]);

  const paramsObj = useMemo(() => {
    return {
      ...filterObj,
      'agency_external_ids[]': !!(user?.id == -1) ? user?.agency?.id?.toString() : null,
      'user_external_ids[]': !!(user?.id == -1) ? null : user?.external_id?.toString(),
    };
  }, [filterObj, user]);

  const fetchPhoneStats = async () => {
    setIsLoading(true);
    const response = await tenantApi.getPhoneStats(paramsObj);
    if (response) {
      setIsLoading(false);
      if (response.error) {
        setError(response.error);
      } else {
        // dispatch(setBifurcationsData(platform, currentChildTab, response));
      }
    }
  };

  const getBifurcationsData = () => {
    if (
      currentChildTab === 'calls' &&
      user?.is_call_tracking_enabled &&
      tenantConstants.IS_LMS_ENABLED &&
      user?.is_lms_enabled
    ) {
      fetchPhoneStats();
    }
  };

  return {
    isLoading,
    error,
  };
};
export default useGetZiwoStats;
