const BAYUT_PLATFORM_SLUG = 'bayut';

/**
 * Post-listing flows treat a listing as "posted" when Bayut has posted_at set on platform_listings.
 * If platform_listings is missing or empty, falls back to listing.is_posted for older API payloads.
 */
export const isListingPostedOnBayut = (listing) => {
  if (!listing) {
    return false;
  }
  const platformListings = listing.platform_listings;
  if (Array.isArray(platformListings) && platformListings.length > 0) {
    const bayutPl = platformListings.find((item) => item?.platform?.slug === BAYUT_PLATFORM_SLUG);
    return bayutPl?.is_posted;
  }
  return false;
};

export default isListingPostedOnBayut;
