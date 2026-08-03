import tenantConstants from '@constants';
import { Badge, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useGetUserNotificationsCountQuery,
  useLazyGetUserNotificationsDataQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from '../../apis/user';
import { Button, EmptyState, Flex, LoaderWrapper, notification } from '../common';
import DrawerPopover from '../common/drawerPopover/drawerPopover';
import { InfiniteScroll } from '../common/infinite-scroll/infinite-scroll';
import NotificationCard from './notification-card';
const { Title } = Typography;

const NotificationCentre = () => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { rtl } = useSelector((state) => state.app.AppConfig);
  const { user } = useSelector((state) => state.app.loginUser);
  const [visible, setVisible] = useState(false);
  const [notificationsData, setNotificationsData] = useState(null);
  const [getUserNotificationsData, { isFetching: notificationsFetching }] = useLazyGetUserNotificationsDataQuery();
  const { data: notificationCount } = useGetUserNotificationsCountQuery(
    {},
    { refetchOnMountOrArgChange: true, skip: !tenantConstants.NOTIFICATION_CENTER_ENABLED },
  );
  const [markAsRead, { isError }] = useMarkAsReadMutation();
  const [markAllAsRead, { isError: markAllAsReadError }] = useMarkAllAsReadMutation();

  const [paginationData, setPaginationData] = useState(null);

  const handleVisibleChange = (isVisible) => {
    setVisible(isVisible);
  };

  const markNotificationAsRead = async (id) => {
    const response = await markAsRead({ notificationId: id });
    if (response) {
      if (response?.error) {
        notification.error(response?.error);
      } else {
        setNotificationsData((prevData) =>
          prevData?.map((notif) => (notif?.id === id ? { ...notif, is_read: true } : notif)),
        );
      }
    }
  };

  const markAllNotificationsAsRead = async () => {
    const response = await markAllAsRead();
    if (response) {
      if (response?.error) {
        notification.error(response?.error);
      } else {
        setNotificationsData((prevData) => prevData?.map((notif) => ({ ...notif, is_read: true })));
      }
    }
  };

  const fetchNotifications = async (page = 1, updateList = false) => {
    const response = await getUserNotificationsData({ page: page, userId: user?.id });
    if (response) {
      if (response?.error) {
        notification.error(response?.error);
      } else {
        setNotificationsData((prev) => {
          const updated_response = response?.data?.notifications?.map((item, index) => ({
            ...item,
            key: prev?.length ? response?.data?.pagination?.current_page * 10 + index : index,
          }));
          return prev?.length && !!updateList ? [...prev, ...updated_response] : updated_response;
        });
        setPaginationData(response?.data?.pagination);
      }
    }
  };

  const renderNotificationsHeader = () => {
    return (
      <Flex gap="20px" justify="space-between" className={'mb-8'}>
        <Flex align="center">
          <Title level={5} className="mb-0">
            {t('Notifications')}
          </Title>
          <Button icon={'IoRefreshSharp'} style={{ border: 'none' }} onClick={() => fetchNotifications(1)} />
        </Flex>
        {notificationsData?.length > 0 && (
          <Button type={'link'} onClick={() => markAllNotificationsAsRead()}>
            {t('Mark all as read')}
          </Button>
        )}
      </Flex>
    );
  };

  const notificationContent = (
    <LoaderWrapper loading={notificationsFetching}>
      <div style={{ padding: isMobile ? 4 : 16, width: !isMobile && '590px' }}>
        {!isMobile && renderNotificationsHeader()}
        <>
          {!notificationsData || notificationsData?.length == 0 ? (
            <EmptyState
              title={'No notifications found'}
              message={'Your notifications will appear here'}
              onClick={() => {
                fetchNotifications(1);
              }}
              buttonLoading={notificationsFetching}
              type={'table'}
              hideRetryButton={true}
            ></EmptyState>
          ) : (
            <InfiniteScroll
              CardComponent={({ item, loading }) => (
                <NotificationCard
                  item={item}
                  onClick={(notificationId) => {
                    markNotificationAsRead(notificationId);
                  }}
                  loading={loading}
                />
              )}
              itemKey="key"
              dataList={notificationsData}
              containerOffset={200}
              requestOffset={340}
              fetchFunction={(page) => fetchNotifications(page, true)}
              loading={notificationsFetching}
              nextPage={paginationData?.next_page}
            />
          )}
        </>
      </div>
    </LoaderWrapper>
  );

  return (
    <DrawerPopover
      content={notificationContent}
      onCancel={() => setVisible(false)}
      overlayInnerStyle={{ padding: 0 }}
      overlayClassName="menu-main"
      onOpenChange={handleVisibleChange}
      action="click"
      visible={visible}
      footer={null}
      title={renderNotificationsHeader()}
      height={'500'}
      placement={isMobile ? 'bottom' : 'bottomLeft'}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0,
          ...(isMobile ? {} : { height: 34 }),
        }}
      >
        <Badge
          count={notificationCount?.stats?.unread_notifications_count || 0}
          color="red"
          offset={rtl ? [14, -0] : [-14, -0]}
        >
          <Button
            icon="GrNotification"
            onClick={() => {
              setVisible(true);
              fetchNotifications();
            }}
            style={{ border: 'none' }}
          />
        </Badge>
      </div>
    </DrawerPopover>
  );
};

export default NotificationCentre;
