import { Col, Row } from 'antd';
import React, { useRef } from 'react';
import { Button, ConfirmationModal, Group, Icon, Popover, notification } from '../common';
import { DateItem, ListUsedCriteria, ListingCountStyled } from './styled';

import { useTranslation } from 'react-i18next';
import { useStopAutoPlanMutation } from '../../apis/listings';
import { getTimeDateString } from '../../utility/date';
import { IconStyled } from '../common/icon/IconStyled';

const PropListingType = (props) => {
  const { percentage, credit, ...rest } = props;
  return (
    <Col>
      <Group template="max-content auto" gap="8px" {...rest}>
        <IconStyled color={credit?.iconColor}>
          <Icon icon={credit?.icon} />
        </IconStyled>
        <div className="d-flex y-center" style={{ gap: 8 }}>
          <span>{credit?.title}</span>
          <ListingCountStyled>
            {credit?.available * (percentage / 100) ? (credit?.available * (percentage / 100)).toFixed(2) : '-'}
          </ListingCountStyled>
        </div>
      </Group>
    </Col>
  );
};

function AppliedCriteria({ plan, credits, onStopPlan, fetchAppliedPlan }) {
  const confirmModal = useRef();
  const { t } = useTranslation();

  const content = (
    <ol type="1">
      <li>{t("By selecting the 'Credit Type' you are choosing those credits which you want to utilise")}</li>
      <li>
        {t(
          "The 'Percentage' is to select exactly how much (quantity in percent) of your chosen credits you wish to utilise",
        )}
      </li>
      <li>{t("The 'Utilised Credits' shows the exact amount of credits that will be used.")}</li>
      <li>{t("'Add Credit' adds another Row.")}</li>
    </ol>
  );

  const [stopAutoPlan, {isLoading}] = useStopAutoPlanMutation();

  const stopPlan = async () => {
    const response = await stopAutoPlan(plan?.id);
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        onStopPlan();
        confirmModal?.current && confirmModal?.current?.hideModal();
        fetchAppliedPlan();
      }
    }
  };

  return (
    <>
      <ConfirmationModal
        ref={confirmModal}
        title={t('Stop Plan')}
        onSuccess={() => stopPlan()}
        onCancel={() => confirmModal?.current && confirmModal.current.hideModal()}
      >
        <div> {t('Are you sure to stop the plan?')}</div>
      </ConfirmationModal>

      <Row align="bottom">
        <Col xs={24} xl={{ span: 20, offset: 2 }}>
          {plan?.status == 'active' && (
            <h3 style={{ fontWeight: '400', fontSize: '1rem' }} className="mb-20">
              {t('An auto utilization is currently active')}{' '}
              <Popover placement="top" title={t('How this works')} content={content} action="hover">
                <Icon icon="AiOutlineInfoCircle" color="#a3a3a3" />
              </Popover>
            </h3>
          )}
          {plan?.status == 'low_credit' && (
            <h3 style={{ fontWeight: '400', fontSize: '1rem' }} className="mb-20">
              {t('Your current credits are insufficient for the utilisation plan to work.')}{' '}
              <Popover
                placement="bottomLeft"
                content={t('Please create a new plan according to your available credits to continue.')}
                action="hover"
              >
                <Icon icon="AiOutlineInfoCircle" color="#a3a3a3" />
              </Popover>
            </h3>
          )}
          <div className="mb-8">
            <ListUsedCriteria>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={8} lg={5}>
                  <DateItem className="mb-16">
                    <strong style={{ fontSize: 12 }}>{t('Last Applied')}</strong>
                    <div style={{ fontSize: 14 }}>{getTimeDateString(plan?.utilisation_details?.[0]?.date_added)}</div>
                  </DateItem>
                  <DateItem>
                    <strong style={{ fontSize: 12 }}>{t('Next Application')}</strong>
                    <div style={{ fontSize: 14 }}>{getTimeDateString(plan?.plan_execution_date)}</div>
                  </DateItem>
                </Col>
                <Col xs={24} sm={12} md={16} lg={13}>
                  <Row justify="start" gutter={[16, 16]}>
                    {plan &&
                      plan?.utilisation_details?.map((item) => (
                        <PropListingType
                          key={item.product_id}
                          credit={credits?.length ? credits.find((e) => e.id == item.product_id) : {}}
                          {...item}
                        />
                      ))}
                  </Row>
                </Col>
                <Col xs={24} lg={6}>
                  {plan.status === 'active' && (
                    <Button
                      type="danger"
                      size="large"
                      transparented
                      block
                      onClick={() => confirmModal?.current && confirmModal.current.showModal()}
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      {t('Stop')}
                    </Button>
                  )}
                </Col>
              </Row>
            </ListUsedCriteria>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default AppliedCriteria;
