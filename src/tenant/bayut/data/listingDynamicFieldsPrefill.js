/**
 * Reads listing.dynamic_data.dynamic_fields (Surge edit listing) once for Formik prefill.
 */

const rentalFrequencySlugFromDynamicAndListing = (dfRf, listing) => {
  if (typeof dfRf !== 'object' || dfRf == null) return null;
  const slug = dfRf.slug != null && String(dfRf.slug).trim() !== '' ? String(dfRf.slug) : null;
  if (slug) return slug;
  if (dfRf.id != null && Array.isArray(listing?.rent_frequencies)) {
    const m = listing.rent_frequencies.find((r) => String(r.id) === String(dfRf.id));
    if (m?.slug != null && String(m.slug).trim() !== '') return String(m.slug);
  }
  return null;
};

/** Surge edit often sends listing_category only (no listing_purpose / listing_type). */
export const surgeListingPurposeId = (listing) =>
  listing?.listing_purpose?.id ?? listing?.listing_category?.parent_id ?? null;

export const surgeListingPropertyTypeId = (listing) =>
  listing?.listing_type?.id ?? listing?.listing_category?.id ?? null;

export const surgeListingPurposeName = (listing) =>
  listing?.listing_purpose?.purpose ??
  listing?.listing_purpose?.title ??
  listing?.listing_category?.purpose ??
  listing?.listing_category?.breadcrumbs?.[0]?.name ??
  null;

const scalarFromSelect = (field) => {
  if (field == null) return null;
  if (typeof field === 'object') {
    const v = field.value ?? field.label;
    return v != null && v !== '' ? String(v) : null;
  }
  return String(field);
};

const buildFeaturesRichFromDynamicFieldArray = (features) => {
  const out = {};
  features.forEach((it) => {
    const id = it?.id ?? it?.feature_id;
    if (id == null || it?.slug == null) return;
    const isYes =
      it?.value === 'YES' ||
      it?.value === 'Yes' ||
      it?.value === 'yes' ||
      it?.value === 'true' ||
      it?.value === true;
    out[id] = {
      id,
      slug: it.slug,
      value: isYes ? 'Yes' : it?.value ?? 'Yes',
      value_l1: it?.title_l1 ?? it?.value_l1 ?? it?.label_l1 ?? 'نعم',
    };
  });
  return Object.keys(out).length ? out : null;
};

const residenceTypeScalarForForm = (obj, residenceTypes) => {
  if (obj == null) return null;
  if (typeof obj !== 'object') {
    return obj !== '' ? obj : null;
  }
  const types = residenceTypes || [];
  const bySlug = obj.slug != null ? types.find((r) => r?.slug === obj.slug) : null;
  const byId = obj.id != null ? types.find((r) => String(r?.id) === String(obj.id)) : null;
  const cat = bySlug || byId;
  const fromCatalog = cat ? cat.label ?? cat.name ?? cat.value : null;
  const scalar =
    obj.label ?? obj.value ?? obj.name ?? fromCatalog ?? (obj.id != null ? obj.id : null) ?? null;
  if (scalar === null || scalar === '') return null;
  return typeof scalar === 'number' || typeof scalar === 'boolean' ? scalar : String(scalar);
};

const emptyPrefill = () => ({
  rental_frequency: null,
  residence_type: null,
  national_address: null,
  redirection_link: null,
  bedrooms: null,
  bathrooms: null,
  featuresRich: null,
  area: null,
  sale_type_slug: null,
  completion_status: null,
});

/**
 * @returns {ReturnType<typeof emptyPrefill>}
 */
export const getDynamicFieldsPrefill = (listing) => {
  const df = listing?.dynamic_data?.dynamic_fields;
  if (!df || typeof df !== 'object') {
    return emptyPrefill();
  }

  const rental_frequency = rentalFrequencySlugFromDynamicAndListing(df.rent_frequency, listing);

  let residence_type = null;
  if (df.residence_type != null && typeof df.residence_type === 'object') {
    residence_type = residenceTypeScalarForForm(df.residence_type, listing?.residenceTypes);
  }

  const national_address =
    df.national_address != null && String(df.national_address).trim() !== ''
      ? String(df.national_address)
      : null;

  const redirection_link =
    df.redirection_link != null && String(df.redirection_link).trim() !== ''
      ? String(df.redirection_link)
      : null;

  const bedrooms = scalarFromSelect(df.beds);
  const bathrooms = scalarFromSelect(df.baths);

  const area =
    df.area != null && df.area !== ''
      ? String(df.area)
      : df.area_unit_value != null && df.area_unit_value !== ''
        ? String(df.area_unit_value)
        : null;

  const sale_type_slug = df.sale_type?.slug ?? null;

  const completion_status = df.completion_status ?? null;

  const featuresRich =
    Array.isArray(df.features) && df.features.length
      ? buildFeaturesRichFromDynamicFieldArray(df.features)
      : null;

  return {
    rental_frequency,
    residence_type,
    national_address,
    redirection_link,
    bedrooms,
    bathrooms,
    featuresRich,
    area,
    sale_type_slug,
    completion_status,
  };
};

export const resolveRentalFrequencyInitial = (listing, dfPrefill) => {
  if (dfPrefill?.rental_frequency != null) return dfPrefill.rental_frequency;
  const rf = listing?.rent_frequency;
  if (rf == null) return null;
  if (typeof rf === 'object') {
    const slug = rf.slug != null && String(rf.slug).trim() !== '' ? String(rf.slug) : null;
    if (slug) return slug;
    if (rf.id != null && Array.isArray(listing?.rent_frequencies)) {
      const m = listing.rent_frequencies.find((r) => String(r.id) === String(rf.id));
      if (m?.slug != null && String(m.slug).trim() !== '') return String(m.slug);
    }
  }
  return null;
};

export const resolveResidenceTypeInitial = (listing, dfPrefill) => {
  if (dfPrefill?.residence_type != null) return dfPrefill.residence_type;
  const rt = listing?.residence_type;
  if (rt != null && typeof rt === 'object') {
    return residenceTypeScalarForForm(rt, listing?.residenceTypes);
  }
  if (rt != null) return rt;
  if (listing?.residenceTypes?.length) {
    const first = listing.residenceTypes[0];
    return residenceTypeScalarForForm(first, listing.residenceTypes);
  }
  return null;
};
