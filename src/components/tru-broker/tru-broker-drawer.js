import tenantTheme from '@theme';
import { Divider, Typography } from 'antd';
import cx from 'clsx';
import React, { forwardRef, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Drawer, Flex, Group, Icon, Image, TextWithIcon } from '../../components/common';
import { getBaseURL } from '../../utility/env';
import TruBrokerJourneyModal from './tru-broker-pop-up';
import TruBrokerTag from './tru-broker-tag';
import TruPointsCriteriaPopUp from './tru-points-criteria-pop-up';
const { Text, Title } = Typography;

const TruBrokerDrawer = forwardRef((props, ref) => {
  const { t } = useTranslation();

  const { isMobile, locale } = useSelector((state) => state.app.AppConfig);
  const { user: loginUser } = useSelector((state) => state.app.loginUser);
  const { user } = props;
  const truBrokerModalRef = useRef();
  const truPointsCriteriaPopUpRef = useRef();

  const truBrokerInformation = useMemo(
    () => [
      { key: 1, icon: '', title: t('Your listings get a boost and rank higher on the search results page') },
      {
        key: 2,
        icon: '',
        title: <Trans i18nKey={'badgeRank'} components={{ sup: <sup />, span: <span className="fw-700" /> }} />,
      },
      {
        key: 3,
        icon: '',
        title: <Trans i18nKey={'agentRank'} components={{ sup: <sup />, span: <span className="fw-700" /> }} />,
      },
      {
        key: 4,
        icon: '',
        title: (
          <Trans i18nKey={'profileEnhancement'} components={{ sup: <sup />, span: <span className="fw-700" /> }} />
        ),
      },
      {
        key: 5,
        icon: '',
        title: <Trans i18nKey={'outDoorCampaigns'} components={{ sup: <sup />, span: <span className="fw-700" /> }} />,
      },
    ],
    [],
  );

  return (
    <Drawer
      ref={ref}
      title={
        <Flex align="center" gap="6px">
          <div className="fw-600">
            <Trans
              i18nKey={'truBrokerDrawerHeading'}
              components={{ span: <span style={{ fontWeight: '700' }} />, sup: <sup className="fz-14" /> }}
            />
          </div>
          <TruBrokerTag
            tagText={<Trans i18nKey={'truBroker'} components={{ span: <span className="fw-700" />, sup: <sup /> }} />}
          />
        </Flex>
      }
      width={isMobile ? '100vw' : '34vw'}
      placement={locale === 'ar' ? 'left' : 'right'}
      onCloseDrawer={() => {}}
      hideButton="true"
      headerStyle={{ '--ant-font-size-lg': isMobile ? '20px' : '24px' }}
      footer={null}
    >
      <Flex vertical justify="center" gap="16px">
        <div className="text-center">
          <Image
            width={400}
            src={
              locale === 'en'
                ? `${getBaseURL()}/profolio-assets/images/tru-brooker-mockup.png`
                : `${getBaseURL()}/profolio-assets/images/tru-brooker-mockup-ar.png`
            }
          />
        </div>
        <Text className={cx('fw-500', isMobile && 'fz-12 ')}>
          <Trans i18nKey={'truBrokerDescription'} components={{ sup: <sup />, span: <span className="" /> }} />
          {t('With TruBroker:')}
        </Text>
        <Flex vertical gap="10px">
          {truBrokerInformation?.map((e, i) => (
            <TextWithIcon
              key={i}
              title={e?.title}
              icon={e?.icon || 'MdOutlineDoubleArrow'}
              iconProps={{ color: tenantTheme['primary-color'] + 'aa' }}
              textColor={tenantTheme['gray700']}
              iconClassName="flipX"
            />
          ))}
        </Flex>
        <div>
          <TextWithIcon
            icon={'AiOutlineInfoCircle'}
            title={
              <Trans
                i18nKey={'truBrokerStepsCompletion'}
                components={{ sup: <sup />, span: <span className="fw-700" /> }}
              />
            }
            textSize="12px"
            textColor={tenantTheme['gray700']}
            align="start"
            iconProps={{ color: tenantTheme['primary-color'], size: '16px' }}
          />
        </div>

        <TruBrokerJourneyModal ref={truBrokerModalRef} user={user} />

        <Button
          type="primaryOutlined"
          block
          onClick={() => {
            isMobile && ref?.current && ref?.current?.closeDrawer();
            truBrokerModalRef?.current && truBrokerModalRef?.current?.showTruBrokerPopUp();
          }}
          disabled={!user?.isLoggedinUser}
        >
          {t('Continue Your Journey')}
        </Button>
      </Flex>

      {user?.tru_broker_start_date && (
        <>
          <Divider variant="dashed" style={{ marginBlock: isMobile && '18px' }} />
          <Group template="initial" gap="16px">
            <Flex gap="4px">
              <Title level={4} className="mb-0 fw-700">
                <Trans i18nKey={'whatAreTruPoints'} components={{ sup: <sup style={{ fontWeight: '400' }} /> }} />
              </Title>
              <Icon icon="SvgStarGradient" size={24} />
            </Flex>

            <Text className="fz-14  fw-500">
              <Trans
                i18nKey={'truPointsDescription'}
                components={{ span: <span className="fw-700" />, sup: <sup /> }}
              />
            </Text>
            <Text className="fz-14 fw-500">
              {t(
                'Each activity has assigned points, contributing to your overall ranking. Aim high and watch your rank grow!',
              )}
            </Text>
            <Button
              type="primaryOutlined"
              block
              onClick={() => {
                truPointsCriteriaPopUpRef.current && truPointsCriteriaPopUpRef.current.showTruPointsCriteriaPopUp();
              }}
            >
              <Trans i18nKey={'earnTruPoints'} components={{ sup: <sup /> }} />
            </Button>
          </Group>
        </>
      )}

      <TruBrokerJourneyModal ref={truBrokerModalRef} user={user} />
      <TruPointsCriteriaPopUp ref={truPointsCriteriaPopUpRef} />
    </Drawer>
  );
});
export default TruBrokerDrawer;
