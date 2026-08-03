import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Divider, Tooltip, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  emailButtonClickEvent,
  phoneCallButtonClickEvent,
  whatsappButtonClickEvent,
} from '../../services/analyticsService';
import { openExternal } from '../../utility/utility';
import { Avatar, Button, Card, Flex, Heading, TextWithIcon } from '../common';
import RenderTextLtr from '../render-text/render-text';
import { useGetAccountManagerInfoQuery } from '../../apis/common';

const { Text } = Typography;

const AccountManagerWidget = ({ user, collapsed, toggleCollapsed }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { t } = useTranslation();

  const { data: accountManager } = useGetAccountManagerInfoQuery(user);

  const onClickEmail = () => {
    emailButtonClickEvent(user);
    openExternal(accountManager?.account_manager?.assignee?.email, 'email');
  };

  const onClickPhone = () => {
    phoneCallButtonClickEvent(user);
    openExternal(accountManager?.account_manager?.assignee?.phone);
  };

  const onClickWhatsapp = () => {
    whatsappButtonClickEvent(user);
    openExternal(accountManager?.account_manager?.assignee?.phone, 'whatsapp');
  };

  if (!accountManager) return null;

  return (
    <>
      <Card
        style={{
          borderWidth: 1,
          bottom: 0,
          transition: 'all 0.3s',
          borderColor: tenantTheme['primary-light-1'],
          backgroundColor: tenantTheme['primary-light'],
        }}
      >
        <div className="mb-8" style={{ color: tenantTheme.gray700 }}>
          <TextWithIcon
            gap="8px"
            title={t('SUPPORT')}
            icon="SupportIcon"
            fontWeight={700}
            iconProps={{ size: 16, color: tenantTheme['primary-color'] + 'aa' }}
          ></TextWithIcon>
        </div>

        <Flex gap="8px">
          <div style={{ position: 'relative' }}>
            <Avatar iconSize="22px" size={38} src={accountManager?.account_manager?.assignee?.picture?.url} />
          </div>

          <Tooltip
            placement="top"
            title={tenantUtils.getLocalisedString(accountManager?.account_manager?.assignee, 'name')}
          >
            <Heading as="h6" className="mb-0" fontWeight={700}>
              {tenantUtils.getLocalisedString(accountManager?.account_manager?.assignee, 'name')}
            </Heading>
            <Text className="text-muted fz-12">{t('Contact your account manager for quick support')}</Text>
          </Tooltip>
        </Flex>
        <Flex gap="10px" style={{ marginBlockStart: '14px' }}>
          <Button
            size={!isMobile && 'small'}
            icon={'FaEnvelope'}
            iconSize={isMobile && '12px'}
            type="primaryOutlined"
            block
            onClick={onClickEmail}
          >
            {!isMobile && t('Email')}
          </Button>
          <Button
            size={!isMobile && 'small'}
            icon="RiWhatsappFill"
            iconColor="#25D366"
            iconSize={isMobile && '12px'}
            block
            type="primaryOutlined"
            onClick={onClickWhatsapp}
          >
            {!isMobile && t('WhatsApp')}
          </Button>
          <Button
            size="small"
            icon="IoCall"
            iconSize={isMobile && '12px'}
            type="primaryOutlined"
            block
            onClick={onClickPhone}
          >
            {!isMobile && <RenderTextLtr text={accountManager?.account_manager?.assignee?.phone} />}
          </Button>
        </Flex>
      </Card>
      <Divider />
    </>
  );
};

export default AccountManagerWidget;
