import tenantUtils from '@utils';
import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';

export const agencySettingsFieldsValues = (values) => {
  return {
    // buisnessName: tenantUtils.getLocalisedString(values, 'name', true),
    country: values?.country_id || 155,
    city: values?.city_id,
    email: values?.email,
    website: values?.website,
    description: tenantUtils.getLocalisedString(values, 'description', true),
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber')?.split(',')?.[0] : '',
    landline: values?.phone ? tenantUtils.formatMobile(values?.phone, 'singleNumber') : '',
    whatsapp: values?.whatsapp ? tenantUtils.formatMobile(values?.whatsapp, 'singleNumber') : '',
    agencyWhatsappForAll: values?.agencyWhatsappForAll,
    logo: values?.logo && [{ gallerythumb: values?.logo, ...imageStateObject() }],
    address: values?.address,
    updateCompanyListings: values?.updateCompanyListings,
    commercialRegistrationNumber: values?.commercial_registration_number,
    fALLicenseNumber: values?.license?.number,
    fALLicenseExpiryDate: values?.license?.end_date,
    typeofBuisness: values?.broker_type,
    buisnessName: values?.name,
    nationalShortAddress: values?.national_short_address,
    is_mobile_verified: values?.is_mobile_verified,
    owner: {
      name: values?.owner?.name,
      designation: values?.owner?.designation,
      message: values?.owner?.message,
      profilePhoto: values?.owner?.image && [{ gallerythumb: values?.owner?.image, ...imageStateObject() }],
      updatePropertyListings: false,
    },
  };
};
