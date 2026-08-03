import TenantComponents from '@components';
import tenantData from '@data';
import tenantTheme from '@theme';
import { Col, Divider, Row, Skeleton } from 'antd';
import cx from 'clsx';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { Fragment, forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Checkbox,
  Heading,
  RadioButtons,
  Select,
  SelectSearch,
  Switch,
  Tabs,
  TextInput,
  TextInputWithUnit,
  TextWithIcon,
} from '..';
import { TENANT_KEY } from '../../../utility/env';
import { getOBJValueByKey } from '../../../utility/utility';
import ImageUpload from '../../image-upload/image-upload';
import MobileVerification from '../../mobile-number-verification/mobile-verification';
import PhoneIntl from '../../phone-input/PhoneIntl';
import LandlineInput from '../../phone-input/LandlineInput';
import { AddAmenities, ImageSelect, VideoSelect } from '../../post-listing';
import { SkeletonBody } from '../../skeleton/Skeleton';
import Alert from '../alert/alert';
import EmptyState from '../EmptyState/EmptyState';
import Group from '../group/group';
import { buildValidationSchemaFromFields } from '../../../helpers/validations';
import { getFeatureAmenityIconName } from '../../../helpers/featureAmenitySlugToIcon';
import { AmenitiesCard, createJSONFormStyled } from './styled';
import { useSelector } from 'react-redux';
import notify from '../notification/notifications';

const JSONForm = forwardRef((props, ref) => {
  const {
    className,
    fields,
    fieldsSections,
    dependentFields,
    showSectionsAsTabs,
    noOfContentColumns,
    groupGap,
    classOfContentColumns,
    onSubmitForm,
    formFieldValues,
    loading,
    error,
    fetchError,
    onRetry,
    retryButtonLoading,
    submitLoading,
    renderFieldAsCard,
    formik: externalFormik,
    layout,
    hideSubmit,
    layoutProps,
  } = props;

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser) || {};

  const { t, i18n } = useTranslation();

  const getTranslatedFields = useCallback(() => {
    if (fields && typeof fields === 'object') {
      const fieldsObj = { ...fields };
      Object.keys(fieldsObj).forEach((item) => {
        const { isOptional, ...restProps } = fieldsObj[item].props || {};
        fieldsObj[item] = {
          ...fieldsObj[item],
          props: {
            ...restProps,
            label: t(restProps.label),
            placeholder: t(restProps.placeholder),
          },
        };
      });
      return fieldsObj;
    } else {
      return fields;
    }
  }, [fields, i18n.language]);

  const formFields = useMemo(() => getTranslatedFields(), [fields, i18n.language]);

  const onSubmit = (values) => {
    const { profile_image, image, cnic_front, cnic_back } = values || {};
    const profileImage = profile_image?.[0];
    const agencyStaffImage = image?.[0];
    const cnicFrontImage = cnic_front?.[0];
    const cnicBackImage = cnic_back?.[0];
    if (
      (profileImage?.analysing || profileImage?.uploading) ||
      (agencyStaffImage?.analysing || agencyStaffImage?.uploading) ||
      (cnicFrontImage?.analysing || cnicFrontImage?.uploading) ||
      (cnicBackImage?.analysing || cnicBackImage?.uploading)
    ) {
      notify.error(t('Image is uploading'));
      return;
    }
    if (profileImage?.analyseError || agencyStaffImage?.analyseError) {
      return;
    }
    onSubmitForm && onSubmitForm(values);
  };
  const getInitialValues = (fields, formFieldValues) => {
    if (formFieldValues) return formFieldValues;
    const values = {};
    Object.keys(fields).map((key) => {
      values[key] = fields[key].value;
    });
    return values;
  };

  const validationSchema = useMemo(
    () => buildValidationSchemaFromFields(formFields),
    [formFields],
  );
  const internalFormik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(formFields, formFieldValues),
    validationSchema,
    onSubmit,
  });
  const formik = externalFormik != null ? externalFormik : internalFormik;
  useImperativeHandle(ref, () => {
    if (externalFormik != null) {
      return {
        ...externalFormik,
        getValues: () => externalFormik.values,
        submitForm: () => externalFormik.handleSubmit(),
        resetForm: () => externalFormik.resetForm(),
      };
    }
    return {
      ...internalFormik,
      getValues() {
        return internalFormik.values;
      },
      submitForm() {
        return internalFormik.handleSubmit();
      },
      resetForm() {
        return internalFormik.resetForm();
      },
    };
  });


  const getFieldsSections = useCallback(() => {
    if (fieldsSections) {
      return fieldsSections.map((item) => ({
        ...item,
        // Use section's own list when present (e.g. post-listing enhanced sections) so props like payloadKey are preserved
        fields: (item.fields ?? []).map((key) => ({ ...(item.list?.[key] ?? formFields[key]), key })),
      }));
    }
    return Object.keys(formFields).map((key) => ({ ...formFields[key], key }));
  }, [fieldsSections, formFields]);

  const formatCnic = (input) => {
    const raw = String(input || '').replace(/\D/g, '').slice(0, 13);
    if (raw.length <= 5) return raw;
    if (raw.length <= 12) return `${raw.slice(0, 5)}-${raw.slice(5)}`;
    return `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
  };

  const getField = (item, form) => {
    // Only normalize { key, value } → boolean. Keep booleans and shapes like { city } for LocationSelect.
    const d = item.props?.disabled;
    let disabledProp = {};
    if (d === true || d === false) {
      disabledProp = { disabled: d };
    } else if (
      d &&
      typeof d === 'object' &&
      !Array.isArray(d) &&
      Object.prototype.hasOwnProperty.call(d, 'key') &&
      Object.prototype.hasOwnProperty.call(d, 'value')
    ) {
      disabledProp = { disabled: form.values[d.key] === d.value };
    }
    const itemProps = {
      ...item.props,
      ...disabledProp,
    };
    switch (item.type) {
      case 'input': {
        const handleChange = itemProps?.format === 'cnic'
          ? (e) => {
              const masked = formatCnic(e?.target?.value);
              form?.setFieldValue(item.key, masked);
            }
          : form?.handleChange;
        const { extra: extraFromProps, ...inputRestProps } = itemProps;
        const resolveExtra =
          typeof extraFromProps === 'function'
            ? extraFromProps.length > 0
              ? () => extraFromProps(form)()
              : extraFromProps
            : extraFromProps;
        return (
          <TextInput
            name={item.key}
            handleChange={handleChange}
            handleBlur={form?.handleBlur}
            value={form?.values[item.key]}
            errorMsg={form.errors[item.key] && form.touched[item.key] && form.errors[item.key]}
            skeletonLoading={loading}
            key={item.key}
            {...inputRestProps}
            extra={resolveExtra}
          />
        );
      }
      case 'select': {
        const { coerceSelectValue, ...selectRestProps } = itemProps;
        const rawSelectVal = form?.values[item.key];
        const selectDisplayValue =
          coerceSelectValue === 'id' && rawSelectVal != null && typeof rawSelectVal === 'object'
            ? rawSelectVal.id
            : rawSelectVal;
        return (
          <Select
            name={item.key}
            value={selectDisplayValue}
            onChange={(value) => form?.setFieldValue(item.key, value, true)}
            onBlur={() => form?.setFieldTouched(item.key, true)}
            errorMsg={form.errors[item.key] && form.touched[item.key] && form.errors[item.key]}
            key={item.key}
            skeletonLoading={loading}
            {...selectRestProps}
          />
        );
      }
      case 'location-select':
        return (
          <TenantComponents.LocationSelect
            formik={form}
            item={item}
            key={item.key}
            {...itemProps}
            setFieldValue={form.setFieldValue}
            setFieldTouched={form.setFieldTouched}
            value={form.values[item.key]}
            error={form.errors?.[item.key]}
            touched={form.touched?.[item.key]}
            onBlur={form.handleBlur}
          />
        );
      case 'select-search':
        return (
          <SelectSearch
            name={item.key}
            value={form?.values[item.key]}
            onChange={(value) => form?.setFieldValue(item.key, value)}
            onBlur={() => form?.setFieldTouched(item.key, true)}
            key={item.key}
            errorMsg={form.errors[item.key] && form.touched[item.key] && form.errors[item.key]}
            //size="large"
            {...itemProps}
            // mode="multiple"
          />
        );
      case 'radio':
        return (
          <RadioButtons
            name={item.key}
            value={form?.values[item.key]}
            handleChange={form?.handleChange}
            key={item.key}
            errorMsg={form.errors[item.key] && form.touched[item.key] && form.errors[item.key]}
            {...itemProps}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            onChange={(event) => {
              form.setFieldValue(item.key, event.target.checked);
            }}
            value={form?.values[item.key]}
            key={item.key}
            {...itemProps}
          />
        );
      case 'switch':
        return (
          <>
            <Switch
              label={item.label}
              value={form?.values[item.key]}
              key={item.key}
              onChange={(checked) => form?.setFieldValue(item.key, checked)}
              onBlur={() => form?.setFieldTouched(item.key, true)}
              {...itemProps}
            />
            <Divider className="m-0" />
          </>
        );
      case 'input-unit':
        return (
          <TextInputWithUnit
            name={item.key}
            // handleChange={form?.handleChange}
            onInputChange={(value) => {
              form.values[item.key].value = value;
              form.setFieldValue(item.key, form?.values[item.key]);
            }}
            onUnitChange={(unit) => {
              form.values[item.key].unit = unit;
              form.setFieldValue(item.key, form?.values[item.key]);
            }}
            // handleBlur={form?.handleBlur}
            value={form?.values[item.key]?.value}
            unitValue={form?.values[item.key]?.unit}
            skeletonLoading={loading}
            key={item.key}
            {...itemProps}
          />
        );
      case 'phone-input':
        return (
          <div className="grid" style={{ gridTemplate: 'none' }}>
            <PhoneIntl
              id={item.key}
              name={item.key}
              value={form.values[item.key]}
              onChange={(value, index) => {
                if (index === null || index === undefined) {
                  form.setFieldValue(item.key, value ? value : '', true);
                } else {
                  const newArr = formik.values?.[item.key];
                  newArr.splice(index, 1, value);
                  form.setFieldValue(item.key, newArr, true);
                }
              }}
              errorMsg={
                typeof form.values[item.key] === 'object'
                  ? form.errors[item.key]
                  : form.errors[item.key] && form.touched[item.key] && form.errors[item.key]
              }
              touched={form.touched[item.key]}
              onBlur={(index) => {
                index === null || index === undefined
                  ? form.setTouched({ ...form.touched, [item.key]: true })
                  : form.setFieldTouched(`${item.key}[${index}]`, true);
              }}
              addMobileField={() => {
                const newArr = [...form.values[item.key], ''];
                form.setFieldValue(item.key, newArr);
              }}
              removeMobileField={(index) => {
                if (!!form?.touched?.[item.key]?.length) {
                  form.touched[item.key].splice(index, 1);
                  form.setFieldTouched(item.key, form.touched[item.key]);
                }
                form.values[item.key].splice(index, 1);
                form.setFieldValue(item.key, form.values?.[item.key]);
              }}
              {...itemProps}
            />
          </div>
        );
      case 'landline-input':
        return (
          <div className="grid" style={{ gridTemplate: 'none' }}>
            <LandlineInput
              id={item.key}
              name={item.key}
              value={form.values[item.key]}
              onChange={(value) => {
                form.setFieldValue(item.key, value ? value : '', true);
              }}
              errorMsg={form.errors[item.key] && form.touched[item.key] && form.errors[item.key]}
              onBlur={() => {
                form.setTouched({ ...form.touched, [item.key]: true });
              }}
              {...itemProps}
            />
          </div>
        );
      case 'phone-input-verification':
        return (
          <div className="grid" style={{ gridTemplate: 'none' }}>
            <MobileVerification
              id={item.key}
              name={item.key}
              value={form.values[item.key]}
              onChange={(value, index) => {
                if (index === null || index === undefined) {
                  form.setFieldValue(item.key, value ? value : '', true);
                } else {
                  const newArr = formik.values?.[item.key];
                  newArr.splice(index, 1, value);
                  form.setFieldValue(item.key, newArr, true);
                }
              }}
              errorMsg={
                typeof form.values[item.key] === 'object'
                  ? form.errors[item.key]
                  : form.errors[item.key] && form.touched[item.key] && form.errors[item.key]
              }
              touched={form.touched[item.key]}
              onBlur={(index) => {
                index === null || index === undefined
                  ? form.setTouched({ ...form.touched, [item.key]: true })
                  : form.setFieldTouched(`${item.key}[${index}]`, true);
              }}
              addMobileField={() => {
                const newArr = [...form.values[item.key], ''];
                form.setFieldValue(item.key, newArr);
              }}
              removeMobileField={(index) => {
                if (!!form?.touched?.[item.key]?.length) {
                  form.touched[item.key].splice(index, 1);
                  form.setFieldTouched(item.key, form.touched[item.key]);
                }
                form.values[item.key].splice(index, 1);
                form.setFieldValue(item.key, form.values?.[item.key]);
              }}
              {...itemProps}
            />
          </div>
        );

      case 'select-server':
        return (
          <Select
            name={item.key}
            value={form?.values[item.key]}
            onChange={(value) => form?.setFieldValue(item.key, value)}
            onBlur={() => form?.setFieldTouched(item.key, true)}
            key={item.key}
            size="large"
            className="width-100"
            {...itemProps}
          />
        );
      case 'checkbox-group':
        return (
          <Fragment key={item.key}>
            {(itemProps.checkboxList ?? []).map((e) => (
              <>
                <Checkbox
                  disabled={itemProps.disabled === true}
                  value={form?.values?.[item?.key]?.[e?.key]}
                  onChange={(event) => {
                    form.setFieldValue(item?.key, {
                      ...form?.values?.[item?.key],
                      [e.key]: event.target.checked,
                    });
                  }}
                >
                  {e.icon}
                  {e.description}
                </Checkbox>
              </>
            ))}
          </Fragment>
        );
      case 'add-amenities':
        return (
          <AddAmenities
            name={item.key}
            handleChange={(values) => {
              form.setFieldValue(item.key, values);
            }}
            handleBlur={form?.handleBlur}
            value={form?.values[item.key]}
            skeletonLoading={loading}
            key={item.key}
            {...itemProps}
          />
        );
      case 'image-select-bank':
        return <ImageSelect values={form.values} setFieldValue={form.setFieldValue} key={item.key} {...itemProps} />;
      case 'video-select-bank':
        return (
          <VideoSelect
            key={item.key}
            {...itemProps}
            value={form.values[item.key]}
            setFieldValue={form.setFieldValue}
            isMobile={isMobile}
            errorMsg={form.errors[item.key] && form.touched[item.key] && form.errors[item.key]}
          />
        );
      case 'image-select':
        return (
          <ImageUpload
            images={form.values[item.key] ? form.values[item.key] : []}
            setImages={(imgArr) => form.setFieldValue(item.key, imgArr)}
            key={item.key}
            name={item.key}
            hasLottie={true}
            buttonStyle={{
              minWidth: !isMobile && '415px',
              width: '100%',
              height: 'auto',
              backgroundColor: tenantTheme['primary-light-4'],
              color: tenantTheme['primary-color'],
            }}
            uploadClass="upload-img"
            errorMsg={form.errors[item.key] && (form.touched[item.key]) && form.errors[item.key]}
            {...itemProps}
          />
        );
      case 'divider':
        return <Divider key={item.key} {...itemProps} />;
      case 'heading':
        return (
          <Heading key={item.key} {...itemProps}>
            {itemProps?.label}
          </Heading>
        );
      case 'submit':
        return (
          <Button
            type="primary"
            key={item.key}
            onClick={form.handleSubmit}
            loading={submitLoading}
            disabled={submitLoading}
            {...itemProps}
          >
            {item.label}
          </Button>
        );
      case 'link':
        return (
          <Link to={item.props.defaultRedirect} {...itemProps}>
            {item.props.label}
          </Link>
        );
      case 'generate-content':
        return <TenantComponents.GenerateContentField formik={formik} className="span-all" {...itemProps} />;
      default:
        return null;
    }
  };

  const fieldWrapper = (fieldItem) => {
    if (dependentFields) {
      const dependentItem = dependentFields[fieldItem.key];
      if (dependentItem?.dependents) {
        const dependentObj = dependentItem.dependents.find(({ _self, ...fieldItemDependents }) => {
          const showField = Object.keys(fieldItemDependents).every((dependsOnItemKey) => {
            if (fieldItemDependents[dependsOnItemKey]._show) {
              return true;
            }
            if (!fieldItemDependents[dependsOnItemKey]) {
              return true;
            }
            if (fieldItemDependents[dependsOnItemKey] === true && formik.values[dependsOnItemKey]) {
              return true;
            }
            if (fieldItemDependents[dependsOnItemKey].valueKey !== undefined) {
              fieldItem.props.dependents = {
                [dependsOnItemKey]: getOBJValueByKey(
                  formik.values[dependsOnItemKey],
                  fieldItemDependents[dependsOnItemKey].valueKey,
                  formik.values[dependsOnItemKey],
                ),
              };
              return true;
            }
            if (
              fieldItemDependents[dependsOnItemKey].valueKey === undefined &&
              JSON.stringify(formik.values[dependsOnItemKey]) ===
                JSON.stringify(fieldItemDependents[dependsOnItemKey].value)
            ) {
              return true;
            }
            return false;
          });
          return !!showField;
        });
        if (dependentObj || dependentItem.show_anyway) {
          dependentObj?._self && (formik.values[fieldItem.key] = dependentObj._self.value);
          // formik.setFieldValue(fieldItem.key, fieldItemDependents._self.value, false);
          return getField(fieldItem, formik);
        }
        !!formik.values[fieldItem.key] && formik.setFieldValue(fieldItem.key, undefined);
        return null;
      }
    }
    return getField(fieldItem, formik);
  };

  const getIconName = (fieldItem) =>
    TENANT_KEY === 'zameen'
      ? ''
      : getFeatureAmenityIconName(tenantData.amenities, fieldItem.key, fieldItem.props?.slug);

  const onClickCard = (item) => (event) => {
    let newValue;
    if (item.type === 'checkbox') {
      newValue = !formik?.values?.[item.key];
      formik.setFieldValue(item.key, newValue);
    }
  };

  const renderFields = (list, key) => {
    return (
      <Group
        className={classOfContentColumns}
        template={`repeat(${noOfContentColumns}, minmax(min(20ch, 100%), 1fr))`}
        gap={groupGap}
        key={key}
      >
        {list.map((item, index) => {
          const { label, ...otherProps } = item.props;
          const isFieldSelected = !!formik.values[item.key];
          return renderFieldAsCard ? (
            <AmenitiesCard
              key={index}
              bodyStyle={{ padding: 16, width: '100%', margin: 'auto' }}
              className={cx(isFieldSelected && 'selected-card', 'd-flex y-center')}
              justify="space-between"
              onClick={onClickCard(item)}
            >
              {item.heading && <Heading {...item.heading.props}>{item.heading.label}</Heading>}
              <Group
                className="w-100"
                template="1fr auto"
                style={{ justifyContent: 'space-between', minHeight: '34px' }}
              >
                <TextWithIcon
                  icon={getIconName(item)}
                  iconProps={{
                    color: isFieldSelected ? tenantTheme['primary-color'] : tenantTheme['gray600'],
                    size: '1.4em',
                  }}
                  className="amenities-data"
                  title={label}
                  textColor={isFieldSelected && tenantTheme['primary-color']}
                  fontWeight={isFieldSelected ? '700' : null}
                />
                {fieldWrapper({ ...item, props: otherProps }, index)}
              </Group>
            </AmenitiesCard>
          ) : (
            <React.Fragment key={index}>
              {item.heading && <Heading {...item.heading.props}>{item.heading.label}</Heading>}
              {fieldWrapper(item, index)}
            </React.Fragment>
          );
        })}
      </Group>
    );
  };

  const renderForm = () => (
    <form className={className}>
      {loading ? (
        <Row gutter={[32, 16]}>
          <JSONFormSkeleton {...props} />
        </Row>
      ) : fieldsSections ? (
        <>
          {showSectionsAsTabs ? (
            <Tabs
              data={getFieldsSections().map((item) => ({
                id: item.title,
                tabTitle: item.title,
                content: renderFields(item.fields, item.id),
              }))}
            />
          ) : (
            getFieldsSections().map((item) => (
              <Card key={item.title}>
                <h2>{item.title}</h2>
                {renderFields(item.fields)}
              </Card>
            ))
          )}
          {!hideSubmit && formFields.submit && getField({ key: 'submit', ...formFields.submit }, formik, (child) => child)}
        </>
      ) : (
        renderFields(getFieldsSections(), 'fields')
      )}
      {fetchError && (
        <EmptyState title="Error" message={fetchError} onClick={onRetry} buttonLoading={retryButtonLoading} />
      )}
      {error && <Alert message={error} />}
    </form>
  );

  if (layout && typeof layout === 'function') {
    return (
      <Group gap={groupGap || '32px'} template="1fr">
        {layout({
          renderForm,
          formik,
          fieldsSections,
          getFieldsSections,
          getField,
          formFields,
          isMobile,
          user,
          ...layoutProps,
        })}
      </Group>
    );
  }
  return renderForm();
});

const JSONFormSkeleton = (props) => {
  const renderFields = (list, key) => {
    return [1, 2, 3, 4, 5, 6].map((e, i) => {
      return (
        <Col key={i} xs={24} lg={12}>
          <Row className="mb-4">
            <Skeleton.Input size="small" width={160} style={{ height: 20 }} />
          </Row>
          <Row className="mb-16">
            <SkeletonBody type="input" width={290} block />
          </Row>
        </Col>
      );
    });
  };
  return props.fieldsSections ? (
    <>
      {props.showSectionsAsTabs ? (
        <>
          <Row>
            <SkeletonBody type="button" />
            <SkeletonBody type="button" />
            <SkeletonBody type="button" />
          </Row>
          {renderFields()}
        </>
      ) : (
        [1, 2, 3].map((item) => (
          <Card key={item}>
            <SkeletonBody type="button" />
            {renderFields()}
          </Card>
        ))
      )}
    </>
  ) : (
    renderFields()
  );
};

JSONForm.propTypes = {
  fields: PropTypes.object,
  fieldsSections: PropTypes.array,
  dependentFields: PropTypes.array,
  showSectionsAsTabs: PropTypes.bool,
  noOfContentColumns: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  groupGap: PropTypes.string,
  onSubmitForm: PropTypes.func,
  formFieldValues: PropTypes.object,
  loading: PropTypes.bool,
  formik: PropTypes.object,
  layout: PropTypes.func,
  hideSubmit: PropTypes.bool,
  layoutProps: PropTypes.object,
};

JSONForm.defaultProps = {
  fields: {},
  noOfContentColumns: 2,
  groupGap: '16px 32px',
};

const JSONFormStyled = createJSONFormStyled(JSONForm);
export { JSONFormStyled };
export default JSONForm;
