import TenantComponents from '@tenantComponents';
import HeaderComponent from './header-component/header-components';
import Health from './listing/health/health';
import PlatformActions from './listing/listing-platform-actions/platformActions';
import ListingsRowActions from './listing/listing-row-actions/listing-row-actions';
import ListingCard from './listing/listingCard';
import ListingsPage from './listing/listings';
import PostListingPage from './post-listing/post-listing';
import PropShop from './prop-shop/prop-shop';
import { AgencyUserRowActions } from './agency-staff/agency-user-row-actions/agency-user-actions';
import CreditInfoDrawer from './credit-info-drawer/creditInfoDrawer';
import InboxPage from './email-leads/emailLeads';
import HeaderLink from './headerLink/headerLink';
import { HelpAndSupport } from './helpAndSupport/helpAndSupport';
import { Layout } from './layout/layout';
import { Logo } from './logo/Logo';
import PageAlerts from './page-alerts/page-alerts';
import LocationSelect from './post-listing/location-select/location-select';
import UserPreferencePage from './preference/preference';
import ProfileKCForm from './profile/profileKcForm';
import { CreditTopUps } from './prop-shop/credit-top-ups/creditTopUps';
import ListingsSummary from './reports/ListingsSummary';
import SmartCreditsUtilizationModal from './smart-credits-utilisation/smart-credits-utilisation';
import UpgradeListingPage from './upgrade-listing/upgrade-listing';
import ProfileCompletionAlert from './profile-completion/profile-completion';
import ProfileStatusPopUp from './profile-completion/profile-settings-card';
import ProfileCompletionCongratsModal from './profile-completion/profile-completion-popup';
import ProfileCompletionBanner from './profile-completion/profile-completion-banner';
import BadgeCongratsModal from './profile-completion/badge-congrats-modal';
import ListingBreakDownByDateTable from './reports/ListingBreakdownByDateTable';
import ListingStatsByDateTable from './reports/ListingStatsByDateTable';
import CardTrafficLeadsByDate from './reports/CardTrafficLeadsByDate';
import { NavBar } from './layout/navbar';
import { DeskTopNavBar } from './layout/desktopNavbar';
import DownloadAppModal from './downloadAppModal/downloadAppModal';
import CompleteProfilePopUp from './profile-completion/complete-profile-pop-up';
import { FooterComponent } from './layout/footer';
import Product from './upgrade-listing/product';
import ServiceOptions from './upgrade-listing/ServiceOptions';
import AdLicenseForm from './post-listing/ad-license-form';
import NationalCRForm from './post-listing/national-cr-form';
import GenerateContentField from './post-listing/GenerateContentField';
import LicenseValidationGuide from './post-listing/license-validation-guide';
import LicenseValidation from './post-listing/license-validation';
import { QuotaCreditModal } from './listing/listing-platform-actions/quotaCreditModal';

let Components = {
  HeaderComponent,
  CreditInfoDrawer,
  CompleteProfilePopUp,
  InboxPage,
  PostListingPage,
  PlatformActions,
  ListingsRowActions,
  LocationSelect,
  Health,
  HeaderLink,
  ListingsPage,
  PropShop,
  UpgradeListingPage,
  ListingCard,
  AgencyUserRowActions,
  ListingsSummary,
  Logo,
  PageAlerts,
  Layout,
  ProfileKCForm,
  CreditTopUps,
  SmartCreditsUtilizationModal,
  HelpAndSupport,
  UserPreferencePage,
  ProfileCompletionAlert,
  ProfileStatusPopUp,
  ProfileCompletionCongratsModal,
  ProfileCompletionBanner,
  BadgeCongratsModal,
  ListingBreakDownByDateTable,
  ListingStatsByDateTable,
  CardTrafficLeadsByDate,
  DeskTopNavBar,
  NavBar,
  DownloadAppModal,
  FooterComponent,
  Product,
  ServiceOptions,
  AdLicenseForm,
  GenerateContentField,
  LicenseValidationGuide,
  LicenseValidation,
  QuotaCreditModal,
  NationalCRForm,
  ...TenantComponents,
};

export default Components;
