import React, { useState } from 'react';

import { EmailContent as InboxContent } from '../../../components/inbox';

const Inbox = props => {
  const [messagesData, setMessagesData] = useState(null);

  return (
    <InboxContent messages={messagesData?.items} pagination={messagesData?.pagination} loading={true} {...props} />
  );
};

export default Inbox;
