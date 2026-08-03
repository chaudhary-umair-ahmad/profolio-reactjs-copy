import TenantComponents from '@components';
import tenantConstants from '@constants';
import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Col, Divider, Row, Skeleton, Space, Typography } from 'antd';
import cx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserSettingsDetailQuery, useUpdateProfileDetailsMutation } from '../../../apis/user';
import {
  Avatar,
  Button,
  Card,
  Flex,
  Group,
  Icon,
  LoaderWrapper,
  Tag,
  TextWithIcon,
  notification,
} from '../../../components/common';
import { JSONFormStyled } from '../../../components/common/json-form/json-form';
import AgencyConvertModal from '../../../components/convert-to-agency/convert-to-agency';
import { LogoNafaz } from '../../../components/svg';
import Algolia from '../../../services/algolia';
import { pageViewUserSettingEvent, userSaveChangesEvent } from '../../../services/analyticsService';
import { setDashboardSelectedUser } from '../../../store/appSlice';
import { ActionButton, CardMetaStyled } from './style';
import { ProgressStyled } from '../../../tenant/common/components/profile-completion/style';

const { Title } = Typography;

const UserProfile = () => {
  const loggedInUser = useSelector((state) => state.app.loginUser);
  // const profileData = useSelector((state) => state.app.loginUser?.user?.profileData);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const isMemberArea = useSelector((state) => state.app.AppConfig.isMemberArea);
  // const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({});
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const formRef = useRef();
  const [cities, setCities] = useState([]);

  const {
    data: profileData,
    isLoading: loading,
    isFetching: fetching,
    refetch: fetchProfileData,
    error,
  } = useGetUserSettingsDetailQuery(
    { id: loggedInUser?.user?.id },
    {
      skip: !loggedInUser?.user?.id,
      refetchOnMountOrArgChange: true,
    },
  );
  const [updateProfile, { isLoading: updating }] = useUpdateProfileDetailsMutation();

  const imageDescription = [
    { key: 1, label: 'Choose a Plain Background' },
    { key: 2, label: 'Face the Camera' },
    { key: 3, label: 'Wear Professional Attire' },
    { key: 4, label: 'Center your photo around your head and shoulders to ensure clients can easily see your face' },
    { key: 5, label: 'Keep your photo natural. Avoid heavy filters or edits to maintain authenticity.' },
  ];
  const imageGuidelines = [
    { key: 1, label: 'Upload a front-facing picture of yourself with a solid background.' },
    { key: 2, label: 'Pictures of logos, buildings, or irrelevant images are not allowed.' },
  ]

  

  const fetchCities = async (text, callbackSuccess = () => {}, callback) => {
    try {
      let response = null;
      if (!!text) {
        const queryObject = Algolia.getCitiesByName(text);
        response = await Algolia.getLocationsIndex().search('', queryObject);
      } else {
        const queryObject = Algolia.getAllCities();
        response = await Algolia.getLocationsIndex().search('', queryObject);
      }

      if (response) {
        callbackSuccess(response);
        return response;
      } else {
        callback();
      }
    } catch (e) {
      callback();
    }
  };
  useEffect(() => {
    pageViewUserSettingEvent(loggedInUser?.user);
  }, []);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const queryObject = Algolia.getAllCities();
        const cityResponse = await Algolia.getLocationsIndex().search('', queryObject);
        setCities(
          cityResponse?.hits?.map((e) => ({
            ...e,
            id: e?.id,
            value: tenantUtils.getLocalisedString(e, 'title'),
          })),
        );
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const renderUserImage = () => {
    const isAgencyVerified = loggedInUser?.user?.agency?.is_verified;
    
    const avatarWithVerifiedIcon = (avatar) => {
      if (tenantConstants.SHOW_VERIFIED_ICON && isAgencyVerified) {
        return (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {avatar}
            <div
              style={{
                position: 'absolute',
                top: -6,
                [rtl ? 'right' : 'left']: 36,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                icon="PiSealCheckFill"
                size="24px"
                style={{ color: tenantTheme['info-color-alt'] || '#1890ff' }}
              />
            </div>
          </div>
        );
      }
      return avatar;
    };
    
    const imageWithBadge = () => {
      const avatarElement = (
        <Avatar
          size={54}
          src={profileData?.profile_image?.[0].gallerythumb}
          showBadge={true}
          iconContainerSize="50px"
          iconSize={20}
          badgeColor={tenantData.getClassificationColor(loggedInUser?.user?.profile_completion?.classification)}
          badgeCount={loggedInUser?.user?.profile_completion?.score + '%'}
          badgeShape={'square'}
          badgeOffset={rtl ? [27, 55] : [-27, 55]}
        />
      );
      return avatarWithVerifiedIcon(avatarElement);
    };
    
    const renderAvatar = () => {
      const avatarElement = (
        <Avatar size={54} src={loggedInUser?.user?.profile_image} iconSize={24} />
      );
      return avatarWithVerifiedIcon(avatarElement);
    };
    return tenantConstants.PROFILE_COMPLETION_APPLICABLE && !isMemberArea ? (
      <ProgressStyled
        size={58}
        type="circle"
        strokeColor={tenantData.getClassificationColor(loggedInUser?.user?.profile_completion?.classification)}
        percent={loggedInUser?.user?.profile_completion?.score}
        format={() => imageWithBadge()}
        style={{ marginBlockEnd: 10 }}
      />
    ) : (
      renderAvatar()
    );
  };

  const fields = useMemo(
    () =>
      tenantData.profileFormFields(t, profileData, tenantConstants.KC_ENABLED, cities, imageDescription,imageGuidelines ,fetchCities, loggedInUser?.user?.agency),
    [tenantData, t, loggedInUser?.user?.id, tenantConstants.KC_ENABLED, profileData, loggedInUser?.user?.agency],
  );

  const handleSubmit = async (values) => {
    const res = await updateProfile({ userId: loggedInUser?.user?.id, body: values });
    userSaveChangesEvent(loggedInUser?.user, values, res?.error);
    if (res) {
      if (res?.error) {
        notification.error(res.error);
      } else {
        tenantConstants.TRU_BROKER_ENABLED && tenantUtils.showTruBrokerStatusNotification(res?.data);
        notification.success(t('Profile has been updated'));
      }
    }
  };

  return (
    <Group gap="16px">
      <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
        <Skeleton loading={false} paragraph={{ rows: 1 }} size="large" style={{ maxWidth: 400 }} avatar active>
          <Flex
            vertical={isMobile}
            justify="space-between"
            align={!isMobile ? 'center' : null}
            className={cx('w-100', isMobile && 'mb-20')}
          >
            <CardMetaStyled
              avatar={renderUserImage()}
              title={
                <Flex align="center" gap="8px" wrap>
                  {tenantUtils.getLocalisedString(loggedInUser?.user, 'name')}
                  <Tag color={tenantTheme['primary-light-3']} shape="round" size="12px">
                    <TextWithIcon
                      icon="AgencyIcon"
                      iconProps={{ size: '1.1em' }}
                      title={loggedInUser?.user?.agency ? t('Agency') : t('Individual')}
                    />
                  </Tag>
                  {tenantConstants.SHOW_VERIFIED_ICON && loggedInUser?.user?.agency?.is_verified && !isMobile && (
                    <Tag
                      style={{
                        backgroundColor: '#E6F4FF',
                        borderRadius: '4px',
                        border: 'none',
                        padding: '4px 8px',
                        fontSize: '12px',
                        color: '#000',
                      }}
                    >
                      <Flex gap="4px" align="center">
                        <Icon icon="PiSealCheckFill" color={tenantTheme['info-color-alt']} size="14px" />
                        {t('Verified Agency')}
                      </Flex>
                    </Tag>
                  )}
                  {loggedInUser?.user?.is_nafaz_verified && !isMobile && (
                    <Tag color="blue" shape="round" size="12px">
                      <Flex className="base-color" gap="4px" align="center">
                        <LogoNafaz width={20} />
                        {t('Nafath Verified')}
                        <Icon icon="PiSealCheckFill" color={tenantTheme['info-color-alt']} />
                      </Flex>
                    </Tag>
                  )}
                </Flex>
              }
              description={
                <Space size={8} direction="vertical">
                  {loggedInUser?.user?.email}
                  {loggedInUser?.user?.is_nafaz_verified && isMobile && (
                    <Tag color="blue" shape="round" size="12px">
                      <Flex className="base-color" gap="4px" align="center">
                        <LogoNafaz width={20} />
                        {t('Nafath Verified')}
                        <Icon icon="PiSealCheckFill" color={tenantTheme['info-color-alt']} />
                      </Flex>
                    </Tag>
                  )}
                </Space>
              }
            />
            {!loggedInUser?.user?.agency && tenantConstants.CONVERT_TO_AGENCY && (
              <AgencyConvertModal disableButton={loading} />
            )}
          </Flex>
        </Skeleton>

        {fields?.kcFormFields && (
          <>
            {!isMobile && <Divider style={{ margin: '28px 0 40px' }} />}
            <div style={{ ...(loading && { pointerEvents: 'none', opacity: 0.4 }), paddingInline: isMobile ? 4 : 40 }}>
              <LoaderWrapper loading={fetching || updating}>
                <TenantComponents.ProfileKCForm
                  fields={Object.keys(fields?.kcFormFields).map((e) => ({
                    ...fields?.kcFormFields[e],
                    key: e,
                  }))}
                  values={profileData || loggedInUser?.user}
                  fetchUserData={fetchProfileData}
                />
              </LoaderWrapper>
            </div>
          </>
        )}
      </Card>
     
      {fields?.basicFields && (
        <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
          <Title level={5} className='mb-12'>{t('Additional Information')}</Title>
          <LoaderWrapper loading={fetching || updating}>
            <div style={{ ...(loading && { pointerEvents: 'none', opacity: 0.4 }), paddingInline: isMobile ? 4 : 40 }}>
              <JSONFormStyled
                fields={fields?.basicFields}
                formFieldValues={profileData}
                ref={formRef}
                onSubmitForm={(values) => {
                  handleSubmit(values);
                }}
                noOfContentColumns={2}
                groupGap="24px 54px"
              />
              <Row>
                <Col xs={24} style={{ maxWidth: 880, margin: '18px auto 0' }}>
                  <ActionButton>
                    <Button
                      type="primary"
                      size="large"
                      disabled={loading}
                      loading={loading || updating}
                      onClick={() => {
                        formRef.current && formRef.current.submitForm();
                      }}
                      style={{ paddingInline: 50 }}
                    >
                      {t('Save Changes')}
                    </Button>
                  </ActionButton>
                </Col>
              </Row>
            </div>
          </LoaderWrapper>
        </Card>
      )}
    </Group>
  );
};

export default UserProfile;
