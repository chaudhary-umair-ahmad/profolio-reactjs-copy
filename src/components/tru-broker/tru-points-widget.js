import { Typography } from 'antd';
import cx from 'clsx';
import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Card, Flex, Group, TextWithIcon, Icon } from '../../components/common';
import { CardGradient } from '../../components/common/cards/styled';
import TruBrokerDrawer from './tru-broker-drawer';
import tenantUtils from '@utils';
const { Text } = Typography;

import tenantTheme from '@theme';
import { useSelector } from 'react-redux';
import { howToEarnTruPointsClickEvent, viewLeaderBoardClickEvent } from '../../services/analyticsService';
import TruBrokerLeaderBoard from './tru-broker-leaderboard';
import TruPointsCriteriaPopUp from './tru-points-criteria-pop-up';
import { getPositionSuffix } from '../../utility/utility';
import { Tooltip } from 'antd';
const TruPointsWidget = ({ cardStyle, user }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const truBrokerDrawerRef = useRef();
  const truBrokerLeaderBoardRef = useRef();
  const truPointsCriteriaPopUpRef = useRef();

  return (
    <Card style={{ ...cardStyle }}>
      <Flex gap="20px" justify="space-between" align="center" className="mb-12">
        <Trans
          i18nKey={'truPoints'}
          components={{
            div: <div className={cx('fw-500', isMobile ? 'fz-14' : 'fz-18')} />,
            span: <span className="fw-700" />,
            sup: <sup />,
          }}
        />

        <Button
          size={isMobile ? 'small' : ''}
          type={'link'}
          onClick={() => {
            truBrokerDrawerRef?.current && truBrokerDrawerRef?.current?.openDrawer();
          }}
        >
          {t('What are TruPoints?')}
        </Button>
      </Flex>
      <Group template={'repeat(2,1fr)'} gap={isMobile && '8px'} className="mb-16">
        <Card
          as={CardGradient}
          style={{ '--gradient-alpha': '0.3', padding: isMobile && '12px', height: 125 }}
          onClick={() => {
            truPointsCriteriaPopUpRef.current && truPointsCriteriaPopUpRef.current.showTruPointsCriteriaPopUp();
            howToEarnTruPointsClickEvent(user);
          }}
          hoverable
        >
          <Flex gap="10px" justify="space-between" align={'center'} style={{ height: '100%' }}>
            <TextWithIcon
              vertical
              align="start"
              icon={'SvgStarGradient'}
              title={t('Total TruPoints™')}
              textSize={isMobile ? '12px' : '14px'}
              gap={isMobile ? '4px' : '10px'}
              iconProps={{ size: isMobile ? '20px' : '32px' }}
            />
            <Flex vertical gap="2px" align="center">
              <Text className={cx('fw-700 text-primary', isMobile ? 'fz-14' : 'fz-24')}>{user?.monthly_score}</Text>
              <Text type="secondary" className="fw-500 fz-12">
                {t('Points')}
              </Text>
            </Flex>
          </Flex>
        </Card>
        <Card
          as={CardGradient}
          style={{ '--gradient-alpha': '0.3', padding: isMobile && '12px' }}
          onClick={() => {
            truBrokerLeaderBoardRef.current &&
              truBrokerLeaderBoardRef.current.showLeaderBoard({
                ...user,
                agency_name: tenantUtils.getLocalisedString(user?.agency, 'name'),
                scoreValue: user?.rank,
              });
            viewLeaderBoardClickEvent(user);
          }}
          hoverable
        >
          <Flex gap={isMobile ? '3px' : '10px'} justify="space-between" align={'center'} style={{ height: '100%' }}>
            <TextWithIcon
              icon={'SvgLeaderBoardGradient'}
              vertical
              align="start"
              textSize={isMobile ? '12px' : '14px'}
              gap={isMobile ? '4px' : '10px'}
              iconProps={{ size: isMobile ? '20px' : '' }}
              title={t('LeaderBoard Rank')}
            />
            <Flex vertical gap={isMobile ? '1px' : '2px'} style={{ lineHeight: !isMobile && 1.4 }}>
              <Tooltip
                placement="top"
                title={
                  !user?.rank
                    ? t('TruBroker ranks are calculated on the first of every month. Your profile is not ranked yet.')
                    : ''
                }
              >
                <TextWithIcon
                  iconProps={
                    user?.rank
                      ? {
                          color: user?.is_rank_increased ? tenantTheme['secondary-color'] : tenantTheme['danger-color'],
                          size: 16,
                        }
                      : {}
                  }
                  title={
                    user?.rank ? (
                      <div>
                        {user?.rank}
                        <sup>{getPositionSuffix(user?.rank)}</sup>
                      </div>
                    ) : (
                      <Flex justify="flex-end" style={{ width: isMobile ? '70px' : '100px' }}>
                        <Icon icon="NotRankedIcon" />
                      </Flex>
                    )
                  }
                  textSize={isMobile ? '14px' : '24px'}
                  textColor={tenantTheme['primary-color']}
                  fontWeight="800"
                  gap="2px"
                />
              </Tooltip>
              <Text
                type="secondary"
                className="fz-12 fw-500"
                style={{ alignSelf: 'flex-end', marginInlineEnd: '2px', paddingTop: 5 }}
              >
                {user?.rank ? t('Position') : t('Not Ranked')}
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Group>
      <TruBrokerDrawer ref={truBrokerDrawerRef} user={user} />
      <TruBrokerLeaderBoard ref={truBrokerLeaderBoardRef} />
      <TruPointsCriteriaPopUp ref={truPointsCriteriaPopUpRef} />
    </Card>
  );
};
export default TruPointsWidget;
