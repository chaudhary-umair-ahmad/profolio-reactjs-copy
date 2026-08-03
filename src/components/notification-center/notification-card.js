import tenantTheme from '@theme';
import tenantUtils from '@utils';
import cx from 'clsx';
import React from 'react';
import { TIME_DATE_FORMAT } from '../../constants/formats';
import { getDateStringToShow, getTimeDateString } from '../../utility/date';
import { Divider } from '../common';
import { NotificationsWrapper } from './styled';
import { Text } from '../common';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar';
dayjs.extend(relativeTime);

const NotificationCard = ({ item, onClick = () => {} }) => {
  const { locale } = useSelector((state) => state.app.AppConfig);
  const webUrl = item?.landing_pages?.web;
  const redirectUrl = locale == 'en' ? webUrl?.en : webUrl?.ar;

  return (
    <div className="mb-4">
      <NotificationsWrapper
        className={cx('notification-center', 'pointer')}
        avatarIcon="IconReload"
        iconProps={{ color: !item?.is_read && tenantTheme['primary-color'] }}
        iconSize={20}
        title={tenantUtils.getLocalisedString(item, 'title')}
        description={tenantUtils.getLocalisedString(item, 'message')}
        cardBackground={!item?.is_read && tenantTheme['primary-light']}
        hideExternalLink={true}
        borderWidth="0"
        extraContent={
          <Text className={'text-muted'} style={{ fontSize: '12px' }}>
            {getDateStringToShow(item?.created_at, locale, dayjs)}
          </Text>
        }
        padding={12}
        cardPadding="12px"
        link={redirectUrl}
        onClick={() => {
          if (!item?.is_read) {
            onClick(item?.id);
          }
        }}
        anchorClass={'hoverLink'}
        anchorStyle={false}
        alignItems={'start'}
        descriptionStyles={{ maxWidth: '50ch', wordBreak: 'break-word' }}
      />
      {item?.is_read && <Divider variant="dashed" style={{ marginBlock: 0 }} />}
    </div>
  );
};

export default NotificationCard;
