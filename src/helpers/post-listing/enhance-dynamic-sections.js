import React from 'react';
import { Popover, Typography } from 'antd';
import tenantUtils from '@utils';
import { Icon } from '../../components/common';
import { formatDiscountPercentageForChip } from '../../components/discount-tag/DiscountTag';
import { listingPriceToNumber } from './dynamic-fields';

const { Text } = Typography;

/**
 * Takes Surge `dynamic_fields` sections and returns the same shape with UI wired up:
 * each section's `list` gets Formik/tenant props on known field types, then `fields` is
 * rebuilt so only keys that should render stay, in the right order for locale.
 */
export function enhancePostListingDynamicSections({
  sections,
  formik,
  user,
  users,
  locale,
  t,
  setLoading,
  derivedPurposeSlug,
  isMobile,
  activePropertyCategoryId,
  loading,
  tenantConstants,
  tenantData,
  dynamicFieldDefinitionsMerged,
  featuresData,
  tooltipText,
  propertyTypeExternalId,
  isLocaleAwareGenerateContent,
  listingRecord,
  showSaleDiscountDynamicFields,
  hiddenAutoTranslateFieldKeys,
}) {
  // Surge expects at least one section with a field map; otherwise there is nothing to enhance.
  if (!sections?.length || !sections[0]?.list) {
    return null;
  }

  // After the user picks a city, block changing it again—except daily-rental stays editable until the listing already has a city in breadcrumb.
  const lockCityAfterSelection =
    derivedPurposeSlug !== 'daily-rental' ||
    !!listingRecord?.location?.breadcrumb?.some((e) => e.level == tenantConstants.LOCATION_LEVELS?.city);

  // For each section we shallow-clone `list`, patch individual fields, then compute the final `fields` array from visibility rules.
  return sections.map((section) => {
    if (!section?.list) {
      // Pass through sections that only carry ordering/metadata until fields are attached.
      return {
        ...section,
        fields: section.fields || [],
      };
    }

    const updatedList = { ...section?.list };
    const sectionFieldKeys = section.fields || [];
    let updatedFields = sectionFieldKeys;

    // Binds the location Surge field to Formik (value/errors/touched) and passes the same callbacks/flags the shared LocationSelect expects.
    if (sectionFieldKeys.some((fk) => updatedList[fk]?.type === 'location-select')) {
      const locationFieldKey =
        sectionFieldKeys.find((fk) => updatedList[fk]?.type === 'location-select') ?? null;
      if (locationFieldKey) {
        const locationValue = formik?.values?.[locationFieldKey] ?? null;
        updatedList[locationFieldKey] = {
          ...updatedList[locationFieldKey],
          props: {
            ...updatedList[locationFieldKey]?.props,
            name: 'Location_select',
            formik: formik,
            setFieldValue: (fieldKey, value, shouldValidate) => {
              formik.setFieldValue(fieldKey, value, shouldValidate);
            },
            setFieldTouched: (fieldKey, touched, shouldValidate) => {
              formik.setFieldTouched(fieldKey, touched, shouldValidate);
            },
            value: locationValue,
            error: formik.errors?.[locationFieldKey],
            touched: formik.touched?.[locationFieldKey],
            onBlur: formik.handleBlur,
            item: { key: locationFieldKey },
            onCityChange: () => {},
            renderCrossCityAlerts: () => null,
            hideLocation: false,
            onLocationSelect: () => {},
            user: user,
            showPlot: true,
            lockCityAfterSelection,
          },
        };
      }
    }

    // Agency admins pick which user the listing posts as (options from `users`); everyone else never sees that row. Phone field is disabled once the account already has a verified number, and country is fixed to the tenant's country.
    if (
      user &&
      (sectionFieldKeys.includes('posting_as') ||
        sectionFieldKeys.some((fk) => updatedList[fk]?.type === 'phone-input-verification'))
    ) {
      const postingKey = sectionFieldKeys.find((fk) => fk === 'posting_as');
      if (postingKey && updatedList[postingKey]) {
        if (user?.is_agency_admin && users?.length > 0) {
          updatedList[postingKey] = {
            ...updatedList[postingKey],
            props: {
              ...updatedList[postingKey].props,
              options: users,
              getOptionLabel: (op) => tenantUtils.getLocalisedString(op, 'name'),
              getOptionValue: (op) => op.id,
              placeholder: t('Select User'),
              labelIcon: 'FiUser',
              coerceSelectValue: 'id',
            },
          };
        }
      }

      updatedFields = sectionFieldKeys.filter((fk) => {
        if (fk !== 'posting_as') return true;
        return !!(user?.is_agency_admin && users?.length > 0);
      });

      const phoneFieldKey =
        updatedFields.find((fk) => updatedList[fk]?.type === 'phone-input-verification') ??
        updatedFields.find((fk) => fk === 'mobile') ??
        null;
      if (phoneFieldKey) {
        const phoneField = updatedList[phoneFieldKey];
        updatedList[phoneFieldKey] = {
          ...phoneField,
          props: {
            ...phoneField?.props,
            disabled:
              phoneField?.props?.disabled === true ||
              (!!user?.is_mobile_verified && (!!user?.['phone'] || !!user?.['mobile'])),
            isUserVerified: user?.is_mobile_verified,
            userType: 'User',
            userId: user?.id,
            defaultCountry: tenantConstants?.COUNTRY_CODE,
            countrySelectProps: { disabled: true },
            containerClassName: 'pos-rel',
          },
        };
      }
    }

    // Walk every field key in this section and layer runtime props onto the Surge JSONForm definition where we recognize the `type`.
    sectionFieldKeys.forEach((key) => {
      if (!updatedList[key]) return;
      // Configures AI title/description rows: which language row is primary, when to show the “generate” switch, payload/skip keys, and RTL for Arabic—so bilingual and single-locale flows both render correctly.
      if (updatedList[key]?.type === 'generate-content') {
        const field = updatedList[key];
        const isTitle = key.includes('title');
        const isDescription = key.includes('description');

        const isArabicField = key.includes('_ar');
        const isEnglishField = key.includes('_en');

        const showAutoSwitchForThisField = isLocaleAwareGenerateContent
          ? locale === 'ar'
            ? (isTitle && isArabicField) || (isDescription && isArabicField)
            : (isTitle && isEnglishField) || (isDescription && isEnglishField)
          : (isTitle && isEnglishField) || (isDescription && isEnglishField);

        const secondaryTitleRow =
          isLocaleAwareGenerateContent &&
          !formik?.values?.generate_title &&
          ((locale === 'en' && isArabicField) || (locale === 'ar' && isEnglishField));
        const secondaryDescriptionRow =
          isLocaleAwareGenerateContent &&
          !formik?.values?.generate_description &&
          ((locale === 'en' && isArabicField) || (locale === 'ar' && isEnglishField));

        const generateContentProps = {
          ...field?.props,
          formik: formik,
          setSubmitDisable: setLoading,
          ...(isTitle && {
            labelIcon: isLocaleAwareGenerateContent && secondaryTitleRow ? undefined : 'PiTextT',
            reserveLabelIconColumn: isLocaleAwareGenerateContent && secondaryTitleRow,
            desc: 'title',
            lineCount: 1,
            showAutoSwitch: showAutoSwitchForThisField,
            payloadKey: isEnglishField ? 'title' : 'title_l1',
            skipField: isEnglishField ? 'property_description_en' : 'property_description_ar',
            name: isArabicField ? 'property_title_ar' : 'property_title_en',
            dir: isArabicField ? 'rtl' : '',
            label: isLocaleAwareGenerateContent
              ? isArabicField
                ? 'عنوان'
                : 'Title'
              : field?.props?.label ?? (isArabicField ? 'عنوان' : 'Title'),
            placeholder: isLocaleAwareGenerateContent
              ? isArabicField
                ? 'أدخل العنوان، على سبيل المثال، منزل جديد جميل...'
                : 'Enter title e.g Beautiful new house...'
              : field?.props?.placeholder ??
                (isArabicField
                  ? 'أدخل العنوان، على سبيل المثال، منزل جديد جميل...'
                  : 'Enter title e.g Beautiful new house...'),
          }),
          ...(isDescription && {
            labelIcon: isLocaleAwareGenerateContent && secondaryDescriptionRow ? undefined : 'BiDetail',
            reserveLabelIconColumn: isLocaleAwareGenerateContent && secondaryDescriptionRow,
            desc: 'description',
            lineCount: isMobile ? 3 : 5,
            limit: 2500,
            showAutoSwitch: showAutoSwitchForThisField,
            payloadKey: isEnglishField ? 'description' : 'description_l1',
            skipField: isEnglishField ? 'property_title_en' : 'property_title_ar',
            name: isArabicField ? 'property_description_ar' : 'property_description_en',
            dir: isArabicField ? 'rtl' : '',
            label: isLocaleAwareGenerateContent
              ? isArabicField
                ? 'وصف'
                : 'Description'
              : field?.props?.label ?? (isArabicField ? 'وصف' : 'Description'),
            placeholder: isLocaleAwareGenerateContent
              ? isArabicField
                ? 'صف عقارك بالتفصيل'
                : 'Describe your property in detail'
              : field?.props?.placeholder ??
                (isArabicField ? 'صف عقارك بالتفصيل' : 'Describe your property in detail'),
          }),
        };

        updatedList[key] = {
          ...field,
          props: generateContentProps,
        };
      }

      // Feeds the image bank the current Formik values and shows validation text only when the image field is touched and invalid.
      if (updatedList[key]?.type === 'image-select-bank') {
        const valueKey = updatedList[key]?.props?.valueKey;
        const touched = valueKey != null ? formik.touched?.[valueKey] : false;
        const err = valueKey != null ? formik.errors?.[valueKey] : undefined;
        updatedList[key] = {
          ...updatedList[key],
          props: {
            ...updatedList[key]?.props,
            values: formik.values,
            setFieldValue: formik.setFieldValue,
            errorMsg: touched && err ? err : undefined,
          },
        };
      }

      // Amenities chip opens the features modal with loading skeleton, tenant quality tip flag, current property type, and options merged from Surge definitions plus any `featuresData` the page prefilled.
      if (updatedList[key]?.type === 'add-amenities') {
        const propertyTypeId = activePropertyCategoryId || formik?.values?.property_type;

        const featuresDef = dynamicFieldDefinitionsMerged?.find((d) => d.apiKeyName === 'features');
        const featuresOptions = featuresDef?.options ?? [];

        updatedList[key] = {
          ...updatedList[key],
          props: {
            ...updatedList[key]?.props,
            skeletonLoading: loading,
            labelIcon: updatedList[key]?.props?.labelIcon || 'MdOutlineOtherHouses',
            bodyStyle: { paddingBlockStart: 'initial' },
            showQualityTip: tenantConstants?.SHOW_QUALITY_TIP || false,
            propertyTypeId: propertyTypeId,
            featuresOptions,
            featuresData,
          },
        };
      }

      // Marks national address as required and renders an info icon that explains the Saudi National Address standard, using `tooltipText` from the page when provided instead of the default translation.
      if (key === 'national_address' && updatedList[key]) {
        const nationalAddressTooltipCopy =
          tooltipText ??
          t(
            'The National Address, developed by Saudi Post, is a uniform address format designed to standardize address information across Saudi Arabia.',
          );

        updatedList[key] = {
          ...updatedList[key],
          props: {
            ...updatedList[key]?.props,
            isOptional: false,
            renderPopover: () => (
              <Popover
                placement="top"
                content={<div style={{ maxWidth: '300px', width: '100%' }}>{nationalAddressTooltipCopy}</div>}
                action="hover"
              >
                <span
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon
                    icon="AiOutlineInfoCircle"
                    size={isMobile ? '1.1em' : '1.2em'}
                    iconProps={{ color: '#222' }}
                  />
                </span>
              </Popover>
            ),
          },
        };
      }

      // When the tenant says Studio is not valid for this property type, strip the Studio choice from buttons/options so users cannot select it.
      if (key === 'bedrooms' && updatedList[key]) {
        const hideStudioBedroomOption =
          typeof tenantData.shouldShowStudioBedroomOption === 'function' &&
          propertyTypeExternalId != null &&
          !tenantData.shouldShowStudioBedroomOption(propertyTypeExternalId);
        if (hideStudioBedroomOption) {
          const isStudioOption = (opt) => {
            if (opt == null) return false;
            if (opt.slug === 'studio') return true;
            const raw = opt.value ?? opt.label;
            return typeof raw === 'string' && raw.trim().toLowerCase() === 'studio';
          };
          const props = updatedList[key].props || {};
          updatedList[key] = {
            ...updatedList[key],
            props: {
              ...props,
              ...(props.buttonList?.length
                ? { buttonList: props.buttonList.filter((o) => !isStudioOption(o)) }
                : {}),
              ...(props.options?.length ? { options: props.options.filter((o) => !isStudioOption(o)) } : {}),
            },
          };
        }
      }

      // Customizes the discount toggle label and syncs Formik: turning the switch off clears `discounted_price`, marks it untouched, and removes that field’s errors so stale validation does not linger.
      if (key === 'property_discount_enabled' && updatedList[key]) {
        updatedList[key] = {
          ...updatedList[key],
          props: {
            ...updatedList[key].props,
            labelIcon: undefined,
            switchOnly: false,
            label: t('Apply Discount'),
            name: 'property_discount_enabled',
            onChange: (checked) => {
              const on = !!checked;
              formik.setFieldValue('property_discount_enabled', on, false);
              if (!on) {
                formik.setFieldValue('discounted_price', '', false);
                formik.setFieldTouched('discounted_price', false, false);
                const nextErrors = { ...(formik.errors || {}) };
                delete nextErrors.discounted_price;
                formik.setErrors(nextErrors);
              }
            },
          },
        };
      }

      // Renders discounted price as a number with currency suffix and, when the discount is on, shows a secondary line with the implied discount percentage (or Formik’s `discount_percentage` when present). Base is the original listing price in `price` — getInitialValues sets it to the original for both sale and rent, so the >/=/< percentage logic is purpose-agnostic.
      if (key === 'discounted_price' && updatedList[key]) {
        const extra = (form) => () => {
          const vals = form.values;
          if (!vals.property_discount_enabled) {
            return null;
          }
          const base = listingPriceToNumber(vals.price);
          const discounted = Number(vals.discounted_price);
          let discountPercentDisplay = null;
          if (base > 0 && discounted > 0 && discounted < base) {
            discountPercentDisplay = ((base - discounted) / base) * 100;
          }
          const hasFormikDiscountPercentage =
            vals.discount_percentage != null && vals.discount_percentage !== '';
          const hasNonEmptyDiscountedPrice =
            vals.discounted_price != null && String(vals.discounted_price).trim() !== '';
          const showDiscountPercentageExtra =
            discountPercentDisplay != null ||
            (hasFormikDiscountPercentage && hasNonEmptyDiscountedPrice);
          const discountPercentageShown =
            hasFormikDiscountPercentage && hasNonEmptyDiscountedPrice
              ? discountPercentDisplay ?? vals.discount_percentage
              : discountPercentDisplay;
          if (!showDiscountPercentageExtra) return null;
          const formatted = formatDiscountPercentageForChip(discountPercentageShown);
          return (
            <Text
              type="secondary"
              className="fz-12 color-gray-dark"
              style={{
                display: 'block',
                textAlign: 'start',
                marginTop: 6,
                width: '100%',
              }}
            >
              {t('Discount Percentage')}:{' '}
              <strong>
                <span dir="ltr">{formatted}%</span>
              </strong>
            </Text>
          );
        };
        updatedList[key] = {
          ...updatedList[key],
          props: {
            ...updatedList[key].props,
            id: 'post-listing-discounted-price',
            type: 'number',
            suffix: <span className="color-gray-dark">{tenantConstants.CURRENCY_SYMBOL()}</span>,
            label: (
              <>
                {t('Discounted Price')} <>({tenantConstants.CURRENCY_SYMBOL()})</>
              </>
            ),
            extra,
          },
        };
      }
    });

    // Tenant hook: some property types never ask for bedroom count at all.
    const hideBedroomsField =
      typeof tenantData.shouldHideBedroomsFieldForPropertyType === 'function' &&
      tenantData.shouldHideBedroomsFieldForPropertyType(propertyTypeExternalId);

    // Builds the ordered list of field keys actually shown: drops auto-translate helper rows, shows `sale_type` only on project listings, hides bedrooms/discount when flags say so, and hides discounted price until the discount switch is on.
    const fieldsForDisplay = updatedFields.filter((fk) => {
      if (hiddenAutoTranslateFieldKeys.includes(fk)) return false;
      if (fk === 'sale_type') {
        return Boolean(listingRecord?.project?.id);
      }
      if (fk === 'bedrooms' && hideBedroomsField) return false;
      if ((fk === 'property_discount_enabled' || fk === 'discounted_price') && !showSaleDiscountDynamicFields) {
        return false;
      }
      if (fk === 'discounted_price' && !formik?.values?.property_discount_enabled) return false;
      return true;
    });

    // In Arabic bilingual mode, if Surge order had English before Arabic, swap each title/description pair so Arabic appears first in the form.
    let fieldsOrderedForLocale = fieldsForDisplay;
    if (isLocaleAwareGenerateContent && locale === 'ar') {
      fieldsOrderedForLocale = [...fieldsForDisplay];
      const pairs = [
        ['property_title_ar', 'property_title_en'],
        ['property_description_ar', 'property_description_en'],
      ];
      for (const [arKey, enKey] of pairs) {
        const iAr = fieldsOrderedForLocale.indexOf(arKey);
        const iEn = fieldsOrderedForLocale.indexOf(enKey);
        if (iAr === -1 || iEn === -1 || iAr < iEn) continue;
        fieldsOrderedForLocale = fieldsOrderedForLocale.filter((k) => k !== arKey && k !== enKey);
        fieldsOrderedForLocale.splice(Math.min(iAr, iEn), 0, arKey, enKey);
      }
    }

    // When bedrooms is hidden entirely, remove it from `list` too so JSONForm does not still receive a definition for a field that is not in `fields`.
    let listForSection = updatedList;
    if (hideBedroomsField && updatedList.bedrooms) {
      listForSection = Object.fromEntries(Object.entries(updatedList).filter(([k]) => k !== 'bedrooms'));
    }

    return {
      ...section,
      list: listForSection,
      fields: fieldsOrderedForLocale,
    };
  });
}
