import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

function ListingsSummary({ showTable = true, user, ...rest }) {
  const loggedInUser = useSelector((state) => state.app.loginUser.user);
  const platforms = useMemo(
    () => (user ? user?.platforms : loggedInUser?.platforms),
    [user?.platforms?.length, loggedInUser?.platforms?.length],
  );
  return (
    <div>
      {/* <ReportsListingsSection rootClassName="mb-16" user={user} /> */}
      {/* {showTable && <ListingBreakDownByDateTable user={user} platform={'ksa'} />} */}
    </div>
  );
}
export default ListingsSummary;
