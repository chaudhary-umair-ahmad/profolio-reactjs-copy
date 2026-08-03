import tenantConstants from '@constants';
import tenantData from '@data';
import tenantUtils from '@utils';
import { Col, Row, Typography } from 'antd';
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useScrollToPageSection } from '../../../hooks';
import { Flex, Group, Icon, Skeleton } from '../../common';
import CreditInfo from '../../credits-info/credits-info';
import { IconStyled } from '../../common/icon/IconStyled';
import { BlockTitle, CardListing } from '../../../tenant/common/components/post-listing/styled';
import { buildValidationSchemaFromFields } from '../../../helpers/validations';
import { JSONFormStyled } from '../../common/json-form/json-form';
import PostListingSkeleton from './post-listing-from-skeleton';
import DynamicFieldsShimmer from './dynamic-fields-shimmer';
import {
  useGetListingCategoriesQuery,
  useGetSurgeFeaturesQuery,
} from '../../../apis/postlisting';
import { getPropertyTypeIcon, getPurposeIcon } from '../../../helpers';
import Transformers from '@transformers';
import {
  buildPropertyTypeOptions,
  buildPropertyTypeSelectOptions,
  computeMaskPropertyTypeSelectValue,
  derivePurposeSlugForDynamicFields,
  enhancePostListingDynamicSections,
  getDynamicFormFieldsData,
  getHiddenFieldKeysForAutoTranslate,
  injectPurposeAndPropertyTypeSections,
  resolvePostListingFormUiFlags,
} from '../../../helpers/post-listing';
import PostListingFormSectionsLayout from './post-listing-form-sections-layout';
const { Text } = Typography;

// Field enhancements are driven by JSONForm `type` / API ui_type within each section’s `fields` list
// (sections and grouping come from each field’s dynamic_section in /dynamic_fields).

const PostListingForm = (props) => {
  const {
    loading,
    formik,
    isMobile,
    setLoading,
    users = [],
    listingPurposeId,
    clearUserSelections = () => {},
    tooltipText,
    isDailyRental = false,
    packageInfo = false,
    setAutoGenerateContent,
    onValidationSchemaReady,
    onDynamicFieldDefinitionsReady,
    listing: listingRecord = null,
  } = props;

  const { user } = useSelector((state) => state.app.loginUser);
  const { locale } = useSelector((state) => state?.app?.AppConfig);
  const { t } = useTranslation();
  const packageCreditsAvailable = useMemo(
    () => Math.round(Number(user?.credits?.ksa?.available ?? user?.credits?.bayut?.available ?? 0) || 0),
    [user?.credits?.ksa?.available, user?.credits?.bayut?.available],
  );
  const uiFlags = useMemo(
    () => resolvePostListingFormUiFlags({ tenantConstants, listingRecord, isDailyRental }),
    [tenantConstants, listingRecord, isDailyRental],
  );

  const {
    isLocaleAwareGenerateContent,
    shouldShowPurposeSelector,
    shouldRenderPropertyTypeAsSelect,
    shouldPreferPayloadCategoriesForPropertyType,
    projectPropertyTypeExternalIdOrder,
    propertyTypeLabelTranslationKey,
    payloadListingCategories,
    hasEmptyPayloadListingCategories,
    isListingLinkedToProject,
  } = uiFlags;

  /** Top-level listing purpose category (parent_id null in Surge listing_categories). */
  const [activePurposeCategoryId, setActivePurposeCategoryId] = useState(null);
  /** Selected property type row (child category under purpose). */
  const [activePropertyCategoryId, setActivePropertyCategoryId] = useState(null);

  // Match hatla2ee: categories with skip when loading
  const { data: categories, isLoading: categoriesLoading } = useGetListingCategoriesQuery(undefined, {
    skip: !!loading,
  });

  const derivedPurposeSlug = useMemo(
    () =>
      derivePurposeSlugForDynamicFields({
        isDailyRental,
        activePurposeCategoryId,
        categories,
      }),
    [isDailyRental, activePurposeCategoryId, categories],
  );

  // Discount availability is driven entirely by the backend `discount_applicable` flag — it
  // already encodes REGA/purpose/off-plan eligibility — plus the per-tenant feature flag.
  const showSaleDiscountDynamicFields = useMemo(
    () => tenantConstants.SHOW_LISTING_DISCOUNT_TAG && formik?.values?.discount_applicable === true,
    [tenantConstants.SHOW_LISTING_DISCOUNT_TAG, formik?.values?.discount_applicable],
  );

  const propertyTypeExternalId = useMemo(() => {
    const internalId = formik?.values?.['property_type'];
    if (internalId == null || internalId === '') return null;
    const list =
      shouldPreferPayloadCategoriesForPropertyType && payloadListingCategories?.length > 0
        ? payloadListingCategories
        : categories;
    const row = list?.find((c) => c.id === internalId);
    const ext = row?.external_id;
    if (ext != null && ext !== '') {
      const n = Number(ext);
      if (!Number.isNaN(n)) return n;
    }
    return Number(internalId);
  }, [formik?.values?.['property_type'], categories, shouldPreferPayloadCategoriesForPropertyType, payloadListingCategories]);

  // Match hatla2ee: single dynamic fields query with skip + refetchOnMountOrArgChange (no lazy)
  const categoryId = activePropertyCategoryId || activePurposeCategoryId;
  const propertyTypeIdForFeatures = activePropertyCategoryId || formik?.values?.['property_type'];

  const dynamicFieldsData = useMemo(() => {
    if (!categoryId || loading) return null;
    return getDynamicFormFieldsData({
      categoryId,
      locale,
      user,
      cities: [],
      useSecondaryDisplayOrder: isDailyRental,
      isDailyRental,
      listingPurposeKey: derivedPurposeSlug,
      propertyTypeId: propertyTypeExternalId,
      /**
       * Fallback land detection when the Property Type field is still empty: the API
       * listing_category (e.g. Land) already tells us it's a land listing, so completion
       * status must stay hidden even before a sub-type is picked.
       */
      categoryExternalId: listingRecord?.listing_category?.external_id ?? null,
      /** Bayut static field map still reads `hasProjectAttached` from this arg. */
      hasProjectAttached: isListingLinkedToProject,
    });
  }, [
    categoryId,
    loading,
    locale,
    user,
    isDailyRental,
    derivedPurposeSlug,
    propertyTypeExternalId,
    listingRecord?.listing_category?.external_id,
    isListingLinkedToProject,
  ]);
  const { data: surgeFeatureOptions } = useGetSurgeFeaturesQuery(
    { sourceId: propertyTypeIdForFeatures },
    {
      skip: !propertyTypeIdForFeatures || !!loading,
      refetchOnMountOrArgChange: true,
    },
  );

  const dynamicFieldDefinitionsMerged = useMemo(() => {
    const defs = dynamicFieldsData?.dynamicFieldDefinitions;
    if (!defs?.length) return defs;
    if (!surgeFeatureOptions?.length) return defs;
    return defs.map((d) =>
      d.apiKeyName === 'features' ? { ...d, options: surgeFeatureOptions } : d,
    );
  }, [dynamicFieldsData?.dynamicFieldDefinitions, surgeFeatureOptions]);

  // Align purpose with listing_categories: prefer listing / Formik when valid; default to Sale only when unset.
  // Runs when categories or listing hydration changes so we can correct an early "Sale" default before Formik had purpose id.
  useEffect(() => {
    if (!categories?.length) return;

    const purposeCategories = categories.filter((cat) => cat.parent_id === null);
    const targetPurposeId = listingPurposeId ?? formik?.values?.['purpose'];

    if (targetPurposeId != null && targetPurposeId !== '') {
      const isValidPurpose = purposeCategories.find((cat) => cat.id === targetPurposeId);
      if (isValidPurpose) {
        if (activePurposeCategoryId !== targetPurposeId) {
          setActivePurposeCategoryId(targetPurposeId);
        }
        if (!formik?.values?.purpose_name) {
          formik.setFieldValue('purpose_name', isValidPurpose.purpose, false);
        }
        return;
      }
    }

    if (activePurposeCategoryId != null) return;

    const sellPurpose = purposeCategories.find((cat) => cat.purpose === 'Sale');
    if (sellPurpose) {
      setActivePurposeCategoryId(sellPurpose.id);
      formik.setFieldValue('purpose', sellPurpose.id, false);
      formik.setFieldValue('purpose_name', sellPurpose.purpose ?? purposeCategories[0]?.purpose, false);
    } else if (purposeCategories.length > 0) {
      const firstPurpose = purposeCategories[0];
      setActivePurposeCategoryId(firstPurpose.id);
      formik.setFieldValue('purpose', firstPurpose.id, false);
      formik.setFieldValue('purpose_name', firstPurpose.purpose, false);
    }
  }, [categories, listingPurposeId, formik?.values?.['purpose'], formik?.values?.purpose_name, activePurposeCategoryId]);

  // Initialize property type from formik if available and sync when it changes
  useEffect(() => {
    const propertyTypeId = formik?.values?.['property_type'];
    if (propertyTypeId && activePurposeCategoryId) {
      let isValidPropertyType = false;
      if (shouldPreferPayloadCategoriesForPropertyType && payloadListingCategories.length > 0) {
        isValidPropertyType = payloadListingCategories.some((cat) => cat?.id === propertyTypeId);
      } else if (categories && categories.length > 0) {
        isValidPropertyType = Boolean(
          categories.find((cat) => cat?.id === propertyTypeId && cat?.parent_id === activePurposeCategoryId),
        );
      }
      if (isValidPropertyType) {
        setActivePropertyCategoryId((prev) => {
          if (prev !== propertyTypeId) {
            return propertyTypeId;
          }
          return prev;
        });
      }
    } else if (!propertyTypeId) {
      setActivePropertyCategoryId((prev) => {
        if (prev !== null) {
          return null;
        }
        return prev;
      });
    }
  }, [
    formik?.values?.['property_type'],
    categories,
    activePurposeCategoryId,
    shouldPreferPayloadCategoriesForPropertyType,
    payloadListingCategories,
  ]);

  useEffect(() => {
    if (!isDailyRental || !categories?.length || !listingRecord?.listing_category?.slug) return;
    const slug = String(listingRecord.listing_category.slug).toLowerCase().trim();
    const daily = categories.filter(
      (c) =>
        c?.parent_id != null &&
        String(c?.purpose_hash?.slug || '').toLowerCase().trim() === 'daily-rental',
    );
    const row = daily.find((c) => String(c.slug || '').toLowerCase().trim() === slug);
    const cur = Number(formik.values?.property_type);
    if (!row?.id || daily.some((c) => Number(c.id) === cur)) return;
    formik.setFieldValue('property_type', row.id, false);
    formik.setFieldValue(
      'property_type_label',
      tenantUtils.getLocalisedString(row, 'name') || row.name,
      false,
    );
    setActivePropertyCategoryId(row.id);
  }, [isDailyRental, categories, listingRecord?.listing_category?.slug, listingRecord?.id, formik.values?.property_type]);

  const prevListingCategoryIdRef = useRef(undefined);

  useEffect(() => {
    const cur = formik.values?.property_type;
    const prev = prevListingCategoryIdRef.current;
    prevListingCategoryIdRef.current = cur;

    if (prev === undefined) {
      return;
    }
    const normalizeCategoryId = (value) => (value == null || value === '' ? null : String(value));
    if (normalizeCategoryId(prev) === normalizeCategoryId(cur)) {
      return;
    }
    if (normalizeCategoryId(prev) == null) {
      return;
    }
    formik.setFieldValue('feature_and_amenities', null, false);
    formik.setFieldValue('features', null, false);
  }, [formik.values?.property_type, formik.setFieldValue]);

  const sections = dynamicFieldsData?.sections ?? [];

  const hiddenAutoTranslateFieldKeys = useMemo(
    () =>
      getHiddenFieldKeysForAutoTranslate({
        isLocaleAwareGenerateContent,
        locale,
        generateTitle: Boolean(formik?.values?.generate_title),
        generateDescription: Boolean(formik?.values?.generate_description),
      }),
    [
      isLocaleAwareGenerateContent,
      locale,
      formik?.values?.generate_title,
      formik?.values?.generate_description,
    ],
  );

  // Features modal: field layout from static/dynamic_fields; options from /api/surge/features when available
  const featuresData = useMemo(() => {
    const featuresDef = dynamicFieldDefinitionsMerged?.find((d) => d.apiKeyName === 'features');
    return featuresDef && typeof Transformers.dynamicFieldsToFeaturesModalData === 'function'
      ? Transformers.dynamicFieldsToFeaturesModalData(featuresDef, { useSecondaryDisplayOrder: isDailyRental })
      : { fields: {}, fieldsSections: [] };
  }, [dynamicFieldDefinitionsMerged, isDailyRental]);

  // Enhance dynamic fields with user data, cities, and formik
  const enhancedFields = useMemo(
    () =>
      enhancePostListingDynamicSections({
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
      }),
    [
      sections,
      user,
      users,
      locale,
      formik,
      formik?.values?.generate_title,
      formik?.values?.generate_description,
      setLoading,
      derivedPurposeSlug,
      isMobile,
      activePropertyCategoryId,
      listingRecord,
      loading,
      tenantConstants,
      tenantData,
      dynamicFieldDefinitionsMerged,
      featuresData,
      t,
      tooltipText,
      propertyTypeExternalId,
      isLocaleAwareGenerateContent,
      showSaleDiscountDynamicFields,
      formik?.values?.property_discount_enabled,
      hiddenAutoTranslateFieldKeys,
    ],
  );

  // Prepare purpose options (categories where parent_id === null) for radio buttons
  const purposeOptions = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const purposeCategories = categories.filter((cat) => cat.parent_id === null);

    // Sort by display_order
    purposeCategories.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return purposeCategories.map((cat) => {
      const purposeValue = cat.purpose || tenantUtils.getLocalisedString(cat, 'name') || cat.name;
      const icon = getPurposeIcon(cat.purpose);

      return {
        key: cat.id,
        label: purposeValue, // Show purpose instead of name
        value: cat.id,
        id: cat.id,
        purpose: cat.purpose,
        ...(icon && { icon: icon }), // Add icon if found
      };
    });
  }, [categories]);

  const propertyTypeOptions = useMemo(
    () =>
      buildPropertyTypeOptions({
        categories,
        activePurposeCategoryId,
        shouldPreferPayloadCategoriesForPropertyType,
        payloadListingCategories,
        isDailyRental,
        isListingLinkedToProject,
        formikPropertyType: formik?.values?.property_type,
        projectPropertyTypeExternalIdOrder,
        tenantUtils,
        getPropertyTypeIcon,
      }),
    [
      categories,
      activePurposeCategoryId,
      shouldPreferPayloadCategoriesForPropertyType,
      payloadListingCategories,
      isDailyRental,
      isListingLinkedToProject,
      formik?.values?.property_type,
      projectPropertyTypeExternalIdOrder,
    ],
  );

  const shouldShowPropertyTypeControl =
    activePurposeCategoryId && (hasEmptyPayloadListingCategories || propertyTypeOptions.length > 0);
  const isPropertyTypeControlDisabled = hasEmptyPayloadListingCategories && !isListingLinkedToProject;

  const shouldMaskPropertyTypeSelectValue = useMemo(
    () =>
      computeMaskPropertyTypeSelectValue({
        shouldRenderPropertyTypeAsSelect,
        isPropertyTypeControlDisabled,
        formikPropertyType: formik?.values?.property_type,
        propertyTypeOptions,
      }),
    [
      shouldRenderPropertyTypeAsSelect,
      isPropertyTypeControlDisabled,
      formik?.values?.property_type,
      propertyTypeOptions,
    ],
  );

  const propertyTypeSelectOptions = useMemo(
    () =>
      buildPropertyTypeSelectOptions({
        propertyTypeOptions,
        hasEmptyPayloadListingCategories,
        formikPropertyType: formik?.values?.property_type,
        formikPropertyTypeLabel: formik?.values?.property_type_label,
        listingCategory: listingRecord?.listing_category,
        tenantUtils,
      }),
    [
      propertyTypeOptions,
      hasEmptyPayloadListingCategories,
      formik?.values?.property_type,
      formik?.values?.property_type_label,
      listingRecord?.listing_category,
    ],
  );

  /** Purpose + property type live in the first section from /dynamic_fields (no separate "Property Information" card). */
  const sectionsWithClientPurposeFields = useMemo(
    () =>
      injectPurposeAndPropertyTypeSections({
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
      }),
    [
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
      t,
    ],
  );

  /** Same hidden keys as fieldsForDisplay; strip validation so Yup does not validate invisible fields. */
  const listForValidation = useMemo(() => {
    if (!sectionsWithClientPurposeFields?.length || !sectionsWithClientPurposeFields[0]?.list) return null;
    const raw = sectionsWithClientPurposeFields[0].list;
    let list = { ...raw };
    for (const key of hiddenAutoTranslateFieldKeys) {
      if (list[key]) {
        list[key] = { ...list[key] };
        delete list[key].validation;
      }
    }
    return list;
  }, [sectionsWithClientPurposeFields, hiddenAutoTranslateFieldKeys]);

  // Notify parent of API dynamic field definitions for payload building (includes Surge feature options when loaded)
  useEffect(() => {
    if (onDynamicFieldDefinitionsReady && dynamicFieldDefinitionsMerged?.length) {
      onDynamicFieldDefinitionsReady(dynamicFieldDefinitionsMerged);
    }
  }, [dynamicFieldDefinitionsMerged, onDynamicFieldDefinitionsReady]);

  // Notify parent of validation schema only when the set of validated field keys changes (avoids infinite loop from new schema reference each run)
  const validationKeysRef = useRef('');

  useEffect(() => {
    if (!onValidationSchemaReady || !listForValidation) return;
    const keysWithValidation = Object.keys(listForValidation)
      .filter((key) => listForValidation[key].validation && typeof listForValidation[key].validation === 'function')
      .sort()
      .join(',');
    const memoKey = `${keysWithValidation}|${categoriesLoading ? 1 : 0}|${propertyTypeOptions.length}`;
    if (validationKeysRef.current === memoKey) return;
    validationKeysRef.current = memoKey;
    const schema = buildValidationSchemaFromFields(listForValidation);
    onValidationSchemaReady(schema);
  }, [listForValidation, onValidationSchemaReady, categoriesLoading, propertyTypeOptions.length]);

  const setFieldError = formik.setFieldError;
  useEffect(() => {
    if (!setFieldError || !hiddenAutoTranslateFieldKeys.length) return;
    hiddenAutoTranslateFieldKeys.forEach((key) => setFieldError(key, undefined));
  }, [hiddenAutoTranslateFieldKeys, setFieldError]);

  useEffect(() => {
    if (tenantConstants?.AUTO_TRANSLATE_CONTENT) {
      setAutoGenerateContent((prev) => ({
        ...prev,
        title: formik.values?.generate_title,
        description: formik.values?.generate_description,
      }));
    }
  }, [
    formik.values?.generate_title,
    formik.values?.generate_description,
    locale,
    tenantConstants?.AUTO_TRANSLATE_CONTENT,
  ]);
  useScrollToPageSection();

  const hasFormConfig = categories && categories.length > 0;

  return (
    <>
      {categoriesLoading && (
        <PostListingSkeleton icon="PropertyInformationIcon" title={t('Loading...')} loading={true}>
          <Group gap="32px" style={{ maxWidth: 640 }}>
            <Skeleton type="button" width="100%" height={40} />
            <Skeleton type="button" width="100%" height={40} />
          </Group>
        </PostListingSkeleton>
      )}

      {!categoriesLoading && !hasFormConfig && (
        <PostListingSkeleton icon="PropertyInformationIcon" title={t('Post Listing')}>
          <Group gap="32px" style={{ maxWidth: 640 }}>
            <Text type="secondary">{t('Form configuration is not available.')}</Text>
          </Group>
        </PostListingSkeleton>
      )}

      {/* Dynamic fields loading shimmer – shown from start (during categoriesLoading) until dynamic fields are loaded */}
      {(categoriesLoading || hasFormConfig) &&
        !(enhancedFields && enhancedFields.length > 0 && enhancedFields[0]?.list) && (
          <DynamicFieldsShimmer sectionCount={4} gap={isMobile ? '12px' : '32px'} />
        )}

      {/* Dynamic form sections via JSONForm (hatla2ee approach) */}
      {activePurposeCategoryId &&
        sectionsWithClientPurposeFields &&
        sectionsWithClientPurposeFields.length > 0 &&
        sectionsWithClientPurposeFields[0]?.list && (
          <JSONFormStyled
            formik={formik}
            fields={sectionsWithClientPurposeFields[0].list}
            fieldsSections={sectionsWithClientPurposeFields}
            formFieldValues={formik.values}
            loading={false}
            hideSubmit
            groupGap={isMobile ? '12px' : '32px'}
            layoutProps={{ users }}
            layout={(layoutProps) => <PostListingFormSectionsLayout {...layoutProps} t={t} />}
          />
        )}

      {packageInfo && packageCreditsAvailable > 0 && (
        <div id="creditsInfo">
          <CardListing>
            <Row align="middle" gutter={[32, 16]}>
              {!isMobile && (
                <Col xs={24} lg={5} style={{ alignSelf: 'self-start' }}>
                  <Row align="middle" gutter={[16, 0]}>
                    <Col xs={4} lg={24}>
                      <Icon icon="IconPackageCredit" width={52} height={52} />
                    </Col>
                    <Col xs={20} lg={24}>
                      <BlockTitle>{t('Package & Credits Info')}</BlockTitle>
                    </Col>
                  </Row>
                </Col>
              )}
              <Col xs={24} lg={19}>
                {isMobile && (
                  <Flex gap="16px" align="start">
                    <IconStyled>
                      <Icon icon="IconCredit" />
                    </IconStyled>
                    <Flex vertical gap="8px" className="w-100">
                      <Text strong>{t('Package & Credits Info')}</Text>
                    </Flex>
                  </Flex>
                )}
                <CreditInfo
                  isMobile={isMobile}
                  loading={loading}
                  cardStyle={{ marginInlineStart: '48px', width: !isMobile && '594px', borderWidth: 1 }}
                />
              </Col>
            </Row>
          </CardListing>
        </div>
      )}
    </>
  );
};

export default PostListingForm;
