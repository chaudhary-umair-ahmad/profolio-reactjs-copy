import tenantUtils from '@utils';
import tenantConstants from '@constants';
import tenantData from '@data';
import { t } from 'i18next';
import React from 'react';
import { Flex } from '../../../components/common';
import * as yup from 'yup';
import {
  stringValidationYup,
  numberValidationYup,
  objectValidationYup,
  singleSelectValidationYup,
  arrayValidationYup,
  videoSelectBankValidationYup,
  arrayOrObjectValidationYup,
  phoneValidationYup,
  booleanValidationYup,
  regexFromApi,
  saleDiscountedPriceConditionalYupFromJson,
  resolveApiValidationMessage,
} from '../../../helpers/validations';
import defaultValidationPatterns from '../data/listingCategories/common/defaultValidationPatterns.json';
import { getDynamicDisplaySortOrder } from '../../../helpers/dynamicDisplayOrder';

/** API may send boolean false or string "false"; only then lock the field. */
const isDynamicFieldReadOnly = (isEditable) =>
  isEditable === false ||
  isEditable === 'false' ||
  (typeof isEditable === 'string' && isEditable.toLowerCase() === 'false');

const mapApiKeyNameToFormKey = (apiKeyName) => {
  const fieldNameMap = {
    beds: 'bedrooms',
    baths: 'bathrooms',
    is_furnished: 'furnished',
    area_unit_value: 'area',
    rent_frequency: 'rental_frequency',
    location_id: 'location-info',
    location_info: 'location-info',
    images: 'property_images',
    price: 'price',
    title: 'property_title_en',
    title_l1: 'property_title_ar',
    description: 'property_description_en',
    description_l1: 'property_description_ar',
    user_id: 'posting_as',
  };
  return fieldNameMap[apiKeyName] ?? apiKeyName;
};

/** True when this API field maps to the canonical Formik location composite `location-info`. */
const isLocationApiFieldKey = (apiKeyName) => mapApiKeyNameToFormKey(apiKeyName) === 'location-info';

const formKeyForSkipFieldRules = (apiKeyName) => {
  const k = mapApiKeyNameToFormKey(apiKeyName);
  return k === 'features' ? 'feature_and_amenities' : k;
};

const shouldOmitDynamicFieldForPropertyType = (apiKeyName, propertyTypeId, skipFieldRules, isDailyRental) => {
  if (isDailyRental) return false;
  if (propertyTypeId == null || !skipFieldRules) return false;
  const pt = Number(propertyTypeId);
  if (Number.isNaN(pt)) return false;
  const formKey = formKeyForSkipFieldRules(apiKeyName);
  const rule = skipFieldRules[formKey]?.property_type?.[pt];
  if (rule === true) return true;
  if (rule && typeof rule === 'object' && rule.skipField === true) return true;
  return false;
};

export const dynamicFormFieldMapper = (response, locale, user, cities, mapperOptions = {}) => {
  const {
    useSecondaryDisplayOrder = false,
    isDailyRental = false,
    propertyTypeId,
    skipFieldRules,
    /** When true, drop location from /dynamic_fields and inject a client-only `location-info` (legacy Algolia LocationSelect). */
    injectClientLocationField = false,
  } = mapperOptions;
  // Validation messages from API label/label_l1 only (no hardcoded field keys)
  const getValidationMessage = (type, label, label_l1) => {
    const labelText = locale === 'en' ? (label || '') : (label_l1 || label || '');
    const labelLower = labelText?.toLowerCase() || '';

    if (type === 'select' || type === 'single-select' || type === 'multi-select') {
      if (labelText) return t('Please select {{label}}', { label: labelLower });
      return t('Please select');
    }
    if (type === 'number' || type === 'integer' || type === 'decimal') {
      if (labelText) return t('Please enter {{label}}', { label: labelLower });
      return t('Please enter');
    }
    if (labelText) return t('Please enter {{label}}', { label: labelLower });
    return t('Please enter');
  };

  const getRequiredMessage = (label, label_l1) => {
    const labelText = locale === 'en' ? (label || '') : (label_l1 || label || '');
    return labelText ? t('{{label}} is required', { label: labelText }) : t('This field is required');
  };

  /**
   * Maps `dynamic_fields` rows to Yup factories. Canonical validation inputs on each row:
   * `data_type`, `is_required`, `regex`, `lang_regex`, `lang_l1_regex`, `min_value`, `max_value`,
   * `min_length`, `max_length`, `trigger_regex`, `depends_on` (via dependsOnMap), `ui_type`.
   * Optional: `validation_messages` (i18n keys or literals for `t()`), `validation_strategy` + `validation_params`
   * for cross-field rules (e.g. `sale_discounted_price` uses generic keys: `condition_field`, `reference_field`,
   * `cap_fraction`, and messages `required`, `invalid`, `compare_less_than_reference`, `beyond_cap`).
   */
  const getValidationFunction = (
    data_type,
    ui_type,
    key_name,
    label,
    label_l1,
    lang_regex,
    lang_l1_regex,
    is_required,
    trigger_regex,
    dependsOnMap,
    id,
    max_value,
    min_value,
    regex,
    max_length,
    min_length,
    original_key_name,
    validation_strategy,
    validation_params,
    validation_messages,
  ) => {
    const fieldRequired = is_required === true;
    const dependsOnKey = dependsOnMap?.[id]?.depends_on;
    const vm =
      validation_messages != null && typeof validation_messages === 'object' ? validation_messages : {};

    if (validation_strategy === 'sale_discounted_price') {
      const vp = validation_params != null && typeof validation_params === 'object' ? validation_params : {};
      return () => saleDiscountedPriceConditionalYupFromJson({ validation_messages: vm, validation_params: vp });
    }
    if (key_name === 'posting_as' || original_key_name === 'user_id') {
      return fieldRequired
        ? () =>
            yup
              .mixed()
              .required(getRequiredMessage(label, label_l1))
              .test({
                name: 'posting-as',
                message: getRequiredMessage(label, label_l1),
                test: (v) =>
                  v != null &&
                  v !== '' &&
                  (typeof v === 'object' ? v.id != null : v === 0 || !!v),
              })
        : () => yup.mixed().nullable().optional();
    }

    // API often sends location as data_type "single-select" + ui_type "location-select"; validation must follow ui_type.
    const uiNorm = ui_type != null ? String(ui_type).toLowerCase().trim() : '';
    const validationKind =
      uiNorm === 'location-select'
        ? 'location-select'
        : uiNorm === 'video-select-bank'
          ? 'video-select-bank'
          : data_type;

    switch (validationKind) {
      case 'phone':
        return user && !!user?.is_mobile_verified && !!user?.[key_name]
          ? false
          : () =>
              phoneValidationYup(
                fieldRequired,
                false,
                fieldRequired ? getRequiredMessage(label, label_l1) : undefined,
              );

      case 'image-select-bank':
      case 'image-select':
        return () =>
          arrayValidationYup(
            fieldRequired ? getRequiredMessage(label, label_l1) : false,
            max_length,
            min_length,
          );

      case 'video-select-bank':
        return () =>
          videoSelectBankValidationYup(
            fieldRequired ? getRequiredMessage(label, label_l1) : false,
            max_length,
            min_length,
            regex != null && regex !== '' ? regex : null,
            vm,
          );

      case 'single-select':
        return fieldRequired
          ? () => singleSelectValidationYup(getValidationMessage('select', label, label_l1))
          : () => singleSelectValidationYup(false);

      case 'multi-select':
        // add-amenities (features) stores value as object keyed by id, not array
        if (key_name === 'features') {
          return fieldRequired
            ? () => arrayOrObjectValidationYup(getValidationMessage('select', label, label_l1))
            : () => arrayOrObjectValidationYup(false);
        }
        return fieldRequired
          ? () => arrayValidationYup(getValidationMessage('select', label, label_l1), max_length, min_length)
          : () => arrayValidationYup(false, max_length, min_length);

      case 'integer':
        return fieldRequired
          ? () =>
              numberValidationYup(
                getValidationMessage('number', label, label_l1),
                trigger_regex,
                dependsOnKey,
                max_value,
                min_value,
                regex,
                true,
                vm,
              )
          : () =>
              numberValidationYup(
                false,
                trigger_regex,
                dependsOnKey,
                max_value,
                min_value,
                regex,
                true,
                vm,
              );

      case 'number':
      case 'decimal':
        return fieldRequired
          ? () =>
              numberValidationYup(
                getValidationMessage('number', label, label_l1),
                trigger_regex,
                dependsOnKey,
                max_value,
                min_value,
                regex,
                false,
                vm,
              )
          : () =>
              numberValidationYup(
                false,
                trigger_regex,
                dependsOnKey,
                max_value,
                min_value,
                regex,
                false,
                vm,
              );

      case 'location-select': {
        const selectMsg = resolveApiValidationMessage(
          vm,
          'required',
          getValidationMessage('select', label, label_l1),
        );
        const hasCity = (c) =>
          c != null && typeof c === 'object' && (c.location_id != null || c.id != null);
        return fieldRequired
          ? () =>
              yup.object({
                city: yup
                  .mixed()
                  .nullable()
                  .test({
                    name: 'city',
                    message: selectMsg,
                    test: (v) => hasCity(v),
                  }),
                // Location/District is always optional; city-level selection is sufficient.
                location: yup.mixed().nullable(),
              })
          : () => yup.object().nullable().optional();
      }

      case 'select-search':
        return fieldRequired
          ? () => yup.mixed().required(getValidationMessage('select', label, label_l1))
          : () => yup.mixed().nullable().optional();

      case 'boolean':
        return () => booleanValidationYup(fieldRequired, getRequiredMessage(label, label_l1));

      default: {
        // String/text: regex from API only. lang_regex = Latin (EN), lang_l1_regex = Arabic (AR). Both present = both scripts allowed. Invalid format = skip that regex.
        // Single lang pattern (e.g. \p{Latin}) matches one character only; use full-string patterns so "Lawn or Garden" passes.
        const reMain = regex != null && regex !== '' ? regexFromApi(regex) : null;
        const reLang = lang_regex != null && lang_regex !== '' ? regexFromApi(lang_regex) : null;
        const reLangL1 = lang_l1_regex != null && lang_l1_regex !== '' ? regexFromApi(lang_l1_regex) : null;
        let effectiveRegex = null;
        if (reMain) {
          effectiveRegex = regex;
        } else if (reLang && reLangL1) {
          effectiveRegex = defaultValidationPatterns.bilingualLatinArabic;
        } else if (reLang) {
          effectiveRegex = defaultValidationPatterns.latinOnly;
        } else if (reLangL1) {
          effectiveRegex = defaultValidationPatterns.arabicOnly;
        }
        const invalidMsg = resolveApiValidationMessage(vm, 'invalid_format', t('Invalid format'));
        return () => {
          let schema = fieldRequired
            ? stringValidationYup(
                getValidationMessage('text', label, label_l1),
                effectiveRegex,
                invalidMsg,
              )
            : stringValidationYup(false, effectiveRegex, invalidMsg);
          if (min_length != null && !Number.isNaN(Number(min_length))) {
            const min = Number(min_length);
            const minMsg = resolveApiValidationMessage(
              vm,
              'min_length',
              t('Minimum {{min}} characters required', { min: min_length }),
            );
            if (fieldRequired) {
              schema = schema.min(min, minMsg);
            } else {
              schema = schema.test('api-min-length', minMsg, (val) => {
                if (val == null || val === '') return true;
                return String(val).length >= min;
              });
            }
          }
          if (max_length != null && !Number.isNaN(Number(max_length))) {
            const max = Number(max_length);
            const maxMsg = resolveApiValidationMessage(
              vm,
              'max_length',
              t('Maximum {{max}} characters allowed', { max: max_length }),
            );
            if (fieldRequired) {
              schema = schema.max(max, maxMsg);
            } else {
              schema = schema.test('api-max-length', maxMsg, (val) => {
                if (val == null || val === '') return true;
                return String(val).length <= max;
              });
            }
          }
          return schema;
        };
      }
    }
  };

  const { dynamic_fields: rawDynamicFields = [] } = response || {};
  const apiDynamicFields = rawDynamicFields.filter((field) => {
    if (injectClientLocationField && isLocationApiFieldKey(field.key_name)) return false;
    return !shouldOmitDynamicFieldForPropertyType(field.key_name, propertyTypeId, skipFieldRules, isDailyRental);
  });

  // Fallback when API omits dynamic_section (legacy / partial payloads). Prefer each field's dynamic_section from /dynamic_fields.
  const fieldSectionMap = {
    'beds': 'property-information',
    'bathrooms': 'property-information',
    'baths': 'property-information',
    'bedrooms': 'property-information',
    'is_furnished': 'property-information',
    'furnished': 'property-information',
    'area_unit_value': 'property-information',
    'area': 'property-information',
    'completion_status': 'property-information',
    'sale_type': 'property-information',
    'location_id': 'property-location',
    'location_info': 'property-location',
    'location-info': 'property-location',
    'national_address': 'property-location',
    'additional_number': 'property-location',
    'property_images': 'property-images',
    'images': 'property-images',
    'videos': 'property-images',
    'price': 'price-features',
    'title': 'price-features',
    'description': 'price-features',
    'rental_price': 'price-features',
    'rent_frequency': 'price-features',
    'rental_frequency': 'price-features',
    'features': 'price-features',
    'feature_and_amenities': 'price-features',
    'property_title_en': 'price-features',
    'property_title_ar': 'price-features',
    'property_description_en': 'price-features',
    'property_description_ar': 'price-features',
    'redirection_link': 'price-features',
    'mobile': 'contact-information',
    'phone': 'contact-information',
    'posting_as': 'contact-information',
    'user_id': 'contact-information',
  };

  const sectionDefinitions = {
    'property-information': {
      id: 1,
      name: 'Property Information',
      name_l1: 'معلومات العقار',
      slug: 'property-information',
      display_order: 1,
      icon: 'PropertyInformationIcon',
    },
    'property-location': {
      id: 2,
      name: 'Property Location',
      name_l1: 'موقع العقار',
      slug: 'property-location',
      display_order: 2,
      icon: 'IconLocationPurpose',
    },
    'property-images': {
      id: 3,
      name: 'Property Images',
      name_l1: 'صور العقار',
      slug: 'property-images',
      display_order: 3,
      icon: 'IconImagesPost',
    },
    'price-features': {
      id: 4,
      name: 'Price & Features',
      name_l1: 'السعر والمميزات',
      slug: 'price-features',
      display_order: 4,
      icon: 'IconAdInformation',
    },
    'contact-information': {
      id: 5,
      name: 'Contact Information',
      name_l1: 'معلومات التواصل',
      slug: 'contact-information',
      display_order: 5,
      icon: 'IconContactInfo',
    },
  };

  const resolveDynamicSectionForField = (field) => {
    const api = field.dynamic_section;
    if (api && api.slug != null && String(api.slug).trim() !== '') {
      return {
        id: api.id,
        name: api.name ?? 'Default',
        name_l1: api.name_l1 ?? null,
        slug: api.slug,
        display_order: api.display_order ?? 999,
        secondary_display_order: api.secondary_display_order,
      };
    }
    const sectionSlug =
      fieldSectionMap[field.key_name] ||
      fieldSectionMap[field.original_key_name] ||
      'default';
    const def = sectionDefinitions[sectionSlug];
    if (def) {
      return {
        id: def.id,
        name: def.name,
        name_l1: def.name_l1,
        slug: def.slug,
        display_order: def.display_order,
      };
    }
    return {
      id: 999,
      name: 'Default',
      name_l1: null,
      slug: 'default',
      display_order: 999,
    };
  };

  // Map API field names to expected formik field names (API static_fields key_name → form keys)
  const mapFieldName = (apiKeyName) => mapApiKeyNameToFormKey(apiKeyName);

  const showDailyRentalRedirectionField =
    Boolean(isDailyRental) &&
    Boolean(tenantConstants.DAILY_RENTAL_REDIRECTION) &&
    Boolean(user?.is_daily_rental_redirection_enabled);

  const isRedirectionLinkField = (keyName, originalKeyName) =>
    keyName === 'redirection_link' || originalKeyName === 'redirection_link';

  // Filter out fields where display is false
  // Only include fields where display === true (explicit check)
  // Also map field names to expected formik names
  const filteredDynamicFields = apiDynamicFields
    .filter((field) => field.display === true)
    .map((field) => {
      // Map the key_name to expected formik field name
      const mappedKeyName = mapFieldName(field.key_name);
      return {
        ...field,
        key_name: mappedKeyName,
        original_key_name: field.key_name, // Keep original for reference if needed
      };
    })
    .filter((field) => {
      if (!isRedirectionLinkField(field.key_name, field.original_key_name)) return true;
      return showDailyRentalRedirectionField;
    });

  // Dynamic fields only (mobile, posting_as / user_id, etc. come from API when static_fields=true)
  const allFields = [];

  filteredDynamicFields.forEach((field) => {
    field.dynamic_section = resolveDynamicSectionForField(field);

    const existingIndex = allFields.findIndex((sf) => sf.key_name === field.key_name);
    if (existingIndex >= 0) {
      const prev = allFields[existingIndex];
      if (prev.dynamic_section) {
        field.dynamic_section = prev.dynamic_section;
      }
      allFields[existingIndex] = field;
    } else {
      allFields.push(field);
    }
  });

  const dynamic_fields = allFields;

  // Build dependency map (if tree structure exists)
  const dependsOnMap = {};
  dynamic_fields?.forEach((field) => {
    if (field?.tree?.children?.length > 0) {
      field.tree.children.forEach((child) => {
        if (!dependsOnMap[child.id]) {
          dependsOnMap[child.id] = {
            depends_on: field?.tree?.key_name,
          };
        }
      });
    }
    // Also check parent_id for dependencies
    if (field?.parent_id && !dependsOnMap[field.id]) {
      // Find parent field by parent_id
      const parentField = dynamic_fields.find((f) => f.id === field.parent_id);
      if (parentField) {
        dependsOnMap[field.id] = {
          depends_on: parentField.key_name,
        };
      }
    }
  });

  const sectionMap = {};
  const formFields = {};

  // First pass: Build section map from all fields
  // Fields are already filtered, so we can process all of them
  dynamic_fields.forEach((field) => {
    if (field?.dynamic_section) {
      const { id, name, name_l1, slug, display_order, secondary_display_order, icon } = field.dynamic_section;

      if (!sectionMap[slug]) {
        sectionMap[slug] = {
          id,
          title: name,
          title_l1: name_l1,
          slug: slug,
          display_order: getDynamicDisplaySortOrder(
            { display_order, secondary_display_order },
            useSecondaryDisplayOrder,
            999,
          ),
          icon: icon, // Preserve icon from dynamic_section if available
          fields: [],
        };
      }
    }
  });

  const sortDynamicFieldOptions = (opts) =>
    [...(opts || [])].sort(
      (a, b) =>
        getDynamicDisplaySortOrder(a, useSecondaryDisplayOrder, 0) -
        getDynamicDisplaySortOrder(b, useSecondaryDisplayOrder, 0),
    );

  // Map data_type to JSONForm type (aligned with API: data_type + ui_type from /api/surge/dynamic_fields)
  // Priority: ui_type from API > data_type mapping
  const mapDataTypeToFormType = (data_type, ui_type) => {
    // If ui_type is provided from API, use it directly (highest priority)
    if (ui_type) {
      // Normalize common ui_type variations
      const normalizedUiType = ui_type.toLowerCase().trim();

      // Map common variations to standard types (API samples: radio, input, select, add-amenities)
      const uiTypeMap = {
        'number': 'input',
        'text': 'input',
        'textarea': 'input',
        'dropdown': 'select',
        'select': 'select',   // API ui_type "select" -> JSONForm Select (dropdown)
        'multiselect': 'checkbox-group',
        'singleselect': 'radio',
        'toggle': 'switch',
        'boolean': 'switch',
        'add-amenities': 'add-amenities', // API ui_type for features
        'video-select-bank': 'video-select-bank',
      };

      return uiTypeMap[normalizedUiType] || normalizedUiType;
    }

    // Fallback to data_type mapping if ui_type is not provided
    const typeMap = {
      'decimal': 'input',
      'integer': 'input',
      'number': 'input',
      'string': 'input',
      'text': 'input',
      'single-select': 'radio',
      'multi-select': 'checkbox-group',
      'boolean': 'switch',
      'location-select': 'location-select',
      'phone': 'phone-input-verification',
      'image-select': 'image-select',
      'image-select-bank': 'image-select-bank',
      'video-select-bank': 'video-select-bank',
      'generate-content': 'generate-content',
      'datetime': 'input',  // API data_type; render as input (or add date picker later)
      'json': 'input',      // API data_type; usually display:false, fallback input
      'uuid': 'input',      // API data_type; usually display:false, fallback input
    };
    return typeMap[data_type] || 'input';
  };

  dynamic_fields.forEach((field) => {
    // Fields are already filtered to only include display === true, so no need to check again
    // But keep this check as a safety measure
    if (field.display === false) return;

    const {
      key_name,
      original_key_name: origKeyFromApi,
      data_type: rawDataType,
      ui_type: rawUiType,
      label,
      label_l1,
      is_required,
      max_length,
      min_length,
      max_value,
      min_value,
      unit,
      dynamic_field_options = [],
      dynamic_section,
      display_order,
      secondary_display_order,
      lang_regex,
      lang_l1_regex,
      regex,
      trigger_regex,
      id,
      is_editable: apiIsEditable,
      validation_strategy,
      validation_params,
      validation_messages,
      ...rest
    } = field;

    const original_key_name = origKeyFromApi ?? key_name;
    const fieldRequired = is_required === true;

    const isMobileContactField =
      key_name === 'mobile' || original_key_name === 'mobile' || original_key_name === 'phone';
    const effectiveDataType = isMobileContactField ? 'phone' : rawDataType;
    const effectiveUiType = isMobileContactField ? 'phone-input-verification' : rawUiType;

    const isPostingAsField = key_name === 'posting_as' || original_key_name === 'user_id';

    const validationFn = getValidationFunction(
      effectiveDataType,
      effectiveUiType,
      key_name,
      label,
      label_l1,
      lang_regex,
      lang_l1_regex,
      is_required,
      trigger_regex,
      dependsOnMap,
      id,
      max_value,
      min_value,
      regex,
      max_length,
      min_length,
      original_key_name,
      validation_strategy,
      validation_params,
      validation_messages,
    );

    let formType = isPostingAsField ? 'select' : mapDataTypeToFormType(effectiveDataType, effectiveUiType);

    const apiReadOnly = isDynamicFieldReadOnly(apiIsEditable);
    /** Location editability is Formik `is_location_editable` (from listing edit API), not dynamic field `is_editable`. */
    const isLocationField =
      formType === 'location-select' || key_name === 'location_id' || effectiveUiType === 'location-select';

    /** Canonical Formik key for location composite (hyphen); API may send `location_id` or `location_info`. */
    const formFieldKey = mapApiKeyNameToFormKey(key_name) === 'location-info' ? 'location-info' : key_name;

    // Icon mapping for fields (matching old form)
    const getFieldIcon = (keyName, dataType) => {
      const iconMap = {
        // Bedrooms and Bathrooms
        'bedrooms': 'LuBedDouble',
        'beds': 'LuBedDouble',
        'bathrooms': 'BiBath',
        'baths': 'BiBath',
        // Furnished
        'furnished': 'LuLamp',
        'is_furnished': 'LuLamp',
        // Area
        'area': 'IconAreaSize',
        'area_unit_value': 'IconAreaSize',
        // Price
        'price': 'RiPriceTag3Line',
        'rental_price': 'RiPriceTag3Line',
        'rent_frequency': 'MdOutlineMap',
        'rental_frequency': 'MdOutlineMap',
        // Images
        'property_images': 'LuImage',
        'images': 'LuImage',
        'videos': 'AiOutlineVideoCamera',
        // Location
        'location_info': 'IconLocationPurpose',
        'location-info': 'IconLocationPurpose',
        'location_select': 'IconLocationPurpose',
        'location': 'IconLocationPurpose',
        'region': 'IconLocationPurpose',
        'city': 'IconLocationPurpose',
        'national_address': 'IconNavigate',
        'additional_number': 'MdOutlineMap',
        // Phone
        'mobile': 'MdSmartphone',
        'phone': 'MdSmartphone',
        // Title and Description
        'property_title_en': 'PiTextT',
        'property_title_ar': 'PiTextT',
        'property_description_en': 'BiDetail',
        'property_description_ar': 'BiDetail',
        // Posting As
        'posting_as': 'FiUser',
        // Residence type (family / singles / open to all)
        'residence_type': 'FiUsers',
        // Amenities
        'feature_and_amenities': 'MdOutlineOtherHouses',
        'features': 'MdOutlineOtherHouses',
        // Completion Status
        'completion_status': 'IconCompletionStatus',
        // Sale Type
        'sale_type': 'BiBuildingHouse',
        // Purpose and Property Type
        'purpose': 'MdOutlineCheckCircle',
        'property_type': 'BiBuildingHouse',
        // Booking Link
        'redirection_link': 'FaLink',
      };

      // Try exact match first
      if (iconMap[keyName]) return iconMap[keyName];

      // Try partial matches
      if (keyName.includes('bedroom') || keyName.includes('bed')) return 'LuBedDouble';
      if (keyName.includes('bathroom') || keyName.includes('bath')) return 'BiBath';
      if (keyName.includes('title')) return 'PiTextT';
      if (keyName.includes('description')) return 'BiDetail';
      if (keyName.includes('image')) return 'LuImage';
      if (keyName.includes('location') || keyName.includes('region')) return 'IconLocationPurpose';
      if (keyName.includes('phone') || keyName.includes('mobile')) return 'MdSmartphone';
      if (keyName.includes('residence')) return 'FiUsers';
      if (keyName.includes('frequency') && (keyName.includes('rent') || keyName.includes('rental'))) {
        return 'MdOutlineMap';
      }
      if (keyName.includes('price') || keyName.includes('rent')) {
        return 'RiPriceTag3Line';
      }

      return undefined; // No icon if not found
    };

    const fieldIcon = getFieldIcon(key_name, effectiveDataType);
    // not sure why this was done again adding the icon since its not present
    const shouldAddLabelIcon = !!fieldIcon;

    const useArabicCopyForGenerateContent =
      formType === 'generate-content' && String(key_name).endsWith('_ar');

    formFields[formFieldKey] = {
      type: formType,
      validation: validationFn,
      value: field.default_value || (rawDataType === 'multi-select' ? [] : null),
      props: {
        label: useArabicCopyForGenerateContent && field.label_l1
          ? field.label_l1
          : tenantUtils.getLocalisedString(field, 'label'),
        placeholder: useArabicCopyForGenerateContent && field.place_holder_l1
          ? field.place_holder_l1
          : tenantUtils.getLocalisedString(field, 'place_holder'),
        maxLength: max_length || undefined,
        unit: unit ? unit : null,
        dependsOn: dependsOnMap[field?.id]?.depends_on,
        is_required: fieldRequired,
        isOptional: !fieldRequired, // Strict: only true when API is_required === true
        dynamic_field_options,
        trigger_regex,
        dependsOnMap,
        id,
        ...(shouldAddLabelIcon && { labelIcon: fieldIcon }), // Add icon if found (skip for phone to avoid duplicate icon)
        ...(rawDataType === 'decimal' || rawDataType === 'integer' || rawDataType === 'number'
          ? {
              type: 'number',
              ...(rawDataType === 'integer' ? { step: 1 } : {}),
            }
          : {}),
        ...rest,
        ...(apiReadOnly && !isLocationField && !isMobileContactField ? { disabled: true } : {}),
        ...(formType === 'location-select' ? { isLocationOptional: true } : {}),
      },
      section: dynamic_section?.slug,
      display_order: getDynamicDisplaySortOrder(
        { display_order, secondary_display_order },
        useSecondaryDisplayOrder,
        0,
      ),
    };

    // Add field to its section (Formik / formFields key, e.g. `location-info` for all location composites)
    if (dynamic_section?.slug && sectionMap[dynamic_section.slug]) {
      sectionMap[dynamic_section.slug].fields.push(formFieldKey);
    } else if (dynamic_section?.slug) {
      // Create section if it doesn't exist (shouldn't happen, but just in case)
      sectionMap[dynamic_section.slug] = {
        id: dynamic_section.id,
        title: dynamic_section.name,
        title_l1: dynamic_section.name_l1,
        slug: dynamic_section.slug,
        display_order: getDynamicDisplaySortOrder(dynamic_section, useSecondaryDisplayOrder, 999),
        fields: [formFieldKey],
      };
    }

    // Handle select fields (single-select and multi-select)
    // Skip if ui_type is "add-amenities" as it has its own handling
    if (
      (rawDataType === 'single-select' || rawDataType === 'multi-select') &&
      formType !== 'add-amenities' &&
      formType !== 'video-select-bank'
    ) {
      const options = sortDynamicFieldOptions(dynamic_field_options);
      const mappedOptions = options.map((option) => ({
        label: option?.label,
        label_l1: option?.label_l1,
        value: option?.value,
        value_l1: option?.value_l1,
        slug: option?.slug ?? null,
        id: option?.id,
        ...(option?.color_code && { color_code: option?.color_code }),
        ...(option?.parent_id && { parent_id: option?.parent_id }),
      }));

      formFields[formFieldKey].props.options = mappedOptions;
      // Common Select expects getOptionLabel/getOptionValue for options with label/value
      formFields[formFieldKey].props.getOptionLabel = (op) =>
        tenantUtils.getLocalisedString(op, 'label') || op?.label || op?.value;
      formFields[formFieldKey].props.getOptionValue =
        key_name === 'sale_type'
          ? (op) => op.slug
          : key_name === 'residence_type'
            ? (op) => op?.label ?? op?.value ?? op?.id
            : (op) => op?.value ?? op?.id;

      if (rawDataType === 'multi-select') {
        formFields[formFieldKey].props.mode = 'multiple';
        formFields[formFieldKey].props.allowClear = true;
      }
    }

    // Handle multi-select fields with ui_type: "add-amenities" (e.g., features)
    // These use the AddAmenities component which has its own data structure
    if (rawDataType === 'multi-select' && formType === 'add-amenities') {
      // AddAmenities component expects the field to be set up but doesn't need options/mode props
      // The component will fetch amenities based on property_type
      // Just ensure the field is properly configured
    }

    // Handle boolean fields with ui_type: "radio" (e.g., furnished)
    // These should render as RadioButtons with Yes/No options
    // RadioButtons expects string values ('1'/'0') to match the buttonList keys
    if (rawDataType === 'boolean' && formType === 'radio') {
      const buttonList = [
        { key: '1', label: t('Yes') },
        { key: '0', label: t('No') },
      ];

      // Preserve labelIcon if already set
      const existingLabelIcon = formFields[formFieldKey].props.labelIcon;

      formFields[formFieldKey].props = {
        ...formFields[formFieldKey].props,
        valueKey: 'key',
        shape: 'round',
        buttonList: buttonList,
        ...(existingLabelIcon && { labelIcon: existingLabelIcon }), // Preserve icon
      };

      // Set default value to '0' (No) if not provided, matching old form behavior
      if (formFields[formFieldKey].value === null || formFields[formFieldKey].value === undefined) {
        formFields[formFieldKey].value = '0';
      } else if (typeof formFields[formFieldKey].value === 'boolean') {
        // Convert boolean to string format expected by RadioButtons
        formFields[formFieldKey].value = formFields[formFieldKey].value ? '1' : '0';
      }
    }

    // single-select with ui_type "radio" -> RadioButtons (buttonList); ui_type "select" -> Select (options only)
    if (rawDataType === 'single-select' && formType === 'radio') {
      const buttonList = sortDynamicFieldOptions(dynamic_field_options).map((option) => ({
        id: option?.id,
        label: option?.label,
        label_l1: option?.label_l1 || null,
        value: option?.value,
        value_l1: option?.value_l1 ?? null,
        display_order: option?.display_order || null,
        parent_id: option?.parent_id || null,
        dynamic_section: option?.dynamic_section || null,
        slug: option?.slug ?? null,
      }));

      // rental_frequency: match edit payload / dynamic_fields on option slug (stable across envs)
      const isRentalFrequency = key_name === 'rental_frequency';
      const isSaleType = key_name === 'sale_type';
      const isFurnishedField = key_name === 'furnished';
      const existingLabelIcon = formFields[formFieldKey].props.labelIcon;
      formFields[formFieldKey].props = {
        ...formFields[formFieldKey].props,
        valueKey: isRentalFrequency ? 'slug' : isSaleType || isFurnishedField ? 'slug' : 'label',
        ...(isSaleType || isFurnishedField ? { getKey: (item) => item?.slug ?? item?.key ?? item?.id } : {}),
        valueAsObj: true,
        shape: 'round',
        buttonList: buttonList,
        ...(existingLabelIcon && { labelIcon: existingLabelIcon }),
      };
    }
    // single-select with formType 'select' keeps options from block above (JSONForm Select uses options)

    if (effectiveDataType === 'phone') {
      // Preserve labelIcon if already set
      const existingLabelIcon = formFields[formFieldKey].props.labelIcon;
      const shouldDisableForVerifiedUser =
        !!user?.is_mobile_verified && (!!user?.['phone'] || !!user?.['mobile']);

      formFields[formFieldKey].props = {
        ...formFields[formFieldKey].props,
        containerClassName: 'pos-rel',
        defaultCountry: tenantConstants.COUNTRY_CODE,
        countrySelectProps: { disabled: true },
        ...(existingLabelIcon && { labelIcon: existingLabelIcon }), // Preserve icon
        ...(user && {
          // Keep field interactive for unverified users so Verify CTA is available.
          disabled: shouldDisableForVerifiedUser,
          isUserVerified: user?.is_mobile_verified,
          userType: 'User',
          userId: user?.id,
        }),
      };
    }

    if (effectiveDataType === 'location-select' && cities?.length > 0) {
      // Preserve labelIcon if already set
      const existingLabelIcon = formFields[formFieldKey].props.labelIcon;

      formFields[formFieldKey].props = {
        ...formFields[formFieldKey].props,
        initialOptions: cities?.map((city) => ({
          ...city,
          label: tenantUtils.getLocalisedString(city, 'title'),
        })),
        ...(existingLabelIcon && { labelIcon: existingLabelIcon }), // Preserve icon
      };
    }

    // Handle generate-content fields (title and description); PostListingForm overwrites with formik-aware props
    if (formType === 'generate-content') {
      const isTitle = key_name.includes('title');
      const isDescription = key_name.includes('description');
      const isArabicField = key_name.includes('_ar');
      const isEnglishField = key_name.includes('_en');

      formFields[formFieldKey].props = {
        ...formFields[formFieldKey].props,
        labelIcon: isTitle ? 'PiTextT' : 'BiDetail',
        desc: isTitle ? 'title' : 'description',
        lineCount: isDescription ? 5 : 1,
        limit: isDescription ? 2500 : undefined,
        showAutoSwitch: (isTitle && isEnglishField) || (isDescription && isEnglishField),
        name: key_name,
        dir: isArabicField ? 'rtl' : '',
        payloadKey: isEnglishField ? (isTitle ? 'title' : 'description') : (isTitle ? 'title_l1' : 'description_l1'),
        skipField: isEnglishField
          ? (isTitle ? 'property_description_en' : 'property_title_en')
          : (isTitle ? 'property_description_ar' : 'property_title_ar'),
      };
    }

    // Handle image-select-bank fields
    if (formType === 'image-select-bank') {
      // Preserve labelIcon if already set
      const existingLabelIcon = formFields[formFieldKey].props.labelIcon;

      formFields[formFieldKey].props = {
        ...formFields[formFieldKey].props,
        valueKey: key_name,
        filesAllowed: ['image/jpeg', 'image/png', 'image/webp'],
        imageBankIcon: field.showImageBank || false,
        showImageBank: field.showImageBank || false,
        multi: field.multi !== false,
        attachmentType: field.attachmentType || 'listing_images',
        ...(existingLabelIcon && { labelIcon: existingLabelIcon }), // Preserve icon
      };
    }

    if (formType === 'video-select-bank') {
      const existingLabelIcon = formFields[formFieldKey].props.labelIcon;
      formFields[formFieldKey].props = {
        ...formFields[formFieldKey].props,
        valueKey: key_name,
        hostList: tenantData.videoHostsList || [],
        ...(existingLabelIcon && { labelIcon: existingLabelIcon }),
      };
    }

    // Handle area fields - add suffix with area unit and useInternalState (matching old form)
    if (key_name === 'area' || key_name === 'area_unit_value') {
      // Preserve existing props
      const existingProps = formFields[formFieldKey].props;
      const areaUnitText = tenantData?.areaUnitList?.[0]?.title_short;

      formFields[formFieldKey].props = {
        ...existingProps,
        useInternalState: true,
        // Store area unit text - JSONForm will handle creating the JSX suffix
        areaUnitSuffix: areaUnitText ? t(areaUnitText) : "",
        // Ensure type is number for area fields
        type: 'number',
      };
    }

    // Handle price fields - add suffix with currency symbol and useInternalState (matching old form)
    if (key_name === 'price' || key_name === 'rental_price') {
      // Preserve existing props
      const existingProps = formFields[formFieldKey].props;
      const currencySymbol = existingProps.unit || tenantConstants.CURRENCY_SYMBOL();
      const priceFieldKey = key_name;

      const bracketFromProps = Object.prototype.hasOwnProperty.call(
        existingProps,
        'labelSuffixInBrackets',
      )
        ? existingProps.labelSuffixInBrackets
        : currencySymbol != null && currencySymbol !== ''
          ? currencySymbol
          : null;

      // Daily rental: hide currency in label brackets only; input suffix (`priceSuffix`) stays (see TextInput).
      const labelSuffixInBrackets =
        isDailyRental && bracketFromProps !== false ? false : bracketFromProps;

      formFields[formFieldKey].props = {
        ...existingProps,
        useInternalState: true,
        // Store currency symbol as suffix - JSONForm will handle creating the JSX suffix
        priceSuffix: currencySymbol || "",
        /** Shown in the label as `Label ( … )` — overridable per field via `labelSuffixInBrackets` */
        labelSuffixInBrackets,
        // Ensure type is number for price fields
        type: 'number',
        extra: (form) => () => {
          const raw = form?.values[priceFieldKey];
          if (!raw || form.errors?.[priceFieldKey]) return null;
          const n = Number(String(raw).replace(/,/g, '').trim());
          if (!Number.isFinite(n)) return null;
          const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(n);
          return (
            <Flex
              align="center"
              gap="8px"
              style={{ color: '#A3A3A3', fontSize: 14, lineHeight: 1, fontWeight: 400 }}
            >
              <span
                className="color-gray-dark"
                style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
              >
                {currencySymbol}
              </span>
              <span>{formatted}</span>
            </Flex>
          );
        },
      };
    }
  });

  if (injectClientLocationField && !formFields['location-info']) {
    const key_name = 'location-info';
    const cityLabelEn = tenantConstants.LISTING_LOCATIONS?.label || 'City';
    const cityLabelL1 = 'المدينة';
    const INJECTED_LOC_FIELD_ID = 9000001;
    const validationFn = getValidationFunction(
      'location-select',
      'location-select',
      key_name,
      cityLabelEn,
      cityLabelL1,
      null,
      null,
      true,
      null,
      dependsOnMap,
      INJECTED_LOC_FIELD_ID,
      null,
      null,
      null,
      null,
      null,
      'location_id',
      null,
      null,
      null,
    );
    const slug = 'property-location';
    if (!sectionMap[slug]) {
      const def = sectionDefinitions[slug];
      sectionMap[slug] = {
        id: def.id,
        title: def.name,
        title_l1: def.name_l1,
        slug: def.slug,
        display_order: def.display_order,
        fields: [],
      };
    }
    formFields['location-info'] = {
      type: 'location-select',
      validation: validationFn,
      value: null,
      props: {
        is_required: true,
        isOptional: false,
        labelIcon: 'IconLocationPurpose',
        isLocationOptional: true,
      },
      section: slug,
      display_order: 20,
    };
    if (!sectionMap[slug].fields.includes('location-info')) {
      sectionMap[slug].fields.push('location-info');
    }
  }

  const sectionsOrdered = Object.values(sectionMap).sort((a, b) => a.display_order - b.display_order);

  // Sort fields within each section by display_order
  sectionsOrdered.forEach((section) => {
    section.fields.sort((a, b) => {
      const orderA = formFields[a]?.display_order || 0;
      const orderB = formFields[b]?.display_order || 0;
      return orderA - orderB;
    });
  });

  // Icon mapping for sections (matching old form style)
  const getSectionIcon = (section) => {
    // If icon is already set in section, use it
    if (section.icon) return section.icon;

    const iconMap = {
      'property-information': 'PropertyInformationIcon',
      'property-location': 'IconLocationPurpose',
      'property-images': 'IconImagesPost',
      'price-features': 'IconAdInformation',
      'contact-information': 'IconContactInfo',
      'package-credits': 'IconPackageCredit',
      'title-description': 'IconFeaturesAmenities',
      'title-and-description': 'IconFeaturesAmenities',
    };

    // Try slug first
    if (iconMap[section.slug]) return iconMap[section.slug];

    // Fallback: check name/slug variations
    const nameLower = (section.title || '').toLowerCase();
    if (
      nameLower.includes('title') &&
      (nameLower.includes('description') || nameLower.includes('&')) &&
      !nameLower.includes('translate')
    ) {
      return 'IconFeaturesAmenities';
    }
    if (nameLower.includes('property information') || nameLower.includes('property information')) {
      return 'PropertyInformationIcon';
    }
    if (nameLower.includes('location') || section.slug?.includes('location')) {
      return 'IconLocationPurpose';
    }
    if (nameLower.includes('image') || section.slug?.includes('image')) {
      return 'IconImagesPost';
    }
    if (nameLower.includes('price') || nameLower.includes('feature') || section.slug?.includes('price')) {
      return 'IconAdInformation';
    }
    if (nameLower.includes('contact') || section.slug?.includes('contact')) {
      return 'IconContactInfo';
    }
    if (nameLower.includes('package') || nameLower.includes('credit')) {
      return 'IconPackageCredit';
    }

    // Default icon
    return 'PropertyInformationIcon';
  };

  // Return sections with fields and formFields list
  const result = sectionsOrdered.map((section) => ({
    title: tenantUtils.getLocalisedString(section, 'title'),
    id: section.id,
    slug: section.slug,
    icon: getSectionIcon(section),
    fields: section.fields,
    list: formFields,
  }));

  // Payload definitions: keys come only from API key_name (single source of truth from /api/surge/dynamic_fields)
  const dynamicFieldDefinitions = (response?.dynamic_fields || [])
    .filter((f) => {
      if (injectClientLocationField && isLocationApiFieldKey(f.key_name)) return false;
      const formKey = mapFieldName(f.key_name);
      if (!isRedirectionLinkField(formKey, f.key_name)) return true;
      return showDailyRentalRedirectionField;
    })
    .map((f) => {
    const rawOptions = (f.dynamic_field_options || []).map((opt) => ({
      id: opt.id,
      label: opt.label,
      label_l1: opt.label_l1,
      value: opt.value,
      value_l1: opt.value_l1,
      slug: opt.slug ?? opt.option_slug ?? null,
      format_type: opt.format_type ?? null,
      dynamic_section: opt.dynamic_section ?? null,
      display_order: opt.display_order ?? 0,
      secondary_display_order: opt.secondary_display_order,
    }));
    const options = rawOptions
      .slice()
      .sort(
        (a, b) =>
          getDynamicDisplaySortOrder(a, useSecondaryDisplayOrder, 0) -
          getDynamicDisplaySortOrder(b, useSecondaryDisplayOrder, 0),
      );
    return {
      apiKeyName: f.key_name, // payload key name (root or under dynamic_fields per destination_key)
      formKeyName: mapFieldName(f.key_name),
      data_type: f.data_type || 'string',
      options,
      /** Field-level slug from /dynamic_fields (e.g. location_id → "location"); sent on scalar wrapper objects. */
      fieldSlug: f.slug ?? null,
      /** API path: same as key_name → listing root; `dynamic_data.dynamic_fields.*` → nested. */
      destinationKey: f.destination_key ?? null,
      display: f.display === true,
      is_required: f.is_required === true, // hidden required fields still get sent (with 1st option when they have options)
      is_editable: !isDynamicFieldReadOnly(f.is_editable),
    };
  });

  return { sections: result, dynamicFieldDefinitions };
};

export default { dynamicFormFieldMapper };

