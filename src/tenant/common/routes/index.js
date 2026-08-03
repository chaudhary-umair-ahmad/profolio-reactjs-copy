import tenantRoutes from '@tenantRoutes';
import { TENANT_KEY } from '../../../utility/env';
import routes from './appRoutes';

const Routes = Object.freeze({ key: TENANT_KEY, ...routes, ...tenantRoutes });

export default Routes;
