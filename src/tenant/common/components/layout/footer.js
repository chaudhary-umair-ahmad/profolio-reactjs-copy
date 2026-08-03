import tenantUtils from '@utils';
import tenantConstants from '@constants';
import cx from 'clsx';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Flex, Icon } from '../../../../components/common';
import {
  BayutAppStoreArabicIcon,
  BayutPlayStoreArabicIcon,
  FacebookIcon,
  IconSaudiaArabia,
  scrollIcon,
} from '../../../../components/svg';
import { BayutAppStoreIcon, PlayStoreBadgeIcon, SaudiaFlagIcon } from '../../../../components/utilities/icons';
import { getBaseURL, getClassifiedBaseURL, TENANT_KEY } from '../../../../utility/env';
import { DropdownCountry, FooterStyled } from './styled';
import { capitalizeFirstLetter } from '../../../../utility/utility';
import AppLink from './app-link';
import { FaLinkedinIn } from 'react-icons/fa6';

export const FooterComponent = () => {
  const year = new Date();
  const { t } = useTranslation();
  const basePath = getClassifiedBaseURL();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const locale = useSelector((state) => state.app.AppConfig.locale);

  const pathLocale = locale == 'ar' ? '' : `/${locale}`;

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
        title: 'Indonesia',
        title_l1: 'إندونيسيا',
        href: 'https://www.lamudi.co.id/',
        id: 'ID',
        icon: 'ID',
      },
      { title: 'Egypt', title_l1: 'مَصر', href: 'https://www.bayut.eg/', id: 'EG', icon: 'EG', size: '16px' },
    ],
    [],
  );
  const socialLinks = useMemo(
    () => [
      {
        href: `https://www.facebook.com/${tenantConstants.SOCIAL_SLUG.FACEBOOK}`,
        icon: 'FacebookIcon',
        style: { '--hover-bg': '#3b5998' },
        iconClassName: 'facebook-icon',
      },
      {
        href: `https://twitter.com/${tenantConstants.SOCIAL_SLUG.X}`,
        icon: 'RiTwitterXFill',
        style: { '--hover-bg': '#000' },
        iconSize: '22px',
      },
      {
        href: `https://www.linkedin.com/company/${tenantConstants.SOCIAL_SLUG.LINKEDIN}`,
        icon: 'FaLinkedinIn',
        style: { '--hover-bg': '#0e76a8' },
        iconSize: locale == 'ar' ? '18px' : '19px',
      },
      {
        href: `https://www.instagram.com/${tenantConstants.SOCIAL_SLUG.INSTAGRAM}`,
        icon: 'RiInstagramLine',
        className: 'instagram-logo',
        style: { '--hover-bg': '#e1306c' },
      },
    ],
    [],
  );

  const footerLinks = useMemo(
    () => ({
      company: [
        ...(tenantConstants.SHOW_HELP_AND_SUPPORT
          ? [
              {
                href: `https://help.${tenantConstants.LINK_TITLE}/hc/${locale}`,
                title: 'Help & Support',
              },
            ]
          : []),
        {
          href: `${basePath}${pathLocale}/about/aboutus.html`,
          title: 'About Us',
        },
        ...(tenantConstants.FOOTER_ADVERTISE_WITH_BAYUT
          ? [
              {
                href: `${basePath}${pathLocale}/advertise-with-us`,
                title: 'Advertise with Bayut',
              },
            ]
          : []),
        ...(tenantConstants.FOOTER_BAYUT_STUDIOS
          ? [
              {
                href: locale === 'ar' ? 'https://bayutstudios.com/ar/' : 'https://bayutstudios.com/',
                title: 'Bayut Studios',
              },
            ]
          : []),
        {
          href: `${basePath}${pathLocale}/contactus.html`,
          title: 'Contact Us',
        },
        {
          href: `${basePath}${pathLocale}/terms.html`,
          title: 'Terms & Privacy Policy',
        },
      ],
    }),
    [locale],
  );

  const selectedCountry = useMemo(
    () => countryList?.find((e) => e?.id === tenantConstants.COUNTRY_CODE),
    [countryList, tenantConstants.COUNTRY_CODE],
  );

  return (
    <FooterStyled className="footer">
      <Flex
        align="start"
        gap={isMobile ? '20px' : locale == 'ar' ? '20px' : '40px'}
        className="container"
        justify={isMobile ? 'center' : 'space-between'}
        style={{ '--container-width': '82.5rem' }}
        wrap={isMobile}
      >
        <Flex align="start" gap="20px" style={{ flexBasis: isMobile ? '100%' : '' }} justify={isMobile ? 'center' : ''}>
          {tenantConstants.SHOW_REGA_FOOTER && (
            <Flex
              align="center"
              gap={isMobile ? '14px' : locale == 'ar' ? '20px' : '20px'}
            >
              <a
                target="_blank"
                href="https://eservicesredp.rega.gov.sa/auth/queries/Brokerage/BrokerageDetails/WB2Ma9gyrGeW4VLQR6NO/BrokerType_Office"
                rel="noreferrer"
              >
                <img
                  style={{
                    width: isMobile ? '140px' : locale == 'ar' ? '235px' : '235px',
                    marginBlockStart: isMobile ? 0 : 10,
                    height: !isMobile && '99.57px',
                  }}
                  src={`${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/rega-fal-badge-v2.svg`}
                  alt=""
                />
              </a>
              <img
                style={{ width: isMobile ? '140px' : '235px', marginBlockStart: isMobile ? 0 : 10 }}
                src={`${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/tourism-mot-${locale}.svg`}
                alt=""
              />
            </Flex>
          )}
          {!isMobile && (
            <Flex
              vertical
              justify="space-between"
              className="w-100 flex-grow"
              // style={{ maxWidth: locale === 'en' ? '330px' : '275px' }}
            >
              <ul className="footerNav">
                {footerLinks.company.map(({ title, href }, index) => (
                  <li key={title}>
                    <a style={{ textTransform: 'uppercase' }} href={href}>
                      {t(title)}
                    </a>
                    {index !== footerLinks.company.length - 1 && <span className="separator"></span>}
                  </li>
                ))}
              </ul>
              <Flex align="center" style={{ color: '#dedede', marginBottom: locale == 'ar' ? '25px' : '25.5px' }}>
                <div
                  className="fw-700"
                  style={{ letterSpacing: '0.84px', marginTop: locale == 'ar' ? '-0.5px' : '-1px' }}
                >
                  {t('COUNTRY')}:
                </div>
                <DropdownCountry
                  options={countryList?.filter((e) => e?.id !== tenantConstants.COUNTRY_CODE)}
                  getOptionIcon={(e) => (e.id === 'SA' ? <SaudiaFlagIcon width={16} height={11} /> : e.icon)}
                  getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'title')}
                  getOptionValue={(e) => e.href}
                  suffixIcon={null}
                  useAsLink
                  labelGap="0px"
                  style={{ padding: 0 }}
                >
                  <Flex
                    align="center"
                    className="pointer"
                    gap="3px"
                    style={{ marginTop: locale == 'ar' ? '-1.5px' : '1px' }}
                  >
                    {selectedCountry && (
                      <>
                        {selectedCountry.id === 'SA' ? (
                          <IconSaudiaArabia width={16} height={11} style={{ marginInlineEnd: '5px' }} />
                        ) : (
                          <Icon icon={selectedCountry.icon} width={16} height={11} style={{ marginInlineEnd: '5px' }} />
                        )}
                        <span>{tenantUtils.getLocalisedString(selectedCountry, 'title')}</span>
                      </>
                    )}
                    <Icon icon="IoMdArrowDropdown" size={20} className={cx('dropdownIcon')} />
                  </Flex>
                </DropdownCountry>
              </Flex>

              <div className="copyRight">
                <span
                  style={{
                    fontFamily: locale == 'ar' && 'Helvetica, Arial, sans-serif',
                    wordSpacing: locale == 'ar' && '0.5px',
                  }}
                >
                  © {''} 2008 - {year.getFullYear()}
                </span>{' '}
                {t(capitalizeFirstLetter(tenantConstants.LINK_TITLE))}
              </div>
            </Flex>
          )}
        </Flex>
        <Flex vertical align="end" style={{ flex: !isMobile && '1 1 0%' }} gap={!isMobile && '77px'}>
          <Flex
            align="center"
            className="footer-icons"
            gap="20px 10.5px"
            justify="end"
            style={{ marginBlockEnd: !isMobile && '42px', marginLeft: locale == 'ar' && '-0.5px' }}
          >
            {tenantConstants.SHOW_SOCIALS && (
              <Flex align="center" style={{ gap: '11px', color: '#4D4D4D' }}>
                {socialLinks.map(({ href, icon, style, className, iconClassName, iconSize }) => (
                  <Button
                    className={cx(className, 'hoverIcon')}
                    href={href}
                    icon={icon}
                    shape="circle"
                    style={style}
                    key={href}
                    iconSize={iconSize || '1.28571em'}
                    iconClassName={iconClassName}
                  />
                ))}
              </Flex>
            )}
            {!isMobile && (
              <Flex
                className="badges"
                align="center"
                gap={locale == 'ar' ? '5px' : '4px'}
                style={{ marginTop: '1px', width: locale == 'en' && '227px' }}
              >
                <AppLink
                  link={tenantConstants?.APP_LOGO?.linkIos?.[locale]}
                  IconEn={BayutAppStoreIcon}
                  IconAr={BayutAppStoreArabicIcon}
                  width="111"
                  height="34.8"
                  locale={locale}
                />
                <AppLink
                  link={tenantConstants?.APP_LOGO?.linkPlayStore?.[locale]}
                  IconEn={PlayStoreBadgeIcon}
                  IconAr={BayutPlayStoreArabicIcon}
                  height={locale == 'ar' ? '33px' : '34.8'}
                  locale={locale}
                />
              </Flex>
            )}
          </Flex>
          {!isMobile && (
            <Button
              as={Button}
              type="link"
              className="p-0 scrollTop"
              align="center"
              onClick={() => {
                window.scrollTo({ top: 0, insetInline: 0, behavior: 'smooth' });
              }}
              style={{ marginInlineEnd: -1, gap: 5 }}
            >
              <span
                className="fz-12 upcase fw-400"
                style={{ color: '#c1bfbf', marginBlockStart: locale == 'ar' ? '3px' : '3.5px', wordSpacing: '1px' }}
              >
                {t('Top')}
              </span>

              <Icon icon="scrollIcon" size="2.8em" className="m-0" />
            </Button>
          )}
        </Flex>
      </Flex>
      {isMobile && (
        <div className="copyRight" style={{ marginBlockStart: '10px', marginInline: 'auto' }}>
          © 2008 – {year.getFullYear()} {t(capitalizeFirstLetter(tenantConstants.LINK_TITLE))}
        </div>
      )}
    </FooterStyled>
  );
};
