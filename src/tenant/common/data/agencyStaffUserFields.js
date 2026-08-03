import tenantUtils from '@utils';
import { t } from 'i18next';
import Algolia from '../../../services/algolia';
import { emailValidationYup, phoneValidationYup, stringValidationYup } from '../../../helpers';
import tenantConstants from '@constants';

export const agencyStaffUserFormFields = (data) => {
  return {
    name: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t('Please enter name')).nullable(),
      props: {
        label: 'Title (English)',
        placeholder: 'Please enter English title',
        maxLength: 80,
      },
    },
    nameArabic: {
      type: 'input',
      value: '',
      //validation: () => stringValidationYup('يرجى إضافة الاسم'),
      props: {
        label: 'العنوان (عربي)',
        placeholder: 'Please enter Arabic title',
        maxLength: 80,
        groupStyle: {
          direction: 'rtl',
        },
      },
    },
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
    city: {
      type: 'location-select',
      value: null,
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

    mobile: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(true),
      props: {
        //containerClassName: 'pos-rel',
        label: 'Mobile Number',
        placeholder: 'Enter Mobile Number',
        defaultCountry: tenantConstants.COUNTRY_CODE,
        disabled: true,
        //countryCallingCodeEditable: false,
        countrySelectProps: { disabled: true },
      },
    },
    // landline: {
    //   type: 'phone-input',
    //   value: '',
    //   validation: () => phoneValidationYup(false),
    //   props: {
    //     label: 'Landline',
    //     placeholder: 'Enter Landline',
    //     defaultCountry: tenantConstants.COUNTRY_CODE,
    //     //countryCallingCodeEditable: false,
    //     countrySelectProps: { disabled: true },
    //   },
    // },
    // phone: {
    //   type: 'phone-input',
    //   value: '',
    //   validation: () => phoneValidationYup(false),
    //   props: {
    //     label: 'Landline',
    //     placeholder: 'Enter Landline',
    //     defaultCountry: tenantConstants.COUNTRY_CODE,
    //   },
    // },
    whatsapp: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(false),
      props: {
        label: 'Whatsapp',
        placeholder: 'Enter whatsapp number',
        defaultCountry: tenantConstants.COUNTRY_CODE,
        countryCallingCodeEditable: false,
        countrySelectProps: { disabled: true },
      },
    },

    // nationalShortAddress: {
    //   type: 'input',
    //   value: '',
    //   validation: () => stringValidationYup(false).nullable(),
    //   props: {
    //     label: 'National Short Address',
    //     placeholder: 'Enter National Short Address',
    //     maxLength: 8,
    //     className: 'span-all',
    //     //disabled: !!data?.national_short_address,
    //   },
    // },
    address: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(false).nullable(),
      props: {
        label: 'Address',
        placeholder: 'Enter Address',
        maxLength: 250,
        className: 'span-all',
      },
    },

    agentDescription: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(false).nullable(),
      props: {
        label: 'Agent Description (English)',
        placeholder: 'Enter Agent Description',
        maxLength: 2000,
        limit: 2000,
        className: 'span-all',
      },
    },

    agentDescriptionArabic: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(false).nullable(),
      props: {
        label: 'وصف الوكيل (بالعربية)',
        placeholder: 'أدخل وصف الوكيل',
        maxLength: 2000,
        limit: 2000,
        className: 'span-all',
        groupStyle: {
          direction: 'rtl',
        },
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
        className: 'span-all',
        attachmentType: 'user_profile',
      },
    },
  };
};

export const inviteFormFields = () => {
  return {
    list: {
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
    },
  };
};
