import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import tenantConstants from '@constants';
import { useSelector } from 'react-redux';

const useNationalDay = () => {
  const { is_package_user } = useSelector((state) => state.app.loginUser?.user || {});
  const [isNationalDayActive, setIsNationalDayActive] = useState(false);

  useEffect(() => {
    const checkNationalDayStatus = () => {
      if (!tenantConstants.NATIONAL_DAY_MODAL_ENABLED || !is_package_user) {
        return false;
      }

      const today = dayjs();
      const startDate = tenantConstants.NATIONAL_DAY_MODAL_START_DATE;
      const endDate = tenantConstants.NATIONAL_DAY_MODAL_END_DATE;

      const start = dayjs(startDate);
      const end = dayjs(endDate);

      const isAfterOrSameStart = today.isAfter(start, 'day') || today.isSame(start, 'day');
      const isBeforeOrSameEnd = today.isBefore(end, 'day') || today.isSame(end, 'day');
      const isInRange = isAfterOrSameStart && isBeforeOrSameEnd;

      return isInRange;
    };

    setIsNationalDayActive(checkNationalDayStatus());
  }, []);

  return {
    isNationalDayActive,
    enabled: tenantConstants.NATIONAL_DAY_MODAL_ENABLED || false
  };
};

export default useNationalDay;
