import tenantData from '@data';
import tenantConstants from '@constants';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Avatar, TitleDescriptionWithAnimation } from '../../../../components/common';
import {
  profileCompletionPopUpCancelEvent,
  truBrokerSuccessPopUpCancelClickEvent,
} from '../../../../services/analyticsService';
import { ModalCompletion, ProgressStyled } from './style';
import tenantRoutes from '@routes';
import { useRouteNavigate } from '../../../../hooks';

const ProfileCompletionCongratsModal = forwardRef((props, ref) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const loggedInUser = useSelector((state) => state.app.loginUser);
  const [showProfileData, setShowProfileData] = useState(false);
  const { t } = useTranslation();
  const tapTargets = JSON.parse(localStorage.getItem('tapTargets'));
  const navigate = useRouteNavigate();

  const getCurrentRoute = () => {
    const currentPath = window.location.pathname?.split('/');
    const route = currentPath[currentPath?.length - 1];
    return route;
  };

  const showModal = (completionStatus) => {
    setShowCongratsModal(true);
    completionStatus == 'isProfileCompleted' ? setShowProfileData(true) : setShowProfileData(false);
  };

  useEffect(() => {
    localStorage.setItem(`hideSuccessPopUp_${loggedInUser?.user?.id}`, JSON.stringify(false));
  }, []);

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const handleCancel = () => {
    if (!tapTargets?.lms?.introModal?.hide) {
      localStorage.setItem(`hideSuccessPopUp_${loggedInUser?.user?.id}`, JSON.stringify(true));
      navigate(tenantRoutes.app().dashboard.path);
    }
    setShowCongratsModal(false);
    showProfileData
      ? profileCompletionPopUpCancelEvent(loggedInUser?.user, getCurrentRoute())
      : truBrokerSuccessPopUpCancelClickEvent(loggedInUser?.user);
  };

  const imageWithBadge = () => {
    return (
      <Avatar
        size={54}
        src={loggedInUser?.user?.profile_image}
        showBadge={true}
        iconContainerSize="50px"
        iconSize={20}
        badgeColor={tenantData.getClassificationColor(loggedInUser?.user?.profile_completion?.classification)}
        badgeCount={loggedInUser?.user?.profile_completion?.score + '%'}
        badgeShape={'square'}
        badgeOffset={rtl ? [27, 55] : [-27, 55]}
      />
    );
  };

  const renderUserImage = () => {
    return (
      <ProgressStyled
        size={58}
        type="circle"
        strokeColor={tenantData.getClassificationColor(loggedInUser?.user?.profile_completion?.classification)}
        percent={loggedInUser?.user?.profile_completion?.score}
        format={() => imageWithBadge()}
        style={{ marginBlockEnd: 10 }}
      />
    );
  };

  return (
    <ModalCompletion
      onCancel={handleCancel}
      footer={null}
      visible={showCongratsModal}
      className={!isMobile && 'profile-completion'}
      width={!isMobile ? 490 : undefined}
      height={isMobile && '500'}
    >
      <TitleDescriptionWithAnimation
        title={showProfileData && t('Profile Completed')}
        description={
          showProfileData || !tenantConstants.TRU_BROKER_ENABLED
            ? t('Congratulations, you have successfully completed your profile!')
            : t('Congratulations, you have successfully become a TruBroker™ for the next month!')
        }
        renderImage={renderUserImage}
      />
    </ModalCompletion>
  );
});
export default ProfileCompletionCongratsModal;
