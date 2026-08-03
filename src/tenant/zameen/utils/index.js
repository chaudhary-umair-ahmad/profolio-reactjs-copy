import utils from './utilities';
import listingUtils from './listingUtilities';
import reportUtils from './reportUtilities';
import { TENANT_KEY } from '../../../utility/env';

const zameenUtilities = Object.freeze({ key: TENANT_KEY, ...utils, ...reportUtils, ...listingUtils });

export default zameenUtilities;
