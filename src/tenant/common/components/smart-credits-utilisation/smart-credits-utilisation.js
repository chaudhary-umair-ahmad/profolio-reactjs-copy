import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, CustomCard, DrawerModal, Group, notification } from '../../../../components/common';
import { useUpdateUserPreferencesMutation } from '../../../../apis/user';

const SmartCreditsUtilizationModal = (props) => {
  const { visible, setVisible, btnType, readOnly } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [updatePreferences, { isLoading: updatingPreferences }] = useUpdateUserPreferencesMutation();

  const modalContent = useMemo(
    () => [
      {
        id: 1,
        backgroundColor: '#FCF7F1',
        icon: 'BsGraphUpArrow',
        heading: 'Maximize Value',
        content:
          'Credits expiring at the end of the month will be automatically utilized to ensure you get the maximum value from them.',
      },
      {
        id: 2,
        backgroundColor: '#EBF5FF',
        icon: 'HiOutlineRocketLaunch',
        heading: 'Boost Listings Visibility',
        content:
          'Your active listings will be automatically upgraded and refreshed to reach more potential buyers or renters.',
      },
      {
        id: 3,
        backgroundColor: '#ECF7F0',
        icon: 'CreditUsedIcon',
        heading: 'Smart Credits Utilization',
        content:
          'Our intelligent system works efficiently, using your credits to give your listings a fresh look effortlessly.',
      },
    ],
    [],
  );
  const onConfirmModal = async () => {
    setLoading(true);
    const response = await updatePreferences(user?.id);
    if (response) {
      setLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        notification.success(t('Smart Credit Utilization activated successfully!'));
        setVisible(false);
      }
    }
  };

  const renderButton = () => {
    return btnType === 'info' ? (
      <Button
        onClick={() => setVisible(true)}
        shape="circle"
        icon={'AiOutlineInfoCircle'}
        iconSize="14px"
        style={{ '--btn-bg-color': 'transparent' }}
        iconColor={tenantTheme['link-color']}
        size="small"
        className="btn-icon-size"
      />
    ) : (
      <Button
        className="p-0"
        type="link"
        onClick={() => setVisible(true)}
        style={{ textDecoration: 'underline', fontSize: isMobile && '12px' }}
      >
        {t('Activate Smart Credit Utilization')}
      </Button>
    );
  };
  const renderAlert = () => {
    return (
      <Alert
        type="warning"
        showIcon
        message={
          <>
            {t('If you prefer not to automatically use your expiring credits, you can deactivate this feature in your')}{' '}
            <Link style={{ textDecoration: 'underline' }} to={`${tenantRoutes.app().settings.route}/preferences`}>
              {t('User Preferences')}
            </Link>
          </>
        }
        isMobile={isMobile}
        className={isMobile && 'fz-12'}
      />
    );
  };
  return (
    <>
      {renderButton()}
      <DrawerModal
        title={t('Smart Credits Utilization')}
        width={810}
        height={600}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onConfirmModal}
        okText={t('Activate')}
        bodyStyle={{ padding: '20px' }}
        loading={loading}
        footer={readOnly && null}
      >
        <Group template={isMobile ? 'initial' : 'repeat(3, 1fr)'} gap="14px" className="mb-20">
          {modalContent.map((item, i) => (
            <React.Fragment key={i}>
              <CustomCard
                avatarIcon={item.icon}
                title={t(item.heading)}
                titleClass={'text-primary  mb-0'}
                description={t(item.content)}
                cardBackground={tenantTheme['primary-light-4']}
                iconProps={{ color: tenantTheme['primary-color'] + 'aa' }}
              />
            </React.Fragment>
          ))}
        </Group>
        {!readOnly && renderAlert()}
      </DrawerModal>
    </>
  );
};

export default SmartCreditsUtilizationModal;
