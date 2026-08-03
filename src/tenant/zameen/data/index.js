import constants from './constants';
import { agencySettingsFields } from './agencySettingsFields';
import { agencySettingsFieldsValues } from './agencySettingsFieldsValues';
import { listingTypes } from './listingTypes';
import products from './products';
import profileFieldsValues from './profileFieldsValues';
import profileFormFields from './profileFields';
import staticLists from './staticLists';
import { agencyStaffUserFormFields } from './agencyStaffUserFields';
import { skipFieldsForField } from './listing-form-data';
import { getPostListingInitialValues } from './getInitialValues';
import { getPostListingValidationSchema } from './getValidationSchema';

export default {
  ...constants,
  listingTypes,
  ...products,
  profileFormFields,
  profileFieldsValues,
  agencySettingsFields,
  agencySettingsFieldsValues,
  agencyStaffUserFormFields,
  ...staticLists,
  skipFieldsForField,
  getPostListingInitialValues,
  getPostListingValidationSchema,
};
