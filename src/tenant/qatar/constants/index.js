import { TENANT_KEY } from '../../../utility/env';
import app from './constants';
import { filterConstants } from './filterConstants';

const constants = Object.freeze({ key: TENANT_KEY, ...app, ...filterConstants });

export default constants;
