import tenantTheme from '@theme';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notification, Skeleton } from '../../components/common';
import { PaymentFrame } from './styled';

const FLOW_THREE_DS_STYLE_ID = 'flow-3ds-modal-overrides';
const FLOW_THREE_DS_CLOSE_BTN_ID = 'flow-3ds-close-btn';
const THREE_DS_DIALOG_SELECTOR = '#cko-modal-root [role="dialog"]';
const THREE_DS_IFRAME_ID = 'threeDS-modal-iframe';

// Flow `appearance` tokens — translated from the legacy Frames `style` config so the
// card form keeps matching current production checkout styling (no new design per PM).
// Note: `appearance` only styles the card form and modal background/border-radius — the
// SDK hardcodes the 3DS shell to ~90% viewport, so size is constrained via CSS below.
export const flowAppearance = {
  colorAction: tenantTheme['primary-color'],
  colorInverse: '#ffffff',
  colorPrimary: '#000000',
  colorSecondary: '#333333',
  colorBackground: '#ffffff',
  colorBorder: '#ffffff',
  colorFormBorder: tenantTheme['border-color-normal'],
  colorError: tenantTheme['error-color'],
  colorOutline: tenantTheme['primary-color'],
  borderRadius: ['6px', '6px'],
  fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
};

// Override Flow's default cardholder-name placeholder ("Jordan Smith") via the
// `form.full_name.placeholder` translation key. Flow picks the language from the
// payment session's locale, so register the override under every locale the app
// supports to ensure it applies regardless of which one the session uses.
export const flowTranslations = {
  en: { 'form.full_name.placeholder': 'Enter Full Name' },
  ar: { 'form.full_name.placeholder': 'أدخل الاسم الكامل' },
  ur: { 'form.full_name.placeholder': 'Enter Full Name' },
};

// 3DS challenge windows use fixed issuer sizes (e.g. 390×400). A wider shell leaves the
// iframe content left-aligned with empty space on the right; match the common size instead.
const flowThreeDSModalStyles = `
  ${THREE_DS_DIALOG_SELECTOR} {
    width: min(600px, 92vw) !important;
    height: min(550px, 85vh) !important;
    max-width: min(600px, 92vw) !important;
    max-height: min(550px, 85vh) !important;
    display: block !important;
    position: relative !important;
    padding: 0 !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  }

  /* Match default ant modal close — simple grey cross, no background. */
  #${FLOW_THREE_DS_CLOSE_BTN_ID} {
    position: fixed !important;
    z-index: 2147483647 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 22px !important;
    height: 22px !important;
    min-width: 22px !important;
    min-height: 22px !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    outline: none !important;
    border-radius: 0 !important;
    background: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
    color: rgba(0, 0, 0, 0.45) !important;
    cursor: pointer !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    pointer-events: auto !important;
    transition: color 0.2s !important;
  }

  #${FLOW_THREE_DS_CLOSE_BTN_ID}:hover {
    color: rgba(0, 0, 0, 0.75) !important;
    background: none !important;
    background-color: transparent !important;
  }

  #${FLOW_THREE_DS_CLOSE_BTN_ID} svg {
    width: 14px !important;
    height: 14px !important;
    display: block !important;
    fill: currentColor !important;
  }

  #${FLOW_THREE_DS_CLOSE_BTN_ID} svg path {
    fill: currentColor !important;
  }

  #cko-modal-root #${THREE_DS_IFRAME_ID} {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
  }
`;

const ensureThreeDSModalStyles = () => {
  let style = document.getElementById(FLOW_THREE_DS_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = FLOW_THREE_DS_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = flowThreeDSModalStyles;
};

// Same icon as app modals: IoMdClose
const THREE_DS_CLOSE_ICON_SVG =
  '<svg viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"/></svg>';

const applyCloseButtonStyles = (closeButton) => {
  Object.assign(closeButton.style, {
    position: 'fixed',
    zIndex: '2147483647',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
    minWidth: '22px',
    minHeight: '22px',
    padding: '0',
    margin: '0',
    border: 'none',
    outline: 'none',
    borderRadius: '0',
    background: 'transparent',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: 'rgba(0, 0, 0, 0.45)',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  });

  const svg = closeButton.querySelector('svg');
  if (svg) {
    svg.style.width = '14px';
    svg.style.height = '14px';
    svg.style.display = 'block';
    svg.querySelector('path')?.setAttribute('fill', 'currentColor');
  }
};

const getThreeDSDialog = () => {
  const iframe = document.getElementById(THREE_DS_IFRAME_ID);
  if (iframe) return iframe.closest('[role="dialog"]');
  return document.querySelector(THREE_DS_DIALOG_SELECTOR);
};

const CreditCardItem = ({
  showForm = true,
  paymentSession,
  appearance,
  onPaymentCompleted = () => {},
  onError = () => {},
  on3DSCancelled = () => {},
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const flowComponentRef = useRef(null);
  // Show a skeleton while the session is being created and the Flow component mounts,
  // until Flow signals it is ready (or errors out).
  const [loading, setLoading] = useState(true);
  // Always invoke the latest parent callbacks from inside the Flow component, which is
  // mounted once per session and would otherwise close over stale handlers/state.
  const callbacksRef = useRef({ onPaymentCompleted, onError, on3DSCancelled });

  useEffect(() => {
    callbacksRef.current = { onPaymentCompleted, onError, on3DSCancelled };
  });

  useEffect(() => {
    ensureThreeDSModalStyles();
  }, []);

  useEffect(() => {
    let isActive = true;
    let readyFallback;
    let threeDSObserver;
    let cleanupThreeDSObserver;

    const dismissThreeDSModal = () => {
      flowComponentRef.current?.unmount();
      flowComponentRef.current = null;
      removeCloseButton();
      const modalRoot = document.getElementById('cko-modal-root');
      if (modalRoot) modalRoot.innerHTML = '';
    };

    const handleThreeDSCancel = () => {
      dismissThreeDSModal();
      callbacksRef.current.on3DSCancelled();
    };

    const positionCloseButton = (closeButton, dialog) => {
      const rect = dialog.getBoundingClientRect();
      applyCloseButtonStyles(closeButton);
      closeButton.style.top = `${rect.top + 12}px`;
      closeButton.style.left = `${rect.right - 30}px`;
    };

    const removeCloseButton = () => {
      document.getElementById(FLOW_THREE_DS_CLOSE_BTN_ID)?.remove();
    };

    const injectThreeDSCloseButton = (dialog) => {
      if (!dialog) return;

      let closeButton = document.getElementById(FLOW_THREE_DS_CLOSE_BTN_ID);
      if (!closeButton) {
        closeButton = document.createElement('button');
        closeButton.id = FLOW_THREE_DS_CLOSE_BTN_ID;
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', t('Close'));
        closeButton.innerHTML = THREE_DS_CLOSE_ICON_SVG;
        closeButton.addEventListener('click', handleThreeDSCancel);
        document.body.appendChild(closeButton);
      }

      positionCloseButton(closeButton, dialog);
    };

    const observeThreeDSModal = () => {
      // #cko-modal-root is created only when 3DS opens — watch document.body instead.
      const syncCloseButton = () => {
        const dialog = getThreeDSDialog();
        if (dialog) {
          injectThreeDSCloseButton(dialog);
        } else {
          removeCloseButton();
        }
      };

      const handleReposition = () => syncCloseButton();

      syncCloseButton();
      threeDSObserver = new MutationObserver(syncCloseButton);
      threeDSObserver.observe(document.body, { childList: true, subtree: true });
      const pollInterval = setInterval(syncCloseButton, 300);
      window.addEventListener('resize', handleReposition);
      window.addEventListener('scroll', handleReposition, true);

      return () => {
        clearInterval(pollInterval);
        window.removeEventListener('resize', handleReposition);
        window.removeEventListener('scroll', handleReposition, true);
        removeCloseButton();
      };
    };

    const mountFlow = async () => {
      if (!paymentSession || !containerRef.current || !window?.CheckoutWebComponents) return;

      setLoading(true);
      try {
        const checkout = await window.CheckoutWebComponents({
          paymentSession,
          publicKey: process.env.REACT_APP_CHECKOUT_ID,
          environment: process.env.REACT_APP_ENVIRONMENT === 'production' ? 'production' : 'sandbox',
          appearance: appearance || flowAppearance,
          translations: flowTranslations,
          onReady: () => {
            if (isActive) setLoading(false);
          },
          onPaymentCompleted: (_component, paymentResponse) => {
            callbacksRef.current.onPaymentCompleted(paymentResponse);
          },
          onError: (_component, error) => {
            if (isActive) setLoading(false);
            notification.error(t('Your payment could not process'));
            callbacksRef.current.onError(error);
          },
        });

        if (!isActive) return;

        const flowComponent = checkout.create('flow');
        flowComponentRef.current = flowComponent;
        flowComponent.mount(containerRef.current);
        cleanupThreeDSObserver = observeThreeDSModal();

        // Safety net in case the onReady lifecycle event does not fire, so the skeleton
        // never permanently hides a rendered Flow form.
        readyFallback = setTimeout(() => {
          if (isActive) setLoading(false);
        }, 8000);
      } catch (error) {
        if (isActive) {
          setLoading(false);
          notification.error(t('Your payment could not process'));
          callbacksRef.current.onError(error);
        }
      }
    };

    mountFlow();

    return () => {
      isActive = false;
      if (readyFallback) clearTimeout(readyFallback);
      threeDSObserver?.disconnect();
      cleanupThreeDSObserver?.();
      flowComponentRef.current?.unmount();
      flowComponentRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSession]);

  if (!showForm) return null;

  return (
    <PaymentFrame
      // title={t('Credit/Debit')}
      // extra={<img src={require('../../static/img/credit-card.png')} height="36" alt="credit card" />}
    >
      <div style={{ position: 'relative' }}>
        {loading && (
          <div
            className="flow-skeleton"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              background: '#fff',
              display: 'grid',
              gap: 16,
              alignContent: 'start',
            }}
          >
            <Skeleton type="input" block />
            <Skeleton type="input" block />
            <Skeleton type="input" block />
            <Skeleton type="button" width="100%" height={44} />
          </div>
        )}
        <div ref={containerRef} id="flow-container" style={{ minHeight: loading ? 220 : undefined }} />
      </div>
    </PaymentFrame>
  );
};

export default CreditCardItem;
