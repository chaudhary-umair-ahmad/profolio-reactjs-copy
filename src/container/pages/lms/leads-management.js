import tenantFilters from '@filters';
import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LeadListingsTable from '../../../components/leads-management/lead-listings';
import { Main } from '../../styled';
import { pageViewLeadsManagement } from '../../../services/analyticsService';
const LeadsManagement = () => {
  const { user: loginUser } = useSelector((state) => state.app.loginUser);
  const users = useSelector((state) => state.app.userGroup.list);
  const filtersList = useMemo(() => tenantFilters.getLeadsStaffFilters(users), [users]);

  useEffect(() => {
    pageViewLeadsManagement(loginUser);
  }, []);
  return (
    <Main>
      <LeadListingsTable
        enableFilters
        filtersList={filtersList}
        IS_AGENCY={!!loginUser?.is_agency_admin}
        selectedUser={loginUser}
      />
    </Main>
  );
};

export default LeadsManagement;
