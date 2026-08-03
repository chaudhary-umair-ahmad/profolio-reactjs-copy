import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Divider, Space, Typography } from 'antd';
import { t } from 'i18next';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { DATE_FORMAT } from '../../../constants/formats';
import { getTimeDateString } from '../../../utility/date';
import { Alert, Drawer, Flex, Icon, Popover, TextWithIcon } from '../../common';
import { DateTime } from './date-time';

const { Text } = Typography;

export const TaskDetail = (props) => {
  const { childTask, parentTask } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const taskDetailDrawerRef = useRef();

  const renderAlert = () => {
    return (
      <Alert
        type="error"
        icon={<Icon size="14px" icon="BsFillInfoCircleFill" />}
        showIcon
        style={{ '--ant-line-width': 0, fontSize: '12px', '--ant-color-text-heading': tenantTheme['danger-color'] }}
        message={t('Your next planned task is overdue')}
      />
    );
  };
  const renderContent = () => {
    return (
      <>
        <Text type="secondary" className="fz-12">
          {t('Last Completed Task')}
        </Text>
        <div className="fw-700 mb-12">{tenantUtils.getLocalisedString(parentTask, 'title')}</div>
        {parentTask.date && (
          <>
            <Flex justify="space-between" className="fs12">
              <TextWithIcon
                value={t('Completion Date')}
                icon="FiCalendar"
                iconProps={{ size: '12px', color: tenantTheme.gray550 }}
                textColor={tenantTheme.gray700}
                textSize="12px"
              />
              {getTimeDateString(parentTask.date, DATE_FORMAT)}
            </Flex>
            <Divider style={{ marginBlock: 4 }} />
          </>
        )}
        {parentTask.agent_name && (
          <>
            <Flex justify="space-between" className="fs12">
              <TextWithIcon
                value={t('Completed By')}
                icon="IoMdTime"
                iconProps={{ size: '12px', color: tenantTheme.gray550 }}
                textColor={tenantTheme.gray700}
                textSize="12px"
              />
              {tenantUtils.getLocalisedString(parentTask, 'agent_name')}
            </Flex>
          </>
        )}

        <Divider variant="dashed" style={{ marginBlock: isMobile ? 12 : 16 }} />

        {childTask.isOverdue && renderAlert()}
      </>
    );
  };

  const renderDrawer = () => {
    return (
      <>
        <Drawer
          ref={taskDetailDrawerRef}
          headerStyle={{ alignItems: 'start', '--ant-font-weight-strong': 700 }}
          placement={'bottom'}
          title={t('Task History Details')}
          stopPropagation
          style={{ '--ant-padding-lg': '16px' }}
          height="auto"
          footer={null}
        >
          {renderContent()}
        </Drawer>
        <Flex
          align="center"
          gap="8px"
          onClick={(e) => {
            taskDetailDrawerRef?.current?.openDrawer();
            e.stopPropagation();
          }}
        >
          <Text style={{ ...(childTask.isOverdue && { color: tenantTheme['danger-color'] }), fontSize: '12px' }}>
            {tenantUtils.getLocalisedString(childTask, 'title')}
          </Text>
          <Icon icon="TimelineIcon" color={tenantTheme['gray500']} size={'12px'} />
        </Flex>
      </>
    );
  };
  const renderPopover = () => {
    const SHOW_POPOVER = !!parentTask;

    return (
      <Popover
        // open={SHOW_POPOVER}
        action={SHOW_POPOVER ? 'hover' : null}
        content={SHOW_POPOVER && <div style={{ width: '360px' }}>{renderContent()}</div>}
        getPopupContainer={() => document.body}
      >
        <Space.Compact style={{ gap: '4px' }}>
          <div style={childTask.isOverdue ? { color: tenantTheme['danger-color'] } : {}}>
            {tenantUtils.getLocalisedString(childTask, 'title')}
          </div>
          {SHOW_POPOVER && <Icon icon="TimelineIcon" color={tenantTheme['gray500']} size={'14px'} />}
        </Space.Compact>
      </Popover>
    );
  };

  return childTask ? (
    <>
      {isMobile ? renderDrawer() : renderPopover()}
      <DateTime
        textSize={isMobile && '10px'}
        iconSize={isMobile && '10px'}
        value={childTask.date}
        showTime
        // wrapperClass={isMobile && 'align-center-v'}
        // wrapperStyle={{ gap: isMobile && '10px' }}
      />
    </>
  ) : (
    '-'
  );
};
