import * as Yup from 'yup';
import tenantConstants from '@constants';
import { emailValidationYup, phoneValidationYup, stringValidationYup, websiteValidation } from '../../../helpers';

import { strings } from '../../../constants/strings';
import { t } from 'i18next';

export const agencySettingsFields = (data, cities) => {
  return [
    {
      list: {
        companyTitle: {
          type: 'input',
          value: '',
          validation: () => stringValidationYup(t(strings.vm.company_title)),
          props: {
            label: 'Company Title',
            placeholder: 'Enter Company Title',
            maxLength: 80,
          },
        },
        city: {
          type: 'location-select',
          value: null,
          validation: () =>
            Yup.object().shape({
              city: Yup.object()
                .required(`Please select a ${tenantConstants.USER_LOCATIONS.label}`)
                .test({
                  message: `Please select a ${tenantConstants.USER_LOCATIONS.label}`,
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
        email: {
          type: 'input',
          value: '',
          validation: () => emailValidationYup(),
          props: {
            label: 'Email',
            placeholder: 'Enter Email',
            maxLength: 300,
            disabled: !!data?.email,
          },
        },
        website: {
          type: 'input',
          value: '',
          validation: () => websiteValidation(),
          props: {
            label: 'Website',
            placeholder: 'https://www.example.com',
          },
        },
        address: {
          type: 'input',
          value: '',
          validation: () => stringValidationYup(t(strings.vm.address)),
          props: {
            label: 'Address',
            placeholder: 'Enter Address',
            maxLength: 250,
            lineCount: 3,
            className: 'span-all',
          },
        },
        description: {
          type: 'input',
          value: '',
          props: {
            label: 'Description',
            placeholder: 'Describe your company in a few words',
            lineCount: 3,
            className: 'span-all',
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
            disabled: true,
          },
        },
        landline: {
          type: 'phone-input',
          value: '',
          validation: () => phoneValidationYup(false),
          props: {
            label: 'Landline',
            placeholder: 'Enter Landline',
            defaultCountry: 'PK',
          },
        },
        ...(!!data?.enable_whatsapp_leads && {
          whatsapp: {
            type: 'phone-input',
            value: '',
            validation: () => phoneValidationYup(false),
            props: {
              label: 'Whatsapp',
              placeholder: 'Enter whatsapp number',
              defaultCountry: 'PK',
            },
          },
          agencyWhatsappForAll: {
            type: 'checkbox',
            value: false,
            props: {
              label: 'Use Agency Whatsapp for all Users',
              horizontal: true,
              checkboxReverse: true,
              labelSpace: true,
            },
          },
        }),
        logo: {
          type: 'image-select',
          value: [],
          props: {
            label: 'Agency Logo',
            placeholder: 'Browse and Upload',
            multi: false,
            attachmentType: 'agency_logo',
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
          },
        },
        sectionDivider: {
          type: 'divider',
          props: {
            className: 'span-all',
          },
        },
        ownerHeading: {
          type: 'heading',
          props: {
            label: 'CEO/Owner Profile',
            as: 'h3',
            className: 'span-all',
          },
        },
        //owner fields
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
        designation: {
          type: 'input',
          value: '',
          props: {
            label: 'Designation',
            placeholder: 'Enter Designation',
            maxLength: 50,
          },
        },
        message: {
          type: 'input',
          value: '',
          props: {
            label: 'Message',
            placeholder: 'Describe yourself in a few words',
            lineCount: 3,
            className: 'span-all',
          },
        },
        profilePhoto: {
          type: 'image-select',
          value: [],
          validation: () => null,
          props: {
            label: 'Profile Picture',
            placeholder: 'Browse and Upload',
            multi: false,
            key: 'profilePhoto',
            attachmentType: 'user_profile',
          },
        },
      },
    },
  ];
};
