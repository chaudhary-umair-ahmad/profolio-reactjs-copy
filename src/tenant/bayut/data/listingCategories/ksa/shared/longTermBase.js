import { mergeKsaDynamicFields } from '../mergeCommonDynamicFields';
import longTermKsaOnly from './dynamicFieldsResponse.json';

export function getLongTermKsaBaseDynamicFieldsResponse() {
  return mergeKsaDynamicFields(longTermKsaOnly);
}
