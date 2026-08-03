import * as yup from 'yup';

/**
 * Client-only `purpose` / `property_type` fields injected into the dynamic sections list.
 * Their Yup rules are defined here (not on `dynamic_fields` rows) so they work before Surge
 * category-driven JSON is resolved; keep in sync with product if those flows gain API fields.
 */
const PROPERTY_INFORMATION_SLUG = 'property-information';

function purposeRequiredSchema(t) {
  return yup
    .mixed()
    .required(t('Please select purpose'))
    .test('purpose', t('Please select purpose'), (v) => v != null && v !== '');
}

function buildPropertyTypeRequiredSchema({
  t,
  propertyTypeChoicesForUi,
  categories,
  categoriesLoading,
}) {
  const allowed = new Set(propertyTypeChoicesForUi.map((o) => String(o.id)));
  const msg = t('Please select property type');
  return yup
    .mixed()
    .required(msg)
    .test('property_type', msg, (v) => allowed.size > 0 && allowed.has(String(v)))
    .test(
      'listing-category-catalog',
      msg,
      (v) =>
        categoriesLoading ||
        !categories?.length ||
        v == null ||
        v === '' ||
        categories.some((c) => c != null && String(c.id) === String(v)),
    );
}

function propertyTypeValidationFactory({
  t,
  isPropertyTypeControlDisabled,
  propertyTypeChoicesForUi,
  categories,
  categoriesLoading,
}) {
  if (isPropertyTypeControlDisabled) {
    return () => null;
  }
  return () =>
    buildPropertyTypeRequiredSchema({
      t,
      propertyTypeChoicesForUi,
      categories,
      categoriesLoading,
    });
}

/**
 * @param {'select' | 'radio'} mode
 */
export function createPropertyTypeFieldDef({
  mode,
  t,
  propertyTypeLabelTranslationKey,
  propertyTypeChoicesForUi,
  isPropertyTypeControlDisabled,
  shouldMaskPropertyTypeSelectValue,
  categories,
  categoriesLoading,
  formik,
  setActivePropertyCategoryId,
  clearUserSelections,
}) {
  const base = {
    display_order: -999,
    validation: propertyTypeValidationFactory({
      t,
      isPropertyTypeControlDisabled,
      propertyTypeChoicesForUi,
      categories,
      categoriesLoading,
    }),
  };

  if (mode === 'select') {
    return {
      type: 'select',
      ...base,
      props: {
        label: t(propertyTypeLabelTranslationKey),
        labelIcon: 'BiBuildingHouse',
        placeholder: t('Select property type'),
        options: propertyTypeChoicesForUi,
        getOptionLabel: (item) => item?.label ?? item?.name,
        getOptionValue: (item) => item?.id,
        disabled: isPropertyTypeControlDisabled,
        ...(shouldMaskPropertyTypeSelectValue ? { value: null } : {}),
        onChange: (value) => {
          if (isPropertyTypeControlDisabled) return;
          setActivePropertyCategoryId(value);
          formik.setFieldValue('property_type', value, true);
          formik.setFieldTouched('property_type', true, false);
          const selectedPropertyType = propertyTypeChoicesForUi.find((pt) => pt.id === value);
          if (selectedPropertyType) {
            formik.setFieldValue('property_type_label', selectedPropertyType.label);
          }
          clearUserSelections();
        },
      },
    };
  }

  return {
    type: 'radio',
    ...base,
    props: {
      label: t(propertyTypeLabelTranslationKey),
      labelIcon: 'BiBuildingHouse',
      shape: 'round',
      valueKey: 'id',
      buttonList: propertyTypeChoicesForUi,
      disabled: isPropertyTypeControlDisabled,
      handleChange: (e) => {
        if (isPropertyTypeControlDisabled) return;
        const newPropertyTypeId = e?.target?.value;
        setActivePropertyCategoryId(newPropertyTypeId);
        formik.setFieldValue('property_type', newPropertyTypeId, true);
        formik.setFieldTouched('property_type', true, false);
        const selectedPropertyType = propertyTypeChoicesForUi.find((pt) => pt.id === newPropertyTypeId);
        if (selectedPropertyType) {
          formik.setFieldValue('property_type_label', selectedPropertyType.label);
        }
        clearUserSelections();
      },
    },
  };
}

function buildPurposeFieldDef({
  t,
  purposeOptions,
  categories,
  formik,
  setActivePurposeCategoryId,
  setActivePropertyCategoryId,
  clearUserSelections,
}) {
  return {
    type: 'radio',
    display_order: -1000,
    validation: () => purposeRequiredSchema(t),
    props: {
      label: t('Select Purpose'),
      labelIcon: 'MdOutlineCheckCircle',
      shape: 'round',
      valueKey: 'id',
      buttonList: purposeOptions,
      handleChange: (e) => {
        const newPurposeId = e?.target?.value;
        setActivePurposeCategoryId(newPurposeId);
        setActivePropertyCategoryId(null);
        const selectedPurpose = categories?.find((cat) => cat.id === newPurposeId && cat.parent_id === null);
        formik.setFieldValue('purpose', newPurposeId, true);
        formik.setFieldValue('purpose_name', selectedPurpose?.purpose ?? null, false);
        formik.setFieldValue('property_type', null, false);
        clearUserSelections();
      },
    },
  };
}

/**
 * Injects client-side purpose + property type controls into dynamic field sections.
 *
 * @returns {Array<object>|undefined} same shape as enhancedFields
 */
export function injectPurposeAndPropertyTypeSections({
  enhancedFields,
  shouldShowPurposeSelector,
  purposeOptions,
  shouldShowPropertyTypeControl,
  propertyTypeLabelTranslationKey,
  shouldRenderPropertyTypeAsSelect,
  propertyTypeOptions,
  propertyTypeSelectOptions,
  isPropertyTypeControlDisabled,
  shouldMaskPropertyTypeSelectValue,
  categories,
  categoriesLoading,
  formik,
  clearUserSelections,
  setActivePurposeCategoryId,
  setActivePropertyCategoryId,
  t,
}) {
  if (!enhancedFields?.length || !enhancedFields[0]?.list) {
    return enhancedFields;
  }

  const prefixKeys = [];
  const clientList = {};

  if (shouldShowPurposeSelector && purposeOptions.length > 0) {
    prefixKeys.push('purpose');
    clientList.purpose = buildPurposeFieldDef({
      t,
      purposeOptions,
      categories,
      formik,
      setActivePurposeCategoryId,
      setActivePropertyCategoryId,
      clearUserSelections,
    });
  }

  if (shouldShowPropertyTypeControl) {
    const propertyTypeChoicesForUi =
      propertyTypeSelectOptions.length > 0 ? propertyTypeSelectOptions : propertyTypeOptions;

    if (shouldRenderPropertyTypeAsSelect) {
      prefixKeys.push('property_type');
      clientList.property_type = createPropertyTypeFieldDef({
        mode: 'select',
        t,
        propertyTypeLabelTranslationKey,
        propertyTypeChoicesForUi,
        isPropertyTypeControlDisabled,
        shouldMaskPropertyTypeSelectValue,
        categories,
        categoriesLoading,
        formik,
        setActivePropertyCategoryId,
        clearUserSelections,
      });
    } else if (propertyTypeChoicesForUi.length > 0) {
      prefixKeys.push('property_type');
      clientList.property_type = createPropertyTypeFieldDef({
        mode: 'radio',
        t,
        propertyTypeLabelTranslationKey,
        propertyTypeChoicesForUi,
        isPropertyTypeControlDisabled,
        shouldMaskPropertyTypeSelectValue: false,
        categories,
        categoriesLoading,
        formik,
        setActivePropertyCategoryId,
        clearUserSelections,
      });
    }
  }

  if (prefixKeys.length === 0) {
    return enhancedFields;
  }

  const baseList = enhancedFields[0].list;
  const piIdx = enhancedFields.findIndex((s) => s.slug === PROPERTY_INFORMATION_SLUG);

  const withClientInAllLists = enhancedFields.map((section) => ({
    ...section,
    list: { ...section.list, ...clientList },
  }));

  if (piIdx < 0) {
    const syntheticSection = {
      title: t('Property Information'),
      id: 1,
      slug: PROPERTY_INFORMATION_SLUG,
      icon: 'PropertyInformationIcon',
      fields: prefixKeys,
      list: { ...baseList, ...clientList },
    };
    return [syntheticSection, ...withClientInAllLists];
  }

  return withClientInAllLists.map((section, index) => {
    if (index !== piIdx) return section;
    const restKeys = (section.fields || []).filter((k) => !prefixKeys.includes(k));
    return {
      ...section,
      fields: [...prefixKeys, ...restKeys],
    };
  });
}
