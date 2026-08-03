import tenantUtils from '@utils';

export const agencyConvertFormFieldsValues = (values) => {
  return {
    name: values?.name,
    nameArabic: values?.name_l1,
    description: null,
    descriptionArabic: null,
    city: values?.city_id
      ? {
          city: {
            location_id: values?.city_id,
            name: tenantUtils.getLocalisedString(values, 'city'),
          },
        }
      : {},
    address: values?.address,
    typeOfAgency: null,
    agency_logo: null,
    email: values?.email,
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber') : '',
    landline: '',
    website: null,
  };
};
