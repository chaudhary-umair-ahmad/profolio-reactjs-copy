import * as yup from 'yup';

import { strings } from '../constants/strings';

import tenantConstants from '@constants';
import { t } from 'i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';

/**
 * Build RegExp from API regex string. Returns null if invalid or empty (invalid format = don't use).
 * Slash-wrapped patterns like "/p{Latin}/" are not supported; skip regex validation for those.
 * Patterns containing \p require the 'u' flag for correct Unicode matching.
 */
export function regexFromApi(apiRegexStr) {
  if (apiRegexStr == null || typeof apiRegexStr !== 'string' || apiRegexStr.trim() === '') return null;
  const trimmed = apiRegexStr.trim();
  if (trimmed.startsWith('/') && trimmed.length > 1 && trimmed.includes('/', 1)) return null;
  const needsUnicode = /\\p\{/.test(trimmed);
  try {
    return needsUnicode ? new RegExp(trimmed, 'u') : new RegExp(trimmed);
  } catch {
    try {
      return new RegExp(trimmed, 'u');
    } catch {
      return null;
    }
  }
}

export const phoneValidationYup = (isRequired = true, isMulti, requiredMsg) => {
  if (tenantConstants.COUNTRY_CODE === 'PK') {
    if (!!isMulti) {
      return yup.array().of(
        yup
          .string()
          .required(requiredMsg ? requiredMsg : t(strings.vm.phone))
          .test('format', t(strings.im.phone), (value) => {
            return isValidPhoneNumber(value ? value : '-');
          }),
      );
    } else {
      return isRequired
        ? yup
            .string()
            .required(requiredMsg ? requiredMsg : t('Please enter your number'))
            .test('format', t(strings.im.phone), (value) => {
              return isValidPhoneNumber(value ? value : '-');
            })
        : yup
            .string()
            .nullable()
            .optional()
            .test('format', t(strings.im.phone), (value) => {
              return value ? isValidPhoneNumber(value ? value : '-') : true;
            });
    }
  } else if (tenantConstants.COUNTRY_CODE === 'SA') {
    if (!!isMulti) {
      return yup.array().of(
        yup
          .string()
          .required(requiredMsg ? requiredMsg : t(strings.vm.phone))
          .test('format', t(strings.im.phone), (value) => {
            if (!value) return true;
            return tenantConstants.PHONE_REGEX ? tenantConstants.PHONE_REGEX.test(value) : true;
          }),
      );
    } else {
      return isRequired
        ? yup
            .string()
            .required(requiredMsg ? requiredMsg : t('Please enter your number'))
            .test('format', t(strings.im.phone), (value) => {
              if (!value) return true;
              return tenantConstants.PHONE_REGEX ? tenantConstants.PHONE_REGEX.test(value) : true;
            })
        : yup
            .string()
            .nullable()
            .optional()
            .test('format', t(strings.im.phone), (value) => {
              if (!value) return true;
              return tenantConstants.PHONE_REGEX ? tenantConstants.PHONE_REGEX.test(value) : true;
            });
    }
  }
};

export const websiteValidation = (
  websiteRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|(\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\.[a-zA-Z0-9()]{1,6}\b))$/,
) => {
  return yup
    .string()
    .test('', t(strings.enter_valid_website), function (value) {
      if (!value) return true;
      const isValidWebsite = websiteRegex.test(value);
      if (!isValidWebsite) {
        return false;
      }
      return true;
    })
    .nullable();
};

export const emailValidationYup = (emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/) => {
  return yup
    .string()
    .required(t('Email is required'))
    .test('', strings.enter_valid_email, function (value) {
      const isValidEmail = emailRegex.test(value);
      if (!isValidEmail) {
        return false;
      }
      return true;
    });
};

/**
 * String validation using API regex when provided. regex: RegExp or API string (see VALIDATION_REGEX_BACKEND.md).
 */
export const stringValidationYup = (requiredMsg, regex = '', invalidMsg = 'invalid msg hasnt been added') => {
  const re = typeof regex === 'string' ? regexFromApi(regex) : regex;
  const pattern = re || (typeof regex === 'object' && regex instanceof RegExp ? regex : null);
  /** Yup string rejects `null` before `.required()` runs; coerce so API label-based requiredMsg is shown. */
  const nullToEmpty = (v) => (v == null ? '' : v);
  if (requiredMsg) {
    let schema = yup.string().transform(nullToEmpty).required(requiredMsg);
    if (pattern) {
      schema = schema.matches(pattern, invalidMsg);
    }
    return schema;
  }
  return yup
    .string()
    .nullable()
    .optional()
    .test('', invalidMsg, (value) => {
      if (value == null || value === '') return true;
      return pattern ? pattern.test(value) : true;
    });
};

export const cnicValidationYup = () => {
  const pattern = /^\d{5}-\d{7}-\d{1}$/;
  return yup
    .string()
    .required(t('CNIC is required'))
    .test('cnic-format', t('Enter a valid CNIC (XXXXX-XXXXXXX-X)'), (value) => {
      if (!value) return false;
      return pattern.test(value);
    });
};

export const landlineValidationYup = (isRequired = false) => {
  const landlinePattern = /^\+92\s\d{2}\s\d{7}$/;

  if (isRequired) {
    return yup
      .string()
      .required(t('Please enter landline number'))
      .test('landline-format', t('Landline must be in format: +92 XX YYYYYYY'), (value) => {
        if (!value) return false;
        return landlinePattern.test(value);
      });
  } else {
    return yup
      .string()
      .nullable()
      .optional()
      .test('landline-format', t('Landline must be in format: +92 XX YYYYYYY'), (value) => {
        if (!value) return true;
        return landlinePattern.test(value);
      });
  }
};

export const objectValidationYup = (requiredMsg) => {
  if (requiredMsg) {
    return yup.object().required(requiredMsg);
  }
  return yup.object().nullable().optional();
};

/**
 * Single-select from API: UI often stores option value (string/number), not full option object.
 * Accepts string, number, or object so validation passes when user selects an option.
 */
export const singleSelectValidationYup = (requiredMsg) => {
  const isValid = (value) => {
    if (value == null) return false;
    if (typeof value === 'object' && value !== null) return true;
    if (typeof value === 'string' && value.trim() !== '') return true;
    if (typeof value === 'number' && !Number.isNaN(value)) return true;
    return false;
  };
  if (requiredMsg) {
    return yup
      .mixed()
      .required(requiredMsg)
      .test('single-select', requiredMsg, isValid)
      .nullable();
  }
  return yup.mixed().nullable().optional();
};

/**
 * Array validation. When required, enforces at least max(1, minLength) items when API minLength is set.
 */
export const arrayValidationYup = (requiredMsg, maxLength, minLength) => {
  let schema = yup.array().nullable();
  if (requiredMsg) {
    let minItems = 1;
    if (minLength != null && !Number.isNaN(Number(minLength)) && Number(minLength) >= 1) {
      minItems = Number(minLength);
    }
    schema = schema.required(requiredMsg).min(minItems, requiredMsg);
  } else {
    schema = schema.optional();
    if (minLength != null && !Number.isNaN(Number(minLength)) && Number(minLength) > 0) {
      const min = Number(minLength);
      schema = schema.min(min, t('Minimum {{min}} items required', { min }));
    }
  }
  if (maxLength != null && !Number.isNaN(Number(maxLength)) && Number(maxLength) >= 0) {
    const max = Number(maxLength);
    schema = schema.max(max, t('Maximum {{max}} items allowed', { max }));
  }
  return schema;
};

export const videoSelectBankValidationYup = (
  requiredMsg,
  maxLength,
  minLength,
  urlFormatRegex = null,
  validationMessages = null,
) => {
  const urlPattern =
    urlFormatRegex != null && urlFormatRegex !== ''
      ? typeof urlFormatRegex === 'string'
        ? regexFromApi(urlFormatRegex)
        : urlFormatRegex
      : null;
  const invalidUrlMsg = () =>
    resolveApiValidationMessageFirst(validationMessages, ['invalid_format'], t('Please enter a valid url'));
  const itemSchema = yup
    .object()
    .nullable()
    .test({
      name: 'item-url-format',
      message: invalidUrlMsg(),
      test: (value) => {
        if (value == null || typeof value !== 'object') return true;
        if (value._destroy === true) return true;
        if (!value.hasOwnProperty('_destroy') || !value.hasOwnProperty('url')) {
          const url = String(value?.url ?? value?.link ?? '').trim();
          // Video bank adds `{ url: '' }` rows when user clicks "Add Video" — empty must fail so submit validates.
          if (url === '') return false;
          const re = urlPattern instanceof RegExp ? urlPattern : null;
          if (!re) return true;
          return re.test(url);
        }
        return true;
      },
    });

  let schema = yup.array().of(itemSchema).nullable();
  if (requiredMsg) {
    let minItems = 1;
    if (minLength != null && !Number.isNaN(Number(minLength)) && Number(minLength) >= 1) {
      minItems = Number(minLength);
    }
    schema = schema.required(requiredMsg).min(minItems, requiredMsg);
  } else {
    schema = schema.optional();
    if (minLength != null && !Number.isNaN(Number(minLength)) && Number(minLength) > 0) {
      const min = Number(minLength);
      schema = schema.min(min, t('Minimum {{min}} items required', { min }));
    }
  }
  if (maxLength != null && !Number.isNaN(Number(maxLength)) && Number(maxLength) >= 0) {
    const max = Number(maxLength);
    schema = schema.max(max, t('Maximum {{max}} items allowed', { max }));
  }
  return schema;
};

/**
 * For fields that can be stored as array OR object (e.g. features/add-amenities stores object keyed by id).
 * Accepts: array (with length), or object (with at least one truthy value when required).
 */
export const arrayOrObjectValidationYup = (requiredMsg) => {
  const hasValue = (v) => {
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') {
      return Object.values(v).some(
        (val) =>
          val !== '' &&
          val !== undefined &&
          val !== null &&
          val !== false &&
          String(val) !== 'undefined'
      );
    }
    return false;
  };
  if (requiredMsg) {
    return yup
      .mixed()
      .required(requiredMsg)
      .test('array-or-object', requiredMsg, hasValue)
      .nullable();
  }
  return yup.mixed().nullable().optional();
};

/**
 * Resolve optional API `validation_messages` entry: value is an i18next key or literal passed to `t()`.
 */
export const resolveApiValidationMessage = (validationMessages, key, fallback) => {
  const vm = validationMessages && typeof validationMessages === 'object' ? validationMessages : {};
  const raw = vm[key];
  if (raw != null && String(raw).trim() !== '') return t(raw);
  return typeof fallback === 'function' ? fallback() : fallback;
};

/** Prefer first present key in `keys` (generic → legacy order). */
export const resolveApiValidationMessageFirst = (validationMessages, keys, fallback) => {
  const vm = validationMessages && typeof validationMessages === 'object' ? validationMessages : {};
  for (const key of keys) {
    const raw = vm[key];
    if (raw != null && String(raw).trim() !== '') return t(raw);
  }
  return typeof fallback === 'function' ? fallback() : fallback;
};

/**
 * Number validation. Applies API regex (format), min_value, max_value, and optional trigger_regex/dependsOn.
 * formatRegex: RegExp or API string - validates the string form of the number (e.g. price "^\\d{1,15}$").
 * integerOnly: when true (API data_type integer), rejects non-whole numbers; false allows decimals (data_type decimal).
 * validationMessages: optional map from `dynamic_fields.validation_messages` (keys: type_error, integer, invalid_format, min_value, max_value).
 */
export const numberValidationYup = (
  requiredMsg,
  trigger_regex,
  dependsOn,
  maxValue,
  minValue,
  formatRegex,
  integerOnly = false,
  validationMessages = null,
) => {
  const msg = (key, def) => resolveApiValidationMessage(validationMessages, key, def);
  const coerceNumber = (value, originalValue) => {
    if (originalValue === '' || originalValue === null || originalValue === undefined) return undefined;
    if (typeof originalValue === 'number' && !Number.isNaN(originalValue)) return originalValue;
    const num = Number(originalValue);
    return Number.isNaN(num) ? undefined : num;
  };
  const typeErrorMsg = msg('type_error', requiredMsg || t('Must be a valid number'));
  let schema = yup
    .number()
    .transform(coerceNumber)
    .typeError(typeErrorMsg)
    .nullable();

  if (integerOnly) {
    schema = schema.integer(msg('integer', t('Must be a whole number')));
  }

  if (trigger_regex && dependsOn) {
    schema = schema.test({
      name: 'custom-required',
      message: requiredMsg || t('This field is required'),
      test: function (value) {
        const triggerValue = dependsOn ? this?.parent?.[dependsOn] : undefined;
        const triggerRe = typeof trigger_regex === 'string' ? regexFromApi(trigger_regex) : trigger_regex;
        if (triggerValue && triggerRe && triggerRe.test(triggerValue)) {
          return !(value === undefined || value === null || isNaN(value));
        }
        return true;
      },
    });
    if (!requiredMsg) {
      schema = schema.optional();
    }
  } else if (requiredMsg) {
    schema = schema.required(requiredMsg);
  } else {
    schema = schema.optional();
  }

  const re = typeof formatRegex === 'string' ? regexFromApi(formatRegex) : formatRegex;
  if (re) {
    schema = schema.test({
      name: 'format',
      message: msg('invalid_format', t('Invalid format')),
      test: (value) => {
        if (value === undefined || value === null) return true;
        const str = String(value);
        return re.test(str);
      },
    });
  }

  if (minValue !== undefined && minValue !== null && !Number.isNaN(Number(minValue))) {
    const limit = Number(minValue);
    schema = schema.test({
      name: 'min-value',
      message: msg('min_value', t('Value must be greater than or equal to {{value}}', { value: limit })),
      test: (value) => {
        if (value === undefined || value === null || isNaN(value)) return true;
        return Number(value) >= limit;
      },
    });
  }

  if (maxValue !== undefined && maxValue !== null && !Number.isNaN(Number(maxValue))) {
    const limit = Number(maxValue);
    schema = schema.test({
      name: 'max-value',
      message: msg('max_value', t('Value must be less than or equal to {{value}}', { value: limit })),
      test: (value) => {
        if (value === undefined || value === null || isNaN(value)) return true;
        return Number(value) <= limit;
      },
    });
  }

  return schema;
};

/**
 * `validation_strategy` **sale_discounted_price**: conditional numeric vs a reference field and a cap fraction.
 * Generic `validation_params`: `condition_field`, `reference_field`, `cap_fraction`
 * (legacy fallbacks: `when_field`, `price_field`, `max_discount_fraction`).
 * Generic `validation_messages`: `required`, `invalid`, `compare_less_than_reference`, `beyond_cap`
 * (legacy fallbacks: `invalid_price`, `vs_listing`, `max_discount_percent`).
 */
export const saleDiscountedPriceConditionalYupFromJson = ({
  validation_messages: vm = {},
  validation_params: vp = {},
} = {}) => {
  const pickStr = (v) => (v != null && String(v).trim() !== '' ? String(v).trim() : null);

  const isDiscountToggleOn = (value) =>
    value === true || value === 'true' || value === 1;

  const conditionField =
    pickStr(vp.condition_field) || pickStr(vp.when_field) || 'property_discount_enabled';
  const referenceField = pickStr(vp.reference_field) || pickStr(vp.price_field) || 'price';
  const capRaw = vp.cap_fraction ?? vp.max_discount_fraction;
  const capFraction =
    capRaw != null && !Number.isNaN(Number(capRaw)) ? Number(capRaw) : 0.2;
  const floorRaw = vp.min_fraction ?? vp.min_discount_fraction;
  const minFraction =
    floorRaw != null && !Number.isNaN(Number(floorRaw)) ? Number(floorRaw) : 0.001;

  const basePriceNumberForDiscount = (parent) => {
    const raw = parent?.[referenceField];
    if (typeof raw === 'object' && raw !== null && 'value' in raw) return Number(raw.value);
    return Number(raw);
  };

  const discountedPriceVsListingMessage = (value, parent) => {
    if (!Number.isFinite(value))
      return resolveApiValidationMessageFirst(vm, ['invalid', 'invalid_price'], t('Invalid Price'));
    const base = basePriceNumberForDiscount(parent);
    if (!Number.isFinite(base) || base <= 0) return null;
    if (value >= base)
      return resolveApiValidationMessageFirst(
        vm,
        ['compare_less_than_reference', 'vs_listing'],
        t('Discounted price must be less than the listing price'),
      );
    return null;
  };

  const discountedPriceMaxDiscountMessage = (value, parent) => {
    if (!Number.isFinite(value)) return null;
    const base = basePriceNumberForDiscount(parent);
    if (!Number.isFinite(base) || base <= 0) return null;
    if (value >= base) return null;
    const minAllowed = base * (1 - capFraction);
    if (value < minAllowed)
      return resolveApiValidationMessageFirst(
        vm,
        ['beyond_cap', 'max_discount_percent'],
        t('The discount cannot exceed 20% of the listing price.'),
      );
    return null;
  };

  const discountedPriceMinDiscountMessage = (value, parent) => {
    if (!Number.isFinite(value)) return null;
    const base = basePriceNumberForDiscount(parent);
    if (!Number.isFinite(base) || base <= 0) return null;
    if (value >= base) return null;
    const maxAllowed = base * (1 - minFraction);
    if (value > maxAllowed)
      return resolveApiValidationMessageFirst(
        vm,
        ['below_floor', 'min_discount_percent'],
        t('The discount must be at least 0.1% of the listing price.'),
      );
    return null;
  };

  const invalidMsg = () =>
    resolveApiValidationMessageFirst(vm, ['invalid', 'invalid_price'], t('Invalid Price'));

  const discountedPriceSchema = yup
    .number()
    .transform((v, orig) => (orig === '' || orig == null ? undefined : v))
    .required(resolveApiValidationMessage(vm, 'required', t('Please enter discounted price')))
    .moreThan(0, invalidMsg())
    .typeError(invalidMsg())
    .test('vs-listing', function (value) {
      const err = discountedPriceVsListingMessage(value, this.parent);
      return err ? this.createError({ message: err }) : true;
    })
    .test('max-discount-percent', function (value) {
      const err = discountedPriceMaxDiscountMessage(value, this.parent);
      return err ? this.createError({ message: err }) : true;
    })
    .test('min-discount-percent', function (value) {
      const err = discountedPriceMinDiscountMessage(value, this.parent);
      return err ? this.createError({ message: err }) : true;
    });

  return yup.mixed().when(conditionField, {
    is: isDiscountToggleOn,
    then: () => discountedPriceSchema,
    otherwise: (schema) => schema.nullable().notRequired(),
  });
};

/**
 * @deprecated Prefer `saleDiscountedPriceConditionalYupFromJson` + `validation_strategy` on dynamic JSON.
 * Kept for non–post-listing callers that still import this symbol.
 */
export const discountedPriceConditionalYup = () => saleDiscountedPriceConditionalYupFromJson({});

/** Optional booleans accept unset; required must have an explicit value (true/false or common UI sentinels). */
export const booleanValidationYup = (isRequired, requiredMsg) => {
  const msg = requiredMsg || t('This field is required');
  const isSet = (v) => v !== undefined && v !== null && v !== '';
  if (isRequired) {
    return yup
      .mixed()
      .required(msg)
      .test('boolean-required', msg, (v) => isSet(v));
  }
  return yup.mixed().nullable().optional();
};

/**
 * Builds validation schema object from form field config (e.g. from API dynamic_fields).
 * Each field's validation() is used; no fallback/static rules. Use for API-only validation.
 * @param {Record<string, { validation?: () => yup.Schema | null }>} fields - Form fields with optional validation()
 * @returns {Record<string, yup.Schema>} Key-value of field key to yup schema
 */
export const createValidationSchemaFromFields = (fields) => {
  if (!fields || typeof fields !== 'object') return {};
  const validations = {};
  Object.keys(fields).forEach((key) => {
    if (fields[key].validation && typeof fields[key].validation === 'function') {
      const schema = fields[key].validation();
      if (!schema) return;
      const rawLabel = fields[key].props?.label ?? fields[key].label;
      const displayLabel =
        typeof rawLabel === 'string'
          ? rawLabel
          : rawLabel != null && (typeof rawLabel === 'number' || typeof rawLabel === 'boolean')
            ? String(rawLabel)
            : '';
      if (displayLabel && typeof schema.label === 'function') {
        validations[key] = schema.label(displayLabel);
      } else {
        validations[key] = schema;
      }
    }
  });
  return validations;
};

/**
 * Builds a yup validation schema from form field config (e.g. from API dynamic_fields).
 * Each field's validation() is used; no fallback/static rules. Use for API-only validation.
 * @param {Record<string, { validation?: () => yup.Schema | null }>} fields - Form fields with optional validation()
 * @returns {yup.ObjectSchema} yup.object().shape(...)
 */
export const buildValidationSchemaFromFields = (fields) => {
  const validations = createValidationSchemaFromFields(fields);
  return yup.object().shape(validations);
};
