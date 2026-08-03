import React, { useRef, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Drawer } from '../../../components/common';
import { BottomSheetDrawer } from '../../../components/common/drawerPopover/styled';
import {
  RightWaveArrow,
  TruBrokerIconBage,
  TrupointsStar,
  TruPointsStarIcon,
} from '../../../components/svg';
import Lottie from '../../../components/common/lottie/lottie';
import { TitlePill, PillText } from './styled';
import superListerLottieAnimation from './SuperListerLottie.json';
import qualityListerLottieAnimation from './QualityListerLottie.json';
import responsiveBrokerLottieAnimation from './ResponsiveBrokerLottie.json';
import tenantData from '@data';

import {
  DrawerHeader,
  DrawerTitle,
  DrawerContentWrapper,
  DrawerContent,
  DrawerFadeOverlay,
  BadgeSection,
  BadgeSectionTitle,
  BadgeSectionDescription,
  RequirementsList,
  RequirementItem,
  BadgeImageContainer,
  TruPointsSection,
  TruPointsTitle,
  TruPointsDescription,
  TruPointsSubtitle,
  TruPointsListItem,
  TruPointsButton,
} from './styled';

const AgentBagesInfo = ({ visible, onClose, t, isMobile = false, onTruPointsClick }) => {
  const badgesDrawerRef = useRef();
  const bottomSheetRef = useRef();
  const rtl = useSelector((state) => state.app?.AppConfig?.rtl);

  useEffect(() => {
    if (isMobile) {
      if (visible && bottomSheetRef.current) {
        bottomSheetRef.current.openDrawer();
      } else if (!visible && bottomSheetRef.current && bottomSheetRef.current.isOpen()) {
        bottomSheetRef.current.closeDrawer();
      }
    } else {
      if (visible && badgesDrawerRef.current) {
        badgesDrawerRef.current.openDrawer();
      } else if (!visible && badgesDrawerRef.current && badgesDrawerRef.current.isOpen()) {
        badgesDrawerRef.current.closeDrawer();
      }
    }
  }, [visible, isMobile]);

  const badgeSectionsContent = (
    <>
      <BadgeSection style={{ gap: '16px', display: 'flex', flexDirection: 'column' }} $background="#F2FAFA">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TruBrokerIconBage />
        </div>
        <BadgeSectionDescription>
          {t('The TruBroker™ badge is awarded to agents who have:')}
        </BadgeSectionDescription>
        <RequirementsList>
          {(tenantData?.badgeRequirements?.TRUBROKER_REQUIREMENTS || []).map((requirement, index) => (
            <RequirementItem key={index} $color="#0E8073">
              <span style={{ position: 'absolute', ...(rtl ? { right: 0 } : { left: 0 }), top: '2px' , transform: rtl ? 'scaleX(-1)' : 'none'}}>
                <RightWaveArrow />
              </span>
              {t(requirement)}
            </RequirementItem>
          ))}
        </RequirementsList>
      </BadgeSection>

      <BadgeSection
        style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}
        $background="rgba(232, 245, 251, 0.4)"
      >
        <TitlePill
          $isMobile={isMobile}
          style={{
            background: '#E8F5FB',
            padding: '8px 12px 8px 10px',
            width: 'fit-content',
            fontSize: '16px',

          }}
        >
          <Lottie width={19} animationData={qualityListerLottieAnimation} />
          <PillText>{t('Quality Lister')}</PillText>
        </TitlePill>
        <BadgeImageContainer>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            width="100%"
            style={{
              width: '100%',
              maxWidth: '100%',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
              display: 'block',
              outline: 'none',
            }}
          >
            <source src="/profolio-assets/videos/Learnmore_midquality.mp4" type="video/mp4" />
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              {t('Your browser does not support the video tag.')}
            </p>
          </video>
        </BadgeImageContainer>
        <BadgeSectionDescription>
          {t(
            'Earn this badge by maintaining images score of 35% and features score of 20%. You can improve this score by updating the images and features score of each listing individually',
          )}
        </BadgeSectionDescription>
      </BadgeSection>

      <BadgeSection
        style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}
        $background="rgba(244, 233, 245, 0.4)"
      >
        <TitlePill
          $isMobile={isMobile}
          style={{
            background: '#F4E9F5',
            padding: '8px 12px 8px 10px',
            width: 'fit-content',
            fontSize: '16px',
          }}
        >
          <Lottie width={19} animationData={responsiveBrokerLottieAnimation} />
          <PillText>{t('Responsive Broker')}</PillText>
        </TitlePill>
        <BadgeSectionDescription>
          {t(
            'Earn this badge by maintaining a call response rate of 60% or a WhatsApp response rate of 70%. If both tracking methods are enabled, one of the parameters must meet its individual criterion, while the other should not fall below 40%.',
          )}
        </BadgeSectionDescription>
        <RequirementsList>
          {(tenantData?.badgeRequirements?.RESPONSIVE_BROKER_REQUIREMENTS || []).map((requirement, index) => (
            <RequirementItem key={index} $color="#722ED1">
              <span style={{ position: 'absolute', ...(rtl ? { right: 0 } : { left: 0 }), top: '2px' , transform: rtl ? 'scaleX(-1)' : 'none'}}>
                <RightWaveArrow  />
              </span>
              {t(requirement)}
            </RequirementItem>
          ))}
        </RequirementsList>
      </BadgeSection>

      <BadgeSection
        style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}
        $background="rgba(255, 251, 227, 0.4)"
      >
        <TitlePill
          $isMobile={isMobile}
          style={{
            background: '#FFFBE3',
            padding: '8px 12px 8px 10px',
            width: 'fit-content',
            fontSize: '16px',
          }}
        >
          <Lottie width={19} animationData={superListerLottieAnimation} />
          <PillText>{t('Super Lister')}</PillText>
        </TitlePill>
        <BadgeSectionDescription>
          {t(
            'Earn this badge by posting 20 listings within any continuous 30-day period, regardless of calendar month. Listings are counted that:',
          )}
        </BadgeSectionDescription>
        <RequirementsList>
          {(tenantData?.badgeRequirements?.SUPER_LISTER_REQUIREMENTS || []).map((requirement, index) => (
            <RequirementItem key={index} $color="#FAAD14">
              <span style={{ position: 'absolute', ...(rtl ? { right: 0 } : { left: 0 }), top: '2px', transform: rtl ? 'scaleX(-1)' : 'none' }}>
                <RightWaveArrow  />
              </span>
              {t(requirement)}
            </RequirementItem>
          ))}
        </RequirementsList>
      </BadgeSection>

      <TruPointsSection style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <TitlePill
          $isMobile={isMobile}
          style={{
            background: 'transparent',
            padding: '8px 12px 8px 10px',
            width: 'fit-content',
            boxShadow: 'none',
          }}
        >
          <PillText style={{ fontSize: '25px', fontWeight: 700 }}>{t('TruPoints™')}</PillText>
          <TruPointsStarIcon/>
        </TitlePill>
        </div>
        <TruPointsDescription>
          {t(
            'TruPoints™ are your performance score, reflecting your activity, quality, and engagement on the platform. The more TruPoints™ you earn, the higher you rank on the leaderboard, gaining increased visibility and client trust among fellow TruBrokers™',
          )}
        </TruPointsDescription>
        <TruPointsDescription>
          {t(
            'Each activity has assigned points, contributing to your overall ranking. Aim high and watch your rank grow!',
          )}
        </TruPointsDescription>

        <TruPointsButton
          size="large"
          block
          onClick={() => {
            if (onTruPointsClick) {
              onTruPointsClick();
            }
          }}
        >
          {t('How to earn TruPoints™')}
        </TruPointsButton>
      </TruPointsSection>
    </>
  );

  const content = (
    <>
      {!isMobile && (
        <DrawerHeader $isMobile={isMobile}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <DrawerTitle>{t('How can badges be earned?')}</DrawerTitle>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 400, color: '#4F4F4F' }}>
                {t("Here's some information to help you get started!")}
              </p>
            </div>
            <div
              style={{
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '16px',
                flexShrink: 0,
              }}
              onClick={onClose}
              aria-label={t('Close')}
            >
              <FiX size={20} color="#A3A3A3" />
            </div>
          </div>
        </DrawerHeader>
      )}

      <DrawerContentWrapper $isMobile={isMobile}>
        <DrawerContent $isMobile={isMobile}>{badgeSectionsContent}</DrawerContent>
        {!isMobile && <DrawerFadeOverlay />}
      </DrawerContentWrapper>
    </>
  );

  return isMobile ? (
    <BottomSheetDrawer
      ref={bottomSheetRef}
      rootClassName="bottom-sheet"
      placement="bottom"
      onCloseDrawer={onClose}
      className="drawer-container"
      height="90vh"
      title={t('How can badges be earned?')}
      bodyStyle={{ padding: 0 }}
      footer={null}
    >
      <DrawerContentWrapper $isMobile={isMobile}>
        <DrawerContent $isMobile={isMobile}>{badgeSectionsContent}</DrawerContent>
      </DrawerContentWrapper>
    </BottomSheetDrawer>
  ) : (
    <Drawer
      ref={badgesDrawerRef}
      width={600}
      title={null}
      footer={null}
      placement={rtl ? 'left' : 'right'}
      onCloseDrawer={onClose}
      bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      headerStyle={{ display: 'none' }}
    >
      {content}
    </Drawer>
  );
};

export default AgentBagesInfo;
