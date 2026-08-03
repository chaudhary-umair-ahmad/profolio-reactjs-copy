import React from 'react';
import { useGetParams } from '../../../hooks';
import TenantComponents from '@components';

const Inbox = (props) => {
  const params = useGetParams();
  const InboxPage = TenantComponents.InboxPage;
  return <InboxPage match={params} />;
};
export default Inbox;
