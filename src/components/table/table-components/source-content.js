import tenantTheme from '@theme';
import { Typography } from 'antd';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Drawer, Flex, Icon, Popover, TextWithIcon } from '../../common';
import { DateTime } from './date-time';
import CallRecording from './call-recording';
import { capitalizeFirstLetter } from '../../../utility/utility';
const { Text } = Typography;

export const SourceContent = (props) => {
  const {
    sourceTitle,
    content,
    date,
    recording_uuid,
    icon,
    iconProps,
    hideContent,
    fontWeight,
    characterLimit = 40,
    callStatus,
    leadId,
    extra,
  } = props;
  const IS_EXPANDABLE = content?.length > characterLimit;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const sourceContentDrawerRef = useRef();

  const renderContent = () => {
    return (
      <Flex vertical gap="12px" style={{ width: !isMobile && '350px' }}>
        <Flex justify="space-between" align="center" gap="20px">
          <TextWithIcon
            icon={icon}
            iconProps={{
              size: '14px',
              ...iconProps,
              color: tenantTheme['primary-light-1'],
            }}
            value={sourceTitle}
            textSize={'14px'}
            style={{ lineHeight: 0 }}
          />
          <DateTime value={date} />
        </Flex>
        {content && (
          <div className={isMobile ? 'fz-12' : 'fz-14'} style={{ color: tenantTheme['gray900'] }}>
            {content && content}
          </div>
        )}
        {recording_uuid && <CallRecording recording_uuid={recording_uuid} leadId={leadId} />}
      </Flex>
    );
  };

  return (
    <>
      <Popover
        onClick={(e) => {
          isMobile && content && sourceContentDrawerRef?.current?.openDrawer();
          e.stopPropagation();
        }}
        content={renderContent()}
        action={!isMobile && IS_EXPANDABLE ? 'hover' : null}
        placement="bottomLeft"
        className={'pointer'}
        getPopupContainer={() => document.body}
      >
        <Flex
          align="center"
          justify={isMobile ? 'space-between' : 'flex-start'}
          style={{ width: isMobile ? '100%' : 'auto' }}
          gap={'6px'}
        >
          <Flex align="center" gap={isMobile ? '6px' : '8px'}>
            <TextWithIcon
              icon={icon}
              iconProps={{ size: '.9em', color: tenantTheme['primary-light-1'], ...iconProps }}
              fontWeight={fontWeight || 600}
              value={sourceTitle}
              style={{ fontSize: isMobile && '12px' }}
              gap={isMobile ? '6px' : '8px'}
            />

            {callStatus && <div className="text-muted fz-12">({capitalizeFirstLetter(callStatus)})</div>}
            {IS_EXPANDABLE && <Icon icon="BsFillInfoCircleFill" color={tenantTheme['gray500']} size={'12px'} />}
          </Flex>

          {extra && <>{extra}</>}
        </Flex>
      </Popover>
      <Flex vertical style={{ marginTop: '4px' }}>
        {!hideContent && <>{recording_uuid && <CallRecording recording_uuid={recording_uuid} leadId={leadId} />}</>}

        {!hideContent && content && (
          <Text
            className="d-block"
            style={{
              textWrap: 'auto',
              maxWidth: !isMobile ? '250px' : undefined,
              fontSize: isMobile && '12px',
              color: tenantTheme['gray700'],
            }}
          >
            {IS_EXPANDABLE ? `${content?.slice(0, characterLimit)}...` : content}
          </Text>
        )}
        {!isMobile && <DateTime value={date} />}
      </Flex>

      <Drawer
        ref={sourceContentDrawerRef}
        headerStyle={{ alignItems: 'start', '--ant-font-weight-strong': 700 }}
        title={'Last Interaction'}
        placement={'bottom'}
        stopPropagation
        height="auto"
        style={{ '--ant-padding-lg': '16px' }}
        footer={null}
      >
        {renderContent()}
      </Drawer>
    </>
  );
};
