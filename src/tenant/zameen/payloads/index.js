import agency from './agency';
import user from './user';
import listings from './listings';
import reports from './reports';
import { TENANT_KEY } from '../../../utility/env';

const zameenPayloads = Object.freeze({
  key: TENANT_KEY,
  ...agency,
  ...user,
  ...listings,
  ...reports,
});

export default zameenPayloads;
