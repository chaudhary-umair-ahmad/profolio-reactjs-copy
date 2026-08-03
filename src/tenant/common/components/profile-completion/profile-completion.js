import tenantData from '@data';
import tenantUtils from '@utils';
import tenantTheme from '@theme';
import { Typography } from 'antd';
import cx from 'clsx';
import { t } from 'i18next';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Flex, Group, Icon } from '../../../../components/common';
import { CardGradient } from '../../../../components/common/cards/styled';
import { TruBrokerBanner } from '../../../../components/tru-broker/styled';
import { CardMetaStyled } from '../../../../container/pages/user-settings/style';
import {
  completeYourProfileClickEvent,
  whyIsProfileCompletionImportantClickEvent,
} from '../../../../services/analyticsService';
import CompleteProfilePopUp from './complete-profile-pop-up';
import ProfileImportanceModal from './profile-importance';
import { AvatarStyled, ProgressStyled } from './style';
const { Title, Text } = Typography;

const ProfileCompletionAlert = ({ style, user }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const profileCompletionModalRef = useRef();
  const completeProfileModalRef = useRef();

  const renderProfileImage = () => {
    const renderImage = () => {
      return (
        <AvatarStyled
          size={44}
          src={user?.profile_image}
          showBadge={true}
          badgeColor={tenantData.getClassificationColor(user?.profile_completion?.classification)}
          badgeCount={user?.profile_completion?.score + '%'}
          badgeShape={'square'}
          badgeOffset={rtl ? [20, 42] : [-21, 42]}
          iconContainerSize={'44px'}
        >
          {!user?.profile_image && <Icon icon="profileAvatar" />}
        </AvatarStyled>
      );
    };
    return (
      <ProgressStyled
        size={50}
        type="circle"
        strokeColor={tenantData.getClassificationColor(user?.profile_completion?.classification)}
        percent={user?.profile_completion?.score}
        format={() => renderImage()}
        style={{ marginBlockEnd: 10, '--remaining-color': '#fff' }}
      />
    );
  };

  return (
    <>
      {user?.profile_completion?.score < 100 && (
        <TruBrokerBanner
          as={CardGradient}
          circleShadow={false}
          style={{
            '--gradient-val': '-37.9%',
            '--gradient-val1': '65.73%',
            padding: '12px 20px',
            background: `color-mix(in srgb, ${tenantTheme['danger-color']} 5%, #fff)`,
            margin: isMobile && '12px',
            marginBottom: '12px',
            ...style,
          }}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <Flex className="w-100" justify="space-between" align="center" wrap={!isMobile} style={{ height: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                flex: 1,
                minWidth: 0,
                paddingTop: 8,
              }}
            >
              {renderProfileImage()}
              <div>
                <Title level={5} className="base-color fw-700 fz-14" style={{ marginBottom: -2 }}>
                  {tenantUtils.getLocalisedString(user?.profile_completion, 'title')}
                </Title>
                {!isMobile && (
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text type="secondary" className="fz-12" style={{ whiteSpace: 'normal', flexShrink: 1 }}>
                      {tenantUtils.getLocalisedString(user?.profile_completion, 'message')}
                    </Text>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        profileCompletionModalRef.current?.showModal();
                        whyIsProfileCompletionImportantClickEvent(user, false);
                      }}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {t('Why is this important?')}
                    </Button>
                  </div>
                )}
                {isMobile && (
                  <Text
                    type="secondary"
                    className="fz-12"
                    style={{ whiteSpace: 'normal', flexShrink: 1, marginBottom: 8 }}
                  >
                    {tenantUtils.getLocalisedString(user?.profile_completion, 'message')}
                  </Text>
                )}
              </div>
            </div>
            {!isMobile && user?.profile_completion?.score < 100 && (
              <Button
                size={isMobile ? 'small' : undefined}
                onClick={() => {
                  completeProfileModalRef.current?.showCompletionPopUp();
                  completeYourProfileClickEvent(user);
                }}
                style={{ whiteSpace: 'nowrap', marginLeft: 'auto' }}
              >
                {t('Complete your Profile')}
              </Button>
            )}
          </Flex>
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                size="small"
                type="default"
                onClick={() => {
                  completeProfileModalRef.current?.showCompletionPopUp();
                  completeYourProfileClickEvent(user);
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('Complete your Profile')}
              </Button>
              <Button
                className="fz-12 cursor-pointer"
                type="link"
                onClick={() => {
                  profileCompletionModalRef.current?.showModal();
                  whyIsProfileCompletionImportantClickEvent(user, false);
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('Why is this important?')}
              </Button>
            </div>
          )}
          <ProfileImportanceModal ref={profileCompletionModalRef} />
          <CompleteProfilePopUp ref={completeProfileModalRef} />
        </TruBrokerBanner>
      )}
    </>
  );
};
export default ProfileCompletionAlert;
