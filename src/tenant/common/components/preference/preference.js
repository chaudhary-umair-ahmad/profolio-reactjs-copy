import TenantComponents from '@components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetProfileDetailsQuery,
  useUpdatePushNotificationsMutation,
  useUpdateUserPreferencesMutation,
} from '../../../../apis/user';
import { Card, Group, LoaderWrapper, Switch, notification } from '../../../../components/common';
import tenantConstants from '@constants';
import { getErrorString } from '../../../../utility/utility';
import { isLiteExperienceURL } from '../../../../utility/general';

const buildUserSettingRow = (setting, settingValue) => {
  if (setting?.id == null || setting?.setting_id == null) return null;
  return {
    id: setting.id,
    setting_id: setting.setting_id,
    setting_value: settingValue,
  };
};

const UserPreference = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [smartCreditsModalVisible, setSmartCreditsTopUpModalVisible] = useState(false);
  const dispatch = useDispatch();

  const {
    data,
    isLoading: loading,
    isFetching: fetching,
    refetch: fetchProfileData,
    error,
  } = useGetProfileDetailsQuery(user?.id, {
    skip: !user?.id,
    refetchOnMountOrArgChange: true,
  });

  const [updatePreferences, { isLoading: updatingPreferences }] = useUpdateUserPreferencesMutation();
  const [updatePushNotifications, { isLoading: pushNotificationToggleLoading }] = useUpdatePushNotificationsMutation();
  const [updateImageAndDetailsUsage, { isLoading: imageAndDetailsUsageLoading }] = useUpdatePushNotificationsMutation();

  const onToggleSmartCredit = async () => {
    const response = await updatePreferences(user?.id);
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        notification.success(response?.data?.message);
        fetchProfileData();
      }
    }
  };

  const onTogglePushNotification = async (pushNotificationValue) => {
    const newValue = pushNotificationValue == 'enabled' ? 'disabled' : 'enabled';
    const row = buildUserSettingRow(user?.push_notifications, newValue);
    if (!row) {
      notification.error(t('Unable to update preference. Please refresh and try again.'));
      return;
    }
    const payload = { user_settings_attributes: [row] };
    const response = await updatePushNotifications({ userId: user?.id, payload });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        notification.success(response?.data?.message);
      }
    }
  };

  const onToggleImageAndDetailsUsage = async (currentValue) => {
    const row = buildUserSettingRow(user?.image_detail_usage, currentValue);
    if (!row) {
      notification.error(t('Unable to update preference. Please refresh and try again.'));
      return;
    }
    const payload = { user_settings_attributes: [row] };
    const response = await updateImageAndDetailsUsage({ userId: user?.id, payload });
    if (response) {
      if (response.error) {
        notification?.error(getErrorString(response?.error));
      } else {
        notification.success(response?.data?.message || t('Preference updated successfully'));
      }
    }
  };

  return (
    <Card bodyStyle={{ padding: isMobile ? 16 : 40 }}>
      <LoaderWrapper loading={fetching}>
        <Group>
          {tenantConstants.ENABLE_SMART_CREDITS_UTILISATION && !isLiteExperienceURL() && (
            <Switch
              rowWrap={false}
              label={t('Smart Credit Utilization')}
              labelSuffix={
                <TenantComponents.SmartCreditsUtilizationModal
                  visible={smartCreditsModalVisible}
                  setVisible={setSmartCreditsTopUpModalVisible}
                  btnType={'info'}
                  readOnly
                />
              }
              desc={t(
                'Turn on this to ensure that your expiring credits are smartly utilized to boost your property listings',
              )}
              value={user?.is_auto_utilization_enabled}
              onChange={onToggleSmartCredit}
              disabled={user?.user_role_within_agency == 'staff'}
              loading={updatingPreferences}
            />
          )}
          {tenantConstants.NOTIFICATION_CENTER_ENABLED && (
            <Switch
              rowWrap={false}
              label={t('Push Notification')}
              desc={t('Allow to receive push notifications')}
              value={user?.push_notifications?.value == 'enabled' ? true : false}
              onChange={() => {
                onTogglePushNotification(user?.push_notifications?.value);
              }}
              loading={pushNotificationToggleLoading}
            />
          )}
          {tenantConstants.TRUBROKER_PREFERENCE_ENABLED && (
            <Switch
              rowWrap={false}
              label={t('Image and Details Usage')}
              desc={t('Allow Bayut to use your images and details in TruBrokerTM marketing campaign across TV and digital channels')}
              value={user?.image_detail_usage?.value == 'enabled' ? true : false}
              onChange={() => {
                onToggleImageAndDetailsUsage(user?.image_detail_usage?.value === 'enabled' ? "disabled" : "enabled");
              }}
              loading={imageAndDetailsUsageLoading}
            />
          )}
        </Group>
      </LoaderWrapper>
    </Card>
  );
};

export default UserPreference;
