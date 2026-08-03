const getAddInterestFilters = () => [
  {
    key: 'product_id',
    queryParamKey: 'q[listing_id_eq]',
    label: 'Listing ID',
    labelProps: { muted: true },
    placeholder: 'Enter Listing ID',
    type: 'input',
  },
];
export default getAddInterestFilters;
