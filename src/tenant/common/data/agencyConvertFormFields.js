import { emailValidationYup, phoneValidationYup, stringValidationYup, websiteValidation } from '../../../helpers';
import * as yup from 'yup';
import tenantConstants from '@constants';

export const agencyConvertFormFields = (data, t) => {
  return {
    name: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t('Name is required')).nullable(),
      props: {
        label: 'Name (English)',
        placeholder: 'Enter Name',
        maxLength: 80,
      },
      heading: {
        label: t('Agency Details'),
        props: {
          as: 'h5',
          className: 'span-all',
        },
      },
    },
    nameArabic: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup('الاسم باللغة العربية مطلوب').nullable(),
      props: {
        label: '(عربي) اسم',
        placeholder: 'الرجاء إدخال الاسم',
        maxLength: 80,
        groupStyle: {
          direction: 'rtl',
          justifyItems: 'start',
        },
      },
    },
    description: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t('Description is required')).nullable(),
      props: {
        label: 'Agency Description (English)',
        placeholder: 'Enter Agency Description',
        className: 'span-all',
        maxLength: 300,
      },
    },

    descriptionArabic: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup('الوصف باللغة العربية مطلوب').nullable(),
      props: {
        label: 'وصف الوكالة (عربي)',
        placeholder: 'أدخل وصف الوكالة',
        className: 'span-all',
        maxLength: 300,
        groupStyle: {
          direction: 'rtl',
          justifyItems: 'start',
        },
      },
    },
    city: {
      type: 'location-select',
      value: null,
      validation: () =>
        yup.object({
          city: yup.object().required(t(`${tenantConstants.USER_LOCATIONS.label} is required`)),
        }),
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
      validation: () => stringValidationYup(t('Address is required')).nullable(),
      props: {
        label: 'Address',
        placeholder: 'Enter Address',
        maxLength: 250,
      },
    },
    typeOfAgency: {
      type: 'radio',
      validation: () => yup.number().required(t('Type of agency is required')),
      value: null,
      props: {
        label: 'Type of Agency',
        buttonList: [
          { key: 1, label: 'Agency' },
          { key: 2, label: 'Developer Agency' },
        ],
        shape: 'round',
      },
    },
    agency_logo: {
      type: 'image-select',
      value: [],
      validation: () => null,
      props: {
        label: 'Agency Logo',
        placeholder: 'Browse and Upload',
        multi: false,
        attachmentType: 'agency_logo',
      },
    },
    mobile: {
      type: 'phone-input-verification',
      value: '',
      validation: () => phoneValidationYup(true),
      props: {
        containerClassName: 'pos-rel',
        label: 'Mobile Number',
        placeholder: 'Enter Phone Number',
        defaultCountry: tenantConstants.COUNTRY_CODE,
        countrySelectProps: { disabled: true },
        isUserVerified: !!data?.is_mobile_verified,
        phoneNumber: data?.mobile,
        userId: data?.id,
        disabled: data?.mobile && !!data?.is_mobile_verified,
        userType: 'User',
      },
      heading: {
        label: t('Contact Details'),
        props: {
          as: 'h5',
          className: 'span-all',
        },
      },
    },

    landline: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(false),
      props: {
        label: 'Phone Number',
        placeholder: 'Enter Phone number',
        defaultCountry: tenantConstants.COUNTRY_CODE,
        countryCallingCodeEditable: false,
        countrySelectProps: { disabled: true },
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
      },
    },
    website: {
      type: 'input',
      value: '',
      validation: () => websiteValidation(),
      props: {
        label: 'Website',
        placeholder: 'Enter Website',
      },
    },
  };
};
