import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import tenantUtils from '@utils';

export const profileFieldsValues = (loggedInUser) => {
  return {
    id: loggedInUser?.user?.id,
    name: loggedInUser?.user?.name?.en,
    email: loggedInUser?.user?.email,
    mobile: loggedInUser?.user?.mobile ? tenantUtils.formatMobile(loggedInUser?.user?.mobile, 'singleNumber') : [],
    phone: loggedInUser?.user?.phone ? tenantUtils.formatMobile(loggedInUser?.user?.phone, 'singleNumber') : '',
    address: loggedInUser?.user?.address,
    country: loggedInUser?.user?.country_id || 155,
    location: {
      city: loggedInUser?.user?.city_id && { location_id: loggedInUser?.user?.city_id },
    },
    ...(loggedInUser?.user?.profile_image && {
      profile_image: [{ gallerythumb: loggedInUser?.user?.profile_image, ...imageStateObject() }],
    }),
    whatsapp: loggedInUser?.user?.whatsapp
      ? tenantUtils.formatMobile(loggedInUser?.user?.whatsapp, 'singleNumber')
      : '',
    fALLicenseNumber: loggedInUser?.user?.license?.number,
    fALLicenseExpiryDate: loggedInUser?.user?.license?.end_date,
    commercialRegistrationNumber: loggedInUser?.user?.commercial_registration_number,
    typeofBuisness: loggedInUser?.user?.broker_type,
    buisnessName: loggedInUser?.user?.agency?.name,
    nationalShortAddress: loggedInUser?.user?.national_short_address,
    falLicenseURL: loggedInUser?.user?.license?.certificate_link,
    nameArabic: loggedInUser?.user?.name?.ar,
  };
};
