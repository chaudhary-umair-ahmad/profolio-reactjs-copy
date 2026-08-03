import { emailValidationYup, phoneValidationYup, stringValidationYup } from '../../../helpers';
import tenantConstants from '@constants';
import { strings } from '../../../constants/strings';

const profileFormFields = (t, data, KC_ENABLED, cities, description, guidelines, fetchCities, isAgencyUser = false) => {
  const basicFields = {
    name: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t(strings.vm.name)),
      props: {
        label: 'Name',
        placeholder: 'Enter Name',
        maxLength: 80,
      },
    },

    phone: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(false),
      props: {
        label: 'Landline',
        placeholder: 'Enter Landline',
        defaultCountry: 'PK',
        disabled: !!isAgencyUser,
      },
    },
    whatsapp: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(false),
      props: {
        label: 'Whatsapp',
        placeholder: 'Enter whatsapp number',
        defaultCountry: 'PK',
        disabled: !!isAgencyUser,
      },
    },
    location: {
      type: 'location-select',
      value: null,
      // validation: () => stringValidationYup(strings.vm.city).nullable(),
      props: {
        label: tenantConstants.USER_LOCATIONS.label,
        placeholder: `Select ${tenantConstants.USER_LOCATIONS.label}`,
        hideCrossCity: true,
        hideLocation: true,
        hidePlot: true,
        showSearch: false,
        showPrefixIcon: false,
        showLableIcon: false,
        options: [],
      },
    },
    address: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(strings.vm.address).nullable(),
      props: {
        label: 'Address',
        placeholder: 'Enter Address',
        maxLength: 250,
        className: 'span-all',
      },
    },
    ...(data?.olx_user_id && {
        olx_listings_number: {
          type: 'input',
          value: '',
          props: {
            label: 'OLX Listing Number',
            placeholder: 'OLX Listing Number',
            disabled: true,
          },
        },
      }),

    profile_image: {
      type: 'image-select',
      value: [],
      validation: () => null,
      props: {
        label: 'Upload a picture',
        placeholder: 'Browse and Upload',
        multi: false,
        className: 'span-all',
        attachmentType: 'user_profile',
      },
    },
    updatePropertyListings: {
      type: 'checkbox',
      value: false,
      props: {
        label: 'Update details in all property listings',
        horizontal: true,
        checkboxReverse: true,
        labelSpace: true,
        className: 'span-all',
      },
    },
  };

  const kcFormFields = {
    email: {
      type: 'input',
      value: '',
      validation: data?.email ? false : () => emailValidationYup().nullable(),
      props: {
        label: 'Email',
        placeholder: 'Enter Email',
        maxLength: 300,
        disabled: true,
      },
    },

    mobile: {
      type: 'phone-input-verification',
      value: '',
      validation: () => phoneValidationYup(true),
      props: {
        containerClassName: 'pos-rel',
        label: 'Phone Number',
        placeholder: 'Enter Phone Number',
        defaultCountry: 'SA',
        countrySelectProps: { disabled: true },
        isUserVerified: !!data?.is_mobile_verified,
        phoneNumber: data?.mobile,
        userId: data?.id,
        userType: 'User',
        disabled: true,
      },
    },
  };

  const allFields = {
    name: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t(strings.vm.name)),
      props: {
        label: 'Name',
        placeholder: 'Enter Name',
        maxLength: 80,
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
        disabled: true,
      },
    },
    mobile: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(true),
      props: {
        label: 'Mobile',
        placeholder: 'Enter Mobile Number',
        defaultCountry: 'PK',
        disabled: !!isAgencyUser,
      },
    },

    phone: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(false),
      props: {
        label: 'Landline',
        placeholder: 'Enter Landline',
        defaultCountry: 'PK',
        disabled: !!isAgencyUser,
      },
    },
    whatsapp: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(false),
      props: {
        label: 'Whatsapp',
        placeholder: 'Enter whatsapp number',
        defaultCountry: 'PK',
        disabled: !!isAgencyUser,
      },
    },
    location: {
      type: 'location-select',
      value: null,
      // validation: () => stringValidationYup(strings.vm.city).nullable(),
      props: {
        label: tenantConstants.USER_LOCATIONS.label,
        placeholder: `Select ${tenantConstants.USER_LOCATIONS.label}`,
        hideCrossCity: true,
        hideLocation: true,
        hidePlot: true,
        showSearch: false,
        showPrefixIcon: false,
        showLableIcon: false,
        options: [],
      },
    },
    address: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(strings.vm.address).nullable(),
      props: {
        label: 'Address',
        placeholder: 'Enter Address',
        maxLength: 250,
        className: 'span-all',
      },
    },
    ...(!!data?.olx_user_id && {
        olx_listings_number: {
          type: 'input',
          value: '',
          props: {
            label: 'OLX Listing Number',
            placeholder: 'OLX Listing Number',
            disabled: true,
          },
        },
      }),

    profile_image: {
      type: 'image-select',
      value: [],
      validation: () => null,
      props: {
        label: 'Upload a picture',
        placeholder: 'Browse and Upload',
        multi: false,
        className: 'span-all',
        attachmentType: 'user_profile',
      },
    },
    updatePropertyListings: {
      type: 'checkbox',
      value: false,
      props: {
        label: 'Update details in all property listings',
        horizontal: true,
        checkboxReverse: true,
        labelSpace: true,
        className: 'span-all',
      },
    },
  };
  return KC_ENABLED ? { basicFields, kcFormFields } : { basicFields: allFields };
};

export default profileFormFields;
