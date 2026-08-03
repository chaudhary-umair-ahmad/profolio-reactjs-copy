import staticResponseConfig from './staticDynamicFieldsResponse.json';
import { buildDynamicFieldsResponse } from '../utils/dynamicFieldsResponse';

const DEFAULT_FIELD = {
  display: true,
  is_required: false,
  is_editable: true,
  destination_key: null,
  dynamic_field_options: [],
};

const resolveField = (fieldDef) => {
  const { sectionKey, optionsKey, ...rest } = fieldDef;
  return {
    ...DEFAULT_FIELD,
    ...rest,
    dynamic_section: staticResponseConfig.sections[sectionKey],
    dynamic_field_options: optionsKey ? staticResponseConfig.options[optionsKey] : [],
  };
};

const SHARED_FIELDS = staticResponseConfig.sharedFields.map(resolveField);
const FIELDS_BY_LISTING_PURPOSE = {
  sale: [...staticResponseConfig.saleFields.map(resolveField), ...SHARED_FIELDS],
  rent: [...staticResponseConfig.rentFields.map(resolveField), ...SHARED_FIELDS],
};

export function getCommonStaticDynamicFieldsResponse(arg) {
  const dynamicFields = FIELDS_BY_LISTING_PURPOSE[arg?.listingPurposeKey] || [];
  return buildDynamicFieldsResponse(dynamicFields);
}
