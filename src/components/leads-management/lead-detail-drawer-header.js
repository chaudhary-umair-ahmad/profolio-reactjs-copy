import tenantTheme from '@theme';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DATE_FORMAT } from '../../constants/formats';
import { getTimeDateString } from '../../utility/date';
import { joinBytItems, openExternal } from '../../utility/utility';
import { BayutMatchBadge, Button, Card, Flex, Group, Icon, TextWithIcon, Title, Tag } from '../common';
import Statistic from '../common/statistic';
import RenderTextLtr from '../render-text/render-text';
import { LeadDetailHeaderSkeleton } from './lead-detail-drawer-skeleton';
import LeadNameField from './lead-name';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

const { Text } = Typography;
const LeadDetailDrawerHeader = ({
  leadData,
  detailDrawerRef,
  fetchData,
  clientId,
  leadId,
  leadDataLoading,
  showBayutTag = false,
  showInteractionSources = false,
  leadInterests
}) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser.user);
  const { t } = useTranslation();
  const isBayutMatch = leadInterests?.list?.[0]?.lead_source?.type === 'bayut_match';

  const onClickEmail = () => {
    openExternal(leadData?.email, 'email');
  };

  const onClickPhone = () => {
    openExternal(leadData?.phone);
  };

  const onClickWhatsapp = () => {
    openExternal(leadData?.whatsapp, 'whatsapp');
  };

  const items = useMemo(
    () => [
      {
        name: 'Email',
        icon: 'MdEmail',
        value: leadData?.email,
      },
      {
        name: 'Phone',
        icon: 'IoCall',
        value: leadData?.phone && <RenderTextLtr text={leadData?.phone} />,
      },
      {
        name: 'Date',
        icon: 'FiCalendar',
        value: getTimeDateString(leadData?.createdAt, DATE_FORMAT),
      },
      ...(user?.is_agency_admin
        ? [
            {
              name: 'Managed by',
              icon: 'FiUser',
              value: leadData?.managedBy ? `${t('Managed by')} ${leadData?.managedBy}` : null,
            },
          ]
        : []),
    ],
    [leadData],
  );

  return (
    <>
      {leadData && !!Object.keys(leadData).length && (
        <>
          <div>
            <Flex align="center" justify="space-between" className="mb-12">
              <Flex align="center" gap="10px">
                <Button
                  size="small"
                  style={{ borderRadius: '50%', border: 0, height: '28px', width: '28px' }}
                  iconProps={{ color: '#c00' }}
                  type="primaryOutlined"
                  icon="IoMdArrowRoundBack"
                  onClick={() => {
                    detailDrawerRef.current.closeDrawer();
                  }}
                  iconSize="18px"
                  iconClassName="flipX"
                />
                <Text className="color-gray-dark" style={{ marginBotton: 5 }}>
                  {t('ID')}: {leadData?.id}
                </Text>
              </Flex>
              {showBayutTag && (
                <Tag
                  color="#28B16D24"
                  shape="round"
                  style={{
                    marginInlineStart: 'auto',
                    marginInlineEnd: '12px',
                    lineHeight: '20px',
                    marginBottom: 5,
                  }}
                >
                  <TextWithIcon
                    icon="LogoBayutIntelligence"
                    iconProps={{ size: '17px' }}
                    fontWeight={500}
                    value={t('Bayut Intelligence')}
                    style={{ fontSize: '10px' }}
                    gap="3px"
                    textColor="#3ab16c"
                  />
                </Tag>
              )}
            </Flex>
            <Flex align="center" gap="8px" wrap className={isMobile ? 'mb-4' : 'mb-12'}>
              <LeadNameField leadData={leadData} refetchDetail={fetchData} clientId={clientId} leadId={leadId} />
              <BayutMatchBadge
                show={isBayutMatch}
                style={{
                  height: '20px',
                  width: '94px',
                  borderRadius: '34px',
                  fontSize: '12px',
                }}
              />
            </Flex>
            <Flex className="mb-16" gap={isMobile ? '6px' : '10px'} wrap={true}>
              {joinBytItems(
                items.map(
                  (item, i) =>
                    item.value && (
                      <TextWithIcon
                        key={i}
                        icon={item.icon}
                        iconProps={{ color: tenantTheme['gray500'], size: '12px' }}
                        textColor={tenantTheme.gray700}
                        value={item.value}
                        textSize={isMobile ? '12px' : '14px'}
                        gap={isMobile ? '4px' : '8px'}
                      />
                    ),
                ),
                <Icon icon="GoDotFill" color={tenantTheme['gray500']} size={isMobile ? '8px' : '12px'} />,
              )}
            </Flex>

            {showInteractionSources && (
              <>
                <Group
                  className="mb-24"
                  template={isMobile ? '1fr' : '450px auto'}
                  style={{ justifyContent: 'space-between' }}
                >
                  <Flex gap="10px" style={{ width: isMobile && '94vw' }}>
                    <Button
                      size="small"
                      icon="MdMail"
                      iconSize="1em"
                      type="primaryOutlined"
                      block
                      onClick={onClickEmail}
                      disabled={!leadData?.email}
                    >
                      {t('Email')}
                    </Button>
                    <Button
                      size="small"
                      icon="RiWhatsappFill"
                      iconColor="#25D366"
                      iconSize="1em"
                      block
                      type="primaryOutlined"
                      onClick={onClickWhatsapp}
                      disabled={!leadData?.whatsapp}
                    >
                      {t('WhatsApp')}
                    </Button>
                    <Button
                      size="small"
                      icon="IoCall"
                      iconSize="1em"
                      type="primaryOutlined"
                      block
                      onClick={onClickPhone}
                      disabled={!leadData?.phone}
                    >
                      <RenderTextLtr text={t('Call')} />
                    </Button>
                  </Flex>
                </Group>

                <Title level={5} className="mb-8" style={{ paddingInline: isMobile && '12px' }}>
                  {t('Lead Interaction Sources')}
                </Title>
                <Group template={'repeat(auto-fit, minmax(12ch, 1fr))'} gap="10px" className="mb-0">
                  {leadDataLoading ? (
                    <LeadDetailHeaderSkeleton />
                  ) : (
                    leadData?.leadSources?.map((source, index) => (
                      <Card
                        key={index}
                        className="w-100"
                        style={{ backgroundColor: source?.backgroundColor, border: 0 }}
                      >
                        <Statistic
                          icon={source?.icon}
                          iconProps={{
                            ...source?.iconProps,
                            hasBackground: true,
                            color: source?.iconColor,
                            style: { '--icon-bg-color': '#fff' },
                          }}
                          title={t(source?.title)}
                          formatter={<Number value={source?.value ? source.value : 0} compact={false} />}
                          value={source?.value ? source.value : 0}
                          fontSize="16px"
                          trends={false}
                        />
                      </Card>
                    ))
                  )}
                </Group>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default LeadDetailDrawerHeader;
