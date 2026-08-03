import { phoneValidationYup } from '../../../helpers';
import tenantConstants from '@constants';

export const inviteToAgencyFormFields = () => {
  return {
    mobile: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(true),
      props: {
        label: 'Enter the user number to invite user in your agency',
        placeholder: '-',
        countryCallingCodeEditable: false,
        countrySelectProps: { disabled: true },
        defaultCountry: tenantConstants.COUNTRY_CODE,
      },
    },
  };
};
