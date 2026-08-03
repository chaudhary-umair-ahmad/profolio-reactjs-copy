import tenantTheme from '@theme';
import tenantRoutes from '@routes';
import tenantConstants from '@constants';
import tenantData from '@data';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button, Dropdown, Flex, Icon, Image, Tag } from '../../../../components/common';
import { useRouteNavigate } from '../../../../hooks';
import { getClassifiedBaseURL, TENANT_KEY } from '../../../../utility/env';
import { NavbarLinks } from './styled';
import { ProfolioLogoLite, ProfolioLogoLiteAr, IconBayutAr } from '../../../../components/svg';
import { addPropertyEvent } from '../../../../services/analyticsService';
import { getCurrentLocationPath } from '../../../../utility/utility';

const NavBarNavigationContainer = ({ locale, isMobile, fullWidth = false, hidePostAd = false }) => {
  const { t } = useTranslation();
  const pathLocale = locale == 'ar' ? '' : `/${locale}`;
  const user = useSelector((state) => state.app.loginUser.user);
  const navigate = useRouteNavigate();
  const location = useLocation();
  const navItems = useMemo(() => tenantData.getNavbarLinks?.(locale), [locale]);

  return isMobile ? (
    <Flex vertical>
      <a href={`${getClassifiedBaseURL()}/blog${pathLocale}`}>{t('Blog')}</a>
      <Link to={`${pathLocale}/companies`}>{t('Find an Agency')}</Link>
      <Link to={`${pathLocale}/new-projects`}>{t('New Projects')}</Link>
      {/* <Link to={`${pathLocale}/bayut-academy`}>{t('Bayut Academy')}</Link> */}
    </Flex>
  ) : (
    <div className={`navbar-floor ${fullWidth ? 'full-width' : ''}`} 
      // style={{ 'letterSpacing': '0.1px', 'wordSpacing': '-1px' }}
    >
      <Flex className="container" align="center" justify="space-between" style={{ paddingBlock: '16px' }}>
        <Flex
          as="a"
          align="center"
          href={`${getClassifiedBaseURL()}${pathLocale}`}
          style={{
            ...(locale === 'en' && { transform: 'translateX(4px)' }),
          }}
        >
          {locale === 'en' ? (
            <ProfolioLogoLite
              horizontal={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.horizontal}
              text={tenantConstants?.APP_LOGO?.getLogoText(true)?.[locale]}
              width={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.width}
              height={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.height}
            />
          ) : locale === 'ar' && TENANT_KEY === 'bayut' ? (
            <Icon icon="IconBayutAr" width={125} height={32} style={{ marginInlineEnd: '5px' }} />
          ) : (
            <ProfolioLogoLiteAr
              horizontal={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.horizontal}
              text={tenantConstants?.APP_LOGO?.getLogoText(true)?.[locale]}
              width={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.width}
              height={tenantConstants?.APP_LOGO?.getLogoTextPlacement(true)?.[locale]?.height}
            />
          )}
        </Flex>
        <NavbarLinks align="center" className="navlinks-data" gap={'0px'}>
          {!!navItems?.length &&
            navItems?.map((item, i) => {
              if (item.dropdown) {
                return (
                  <Dropdown
                    key={i}
                    options={item.dropdown}
                    placement={locale === 'ar' ? 'bottomLeft' : 'bottomRight'}
                    getOptionLabel={(e) => t(e.title)}
                    getOptionLink={(e) => e.href}
                    useAsLink={true}
                    rootClassName="p-0 more-dropdown"
                    className="navbar-text"
                    suffixIcon="IoMdArrowDropdown"
                    suffixIconProps={{ size: '0.875em', color: '#4c4a4a' }}
                    style={{ gap: 0 }}
                    dropdownItemStyle={{ padding: '0', margin: '1px 0px 0px -10px' }}
                    overlayStyle={{
                      maxWidth: '160px',
                      // maxHeight: '100px',
                      // overflow: 'hidden',
                      borderRadius: '5px',
                      border: '0.5px solid #dedede',
                    }}
                  >
                    <span
                      style={{
                        position: 'relative',
                        top: '1px',
                        marginRight: '0px',
                        marginTop: locale == 'ar' && '-1.5px',
                      }}
                    >
                      {t(item.title)}
                    </span>
                  </Dropdown>
                );
              }
              return (
                <a
                  key={i}
                  href={item.href}
                  style={{
                    ...(item.imgSrc
                      ? { marginRight: locale == 'ar' && '5px' }
                      : {
                          marginBottom: '0px',
                          // marginLeft: locale == 'en' && '-8px',
                          marginRight: locale == 'ar' && '0px',
                        }),
                    ...(item?.showNewTag
                      ? {
                          marginTop: locale == 'ar' ? '0px' : '2px',
                          marginRight: locale == 'ar' ? '0px' : '26px',
                          marginLeft: locale == 'ar' ? '26px' : '0px',
                          ...(locale === 'ar' && { wordSpacing: '2px' }),
                        }
                      : {}),
                  }}
                >
                  {item.imgSrc && <Image src={item.imgSrc} style={{ ...item?.imgProps }} />}
                  {t(item.title)}
                  {item?.showNewTag && (
                    <Tag
                      className="new-tag"
                      color={tenantTheme['danger-color']}
                      style={{
                        '--tag-color': '#fff',
                        '--tag-font-size': '10px',

                        borderRadius: '16px',
                        fontWeight: 600,
                        marginInlineEnd: -8,

                        letterSpacing: '0.412px',
                      }}
                    >
                      {t('NEW')}
                    </Tag>
                  )}
                </a>
              );
            })}

          {!hidePostAd && (
            <Button
              type="success"
              icon="IconPostListing"
              style={{
                top: '-3px',
                fontWeight: 700,
                paddingTop: '15px',
                padding: '18.5px 11px',
                gap: locale == 'ar' ? '7px' : '6.5px',
                ...(locale === 'ar' && { width: '143px' }),
                '--btn-bg-color': '#28b16d;',
              }}
              onClick={() => {
                addPropertyEvent(user, getCurrentLocationPath(location), false);
                navigate(tenantRoutes.app('', false, user).post_listing.path);
              }}
            >
              <span
                style={{
                  // marginBottom: locale == 'ar' ? '-2px' : '-3px',
                  wordSpacing: locale == 'ar' && '1.5px',
                  paddingInlineEnd: '1px',
                  marginTop: locale == 'en' && '-1px',
                }}
              >
                {t('Post a Listing')}
              </span>
            </Button>
          )}
        </NavbarLinks>
      </Flex>
    </div>
  );
};

export default NavBarNavigationContainer;
