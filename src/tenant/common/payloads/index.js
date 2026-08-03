import tenantPayloads from '@tenantPayloads';
import agency from './agency';
import user from './user';
import listings from './listings';
import reports from './reports';
import leads from './leads';
import { TENANT_KEY } from '../../../utility/env';

const commonPayloads = Object.freeze({
  key: TENANT_KEY,
  ...agency,
  ...user,
  ...listings,
  ...reports,
  ...leads,
  ...tenantPayloads,
});

export default commonPayloads;
