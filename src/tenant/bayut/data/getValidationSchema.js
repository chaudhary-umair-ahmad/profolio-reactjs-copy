import * as yup from 'yup';
import { t } from 'i18next';

/**
 * Bayut KSA Surge post/edit listing validation is built in `PostListingForm` from static
 * `dynamic_fields` via `dynamicFormFieldMapper` → `buildValidationSchemaFromFields`
 * (including `validation_strategy` / `validation_params` / `validation_messages` on field rows).
 * This export remains on `tenantData` for API parity with other tenants / legacy entry points.
 */
export const getPostListingValidationSchema = () => yup.object().shape({});

export const getAdLicenseValidationSchema = (propertyPermissions = {}) => {
  const schema = {
    purpose: yup.string().required(t('Please select purpose')),
    property_type: yup.string().required(t('Please select property type')),
    property_sub_type: yup.object().required(t('Please select property sub type')),
    property_ownership_document_number: yup
      .string()
      .required(t('Please enter property ownership document number'))
      .matches(/^[0-9]{10,20}$/, t('Property ownership document number must be 10-20 digits only')),
    city: yup.object().required(t('City is required')),
    location: yup.object().required(t('Location is required')),
    price: yup
      .number()
      .required(t('Please enter price'))
      .positive(t('Price must be positive'))
      .typeError(t('Please enter a valid price')),
    name: yup.string().required(t('Please enter your name')),
    mobile: yup.string().required(t('Please enter your mobile number')),
    'location-info': yup
      .object({
        city: yup.object().required(t('City is required')),
        location: yup.object().required(t('Location is required')),
      })
      .required(t('Location is required'))
      .test('has-city-and-location', t('Both city and location are required'), (value) => {
        return value && value.city && value.location;
      }),
  };

  if (propertyPermissions.property_age) {
    schema.property_age = yup.object().required(t('Please select property age'));
  }

  if (propertyPermissions.bedrooms) {
    schema.bedrooms = yup.string().required(t('Please select number of bedrooms'));
  }

  if (propertyPermissions.area_size) {
    schema.area_size = yup
      .number()
      .required(t('Please enter area size'))
      .positive(t('Area size must be positive'))
      .typeError(t('Please enter a valid area size'));
  }

  return yup.object().shape(schema);
};
