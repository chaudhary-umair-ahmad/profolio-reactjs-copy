import tenantData from '@data';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteNavigate } from '../../hooks';
import { Button, ConfirmationModal, notification } from '../common';
import { JSONFormStyled } from '../common/json-form/json-form';
import { useSelector } from 'react-redux';
import { useConvertToAgencyMutation } from '../../apis/agency';

const AgencyConvertModal = ({ disableButton }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const isMemberArea = useSelector((state) => state.app.AppConfig.isMemberArea);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const agencyConvertFormRef = useRef();
  const navigate = useRouteNavigate();
  const [convertToAgency, { isLoading: loading }] = useConvertToAgencyMutation();

  const handleAgencyOnClick = () => {
    setShowAgencyModal(true);
  };

  const onConfirmAgencyModal = () => {
    !isMemberArea ? agencyConvertFormRef?.current?.submitForm() : onConfirmBuyPackage();
  };

  const onConfirmBuyPackage = () => {
    navigate(tenantRoutes.app('', false, user).prop_shop.path);
  };

  const onModalCancel = () => {
    setShowAgencyModal(false);
    agencyConvertFormRef?.current?.resetForm();
  };

  const handleSubmit = async (values) => {
    const response = await convertToAgency({ values: values, userId: user?.id });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else if (response.data) {
        notification.success(t('User converted to agency successfully'));
        setTimeout(() => {
          window.location.href = `/${locale}${tenantRoutes.app().dashboard.path}`;
        }, 100);
      }
    }
  };

  useEffect(() => {
    getFormData();
  }, []);

  const getFormData = () => {
    const fields = tenantData.agencyConvertFormFields(user, t);
    let updatedFormData = null;
    if (fields) {
      updatedFormData = { ...formData, fields: fields };
      const fieldValues = tenantData.agencyConvertFormFieldsValues(user);
      if (fieldValues) {
        updatedFormData.fieldValues = fieldValues;
      }
    }
    setFormData(updatedFormData);
  };

  return (
    <>
      <Button
        onClick={handleAgencyOnClick}
        icon="IconConvertAgency"
        style={{
          '--btn-content-color': tenantTheme['primary-color'],
          '--btn-bg-color': tenantTheme['primaryLight4'],
          border: '1px solid #CCDFE1',
        }}
        type="primary-light"
        disabled={disableButton}
      >
        {t('Convert to Agency')}
      </Button>

      <ConfirmationModal
        title={t('Convert to Agency')}
        visible={showAgencyModal}
        onCancel={onModalCancel}
        cancelText={t('Cancel')}
        loading={loading}
        okButtonProps={{ disabled: loading, loading: loading }}
        okText={!isMemberArea ? t('Save Changes') : t('Buy a Package')}
        onSuccess={onConfirmAgencyModal}
        width={!isMobile && !isMemberArea && 1000}
        // style={{ marginBlock: 32 }}
        height={600}
      >
        {!isMemberArea ? (
          <div style={{ ...(!!loading && { pointerEvents: 'none', opacity: '0.4' }) }}>
            <JSONFormStyled
              key={'agency-convert'}
              fields={formData?.fields}
              formFieldValues={formData?.fieldValues}
              ref={agencyConvertFormRef}
              onSubmitForm={handleSubmit}
              noOfContentColumns={2}
              groupGap="24px 54px"
            />
          </div>
        ) : (
          t("To convert your individual brokerage status to agency, ensure you've purchased a package")
        )}
      </ConfirmationModal>
    </>
  );
};

export default AgencyConvertModal;
