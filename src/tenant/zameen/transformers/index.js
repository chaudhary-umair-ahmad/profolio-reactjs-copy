import listings from './listings';
import userMapper from './user';
import quotaCreditsDataMapper from './quotaCredits';
import reportsDataMapper from './reports';
import agency from './agency';
import cart from './cart';
import leads from './leads';
import { TENANT_KEY } from '../../../utility/env';

const zameenTransformers = Object.freeze({
  key: TENANT_KEY,
  ...agency,
  ...leads,
  ...cart,
  ...listings,
  ...userMapper,
  ...quotaCreditsDataMapper,
  ...reportsDataMapper,
});

export default zameenTransformers;
