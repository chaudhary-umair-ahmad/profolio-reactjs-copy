import tenantData from '@tenantData';
import { agencyConvertFormFields } from './agencyConvertFormFields';
import { agencyConvertFormFieldsValues } from './agencyConvertFormFieldsValues';
import { agencySettingsFields } from './agencySettingsFields';
import { agencySettingsFieldsValues } from './agencySettingsFieldsValues';
import constants from './constants';
import staticLists from './staticLists';
import { listingTypes } from './listingTypes';
import { getPackageBySlug } from './packages';
import products from './products';
import { profileFormFields } from './profileFields';
import { profileFieldsValues } from './profileFieldsValues';
import { slugToType } from './packages';
import { packages } from './packages';
import { agencyStaffUserFormFields } from './agencyStaffUserFields';
import { inviteToAgencyFormFields } from './inviteUserToAgencyFormFields';
import { truBrokerCriteriaIcons } from './truBroker';
import { getPostListingInitialValues } from './getInitialValues';
import { getPostListingValidationSchema } from './getValidationSchema';
import {
  skipFieldsForField,
  shouldHideBedroomsFieldForPropertyType,
  shouldShowStudioBedroomOption,
} from './listing-form-data';

export default {
  ...staticLists,
  ...constants,
  ...products,
  slugToType,
  packages,
  inviteToAgencyFormFields,
  listingTypes,
  profileFormFields,
  profileFieldsValues,
  agencySettingsFields,
  agencySettingsFieldsValues,
  agencyConvertFormFields,
  agencyConvertFormFieldsValues,
  getPackageBySlug,
  agencyStaffUserFormFields,
  truBrokerCriteriaIcons,
  getPostListingInitialValues,
  getPostListingValidationSchema,
  skipFieldsForField,
  shouldShowStudioBedroomOption,
  shouldHideBedroomsFieldForPropertyType,
  ...tenantData,
};
