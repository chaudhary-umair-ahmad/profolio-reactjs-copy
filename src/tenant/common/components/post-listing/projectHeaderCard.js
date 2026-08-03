import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Collapse, Divider, Typography } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Avatar, Card, Flex, Group, Icon, ImageGallery, Popover, Text } from '../../../../components/common';
import { HistoryDot, HistoryPackage } from '../../../../container/pages/credits-usage/styled';
import { CardMetaStyled } from '../../../../container/pages/user-settings/style';
import { RegaCardStyle } from './styled';
const { Title } = Typography;

const PaymentToolTip = styled((props) => <Card {...props} />)`
  &.available-credit-card {
    background-color: ${tenantTheme['primary-light-4']};

    border-color: #f2fafa;
    border-radius: 6px;
  }
`;

const ProjectHeaderCard = ({ project }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { Panel } = Collapse;

  const paymentPlan = project?.payment_plans[0];

  const milestones = useMemo(() => {
    return [
      { label: t('Downpayment'), value: paymentPlan?.down_payment?.value_percentage },
      ...(paymentPlan?.type === 'milestones'
        ? [
            {
              label: t('Pre Handover'),
              value: (paymentPlan?.pre_handover_installments || []).reduce(
                (sum, milestone) => sum + (Number(milestone?.value_percentage) || 0),
                0,
              ),
            },
          ]
        : [
            {
              label: t('Installments'),
              value: (paymentPlan?.installments || []).reduce(
                (sum, milestone) => sum + (Number(milestone?.value_percentage) || 0),
                0,
              ),
            },
          ]),
      { label: t('On Handover'), value: paymentPlan?.handover_payment?.value_percentage || 0 },
      {
        label: t('Post Handover'),
        value:
          paymentPlan?.type == 'milestones'
            ? (paymentPlan?.post_handover_installments || []).reduce(
                (sum, milestone) => sum + (Number(milestone?.value_percentage) || 0),
                0,
              )
            : paymentPlan?.post_handover_payment?.value_percentage,
      },
    ];
  }, [paymentPlan]);

  const paymentPlanRatio = useMemo(() => {
    const downPayment = Number(paymentPlan?.down_payment?.value_percentage) || 0;
    const preHandoverInstallments = (
      paymentPlan?.type === 'milestones' ? paymentPlan?.pre_handover_installments : paymentPlan?.installments
    )?.reduce((sum, milestone) => sum + (Number(milestone?.value_percentage) || 0), 0);
    const onHandover = Number(paymentPlan?.handover_payment?.value_percentage) || 0;
    const postHandoverInstallments =
      paymentPlan?.type === 'milestones'
        ? (paymentPlan?.post_handover_installments || []).reduce(
            (sum, milestone) => sum + (Number(milestone?.value_percentage) || 0),
            0,
          )
        : Number(paymentPlan?.post_handover_payment?.value_percentage) || 0;
    const preHandover = downPayment + preHandoverInstallments;
    const postHandover = onHandover + postHandoverInstallments;
    return `${preHandover}/${postHandover}`;
  }, [paymentPlan]);

  const renderPostListingCard = () => {
    return (
      <Group template={isMobile ? 'initial' : '1fr auto'} gap={isMobile ? '14px 20px' : '24px'}>
        <div>
          <div className={isMobile ? 'mb-16' : 'mb-24'}>
            <div className="bold color-gray-dark fs12">{t('Project Name')}</div>

            <Title level={4} className="fs20 mb-0">
              {tenantUtils.getLocalisedString(project, 'title')}
            </Title>
          </div>

          <Group template={isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)'}>
            <CardMetaStyled
              avatar={
                <Avatar
                  shape="square"
                  src={project?.developer?.logo_url}
                  iconShapeRadius="6px"
                  style={{ '--ant-avatar-container-size': '36px' }}
                />
              }
              title={t('Developer')}
              titleFontWeight="400"
              description={tenantUtils.getLocalisedString(project?.developer, 'name')}
              style={{
                padding: 0,
                '--desc-font': isMobile ? '12px' : '14px',
                '--profile-space': isMobile ? '6px' : '10px',
                '--content-align': 'center',
                '--ant-color-text-heading': tenantTheme['gray700'],
                '--ant-font-size-lg': isMobile && '12px',
              }}
              titleFontSize="12px"
              descColor="#222"
            />

            <Flex align="start" vertical>
              <Text className="color-gray-dark fs12 mb-4">{t('Completion Percentage')}</Text>
              <Text>{`${project?.progress?.completion_percentage}%`}</Text>
            </Flex>
            <Flex align="start" vertical>
              <Text className="color-gray-dark fs12 mb-4">{t('Completion Date')}</Text>
              <Text>{project?.progress?.date}</Text>
            </Flex>
            <Flex align="start" vertical>
              <Text className="color-gray-dark fs12 mb-4">{t('Payment Plan')}</Text>
              <Flex align="center" gap="4px">
                <Text>{paymentPlanRatio}</Text>
                {renderPaymentPlanTooltip(project?.payment_plans[1])}
              </Flex>
            </Flex>
          </Group>
        </div>

        <div style={{ textAlign: 'right', width: '2', order: isMobile && '-1' }}>
          <ImageGallery
            rowTemplate="60px"
            images={project?.images}
            modalTitle={tenantUtils.getLocalisedString(project, 'title')}
            className={isMobile ? 'mb-16' : 'mb-0'}
            imagecount={3}
            imgStyle={{ '--grid-row-2': 'span 1', '--grid-row-1': 'span 2', gap: '4px' }}
            modalStyle={{ '--modal-img-height': 'auto' }}
          />
        </div>
      </Group>
    );
  };

  const renderPaymentPlanTooltip = () => {
    return (
      <Popover
        placement="bottom"
        content={
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <Title level={5} className="mb-16 fw-700">
              {t('Payment Plan')}
            </Title>
            <Flex vertical gap="12px">
              {milestones.map((milestone, index) => (
                <React.Fragment key={index}>
                  <Flex gap="8px">
                    <div>
                      <HistoryPackage>
                        <HistoryDot style={{ '--dot-color': `${tenantTheme['primary-color']}70` }} />
                        <Divider
                          style={{ '--ant-color-split': `${tenantTheme['primary-color']}20` }}
                          type="vertical"
                          orientation="center"
                        />
                      </HistoryPackage>
                    </div>
                    <div style={{ minWidth: '280px' }}>
                      <PaymentToolTip
                        className="available-credit-card"
                        type="secondary"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <Flex align="center" justify="space-between">
                          <Text>{milestone.label}</Text>
                          <Text className="text-primary fw-700">{milestone.value}%</Text>
                        </Flex>
                      </PaymentToolTip>
                    </div>
                  </Flex>
                </React.Fragment>
              ))}
            </Flex>
          </div>
        }
        trigger="hover"
      >
        <Icon icon="AiOutlineInfoCircle" iconProps={{ size: '14px', color: tenantTheme['primary-color'] }} />
      </Popover>
    );
  };

  return (
    <>
      <RegaCardStyle className={isMobile ? 'p-8' : 'p-12 mb-16'}>
        {isMobile ? (
          <Card className="rega-card-container">{renderPostListingCard()}</Card>
        ) : (
          <Panel header={renderPostListingCard()}></Panel>
        )}
      </RegaCardStyle>
    </>
  );
};

export default ProjectHeaderCard;
