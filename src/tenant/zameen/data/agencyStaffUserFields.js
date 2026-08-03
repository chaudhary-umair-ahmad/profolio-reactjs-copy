import { t } from 'i18next';
import * as yup from 'yup';
import { strings } from '../../../constants/strings';
import tenantConstants from '@constants';
import { emailValidationYup, phoneValidationYup, stringValidationYup, cnicValidationYup, landlineValidationYup } from '../../../helpers';

export const agencyStaffUserFormFields = (userData = null, cities, fetchCities, userImageGuidelines, isActivationMode = false) => {
  const getDisabled = (key, defaultDisabled = false) => {
    if (isActivationMode) {
      const val = userData?.[key];
      if (Array.isArray(val)) return val.length > 0;
      return !!val;
    }
    return defaultDisabled;
  };

  return {
    name: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t(strings?.vm?.name)),
      props: {
        label: 'Name',
        placeholder: 'Enter Name',
        maxLength: 80,
        disabled: getDisabled('name', false),
      },
    },
    cnic: {
      type: 'input',
      value: '',
      // validation: () => userData ? null : cnicValidationYup(),
      validation: () => cnicValidationYup(),
      props: {
        label: 'CNIC #',
        placeholder: 'XXXXX-XXXXXXX-X',
        maxLength: 15,
        limit: 15,
        inputMode: 'numeric',
        format: 'cnic',
        disabled: getDisabled('cnic', !!userData),
      },
    },
    email: {
      type: 'input',
      value: '',
      validation: () => emailValidationYup(),
      props: {
        label: 'Email',
        placeholder: 'Enter Email',
        maxLength: 300,
        disabled: getDisabled('email', !!userData),
      },
    },
    ...(!userData && {
      password: {
        type: 'input',
        value: '',
        show: false,
        validation: () => stringValidationYup(t(strings.vm.password)).min(9, t('Password must be at least 9 characters')),
        props: {
          label: 'Password',
          placeholder: 'Enter Password',
          maxLength: 300,
          disabled: getDisabled('password', false),
        },
      },
    }),
    mobile: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(true),
      props: {
        label: 'Mobile',
        placeholder: 'Enter Mobile Number',
        defaultCountry: 'PK',
        disabled: getDisabled('mobile', !!userData),
      },
    },

    landline: {
      type: 'landline-input',
      value: '',
      validation: () => landlineValidationYup(false),
      props: {
        label: 'Landline',
        placeholder: '+92 XX YYYYYYY',
        // disabled: getDisabled('landline', !!userData),
      },
    },
    ...(!!userData && {
      olx_listings_number: {
        type: 'input',
        value: '',
        props: {
          label: 'OLX Listing Number',
          placeholder: 'OLX Listing Number',
          disabled: getDisabled('olx_listings_number', true),
        },
      },
    }),
    city: {
      type: 'select',
      validation: () => stringValidationYup(t(strings.vm.city)).nullable(),
      props: {
        label: tenantConstants.USER_LOCATIONS.label,
        placeholder: `Select  ${tenantConstants.USER_LOCATIONS.label}`,
        options: cities,
        disabled: getDisabled('city', false),
      },
    },
    address: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(strings.vm.address).notRequired(),
      props: {
        label: 'Address',
        placeholder: 'Enter Address',
        maxLength: 250,
        disabled: getDisabled('address', false),
      },
    },

    image: {
      type: 'image-select',
      value: [],
      validation: () => null,
      props: {
        label: 'Upload a picture',
        placeholder: 'Browse and Upload',
        multi: false,
        attachmentType: 'user_profile',
        showClose: !getDisabled('image', false),
      },
    },
    ...((!userData || isActivationMode) && {
      cnic_front: {
        type: 'image-select',
        value: [],
        validation: () => yup.array().min(1, t('CNIC front is required')).required(t('CNIC front is required')),
        props: {
          label: 'CNIC Front',
          placeholder: 'Browse and Upload',
          multi: false,
          attachmentType: 'user_cnic_front',
          showClose: !getDisabled('cnic_front', false),
        },
      },
      cnic_back: {
        type: 'image-select',
        value: [],
        validation: () => yup.array().min(1, t('CNIC back is required')).required(t('CNIC back is required')),
        props: {
          label: 'CNIC Back',
          placeholder: 'Browse and Upload',
          multi: false,
          attachmentType: 'user_cnic_back',
          showClose: !getDisabled('cnic_back', false),
        },
      },
    }),
  };
};
