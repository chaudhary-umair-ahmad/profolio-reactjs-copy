import * as yup from 'yup';

/**
 * Common/Surge post listing validation is built in `PostListingForm` from `dynamic_fields`
 * via `dynamicFormFieldMapper` → `buildValidationSchemaFromFields`. This export remains on
 * `tenantData` for API parity with legacy entry points.
 */
export const getPostListingValidationSchema = (..._args) => yup.object().shape({});
