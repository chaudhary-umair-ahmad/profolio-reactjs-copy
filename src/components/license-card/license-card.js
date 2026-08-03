import tenantTheme from '@theme';
import { Col, Divider, Row, Space, Typography } from 'antd';
import cx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ActionButton } from '../../container/pages/user-settings/style';
import { getTimeDateString } from '../../utility/date';
import { getClassifiedBaseURL } from '../../utility/env';
import { Button, Card, DrawerModal, Flex, Group, Icon, Switch, Tag, TextWithIcon, notification } from '../common';
import RenderTextLtr from '../render-text/render-text';
import { SvgShareAgancyLicense } from '../svg';
import tenantUtils from '@utils';
import { useUpdateLicenseMutation } from '../../apis/user';

const colors = { Rejected: 'red', Verified: 'green', 'In Review': 'warning' };

const LicenseCard = ({ licenseData, isMobile, disabled }) => {
  const { t } = useTranslation();
  const loggedInUser = useSelector((state) => state.app.loginUser?.user);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const [modalVisible, setModalVisible] = useState(false);
  const [toggleModalVisible, setToggleModalVisible] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  const [updateLicense, { isLoading: shareLoading, isError, error }] = useUpdateLicenseMutation();
  const shareLicense = async (licenseId, checked, setToggleModalVisible) => {
    const data = { license: { is_shareable: checked } };
    const response = await updateLicense({ licenseId: licenseId, values: data });

    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        setToggleModalVisible(false);
        setSelectedLicense(null);
        notification.success(t('License sharing status changed'));
      }
    }
  };

  const handleChange = (checked, licenseId) => {
    setToggleModalVisible(true);
    setToggleValue(checked);
    setSelectedLicense(licenseId);
  };

  const renderAddLicenseButton = (style, type) => {
    return (
      <ActionButton>
        <Button
          className="mb-0"
          size="large"
          style={style && style}
          type={type}
          href={`${getClassifiedBaseURL()}/${locale}/verification/rega/?redirectPath=${window.location.href}`}
        >
          {t('Add FAL license')}
        </Button>
      </ActionButton>
    );
  };

  const renderLicenseConfirmationModal = () => {
    return (
      <DrawerModal
        visible={modalVisible}
        title={t('Information')}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <div className="text-center">
          <SvgShareAgancyLicense size={isMobile ? 72 : 80} className={isMobile ? 'mb-12' : 'mb-20'} />
          <h3 className={cx(isMobile ? 'fs16' : 'fs18', 'mb-12 fw-500')}>{t('Share License with Agency')}</h3>
          <p className="color-gray-dark" style={{ maxWidth: 360, marginInline: 'auto' }}>
            {t(`By enabling this, you are allowing other agency members to post listings using this FAL license.`)}
          </p>
        </div>
      </DrawerModal>
    );
  };

  const renderLicenseList = () => {
    return (
      <Group gap={isMobile ? '12px' : '24px'}>
        {licenseData?.map((license) => (
          <Card
            style={{
              backgroundColor: !isMobile && tenantTheme['primary-light-4'],
              borderColor: !isMobile && tenantTheme['primary-light-3'],
            }}
            key={license?.id}
            bodyStyle={{ padding: isMobile ? 16 : '16px 20px' }}
          >
            <Row className="mb-12">
              <Col xs={24}>
                <Group gap="6px">
                  <Group template="1fr auto" gap="6px" className="align-items-center mb-8">
                    <div>
                      <Tag color="#e2edf8" shape="round" size="12px">
                        <Space.Compact className="base-color" style={{ gap: 6, lineHeight: isMobile ? 1.8 : 2.2 }}>
                          {t('FAL License:')}
                          <strong>{license?.number}</strong>
                          {license?.status?.name == 'Verified' && <Icon icon="PiSealCheckFill" color="#479EEB" />}
                        </Space.Compact>
                      </Tag>
                    </div>

                    <Tag color={colors[license?.status?.name]} shape="round" size={isMobile ? '12px' : '14px'}>
                      {t(license?.status?.name)}
                    </Tag>
                  </Group>

                  {license?.license_type === 'agency' && (
                    <Flex align="center" className="color-gray-dark text-capitalize" gap="6px">
                      <strong className="color-primary">
                        {tenantUtils.getLocalisedString(license, 'license_type')}
                      </strong>
                      <Icon icon="GoDotFill" color={tenantTheme['primary-light-2']} size={12} />
                      <span>
                        {t('CR Number')}
                        {': '}
                        <strong className="color-primary">{license?.advertiser_id && license?.advertiser_id}</strong>
                      </span>
                    </Flex>
                  )}

                  {license?.broker_name && (
                    <strong className="fs16 fw-600">{tenantUtils.getLocalisedString(license, 'broker_name')}</strong>
                  )}

                  <Flex
                    align={isMobile ? 'start' : 'center'}
                    className="fs14 color-gray-dark"
                    gap="6px"
                    vertical={isMobile ? true : false}
                  >
                    {license?.mobile && (
                      <TextWithIcon
                        icon="MdPhone"
                        iconProps={{ color: tenantTheme['primary-color'], size: '.9em' }}
                        textColor={tenantTheme['text-color-secondary']}
                        title={<RenderTextLtr text={license?.mobile} />}
                        fontWeight={400}
                      />
                    )}
                    {license?.email && (
                      <>
                        {!isMobile && <Icon icon="GoDotFill" color={tenantTheme['primary-light-2']} size={12} />}
                        <TextWithIcon
                          icon="MdEmail"
                          iconProps={{ color: tenantTheme['primary-color'], size: '.9em' }}
                          textColor={tenantTheme['text-color-secondary']}
                          title={license?.email}
                          fontWeight={400}
                        />
                      </>
                    )}
                  </Flex>

                  {}
                  <TextWithIcon
                    icon="FaMapMarkerAlt"
                    iconProps={{ color: tenantTheme['primary-color'], size: '.9em' }}
                    textColor={tenantTheme['base-color']}
                    title={[license?.location, license?.city]
                      .filter((e) => !!e)
                      .map((e) => tenantUtils.getLocalisedString(e, 'name'))
                      .join(', ')}
                    fontWeight={400}
                  />
                </Group>
              </Col>
            </Row>

            <Row align="space-between" className="text-muted" wrap={false}>
              <Col>
                {license?.user?.name && (
                  <>
                    <div className="fs12">{t('Owner')}</div>
                    <Typography.Text className={isMobile ? 'fw-600' : 'fw-600'}>
                      {tenantUtils.getLocalisedString(license?.user, 'name')}
                    </Typography.Text>
                  </>
                )}
              </Col>
              <Col className="text-right">
                <div className="fs12">{t('Valid until ')}</div>
                <Typography.Text className={isMobile ? 'fw-600' : 'fw-600'}>
                  {getTimeDateString(license?.end_date)}
                </Typography.Text>
              </Col>
            </Row>

            <Divider style={{ marginBlock: 12 }} />

            <Row align="space-between" className={isMobile && 'fs12'} gutter={8}>
              <Col>
                {license?.certificate_link && (
                  <a href={license?.certificate_link} className="color-primary" target="_blank" rel="noopener noreferrer">
                    <Space.Compact style={{ gap: 4 }}>
                      {t('View Certificate')} <Icon icon="HiOutlineExternalLink" size="14px" />
                    </Space.Compact>
                  </a>
                )}
              </Col>
              <Col>
                {license?.user?.id === loggedInUser?.id && loggedInUser?.agency?.id && (
                  <Flex align="center" gap="12px">
                    <Space.Compact style={{ gap: 4 }} className="text-muted">
                      <Icon
                        icon="MdInfoOutline"
                        iconProps={{ size: isMobile ? 16 : 18 }}
                        className="pointer"
                        onClick={() => setModalVisible(true)}
                      />
                      {t('Share with agency staff')}
                      {renderLicenseConfirmationModal()}
                    </Space.Compact>

                    <Switch
                      value={license?.is_shareable}
                      onChange={(e) => {
                        handleChange(e, license?.id);
                      }}
                      disabled={license?.status?.slug == 'rejected' ? true : false}
                    />
                    <DrawerModal
                      title={`${!!license?.is_shareable ? t('Unshare') : t('Share License')}`}
                      visible={toggleModalVisible}
                      onCancel={() => {
                        setToggleModalVisible(false);
                        setSelectedLicense(null);
                      }}
                      width={400}
                      footer={
                        <Button
                          type="primary"
                          loading={shareLoading}
                          onClick={() => shareLicense(selectedLicense, toggleValue, setToggleModalVisible)}
                        >
                          {license?.is_shareable ? t('Unshare') : t('Share')}
                        </Button>
                      }
                    >
                      {!license?.is_shareable
                        ? t(
                            'By Enabling this you are sharing license with other Agency Members. Are you sure to share your license',
                          )
                        : t('Are you sure to unshare your license with Agency Members.')}
                    </DrawerModal>
                  </Flex>
                )}
              </Col>
            </Row>
          </Card>
        ))}
      </Group>
    );
  };

  return isMobile ? (
    <>
      {renderLicenseList()}
      <Flex align="center" justify="space-between" className="mb-20">
        {renderAddLicenseButton({ position: 'sticky' }, 'primary')}
      </Flex>
    </>
  ) : (
    <Card bodyStyle={{ padding: isMobile ? 16 : 20 }} disabled={disabled}>
      {!isMobile && (
        <Flex align="center" justify="space-between" className="mb-20">
          {renderAddLicenseButton({}, 'link')}
        </Flex>
      )}
      {renderLicenseList()}
    </Card>
  );
};
export default LicenseCard;
