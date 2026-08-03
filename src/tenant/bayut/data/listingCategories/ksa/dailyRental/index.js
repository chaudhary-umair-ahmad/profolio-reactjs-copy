import { applyKsaDailyFieldLayer } from '../applyDailyFieldLayer';
import { mergeKsaDynamicFields } from '../mergeCommonDynamicFields';
import longTermKsaOnly from '../shared/dynamicFieldsResponse.json';
import dailyFieldLayer from './dailyFieldLayer.json';


export const getDailyRentalKsaStaticDynamicFieldsResponse = () =>
  applyKsaDailyFieldLayer(mergeKsaDynamicFields(longTermKsaOnly), dailyFieldLayer);
