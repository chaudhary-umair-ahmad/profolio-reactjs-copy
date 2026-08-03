import Health from './listing/health/health';
import PlatformActions from './listing/listing-platform-actions/platformActions';
import ListingsRowActions from './listing/listing-row-actions/listing-row-actions';
import LocationSelect from './post-listing/location-select/location-select';
import ManageQuota from './manage-quota/ManageQuota';
import PostListingPage from './post-listing/post-listing';
import ListingsPage from './listing/listings';
import ListingCard from './listing/listingCard';
import PropShop from './prop-shop/prop-shop';
import { assignDefaultValueToObject } from '../../../utility/utility';
import UpgradeListingPage from './upgrade-listing/upgrade-listing';
import ListingsSummary from './reports/ListingsSummary';
import { Logo } from './logo/Logo';
import InboxPage from './inbox/inbox-container';
import UserPreferencePage from './preference/preference';
import { QuotaCreditModal } from './listing/listing-platform-actions/quotaCreditModal';

let Components = {
  PostListingPage,
  PlatformActions,
  ListingsRowActions,
  LocationSelect,
  ManageQuota,
  ListingsPage,
  Health,
  PropShop,
  UpgradeListingPage,
  ListingCard,
  ListingsSummary,
  Logo,
  InboxPage,
  UserPreferencePage,
  QuotaCreditModal,
};

export default assignDefaultValueToObject(Components, () => null);
