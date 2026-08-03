import tenantTheme from '@theme';
import { List, Typography } from 'antd';
import cx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { hoverListingQualityDonut } from '../../services/analyticsService';
import { Button, Flex, Group, Heading } from '../common';
import { LegendHorizontal, PopoverContainer, QualityPopover } from './styled';
import DrawerPopover from '../common/drawerPopover/drawerPopover';
const { Title, Text } = Typography;

const ListingHealth = ({ dataToShow, overallPercentageScore, overallScoreIcon, statusId, headerBg }) => {
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const { user } = useSelector((state) => state.app.loginUser);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const { t } = useTranslation();

  const renderPopOverHeader = () => {
    return (
      <Group
        template="auto auto"
        className={cx(!isMobile ? 'px-24' : '')}
        gap="10px"
        style={{
          alignItems: 'center',
          backgroundColor: `color-mix(in srgb, ${tenantTheme[headerBg]} 10%, #fff)`,
          ...( !isMobile ? { paddingTop: '18px', paddingBottom: '18px' } : {} ),
        }}
      >
        <div>
          <Title level={5} className="fz-16" style={{ fontWeight: 700, margin: 0 }}>
            {t('Overall Quality')}
          </Title>
          <Text className="fz-14" style={{ color: '#707070', fontWeight: 400, margin: 0 }}>
            {t('Higher quality means more listing visibility & leads')}
          </Text>
        </div>

        <Flex align="center" justify="end">
          <LegendHorizontal>{overallScoreIcon}</LegendHorizontal>{' '}
        </Flex>
      </Group>
    );
  };

  const renderItem = (e) => {
    if (e.isHeading) {
      return (
        <List.Item style={{ borderBottom: 'none', padding: '16px', paddingBottom: '5px', margin: 0 }}>
          <Flex justify="space-between" align="center" style={{ width: '100%' }}>
            <Heading
              className="color-gray-lighter"
              style={{ fontSize: '14px', fontWeight: 600, color: '#1F1F1F', margin: 0 }}
              as="h6"
            >
              {e.title}
            </Heading>
            {!!e.showButton && (
              <Button
                style={{ borderRadius: '6px' }}
                type="primaryOutlined"
                size={isMobile && 'small'}
                onClick={() => {
                  setPopoverVisible(false);
                  e.onClick();
                }}
              >
                {e.button}
              </Button>
            )}
          </Flex>
        </List.Item>
      );
    }

    return (
      <List.Item
        style={{
          ...((e.isImagesSection && e.isFirstImagesItem) || e.hideBorderBottom ? { borderBottom: 'none' } : {}),
          padding: '16px',
          paddingTop: e?.isFirstImagesItem 
            ? '12px' 
            : e?.title 
              ? '12px' 
              : '0',
          margin: 0,
        }}
      >
        <Flex justify="space-between" align={isMobile ? 'start' : 'center'}>
          <div>
            {e.title && (
              <Heading
                className="color-gray-lighter"
                style={{ fontSize: '14px', fontWeight: 600, color: '#1F1F1F', margin: 0, marginBottom: '12px' }}
                as="h6"
              >
                {e.title}
              </Heading>
            )}

            <Flex align="center" gap="16px">
              {e?.scoreIcon}

              <div>
                <Title level={5} style={{ fontSize: '14px', margin: 0 }}>
                  {e.subTitle}
                </Title>
                <Text type="secondary" className="fz-12" style={{ margin: 0 }}>
                  {e.message}
                </Text>
              </div>
            </Flex>
          </div>
        </Flex>
      </List.Item>
    );
  };

  return (
    <>
      <DrawerPopover
        headerStyle={{
          alignItems: 'start',
          backgroundColor: `color-mix(in srgb, ${tenantTheme?.[headerBg]} 10%, #fff)`,
        }}
        bodyStyle={{ '--ant-padding-lg': 0, padding: 0, margin: 0 }}
        getTooltipContainer={null}
        getPopupContainer={null}
        overlayClassName="quality-popupContainer"
        footer={null}
        height={'auto'}
        title={renderPopOverHeader()}
        onMouseEnter={() => hoverListingQualityDonut(user, statusId, overallPercentageScore)}
        placement='right'
        content={
          <QualityPopover
            header={!isMobile && renderPopOverHeader()}
            itemLayout="vertical"
            dataSource={dataToShow}
            renderItem={(e) => (e.isHeading || e.subTitle || e.message ? renderItem(e) : null)}
          />
        }
      >
        {overallScoreIcon}
      </DrawerPopover>
    </>
  );
};
export default ListingHealth;
