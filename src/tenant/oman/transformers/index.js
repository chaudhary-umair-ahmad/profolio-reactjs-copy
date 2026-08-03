import agency from './agency';
import cart from './cart';
import dynamicformfieldsmapper from './dynamicformfieldsmapper';
import user from './user';
import reports from './reports';
import quotaCredits from './quotaCredits';
import { TENANT_KEY } from '../../../utility/env';

const omanTransformers = Object.freeze({
  key: TENANT_KEY,
  ...agency,
  ...cart,
  ...dynamicformfieldsmapper,
  ...user,
  ...quotaCredits,
  ...reports,
});

export default omanTransformers;
