import tenantData from '@data';
import { Typography } from 'antd';
import cx from 'clsx';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DrawerModal, Flex } from '../../../../components/common';
import ProfileCompletionList from './profile-completion-list';
import { AvatarStyled, ProgressStyled } from './style';
const { Text } = Typography;

const CompleteProfilePopUp = forwardRef((props, ref) => {
  const [completeProfileModal, setCompleteProfileModal] = useState(false);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);

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
          iconContainerSize={'30px'}
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

  const showCompletionPopUp = () => {
    setCompleteProfileModal(true);
  };

  useImperativeHandle(ref, () => ({ showCompletionPopUp }));

  return (
    <DrawerModal
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
    >
      <div className={cx(isMobile ? 'fz-12' : 'fz-14', 'fw-600  mb-8')}>{t('Profile Completeness')}</div>
      <ProfileCompletionList />
    </DrawerModal>
  );
});
export default CompleteProfilePopUp;
