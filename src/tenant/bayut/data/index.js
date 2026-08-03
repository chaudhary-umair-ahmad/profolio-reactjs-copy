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
import { getOffPlanInitialValues, getPostListingInitialValues, getRentalInitialValues, getAdLicenseInitialValues } from './getInitialValues';
import { getPostListingValidationSchema, getAdLicenseValidationSchema } from './getValidationSchema';
import {
  skipFieldsForField,
  shouldShowStudioBedroomOption,
  shouldHideBedroomsFieldForPropertyType,
  BAYUT_KSA_PROPERTY_TYPE_APARTMENT_ID,
} from './listing-form-data';
import { adLicensePropertyPermissions, getAdLicensePropertyPermissions } from './adLicensePropertyPermissions';

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
  getRentalInitialValues,
  getOffPlanInitialValues,
  getPostListingValidationSchema,
  skipFieldsForField,
  shouldShowStudioBedroomOption,
  shouldHideBedroomsFieldForPropertyType,
  BAYUT_KSA_PROPERTY_TYPE_APARTMENT_ID,
  getAdLicenseInitialValues,
  getAdLicenseValidationSchema,
  adLicensePropertyPermissions,
  getAdLicensePropertyPermissions
};
