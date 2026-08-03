import tenantConstants from '@constants';
import tenantMenuList from '@menuList';
import tenantTheme from '@theme';
import { Badge, Menu } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Flex, Icon } from '../components/common';
import { LanguageSwitcherIcon } from '../components/svg';
import { useGetLocation, useRouteNavigate } from '../hooks';
import { helpCenterClickEvent } from '../services/analyticsService/index.js';
import TenantComponents from '@components';
import { getAppLanguage } from '../utility/language.js';
import { useLazyGetUnreadCountQuery } from '../apis/common.js';

const MenuItems = ({ t, toggleCollapsed, handleTopBarSticky, collapsed }) => {
  const navigate = useRouteNavigate();
  const pathName = window.location.pathname;
  const { user } = useSelector((state) => state.app.loginUser);
  const sideBarList = tenantMenuList.menuList(user?.permissions, user?.agency, user?.type !== 'free');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const { isMobile, darkMode, topMenu, isMemberArea, locale } = useSelector((state) => state.app.AppConfig);
  const [currentClickedItem, setCurrentClickedItem] = useState(null);
  const currentPath = useGetLocation();
  const sidebarRef = useRef(null);
  const helpSupportModalRef = useRef();

  const [getUnreadCounts, { data: badgeValues }] = useLazyGetUnreadCountQuery();
  const isClickToggleSidebarEnabled = tenantConstants.PUSH_CONTENT_ON_SIDEBAR_EXPAND && !isMobile;

  useEffect(() => {
    if (user) {
      getUnreadCounts();
    }
  }, [user]);

  useEffect(() => {
    const keys = [];
    sideBarList.forEach((e) => {
      if ((e.path && pathName.includes(e.path)) || pathName.includes(e?.basePath)) {
        keys.push(e.key);
        handleTopBarSticky(e.hideTopBar);
      } else if (e.list) {
        e.list.forEach((it) => {
          if ((it.path && pathName.includes(it.path)) || pathName.includes(it?.basePath)) {
            keys.push(it.key);
            handleTopBarSticky(it.hideTopBar);
          }
        });
      }
    });
    setSelectedKeys(keys);
  }, [window.location.pathname]);

  // useEffect(() => {
  //   const handleClickOutside = event => {
  //     if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
  //       toggleCollapsed();
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [toggleCollapsed]);

  /** SubMenu titles do not receive Menu `onClick` while collapsed — expose parent icons as leaf items instead. */
  const flattenCollapsedParents = Boolean(isClickToggleSidebarEnabled && collapsed);

  const showCollapsedTooltips = collapsed && !isMobile && !topMenu;

  const menuItems = useMemo(
    () =>
      sideBarList.map(({ key, list, title, icon, id }) => {
        const parentIcon =
          !!icon &&
          (badgeValues?.[key] ? (
            <Badge style={{ padding: '0px 4px', lineHeight: 'normal' }} count={badgeValues?.[key]} size="small">
              <Icon icon={icon} />
            </Badge>
          ) : (
            <Icon icon={icon} />
          ));

        if (list && flattenCollapsedParents) {
          return {
            id,
            key,
            icon: parentIcon,
            label: <div>{title}</div>,
            title: showCollapsedTooltips ? title : '',
          };
        }

        if (list) {
          return {
            id,
            key,
            icon: parentIcon,
            children: list.map((subItem) => ({
              key: subItem.key,
              icon: !!subItem.icon && <Icon icon={subItem.icon} />,
              label: <div>{subItem.title}</div>,
              title: showCollapsedTooltips ? subItem.title : '',
              className: key === 'reports' ? 'reports-submenu-child' : undefined,
            })),
            label: title,
            title: showCollapsedTooltips ? title : '',
          };
        }

        return {
          key,
          icon: !!icon && <Icon icon={icon} />,
          label: <div>{title}</div>,
          title: showCollapsedTooltips ? title : '',
        };
      }),
    [sideBarList, badgeValues, isClickToggleSidebarEnabled, collapsed, isMobile, topMenu, showCollapsedTooltips],
  );

  const onChangeLanguage = (newKey) => {
    const lang = tenantConstants.LANGUAGES?.find((e) => e.key == newKey);
    const currentLanguage = getAppLanguage();
    const pathDirectories = window.location.pathname.split('/');
    let newPath;
    if (pathDirectories[1] !== lang.key) {
      if (window.location.pathname.includes(`/${currentLanguage?.key}`)) {
        newPath = [window.location.pathname.replace(`/${currentLanguage?.key}`, `/${lang?.key}`)];
      } else {
        newPath = [pathDirectories[0], lang?.key, ...pathDirectories.slice(1)];
      }
    }
    window.location.pathname = newPath.join('/');
  };

  const onClickMenuItem = (e) => {
    let item;
    sideBarList.some((it) => {
      if (e.key === it.key) {
        item = it;
        return true;
      }
      if (it.list) {
        const child = it.list.find((el) => e.key === el.key);
        if (child) {
          item = child;
          return true;
        }
      }
      return false;
    });

    const resolvedNavItem = isClickToggleSidebarEnabled && collapsed && item?.list?.length ? item.list[0] : item;

    if (resolvedNavItem) {
      setCurrentClickedItem(resolvedNavItem);
      resolvedNavItem?.onClick?.();
      if (resolvedNavItem?.component) {
        sidebarRef?.current?.show?.();
        toggleCollapsed();
      } else if (resolvedNavItem.path) {
        navigate(resolvedNavItem.path);
        toggleCollapsed();
      }
    }
  };

  const languageObjectToSwitch = useMemo(
    () => tenantConstants.LANGUAGES?.length > 1 && tenantConstants.LANGUAGES?.find((e) => e.alternate === locale),
    [locale],
  );

  const renderDynamicComponent = useCallback(() => {
    const Component = TenantComponents?.[currentClickedItem?.component];
    return (
      Component &&
      !currentPath?.pathname.includes(currentClickedItem?.path) && (
        <Component
          //  ref={sidebarRef}
          defaultState={true}
          isFetch={isMobile}
        />
      )
    );
  }, [currentClickedItem]);

  return (
    <>
      {isMobile && !collapsed && (
        <div className="sidebar-mobile-classified-wrap">
          <TenantComponents.HeaderLink variant="sidebarPill" />
        </div>
      )}
      <Menu
        className={isMobile && !topMenu ? 'sidebar-menu--mobile' : undefined}
        mode={!topMenu || isMobile ? 'inline' : 'horizontal'}
        theme={darkMode && 'dark'}
        defaultSelectedKeys={selectedKeys}
        onClick={onClickMenuItem}
        triggerSubMenuAction={isClickToggleSidebarEnabled ? 'click' : 'hover'}
        overflowedIndicator={<Icon icon="FiMoreVertical" />}
        selectedKeys={selectedKeys}
        items={menuItems}
      />
      <Flex vertical gap="8px" className="sidebar-bottom-actions">
        {languageObjectToSwitch && (
          <div className={collapsed ? 'px-8' : 'px-0'}>
            <Button
              onClick={() => onChangeLanguage(languageObjectToSwitch.key)}
              outlined
              style={{
                '--btn-bg-color': 'transparent',
                '--btn-content-color': '#707070',
                '--btn-border-color': '#e6e6e6',
                '--ant-button-default-hover-bg': '#f5f5f5',
                '--ant-button-default-hover-color': '#707070',
                '--ant-button-default-hover-border-color': '#e6e6e6',
              }}
              block
            >
              <>
                <LanguageSwitcherIcon size="1.4em" />
                {!collapsed && <> {languageObjectToSwitch.label}</>}
              </>
            </Button>
          </div>
        )}
        {tenantConstants.SHOW_HELP_AND_SUPPORT && !isMemberArea && (
          <div className={collapsed ? 'px-8' : 'px-0'}>
            <Button
              onClick={() => {
                helpSupportModalRef.current.show(true);
                helpCenterClickEvent(user);
              }}
              outlined
              style={{
                '--btn-bg-color': 'transparent',
                '--btn-content-color': '#707070',
                '--btn-border-color': '#e6e6e6',
                '--ant-button-default-hover-bg': '#f5f5f5',
                '--ant-button-default-hover-color': '#707070',
                '--ant-button-default-hover-border-color': '#e6e6e6',
              }}
              block
              icon="HelpSupportIcon"
            >
              {!collapsed && t('Help & Support')}
            </Button>

            <TenantComponents.HelpAndSupport ref={helpSupportModalRef} />
          </div>
        )}
      </Flex>

      {renderDynamicComponent()}
    </>
  );
};

export default withTranslation()(MenuItems);
