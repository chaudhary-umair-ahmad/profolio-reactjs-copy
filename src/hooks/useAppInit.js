import tenantConstants from '@constants';
import moment from 'moment/moment';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { changeLayoutMode, changeRtlMode, setLocale } from '../store/appSlice';
import { TENANT_KEY } from '../utility/env';
import { getAppLanguage } from '../utility/language';

const useAppInit = () => {
  const lang = getAppLanguage();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isMemberArea } = useSelector((state) => state.app.AppConfig);

  useEffect(() => {
    // Title
    document.title = t('Profolio');
    // Meta Description
    const description = document.createElement('meta');
    description.name = 'description';
    description.content = t(`Property Management Software By ${tenantConstants.TITLE}`);
    document.head.appendChild(description);
  }, []);

  useEffect(() => {
    // Fonts CSS
    if (!isMemberArea) {
      const fontsapis = document.createElement('link');
      const fonts = document.createElement('link');
      const fontsStyleSheet = document.createElement('link');
      fontsapis.rel = 'preconnect';
      fontsapis.href = 'https://fonts.googleapis.com';

      fonts.rel = 'preconnect';
      fonts.href = 'https://fonts.gstatic.com';
      fonts.crossOrigin = true;

      fontsStyleSheet.rel = 'stylesheet';
      fontsStyleSheet.href =
        'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Mukta:wght@200;300;400;500;600;700;800&display=swap';
      document.head.appendChild(fontsapis);
      document.head.appendChild(fonts);
      document.head.appendChild(fontsStyleSheet);
    }

    // Favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = `/profolio-assets/${TENANT_KEY}${isMemberArea ? '/lite' : ''}/favicon.png`;
    document.head.appendChild(favicon);

    // Favicon Shortcut (SVG)
    const faviconSC = document.createElement('link');
    faviconSC.rel = 'shortcut icon';
    faviconSC.type = 'image/svg+xml';
    faviconSC.href = `/profolio-assets/${TENANT_KEY}${isMemberArea ? '/lite' : ''}/favicon.svg`;
    document.head.appendChild(faviconSC);

    // Touch Icon
    const touchIcon = document.createElement('link');
    touchIcon.rel = 'apple-touch-icon';
    touchIcon.href = `/profolio-assets/${TENANT_KEY}${isMemberArea ? '/lite' : ''}/logo192.png`;
    document.head.appendChild(touchIcon);

    // Manifest
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = `/profolio-assets/${TENANT_KEY}${isMemberArea ? '/lite' : ''}/manifest.json`;
    document.head.appendChild(manifest);
  }, [isMemberArea]);

  useEffect(() => {
    // import fonts
    if (tenantConstants.LANGUAGES.find((e) => e.key == 'ar')) {
      const linkArabicFont = document.createElement('link');
      linkArabicFont.rel = 'stylesheet';
      linkArabicFont.href = `/profolio-assets/${TENANT_KEY}/fonts/arabic-font.css`;
      linkArabicFont.type = 'text/css';
      document.head.appendChild(linkArabicFont);

      const linkCurrency = document.createElement('link');
      linkCurrency.rel = 'stylesheet';
      linkCurrency.href = `/profolio-assets/${TENANT_KEY}/fonts/currency-font.css`;
      linkCurrency.type = 'text/css';
      document.head.appendChild(linkCurrency);
    }

    // Load local Lato font for bayut (replaces Typekit)
    if (TENANT_KEY === 'bayut') {
      const linkLatoFont = document.createElement('link');
      linkLatoFont.rel = 'stylesheet';
      linkLatoFont.href = `/profolio-assets/${TENANT_KEY}/fonts/lato-font.css`;
      linkLatoFont.type = 'text/css';
      document.head.appendChild(linkLatoFont);
    }
  }, []);

  useEffect(() => {
    // Moment Locale
    moment.locale(lang.key);
    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.lang = lang.key;
    htmlElement.dir = lang.rtl ? 'rtl' : 'ltr';
  }, [lang.key, lang.rtl]);

  useEffect(() => {
    i18n.changeLanguage(lang.key);
    dispatch(setLocale(lang.key));
    dispatch(changeRtlMode(lang.rtl));
    dispatch(changeLayoutMode(lang.darkMode));
  }, [lang]);

  return { locale: lang.key, ...lang };
};
export default useAppInit;
