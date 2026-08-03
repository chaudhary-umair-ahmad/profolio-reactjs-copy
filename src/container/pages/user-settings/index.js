import { lazy } from 'react';
import TenantComponents from '@components';

const UserProfilePage = lazy(() => import('./profile'));
const ChangePasswordPage = lazy(() => import('./password'));
const BankDetailPage = lazy(() => import('./bank-detail'));
const LicensesPage = lazy(() => import('./license'));
const AgencyPage = lazy(() => import('./agancy-settings'));
const AgencyLicensesPage = lazy(() => import('./license'));

export default {
  UserPreferencePage: TenantComponents.UserPreferencePage,
  UserProfilePage,
  ChangePasswordPage,
  BankDetailPage,
  LicensesPage,
  AgencyPage,
  AgencyLicensesPage,
};
