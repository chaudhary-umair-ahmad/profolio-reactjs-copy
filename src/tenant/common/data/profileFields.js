import tenantConstants from '@constants';
import * as Yup from 'yup';
import { ListWithBullet } from '../../../components/common/listBullet/listBullet';
import { emailValidationYup, phoneValidationYup, stringValidationYup } from '../../../helpers';

export const profileFormFields = (t, data, KC_ENABLED, cities, description, fetchCities) => {
  const profileCompletionfields = {
    agentDescription: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(false).nullable(),
      props: {
        label: 'Agent Description (English)',
        placeholder: 'Enter Agent Description',
        maxLength: 150,
        className: 'span-all',
        lineCount: 3,
      },
    },

    agentDescriptionArabic: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(false).nullable(),
      props: {
        label: 'وصف الوكيل (بالعربية)',
        placeholder: 'أدخل وصف الوكيل',
        maxLength: 150,
        className: 'span-all',
        lineCount: 3,
        groupStyle: {
          direction: 'rtl',
        },
      },
    },

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
        imageDescription: (
          <ListWithBullet className="fz-12">
            {description &&
              description?.map((data, i) => (
                <li key={i} className="color-gray-dark">
                  {t(data?.label)}
                </li>
              ))}
          </ListWithBullet>
        ),
      },
    },
  };
  const basicFields = {
    name: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t('Please enter name')).nullable(),
      props: {
        label: 'Title (English)',
        placeholder: 'Please enter English title',
        maxLength: 100,
      },
    },
    nameArabic: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t('Name in Arabic is required')).nullable(),
      props: {
        label: 'العنوان (عربي)',
        placeholder: 'Please enter Arabic title',
        maxLength: 100,
        groupStyle: {
          direction: 'rtl',
        },
      },
    },
    location: {
      type: 'location-select',
      value: null,
      validation: () =>
        Yup.object().shape({
          city: Yup.object()
            .required(t(`Please select a ${tenantConstants.USER_LOCATIONS.label}`))
            .test({
              message: t(`Please select a ${tenantConstants.USER_LOCATIONS.label}`),
              test: (value) => value?.location_id,
            }),
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
    whatsapp: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(true, false, t('Please enter whatsapp number')),
      props: {
        label: 'Whatsapp',
        placeholder: 'Enter whatsapp number',
        defaultCountry: tenantConstants.COUNTRY_CODE,
        countryCallingCodeEditable: false,
        countrySelectProps: { disabled: true },
        // extra: <Icon></Icon>,
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
        defaultCountry: tenantConstants.COUNTRY_CODE,
        countrySelectProps: { disabled: true },
        isUserVerified: !!data?.is_mobile_verified,
        phoneNumber: data?.mobile,
        userId: data?.id,
        userType: 'User',
      },
    },
  };

  const allFields = {
    name: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t('Please enter name')).nullable(),
      props: {
        label: 'Title (English)',
        placeholder: 'Please enter English title',
        maxLength: 100,
      },
    },
    nameArabic: {
      type: 'input',
      value: '',
      validation: () => stringValidationYup(t('Name in Arabic is required')).nullable(),
      props: {
        label: 'العنوان (عربي)',
        placeholder: 'Please enter Arabic title',
        maxLength: 100,
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
        disabled: data?.email,
      },
    },
    location: {
      type: 'location-select',
      value: null,
      validation: () =>
        Yup.object().shape({
          city: Yup.object()
            .required(t(`Please select a ${tenantConstants.USER_LOCATIONS.label}`))
            .test({
              message: t(`Please select a ${tenantConstants.USER_LOCATIONS.label}`),
              test: (value) => value?.location_id,
            }),
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
    mobile: {
      type: 'phone-input-verification',
      value: '',
      validation: () => phoneValidationYup(true),
      props: {
        containerClassName: 'pos-rel',
        label: 'Phone Number',
        placeholder: 'Enter Phone Number',
        defaultCountry: tenantConstants.COUNTRY_CODE,
        countrySelectProps: { disabled: true },
        isUserVerified: !!data?.is_mobile_verified,
        phoneNumber: data?.mobile,
        userId: data?.id,
        userType: 'User',
      },
    },

    whatsapp: {
      type: 'phone-input',
      value: '',
      validation: () => phoneValidationYup(true, false, t('Please enter whatsapp number')),
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
  };
  return KC_ENABLED
    ? { basicFields: { ...basicFields, ...profileCompletionfields }, kcFormFields }
    : { basicFields: { ...allFields, ...profileCompletionfields } };
    
};
