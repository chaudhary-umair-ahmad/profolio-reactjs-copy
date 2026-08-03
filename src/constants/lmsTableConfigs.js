export const EMAIL_LEADS_TABLE_CONFIG = [
  {
    title: 'Property',
    component: 'ListingPurpose',
    dataIndex: 'enquiry_about',
    key: 'enquiry_about',
    width: 420,
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
    component: 'StaffDetails',
    width: 280,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    component: 'Date',
    width: 180,
  },
  {
    title: 'Message',
    dataIndex: 'emailBody',
    key: 'emailBody',
    component: 'ExpandableMessage',
  },
];

export const MAILBOX_TABLE_CONFIG = EMAIL_LEADS_TABLE_CONFIG;
