import tenantTheme from '@theme';
import { Divider, Typography } from 'antd';
import { t } from 'i18next';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { DATE_FORMAT } from '../../../constants/formats';
import { getTimeDateString } from '../../../utility/date';
import { BayutMatchBadge, BAYUT_MATCH_SOURCE, Button, Drawer, Flex, Icon, Popover, Tag, TextWithIcon } from '../../common';
import RenderTextLtr from '../../render-text/render-text';

const { Text } = Typography;

export const LeadInfo = (props) => {
  const { id, email, phone, name, created_at, hideContactInfo, managedBy, user_type, onAddNameClick, source } = props;
  const showBayutMatch = source === BAYUT_MATCH_SOURCE;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const user = useSelector((state) => state.app.loginUser.user);
  const is_zameen_package_user = user?.is_zameen_package_user;
  const leadInfoDrawerRef = useRef();

  const renderContent = () => {
    const fields = [
      { label: 'Email', icon: 'FaEnvelope', value: email },
      { label: 'Phone', icon: 'MdPhone', value: <RenderTextLtr text={phone} /> },
      { label: 'Date Added', icon: 'FiCalendar', value: getTimeDateString(created_at, DATE_FORMAT) },
      ...(user?.is_agency_admin ? [{ label: 'Managed by', icon: 'FiUser', value: managedBy }] : []),
    ];
    return (
      <>
        <Flex vertical className="lhn mb-12">
          <Text className="fz-12" style={{ color: tenantTheme.gray700 }}>
            {t('ID')} : {id}
          </Text>
          <strong>{name}</strong>
        </Flex>

        {fields?.map(
          (item, index) =>
            item?.value && (
              <React.Fragment key={index}>
                <Flex gap="12px" justify="space-between">
                  <TextWithIcon
                    icon={item?.icon}
                    iconProps={{ size: '12px', color: tenantTheme.gray500 }}
                    textColor={tenantTheme.gray700}
                    value={t(item?.label)}
                    textSize="12px"
                  />
                  {item?.value}
                </Flex>
                {index < fields?.length - 1 && <Divider style={{ marginBlock: 4 }} />}
              </React.Fragment>
            ),
        )}
      </>
    );
  };

  const renderDrawer = () => {
    return (
      <Flex>
        <Drawer
          ref={leadInfoDrawerRef}
          headerStyle={{ alignItems: 'start', '--ant-font-weight-strong': 700 }}
          placement={'bottom'}
          title={t('Lead Details')}
          stopPropagation
          style={{ '--ant-padding-lg': '16px' }}
          height="auto"
          footer={null}
        >
          {renderContent()}
        </Drawer>
        <Flex
          gap="4px"
          align={'center'}
          onClick={(e) => {
            leadInfoDrawerRef?.current?.openDrawer();
            e.stopPropagation();
          }}
        >
          {renderNameField()}
        </Flex>
        {renderAddNameField()}
      </Flex>
    );
  };

  const renderPopover = () => {
    return (
      <Flex>
        <Flex>
          <Popover
            content={<div style={{ width: '360px' }}>{renderContent()}</div>}
            getPopupContainer={() => document.body}
            placement={'topLeft'}
          >
            <Flex align={'center'} gap="4px">
              {renderNameField()}
            </Flex>
          </Popover>
          {renderAddNameField()}
          {showBayutMatch && renderBayutMatch()}
        </Flex>
        {!!user_type && is_zameen_package_user && (
          <Tag
            color={user_type === 'free' ? 'green' : 'red'}
            shape="round"
            style={{ alignSelf: 'center', fontSize: 10, marginLeft: 10 }}
          >
            {user_type === 'free' ? 'Free' : 'Paid'}
          </Tag>
        )}
      </Flex>
    );
  };

  const renderAddNameField = () => {
    return (
      !name && (
        <Button
          size="small"
          icon="FaSquarePlus"
          iconSize="1em"
          type={'link'}
          onClick={(e) => {
            if (onAddNameClick) {
              onAddNameClick(e, props);
            }
            e.stopPropagation();
          }}
        >
          {t('Add Name')}
        </Button>
      )
    );
  };

  const renderBayutMatch = () => (
    <BayutMatchBadge
      show
      size="medium"
      style={{
        ...(rtl ? { marginRight: '10px' } : { marginLeft: '10px' }),
        height: '20px',
        width: '94px',
        borderRadius: '34px',
      }}
    />
  );

  const renderNameField = () => {
    return (
      <>
        {name ? name.slice(0, 40) : t('Unnamed Lead')}
        <Icon icon="BsFillInfoCircleFill" color={tenantTheme['gray500']} size={'12px'} />
      </>
    );
  };

  return (
    <>
      {isMobile ? renderDrawer() : renderPopover()}
      {!hideContactInfo && (
        <Flex vertical>
          {email && (
            <TextWithIcon
              icon="FaEnvelope"
              iconProps={{ size: '12px', color: tenantTheme.gray500 }}
              textColor={tenantTheme.gray700}
              value={email}
              textSize="12px"
            />
          )}
          {phone && (
            <TextWithIcon
              icon="MdPhone"
              iconProps={{ size: '12px', color: tenantTheme.gray500 }}
              textColor={tenantTheme.gray700}
              value={<RenderTextLtr text={phone} />}
              textSize="12px"
            />
          )}
        </Flex>
      )}
    </>
  );
};
