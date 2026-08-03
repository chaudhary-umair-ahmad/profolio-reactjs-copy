import { DATE_FORMAT } from '../../../constants/formats';
import { strings } from '../../../constants/strings';
import { phoneValidationYup, stringValidationYup, websiteValidation } from '../../../helpers';
import { getDateDiff, getTimeDateString } from '../../../utility/date';
import tenantConstants from '@constants';

export const agencySettingsFields = (data, cities, t) => {
  return [
    {
      list: {
        buisnessName: {
          type: 'input',
          value: '',
          validation: () => stringValidationYup(t('Please Enter Agency Name')).nullable(),
          props: {
            label: 'Agency Name',
            placeholder: 'Enter Business Name',
            maxLength: 80,
            disabled:
              !!data?.fALLicenseNumber &&
              !!data?.typeofBuisness === 'Agency Broker' &&
              getDateDiff(
                getTimeDateString(data?.fALLicenseExpiryDate),
                getTimeDateString(new Date(), DATE_FORMAT, true),
              ) > 0,
          },
        },
        ...(data?.typeofBuisness === 'Agency Broker' && {
          commercialRegistrationNumber: {
            type: 'input',
            value: '',
            validation: () => stringValidationYup(t('Please Enter Registration Number')).nullable(),
            props: {
              label: 'Commercial Registration Number',
              placeholder: 'Enter Registration Number',
              maxLength: 10,
              disabled: !!data?.commercialRegistrationNumber,
            },
          },
        }),
        mobile: {
          type: 'phone-input-verification',
          value: '',
          validation: !!data?.is_mobile_verified && !!data?.mobile ? false : () => phoneValidationYup(true),
          props: {
            containerClassName: 'pos-rel',
            label: 'Phone Number',
            placeholder: 'Enter Phone Number',
            defaultCountry: tenantConstants.COUNTRY_CODE,
            //countryCallingCodeEditable: false,
            countrySelectProps: { disabled: true },
            disabled: !!data?.is_mobile_verified && !!data?.mobile,
            isUserVerified: data?.is_mobile_verified,
            //phoneNumber: data?.mobile,
            userType: 'Agency',
          },
        },
        website: {
          type: 'input',
          value: '',
          validation: () => websiteValidation(),
          props: {
            label: 'Website',
            placeholder: 'www.example.com',
          },
        },
        city: {
          type: 'location-select',
          value: '',
          //validation: () => stringValidationYup(t(strings.vm.city)).nullable(),
          props: {
            label: tenantConstants.USER_LOCATIONS.label,
            prefixIcon: 'user',
            // labelIcon: 'map',
            placeholder: `Select ${tenantConstants.USER_LOCATIONS.label}`,
            options: cities ? cities : [{}],
            mode: 'single',
            allowClear: true,
            hideLocation: true,
            hideCrossCity: true,
            showLableIcon: false,
            // className: 'span-all',
            // disabled: {
            //   key: 'country',
            //   value: 'null',
            // },
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
        //     // lineCount: 3,
        //     //className: 'span-all',
        //     //disabled: !!data?.nationalShortAddress,
        //   },
        // },
        address: {
          type: 'input',
          value: '',
          validation: () => stringValidationYup(false).nullable(),
          props: {
            label: 'Address',
            placeholder: 'Enter Business Address',
            maxLength: 250,
            // lineCount: 3,
            className: 'span-all',
          },
        },
        description: {
          type: 'input',
          value: '',
          props: {
            label: 'Agency Description',
            placeholder: 'Enter Agency Description',
            lineCount: 3,
            className: 'span-all',
          },
        },
        logo: {
          type: 'image-select',
          value: [],
          props: {
            label: 'Agency Logo',
            placeholder: 'Browse and Upload',
            multi: false,
            attachmentType: 'agency_logo',
            className: 'span-all',
          },
        },
      },
    },
    {
      list: {
        name: {
          type: 'input',
          value: '',
          validation: () => stringValidationYup(t(strings.vm.name)).nullable(),
          props: {
            label: 'Name',
            placeholder: 'Enter Name',
            maxLength: 80,
            disabled: true,
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
            placeholder: 'Enter Message',
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
            attachmentType: 'agency_owner_image',
          },
        },
      },
    },
  ];
};
