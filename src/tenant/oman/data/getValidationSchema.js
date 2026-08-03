import * as yup from 'yup';

/**
 * Oman post listing uses `PostListingForm` + `dynamic_fields` (same Surge pipeline as common).
 * This export remains on `tenantData` for API parity with legacy entry points.
 */
export const getPostListingValidationSchema = (..._args) => yup.object().shape({});
