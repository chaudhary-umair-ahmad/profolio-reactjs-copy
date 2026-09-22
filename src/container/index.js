import { lazy } from 'react';

const Dashboard = lazy(() => import('./pages/dashboard/dashboard'));
const InboxPage = lazy(() => import('./pages/inbox-page/inbox-page'));
const PostListingPage = lazy(() => import('./pages/post-listing/post-listing'));
const PostListingLandingPage = lazy(() => import('./pages/post-listing/post-listing-landing'));
const ListingsPage = lazy(() => import('./pages/listings/listings'));
const AutoUtilizationPage = lazy(() => import('./pages/auto-utilisation/auto-utilisation'));
const PropShopPage = lazy(() => import('./pages/prop-shop/prop-shop'));
const MyOrdersPage = lazy(() => import('./pages/my-orders/my-orders'));
const ReportsSummaryPage = lazy(() => import('./pages/reports/reports-summary'));
const ListingReportsPage = lazy(() => import('./pages/reports/listing-reports'));
const LeadsReports = lazy(() => import('./pages/reports/leads-reports'));
const UserSettingsPage = lazy(() => import('./pages/user-settings/user-settings'));
const UserProfile = lazy(() => import('./pages/user-settings/profile'));
const AgencyStaffPage = lazy(() => import('./pages/agancy-staff/agancy-staff'));
const UpgradeListingPage = lazy(() => import('./pages/post-listing/upgrade-listing'));
const QuotaCreditsPage = lazy(() => import('./pages/quota-credits/quota-credits'));
const CheckoutPage = lazy(() => import('./pages/payment/checkout'));
const EventCheckoutPage = lazy(() => import('./pages/payment/event-checkout'));
const CreditsUsage = lazy(() => import('./pages/credits-usage/credits-usage'));
const InviteUserPage = lazy(() => import('./pages/invite-user/invite-user'));
const LeadsDashboard = lazy(() => import('./pages/lms/leads-dashboard'));
const LeadsManagement = lazy(() => import('./pages/lms/leads-management'));
const AgentPerformance = lazy(() => import('./pages/agent-performance/AgentPerformance'));
const AdLicense = lazy(() => import('./pages/ad-license'));

const PaymentProcess = lazy(() => import('./pages/payment/payment-process'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const PostAd = lazy(() => import('./pages/post-ad'));
const DesignCapture = lazy(() => import('./pages/design-capture/DesignCapture'));

export const PublicPages = {
  PaymentProcess,
  Maintenance,
  PostAd,
  EventCheckoutPage,
  DesignCapture,
};

export default {
  Dashboard,
  PostListingPage,
  PostListingLandingPage,
  UpgradeListingPage,
  ListingsPage,
  AutoUtilizationPage,
  AgencyStaffPage,
  QuotaCreditsPage,
  InboxPage,
  ReportsSummaryPage,
  ListingReportsPage,
  LeadsReports,
  UserSettingsPage,
  PropShopPage,
  MyOrdersPage,
  CheckoutPage,
  CreditsUsage,
  InviteUserPage,
  UserProfile,
  LeadsDashboard,
  LeadsManagement,
  AgentPerformance,
  AdLicense
};
