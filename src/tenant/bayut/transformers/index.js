import agency from './agency';
import cart from './cart';
import dynamicformfieldsmapper from './dynamicformfieldsmapper';
import listings from './listings';
import user from './user';
import reports from './reports';
import quotaCredits from './quotaCredits';
import { TENANT_KEY } from '../../../utility/env';

const bayutTransformers = Object.freeze({
  key: TENANT_KEY,
  ...agency,
  ...cart,
  ...dynamicformfieldsmapper,
  ...listings,
  ...user,
  ...quotaCredits,
  ...reports,
});

export default bayutTransformers;
