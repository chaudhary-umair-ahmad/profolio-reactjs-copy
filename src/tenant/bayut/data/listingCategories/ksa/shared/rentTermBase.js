import common from '../dynamicFieldsCommon.json';
import longTermKsa from './dynamicFieldsResponse.json';
import rentKsaOnly from './rentDynamicFieldsResponse.json';
import { mergeDynamicFieldsResponses } from '../../../../../common/data/listingCategories/utils/dynamicFieldsResponse';

const RENT_LONG_TERM_FIELD_KEYS = new Set([
  'location_id',
  'title',
  'title_l1',
  'description',
  'description_l1',
]);

export function getRentKsaBaseDynamicFieldsResponse() {
  const fromLongTerm = (longTermKsa?.dynamic_fields || []).filter((f) => RENT_LONG_TERM_FIELD_KEYS.has(f.key_name));
  return mergeDynamicFieldsResponses(common, { dynamic_fields: fromLongTerm }, rentKsaOnly);
}
