import React, { act, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Drawer, DrawerModal, Dropdown, Flex, Icon, Select, Spinner, TextWithIcon } from '../../common';
import { ActionDropDown } from './styled';
import tenantTheme from '@theme';

import { useSelector } from 'react-redux';

const ListingRowActions = ({ actionsList, loading }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const bottomSheetRef = useRef();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { rtl } = useSelector((state) => state.app.AppConfig);

  const getIcon = (iconType, icon) => {
    if (icon && typeof icon !== 'string') return icon;
    switch (iconType) {
      case 'refresh':
        return 'MdRefresh';
      case 'activate-user':
        return 'FaUserCheck';
      case 'boost-to-top':
        return 'MdRefresh';
      case 'edit':
        return 'MdEdit';
      case 'change-owner':
        return 'BsFillPersonPlusFill';
      case 'manage-products':
        return 'MdPieChartOutline';
      case 'preview-on-bayut':
        return 'FiArrowUpRight';
      case 'preview-on-dubizzle':
        return 'FiArrowUpRight';
      case 'preview-on-zameen':
        return 'FiArrowUpRight';
      case 'preview-on-olx':
        return 'FiArrowUpRight';
      case 'detail-drawer':
        return 'IoMdEye';
      case 'hide':
        return 'IoMdEyeOff';
      case 'unhide':
        return 'IoMdEye';
      case 'enable':
        return 'IoMdEye';
      case 'disable':
        return 'IoMdEyeOff';
      case 'delete':
        return 'HiOutlineTrash';
      case 'assign-credits':
        return 'BsDatabaseFillAdd';
      case 'email':
        return 'FaEnvelope';
      case 'phone':
        return 'IoCall';
      case 'whatsapp':
        return 'RiWhatsappFill';
      case 'add-task':
        return 'RiFileAddFill';
      case 'listing-detail-drawer':
        return 'TiArrowForwardOutline';
      default:
        return icon;
        break;
    }
  };

  const getToolTipLabel = (iconType, color) => {
    switch (iconType) {
      case 'edit':
        return t('Edit');
      case 'activate-user':
        return t('Activate User');
      case 'boost-to-top':
        return t('Boost to Top');
      case 'refresh':
        return t('Refresh');
      case 'manage-products':
        return t('Manage Products');
      case 'change-owner':
        return t('Change Owner');
      case 'detail-drawer':
        return t('Preview');
      case 'preview-on-dubizzle':
        return t('View');
      case 'preview-on-bayut':
        return t('View');
      case 'preview-on-zameen':
        return t('View on Zameen');
      case 'preview-on-olx':
        return t('View on Olx');
      case 'hide':
        return t('Hide');
      case 'unhide':
        return t('UnHide');
      case 'enable':
        return t('Enable');
      case 'disable':
        return t('Disable');
      case 'delete':
        return t('Delete');
      case 'assign-credits':
        return t('Assign Credits');
      case 'email':
        return t('Email');
      case 'phone':
        return t('Call');
      case 'whatsapp':
        return t('Whatsapp');
      case 'add-task':
        return t('Add Task');
      case 'listing-detail-drawer':
        return t('Preview');
      default:
        break;
    }
  };

  const ActionsListRenderer = () => {
    if (!actionsList || !Array.isArray(actionsList)) return null;

    return (
      <div>
        {actionsList?.map((group, groupIndex) =>
          group?.type === 'group' ? (
            <Flex vertical key={group?.key || groupIndex}>
              <div>{group?.logo ? (rtl ? group?.logo_ar : group?.logo) : group?.label}</div>
              <div>
                {group?.children?.map((child, index) =>
                  child?.href ? (
                    <a key={index} href={child?.href} target="_blank" rel="noopener noreferrer">
                      <TextWithIcon
                        iconProps={{
                          hasBackground: true,
                          iconContainerSize: '22px',
                          color: tenantTheme['primary-color'],
                        }}
                        disabled={child?.disabled}
                        icon={getIcon(child?.iconType)}
                        value={getToolTipLabel(child?.iconType)}
                        className="mb-12"
                        style={{ '--icon-radius': '4px' }}
                      />
                    </a>
                  ) : (
                    <TextWithIcon
                      key={index}
                      iconProps={{
                        hasBackground: true,
                        iconContainerSize: '22px',
                        color: tenantTheme['primary-color'],
                      }}
                      disabled={child?.disabled}
                      onClick={() => {
                        child?.onClick?.();
                        setDropdownVisible(false);
                      }}
                      icon={getIcon(child?.iconType)}
                      value={getToolTipLabel(child?.iconType)}
                      className="mb-12 pointer"
                      style={{ '--icon-radius': '4px' }}
                    />
                  ),
                )}
              </div>
            </Flex>
          ) : group?.href ? (
            <a key={groupIndex} href={group?.href} target="_blank" rel="noopener noreferrer">
              <TextWithIcon
                key={groupIndex}
                disabled={group.disabled}
                iconProps={{
                  hasBackground: true,
                  iconContainerSize: '22px',
                  color: tenantTheme['primary-color'],
                }}
                icon={getIcon(group?.iconType)}
                value={getToolTipLabel(group?.iconType)}
                className="mb-12 pointer"
                style={{ '--icon-radius': '4px' }}
              />
            </a>
          ) : (
            <TextWithIcon
              key={groupIndex}
              disabled={group.disabled}
              iconProps={{
                hasBackground: true,
                iconContainerSize: '22px',
                color: tenantTheme['primary-color'],
              }}
              onClick={() => {
                group?.onClick();
                setDropdownVisible(false);
              }}
              icon={getIcon(group?.iconType)}
              value={getToolTipLabel(group?.iconType)}
              className="mb-12 pointer"
              style={{ '--icon-radius': '4px' }}
            />
          ),
        )}
      </div>
    );
  };

  const renderMobileComponent = () => {
    return (
      <>
        <DrawerModal
          ref={bottomSheetRef}
          placement={'bottom'}
          title={t('Actions')}
          visible={dropdownVisible}
          onCancel={() => {
            setDropdownVisible(false);
          }}
          footer={null}
        >
          {ActionsListRenderer()}
        </DrawerModal>

        <Button
          icon={'FaCaretDown'}
          onClick={() => {
            setDropdownVisible(!dropdownVisible);
          }}
        />
      </>
    );
  };

  return isMobile ? (
    renderMobileComponent()
  ) : (
    <>
      <ActionDropDown
        rootClassName="dropdownTrigger"
        size="small"
        placement="bottomRight"
        renderChildren={ActionsListRenderer}
        suffixIcon={''}
        open={dropdownVisible}
        onOpenChange={(visible) => setDropdownVisible(visible)}
        type="link"
        disabled={loading}
        arrow={false}
        style={{ backgroundColor: tenantTheme['primary-light-4']}}
      >
        {t('Actions')}
        {loading && <Spinner />}
        <Icon icon="FaCaretDown" size="1.4em" color={tenantTheme['primary-color']} />
      </ActionDropDown>
    </>
  );
};

export default ListingRowActions;
