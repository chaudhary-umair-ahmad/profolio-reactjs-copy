import PlatformActions from './listing/listing-platform-actions/platformActions';
import ListingsRowActions from './listing/listing-row-actions/listing-row-actions';
import ListingCard from './listing/listingCard';
import ListingsPage from './listing/listings';
import PostListingPage from './post-listing/post-listing';
import AdLicensePage from './ad-license/create-ad-license';
import CreditInfoDrawer from './credit-info-drawer/creditInfoDrawer';
import LocationSelect from './post-listing/location-select/location-select';
import PostListingWithPropertyType from './post-listing/post-listing-with-options';
import UpgradeListingPage from './upgrade-listing/upgrade-listing';
import ReportUnwantedContactModal from './report-unwanted-contact/report-unwanted-contact-modal';
import { assignDefaultValueToObject } from '../../../utility/utility';
import { MobileNavBar } from './layout/mobileNavBar';

let Components = {
  PostListingPage,
  PlatformActions,
  ListingsRowActions,
  LocationSelect,
  CreditInfoDrawer,
  MobileNavBar,
  ListingsPage,
  UpgradeListingPage,
  ListingCard,
  PostListingWithPropertyType,
  AdLicensePage,
  ReportUnwantedContactModal
};

export default assignDefaultValueToObject(Components, () => null);
