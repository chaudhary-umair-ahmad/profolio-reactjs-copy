import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import tenantUtils from '@utils';

export const agencySettingsFieldsValues = (values) => {
  return {
    companyTitle: values?.name,
    city: { city: values?.city_id ? { location_id: values?.city_id } : null },
    email: values?.email,
    website: values?.website,
    description: values?.description,
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber')?.split(',')?.[0] : '',
    landline: values?.phone ? tenantUtils.formatMobile(values?.phone, 'singleNumber') : '',
    whatsapp: values?.whatsapp ? tenantUtils.formatMobile(values?.whatsapp, 'singleNumber') : '',
    agencyWhatsappForAll: values?.use_agency_whatsapp,
    logo: values?.logo && [{ gallerythumb: values?.logo, ...imageStateObject() }],
    address: values?.address,
    updatePropertyListings: values?.updatePropertyListings,

    name: values?.owner?.name,
    designation: values?.owner?.designation,
    message: values?.owner?.message,
    profilePhoto: values?.owner?.profile_image && [
      { gallerythumb: values?.owner?.profile_image, ...imageStateObject() },
    ],
  };
};
