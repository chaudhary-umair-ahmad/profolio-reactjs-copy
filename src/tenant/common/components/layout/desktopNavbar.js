import TenantComponents from '@components';
import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Menu } from 'antd';
import cx from 'clsx';
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Flex, Group, Heading, Icon, Select, Tag } from '../../../../components/common';
import LiteHeaderDropdown from '../../../../components/common/lite-header-dropdown/lite-header-dropdown';
import NavBarNavigationContainer from './navBarNavigationContainer';
import { DropdownItemUpsell, HeaderStyled, ModalPopupStyle } from './styled';
import { areaRangeUnitList, currencyArabicConversionUnitList, getCookieUnits, getLink } from './utils';
import { getLoginPath } from '../../../../utility/utility';
import { StarIconDark } from '../../../../components/svg';
import { useLazyGetUserBookingsQuery } from '../../../../apis/user';

export const DeskTopNavBar = ({
  userData,
  logoutUser,
  locale,
  savedSearches,
  setSavedSearches,
  favouriteProperties,
  showChangeCurrencyModal,
  setShowChangeCurrencyModal,
  showChangeAreaUnitModal,
  setShowChangeAreaUnitModal,
  saveSettings,
  pathLocale,
  toggleLanguage,
  languageObj,
  isFavpropLoading,
  setNoFavPropModal,
  onDeleteSavedSearch,
  setNoSaveSearchModal,
  isAuthenticated,
  fullWidth = false,
  hideLoginButton = false,
  hideSavedSearches = false,
  hideFavouriteProperties = false,
  hideMyListings = false,
  hidePostAd = false,
  hideCurrencyConverter = false,
}) => {
  const { t } = useTranslation();
  const units = getCookieUnits(t);
  const [toSetCurrency, setToSetCurrency] = useState(units.currency);
  const [toSetArea, setToSetArea] = useState(units.area);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(0);
  const { user } = useSelector((state) => state.app.loginUser);
  const [getBookings] = useLazyGetUserBookingsQuery();

  useEffect(() => {
    if (!isAuthenticated || !tenantConstants.MY_BOOKINGS_PATH) return;
    getBookings()
      .unwrap()
      .then((data) => {
        setBookingsCount(typeof data?.total === 'number' && !Number.isNaN(data.total) ? data.total : 0);
      })
      .catch((error) => {
        console.error('Error fetching bookings count:', error);
      });
  }, [isAuthenticated, getBookings]);


  const options = useMemo(
    () => {
      const baseOptions = [
        ...(user?.is_host_user && tenantConstants.HOST_DASHBOARD_PATH
          ? [
            {
              value: getLink(
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t('Host Dashboard')}
                  <Tag
                    color={tenantTheme['danger-color']}
                    style={{
                      '--tag-color': '#fff',
                      '--tag-font-size': '10px',
                      padding: '3px 6px',
                      'border-radius': '16px',
                      fontWeight: 700,
                    }}
                  >
                    {t('NEW')}
                  </Tag>
                </span>,
                tenantConstants.HOST_DASHBOARD_PATH,
                true,
                null,
                locale,
              ),
              key: t('Host Dashboard'),
              external: true,
            },
          ]
          : []),
        {
          value: getLink(t('Become a Business User'), tenantRoutes.app('', false, user)?.prop_shop?.path),
          key: t('Become a Business User'),
        },
        ...(tenantConstants.MY_BOOKINGS_PATH
          ? [
            {
              value: (
                <a href={tenantConstants.MY_BOOKINGS_PATH} className="my-bookings-link">
                  {t('My Bookings')} <span style={{ color: tenantTheme['primary-color'], marginInlineStart: '2px' }}>({bookingsCount})</span>
                </a>
              ),
              key: t('My Bookings'),
              external: true,
            },
          ]
          : []),
        {
          value: getLink(t('Account Settings'), `${tenantRoutes.app('', false, user).settings.route}/user-profile`),
          href: `${tenantRoutes.app('', false, user).settings.route}/user-profile`,
          key: t('Account Settings'),
        },
        {
          value: t('Logout'),
          key: t('Logout'),
          onClick: () => logoutUser(),
        },
      ];
      return baseOptions;
    },
    [locale, user, t, logoutUser, bookingsCount],
  );

  const settingsOptions = useMemo(
    () => [
      { value: t('Change Currency'), onClick: () => setShowChangeCurrencyModal(true) },
      { value: t('Change Area Unit'), onClick: () => setShowChangeAreaUnitModal(true) },
    ],
    [],
  );

  const onCancelSettingPopup = () => {
    if (showChangeCurrencyModal) {
      setShowChangeCurrencyModal(false);
    }
    if (showChangeAreaUnitModal) {
      setShowChangeAreaUnitModal(false);
    }
  };

  const onSaveUnit = () => {
    setShowChangeCurrencyModal(false);
    setShowChangeAreaUnitModal(false);
    const settings = showChangeCurrencyModal ? { currency: toSetCurrency } : { area: toSetArea };
    saveSettings(settings);
  };

  const renderAreaUnitSelector = () => {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Select
          suffixIcon="IoMdArrowDropdown"
          openIcon="IoMdArrowDropdown"
          className="unitSelectDropdown"
          value={toSetArea}
          unit={toSetArea}
          onChange={(value) => setToSetArea(value)}
          style={{ alignItems: 'start' }}
          containerClass="unitSelect"
          options={areaRangeUnitList}
          getOptionValue={(e) => e.slug}
          getOptionLabel={(e) => t(e.alt_label)}
        />
      </div>
    );
  };

  const renderChangeCurrencySelector = () => {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Select
          suffixIcon="IoMdArrowDropdown"
          openIcon="IoMdArrowDropdown"
          className="unitSelectDropdown"
          unit={toSetCurrency}
          onChange={(value) => setToSetCurrency(value)}
          type="price"
          style={{ alignItems: 'start' }}
          options={currencyArabicConversionUnitList}
          value={toSetCurrency}
          getOptionValue={(e) => e.slug}
          getOptionLabel={(e) => e.alt_label}
        />
      </div>
    );
  };

  const renderSettingsPopup = () => {
    return (
      <ModalPopupStyle
        closeIcon={<Icon icon="CgClose" color="#222" size={20} />}
        className="modalHeaderContainer"
        width={400}
        visible={showChangeCurrencyModal || showChangeAreaUnitModal}
        style={{ overlay: { zIndex: 1000 } }}
        onCancel={onCancelSettingPopup}
        footer={null}
        title={
          <Heading as="h2" className="text-center mb-0">
            {showChangeCurrencyModal ? t('Change Currency') : showChangeAreaUnitModal && t('Change Area')}
          </Heading>
        }
      >
        {showChangeCurrencyModal ? (
          renderChangeCurrencySelector()
        ) : showChangeAreaUnitModal ? (
          renderAreaUnitSelector()
        ) : (
          <></>
        )}
        <Button className="saveBtn" type="success" block onClick={onSaveUnit}>
          {t('SAVE')}
        </Button>
      </ModalPopupStyle>
    );
  };

  const renderFavPropertyDropdownUI = () => {
    if (hideFavouriteProperties) return null;

    return (
      <Button
        type="link"
        {...(favouriteProperties.length > 0
          ? { href: `${pathLocale}/favorite-properties.html` }
          : { onClick: () => setNoFavPropModal(true) })}
        className={cx('px-0 nav-links-hover')}
        icon="IconFavourite"
        iconSize="1.28571em"
        // iconColor="#4c4a4a"
        style={{
          marginTop: locale == 'ar' ? '0px' : '-1px',
          marginInlineEnd: locale == 'ar' ? '-3.5px' : '0px',
          marginLeft: locale == 'ar' && '-2px',
        }}
      >
        <div style={{ marginTop: locale == 'ar' && '-2px' }}>
          <span style={{ wordSpacing: locale == 'ar' && '1.5px' }}>{t('Favourite properties')}</span>
          {!isFavpropLoading && (
            <span
              className="text-primary fw-400 currency-text"
              style={{ marginInlineStart: locale == 'ar' ? '4.5px' : '3px' }}
            >
              ({favouriteProperties.length || 0})
            </span>
          )}
        </div>
      </Button>
    );
  };

  const getSavedSearchesDropDownUI = () => {
    if (hideSavedSearches) return null;

    return (
      <LiteHeaderDropdown
        title={
          <div className="navbar-text">
            <span style={{ wordSpacing: locale == 'ar' && '1px' }}> {t('Saved searches')}</span>
            {!savedSearches?.loading && (
              <span
                className="text-primary fw-400 currency-text"
                style={{ marginInlineStart: '3px', color: tenantTheme['primary-color'] }}
              >
                ({savedSearches?.length || 0})
              </span>
            )}
          </div>
        }
        placement={locale === 'ar' ? 'bottomLeft' : 'bottomRight'}
        prefixIcon="TiStar"
        options={savedSearches}
        optionsIcon={'IconTrashCan'}
        color="#4c4a4a"
        width={13}
        className="pointer"
        onOptionsIconClick={onDeleteSavedSearch}
      />
    );
  };

  const renderLoginDropDownUI = () => {
    if (hideLoginButton) return null;

    return isAuthenticated ? (
      <Dropdown
        options={options}
        placement={locale === 'ar' ? 'bottomLeft' : 'bottomRight'}
        prefixIcon="IconLogin"
        prefixIconProps={{ size: '1.28571em', color: 'currentColor' }}
        iconSize="1.28571em"
        className={cx('dropDownSelect', 'languageDropdown', 'userDropdown', 'navbar-text')}
        getOptionLabel={(e) => e?.value}
        getOptionValue={(e) => e?.value}
        suffixIcon="IoMdArrowDropdown"
        suffixIconProps={{
          color: '#4c4a4a',
          size: '1.4em',
          style: { marginInline: -5, marginBlockStart: locale == 'ar' ? 2 : 1 },
        }}
        style={{
          gap: locale == 'ar' ? 8.5 : 8,
          padding: 0,
          marginTop: locale == 'ar' ? '0px' : '-1px',
          marginRight: locale == 'en' && '0.5px',
        }}
        content={
          <>
            <DropdownItemUpsell>
              <Link
                className="user-profile"
                to={tenantRoutes.app('', false, user)?.prop_shop?.path}
                style={{ marginBottom: '7px' }}
              >
                <div className="navbar-text-bold fw-600" style={{ marginInlineStart: '-1px' }}>
                  {t('Are you a Broker/Agency?')}
                </div>
                <Flex
                  className="navbar-text-small text-primary fs12"
                  style={{ lineHeight: '11px', paddingBottom: '1px', marginInlineStart: '-1px' }}
                >
                  {t('Get a Business Package')}
                </Flex>
              </Link>
            </DropdownItemUpsell>
            {options
              .filter((e) => e.key !== t('Become a Business User'))
              .map((e) =>
                e.onClick ? (
                  <Menu.Item key={e?.key} style={{ ...e.style }} onClick={() => e?.onClick()}>
                    <Group template="max-content auto" gap="8px" style={{ alignItems: 'center' }}>
                      {e?.icon && <Icon icon={e.icon} size="1.2em" />}
                      <span className="navbar-text">{e.key}</span>
                    </Group>
                  </Menu.Item>
                ) : e.external ? (
                  <Menu.Item key={e?.key} className="p-0">
                    {e.value}
                  </Menu.Item>
                ) : (
                  <Menu.Item key={e?.key} className="p-0">
                    <Link to={e?.href}>
                      <Group template="max-content auto" gap="0px" style={{ alignItems: 'center' }}>
                        {e?.icon && <Icon icon={e.icon} size="1.2em" />}
                        <span className="navbar-text">{e?.key}</span>
                      </Group>
                    </Link>
                  </Menu.Item>
                ),
              )}
          </>
        }
      >
        <span
          className="navbar-text login-text"
          style={{
            color: '#222',
            marginRight: locale == 'ar' && '-0.5px',
          }}
        >
          {tenantUtils.getLocalisedString(userData, 'name')}
        </span>
      </Dropdown>
    ) : (
      <Button
        className="navbar-text icon-login"
        size="sm"
        variant="link"
        href={getLoginPath()}
        icon="IconLogin"
        iconColor="#006169"
        iconSize="1.28571em"
      >
        {t('Log in')}
      </Button>
    );
  };

  const getSiteSettingsDropDownUI = () => {
    return (
      <Dropdown
        options={settingsOptions}
        placement={locale === 'ar' ? 'bottomRight' : 'bottomLeft'}
        prefixIcon="IconSettings"
        prefixIconProps={{ size: '1.28571em', color: 'currentColor' }}
        rootClassName="p-0"
        className={cx('dropDownSelect', 'languageDropdown', 'fz-12', 'navbar-text')}
        getOptionValue={(item) => item?.value}
        getOptionLabel={(item) => item?.value}
        suffixIcon={null}
        style={{
          gap: 8,
          marginRight: locale == 'ar' && '-3.5px',
          marginTop: locale == 'ar' ? '0px' : '-1px',
        }}
      >
        <div className="fw-400" style={{ marginTop: locale == 'ar' && '-2px', marginRight: locale == 'en' && '3px' }}>
          {t('Site settings')}
        </div>
      </Dropdown>
    );
  };

  const renderDesktopNavUI = () => {
    return (
      <>
        <div className={`navbar-ceiling ${fullWidth ? 'full-width' : ''}`}>
          <Flex
            className="container"
            justify="space-between"
            style={{ alignItems: 'center', marginBottom: locale == 'en' ? '-1px' : '0px' }}
          >
            <Flex gap="20px">
              {languageObj && (
                <a href={toggleLanguage(languageObj.key)} style={{ marginTop: '1px', marginInlineEnd: '7px' }}>
                  <Button
                    className="px-0 languageSwitcher navbar-text"
                    type="link"
                    icon="IconLanguageSwitcher"
                    iconSize="1.428571em"
                    iconColor="#222"
                    style={{
                      gap: '5px',
                      marginInlineStart: '-1px',
                      marginTop: locale == 'ar' && '-1px',
                    }}
                  >
                    {languageObj.labelShort}
                  </Button>
                </a>
              )}
              {!hideCurrencyConverter && getSiteSettingsDropDownUI()}
              {tenantConstants.PITCH_MOBILE_APP && (
                <>
                  <Button
                    className="px-0 navbar-text"
                    type="link"
                    icon="IconMobilePhone"
                    iconColor="#4c4a4a"
                    onClick={() => {
                      setModalVisible(true);
                    }}
                    style={{ gap: locale == 'ar' ? '7.5px' : '8px', marginRight: locale == 'ar' && '3.5px' }}
                  >
                    <div style={{ wordSpacing: locale == 'ar' && '1.5px', marginTop: locale == 'ar' && '-2px' }}>
                      {t('Download App')}
                    </div>
                  </Button>
                  <TenantComponents.DownloadAppModal visible={modalVisible} onClose={() => setModalVisible(false)} />
                </>
              )}
            </Flex>
            <Flex gap={locale == 'ar' ? '24px' : '22px'} style={{ alignItems: 'center', marginTop: '0px' }}>
              {renderFavPropertyDropdownUI()}
              {/* to be implemented yet */}

              {tenantConstants.SAVED_SEARCHES_ENABLED && !hideSavedSearches && (
                <>
                  {savedSearches?.length > 0 ? (
                    getSavedSearchesDropDownUI()
                  ) : (
                    <>
                      <Button
                        className="px-0 navbar-text"
                        onClick={setNoSaveSearchModal}
                        icon="StarIconDark"
                        iconSize="18px"
                        type={'link'}
                        iconColor="currentColor"
                        style={{
                          marginTop: locale == 'ar' ? '0px' : '-1px',
                          marginInlineEnd: locale == 'ar' ? '-2.5px' : '-1px',
                        }}
                      >
                        <div style={{ marginTop: locale == 'ar' && '-2px' }}>
                          <span style={{ wordSpacing: locale == 'ar' && '1.5px' }}> {t('Saved searches')}</span>

                          {!savedSearches?.loading && (
                            <span
                              className="text-primary fw-400 currency-text"
                              style={{ marginInlineStart: locale == 'ar' ? '4px' : '2.5px' }}
                            >
                              ({savedSearches?.length || 0})
                            </span>
                          )}
                        </div>
                      </Button>
                    </>
                  )}
                </>
              )}
              {!hideMyListings && (
                <Link to="/listings">
                  <Button
                    className="px-0 navbar-text"
                    type="link"
                    icon="IconListings"
                    iconSize="1.428571em"
                    iconColor="#4c4a4a"
                    style={{
                      gap: '7px',
                      marginTop: locale == 'ar' ? '0px' : '-1px',
                      marginInlineEnd: locale == 'ar' ? '-1.4px' : '1px',
                    }}
                  >
                    <span style={{ marginTop: locale == 'ar' && '-2px' }}>{t('My Listings')}</span>
                  </Button>
                </Link>
              )}
              {renderLoginDropDownUI()}
            </Flex>
          </Flex>
        </div>
        <NavBarNavigationContainer locale={locale} fullWidth={fullWidth} hidePostAd={hidePostAd} />
      </>
    );
  };

  return (
    <HeaderStyled $fullWidth={fullWidth}>
      {renderSettingsPopup()}
      {renderDesktopNavUI()}
    </HeaderStyled>
  );
};
