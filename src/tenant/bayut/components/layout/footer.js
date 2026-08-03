import tenantUtils from '@utils';
import tenantConstants from '@constants';
import cx from 'clsx';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Flex, Icon } from '../../../../components/common';
import { BayutAppStoreArabicIcon, BayutPlayStoreArabicIcon } from '../../../../components/svg';
import { BayutAppStoreIcon, PlayStoreBadgeIcon, SaudiaFlagIcon } from '../../../../components/utilities/icons';
import { getBaseURL, getClassifiedBaseURL, TENANT_KEY } from '../../../../utility/env';
import { DropdownCountry, FooterStyled } from './styled';

export const FooterComponent = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { t } = useTranslation();
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const basePath = getClassifiedBaseURL();
  const year = new Date();

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
      {
        title: 'Pakistan',
        title_l1: 'باكستان',
        href: 'https://www.zameen.com/',
        id: 'PK',
        icon: 'PK',
      },
      { title: 'Jordan', title_l1: 'الأردن', href: 'https://www.bayut.jo/', id: 'JO', icon: 'JO' },
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
      { href: 'https://www.facebook.com/BayutKSA', icon: 'RiFacebookFill', style: { '--hover-bg': '#3b5998' } },
      { href: 'https://twitter.com/BayutKSA', icon: 'RiTwitterXFill', style: { '--hover-bg': '#000' } },
      {
        href: 'https://www.linkedin.com/company/bayutksa/',
        icon: 'RiLinkedinFill',
        style: { '--hover-bg': '#0e76a8' },
      },
      {
        href: 'https://www.instagram.com/bayutksa/',
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
        {
          href: `https://help.bayut.sa/hc/${locale}`,
          title: 'Help & Support',
        },
        {
          href: `${basePath}${pathLocale}/about/aboutus.html`,
          title: 'About Us',
        },
        {
          href: `${basePath}${pathLocale}/advertise-with-us`,
          title: 'Advertise with Bayut',
        },
        {
          href: locale === 'ar' ? 'https://bayutstudios.com/ar/' : 'https://bayutstudios.com/',
          title: 'Bayut Studios',
        },
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

  return (
    <FooterStyled className="footer">
      <Flex
        align="start"
        gap={isMobile ? '22px' : '40px'}
        className="container"
        justify={isMobile ? 'center' : 'space-between'}
        style={{ '--container-width': '82.5rem' }}
        wrap={isMobile}
      >
        <Flex align="start" gap="20px" style={{ flexBasis: isMobile ? '100%' : '' }} justify={isMobile ? 'center' : ''}>
          <Flex align="center" gap={isMobile ? '10px' : '20px'}>
            <Flex
              as="a"
              align="center"
              target="_blank"
              href="https://eservicesredp.rega.gov.sa/auth/queries/Brokerage/BrokerageDetails/WB2Ma9gyrGeW4VLQR6NO/BrokerType_Office"
              rel="noreferrer"
            >
              <img
                style={{ height: isMobile ? '74px' : '101px', marginBlockStart: 7 }}
                src={`${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/rega-fal-badge-v2.svg`}
                alt=""
              />
            </Flex>
            <img
              style={{ height: isMobile ? '70px' : '98px', marginBlockStart: 7 }}
              src={`${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/tourism-mot-${locale}.svg`}
              alt=""
            />
          </Flex>
          {!isMobile && (
            <Flex
              vertical
              justify="space-between"
              className="w-100 flex-grow"
              style={{ maxWidth: locale === 'en' ? '340px' : '275px' }}
            >
              <ul className="footerNav">
                {footerLinks.company.map(({ title, href }) => (
                  <li className="seperator" key={title}>
                    <a style={{ textTransform: 'uppercase' }} href={href}>
                      {t(title)}
                    </a>
                  </li>
                ))}
              </ul>
              <Flex align="center" style={{ color: '#dedede', marginBottom: '25px' }}>
                <div className="fw-700" style={{ letterSpacing: '1px' }}>
                  {t('COUNTRY')}:
                </div>
                <DropdownCountry
                  options={countryList}
                  getOptionIcon={(e) => e.icon}
                  getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'title')}
                  getOptionValue={(e) => e.href}
                  suffixIcon={null}
                  useAsLink
                  labelGap="0px"
                >
                  <Flex align="center" className="pointer" gap="3px">
                    <SaudiaFlagIcon width={16} height={11} style={{ marginInlineEnd: '5px' }} />
                    <span>
                      {tenantUtils.getLocalisedString({ title: 'Saudi Arabia', title_l1: 'السعودية' }, 'title')}{' '}
                    </span>
                    <Icon icon="IoMdArrowDropdown" size={20} className={cx('dropdownIcon')} />
                  </Flex>
                </DropdownCountry>
              </Flex>

              <div className="copyRight">
                © 2008 – {year.getFullYear()} {t('Bayut.sa')}
              </div>
            </Flex>
          )}
        </Flex>
        <Flex vertical align="end" style={{ flex: !isMobile && '1 1 0%' }} gap={!isMobile && '40px'}>
          <Flex align="center" wrap gap="20px 10px" justify="end" style={{ marginBlockEnd: !isMobile && '42px' }}>
            <Flex align="center" style={{ gap: '11px', color: '#4D4D4D' }}>
              {socialLinks.map(({ href, icon, style, className }) => (
                <Button
                  className={cx(className, 'hoverIcon')}
                  href={href}
                  icon={icon}
                  shape="circle"
                  style={style}
                  key={href}
                  iconSize="1.28571em"
                />
              ))}
            </Flex>
            {!isMobile && (
              <Flex className="badges" align="center" gap="4px">
                {locale === 'en' ? (
                  <>
                    <a href={tenantConstants.APP_LOGO.linkIos?.[locale]}>
                      <BayutAppStoreIcon height="33" />
                    </a>
                    <a href={tenantConstants.APP_LOGO.linkPlayStore?.[locale]}>
                      <PlayStoreBadgeIcon height="34.8" />
                    </a>
                  </>
                ) : (
                  <>
                    <a href={tenantConstants.APP_LOGO.linkIos?.[locale]}>
                      <BayutAppStoreArabicIcon height="33" />
                    </a>
                    <a href={tenantConstants.APP_LOGO.linkPlayStore?.[locale]}>
                      <BayutPlayStoreArabicIcon height="34.8" />
                    </a>
                  </>
                )}
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
              style={{ marginInlineEnd: -4, gap: 1 }}
            >
              <span className="fz-12 upcase" style={{ color: '#c1bfbf', marginBlockStart: 3 }}>
                {t('Top')}
              </span>

              <Icon icon="IoChevronUpCircle" size="2.8em" className="m-0" />
            </Button>
          )}
        </Flex>
      </Flex>
      {isMobile && (
        <div className="copyRight" style={{ marginBlockStart: '10px', marginInline: 'auto' }}>
          © 2008 – {year.getFullYear()} {t('Bayut.sa')}
        </div>
      )}
    </FooterStyled>
  );
};
