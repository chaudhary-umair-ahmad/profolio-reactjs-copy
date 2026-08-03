import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import tenantConstants from '@constants';
import { Typography } from 'antd';
import { useFormik } from 'formik';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Alert, Button, Drawer, ErrorMessage, Flex, Group, Heading, Icon, notification, TextInput } from '../common';
import { ListingDetailCompact } from '../table/table-components/listing-detail-compact';
import AddInterestDrawer from './add-interest-drawer';
import MobileVerification from '../mobile-number-verification/mobile-verification';
import { getAddLeadInitialValues, getAddLeadValidationSchema } from './add-lead-form-data';
import { useAddLeadMutation } from '../../apis/lms';
import { Link } from 'react-router-dom';
const { Text } = Typography;

const AddLeadDrawer = forwardRef((props, ref) => {
  const { onLeadAdded = () => {} } = props;
  const { t } = useTranslation();
  const drawerRef = useRef();
  const addInterestDrawerRef = useRef();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser?.user);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const [leadId, setLeadId] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    btnLoading: false,
  });

  const onInterestClick = () => (e) => {
    e.stopPropagation();
    addInterestDrawerRef.current.openDrawer();
  };

  const resetForm = () => {
    setLeadId(null);
    setLoadingStates({ ...loadingStates, btnLoading: false });
    formik.resetForm();
  };

  const [addNewLead] = useAddLeadMutation();
  const addLead = async (values, actions) => {
    try {
      setLoadingStates({ ...loadingStates, btnLoading: true });
      const response = await addNewLead({ values, user });
      if (response) {
        setLoadingStates({ ...loadingStates, btnLoading: false });
        if (response?.error) {
          if (response?.error?.error?.data?.lead_id) {
            setLeadId(response?.error?.error?.data?.lead_id);
          } else {
            notification.error(response?.error);
          }
        } else if (response?.data) {
          setLeadId(null);
          onLeadAdded();
          notification.success(response?.data?.message);
          drawerRef.current.closeDrawer();
          actions.resetForm();
        }
      }
    } catch (error) {
      notification.error(response.message);
    }
  };

  useImperativeHandle(ref, () => ({
    openDrawer() {
      resetForm();
      drawerRef?.current && drawerRef?.current?.openDrawer();
    },
  }));

  const formik = useFormik({
    initialValues: getAddLeadInitialValues(),
    validationSchema: getAddLeadValidationSchema(t),
    onSubmit: (values, actions) => {
      addLead(values, actions);
    },
    enableReinitialize: true,
  });

  const renderAlert = () => {
    return (
      <Alert
        style={{ padding: 0 }}
        className={isMobile ? 'mb-16' : 'mb-24'}
        showIcon
        type="warning"
        icon={<Icon className="color-gray-dark" icon="BsInfoLg" size={16} style={{ marginTop: '2px' }} />}
        message={
          <div>
            {t('This lead already exists in your Lead Management System with ID {{leadId}}. Please check the details', {
              leadId: leadId,
            })}
            <Link to={`${tenantRoutes.app('', false, user).leads_management.path}/?leadDrawerId=${leadId}`}>
              {' '}
              {t('here')}
            </Link>
          </div>
        }
      />
    );
  };

  const renderDrawerTitle = () => (
    <Flex align="center" gap="10px">
      <Button
        size="small"
        style={{ borderRadius: '50%', border: 0, height: '28px', width: '28px' }}
        type="primaryOutlined"
        icon="IoMdArrowRoundBack"
        onClick={() => drawerRef.current.closeDrawer()}
        iconSize="18px"
        iconClassName="flipX"
      />
      <Text className="fw-700" style={{ fontSize: '18px' }}>
        {t('Add New Lead')}
      </Text>
    </Flex>
  );

  return (
    <Drawer
      title={renderDrawerTitle()}
      onCloseDrawer={resetForm}
      ref={drawerRef}
      width={isMobile ? '100vw' : '50vw'}
      height={isMobile && '100vh'}
      bodyStyle={{ paddingTop: '0', padding: isMobile && '16px' }}
      headerStyle={{ paddingInline: isMobile && '12px', alignItems: 'start' }}
      placement={isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right'}
      footer={
        <Flex
          justify="space-between"
          style={{
            marginLeft: '50%',
            width: '50%',
            paddingTop: '20px',
          }}
        >
          <Button
            type="default"
            style={{ width: '48%', marginRight: '4%' }}
            onClick={() => {
              drawerRef.current.closeDrawer();
            }}
          >
            {t('Cancel')}
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '48%' }}
            loading={loadingStates?.btnLoading}
            disabled={loadingStates?.btnLoading}
            onClick={formik.handleSubmit}
          >
            {t('Add Lead')}
          </Button>
        </Flex>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <Group
          className="mb-16"
          template={isMobile ? 'initial' : 'repeat(2, 1fr)'}
          gap={isMobile ? '16px' : '44px'}
          style={{ alignItems: 'start' }}
        >
          <TextInput
            name="name"
            label={t('Name')}
            placeholder={t('Enter Name')}
            handleChange={(event) => {
              formik.setFieldValue('name', event.target.value);
            }}
            handleBlur={(event) => {
              formik.setFieldTouched('name', true);
              formik.setFieldValue('name', event.target.value, true);
            }}
            value={formik.values.name}
            maxLength={200}
            errorMsg={formik?.errors['name'] && formik?.touched['name'] && formik?.errors['name']}
          />

          <MobileVerification
            key="phone"
            name="phone"
            value={formik?.values?.['phone']}
            label={t('Phone Number')}
            defaultCountry={tenantConstants.COUNTRY_CODE}
            countrySelectProps={{ disabled: true }}
            errorMsg={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ''}
            onChange={(value) => {
              formik.setFieldValue(`phone`, !!value ? value : '', true);
            }}
            onBlur={() => formik.setFieldTouched(`phone`, true)}
            canVerify={false}
          />

          <MobileVerification
            key="whatsapp"
            name="whatsapp"
            value={formik?.values?.['whatsapp']}
            label={t('WhatsApp Number')}
            defaultCountry={tenantConstants.COUNTRY_CODE}
            countrySelectProps={{ disabled: true }}
            errorMsg={formik.touched.whatsapp && formik.errors.whatsapp ? formik.errors.whatsapp : ''}
            onChange={(value) => {
              formik.setFieldValue(`whatsapp`, !!value ? value : '', true);
            }}
            onBlur={() => formik.setFieldTouched(`whatsapp`, true)}
            canVerify={false}
            isOptional
          />
          <TextInput
            name="email"
            label={
              <>
                {t('Email')}{' '}
                <span style={{ color: tenantTheme.gray550, fontSize: isMobile ? '10px' : '12px' }}>
                  ({t('Optional')})
                </span>
              </>
            }
            placeholder={t('Enter Email')}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik?.values?.email}
            maxLength={200}
            errorMsg={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
          />
        </Group>

        <Group
          className={isMobile ? 'mb-32' : 'mb-40'}
          template={isMobile ? 'initial' : 'repeat(2, 1fr)'}
          style={{ alignItems: 'start' }}
          gap={isMobile ? '16px' : '44px'}
        >
          <div>
            <Heading as="h6" className="mb-8">
              {t('Interest')}{' '}
              <span style={{ color: tenantTheme.gray550, fontSize: isMobile ? '10px' : '12px' }}>
                ({t('Optional')})
              </span>
            </Heading>
            {!!formik?.values?.interest ? (
              <Flex align="start" gap="2px">
                <ListingDetailCompact {...formik?.values?.interest} />
                <Button
                  icon="IoMdClose"
                  onClick={() => formik.setFieldValue('interest', null)}
                  type="link"
                  style={{ '--btn-content-color': tenantTheme['danger-color'] }}
                />
              </Flex>
            ) : (
              <>
                <Button
                  size={isMobile ? 'small' : undefined}
                  icon="FaSquarePlus"
                  iconSize="1em"
                  type="primaryOutlined"
                  block
                  onClick={onInterestClick()}
                  style={{ justifyContent: 'start', width: 'max-content' }}
                >
                  {t('Add Interest Manually')}
                </Button>

                <AddInterestDrawer
                  singleSelect
                  ref={addInterestDrawerRef}
                  setField={formik.setFieldValue}
                  fieldKey={'interest'}
                />
                <div style={{ marginBlockStart: '10px' }}>
                  <ErrorMessage message={formik?.touched?.interest ? formik?.errors?.interest : ''} />
                </div>
              </>
            )}
          </div>
        </Group>
      </form>

      {leadId && renderAlert()}
    </Drawer>
  );
});

export default AddLeadDrawer;
