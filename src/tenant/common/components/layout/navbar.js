import TenantComponents from '@components';
import tenantConstants from '@constants';
import tenantRoutes from '@routes';
import { Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import LiteNoDataModalUi from '../../../../components/common/lite-no-data-modal/lite-no-data-modal-ui';
import { IconArabicBold, IconArabicfont } from '../../../../components/utilities/icons';
import { useAppAuthentication, useRouteNavigate } from '../../../../hooks';
import { FAB } from './styled';
import { getLink, setCookieUnits } from './utils';
import {
  useDeleteSavedSearchMutation,
  useLazyGetFavouritePropertiesQuery,
  useLazyGetUsersSavedSearchesQuery,
  useSaveSettingsMutation,
} from '../../../../apis/user';
import { addPropertyEvent } from '../../../../services/analyticsService';
import { getCurrentLocationPath } from '../../../../utility/utility';
import { useLocation } from 'react-router-dom';

export const NavBar = ({
  fullWidth = false,
  hideLoginButton = false,
  hideSavedSearches = false,
  hideFavouriteProperties = false,
  hideFloatingPostAdButton = false,
  hideMobileNavBarDrawer = false,
  hideMyListings = false,
  hidePostAd = false,
  hideCurrencyConverter = false,
}) => {
  const { t } = useTranslation();
  const { isMobile, rtl, locale } = useSelector((state) => state.app.AppConfig);
  const userData = useSelector((state) => state?.app?.loginUser?.user);
  const [getUsersSavedSearches] = useLazyGetUsersSavedSearchesQuery();
  const [deleteSavedSearch] = useDeleteSavedSearchMutation();
  const [getFavouriteProperties] = useLazyGetFavouritePropertiesQuery();
  const [saveSetting] = useSaveSettingsMutation();
  const [newLocale, setNewLocale] = useState(locale);
  const [showLocaleModal, setShowLocaleModal] = useState(false);
  const [showChangeCurrencyModal, setShowChangeCurrencyModal] = useState(false);
  const [showChangeAreaUnitModal, setShowChangeAreaUnitModal] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [favouriteProperties, setFavouriteProperties] = useState([]);
  const [isFavpropLoading, setIsFavpropLoading] = useState(false);

  const [noSaveSearchModal, setNoSaveSearchModal] = useState(false);
  const [noFavPropModal, setNoFavPropModal] = useState(false);
  const { onLogout, auth } = useAppAuthentication();
  const navigate = useRouteNavigate();
  const location = useLocation();

  const pathLocale = locale == 'ar' ? '' : `/${locale}`;
  const isPostListingPage = location.pathname.includes('/post-listing');
  const onDeleteSavedSearch = (item) => {
    deleteSavedSearch({ locale: locale, id: item?.id, userID: userData?.external_id })
      .then(() => {
        setSavedSearches((prevSavedSearches) => prevSavedSearches.filter((search) => search.id !== item?.id));
      })
      .catch((error) => {
        console.error('Error deleting saved search:', error);
      });
  };
  const countryList = useMemo(
    () => [
      {
        title: 'United Arab Emirates',
        title_l1: 'الإمارات العربية المتحدة',
        href: 'https://www.bayut.com/',
        id: 'UAE',
        icon: 'AE',
      },
      { title: 'Saudi Arabia', title_l1: 'السعودية', href: 'https://www.bayut.sa/', icon: 'SA', id: 'SA' },
      {
        title: 'Pakistan',
        title_l1: 'باكستان',
        href: 'https://www.zameen.com/',
        id: 'PK',
        icon: 'PK',
      },
      {
        title: 'Oman',
        title_l1: 'الأردن',
        href: 'https://www.bayut.om/',
        id: 'OM',
        icon: 'OM',
      },
      {
        title: 'Qatar',
        title_l1: 'الأردن',
        href: 'https://www.bayut.qa/',
        id: 'QA',
        icon: 'QA',
      },
      {
        title: 'Bahrain',
        title_l1: 'الأردن',
        href: 'https://www.bayut.bh/',
        id: 'BH',
        icon: 'BH',
      },
      {
        title: 'Jordan',
        title_l1: 'الأردن',
        href: 'https://www.bayut.jo/',
        id: 'JO',
        icon: 'JO',
      },
      {
        title: 'Philippines',
        title_l1: 'الفلبين',
        href: 'https://www.lamudi.com.ph/',
        id: 'PH',
        icon: 'PH',
      },
      {
        title: 'Indonedia',
        title_l1: 'إندونيسيا',
        href: 'https://www.lamudi.co.id/',
        id: 'ID',
        icon: 'ID',
      },
      { title: 'Egypt', title_l1: 'مَصر', href: 'https://www.bayut.eg/', id: 'EG', icon: 'EG', size: '16px' },
    ],
    [],
  );

  const localeData = useMemo(
    () => [
      { label: 'English', value: 'en' },
      { label: newLocale === 'ar' ? <IconArabicBold size={52} /> : <IconArabicfont size={52} />, value: 'ar' },
    ],
    [newLocale],
  );

  const logoutUser = async () => {
    onLogout({ manualLogout: true });
  };

  const saveSettings = async (payload) => {
    setCookieUnits(payload);
    await saveSetting({ payload });
  };

  const toggleLanguage = (loc) => {
    const currentUrl = window?.location?.pathname + window?.location?.search;
    let newUrl;
    if (currentUrl.includes(`/${locale}/`)) {
      newUrl = currentUrl.replace(`/${locale}/`, `${loc == 'ar' ? '/ar' : `/${loc}`}/`);
    } else {
      newUrl = `/${loc}${window?.location?.pathname + window?.location?.search}`;
    }
    return newUrl;
  };

  const languageObjectToSwitch = useMemo(
    () => tenantConstants.LANGUAGES?.length > 1 && tenantConstants.LANGUAGES?.find((e) => e.alternate === locale),
    [locale],
  );

  const getNoFavouritePropertyModalUi = () => {
    if (hideFavouriteProperties) return null;

    return (
      <LiteNoDataModalUi
        visible={noFavPropModal}
        onCancel={() => setNoFavPropModal(false)}
        icon="IconFavouriteProperties"
        title={t("You haven't added any favourite properties yet")}
        subtitle={t('Simply tap on the HEART icon to bookmark your favourite properties and explore them later')}
      />
    );
  };

  useEffect(() => {
    if (!hideFavouriteProperties) {
      fetchFavProperties();
    }
    if (!hideSavedSearches) {
      fetchSavedSearch();
    }
  }, [auth?.authenticated, hideFavouriteProperties, hideSavedSearches]);

  const fetchFavProperties = async () => {
    if (auth?.authenticated) {
      setIsFavpropLoading(true);
      const response = await getFavouriteProperties();
      if (!!response.data) {
        setFavouriteProperties(
          response.data?.map((e) => ({
            value: e,
            label: getLink(e, `/property/details-${e}.html`, true, null, locale),
          })),
        );
      }
      setIsFavpropLoading(false);
    }
  };

  const fetchSavedSearch = async () => {
    if (auth?.authenticated) {
      const response = await getUsersSavedSearches({ locale });
      if (!!response?.data) {
        setSavedSearches(response?.data);
      }
    }
  };

  const getNoSavedSearchesModalUi = () => {
    if (hideSavedSearches) return null;

    return (
      <LiteNoDataModalUi
        visible={noSaveSearchModal}
        onCancel={() => setNoSaveSearchModal(false)}
        icon="IconSavedSearched"
        title={t("You haven't saved any searches yet")}
        subtitle={t('Use the SAVE SEARCH button below the filters to bookmark your property preferences')}
      />
    );
  };

  return (
    <>
      {getNoFavouritePropertyModalUi()}
      {getNoSavedSearchesModalUi()}
      {!hideFloatingPostAdButton && !isPostListingPage && (
        <Tooltip {...(isMobile && { open: false })} title={t('Post an Ad')} placement={rtl ? 'left' : 'right'}>
          <FAB
            type="success"
            icon="IconPostListing"
            shape="circle"
            size="large"
            onClick={() => {
              navigate(tenantRoutes.app('', false, userData).post_listing.path);
              addPropertyEvent(userData, getCurrentLocationPath(location), false);
            }}
          />
        </Tooltip>
      )}
      {isMobile ? (
        <TenantComponents.MobileNavBar
          isMobile={isMobile}
          userData={userData}
          logoutUser={logoutUser}
          localeData={localeData}
          locale={locale}
          onDeleteSavedSearch={onDeleteSavedSearch}
          countryList={countryList}
          setShowLocaleModal={setShowLocaleModal}
          setNoFavPropModal={setNoFavPropModal}
          isFavpropLoading={isFavpropLoading}
          setNoSaveSearchModal={setNoSaveSearchModal}
          saveSettings={saveSettings}
          pathLocale={pathLocale}
          toggleLanguage={toggleLanguage}
          languageObj={languageObjectToSwitch}
          savedSearches={savedSearches}
          setSavedSearches={setSavedSearches}
          favouriteProperties={favouriteProperties}
          fullWidth={fullWidth}
          hideMobileNavBarDrawer={hideMobileNavBarDrawer}
        />
      ) : (
        <TenantComponents.DeskTopNavBar
          userData={userData}
          logoutUser={logoutUser}
          setNewLocale={setNewLocale}
          locale={locale}
          onDeleteSavedSearch={onDeleteSavedSearch}
          setNoSaveSearchModal={setNoSaveSearchModal}
          savedSearches={savedSearches}
          setSavedSearches={setSavedSearches}
          favouriteProperties={favouriteProperties}
          setShowLocaleModal={setShowLocaleModal}
          showChangeCurrencyModal={showChangeCurrencyModal}
          setShowChangeCurrencyModal={setShowChangeCurrencyModal}
          showChangeAreaUnitModal={showChangeAreaUnitModal}
          setShowChangeAreaUnitModal={setShowChangeAreaUnitModal}
          setNoFavPropModal={setNoFavPropModal}
          isFavpropLoading={isFavpropLoading}
          saveSettings={saveSettings}
          pathLocale={pathLocale}
          toggleLanguage={toggleLanguage}
          languageObj={languageObjectToSwitch}
          isAuthenticated={auth?.authenticated}
          fullWidth={fullWidth}
          hideLoginButton={hideLoginButton}
          hideSavedSearches={hideSavedSearches}
          hideFavouriteProperties={hideFavouriteProperties}
          hideMyListings={hideMyListings}
          hidePostAd={hidePostAd}
          hideCurrencyConverter={hideCurrencyConverter}
        />
      )}
    </>
  );
};
