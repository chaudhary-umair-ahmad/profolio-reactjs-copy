import tenantConstants from '@constants';
import tenantData from '@data';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import { Button, Col, Row, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppAuthentication } from '../../../hooks';
import TenantComponents from '@components';
import { Avatar, Flex, Group, Icon, Skeleton, Tag, TextWithIcon } from '../../common';
import DrawerPopover from '../../common/drawerPopover/drawerPopover';
import { IconStyled } from '../../common/icon/IconStyled';
import { LogoNafaz } from '../../svg';
import { InfoWraper, UserDropdown } from './auth-info-style';
import { ProgressStyled } from '../../../tenant/common/components/profile-completion/style';
import { useGetUserSettingsDetailQuery } from '../../../apis/user';
const AuthInfo = () => {
  const HeaderComponents = TenantComponents.HeaderComponent;
  const { t } = useTranslation();

  const user = useSelector((state) => state.app.loginUser.user);
  const { isMobile, locale, isMemberArea } = useSelector((state) => state.app.AppConfig);
  const [visible, setVisible] = useState(false);
  const { onLogout } = useAppAuthentication();
  const { data: profileData } = useGetUserSettingsDetailQuery(
    { id: user?.id },
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
    },
  );
  const accountTypeLabel = user?.agency?.id ? t('Agency User') : t('Individual');

  const handleVisibleChange = (isVisible) => {
    setVisible(isVisible);
  };

  const handleLinkClick = () => {
    setVisible(false);
  };

  const SignOut = (e) => {
    e.preventDefault();
    onLogout({ manualLogout: true });
    setVisible(false);
  };

  const renderProfileImage = (size, iconSize, iconContainerSize) => {
    return (
      <Avatar
        size={size}
        src={profileData?.profile_image?.[0]?.gallerythumb}
        style={{ margin: 0 }}
        iconSize={iconSize}
        iconContainerSize={iconContainerSize}
      />
    );
  };

  const userContent = (
    <UserDropdown>
      <div className="user-dropdwon">
        <div className="user-info">
          <Group template="auto 1fr" gap="10px" className="align-items-center mb-12" style={{ lineHeight: '20px' }}>
            {user?.profile_image ? (
              <img src={user?.profile_image} width="40" alt="" />
            ) : (
              <IconStyled
                style={{
                  '--icon-styled-width': '40px',
                  '--icon-bg-color': tenantTheme['gray300'],
                  height: 'var(--icon-styled-width)',
                  alignSelf: 'auto',
                  '--icon-radius': '50%',
                }}
              >
                <Icon size={20} icon="FiUser" />
              </IconStyled>
            )}
            <div className="user-meta-column">
              <div className="fw-600 fs16">{locale === 'en' ? user?.name : user?.name_l1}</div>
              <div
                style={{ color: tenantTheme['gray700'] }}
                className="fw-500 account-type-email-line"
              >
                <span className="shrink-0">{accountTypeLabel}</span>
                <Icon
                  icon="GoDotFill"
                  color={tenantTheme['gray500']}
                  size={isMobile ? '8px' : '8px'}
                  className="shrink-0"
                />
                <span className="account-email-part">{user?.email}</span>
              </div>
            </div>
          </Group>

          {user?.is_nafaz_verified && (
            <Tag color={tenantTheme['primary-light-3']} shape="round" size="12px" className="mb-8">
              <Space.Compact className="base-color align-items-center" style={{ gap: 6 }}>
                <LogoNafaz width={20} />
                <span>{t('Nafath Verified')}</span>
                <Icon icon="PiSealCheckFill" color="#479EEB" />
              </Space.Compact>
            </Tag>
          )}
          <div>
            {user?.is_rega_verified && (
              <Tag color={tenantTheme['primary-light-3']} shape="round" size="12px" className="mb-8">
                <Space.Compact className="base-color align-items-center" style={{ gap: 6 }}>
                  <span>{t('REGA Verified')}</span>
                  <Icon icon="PiSealCheckFill" color="#479EEB" />
                </Space.Compact>
              </Tag>
            )}
          </div>
        </div>

        <ul className="dropdwon-links">
          <li>
            <Link to={`${tenantRoutes.app('', false, user).settings.route}/user-profile`} onClick={handleLinkClick}>
              <Icon icon="FiUser" />
              {t('Account Settings')}
            </Link>
          </li>
          <li>
            <Link onClick={SignOut} to="#" className="sign-out">
              <span>
                <Icon icon="FiLogOut" className="flipX p-0" />
              </span>
              {t('Sign Out')}
            </Link>
          </li>
        </ul>
      </div>
    </UserDropdown>
  );

  return !user ? (
    <AuthInfoSkeleton />
  ) : (
    <InfoWraper>
      <HeaderComponents />
      <div>
        <DrawerPopover
          content={userContent}
          onCancel={() => setVisible(false)}
          overlayInnerStyle={{ padding: 0, borderRadius: '10px', '--drawer-space': 0 }}
          overlayClassName="menu-main"
          onOpenChange={handleVisibleChange}
          action="click"
          title={t('Profile Information')}
          visible={visible}
          height={400}
          footer={null}
          style={{ '--drawer-space': 0 }}
        >
          <Button
            shape="round"
            className="head-example name-avatar"
            style={{ gap: '0' }}
            onClick={() => {
              if (isMobile) {
                setVisible(true);
              }
            }}
          >
            {tenantConstants.PROFILE_COMPLETION_APPLICABLE && !isMemberArea ? (
              <ProgressStyled
                size={34}
                type="circle"
                strokeColor={tenantData.getClassificationColor(user?.profile_completion?.classification)}
                percent={user?.profile_completion?.score}
                format={() => renderProfileImage(30, 24, '26')}
              />
            ) : (
              renderProfileImage(34, 26, '34')
            )}
          </Button>
        </DrawerPopover>
      </div>
    </InfoWraper>
  );
};

const AuthInfoSkeleton = () => {
  return (
    <InfoWraper>
      <Row gutter={8}>
        <Col>
          <Skeleton type="button" style={{ marginTop: 25 }} />
        </Col>
        <Col>
          <Skeleton type="avatar" size={40} style={{ marginTop: 20 }} />
        </Col>
      </Row>
    </InfoWraper>
  );
};

export default AuthInfo;
