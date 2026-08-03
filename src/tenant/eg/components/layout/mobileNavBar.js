import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Divider, Radio } from 'antd';
import cx from 'clsx';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button, Flex, Icon, Image, Select } from '../../../../components/common';
import LiteSidebarDrawer from '../../../../components/common/lite-sidebar-drawer/lite-sidebar-drawer';
import { RadioPill } from '../../../../components/common/radio-button/styled';
import {
  BayutAppStoreArabicIcon,
  BayutPlayStoreArabicIcon,
  ProfolioLogoLite,
  ProfolioLogoLiteAr,
} from '../../../../components/svg';
import { BayutAppStoreIcon, PlayStoreBadgeIcon } from '../../../../components/utilities/icons';
import { addPropertyEvent } from '../../../../services/analyticsService';
import { getBaseURL, getClassifiedBaseURL } from '../../../../utility/env';
import { isAndroid } from '../../../../utility/general';
import { getCurrentLocationPath } from '../../../../utility/utility';
import {
  CompanyInfo,
  CountryDropdown,
  DrawerContainer,
  DropdownItemUpsell,
  ModalPopupStyle,
  PillStyled,
  SideMenuContainer,
  UserDetail,
} from './styled';
import { areaRangeUnitList, currencyArabicConversionUnitList, getCookieUnits, getLink } from './utils';

export const MobileNavBar = ({
  userData,
  logoutUser = () => {},
  localeData,
  countryList,
  locale,
  savedSearches,
  setSavedSearches,
  saveSettings,
  pathLocale,
  favouriteProperties,
  toggleLanguage,
  setNoFavPropModal,
  onDeleteSavedSearch,
  setNoSaveSearchModal,
}) => {
  const IS_ANDROID = isAndroid();
  const { t } = useTranslation();
  const styles = {};
  const settings = getCookieUnits(t);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState({ company: false, country: false });
  const [showSiteSettingsModalMobile, setShowSiteSettingsModalMobile] = useState(false);
  const [toSetCurrency, setToSetCurrency] = useState(settings.currency);
  const [toSetArea, setToSetArea] = useState(
    areaRangeUnitList.find((it) => it.slug_strat === settings.area) || settings.area,
  );
  const { user } = useSelector((state) => state.app.loginUser);

  const drawerRef = useRef();

  const { rtl } = useSelector((state) => state?.app.AppConfig);
  const location = useLocation();

  const openDrawer = () => {
    savedSearches?.length > 0 ? drawerRef?.current && drawerRef?.current?.openDrawer() : setNoSaveSearchModal(true);
  };

  const basicDetails = [
    {
      key: 'account',
      text: getLink(t('Account Settings'), `${tenantRoutes.app('', false, user).settings.route}/user-profile`),
      onClick: () => setDrawerOpen(false),
    },
    {
      key: 'savesSearches',
      text: getLink(t('Saved searches')),
      onClick: () => {
        setDrawerOpen(false);
        openDrawer();
      },
      icon: 'IconStar',
      color: '#f7c800',
      size: '24px',
    },
    {
      key: 'favProperties',
      text:
        favouriteProperties?.length > 0
          ? getLink(t('Favourite Properties'), `/favorite-properties.html`, true, null, locale)
          : t('Favourite Properties'),
      onClick: () => {
        setDrawerOpen(false);
        if (!favouriteProperties?.length > 0) {
          setNoFavPropModal(true);
        }
      },
      icon: 'BiSolidHeart',
      color: '#F05555',
    },

    {
      key: 'listings',
      text: getLink(t('My Listings'), tenantRoutes.app().listings.path),
      icon: 'IconListings',
      onClick: () => setDrawerOpen(false),
    },

    {
      key: 'logout',
      text: t('Logout'),
      onClick: () => logoutUser(),
    },
  ];

  const renderSavedSearchesModalUI = () => {
    return (
      <LiteSidebarDrawer
        title={t('Saved searches')}
        placement={rtl ? 'left' : 'right'}
        options={savedSearches}
        sidebarDrawerRef={drawerRef}
        icon={'IconTrashCan'}
        color="#4c4a4a"
        width={14}
        height={16}
        onIconClick={onDeleteSavedSearch}
      />
    );
  };

  const additionals = [
    {
      key: 'blog',
      text: (
        <a style={{ color: tenantTheme['dark-color'] }} href={`${getClassifiedBaseURL()}/myblog${pathLocale}`}>
          <Image
            src={
              locale === 'en'
                ? `${getBaseURL()}/profolio-assets/images/bayut-blog-en-logo.png`
                : `${getBaseURL()}/profolio-assets/images/bayut-blog-ar-logo.png`
            }
            style={{ width: '72px', paddingBlockStart: '4px' }}
          />
        </a>
      ),
      style: { lineHeight: '48px', fontWeight: '700', fontSize: '18px' },
    },
    // {
    //   key: 'agencies',
    //   text: getLink(t('Find an Agency'), `/companies`, true, null, locale),
    //   style: { lineHeight: '48px', fontWeight: '700', fontSize: '18px' },
    // },
    {
      key: 'company',
      text: t('Company'),
      onClick: () => setCollapsed((prev) => ({ ...prev, company: !prev?.company })),
      icon: 'IoIosArrowDown',
      style: { lineHeight: '48px', fontWeight: '700', fontSize: '18px' },
      className: collapsed.company && 'active',
    },
    ...(collapsed?.company
      ? [
          // {
          //   key: 'helpSupport',
          //   text: (
          //     <a style={{ color: tenantTheme['dark-color'] }} href={`https://help.bayut.sa/hc/${locale}`}>
          //       {t('Help & Support')}
          //     </a>
          //   ),
          //   style: { lineHeight: 'normal', fontWeight: '400', paddingBlock: '8px' },
          // },
          {
            key: 'aboutUs',
            text: getLink(t('About Us'), `/about/aboutus.html`, true, null, locale),
            style: { lineHeight: 'normal', fontWeight: '400', paddingBlock: '8px' },
          },
          {
            key: 'contactUs',
            text: getLink(t('Contact Us'), `/contactus.html`, true, null, locale),
            style: { lineHeight: 'normal', fontWeight: '400', paddingBlock: '8px' },
          },
          {
            key: 'terms',
            text: getLink(t('Terms of Use'), `/terms.html`, true, null, locale),
            style: { lineHeight: 'normal', fontWeight: '400', paddingBlock: '8px' },
          },
          {
            key: 'privacy',
            text: getLink(t('Privacy Policy'), `/privacy.html`, true, null, locale),
            style: { lineHeight: 'normal', fontWeight: '400', paddingBlock: '8px' },
          },
        ]
      : []),
  ];

  const countries = [
    {
      key: 'country',
      text: t('Change Country'),
      onClick: () => {
        setCollapsed((prev) => ({ ...prev, country: !prev?.country }));
      },
      icon: 'IoIosArrowDown',
      className: collapsed.country ? 'countryDropDownBtn active' : 'countryDropDownBtn',
      size: '18px',
    },
    ...(collapsed?.country
      ? countryList.map((e) => ({
          ...e,
          text: getLink(tenantUtils.getLocalisedString(e, 'title'), e?.href, true, null, '', true),
          className: 'countryMap',
        }))
      : []),
  ];

  const onCancelSettingsPopup = () => {
    setToSetCurrency(settings.currency);
    setToSetArea(settings.area);
    return setShowSiteSettingsModalMobile(false);
  };

  const onSaveSettings = (e) => {
    e.preventDefault();
    saveSettings({ currency: toSetCurrency, area: toSetArea });
    setShowSiteSettingsModalMobile(false);
  };

  const renderChangeAreaUnitSelector = () => {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Select
          value={toSetArea}
          getOptionLabel={(e) => t(e.alt_label)}
          getOptionValue={(e) => e.slug}
          suffixIcon="IoMdArrowDropdown"
          openIcon="IoMdArrowDropdown"
          className="unitSelectDropdown"
          onChange={(value) => setToSetArea(value)}
          type="area"
          style={{ alignItems: 'start' }}
          containerClass={styles.unitSelect}
          showIconDown={false}
          options={areaRangeUnitList}
        />
      </div>
    );
  };

  const renderChangeCurrencySelector = () => {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <Select
          value={toSetCurrency}
          getOptionLabel={(e) => e.alt_label}
          getOptionValue={(e) => e.slug}
          suffixIcon="IoMdArrowDropdown"
          openIcon="IoMdArrowDropdown"
          className="unitSelectDropdown"
          onChange={(value) => setToSetCurrency(value)}
          type="price"
          style={{ alignItems: 'start' }}
          containerClass={styles.unitSelect}
          showIconDown={false}
          options={currencyArabicConversionUnitList}
        />
      </div>
    );
  };

  const renderSiteSettingsUIMobile = () => {
    return (
      <ModalPopupStyle
        closeIcon={<Icon icon="CgClose" color="#222" size={20} />}
        visible={showSiteSettingsModalMobile}
        width={300}
        style={{ overlay: { zIndex: 1000 } }}
        onCancel={onCancelSettingsPopup}
        className={styles.currencyContainer}
        title={t('Change Settings')}
        footer={null}
      >
        <div>
          <div className="mb-8" style={{ fontSize: '13px' }}>
            {t('Change Currency')}
          </div>
          {renderChangeCurrencySelector()}
          <div className="mb-8" style={{ fontSize: '13px' }}>
            {t('Change Area Unit')}
          </div>
          {renderChangeAreaUnitSelector()}
        </div>
        <Button
          block
          type="success"
          onClick={onSaveSettings}
          variant=""
          className="saveBtn"
          style={{ fontSize: '13px' }}
        >
          {t('SUBMIT')}
        </Button>
      </ModalPopupStyle>
    );
  };

  const renderPostAd = () => {
    return (
      <Button
        type="success"
        icon="MdAddLocationAlt"
        size="large"
        block
        href={`${pathLocale}/post-listing`}
        onClick={() => {
          addPropertyEvent(user, getCurrentLocationPath(location), false);
        }}
      >
        {t('Post a Listing')}
      </Button>
    );
  };

  const renderChangeLang = () => {
    return (
      <PillStyled className="mainContainer">
        <div className="mb-8 fw-700 fz-18">{t('Change site language')}</div>
        <div>
          <Flex justify="space-around" className="languageSwitchPill">
            <Radio.Group
              className="w-100 d-flex"
              style={{ gap: '8px' }}
              shape="round"
              onChange={(e) => {
                window.location.href = toggleLanguage(e.target.value);
              }}
              value={locale}
            >
              {localeData.map((btn) => (
                <RadioPill
                  color="#28b16d"
                  shape="round"
                  className="w-100  justify-content-center"
                  value={btn.value}
                  key={btn.value}
                  style={{ height: '40px' }}
                >
                  {btn.label}
                </RadioPill>
              ))}
            </Radio.Group>
          </Flex>
        </div>
      </PillStyled>
    );
  };

  const renderBasicDetails = () => {
    return (
      <UserDetail className="userDetails mb-24">
        <div className="align-center-v mb-24 fz-18 fw-700" style={{ gap: '8px' }}>
          <Icon icon="IconLogin" color="#4c4a4a" size={20} />
          {tenantUtils.getLocalisedString(userData, 'name')}
        </div>
        <DropdownItemUpsell className="mb-16" as="div">
          <Link
            className="p-12"
            to={tenantRoutes.app('', false, user).prop_shop.path}
            onClick={() => setDrawerOpen(false)}
            style={{ display: 'block', borderRadius: 6 }}
          >
            <div className="fw-700">{t('Are you a Broker/Agency?')}</div>
            <Flex className="text-primary fz-12">{t('Get a Business Package')}</Flex>
          </Link>
        </DropdownItemUpsell>
        {basicDetails.map((e) => (
          <Flex
            key={e?.key}
            justify="space-between"
            align="center"
            className="mb-16 fz-16 pointer"
            onClick={e?.onClick}
          >
            {e?.text}
            <Icon icon={e?.icon} size={e?.size || 20} color={e?.color} />
          </Flex>
        ))}
        <Divider />
      </UserDetail>
    );
  };

  const renderAdditionals = () => {
    return additionals.map((e) => (
      <CompanyInfo
        justify="space-between"
        align="center"
        key={e?.key}
        className={cx('fz-16 pointer ', e?.className)}
        style={e?.style}
        onClick={e?.onClick}
      >
        {e?.text}
        <Icon icon={e?.icon} size={18} color="#222" />
      </CompanyInfo>
    ));
  };

  const renderCountries = () => {
    return countries.map((e) => (
      <CountryDropdown
        align="center"
        gap="8px"
        key={e?.key}
        className={cx('countrydropdown pointer', e?.className)}
        onClick={e?.onClick}
      >
        <Icon icon={e?.icon} size={e?.size} color="#222" className={e?.className} />
        <div className="fz-16" style={e?.style}>
          {e?.text}
        </div>
      </CountryDropdown>
    ));
  };

  const renderBayutApp = () => {
    const link = IS_ANDROID
      ? tenantConstants.APP_LOGO.linkPlayStore?.[locale]
      : tenantConstants.APP_LOGO.linkIos?.[locale];
    return (
      <div className="fw-700 fz-18 mbe-16" style={{ paddingTop: '28px', paddingBottom: '8px' }}>
        {t('Download the Bayut app:')}
        <a style={{ display: 'block', marginBlockStart: '14px' }} href={link}>
          {IS_ANDROID ? (
            locale === 'en' ? (
              <PlayStoreBadgeIcon width="132" height="44" />
            ) : (
              <BayutPlayStoreArabicIcon width="132" height="44" />
            )
          ) : locale === 'en' ? (
            <BayutAppStoreIcon width="132" height="44" />
          ) : (
            <BayutAppStoreArabicIcon width="132" height="44" />
          )}
        </a>
      </div>
    );
  };

  const renderSideBar = () => {
    return (
      <SideMenuContainer
        width={312}
        title={
          <Flex justify="space-between" className="align-center-v">
            <Button
              type="link"
              iconColor="#006169"
              iconSize="22px"
              icon="IoSettingsSharp"
              onClick={() => {
                setDrawerOpen(false);
                setShowSiteSettingsModalMobile(true);
              }}
            />

            <Button type="link" iconColor="#222" iconSize="20px" icon="CgClose" onClick={() => setDrawerOpen(false)} />
          </Flex>
        }
        placement={locale === 'en' ? 'left' : 'right'}
        closable={false}
        onClose={() => {
          setDrawerOpen(false);
        }}
        open={drawerOpen}
      >
        {renderBasicDetails()}
        {renderChangeLang()}
        <Divider className="mb-16" />
        {renderPostAd()}
        {renderAdditionals()}
        <Divider />
        {renderBayutApp()}
        <Divider />
        {renderCountries()}
      </SideMenuContainer>
    );
  };

  return (
    <DrawerContainer style={{ position: 'relative' }}>
      {renderSiteSettingsUIMobile()}
      {renderSavedSearchesModalUI()}
      <Button
        type="link"
        iconColor="#222"
        iconSize="24px"
        icon="BiMenu"
        className="sideBarIcon"
        onClick={() => setDrawerOpen(true)}
      />
      <Flex
        as="a"
        className="py-20"
        align="center"
        justify="center"
        href={`${getClassifiedBaseURL()}${pathLocale}`}
        style={{ backgroundColor: '#fff' }}
      >
        {locale === 'en' ? (
          <ProfolioLogoLite horizontal="510" vertical="165" fontSize="45px" text={'Egypt'} width={95} height={26} />
        ) : (
          <ProfolioLogoLiteAr horizontal="320" vertical="155" fontSize="45px" text={'مصر'} width={95} height={26} />
        )}
      </Flex>
      {renderSideBar()}
    </DrawerContainer>
  );
};
