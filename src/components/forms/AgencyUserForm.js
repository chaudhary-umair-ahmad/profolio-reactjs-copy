import tenantData from '@data';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Card, Divider, LoaderWrapper, notification, Text, Title } from '../../components/common';
import { strings } from '../../constants/strings';
import Algolia from '../../services/algolia';
import { JSONFormStyled } from '../common/json-form/json-form';
import { Modal } from '../common/modals/antd-modals';
import {
  useAddAgencyStaffUserMutation,
  useGetAgencyUserDetailsQuery,
  useUpdateAgencyUserMutation,
  useGetAgencySeatsSummaryQuery,
} from '../../apis/agency';
import { useGetSurgeExperienceListQuery, useGetSurgeLanguagesListQuery } from '../../apis/user';
import { confirmEditStaffClickEvent } from '../../services/analyticsService';
import { useSelector } from 'react-redux';
import { Col, Row, Space } from 'antd';
import { AppstoreOutlined, UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import {
  SeatsContainer,
  StyledCard,
  IconWrapper,
  CardTitle,
  CardSubtitle,
  CountText,
  StatLabel,
  StatValue,
} from './styled';

export const UserForm = ({ isVisible, setIsVisible, agencyId, userId, isAdmin, isActivationMode, refetchSeats }) => {
  const { t } = useTranslation();
  const [cities, setCities] = useState(false);
  const formRef = useRef();
  const { user } = useSelector((state) => state.app.loginUser);
  const is_zameen_package_user = user?.is_zameen_package_user;
  
  const {
    data: formData,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useGetAgencyUserDetailsQuery(userId, { skip: !isVisible || !userId, refetchOnMountOrArgChange: true });

  const { data: surgeLanguagesList } = useGetSurgeLanguagesListQuery(undefined, {
    skip: !isVisible,
  });

  const { data: surgeExperienceList } = useGetSurgeExperienceListQuery(undefined, {
    skip: !isVisible,
  });

  const { data: seatsSummary, isLoading: isLoadingSeats, error: seatsError } = useGetAgencySeatsSummaryQuery(agencyId, {
    skip: !isVisible || !agencyId || !is_zameen_package_user,
    refetchOnMountOrArgChange: true,
  });

  const [updateUser, { isLoading: updating }] = useUpdateAgencyUserMutation();
  const [addUser, { isLoading: addingUser }] = useAddAgencyStaffUserMutation();
  const userImageGuidelines = [
    { key: 1, label: 'Upload a front-facing picture of yourself with a solid background.' },
    { key: 2, label: 'Pictures of logos, buildings, or irrelevant images are not allowed.' },
  ];
  const errorMessage = seatsError?.data?.errors?.[0] || "No Package Assigned to Your Agency. Please contact support 0800-092633 or use live chat.";

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async (text) => {
    let queryObject = null;
    if (!!text) {
      queryObject = Algolia.getCitiesByName(text);
    } else {
      queryObject = Algolia.getAllCities();
    }
    const response = await Algolia.getLocationsIndex().search('', queryObject);

    setCities(
      response.hits.map((e) => {
        return { id: e.location_id, name: tenantUtils.getLocalisedString(e, 'title') };
      }),
    );
  };
  const formDataForStaffFields = useMemo(
    () => ({
      ...formData,
      languageList: surgeLanguagesList ?? formData?.languageList,
      experienceList: surgeExperienceList ?? formData?.experienceList,
    }),
    [formData, surgeLanguagesList, surgeExperienceList],
  );

  const fields = useMemo(
    () =>
      tenantData.agencyStaffUserFormFields(
        formDataForStaffFields,
        cities,
        fetchCities,
        userImageGuidelines,
        isActivationMode,
      ),
    [tenantData, formDataForStaffFields, cities, isActivationMode],
  );

  const onCloseModal = () => {
    setIsVisible(false);
    formRef?.current && formRef?.current?.resetForm();
  };

  const handleOk = () => {
    formRef.current && formRef.current.submitForm();
  };

  const handleDetailsSubmit = async (values) => {
    const response = userId ? await updateUser({ userId, agencyId, values }) : await addUser({ agencyId, ...values });
    confirmEditStaffClickEvent(user, values, response?.error);
    if (response.error) {
      notification.error(response.error, 7);
    } else {
      onCloseModal();
      refetchSeats && refetchSeats();
    }
  };

  return (
    <Modal
      type="primary"
      title={userId ? t(strings.edit_user) : t(strings.add_user)}
      visible={isVisible}
      okText="Confirm"
      okButtonProps={{ type: 'primary', disabled: !!seatsError }}
      loading={isLoading || updating || addingUser || isLoadingSeats}
      onOk={handleOk}
      onCancel={onCloseModal}
      width={990}
    >
      <LoaderWrapper loading={isFetching && !isLoading}>
        {/* {is_zameen_package_user && tenantConstants.SHOW_AGENCY_STAFF_SEATS_STATS && (
        <SeatsContainer>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <StyledCard bg="#f5faff" border="#e6f0ff">
                <Space align="start">
                  <IconWrapper bg="#e6f0ff" color="#1677ff">
                    <AppstoreOutlined />
                  </IconWrapper>
                  <div>
                    <CardTitle noMargin>{seatsSummary?.seats_summary?.package_name || 'Package'}</CardTitle>
                    <CardSubtitle>Total Allocated Seats</CardSubtitle>
                    <CountText>{seatsSummary?.seats_summary?.total_allocated_seats || 0}</CountText>
                  </div>
                </Space>
              </StyledCard>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <StyledCard bg="#f6fff9" border="#d9f7be">
                <Space align="start">
                  <IconWrapper bg="#e9fce9" color="#52c41a">
                    <UserOutlined />
                  </IconWrapper>
                  <div style={{ flex: 1 }}>
                    <CardTitle>Free Seats</CardTitle>
                    <Row gutter={[8, 8]}>
                      <Col span={8}>
                        <StatLabel>Total</StatLabel>
                        <StatValue>{seatsSummary?.seats_summary?.free_seats?.total_free_seats || 0}</StatValue>
                      </Col>
                      <Col span={8}>
                        <StatLabel>Used</StatLabel>
                        <StatValue>{seatsSummary?.seats_summary?.free_seats?.consumed_free_seats || 0}</StatValue>
                      </Col>
                      <Col span={8}>
                        <StatLabel>Available</StatLabel>
                        <StatValue color="#52c41a">
                          {seatsSummary?.seats_summary?.free_seats?.available_free_seats || 0}
                        </StatValue>
                      </Col>
                    </Row>
                  </div>
                </Space>
              </StyledCard>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <StyledCard bg="#f5faff" border="#bae7ff">
                <Space align="start">
                  <IconWrapper bg="#e6f7ff" color="#1890ff">
                    <CreditCardOutlined />
                  </IconWrapper>
                  <div style={{ flex: 1 }}>
                    <CardTitle>Paid Seats</CardTitle>
                    <Row gutter={[8, 8]}>
                      <Col span={8}>
                        <StatLabel>Total</StatLabel>
                        <StatValue>{seatsSummary?.seats_summary?.paid_seats?.total_paid_seats || 0}</StatValue>
                      </Col>
                      <Col span={8}>
                        <StatLabel>Used</StatLabel>
                        <StatValue>{seatsSummary?.seats_summary?.paid_seats?.consumed_paid_seats || 0}</StatValue>
                      </Col>
                      <Col span={8}>
                        <StatLabel>Available</StatLabel>
                        <StatValue color="#1677ff">
                          {seatsSummary?.seats_summary?.paid_seats?.available_paid_seats || 0}
                        </StatValue>
                      </Col>
                    </Row>
                  </div>
                </Space>
              </StyledCard>
            </Col>
          </Row>
        </SeatsContainer>
        )} */}
        {is_zameen_package_user && !!seatsError && (
          <Alert
            type="error"
            message={errorMessage}
            showIcon
            className="mt-4 mb-16"
            style={{ marginLeft: '30px', marginRight: '30px' }}
          />
        )}

        <JSONFormStyled
          fields={fields}
          formFieldValues={formData}
          ref={formRef}
          onSubmitForm={handleDetailsSubmit}
          loading={isLoading}
          fetchError={error}
          retryButtonLoading={!formData && isLoading}
          onRetry={refetch}
          noOfContentColumns={2}
        />
      </LoaderWrapper>
    </Modal>
  );
};
