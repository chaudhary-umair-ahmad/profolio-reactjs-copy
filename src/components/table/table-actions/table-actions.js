import tenantTheme from '@theme';
import { Row, Tooltip } from 'antd';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Icon } from '../../common';

function TableActions(props) {
  const { t } = useTranslation();
  const { actionsList, id, isMobile, wrapAction = true, buttonProps } = props;

  const getIcon = (iconType, icon) => {
    if (icon && typeof icon !== 'string') return icon;
    switch (iconType) {
      case 'edit':
        return 'MdEdit';
      case 'activate-user':
        return 'FaUserCheck';
      case 'booking':
        return 'MdDateRange';
      case 'sell-rent-listing':
        return 'IconSellRentListing';
      case 'change-owner':
        return 'BsFillPersonPlusFill';
      case 'manage-products':
        return 'MdPieChartOutline';
      case 'preview-on-bayut':
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
      case 'manage-products':
        return t('Manage Products');
      case 'change-owner':
        return t('Change Owner');
      case 'detail-drawer':
        return t('Preview');
      case 'preview-on-bayut':
        return t('View on Bayut');
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
      case 'booking':
        return t('Mark as Booked');
      case 'sell-rent-listing':
        return t('Sell or Rent Property');
      default:
        break;
    }
  };

  const renderMobileView = () => {
    return (
      <Dropdown
        placement="bottomRight"
        options={actionsList}
        getOptionLabel={(e) => e?.tooltipLabel || getToolTipLabel(e?.iconType)}
        getOptionValue={(e) => e?.iconType}
        getOptionIcon={(e) => getIcon(e?.iconType, e?.icon)}
        suffixIcon={false}
        type="link"
        arrow={false}
      >
        <Icon icon="MdMoreVert" size="1.4em" color={tenantTheme.gray700} />
      </Dropdown>
    );
  };

  return (
    <Row gap="8px" wrap={wrapAction ? true : false} style={{ gap: 8 }} key={id}>
      {actionsList ? (
        isMobile ? (
          !!actionsList.length && renderMobileView()
        ) : !actionsList?.length ? (
          <div style={{ height: '32px' }} className="span-all" />
        ) : (
          actionsList.map((item) => {
            if (!item) return null;
            const {
              type = 'button',
              iconType,
              tooltipLabel,
              onClick,
              icon,
              show,
              style = {},
              verified,
              // btnType = 'light',
            } = item;
            const uniqueKey = `${type}-${iconType}-${id}`;
            if (show === false) return null;
            switch (type) {
              case 'button':
                return (
                  <Fragment key={uniqueKey}>
                    <Tooltip
                      id={uniqueKey}
                      placement="left"
                      title={tooltipLabel || getToolTipLabel(iconType)}
                      align={{ targetOffset: ['-30%', 0] }}
                      mouseLeaveDelay={0}
                      zIndex={998}
                    >
                    <span style={{ display: 'inline-block', cursor: item?.disabled ? 'not-allowed' : 'pointer' }}>
                      <Button
                        // type={btnType}
                        shape="circle"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick(id);
                        }}
                        disabled={item?.disabled}
                        icon={icon || getIcon(iconType, icon)}
                        // iconColor={color || tenantTheme['primary-color']}
                        style={{
                          '--btn-bg-color': tenantTheme['primary-color'] + '14',
                          '--btn-content-color': tenantTheme['primary-color'],
                          ...(style && style),
                        }}
                        {...buttonProps}
                      >
                        {!!verified && (
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {icon}
                          </span>
                        )}

                        {/* {iconType === 'assign-credits' && t('Assign Credits')} */}
                      </Button>
                      </span>
                    </Tooltip>
                  </Fragment>
                );
              default:
                break;
            }
          })
        )
      ) : (
        <div />
      )}
    </Row>
  );
}

export default TableActions;
