import tenantData from '@data';
import tenantUtils from '@utils';
import { Button, Col, Divider, Row } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetAgencyProfileDetailsQuery, useUpdateAgencyProfileMutation } from '../../../apis/agency';
import { Card, ConfirmationModal, LoaderWrapper, notification } from '../../../components/common';
import { JSONFormStyled } from '../../../components/common/json-form/json-form';
import { usePageTitle } from '../../../hooks';
import Algolia from '../../../services/algolia';
import AgencyInfoCard from '../../../components/agency-staff-header/agency-info-card';
import { pageViewAgencySettingEvent, agencySaveChangesEvent } from '../../../services/analyticsService';
const AgencySettingsPage = () => {
  const { t } = useTranslation();
  usePageTitle(t('Agency Settings - Profolio'));
  const { user } = useSelector((state) => state.app.loginUser);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const agencyUserSettings = useSelector((state) => state.app.loginUser?.user?.agencyUserSettings);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-render

  const {
    data,
    isLoading: agencyLoading,
    isFetching: fetching,
    refetch,
  } = useGetAgencyProfileDetailsQuery(user?.agency?.id, {
    skip: !user?.agency?.id,
    refetchOnMountOrArgChange: true,
  });

  const [updateAgencyProfile, { isLoading: profileUpdating }] = useUpdateAgencyProfileMutation();

  const agencyFormRef = useRef();
  const saveChangesModal = useRef();

  const handleSubmit = async (values) => {
    let updatedData = { ...values, owner: data?.agencyDetails?.owner };

    const response = await updateAgencyProfile({ agencyId: user.agency.id, body: updatedData, locale });
    agencySaveChangesEvent(user, values, response.error);
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        saveChangesModal?.current?.showModal();
      }
    }
  };

  useEffect(() => {
    pageViewAgencySettingEvent(user);
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const queryObject = Algolia.getAllCities();
    const cityResponse = await Algolia.getLocationsIndex().search('', queryObject);
    setCities(cityResponse.hits?.map((e) => ({ id: e?.city_id, name: tenantUtils.getLocalisedString(e, 'title') })));
  };

  const handleModalClose = () => {
    refetch(user?.agency?.id).then(() => {
      saveChangesModal?.current?.hideModal();
      setRefreshKey((prevKey) => prevKey + 1); // Trigger re-render
    });
  };
  const cityOptions = useMemo(() => {
    if (!data?.agencyDetails?.city) return cities;
    const list = cities ?? [];
    const selectedId = data?.agencyDetails?.city?.city?.location_id;
    const title =
      data?.agencyDetails?.city?.city?.name ?? { en: String(data?.agencyDetails?.city?.city?.name ?? selectedId) };
    return [
      { ...data?.agencyDetails?.city?.city, location_id: selectedId, id: selectedId, name: title },
      ...list,
    ];
  }, [cities, data?.agencyDetails?.city]);

  const fields = useMemo(
    () => tenantData.agencySettingsFields(data?.agencyDetails, cityOptions, t),
    [data?.agencyDetails, cityOptions, tenantData],
  );
  return (
    <Card key={refreshKey} bodyStyle={{ padding: isMobile ? 16 : 40 }} style={{ marginBottom: 16 }}>
      {!isMobile && <AgencyInfoCard agencyData={data?.agencyDetails} loading={agencyLoading} />}
      {!isMobile && <Divider style={{ margin: '28px 0 40px' }} />}
      <div style={{ ...(!!loading && { pointerEvents: 'none', opacity: '0.4' }) }}>
        <LoaderWrapper loading={fetching}>
          <JSONFormStyled
            key={'agency'}
            fields={fields?.[0]?.list}
            formFieldValues={data?.agencyDetails}
            ref={agencyFormRef}
            onSubmitForm={handleSubmit}
            noOfContentColumns={2}
            groupGap="24px 54px"
          />
        </LoaderWrapper>
      </div>
      <ConfirmationModal
        ref={saveChangesModal}
        onCancel={handleModalClose}
        noOfContentColumns={2}
        groupGap="24px 54px"
      />
      <ConfirmationModal ref={saveChangesModal} onCancel={handleModalClose} footer={null}>
        <p>{t('Your request for update profile has been sent')}</p>
      </ConfirmationModal>

      <Row>
        <Col xs={24} align="end" style={{ maxWidth: 880, margin: '18px auto 0' }}>
          <Button
            type="primary"
            size="large"
            disabled={!data}
            loading={profileUpdating || agencyLoading}
            onClick={() => {
              agencyFormRef.current && agencyFormRef.current.submitForm();
            }}
            style={{
              paddingInline: 60,
            }}
            block={isMobile ? true : false}
          >
            {t('Save Changes')}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default AgencySettingsPage;
