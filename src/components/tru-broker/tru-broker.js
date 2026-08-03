import tenantTheme from '@theme';
import tenantConstants from '@constants';
import { Progress, Typography } from 'antd';
import cx from 'clsx';
import { useMemo, useRef, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Flex } from '../../components/common';
import { CardGradient } from '../../components/common/cards/styled';
import { startYourJourneyClickEvent, truBrokerLearnMoreClickEvent } from '../../services/analyticsService';
import { getBaseURL } from '../../utility/env';
import { TruBrokerBanner, TruBrokerBanner1 } from './styled';
import TruBrokerDrawer from './tru-broker-drawer';
import TruBrokerJourneyModal from './tru-broker-pop-up';
import { useGetLocation } from '../../hooks';
import { mapQueryStringToFilterObject } from '../../utility/urlQuery';

const { Title } = Typography;

const TruBrokerCard = ({ style, user }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { rtl } = useSelector((state) => state.app.AppConfig);
  const { t } = useTranslation();
  const truBrokerDrawerRef = useRef();
  const truBrokerModalRef = useRef();
  const location = useGetLocation();
  const { queryObj } = mapQueryStringToFilterObject(location.search);

  useEffect(() => {
    if (queryObj?.trubroker === 'true' && !user?.is_tru_broker) {
      truBrokerModalRef.current.showTruBrokerPopUp();
    }
  }, [queryObj?.trubroker]);
  const truBrokerSteps = useMemo(
    () => [
      {
        key: 1,
        isVerified: user?.profile_completion?.score === 100,
      },
      {
        key: 2,
        isVerified: user?.package,
      },
      {
        key: 3,
        isVerified: user?.active_listings_count >= 2,
      },
    ],
    [],
  );

  return (
    !user?.is_tru_broker && (
      <TruBrokerBanner1 rtl={rtl}>
        <div>
          <Title className="mb-16" style={{ fontSize: isMobile ? '16px' : '24px', color: tenantTheme['white-color'] }}>
            {t('Introducing')}{' '}
            <Trans
              i18nKey={'truBroker'}
              components={{
                div: <div className={'fw-500 fz-18'} />,
                span: <span className="fw-700" />,
                sup: <sup />,
              }}
            />
          </Title>

          <div className={cx(isMobile ? 'mb-12' : 'mb-20', isMobile && 'fz-12')} style={{ color: 'white' }}>
            <Trans i18nKey={'becomeTruBroker'} components={{ span: <span className="fw-700" />, sup: <sup /> }} />
          </div>
          <Flex align="center" disabled={!user?.isLoggedinUser}>
            <Button
              size={isMobile && 'small'}
              iconClassName="flipX"
              className={cx(!isMobile && 'w-100')}
              type={'default'}
              onClick={() => {
                startYourJourneyClickEvent(user);
                truBrokerModalRef?.current && truBrokerModalRef?.current.showTruBrokerPopUp();
              }}
              icon="IoIosArrowForward"
              style={{
                maxWidth: !isMobile && '164px',
                '--btn-content-color': tenantTheme['primary-color'],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                flexDirection: 'row-reverse',
              }}
            >
              <span style={{ flex: 0 }}>{t('Get Started')}</span>
            </Button>
            <Button
              size={isMobile && 'small'}
              style={{
                color: 'white',
              }}
              type="link"
              onClick={() => {
                truBrokerLearnMoreClickEvent(user);
                truBrokerDrawerRef?.current && truBrokerDrawerRef?.current?.openDrawer();
              }}
            >
              {t('Learn More')}
            </Button>
          </Flex>
        </div>

        <TruBrokerJourneyModal ref={truBrokerModalRef} user={user} />
        <TruBrokerDrawer ref={truBrokerDrawerRef} user={user} />
      </TruBrokerBanner1>
    )
  );
};
export default TruBrokerCard;
