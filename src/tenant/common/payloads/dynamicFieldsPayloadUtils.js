import { getNestedDynamicFieldPayloadKey, getRootListingPayloadKey, isDynamicFieldNestedInPayload } from '../../../utility/dynamicFieldDestination';

export const findOption = (options, raw) => {
  if (!options?.length || raw === undefined || raw === null) return null;
  const str = String(raw);
  return (
    options.find((o) => o.value === raw || String(o.value) === str || o.id == raw || String(o.id) === str) ||
    options.find((o) => o.slug === str || o.slug === raw) ||
    options.find((o) => o.label === raw || String(o.label) === str) ||
    null
  );
};

export const matchDynamicSelectOption = (options, raw, apiKeyName, slugPreferredKeys = []) => {
  if (!options?.length || raw === undefined || raw === null) return null;
  if (slugPreferredKeys.includes(apiKeyName)) {
    return options.find((o) => o.slug === raw || String(o.slug) === String(raw)) ?? findOption(options, raw);
  }
  return findOption(options, raw);
};

export const resolveOptionFromFormValue = (opts, value, apiKeyName, slugPreferredKeys = []) => {
  if (!opts?.length || typeof value !== 'object' || value === null) return null;
  if (slugPreferredKeys.includes(apiKeyName) && value.slug != null) {
    const bySlug = opts.find((o) => String(o.slug) === String(value.slug));
    if (bySlug) return bySlug;
  }
  return (
    findOption(opts, value.id) ??
    findOption(opts, value.value) ??
    findOption(opts, value.label) ??
    findOption(opts, value.slug)
  );
};

export const splitPairedTokens = (s) =>
  String(s || '')
    .split(/[,\u060C]/)
    .map((t) => t.trim())
    .filter(Boolean);

export const pairedValueL1FromOption = (option, chosenEn) => {
  if (!option || chosenEn === undefined || chosenEn === null || chosenEn === '') return null;
  const enParts = splitPairedTokens(option.value);
  const arParts = splitPairedTokens(option.value_l1);
  if (enParts.length < 2 || arParts.length < 2) return null;
  let key = String(chosenEn).trim();
  if (chosenEn === true) key = 'Yes';
  if (chosenEn === false) key = 'No';
  const idx = enParts.findIndex((p) => p === key || p.toLowerCase() === key.toLowerCase());
  if (idx === -1 || idx >= arParts.length) return null;
  return arParts[idx] || null;
};

export const coercePayloadScalarForOptionFormat = (resolvedOption, scalar, isPairedValue) => {
  const isNumber =
    resolvedOption &&
    String(resolvedOption.format_type ?? '')
      .trim()
      .toLowerCase() === 'number';
  if (isPairedValue || !isNumber || scalar === null || scalar === undefined || scalar === '') {
    return scalar;
  }
  const n = parseFloat(String(scalar).replace(/,/g, '').trim());
  if (Number.isNaN(n)) return scalar;
  return n;
};

export const isNumberFeatureFormatType = (resolvedOption) =>
  String(resolvedOption?.format_type ?? '')
    .trim()
    .toLowerCase() === 'number';

export const coerceSlugValuePairForApi = (resolved, value, value_l1, isPaired) => {
  const valueCoerced = coercePayloadScalarForOptionFormat(resolved, value, isPaired);
  let valueL1Coerced = coercePayloadScalarForOptionFormat(resolved, value_l1, isPaired);
  if (!isPaired && resolved && isNumberFeatureFormatType(resolved)) {
    valueL1Coerced = valueCoerced;
  }
  return { value: valueCoerced, value_l1: valueL1Coerced };
};

export const buildListingImagesAttributesFromPropertyImages = (propertyImages, fieldSlug = null) => {
  const allImages = (propertyImages || [])
    .filter((entry) => entry?.uuid)
    .map((image) => {
      const { id, uuid, isMainImage, _destroy, order, image_type } = image;
      return {
        name: uuid,
        is_main_image: isMainImage ? 1 : 0,
        order: order ?? 0,
        ...(image_type != null && { image_type }),
        ...(id && typeof id === 'number' && { id }),
        _destroy,
      };
    });

  allImages.forEach((image) => {
    if ((image.image_type === 'satellite' || image.image_type === 'roadmap') && image.is_main_image) {
      image.is_main_image = 0;
    }
  });

  const satelliteRoadmapImages = allImages.filter(
    (entry) => (entry.image_type === 'satellite' || entry.image_type === 'roadmap') && !entry._destroy,
  );
  const images = allImages.filter((entry) => entry.image_type !== 'satellite' && entry.image_type !== 'roadmap');

  const mainImageIndex = images.findIndex((entry) => !!entry.is_main_image);
  if (mainImageIndex !== -1) {
    const mainImage = images.splice(mainImageIndex, 1);
    images.unshift(mainImage?.[0]);
  } else {
    const index = images.findIndex((entry) => !entry?._destroy);
    if (index !== -1) {
      images[index] = { ...images[index], is_main_image: 1 };
    }
  }

  const finalImages = [...images, ...satelliteRoadmapImages];
  return finalImages.map((image, index) => ({
    slug: fieldSlug ?? 'images',
    name: image.name,
    order: index,
    is_main_image: image.is_main_image ? 1 : 0,
    ...(image.image_type != null && { image_type: image.image_type }),
    ...(image.id != null && typeof image.id === 'number' && { id: image.id }),
    ...(image._destroy && { _destroy: image._destroy }),
  }));
};

export const hasUsableDynamicFieldRaw = (raw) => {
  if (raw == null || raw === '') return false;
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw.id != null || raw.value != null || raw.slug != null;
  }
  return true;
};

export const assignRootDynamicListingField = (target, destinationKey, apiKeyName, formatted) => {
  if (formatted === undefined) return;
  const rootKey = getRootListingPayloadKey(destinationKey, apiKeyName);
  if (
    apiKeyName === 'location_id' &&
    formatted &&
    typeof formatted === 'object' &&
    formatted.value != null &&
    formatted.value !== ''
  ) {
    target.location_id = formatted.value;
    return;
  }
  target[rootKey] = formatted;
};

export const PRESERVED_HIDDEN_DYNAMIC_FIELD_KEYS = ['area_unit', 'age'];

export const mergePreservedHiddenDynamicFields = (
  dynamicFields,
  { values, listing, dynamicFieldDefinitions },
  formatDynamicFieldForApi,
  includePreservedAreaUnit = true,
) => {
  const saved = listing?.dynamic_data?.dynamic_fields;
  if (!saved || !dynamicFieldDefinitions?.length) return;

  PRESERVED_HIDDEN_DYNAMIC_FIELD_KEYS.forEach((apiKey) => {
    if (apiKey === 'area_unit' && !includePreservedAreaUnit) return;
    const def = dynamicFieldDefinitions.find((d) => d.apiKeyName === apiKey);
    if (!def) return;
    if (!isDynamicFieldNestedInPayload(def.destinationKey)) return;
    const nestedKey = getNestedDynamicFieldPayloadKey(def.destinationKey, def.apiKeyName);
    if (Object.prototype.hasOwnProperty.call(dynamicFields, nestedKey)) return;

    const fromForm = values[def.formKeyName];
    const raw = hasUsableDynamicFieldRaw(fromForm) ? fromForm : saved[apiKey];
    if (!hasUsableDynamicFieldRaw(raw)) return;

    const formatted = formatDynamicFieldForApi(
      raw,
      def.data_type,
      def.apiKeyName,
      def.options,
      values,
      def.fieldSlug,
      def.destinationKey,
    );
    if (formatted !== undefined) {
      dynamicFields[nestedKey] = formatted;
    }
  });
};

export const createFormatDynamicFieldForApi = ({
  resolveLocationId,
  locationInfoKeys = ['location-info'],
  slugPreferredKeys = ['sale_type'],
  includeVideosAsListingAttributes = false,
}) => {
  return (raw, data_type, apiKeyName, options = [], values = {}, fieldSlug = null, destinationKey = null) => {
    if (apiKeyName === 'location_id') {
      const composite = raw ?? values?.[locationInfoKeys[0]] ?? values?.[locationInfoKeys[1]];
      const locationId = resolveLocationId(composite, values);
      if (locationId != null && locationId !== '') {
        return { slug: fieldSlug ?? null, value: String(locationId), value_l1: null };
      }
      return undefined;
    }

    if (apiKeyName === 'images' && Array.isArray(raw)) {
      const dest = String(destinationKey ?? '').trim();
      if (dest === 'listing_images_attributes') {
        return buildListingImagesAttributesFromPropertyImages(raw, fieldSlug);
      }
      if (raw.length === 0) return [];
      return raw
        .filter((img) => img && !img._destroy && (img.uuid != null || img.name != null))
        .map((img) => ({ slug: fieldSlug ?? null, value: String(img.uuid ?? img.name), value_l1: null }));
    }

    if (apiKeyName === 'videos' && Array.isArray(raw)) {
      const dest = String(destinationKey ?? '').trim();
      if (includeVideosAsListingAttributes || dest === 'listing_videos_attributes') {
        return raw
          .filter((entry) => entry && (entry.id != null || !entry._destroy))
          .map((entry) => ({
            ...(entry.id != null && { id: entry.id }),
            video_host:
              entry.host != null && String(entry.host).trim() !== '' ? String(entry.host).trim().toLowerCase() : 'youtube',
            video_title: entry.title != null ? String(entry.title) : '',
            video_link: String(entry?.url ?? entry?.link ?? entry?.video_link ?? '').trim(),
            ...(entry._destroy && { _destroy: true }),
          }))
          .filter((row) => row._destroy || row.video_link !== '');
      }
    }

    if (raw === undefined || raw === null) return undefined;

    const toSlugValueL1 = (value, opts = options) => {
      if (!value && value !== 0) return { slug: null, value: null, value_l1: null };
      if (typeof value === 'object' && value !== null && (value.slug != null || value.value != null || value.id != null)) {
        const resolved = opts?.length ? resolveOptionFromFormValue(opts, value, apiKeyName, slugPreferredKeys) : null;
        const chosen = value.value ?? value.label;
        const isPaired =
          resolved &&
          splitPairedTokens(resolved.value).length >= 2 &&
          splitPairedTokens(resolved.value_l1).length >= 2;
        const payloadValue =
          chosen != null && chosen !== ''
            ? String(chosen === true ? 'Yes' : chosen === false ? 'No' : chosen)
            : resolved?.value && !isPaired
              ? String(resolved.value)
              : value.id != null
                ? String(value.id)
                : null;
        const mappedL1 = isPaired ? pairedValueL1FromOption(resolved, value.value ?? value.label) : null;
        const valueL1 =
          mappedL1 != null
            ? mappedL1
            : isPaired
              ? null
              : Object.prototype.hasOwnProperty.call(value, 'value_l1')
                ? value.value_l1
                : resolved?.value_l1 ?? null;
        const pair = coerceSlugValuePairForApi(resolved, payloadValue, valueL1, isPaired);
        return {
          slug: resolved?.slug ?? value.slug ?? null,
          value: pair.value,
          value_l1: pair.value_l1,
        };
      }
      const resolved = opts?.length ? matchDynamicSelectOption(opts, value, apiKeyName, slugPreferredKeys) : null;
      const isPaired =
        resolved &&
        splitPairedTokens(resolved.value).length >= 2 &&
        splitPairedTokens(resolved.value_l1).length >= 2;
      const payloadValue = resolved && !isPaired ? String(resolved.value) : value != null ? String(value) : null;
      const mappedL1 = isPaired ? pairedValueL1FromOption(resolved, value) : null;
      const valueL1 = mappedL1 != null ? mappedL1 : isPaired ? null : resolved?.value_l1 ?? null;
      const pair = coerceSlugValuePairForApi(resolved, payloadValue, valueL1, isPaired);
      return {
        slug: resolved?.slug ?? null,
        value: pair.value,
        value_l1: pair.value_l1,
      };
    };

    if (data_type === 'boolean') return raw === '1' || raw === 1 || raw === true;
    if (data_type === 'single-select') return toSlugValueL1(typeof raw === 'object' && raw !== null ? raw : raw);
    if (data_type === 'multi-select' || apiKeyName === 'features') {
      if (Array.isArray(raw)) {
        return raw.map((value) => toSlugValueL1(typeof value === 'object' ? value : value));
      }
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        const entries = Object.entries(raw).filter(([, value]) => value !== undefined && value !== null && value !== false && value !== '');
        return entries.map(([key, value]) => {
          if (typeof value === 'object' && value && (value.slug != null || value.value != null || value.id != null)) {
            return toSlugValueL1(value);
          }
          const resolved = options?.length ? findOption(options, key) : null;
          const chosen = typeof value === 'object' && value?.value != null ? value.value : value;
          const isPaired =
            resolved &&
            splitPairedTokens(resolved.value).length >= 2 &&
            splitPairedTokens(resolved.value_l1).length >= 2;
          const payloadValue =
            chosen != null && chosen !== ''
              ? String(chosen === true ? 'Yes' : chosen === false ? 'No' : chosen)
              : resolved?.value && !isPaired
                ? String(resolved.value)
                : null;
          const mappedL1 = isPaired ? pairedValueL1FromOption(resolved, chosen) : null;
          const valueL1 =
            mappedL1 != null
              ? mappedL1
              : isPaired
                ? null
                : typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(value, 'value_l1')
                  ? value.value_l1
                  : resolved?.value_l1 ?? null;
          const pair = coerceSlugValuePairForApi(resolved, payloadValue, valueL1, isPaired);
          return {
            slug: resolved?.slug ?? null,
            value: pair.value,
            value_l1: pair.value_l1,
          };
        });
      }
      return undefined;
    }
    if (data_type === 'integer' || data_type === 'decimal') {
      const num = typeof raw === 'object' && raw !== null && 'value' in raw ? raw.value : raw;
      const parsed = parseFloat(num);
      return Number.isNaN(parsed) ? undefined : (data_type === 'integer' ? Math.floor(parsed) : parsed);
    }
    if (data_type === 'json') return typeof raw === 'object' ? raw : undefined;
    if (data_type === 'string' || data_type === 'text') return raw === '' ? undefined : String(raw);
    return raw;
  };
};
