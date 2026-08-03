
const PROJECT_SECTIONS = {
  'property-information': {
    id: 1,
    name: 'Property Information',
    name_l1: 'معلومات العقار',
    slug: 'property-information',
    display_order: 1,
    secondary_display_order: 1,
  },
  'property-location': {
    id: 20,
    name: 'Property Location',
    name_l1: 'موقع العقار',
    slug: 'property-location',
    display_order: 2,
    secondary_display_order: 2,
  },
  'property-images': {
    id: 30,
    name: 'Property Images',
    name_l1: 'صور العقار',
    slug: 'property-images',
    display_order: 3,
    secondary_display_order: 3,
  },
  'price-and-specs': {
    id: 35,
    name: 'Price & Features',
    name_l1: 'السعر والمميزات',
    slug: 'price-and-specs',
    display_order: 4,
    secondary_display_order: 4,
  },
  'contact-information': {
    id: 24,
    name: 'Contact Information',
    name_l1: 'معلومات الاتصال',
    slug: 'contact-information',
    display_order: 100,
    secondary_display_order: 500,
  },
};

const PROJECT_FIELD_OVERRIDES = {
  // Property Information
  beds:               { section: 'property-information', display_order: 10 },
  baths:              { section: 'property-information', display_order: 20 },
  furnished:          { section: 'property-information', display_order: 30 },

  area_unit_value:    { section: 'property-information', display_order: 40, display: true, is_editable: true },
  completion_status:  {
    section: 'property-information',
    display_order: 50,
    display: true,
    // Off-plan first, then Ready (overrides default static order).
    option_overrides: {
      'off-plan': { display_order: 1 },
      'ready':    { display_order: 2 },
    },
  },
  // Project layout renders sale_type as a dropdown instead of the default radios.
  sale_type:          { section: 'property-information', display_order: 60, display: true, ui_type: 'select' },

  location_id:        { section: 'property-location', display_order: 10 },

  // Property Images
  property_images:    { section: 'property-images', display_order: 10 },
  images:             { section: 'property-images', display_order: 10 },
  videos:             { section: 'property-images', display_order: 20 },

  // Price / specs: same slug as KSA `dynamicFieldsResponse` so all price/title/description fields stay in one section.
  price:              { section: 'price-and-specs', display_order: 10, is_editable: true },
  rental_price:       { section: 'price-and-specs', display_order: 11, is_editable: true },
  rent_frequency:     { section: 'price-and-specs', display_order: 15 },
  rental_frequency:   { section: 'price-and-specs', display_order: 15 },
  features:           { section: 'price-and-specs', display_order: 20 },
  title:              { section: 'price-and-specs', display_order: 30 },
  title_l1:           { section: 'price-and-specs', display_order: 31 },
  description:        { section: 'price-and-specs', display_order: 40 },
  description_l1:     { section: 'price-and-specs', display_order: 41 },

  // Contact Information
  mobile:             { section: 'contact-information', display_order: 10 },
  phone:              { section: 'contact-information', display_order: 10 },

  // Hidden for project listings
  national_address:   { display: false },
  user_id:            { display: false },
  residence_type:     { display: false },
};

/** Synthetic fields appended to the response when project-attached. */
const buildAdditionalNumberField = () => ({
  id: 9000010,
  key_name: 'additional_number',
  label: 'Additional / Unit Number',
  label_l1: 'الرقم الإضافي / رقم الوحدة',
  data_type: 'string',
  ui_type: 'input',
  place_holder: 'Enter Additional / Unit Number',
  place_holder_l1: 'أدخل الرقم الإضافي / رقم الوحدة',
  regex: null,
  lang_regex: null,
  lang_l1_regex: null,
  trigger_regex: null,
  default_value: null,
  default_value_l1: null,
  is_required: false,
  display: true,

  display_order: 30,
  max_length: null,
  max_value: null,
  min_length: null,
  min_value: null,
  multilang_enabled: false,

  destination_key: 'unit_no',
  filter_type: null,
  slug: 'additional_number',
  unit: null,
  is_editable: true,
  parent_id: null,
  dynamic_field_options: [],
  dynamic_section: PROJECT_SECTIONS['property-location'],
});

const cloneSection = (slug) => ({ ...PROJECT_SECTIONS[slug] });

/**
 * @param {object} response - Static / surge dynamic_fields response (must have `dynamic_fields: []`).
 * @returns {object} New response shaped for the project-listing form.
 */
export function applyBayutKsaProjectListingOverrides(response) {
  if (!response || !Array.isArray(response.dynamic_fields)) return response;

  const remappedFields = response.dynamic_fields.map((field) => {
    const override = PROJECT_FIELD_OVERRIDES[field?.key_name];
    if (!override) return field;
    const next = { ...field };
    if (override.section) {
      next.dynamic_section = cloneSection(override.section);
    }
    if (override.display_order != null) {
      next.display_order = override.display_order;
    }
    if (override.display != null) {
      next.display = override.display;
    }
    if (override.ui_type != null) {
      next.ui_type = override.ui_type;
    }
    if (override.is_editable != null) {
      next.is_editable = override.is_editable;
    }
    if (override.option_overrides && Array.isArray(field.dynamic_field_options)) {
      next.dynamic_field_options = field.dynamic_field_options.map((opt) => {
        const optKey =
          (opt?.slug != null && opt?.slug !== '' && override.option_overrides[opt.slug]) ||
          (opt?.value != null && override.option_overrides[String(opt.value)]) ||
          null;
        if (!optKey) return opt;
        const nextOpt = { ...opt };
        if (optKey.display_order != null) nextOpt.display_order = optKey.display_order;
        return nextOpt;
      });
    }
    return next;
  });

  remappedFields.push(buildAdditionalNumberField());

  return {
    ...response,
    dynamic_fields: remappedFields,
  };
}

export default { applyBayutKsaProjectListingOverrides };
