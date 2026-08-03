import tenantTheme from '@theme';
import { Progress, Typography } from 'antd';
import cx from 'clsx';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Card, Flex } from '../../../../components/common';
import { whyIsProfileCompletionImportantClickEvent } from '../../../../services/analyticsService';
import ProfileCompletionList from './profile-completion-list';
import ProfileImportanceModal from './profile-importance';

const { Text } = Typography;

const ProfileStatusPopUp = () => {
  const { t } = useTranslation();
  const profileCompletionModalRef = useRef();
  const { user } = useSelector((state) => state.app.loginUser);
  const { isMobile } = useSelector((state) => state.app.AppConfig);

  const getProfileProgressColor = (color) => {
    switch (color) {
      case 'high':
        return tenantTheme['success-color'];
      case 'low':
        return tenantTheme['error-color'];
      case 'medium':
        return tenantTheme['warning-color'];
      default:
        return tenantTheme['warning-color'];
    }
  };

  return (
    <Card bodyStyle={{ padding: isMobile ? 16 : 24 }} className={cx(isMobile && 'mb-16')}>
      <Flex align="center" justify="space-between" className="mb-4">
        <Text className="fw-500">{t('Profile Completeness')}</Text>
        <Button
          onClick={() => {
            profileCompletionModalRef.current && profileCompletionModalRef.current.showModal();
            whyIsProfileCompletionImportantClickEvent(user, true);
          }}
          type="link"
          className="mb-0 fz-12 px-0"
        >
          <span className="fz-12">{t('Why is this important?')}</span>
        </Button>
      </Flex>
      <Flex gap="12px" className="mb-16">
        <Progress
          percent={user?.profile_completion?.score}
          showInfo={false}
          strokeColor={getProfileProgressColor(user?.profile_completion?.classification)}
        />
        <span className="fw-600">{user?.profile_completion?.score + '%'}</span>
      </Flex>
      <Flex align="start" gap="8px" vertical>
        <ProfileCompletionList borderWidth={0} cardPadding="4px" />
      </Flex>

      <ProfileImportanceModal ref={profileCompletionModalRef} />
    </Card>
  );
};
export default ProfileStatusPopUp;
