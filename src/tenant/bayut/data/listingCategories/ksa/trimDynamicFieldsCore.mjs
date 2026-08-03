const stripOption = (o) => {
  if (!o || typeof o !== 'object') return o;
  const ds = o.dynamic_section;
  return {
    id: o.id,
    label: o.label,
    label_l1: o.label_l1,
    value: o.value,
    value_l1: o.value_l1,
    format_type: o.format_type ?? null,
    slug: o.slug ?? null,
    display_order: o.display_order,
    secondary_display_order: o.secondary_display_order,
    parent_id: o.parent_id,
    ...(ds && {
      dynamic_section: {
        id: ds.id,
        name: ds.name,
        name_l1: ds.name_l1,
        slug: ds.slug,
        display_order: ds.display_order,
        secondary_display_order: ds.secondary_display_order,
      },
    }),
  };
};

const stripField = (f) => {
  const ds = f.dynamic_section;
  const opts = Array.isArray(f.dynamic_field_options) ? f.dynamic_field_options.map(stripOption) : [];
  return {
    id: f.id,
    key_name: f.key_name,
    label: f.label,
    label_l1: f.label_l1,
    data_type: f.data_type,
    ui_type: f.ui_type ?? null,
    place_holder: f.place_holder ?? null,
    place_holder_l1: f.place_holder_l1 ?? null,
    regex: f.regex ?? null,
    lang_regex: f.lang_regex ?? null,
    lang_l1_regex: f.lang_l1_regex ?? null,
    trigger_regex: f.trigger_regex ?? null,
    default_value: f.default_value ?? null,
    default_value_l1: f.default_value_l1 ?? null,
    is_required: f.is_required,
    display: f.display,
    display_order: f.display_order,
    secondary_display_order: f.secondary_display_order,
    max_length: f.max_length,
    max_value: f.max_value,
    min_length: f.min_length,
    min_value: f.min_value,
    multilang_enabled: f.multilang_enabled,
    destination_key: f.destination_key ?? null,
    filter_type: f.filter_type ?? null,
    slug: f.slug ?? null,
    unit: f.unit ?? null,
    is_editable: f.is_editable,
    parent_id: f.parent_id,
    ...(f.original_key_name != null && { original_key_name: f.original_key_name }),
    ...(f.validation_strategy != null && { validation_strategy: f.validation_strategy }),
    ...(f.validation_params != null && { validation_params: f.validation_params }),
    ...(f.validation_messages != null && { validation_messages: f.validation_messages }),
    dynamic_field_options: opts,
    ...(ds && {
      dynamic_section: {
        id: ds.id,
        name: ds.name,
        name_l1: ds.name_l1,
        slug: ds.slug,
        display_order: ds.display_order,
        secondary_display_order: ds.secondary_display_order,
      },
    }),
  };
};

/** @param {object} raw Parsed API body `{ dynamic_fields: [...] }` or a field array */
export function trimDynamicFieldsPayload(raw) {
  const rows = raw?.dynamic_fields ?? raw;
  if (!Array.isArray(rows)) {
    throw new Error('Expected { dynamic_fields: [] } or an array');
  }
  return { dynamic_fields: rows.map(stripField) };
}
