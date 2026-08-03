import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import { SvgThunderGradient, SvgTruBrokerBg, UnlockBrokerIcon } from '../../../components/svg';
import { TruBrokerSkeleton } from './AgentPerformanceSkeleton';
import Lottie from '../../../components/common/lottie/lottie';
import streakLottieAnimation from './StreakLottie.json';
import {
  TruBrokerBannerContainer,
  BannerContent,
  LeftSection,
  BannerTitle,
  TitleWithLock,
  LockIcon,
  Description,
  GoalPointsSection,
  StreakBadge,
  StreakNumber,
  StreakText,
} from './styled';
import TruBrokerCriteriaList from '../../../components/tru-broker/tru-broker-criteria-list';

const TruBroker = ({ userData = {}, loading = false }) => {
  const { t,} = useTranslation();
  const { isMobile, rtl } = useSelector((state) => state?.app?.AppConfig || {});
  const isTruBroker = userData?.is_tru_broker;
  const truBrokerStreak = userData?.tru_broker_streak;

  const [streakModalVisible, setStreakModalVisible] = useState(false);

  const handleStreakClick = (e) => {
    e.stopPropagation();
    setStreakModalVisible(true);
  };

  if (loading) {
    return <TruBrokerSkeleton isMobile={isMobile} />;
  }

  return (
    <>
      <TruBrokerBannerContainer $isMobile={isMobile} $isUnlocked={isTruBroker}>
        <BannerContent $isMobile={isMobile}>
          <LeftSection $isMobile={isMobile}>
            {!isTruBroker ? (
              <>
                <TitleWithLock $isMobile={isMobile}>
                  <div style={{ display: 'flex', flexDirection: rtl ? 'row-reverse' : 'row' }}>
                    {t('Unlock')}<span style={{ marginLeft: '6px' }}> Tru
                    <span style={{ fontWeight: 700 }}>Broker™</span></span>
                  </div>
                  <LockIcon $isMobile={isMobile}>
                    <UnlockBrokerIcon width={isMobile ? 16 : 18} height={isMobile ? 16 : 18} />
                  </LockIcon>
                </TitleWithLock>
                <Description $isMobile={isMobile}>
                  {t("Get recognized as one of the Kingdom's most trusted real estate agents.")}
                </Description>
                <GoalPointsSection $isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
                  <TruBrokerCriteriaList
                    user={userData}
                    showCarousel={false}
                    cardPadding="12px"
                    iconSize={16}
                    gap="6px"
                    cardStyle={{
                      minWidth: isMobile ? '351px' : '180px',
                      minHeight: '38px',
                      height: 'auto',
                      borderRadius: '6px',
                      boxShadow: '0px 0px 3px 0px #0000001A',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    alignItems="center"
                    className="goal-point-card"
                    verifiedIcon={'CheckIcon'}
                    unverifiedIcon={'UnCheckedIcon'}
                    noBackground={true}
                    isMobileToggle={isMobile ? true : false}
                    textStyle={{ color: '#4F4F4F', fontWeight: 600 }}
                    containerStyle={{ width: '100%', justifyContent: 'center' }}
                  />
                </GoalPointsSection>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: isMobile ? '10px' : '20px',
                  }}
                >
                  <BannerTitle $isMobile={isMobile}>
                    <span style={{ fontWeight: 500, color: '#222222' }}>
                      {t("You're an active ")}Tru<span style={{ fontWeight: 700 }}>Broker™</span>
                    </span>
                  </BannerTitle>
                  {truBrokerStreak >= 1 && (
                    <StreakBadge $isMobile={isMobile} onClick={handleStreakClick} style={{ cursor: 'pointer' }}>
                      <SvgThunderGradient width={16} height={16} />
                      <StreakNumber>{truBrokerStreak}</StreakNumber>
                      {!isMobile && (
                        <StreakText>{t('streakUnit', { count: truBrokerStreak })}</StreakText>
                      )}
                    </StreakBadge>
                  )}
                </div>
                <Description $isMobile={isMobile} style={{ width: isMobile ? '90%' : '100%' }}>
                  {t(
                    'Great work! Keep your badge until the end of the month to maintain your streak and level up your rank for the next month.',
                  )}
                </Description>
              </>
            )}
          </LeftSection>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: isMobile ? '0' : undefined,
              width: isMobile ? '100%' : '50%',
            }}
          >
            <div style={{ maxWidth: isMobile ? '300px' : '100%' }}>
              {isMobile && !isTruBroker ? <></> : <SvgTruBrokerBg />}
            </div>
          </div>
        </BannerContent>
      </TruBrokerBannerContainer>
      <Modal
        open={streakModalVisible}
        onCancel={() => setStreakModalVisible(false)}
        footer={null}
        centered
        width={'465px'}
        bodyStyle={{ padding: '20px' }}
        styles={{
          content: {
            borderRadius: '24px',
          },
        }}
      >
        <div
          style={{
            textAlign: 'center',
            height: '293px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <Lottie animationData={streakLottieAnimation} width={125} height={125} />
          <div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: 1.25,
                background: 'linear-gradient(127.84deg, #FD5900 29.94%, #FFDE00 86.23%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {t('streakModalTitle', { count: truBrokerStreak })}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#626262', width: '100%' }}>
              <Trans
                i18nKey="streakModalCongrats"
                count={truBrokerStreak}
                values={{ name: userData?.name || '' }}
                components={{ sup: <sup /> }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TruBroker;
