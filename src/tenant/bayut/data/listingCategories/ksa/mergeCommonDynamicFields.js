import common from './dynamicFieldsCommon.json';
import { mergeDynamicFieldsResponses } from '../../../../common/data/listingCategories/utils/dynamicFieldsResponse';

export function mergeKsaDynamicFields(flowSpecific) {
  return mergeDynamicFieldsResponses(common, flowSpecific);
}
