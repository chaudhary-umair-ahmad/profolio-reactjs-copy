import tenantData from '@data';
import tenantConstants from '@constants';
import tenantUtils from '@utils';
import { Space } from 'antd';
import { t as translate } from 'i18next';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, DrawerModal, Group, Icon, JSONForm, Tag, Title } from '../../common';
import Label from '../../common/Label/Label';
import { IconStyled } from '../../common/icon/IconStyled';
import QualityTip from '../quality-tip/quality-tip';
import { addAmenitiesEvent } from '../../../services/analyticsService';
import { COMMA_SPLIT } from '../../../constants/dynamicFields';
import { getFeatureAmenityIconName } from '../../../helpers/featureAmenitySlugToIcon';

const isRichFeatureValue = (v) =>
  v &&
  typeof v === 'object' &&
  Object.keys(v).length > 0 &&
  Object.values(v).some((x) => x && typeof x === 'object' && (x.slug != null || x.id != null));

/** Rich feature row should appear in tags / count only when the user has an active value (not cleared / unchecked). */
const isRichFeatureActive = (v) => {
  if (!v || typeof v !== 'object') return false;
  const val = v.value;
  if (val === false || val === '' || val == null) return false;
  return true;
};

/** Parse option value/value_l1 from API (comma-separated). Single source: dynamic_fields API. */
const getOptionValueParts = (opt) => ({
  valueParts: opt.value != null ? String(opt.value).split(COMMA_SPLIT).map((x) => x.trim()) : [],
  valueL1Parts: opt.value_l1 != null ? String(opt.value_l1).split(COMMA_SPLIT).map((x) => x.trim()) : [],
  hasComma: (opt.value != null && COMMA_SPLIT.test(String(opt.value))) || (opt.value_l1 != null && COMMA_SPLIT.test(String(opt.value_l1))),
});

/**
 * Features/amenities UI driven only by dynamic_fields API.
 * Expects featuresData (fields + fieldsSections) and featuresOptions from dynamicFieldDefinitions;
 * no fallbacks, no Yes/No or 1/0 conversion — uses API value/value_l1 as-is.
 */
const AddAmenities = (props) => {
  const {
    labelIcon,
    label = <div className="fw-700">{translate('Feature and Amenities')}</div>,
    description = translate('Add additional features e.g. parking spaces, waste disposal, internet etc.'),
    formProps,
    handleChange,
    handleBlur,
    value,
    name,
    type = 'primary',
    shape = true,
    template = 'max-content auto',
    showQualityTip = false,
    propertyTypeId,
    listingPurpose,
    isPosted,
    featuresOptions = [],
    featuresData = { fields: {}, fieldsSections: [] },
    ...rest
  } = props;

  const { t, i18n } = useTranslation();
  const jsonFormRef = useRef();
  const legacyConvertedRef = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser?.user);

  const optionsMapById = useMemo(() => {
    const m = {};
    (featuresOptions || []).forEach((opt) => {
      m[opt.id] = opt;
    });
    return m;
  }, [featuresOptions]);

  const amenitiesModalFieldsSections = useMemo(
    () =>
      (featuresData?.fieldsSections ?? []).map((section) => ({
        ...section,
        title:
          section?.title != null || section?.title_l1 != null
            ? tenantUtils.getLocalisedString(section, 'title')
            : section?.title,
      })),
    [featuresData?.fieldsSections, i18n.language],
  );
  const selectedItemsCount = useMemo(() => {
    if (!value || typeof value !== 'object') return 0;
    if (isRichFeatureValue(value)) {
      return Object.values(value).filter((v) => isRichFeatureActive(v)).length;
    }
    return Object.values(value).filter((v) => v !== '' && v !== undefined && v !== null && v !== false).length;
  }, [value]);

  const getIconName = (id) => {
    if (!tenantConstants?.SHOW_AMENITIES_ICON) return '';
    const slug = optionsMapById[id]?.slug;
    return getFeatureAmenityIconName(tenantData.amenities, id, slug);
  };

  const toModalValues = useCallback(
    (val) => {
      if (!val || typeof val !== 'object') return {};
      if (isRichFeatureValue(val) && featuresOptions?.length) {
        return Object.fromEntries(
          featuresOptions.map((opt) => {
            const raw = val[opt.id]?.value;
            let formVal = '';
            if (raw !== undefined && raw !== '' && raw != null) {
              const { valueParts, hasComma } = getOptionValueParts(opt);
              if (hasComma && valueParts.length) {
                formVal = raw === valueParts[0];
              } else if (opt.value != null || opt.value_l1 != null) {
                formVal = raw === opt.value || raw === opt.value_l1;
              } else {
                formVal = raw;
              }
            }
            return [opt.id, formVal];
          }),
        );
      }
      return val;
    },
    [featuresOptions],
  );

  const fromModalValues = useCallback(
    (raw) => {
      if (!raw || typeof raw !== 'object') return {};
      const out = {};
      Object.entries(raw).forEach(([k, v]) => {
        const opt = optionsMapById[k] ?? featuresOptions?.find((o) => o.id == k);
        if (!opt) return;
        // Modal checkboxes use false when unchecked; omit so parent Formik replaces with only active selections.
        if (v === '' || v == null || v === false) return;
        const { valueParts, valueL1Parts, hasComma } = getOptionValueParts(opt);
        let valueOut;
        let valueL1Out;
        if (hasComma && valueParts.length) {
          const selected = v === true;
          valueOut = selected ? valueParts[0] : (valueParts[1] ?? valueParts[0]);
          valueL1Out = valueL1Parts.length
            ? (selected ? valueL1Parts[0] : (valueL1Parts[1] ?? valueL1Parts[0]))
            : opt.value_l1;
        } else if (opt.value != null || opt.value_l1 != null) {
          valueOut = v === true ? (opt.value ?? null) : null;
          valueL1Out = v === true ? (opt.value_l1 ?? null) : null;
        } else {
          valueOut = v;
          const ft = String(opt?.format_type ?? '')
            .trim()
            .toLowerCase();
          if (ft === 'number') {
            valueL1Out = v;
          } else {
            valueL1Out = opt.value_l1 != null ? opt.value_l1 : null;
          }
        }
        out[opt.id] = {
          id: opt.id,
          slug: opt.slug ?? null,
          value: valueOut,
          value_l1: valueL1Out,
        };
      });
      return out;
    },
    [optionsMapById, featuresOptions],
  );

  useEffect(() => {
    if (legacyConvertedRef.current || !featuresOptions?.length || !value || typeof value !== 'object' || isRichFeatureValue(value))
      return;
    const rawKeys = Object.keys(value);
    if (rawKeys.length === 0) return;
    const looksLegacy = rawKeys.every(
      (k) => /^\d+$/.test(k) && (value[k] === true || value[k] === false || value[k] === '' || typeof value[k] === 'string'),
    );
    if (!looksLegacy) return;
    legacyConvertedRef.current = true;
    const modalShape = Object.fromEntries(
      featuresOptions.map((opt, i) => [
        opt.id,
        value[i + 1] !== '' && value[i + 1] !== undefined && value[i + 1] !== false ? value[i + 1] : '',
      ]),
    );
    const rich = fromModalValues(modalShape);
    if (Object.keys(rich).length > 0 || rawKeys.some((k) => value[k])) {
      handleChange(rich);
    }
  }, [featuresOptions, value, fromModalValues, handleChange]);

  const getTagsSection = useCallback(
    (arg) => {
      if (isRichFeatureValue(arg) && featuresOptions?.length) {
        const arr = [];
        (featuresData?.fieldsSections ?? []).forEach((e) => {
          const fields = {};
          (e.fields ?? []).forEach((fid) => {
            const v = arg?.[fid];
            if (v && typeof v === 'object' && isRichFeatureActive(v)) {
              const opt = optionsMapById[fid] ?? featuresOptions.find((o) => o.id == fid);
              fields[fid] = {
                label: opt?.label ?? opt?.value ?? null,
                label_l1: opt?.label_l1 ?? opt?.value_l1 ?? null,
                ...v,
              };
            }
          });
          if (Object.keys(fields).length) {
            arr.push({
              title: tenantUtils.getLocalisedString(e, 'title') ?? e.title ?? null,
              fields,
            });
          }
        });
        if (arr.length) return arr;
        const fallback = {};
        Object.entries(arg).forEach(([id, v]) => {
          if (v && typeof v === 'object' && isRichFeatureActive(v)) {
            const opt = optionsMapById[id] ?? featuresOptions.find((o) => o.id == id);
            fallback[id] = {
              label: opt?.label ?? opt?.value ?? null,
              label_l1: opt?.label_l1 ?? opt?.value_l1 ?? null,
              ...v,
            };
          }
        });
        return Object.keys(fallback).length ? [{ title: translate('Features'), fields: fallback }] : [];
      }
      const arr = [];
      (featuresData?.fieldsSections ?? []).forEach((e) => {
        const fields = {};
        (e.fields ?? []).forEach((it) => {
          if (arg && !(arg[it] === '' || arg[it] === undefined || arg[it] === false)) {
            fields[it] = arg[it];
          }
        });
        if (Object.keys(fields).length) {
          arr.push({ title: tenantUtils.getLocalisedString(e, 'title') ?? e.title ?? null, fields });
        }
      });
      return arr;
    },
    [featuresData, featuresOptions, optionsMapById],
  );

  return (
    <Group template={template} gap="16px">
      {labelIcon && (
        <IconStyled>
          <Icon icon={labelIcon} />
        </IconStyled>
      )}

      <div className="grid" style={{ '--gap': '8px', gridTemplateColumns: '1fr auto' }}>
        <div>
          <Label htmlFor={name}>{label}</Label>
          <div className="text-muted">{description}</div>
        </div>
        <div>
          <Button
            type={type}
            shape={shape && 'round'}
            className="px-16"
            style={{ borderRadius: '6px' }}
            onClick={() => {
              setShowModal(true);
              addAmenitiesEvent(user, isPosted, listingPurpose?.title);
            }}
          >
            {t('Add Amenities')}
          </Button>
        </div>
        {showQualityTip && (
          <QualityTip type="features" count={selectedItemsCount} propertyId={propertyTypeId} className="span-all" />
        )}
        <Space className="span-all" size={16} direction="vertical">
          {getTagsSection(value).map((item, i) => {
            return (
              <div key={i}>
                <Title style={{ fontSize: '14px' }} className="color-gray-dark">
                  {item.title}
                </Title>
                <div className="flex" style={{ gap: '8px', flexFlow: 'wrap' }}>
                  {Object.keys(item.fields).map((e) => {
                    const isRich = isRichFeatureValue(value);
                    const localisedRichLabel =
                      isRich && (item.fields[e]?.label != null || item.fields[e]?.label_l1 != null)
                        ? tenantUtils.getLocalisedString(item.fields[e], 'label')
                        : null;
                    const label =
                      isRich && localisedRichLabel
                        ? localisedRichLabel
                        : featuresData?.fields?.[e]?.props?.label;
                    const subLabel = (() => {
                      if (!isRich) {
                        return value[e] && typeof value[e] === 'string' ? `: ${value[e]}` : '';
                      }
                      const opt = optionsMapById?.[e];
                      const ft = String(opt?.format_type ?? '')
                        .trim()
                        .toLowerCase();
                      if (ft === 'number') {
                        const v = item.fields[e]?.value;
                        return v !== undefined && v !== null && v !== '' ? `: ${v}` : '';
                      }
                      if (ft === 'select' && (item.fields[e]?.value != null || item.fields[e]?.value_l1 != null)) {
                        const localisedValue = tenantUtils.getLocalisedString(item.fields[e], 'value');
                        return localisedValue ? `: ${localisedValue}` : '';
                      }
                      return '';
                    })();
                    return (
                      <Tag
                        shape="round"
                        closable
                        onClose={() => {
                          if (isRich) {
                            const next = { ...value };
                            delete next[e];
                            handleChange(next);
                          } else {
                            handleChange({ ...value, [e]: undefined });
                          }
                        }}
                        key={e}
                        style={{ overflow: 'hidden', display: 'inline-flex', '--space-top': '1px' }}
                        spaceTop="1px"
                        icon={<Icon icon={getIconName(e)} style={{}} />}
                      >
                        <div style={{ overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis' }}>
                          {label || e}
                          {subLabel}
                        </div>
                      </Tag>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Space>
      </div>

      <DrawerModal
        onCancel={() => {
          jsonFormRef?.current?.resetForm();
          setShowModal(false);
        }}
        height={'100vh'}
        okText={t('Add Amenities')}
        onOk={() => {
          const raw = jsonFormRef?.current?.getValues() || {};
          if (featuresOptions?.length) {
            handleChange(fromModalValues(raw));
          } else {
            handleChange(raw);
          }
          setShowModal(false);
        }}
        visible={showModal}
        title={label}
        width={900}
        styles={{ paddingBlockEnd: 6 }}
        maskClosable={false}
        {...rest}
      >
        <JSONForm
          fields={featuresData?.fields ?? {}}
          fieldsSections={amenitiesModalFieldsSections}
          showSectionsAsTabs
          ref={jsonFormRef}
          classOfContentColumns="amenitiesModal"
          formFieldValues={featuresOptions?.length ? toModalValues(value) : value}
          noOfContentColumns={isMobile ? 1 : 2}
          groupGap="16px 24px"
          renderFieldAsCard
        />
      </DrawerModal>
    </Group>
  );
};

AddAmenities.propTypes = {
  labelIcon: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  formProps: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  value: PropTypes.object,
  name: PropTypes.string,
  featuresOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      slug: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
      label_l1: PropTypes.string,
    }),
  ),
  featuresData: PropTypes.shape({
    fields: PropTypes.object,
    fieldsSections: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        title_l1: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
      }),
    ),
  }),
};

export default AddAmenities;
