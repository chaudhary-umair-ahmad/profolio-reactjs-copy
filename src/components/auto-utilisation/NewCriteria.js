import * as yup from 'yup';

import tenantData from '@data';
import { Col, Row } from 'antd';
import { useFormik } from 'formik';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApplyUtilizationPlanMutation } from '../../apis/listings';
import { Alert, Button, ConfirmationModal, DataTable, notification, RadioButtons, Select, TextInput } from '../common';
import CheckboxGroup from '../common/checbox-group/checkbox-group';
import Icon from '../common/icon/icon';
import { Popover } from '../common/popup/popup';
import { RequirementListItem, Requirements } from './styled';
import UtilisationRows from './UtilisationRows';

function NewCriteria({ credits, user, defaultUnit }) {
  const { t } = useTranslation();
  const confirmApplyRef = useRef();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [applyUtilizationPlan] = useApplyUtilizationPlanMutation();

  const onSubmit = () => {
    let error = false;
    const newSelections = formik?.values?.selections?.map((item) => {
      if (item.value && item?.percentage > 0 && item?.percentage <= 100) {
        return { ...item };
      } else {
        error = true;
        return { ...item, error: true };
      }
    });
    if (error) {
      formik.setFieldValue('selections', newSelections, true);
    } else {
      confirmApplyRef?.current && confirmApplyRef.current.showModal();
    }
  };

  const formik = useFormik({
    initialValues: {
      selections: [{ value: null, percentage: null, error: false }],
      property_type: 1,
      purpose: 1,
      area_min: '',
      area_max: '',
      area_unit: tenantData.areaUnitList.find((e) => e.slug === defaultUnit),
      property_price: '',
    },
    validateOnChange: false,
    validationSchema: yup.object().shape({
      purpose: yup.number().required(t('Please select purpose')),
      selections: yup.array().of(
        yup.object().shape({
          value: yup.string().required(t('Please select category')).nullable(),
          percentage: yup.string().required(t('Please enter percentage')).nullable(),
        }),
      ),
      area_min: yup
        .number()
        .required(t('Please enter area'))
        .typeError(t('Please enter a number'))
        .test({
          message: t('Area min should be less than area max'),
          test: function (value, ctx) {
            if (!!this.parent.area_max && value >= Number(this.parent.area_max)) return false;
            return true;
          },
        }),
      area_max: yup
        .number()
        .required(t('Please enter area'))
        .typeError(t('Please enter a number'))
        .test({
          message: t('Area min should be greater than area min'),
          test: function (value, ctx) {
            if (!!this.parent.area_min && value <= Number(this.parent.area_min)) return false;
            return true;
          },
        }),
    }),
    onSubmit: onSubmit,
  });

  const postPlan = async () => {
    confirmApplyRef?.current && confirmApplyRef.current.hideModal();
    formik.setSubmitting(true);
    const response = await applyUtilizationPlan({
      ...formik.values,
      user_id: user?.id,
      plan_type: 'manual',
      agencyWide: false,
      area_unit: formik?.values?.area_unit?.id,
      utilisation_details_attributes: formik?.values?.selections.map((e) => ({
        product_id: e.value,
        percentage: Number(e.percentage),
      })),
      selections: formik?.values?.selections?.map((e) => ({ id: e.value, value: Number(e.percentage) })),
    });
    if (response) {
      formik.setSubmitting(false);
      if (response.error) {
        formik.setStatus(response.error);
      } else {
        notification.success(t('Plan Created Successfully!'));
        formik.resetForm();
      }
    }
  };

  function parser(data) {
    const newData = data?.map((item) => {
      return {
        ...item,
        id: item?.id || item?.value || item?.key,
        name: item?.name || item?.title,
        label: item?.name || item?.title,
        value: item?.id || item?.key || item?.value,
        key: item?.id || item?.key || item?.value,
      };
    });
    return newData;
  }

  const content = (
    <ol type="1">
      <li>{t("By selecting the 'Credit Type' you are choosing those credits which you want to utilise")}</li>
      <li>
        {t(
          "The 'Percentage' is to select exactly how much (quantity in percent) of your chosen credits you wish to utilise",
        )}
      </li>
      <li>{t("The 'Utilised Credits' shows the exact amount of credits that will be used.")}</li>
      <li>{t("'Add Credit' adds another Row.")}</li>
    </ol>
  );

  return (
    <>
      <form>
        <Requirements>
          <RequirementListItem>
            <RadioButtons
              shape="round"
              name="purpose"
              label={t('Select Purpose')}
              buttonList={tenantData?.purposeList}
              value={formik?.values.purpose}
              handleChange={(e) => {
                formik.setFieldValue('purpose', e.target.value);
              }}
              valueKey="id"
            />
          </RequirementListItem>
          <RequirementListItem>
            <RadioButtons
              shape="round"
              name="property_type"
              label={t('Property Type')}
              valueKey="id"
              buttonList={tenantData?.listingTypes().map((e) => ({ ...e, label: e.title }))}
              value={formik?.values.property_type}
              handleChange={(e) => {
                formik.setFieldValue('property_type', e.target.value);
              }}
              // value={propertyTypeSelected}
              // handleChange={onPropertyTypeChange}
            />
          </RequirementListItem>
          <RequirementListItem>
            <CheckboxGroup
              name="unit_type"
              label={t('Unit Type')}
              buttonList={parser(
                tenantData.listingTypes().filter((item) => item?.id === formik.values.property_type)[0]?.sub_types,
              )}
              value={formik?.values.unit_type}
              handleChange={(e) => {
                formik.setFieldValue('unit_type', e);
              }}
              // handleChange={onUnitTypeChange}
              // value={subTypes[propertyTypeSelected]}
              // defaultValue={subTypes[propertyTypeSelected]}
            />
          </RequirementListItem>
          <RequirementListItem>
            <RadioButtons
              shape="round"
              name="property_price"
              label={t('Price of your Property')}
              buttonList={tenantData.propertyPriceList}
              value={formik?.values.property_price}
              handleChange={(e) => {
                formik.setFieldValue('property_price', e.target.value);
              }}
              valueKey="id"
            />
          </RequirementListItem>
          <RequirementListItem>
            <RadioButtons
              shape="round"
              name="order_of_application_of_credits"
              label={t('Order of Application of Credits')}
              buttonList={tenantData.orderOfApplicationOfCreditsList}
              value={formik?.values.order_of_application_of_credits}
              handleChange={(e) => {
                formik.setFieldValue('order_of_application_of_credits', e.target.value);
              }}
              valueKey="id"
            />
          </RequirementListItem>
          <RequirementListItem>
            <label className="label">{t('Area Unit')}</label>
            <Row className="mb-16" gutter={[16, 16]} align="bottom">
              <Col xs={24} lg={12} xl={6}>
                <TextInput
                  name="area_min"
                  type="number"
                  placeholder={t('Area Min')}
                  value={formik?.values.area_min}
                  handleChange={(e) => {
                    formik.setFieldValue('area_min', e.target.value);
                  }}
                  handleBlur={formik.handleBlur}
                  errorMsg={formik?.errors['area_min'] && formik?.touched['area_min'] && formik?.errors['area_min']}
                />
              </Col>
              <Col xs={24} lg={12} xl={6}>
                <TextInput
                  name="area_max"
                  placeholder={t('Area Max')}
                  type="number"
                  value={formik?.values.area_max}
                  handleChange={(e) => {
                    formik.setFieldValue('area_max', e.target.value);
                  }}
                  handleBlur={formik.handleBlur}
                  errorMsg={formik?.errors['area_max'] && formik?.touched['area_max'] && formik?.errors['area_max']}
                />
              </Col>
              <Col xs={24} lg={12} xl={6}>
                <Select
                  name="area_unit"
                  value={formik.values.area_unit?.id}
                  placeholder={t('Select Unit')}
                  options={tenantData.areaUnitList}
                  onChange={(value, option) => formik.setFieldValue('area_unit', option)}
                  getOptionValue={(e) => e.id}
                  getOptionLabel={(e) => e.title}
                />
              </Col>
            </Row>
          </RequirementListItem>
          <RequirementListItem>
            <label className="label">
              {t('Select the percentage credits to be used')}{' '}
              <Popover placement="bottomLeft" title={t('How this works')} content={content} action="hover">
                <Icon icon="AiOutlineInfoCircle" className="color-gray-lightest" />
              </Popover>
            </label>
            <div className={isMobile ? 'mb-32 px-4' : 'mb-24'}>
              <UtilisationRows
                credits={credits?.length && credits.filter((e) => e?.available >= 1)}
                maxRows={credits?.length && credits.filter((e) => e?.available >= 1)?.length}
                selections={formik.values.selections}
                setSelections={(e) => {
                  formik.setFieldValue('selections', e, true);
                }}
                isMobile={isMobile}
                errorMsg={!!formik?.touched?.selections && !!formik?.errors?.selections && formik?.errors?.selections}
              />
            </div>
          </RequirementListItem>

          <Alert message={formik.isSubmitting ? '' : formik.status} />

          <div className="text-center" style={{ paddingInlineStart: isMobile ? 28 : 0 }}>
            <Button
              type="primary"
              size="large"
              style={{ minWidth: '250px' }}
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting || !credits?.length || !credits.filter((e) => e?.available >= 1)?.length}
              onClick={formik.handleSubmit}
            >
              {t('Apply Criteria')}
            </Button>
          </div>
        </Requirements>
      </form>

      <ConfirmationModal
        ref={confirmApplyRef}
        onSuccess={postPlan}
        onCancel={() => formik.setSubmitting(false)}
        title={t('Apply Plan')}
        type="danger"
      >
        <>
          <div className="mb-8">{t('Apply plan')}</div>
          <DataTable
            columns={[
              {
                title: 'Product',
                dataIndex: 'product',
                key: 'product',
              },
              {
                title: 'Credits Available',
                dataIndex: 'credits_available',
                key: 'credits_available',
              },
              {
                title: 'Credits Used',
                dataIndex: 'credits_used',
                key: 'credits_used',
              },
            ]}
            data={formik.values.selections.map((item) => {
              const selectedItem = credits?.length && credits.find((e) => e.id == item.value);
              return {
                product: selectedItem?.title,
                credits_available: selectedItem?.available,
                credits_used: (selectedItem?.available * (Number(item.percentage) / 100)).toFixed(1),
              };
            })}
          />
        </>
      </ConfirmationModal>
    </>
  );
}

export default NewCriteria;
