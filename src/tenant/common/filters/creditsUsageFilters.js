import tenantUtils from '@utils';
import tenantConstants from '@constants';

const getCreditsUsageFilters = (products, users, selectedPlatform) => {
  const upgradeOptions = products
    ?.filter(
      (product) =>
        product.slug !== 'credit' && (selectedPlatform ? product?.platform.id === selectedPlatform?.id : true),
    )
    .map((product) => ({
      ...product,
      id: String(product.product_id || product.id),
    }));

  return [
    {
      queryParamKey: 'q[consumed_on_id_eq]',
      key: 'id',
      label: 'Listing ID',
      labelProps: { muted: true },
      limit: 9,
      placeholder: 'Enter Listing ID',
      type: 'input',
    },
    {
      key: 'product_id',
      queryParamKey: 'q[product_id_in][]',
      label: 'Upgrades',
      labelProps: { muted: true },
      placeholder: 'Select Upgrades',
      type: 'select',
      list: upgradeOptions,
      showTag: true,
      singleValue: true,
      getOptionLabel: (e) => tenantUtils.getLocalisedString(e, 'product_title'),
    },
    ...(users.length > 1
      ? [
          {
            key: tenantConstants.VALUE_IN_ARRAY_KEY('user_id'),
            queryParamKey: 'q[user_id_eq]',
            label: 'Users',
            labelProps: { muted: true },
            placeholder: 'Select Users',
            type: 'select',
            list: users,
            showTag: true,
            singleValue: true,
            getOptionLabel: (e) => tenantUtils.getLocalisedString(e, 'name'),
            getOptionValue: (op) => op.id.toString(),
          },
        ]
      : []),
  ];
};
export default getCreditsUsageFilters;
