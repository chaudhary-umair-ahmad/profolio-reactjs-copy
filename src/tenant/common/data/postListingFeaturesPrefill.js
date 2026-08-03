const isTruthyFeatureValue = (value) =>
  value == 'YES' || value == 'Yes' || value == 'yes' || value == 'true' || value === true;

export const fetchAmenitiesFromListing = (listing) => {
  const amenities = {};
  if (listing?.listing_features && listing.listing_features.length > 0) {
    listing.listing_features.forEach((group) => {
      group?.features?.forEach((item) => {
        amenities[item.feature_id] = isTruthyFeatureValue(item?.value) ? true : item?.value;
      });
    });
  }
  return amenities;
};

export const buildFeaturesRichFromListing = (listing) => {
  const out = {};
  if (!listing?.listing_features?.length) return out;
  listing.listing_features.forEach((group) => {
    group?.features?.forEach((item) => {
      const id = item?.id ?? item?.feature_id;
      if (id == null) return;
      const isYes = isTruthyFeatureValue(item?.value);
      out[id] = {
        id,
        slug: item?.slug ?? null,
        value: isYes ? 'Yes' : item?.value || 'Yes',
        value_l1: item?.title_l1 ?? item?.label_l1 ?? 'نعم',
      };
    });
  });
  return out;
};
