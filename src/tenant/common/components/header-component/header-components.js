import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Icon, Popover, TextInput } from '../../../../components/common';
import NotificationCentre from '../../../../components/notification-center/notification-center';
import { useGetLocation, useRouteNavigate } from '../../../../hooks';
import { addPropertyEvent, downloadAppButtonClick } from '../../../../services/analyticsService';
import DownloadAppModal from '../downloadAppModal/downloadAppModal';
import HeaderLink from '../headerLink/headerLink';
import { AtbdTopDropdwon } from './style';
import { getLocaleForURL } from '../../../../utility/language';

const HeaderComponent = () => {
  const { t } = useTranslation();
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const user = useSelector((state) => state.app.loginUser.user);
  const { pathname: path } = useGetLocation();
  const currentPathSlug = path.split('/').pop();
  const navigate = useRouteNavigate();
  const [value, setValue] = useState('');
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [modal, setModal] = useState(false);

  const onSearch = () => {
    navigate(`${tenantRoutes.app().listings.path}?q[listing_id_eq]=${value}`);
  };

  const content = (
    <AtbdTopDropdwon
      className="search-widget grid align-items-center"
      style={{ '--template': 'auto auto', gap: '10px' }}
    >
      <TextInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('Search By ID')}
        prefixIcon="BiSearch"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSearch(e.target.value);
          }
        }}
        autoFocus
      />
      <Button type="primary" size="large" onClick={onSearch} style={{ height: '40px' }}>
        {t('Search')}
      </Button>
    </AtbdTopDropdwon>
  );

  const renderNotificationCenter = () => {
    return (
      tenantConstants.NOTIFICATION_CENTER_ENABLED &&
      user?.push_notifications?.value == 'enabled' && <NotificationCentre />
    );
  };

  return (
    <>
      {!isMobile ? (
        <>
          {tenantConstants.PITCH_MOBILE_APP && (
            <>
              <Button
                className="px-0"
                type="link"
                icon="MdPhoneIphone"
                iconSize="1.3em"
                onClick={() => {
                  setModal(true);
                  downloadAppButtonClick(user);
                }}
              >
                {t('Download App')}
              </Button>
              <DownloadAppModal visible={modal} onClose={() => setModal(false)} />
            </>
          )}
          <HeaderLink variant="headerPill" />

          <Button
            type="primary"
            icon="PostListingIcon"
            onClick={() => {
              window.location.href = `${getLocaleForURL()}${tenantRoutes.app('', false, user).post_listing.path}`;
              addPropertyEvent(user, currentPathSlug, false);
            }}
          >
            {t('Post Listing')}
          </Button>
          {renderNotificationCenter()}
        </>
      ) : (
        renderNotificationCenter()
      )}
      {tenantConstants.SHOW_SEARCH_HEADER && (
        <>
          <Popover placement={rtl ? 'bottomLeft' : 'bottomRight'} content={content} action="click">
            <Button type="default" style={{ paddingInline: '.65em', alignSelf: 'stretch' }}>
              <Icon icon="BiSearch" />
            </Button>
          </Popover>
        </>
      )}
    </>
  );
};

export default HeaderComponent;
