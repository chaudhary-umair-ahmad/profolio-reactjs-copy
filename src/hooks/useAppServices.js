import tenantConstants from '@constants';
import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserNotificationsCountQuery } from '../apis/user';
import { initializeMoEngage } from '../services/moengage/moengage';
import { isProduction } from '../utility/env';

const useAppServices = () => {
  const { user } = useSelector((state) => state.app.loginUser);
  const { isMemberArea, locale } = useSelector((state) => state.app.AppConfig);
  const { refetch } = useGetUserNotificationsCountQuery(
    {},
    {
      skip: !user?.id || !tenantConstants?.NOTIFICATION_CENTER_ENABLED,
    },
  );

  // Sentry User
  useEffect(() => {
    user?.id && isProduction && Sentry.setUser({ id: user.id, email: user?.email });
    return () => {
      isProduction && Sentry.setUser(null);
    };
  }, [user?.id]);

  // Zendesk
  useEffect(() => {
    if (isProduction && user && !isMemberArea && tenantConstants.ZENDESK) {
      const loadZendesk = () => {
        if (window.zE) {
          window.zE(() => {
            window.zE.setLocale(locale);
            window.zE('webWidget', 'updateSettings', {
              webWidget: {
                launcher: { mobile: { labelVisible: true } },
                chat: { connectOnPageLoad: false },
                position: { horizontal: 'left', vertical: 'bottom' },
              },
            });
            window.zE('webWidget', 'prefill', {
              name: { value: user.name, readOnly: true },
              email: { value: user.email, readOnly: !!user.email },
            });
          });
        }
      };
      // Zendesk
      const zendeskScript = document.createElement('script');
      zendeskScript.id = 'ze-snippet';
      zendeskScript.src = `${process.env.REACT_APP_ZENDESK}`;
      document.head.appendChild(zendeskScript);

      if (document.readyState === 'complete') {
        setTimeout(() => {
          loadZendesk();
        }, 1500);
      }
    }
  }, [user?.id, isMemberArea, tenantConstants.ZENDESK]);

  //Moengage
  useEffect(() => {
    tenantConstants.PUSH_NOTIFICATIONS_ENABLED && user?.external_id && initializeMoEngage(user);
  }, [user?.external_id]);

  //to update notification count on new notifications
  useEffect(() => {
    if (tenantConstants.PUSH_NOTIFICATIONS_ENABLED && user?.id && typeof navigator !== 'undefined') {
      function handlePushDisplayMessage(event) {
        if (event?.data?.type === 'MOENGAGE_NOTIFICATION_SHOWN') {
          refetch({});
        }
      }
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', handlePushDisplayMessage);
      } else {
        navigator?.serviceWorker?.ready &&
          navigator.serviceWorker.ready.then(() => {
            navigator.serviceWorker.addEventListener('message', handlePushDisplayMessage);
          });
      }
      return () => {
        navigator?.serviceWorker?.removeEventListener('message', handlePushDisplayMessage);
      };
    }
  }, [user?.id]);

  //trigger notification requests
  useEffect(() => {
    if (tenantConstants.PUSH_NOTIFICATIONS_ENABLED && user?.id && typeof Notification !== 'undefined') {
      if (Notification.permission === 'default') {
        // Ask user to allow push
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            if (window?.Moengage?.call_web_push) {
              window.Moengage.call_web_push();
            }
          }
        });
      } else if (Notification.permission === 'granted') {
        if (window?.Moengage?.call_web_push) {
          window.Moengage.call_web_push();
        }
      }
    }
  }, [user?.id]);
};
export default useAppServices;
