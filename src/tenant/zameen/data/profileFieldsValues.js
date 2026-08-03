import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import tenantUtils from '@utils';

const profileFieldsValues = (loggedInUser) => {
  return {
    id: loggedInUser?.user?.id,
    name: loggedInUser?.user?.name,
    email: loggedInUser?.user?.email,
    mobile: loggedInUser?.user?.mobile ? tenantUtils.formatMobile(loggedInUser?.user?.mobile, 'singleNumber') : [],
    phone: loggedInUser?.user?.phone ? tenantUtils.formatMobile(loggedInUser?.user?.phone, 'singleNumber') : '',
    address: loggedInUser?.user?.address,
    location: {
      city: loggedInUser?.user?.city_id && { location_id: loggedInUser?.user?.city_id },
    },
    ...(loggedInUser?.user?.profile_image && {
      profile_image: [{ gallerythumb: loggedInUser?.user?.profile_image, ...imageStateObject() }],
    }),
    whatsapp: loggedInUser?.user?.whatsapp
      ? tenantUtils.formatMobile(loggedInUser?.user?.whatsapp, 'singleNumber')
      : '',
    ...(loggedInUser?.user?.olx_user_id && {
        olx_listings_number: loggedInUser?.user?.olx_listings_number,
      }),
  };
};

export default profileFieldsValues;
