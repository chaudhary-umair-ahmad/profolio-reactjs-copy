import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal } from '../../../../components/common';
import Lottie from '../../../../components/common/lottie/lottie';
import { TitlePill, PillText } from '../../../../container/pages/agent-performance/styled';
import superListerLottieAnimation from '../../../../container/pages/agent-performance/SuperListerLottie.json';
import qualityListerLottieAnimation from '../../../../container/pages/agent-performance/QualityListerLottie.json';
import responsiveBrokerLottieAnimation from '../../../../container/pages/agent-performance/ResponsiveBrokerLottie.json';

const BadgeCongratsModal = forwardRef((props, ref) => {
  const { onClose } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [badgeType, setBadgeType] = useState(null);
  const { t } = useTranslation();

  const showModal = (badge) => {
    setBadgeType(badge);
    setShowCongratsModal(true);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const handleCancel = () => {
    setShowCongratsModal(false);
    if (onClose) {
      onClose();
    }
  };

  const getBadgeInfo = () => {
    switch (badgeType) {
      case 'isQualityLister':
        return {
          title: t('Quality Lister'),
          description: t(
            'Great job on earning a badge. Keep the badge until the end of month to level up your rank for the next month.',
          ),
          lottie: qualityListerLottieAnimation,
          pillBg: '#E8F5FB',
          bgImage: require('/profolio-assets/images/quality-lister.png'),
        };
      case 'isResponsiveBroker':
        return {
          title: t('Responsive Broker'),
          description: t(
            'Great job on earning a badge. Keep the badge until the end of month to level up your rank for the next month.',
          ),
          lottie: responsiveBrokerLottieAnimation,
          pillBg: '#F4E9F5',
          bgImage: require('/profolio-assets/images/responsive-broker.png'),
        };
      case 'isSuperLister':
        return {
          title: t('Super Lister'),
          description: t(
            'Great job on earning a badge. Keep the badge until the end of month to level up your rank for the next month.',
          ),
          lottie: superListerLottieAnimation,
          pillBg: '#FFFBE3',
          bgImage: require('/profolio-assets/images/super-lister.png'),
        };
      case 'isTruBroker':
        return {
          title: 'TruBroker™',
          description: t(
            'Great job earning a badge! Keep it until month-end to level up next month. Bayut may use your images and details for marketing; you can disable this anytime in User Settings/Preferences.',
          ),
          lottie: null,
          pillBg: 'linear-gradient(237.73deg, #053940 19.63%, #00745F 48.96%, #033F46 72.03%)',
          bgImage: require('/profolio-assets/images/tru-broker.png'),
        };
      default:
        return {
          title: t('Badge Earned'),
          description: t(
            'Great job on earning a badge. Keep the badge until the end of month to level up your rank for the next month.',
          ),
          lottie: null,
          pillBg: null,
          bgImage: null,
        };
    }
  };

  const badgeInfo = getBadgeInfo();

  return (
    <Modal
      onCancel={handleCancel}
      footer={null}
      open={showCongratsModal}
      className={!isMobile && 'badge-congrats'}
      width={isMobile ? '370px' : '641px'}
      maskClosable={true}
      closable={true}
      styles={{
        body: { padding: '0', overflow: 'hidden' },
        content: {
          borderRadius: '12px',
          padding: 0,
          overflow: 'hidden',
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '20px 0' : '24px 0',
          maxWidth: '100%',
          height: '280px',
          overflow: 'hidden',
          backgroundImage: badgeInfo?.bgImage ? `url(${badgeInfo?.bgImage})` : 'none',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {badgeInfo?.pillBg && (
          <TitlePill
            $isMobile={isMobile}
            style={{
              background: badgeInfo.pillBg,
              padding: '12px 24px 12px 20px',
              minWidth: '239px',
              height: '67px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {badgeInfo?.lottie && <Lottie width={24} height={30} animationData={badgeInfo.lottie} />}
            <PillText style={{ fontSize: '24px', color: badgeType === 'isTruBroker' ? '#FFFFFF' : undefined }}>{badgeInfo.title}</PillText>
          </TitlePill>
        )}
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            maxWidth: isMobile ? '100%' : '400px',
            padding: '0 8px',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        ></div>
      </div>
      <div
        style={{
          height: '150px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingLeft: '24px',
          paddingRight: '24px',
          gap: '6px',
        }}
      >
        <div style={{ fontSize: isMobile ? '24px' : '28px', color: '#000000', fontWeight: 700 }}>{t('Congratulations!')}</div>
        <p
          style={{
            margin: 0,
            fontSize: isMobile ? '14px' : '16px',
            color: 'rgba(79, 79, 79, 1)',
            lineHeight: '1.5',
            maxWidth: '100%',
            fontWeight: 400,
            paddingBottom: '12px',
          }}
        >
          {badgeInfo.description}
        </p>
      </div>
    </Modal>
  );
});

export default BadgeCongratsModal;
