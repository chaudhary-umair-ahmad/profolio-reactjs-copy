import { TENANT_KEY } from '../../../utility/env';
import listings from './listings';
import user from './user';

const bayutPayloads = Object.freeze({
  key: TENANT_KEY,
  ...user,
  ...listings,
});

export default bayutPayloads;
