/**
 * Normalize POST/PUT listing response so post-success flow works for both API shapes.
 * New API: { listing: { id, platform_listings: [{ platform: { slug }, status, disposition }] } }
 * Legacy: { listing: { id, platforms: { bayut: { status, is_posted, ... } } } }
 * Ensures listing.platforms (by slug) and listing.is_posted exist for downstream use.
 */
export const normalizePostListingResponse = (listing) => {
  if (!listing) return listing;
  if (listing.platforms) return listing;
  const platformListings = listing.platform_listings || [];
  const platforms = platformListings.reduce((acc, pl) => {
    if (pl?.platform?.slug) {
      const statusSlug = pl?.status?.slug;
      acc[pl.platform.slug] = {
        status: pl.status,
        disposition: pl.disposition,
        is_posted: statusSlug !== 'draft' && (statusSlug === 'active' || statusSlug === 'pending'),
      };
    }
    return acc;
  }, {});
  const is_posted = Object.values(platforms).some((p) => p.is_posted);
  return { ...listing, platforms, is_posted };
};

/**
 * Resolve disposition slug for the user's platform(s) from legacy or platform_listings API shapes.
 */
export const resolveListingDispositionSlug = (listing, user) => {
  if (!listing) return undefined;
  if (listing.disposition?.slug) return listing.disposition.slug;

  const normalized = listing.platforms ? listing : normalizePostListingResponse(listing);
  const fromUserPlatforms = user?.platforms
    ?.map((p) => normalized?.platforms?.[p?.slug]?.disposition?.slug)
    .find(Boolean);
  if (fromUserPlatforms) return fromUserPlatforms;

  const rows = listing.platform_listings;
  if (!Array.isArray(rows) || rows.length === 0) return undefined;

  const row =
    rows.find((pl) => user?.platforms?.some((p) => p?.slug === pl?.platform?.slug)) ??
    rows.find((pl) => pl?.platform?.slug === 'bayut') ??
    rows.find((pl) => pl?.platform?.slug === 'ksa') ??
    rows[0];

  return row?.disposition?.slug;
};

export default normalizePostListingResponse;
