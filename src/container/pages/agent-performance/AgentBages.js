import React from 'react';
import { Trans } from 'react-i18next';
import { Popover } from '../../../components/common';
import { CallTrackingIcon, ExclaimationIcon, IconCheckBages, IconLockBages, InfoIconLeaderboard } from '../../../components/svg';
import Lottie from '../../../components/common/lottie/lottie';
import { AgentBadgeSkeleton } from './AgentPerformanceSkeleton';
import {
  BadgeCard,
  StatusTick,
  TitlePill,
  PillText,
  DescText,
  LearnMore,
  MetricsGrid,
  MetricHeader,
  MetricLabel,
  MetricValue,
  Track,
  Fill,
} from './styled';

const AgentBages = ({
  badge,
  isMobile,
  t,
  onLearnMoreClick,
  hexToRgba,
  loading = false,
  user = null,
  isLast = false,
}) => {
  const fillColor = badge?.fillColor || '#1677ff';
  const unfilledColor = badge?.unfilledColor
    ? badge.unfilledColor
    : badge?.unfilledColorHex
      ? hexToRgba(badge.unfilledColorHex, badge.unfilledColorOpacity || 0.24)
      : hexToRgba(badge?.iconColor, 0.24);
  const idForBadge = badge?.id;
  const pillBg = badge?.pillBg || hexToRgba(badge?.iconColor, 0.18);
  const isSuper = badge?.slug === 'super-lister';
  const whatsappTrackingEnabled = user?.is_whatsapp_tracking_enabled;
  const callTrackingEnabled = user?.is_call_tracking_enabled;
  const whatsappORCallTrackingEnabled = whatsappTrackingEnabled || callTrackingEnabled;

  if (loading) {
    return <AgentBadgeSkeleton isMobile={isMobile} />;
  }

  return (
    <BadgeCard id={idForBadge} $isMobile={isMobile} $isLast={isLast}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <TitlePill
          $isMobile={isMobile}
          style={{
            background: badge?.showLocked ? '#F5F5F5' : pillBg,
          }}
        >
          {badge?.lottie && <Lottie width={19} animationData={badge.lottie} />}
          <PillText>{t(badge?.name)}</PillText>
        </TitlePill>
        <StatusTick
          $isMobile={isMobile}
          aria-label={badge?.showLocked ? 'Locked' : 'Achieved'}
          style={{
            color: badge?.showLocked ? '#9e9e9e' : 'inherit',
          }}
        >
          {badge.slug === 'responsive-broker' ? (
            <>
              {whatsappORCallTrackingEnabled ? (
                <>{badge?.showLocked ? <IconLockBages size={14} /> : <IconCheckBages size={14} />}</>
              ) : (
                <Popover
                  placement="bottom"
                  overlayStyle={{ width: '354px' }}
                  overlayInnerStyle={{ padding: '12px' }}
                  content={
                    <div style={{ height: '49px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CallTrackingIcon size={52} />
                      <div style={{ fontSize: '12px', lineHeight: '1.5', fontWeight: 500, color: '#222222' }}>
                        <Trans
                          i18nKey="responsiveBrokerTrackingOff"
                          values={{ phone: '+966920066800', email: 'contact-us@bayut.sa' }}
                          components={{
                            phone: <span style={{ fontWeight: 700, color: '#00B9FF' }} />,
                            email: <span style={{ fontWeight: 700, color: '#00B9FF' }} />,
                          }}
                        />
                      </div>
                    </div>
                  }
                  action="hover"
                >
                  <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
                    <CallTrackingIcon />
                  </span>
                </Popover>
              )}
            </>
          ) : (
            <>{badge?.showLocked ? <IconLockBages size={14} /> : <IconCheckBages size={14} />}</>
          )}
        </StatusTick>
      </div>

      <div style={{ display: 'block', gap: 0 }}>
        <DescText $isMobile={isMobile}>
          {t(badge?.description)}{' '}
          <div>
          <LearnMore
            href="#"
            $isMobile={isMobile}
            onClick={(e) => {
              e.preventDefault();
              if (onLearnMoreClick) onLearnMoreClick();
            }}
          >
            {t('Learn More')}
          </LearnMore>
          </div>
        </DescText>
      </div>

      <MetricsGrid $isMobile={isMobile} $columns={(badge?.metrics || []).length === 2 ? '1fr 1fr' : '1fr'}>
        {(badge?.metrics || []).map((m, idx) => {
          const valueShown = m.value;
          const percent = m.percent || 0;
          const showCallTrackingWhatsApp = badge?.slug === 'responsive-broker' && m?.slug === 'wa-response' && !whatsappTrackingEnabled && callTrackingEnabled;
          const showCallTrackingCall = badge?.slug === 'responsive-broker' && m?.slug === 'calls-answered' && !callTrackingEnabled && whatsappTrackingEnabled;
          const showTooltip = badge?.slug === 'responsive-broker' && m?.tooltip;
          const tooltipCriteriaCondition = showTooltip && (m?.tooltip?.received || m?.tooltip?.count || 0) >= (m?.tooltip?.criteria || 0);

          return (
            <div key={idx} style={{ width: isSuper || isMobile ? '100%' : '50%' }}>
              <MetricHeader $isMobile={isMobile}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MetricLabel $isMobile={isMobile}>{t(m.label)}</MetricLabel>
                  {showTooltip ? (
                    <Popover
                      placement="top"
                      overlayStyle={{ width: '354px' }}
                      overlayInnerStyle={{ padding: '12px' }}
                      content={
                        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                          {m?.slug === 'wa-response' ? (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 400, color: '#4F4F4F', fontSize: '12px' }}>{t('Whatsapp Received')}</span>
                                <span style={{ fontWeight: 700, color: '#222222', fontSize: '14px'  }}>{m?.tooltip?.received || 0}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: !tooltipCriteriaCondition ? '8px' : '0' }}>
                                <span style={{ fontWeight: 400, color: '#4F4F4F', fontSize: '12px' }}>{t('WhatsApp Responded')}</span>
                                <span style={{ fontWeight: 700, color: '#222222', fontSize: '14px'  }}>{m?.tooltip?.responded || 0}</span>
                              </div>
                              {!tooltipCriteriaCondition && (
                                <div style={{ marginTop: '8px' }}>
                                  <span style={{ fontWeight: 500, color: '#222222' }}>
                                    <Trans
                                      i18nKey="whatsappEligibilityCriteria"
                                      count={m?.tooltip?.criteria || 0}
                                    />
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 400, color: '#4F4F4F', fontSize: '12px' }}>{t('Calls Received')}</span>
                                <span style={{ fontWeight: 700, color: '#222222', fontSize: '14px'  }}>{m?.tooltip?.received || 0}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: !tooltipCriteriaCondition ? '8px' : '0' }}>
                                <span style={{ fontWeight: 400, color: '#4F4F4F', fontSize: '12px' }}>{t('Calls Answered')}</span>
                                <span style={{ fontWeight: 700, color: '#222222', fontSize: '14px'  }}>{m?.tooltip?.answered || 0}</span>
                              </div>
                              {!tooltipCriteriaCondition && (
                                <div style={{ marginTop: '8px' }}>
                                  <span style={{ fontWeight: 500, color: '#222222' }}>
                                    <Trans
                                      i18nKey="callEligibilityCriteria"
                                      count={m?.tooltip?.criteria || 0}
                                    />
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      }
                      action="hover"
                    >
                      <span style={{ display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <InfoIconLeaderboard size={14} />
                      </span>
                    </Popover>
                  ) : null}
                </div>
                {showCallTrackingWhatsApp || showCallTrackingCall ? (
                  <Popover
                    placement="bottom"
                    overlayStyle={{ width: '354px' }}
                    overlayInnerStyle={{ padding: '12px' }}
                    content={
                    <div style={{ height: '49px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <ExclaimationIcon size={14} />
                    </span>
                        <div style={{ fontSize: '12px', lineHeight: '1.5', fontWeight: 500, color: '#222222' }}>
                          <Trans
                            i18nKey={showCallTrackingWhatsApp ? 'metricTrackingOffWhatsApp' : 'metricTrackingOffCall'}
                            values={{ phone: '+966920066800', email: 'contact-us@bayut.sa' }}
                            components={{
                              phone: <span style={{ fontWeight: 700, color: '#00B9FF' }} />,
                              email: <span style={{ fontWeight: 700, color: '#00B9FF' }} />,
                            }}
                          />
                        </div>
                      </div>
                    }
                    action="hover"
                  >
                    <span style={{ display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <ExclaimationIcon size={14} />
                    </span>
                  </Popover>
                ) : (
                  <>
                  {badge?.slug === 'responsive-broker' && !tooltipCriteriaCondition ? (
                    <MetricValue $isMobile={isMobile}>{'-'}</MetricValue>
                  ) : (
                    <MetricValue $isMobile={isMobile}>{valueShown}</MetricValue>
                  )}
                  </>
                )}
              </MetricHeader>
              <Track $isMobile={isMobile} style={{ background: unfilledColor }}>
                {(badge?.slug === 'responsive-broker' ? tooltipCriteriaCondition : true) && <Fill $percent={percent} $color={fillColor} />}
              </Track>
            </div>
          );
        })}
      </MetricsGrid>
    </BadgeCard>
  );
};

export default AgentBages;
