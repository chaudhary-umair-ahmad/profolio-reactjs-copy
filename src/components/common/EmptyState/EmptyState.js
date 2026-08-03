import { Typography } from 'antd';
import { t } from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getBaseURL } from '../../../utility/env';
import { EmptyListing, EmptyListingWidget, NetworkError, NoRecord } from '../../svg';
import { Button } from '../button/button';
import Heading from '../heading/heading';
import { EmptyStateWrapper } from './style';
import tenantTheme from '@theme';

const { Text } = Typography;

const EmptyState = (props) => {
  const { t } = useTranslation();
  const { type } = props;

  switch (type) {
    case 'listings-mobile':
      return <ListingCountState {...props} />;
    case 'listings-count-dashboard':
      return <ListingCountState {...props} />;
    case 'analytics-dashboard':
      return <AnalyticsState {...props} />;
    case 'quota-credits-dashboard':
      return <EmptyStateBlock {...props} />;
    case 'table':
      return (
        <EmptyStateBlock
          title={t('No Record Found')}
          illustration={<EmptyListing color={tenantTheme['primary-light-2']} />}
          {...props}
        />
      );
    case 'maintenance':
      return (
        <EmptyStateBlock
          className="px-16"
          illustration={
            <img src={`${getBaseURL()}/profolio-assets/images/maintenance.svg`} alt={t('Under maintenance')} />
          }
          title={t('We are under scheduled maintenance.')}
          message={t('Our website is currently undergoing maintenance. We will be back online shortly!')}
          hideRetryButton
          gap="64px"
          headingType="h4"
          style={{ marginBlockStart: '-8vh' }}
          {...props}
        />
      );
    default:
      return <EmptyStateBlock {...props} />;
  }
};

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onClick: PropTypes.func,
  btnText: PropTypes.string,
  illustration: PropTypes.node,
  children: PropTypes.node,
  button: PropTypes.node,
  buttonLoading: PropTypes.bool,
  hideRetryButton: PropTypes.bool,
  accentColor: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf([
    'listings-count-dashboard',
    'analytics-dashboard',
    'quota-credits-dashboard',
    'table',
    'listings-count-dashboard-mobile',
    'listings-mobile',
    'maintenance',
  ]),
};

export default EmptyState;

const ListingCountState = ({
  title = '',
  message = '',
  onClick,
  buttonLoading,
  hideRetryButton,
  accentColor,
  ...rest
}) => {
  return (
    <div>
      <EmptyListingWidget color={accentColor} />
      <Heading className={rest.titleClassName} as="h5">
        {title}
      </Heading>
      <p>{message}</p>
      {!hideRetryButton && (
        <Button size="small" style={{ color: accentColor }} onClick={onClick} loading={buttonLoading}>
          Retry
        </Button>
      )}
    </div>
  );
};

const AnalyticsState = ({ title = '', message = '', onClick, buttonLoading, hideRetryButton, ...rest }) => {
  return (
    <EmptyStateWrapper>
      <NetworkError />
      <Heading className={rest.titleClassName} as="h5">
        {title}
      </Heading>
      <p>{message}</p>
      {!hideRetryButton && (
        <Button type="primary" size="large" onClick={onClick} loading={buttonLoading}>
          Retry
        </Button>
      )}
    </EmptyStateWrapper>
  );
};

const EmptyStateBlock = ({
  className,
  illustration,
  title = t('No Record Found'),
  message,
  btnText = t('Retry'),
  onClick,
  buttonLoading,
  hideRetryButton,
  accentColor,
  button,
  ...rest
}) => {
  return (
    <EmptyStateWrapper className={className} style={{ color: accentColor, ...rest.style }} gap={rest.gap}>
      {rest.logo || null}
      {illustration || <NetworkError accentColor={accentColor} />}
      {(title || message) && (
        <div>
          {title && (
            <Heading style={{ color: '#000' }} className={rest.titleClassName} as={rest.headingType || 'h5'}>
              {t(title)}
            </Heading>
          )}
          {message && (
            <Text type="secondary" className="mb-0">
              {t(message)}
            </Text>
          )}
        </div>
      )}
      {!hideRetryButton && !button && (
        <Button
          type="primary"
          size="large"
          onClick={onClick}
          loading={buttonLoading}
          {...(accentColor && { style: { backgroundColor: accentColor } })}
        >
          {t(btnText)}
        </Button>
      )}
      {button && button}
    </EmptyStateWrapper>
  );
};

EmptyStateBlock.propTypes = {
  className: PropTypes.string,
  illustration: PropTypes.node,
  title: PropTypes.string,
  message: PropTypes.string,
  btnText: PropTypes.string,
  onClick: PropTypes.func,
  buttonLoading: PropTypes.bool,
  hideRetryButton: PropTypes.bool,
  accentColor: PropTypes.string,
  button: PropTypes.object,
};
