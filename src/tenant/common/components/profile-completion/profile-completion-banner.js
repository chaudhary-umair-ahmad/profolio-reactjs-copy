import tenantData from '@data';
import tenantUtils from '@utils';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, DrawerModal, Flex, Icon, Text } from '../../../../components/common';
import { CardMetaStyled } from '../../../../container/pages/user-settings/style';
import {
  completeYourProfileClickEvent,
  whyIsProfileCompletionImportantClickEvent,
} from '../../../../services/analyticsService';
import ProfileCompletionList from './profile-completion-list';
import ProfileImportanceModal from './profile-importance';
import { AvatarStyled, ProfileCard, ProgressStyled } from './style';

const ProfileCompletionBanner = () => {
  const [completeProfileModal, setCompleteProfileModal] = useState(false);
  const { user } = useSelector((state) => state.app.loginUser);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const profileCompletionModalRef = useRef();
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const [showProfileBanner, setShowProfileBanner] = useState(true);

  useEffect(() => {
    if (user?.profile_completion?.score < 100) {
      localStorage.setItem(`hideProfileBanner_${user?.id}`, 'true');
    }
    const profileBannerKey = `hideProfileBanner_${user?.id}`;
    const isButtonHidden = localStorage.getItem(profileBannerKey) === 'false';
    if (isButtonHidden) {
      setShowProfileBanner(false);
    }
  }, [user?.id]);

  const hideProfileBanner = () => {
    localStorage.setItem(`hideProfileBanner_${user?.id}`, 'false');
    setShowProfileBanner(false);
  };

  const renderProfileImage = () => {
    const renderImage = () => {
      return (
        <AvatarStyled
          size={34}
          src={user?.profile_image}
          showBadge={true}
          badgeColor={tenantData.getClassificationColor(user?.profile_completion?.classification)}
          badgeCount={user?.profile_completion?.score + '%'}
          badgeShape={'square'}
          badgeOffset={rtl ? [17, 35] : [-17, 35]}
          iconContainerSize={'30'}
        />
      );
    };
    return (
      <ProgressStyled
        size={38}
        type="circle"
        strokeColor={tenantData.getClassificationColor(user?.profile_completion?.classification)}
        percent={user?.profile_completion?.score}
        format={() => renderImage()}
        style={{ marginBlockEnd: 10 }}
      />
    );
  };

  const renderCompleteProfilePopUp = () => {
    return (
      <DrawerModal
        gradientBackground={true}
        visible={completeProfileModal}
        title={
          <Flex gap="12px">
            {renderProfileImage()}
            <Flex vertical>
              <Text>{t('Complete your Profile')}</Text>
              <span className="fz-12 fw-400 color-gray-dark">{t('Your profile is incomplete')}</span>
            </Flex>
          </Flex>
        }
        onCancel={() => setCompleteProfileModal(false)}
        footer={null}
        bodyStyle={{ '--ant-modal-body-padding': isMobile ? '12px' : '24px' }}
        style={{
          '--ant-modal-header-bg':
            'linear-gradient(180deg, rgba(40, 177, 109, 0.15) 0%, rgba(76, 162, 205, 0.07) 108.09%)',
        }}
      >
        <div className="fw-600 fz-14 mb-8">{t('Profile Completeness')}</div>
        <ProfileCompletionList />
      </DrawerModal>
    );
  };
  return (
    <>
      {showProfileBanner && user?.profile_completion?.applicable && (
        <ProfileCard>
          <CardMetaStyled
            className="p-0"
            style={{ alignItems: 'center' }}
            avatar={renderProfileImage()}
            description={
              isMobile ? (
                <>
                  <Flex gap="16px">
                    <div className="color-gray-dark fz-12 mb-12">
                      <div className="base-color fw-700 fz-14">
                        {tenantUtils.getLocalisedString(user?.profile_completion, 'title')}
                      </div>
                      {tenantUtils.getLocalisedString(user?.profile_completion, 'message')}
                    </div>
                    {user?.profile_completion?.score == 100 && (
                      <Icon size="16px" icon="IoMdClose" onClick={() => hideProfileBanner()} className="p-8" />
                    )}
                  </Flex>
                  {user?.profile_completion?.score < 100 && (
                    <Flex align="center" justify="space-between">
                      <Button
                        type={'link'}
                        size={'small'}
                        className="p-0"
                        style={{ '--ant-control-height-sm': 'auto' }}
                        onClick={() => {
                          profileCompletionModalRef.current && profileCompletionModalRef.current.showModal();
                          whyIsProfileCompletionImportantClickEvent(user, false);
                        }}
                      >
                        {t('Why is this important?')}
                      </Button>

                      <Button
                        type="primary"
                        outlined
                        size="small"
                        onClick={() => {
                          setCompleteProfileModal(true);
                          completeYourProfileClickEvent(user);
                        }}
                        style={{
                          '--btn-bg-color': '#fff',
                          '--btn-content-color': '#006169',
                          '--ant-color-text-light-solid': '#006169',
                        }}
                      >
                        {t('Complete your Profile')}
                      </Button>
                    </Flex>
                  )}
                </>
              ) : (
                <Flex align="center" justify="space-between">
                  <div className="color-gray-dark fz-12">
                    <div className="base-color fw-700 fz-14">
                      {tenantUtils.getLocalisedString(user?.profile_completion, 'title')}
                    </div>
                    {tenantUtils.getLocalisedString(user?.profile_completion, 'message')}
                    {user?.profile_completion?.score < 100 && (
                      <Button
                        type={'link'}
                        size={'small'}
                        className="py-0 px-4"
                        style={{ '--ant-control-height-sm': 'auto' }}
                        onClick={() => {
                          profileCompletionModalRef.current && profileCompletionModalRef.current.showModal();
                          whyIsProfileCompletionImportantClickEvent(user, false);
                        }}
                      >
                        {t('Why is this important?')}
                      </Button>
                    )}
                  </div>
                  {user?.profile_completion?.score < 100 ? (
                    <Button
                      type={'primary'}
                      onClick={() => {
                        setCompleteProfileModal(true);
                        completeYourProfileClickEvent(user);
                      }}
                    >
                      {t('Complete your Profile')}
                    </Button>
                  ) : (
                    <Icon
                      size="20px"
                      icon="IoMdClose"
                      onClick={() => hideProfileBanner()}
                      className="pointer"
                      style={{ marginInlineEnd: '8px' }}
                    />
                  )}
                </Flex>
              )
            }
          />
          <ProfileImportanceModal ref={profileCompletionModalRef} />
          {renderCompleteProfilePopUp()}
        </ProfileCard>
      )}
    </>
  );
};
export default ProfileCompletionBanner;
