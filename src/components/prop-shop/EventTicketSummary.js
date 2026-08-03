import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Divider, Row } from 'antd';

import { DATE_FORMAT, TIME_FORMAT } from '../../constants/formats';
import { Button, Icon, Number, Flex, TextWithIcon } from '../common';
import { getTimeDateString } from '../../utility/date';
import { OrderSummaryFull } from './Style';
import tenantConstants from '@constants';
import tenantTheme from '@theme';
import tenantUtils from '@utils';

const EventTicketSummary = ({
  checkoutButtonText = 'Pay Now',
  handleCheckout,
  buttonProps,
  disableProceedButton,
  showIcon = true,
  proceedButtonLoading,
  eventData = {},
}) => {
  const { t } = useTranslation();
  const rtl = useSelector((state) => state.app.AppConfig?.rtl);

  const formattedDate = getTimeDateString(eventData?.startTime, DATE_FORMAT);
  const formattedStartTime = getTimeDateString(eventData?.startTime, TIME_FORMAT);
  const formattedEndTime = getTimeDateString(eventData?.endTime, TIME_FORMAT);

  const vatAmount = eventData?.ticketPrice ? (eventData?.ticketPrice * eventData?.vatPercentage) / 100 : 0;
  const totalAmount = eventData?.ticketPrice ? eventData?.ticketPrice + vatAmount : 0;

  const hasNonZeroDecimals = (value) => {
    if (!tenantConstants?.SHOW_FRACTION_CURRENCY) return false;
    if (!value || isNaN(value)) return false;

    return value % 1 !== 0;
  };

  return (
    <Row align="center" justify="space-between">
      <OrderSummaryFull>
        <div>
          <Flex align="center" justify="space-between">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="fw-600 mb-4"
                style={{
                  color: '#53C18A',
                  fontSize: '14px',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxWidth: '98%',
                }}
              >
                {tenantUtils.getLocalisedString(eventData, 'title')}
              </div>
              <div
                className="fw-700"
                style={{
                  color: tenantTheme['base-color'],
                  fontSize: '20px',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxWidth: '98%',
                }}
              >
                {tenantUtils.getLocalisedString(eventData, 'description')}
              </div>
            </div>
            <div>
              <img
                src={eventData?.image}
                alt={eventData?.title}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 6,
                }}
              />
            </div>
          </Flex>
        </div>

        <Divider style={{ margin: '20px 0' }} />

        <div className="order-items">
          <div className="mb-8">
            <TextWithIcon
              icon={'EventDateIcon'}
              iconProps={{
                size: 18,
                color: tenantTheme['primary-color'],
                iconBackgroundColor: tenantTheme['primary-light-4'],
                hasBackground: true,
                iconContainerSize: '36px',
                iconRadius: '4.5px',
              }}
              title={t('Date')}
              value={formattedDate}
              textSize="12px"
              textColor="#707070"
              subClass="fw-700"
              gap="8px"
              textStyle={{
                color: '#707070',
                fontSize: '12px',
              }}
              valueStyle={{
                color: '#222222',
                fontSize: '14px',
                fontWeight: '700',
              }}
            />
          </div>

          <div className="mb-8">
            <TextWithIcon
              icon={'EventTimeIcon'}
              iconProps={{
                size: 18,
                color: tenantTheme['primary-color'],
                iconBackgroundColor: tenantTheme['primary-light-4'],
                hasBackground: true,
                iconContainerSize: '36px',
                iconRadius: '4.5px',
              }}
              title={t('Time')}
              value={`${formattedStartTime} - ${formattedEndTime}`}
              textSize="12px"
              textColor="#707070"
              subClass="fw-700"
              gap="8px"
              textStyle={{
                color: '#707070',
                fontSize: '12px',
              }}
              valueStyle={{
                color: '#222222',
                fontSize: '14px',
                fontWeight: '700',
              }}
            />
          </div>

          <div>
            <TextWithIcon
              icon={'EventLocationIcon'}
              iconProps={{
                size: 13,
                color: tenantTheme['primary-color'],
                iconBackgroundColor: tenantTheme['primary-light-4'],
                hasBackground: true,
                iconContainerSize: '36px',
                iconRadius: '4.5px',
              }}
              title={t('Venue')}
              value={tenantUtils.getLocalisedString(eventData, 'venue')}
              textSize="12px"
              textColor="#707070"
              subClass="fw-700"
              gap="8px"
              textStyle={{
                color: '#707070',
                fontSize: '12px',
              }}
              valueStyle={{
                color: '#222222',
                fontSize: '14px',
                fontWeight: '700',
              }}
            />
          </div>

          <Divider style={{ margin: '20px 0' }} />

          <Row align="center" justify="space-between" className="mb-4">
            <span className="color-gray-dark">{t('Ticket Price')}:</span>
            <Number
              type="price"
              value={eventData?.ticketPrice}
              fraction={hasNonZeroDecimals(eventData?.ticketPrice)}
              compact={false}
            />
          </Row>

          <Row align="center" justify="space-between">
            <span className="color-gray-dark">{t('VAT (15%)')}:</span>
            <Number type="price" value={vatAmount} fraction={hasNonZeroDecimals(vatAmount)} compact={false} />
          </Row>

          <Divider style={{ margin: '20px 0' }} />

          <Row align="center" justify="space-between">
            <span className="fw-700 fs16">{t('Total')}:</span>
            <Number
              className="color-primary fw-700 fs16"
              type="price"
              value={totalAmount}
              fraction={hasNonZeroDecimals(totalAmount)}
              compact={false}
            />
          </Row>

          <Button
            type="primary"
            size="large"
            disabled={disableProceedButton}
            onClick={handleCheckout}
            loading={proceedButtonLoading}
            block
            {...buttonProps}
            className="mb-12"
          >
            <span>{checkoutButtonText}</span>
            {showIcon && <Icon icon={!rtl ? 'FiArrowRight' : 'FiArrowLeft'} />}
          </Button>

          <div className="color-gray-dark fs12" style={{ lineHeight: 1.5 }}>
            {t(
              'Registering for an event and failing to attend without prior cancellation can prevent your ability to make future reservations.',
            )}
          </div>
        </div>
      </OrderSummaryFull>
    </Row>
  );
};

export default EventTicketSummary;
