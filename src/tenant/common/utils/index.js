import tenantUtils from '@tenantUtils';
import utils from './utilities';
import listingUtils from './listingUtilities';
import reportUtils from './reportUtilities';
import { TENANT_KEY } from '../../../utility/env';

const utilities = Object.freeze({ key: TENANT_KEY, ...utils, ...listingUtils, ...reportUtils, ...tenantUtils });

export default utilities;
