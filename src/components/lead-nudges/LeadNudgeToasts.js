import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { Badge, Button, notification } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../common';
import { leadNudgeClickEvent, leadNudgeCloseEvent } from '../../services/analyticsService';
import { isNudgeSuppressed, nudgeKeyToAnalyticsValue, suppressNudgeForPeriod } from '../../utility/nudgeSuppression';
import { getClassifiedBaseURL } from '../../utility/env';
import './lead-nudge-toasts.css';

const sanitizeKeySegment = (k) => String(k).replace(/[^a-zA-Z0-9_]/g, '_');

/**
 * The nudge `redirection_url` comes from the API and is otherwise navigated to
 * verbatim. Only allow a full-page redirect to our own origin or to the
 * classified site (and its subdomains); anything else is treated as untrusted
 * to prevent an open-redirect / phishing hop via a tainted nudge URL.
 */
const isTrustedNudgeUrl = (raw) => {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    const allowedHosts = [window.location.host];
    try {
      const classifiedHost = new URL(getClassifiedBaseURL()).host;
      if (classifiedHost) allowedHosts.push(classifiedHost);
    } catch {
      /* classified base URL missing or invalid */
    }
    return allowedHosts.some((host) => url.host === host || url.host.endsWith(`.${host}`));
  } catch {
    return false;
  }
};

/**
 * Renders one stacked toast per eligible nudge from GET /api/users/current `nudges` (BE-provided array).
 * Each nudge is suppressed independently via a per-key cookie until its `expires_at`.
 */
const LeadNudgeToasts = () => {
  const { i18n } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser) || {};
  const { rtl } = useSelector((state) => state.app.AppConfig) || {};
  const navigate = useNavigate();
  const shownTokensRef = useRef(new Set());
  /** Per-key: true when the next `onClose` was triggered by the CTA and should skip `close_nudge`. */
  const skipCloseNudgeAnalyticsRef = useRef({});

  useEffect(() => {
    if (!user?.id || !tenantConstants.LEAD_NUDGE_TOAST_ENABLED || !tenantConstants.BAYUT_MATCHING_LEAD) {
      return;
    }
    const nudges = Array.isArray(user.parsedNudges) ? user.parsedNudges : [];

    nudges.forEach((nudge) => {
      if (!nudge?.key || !nudge.expiresAt || nudge.expiresAt.getTime() <= Date.now()) return;
      if (isNudgeSuppressed(user.id, nudge.key, nudge)) return;

      const body = nudge.getMessage(i18n.language);
      if (!body) return;

      const dedupe = `${nudge.key}@${nudge.expiresAt.getTime()}`;
      if (shownTokensRef.current.has(dedupe)) return;
      shownTokensRef.current.add(dedupe);

      const analyticsContext = {
        language: i18n.language,
        pageTitle: typeof document !== 'undefined' ? document.title : '',
        value: nudgeKeyToAnalyticsValue(nudge.key),
      };

      const toastKey = `leadNudge_${sanitizeKeySegment(nudge.key)}_toast`;

      const goToTarget = () => {
        const target = nudge.getRedirectionUrl(i18n.language);
        skipCloseNudgeAnalyticsRef.current[nudge.key] = true;
        leadNudgeClickEvent(user, analyticsContext);
        notification.destroy(toastKey);
        suppressNudgeForPeriod(user.id, nudge.key, nudge);
        if (!target) return;
        const isExternal = target.startsWith('http://') || target.startsWith('https://');
        if (isExternal) {
          if (isTrustedNudgeUrl(target)) window.location.assign(target);
        } else {
          navigate(target);
        }
      };

      const onClose = () => {
        suppressNudgeForPeriod(user.id, nudge.key, nudge);
        const skipClose = skipCloseNudgeAnalyticsRef.current[nudge.key];
        skipCloseNudgeAnalyticsRef.current[nudge.key] = false;
        if (!skipClose) {
          leadNudgeCloseEvent(user, analyticsContext);
        }
      };

      const ctaLabel = nudge.getCta(i18n.language);
      const cta = ctaLabel ? (
        <Button
          type="link"
          className="lead-nudge-truleads-toast__cta"
          onClick={goToTarget}
          style={{ color: tenantTheme['primary-color'] || '#009688' }}
        >
          {ctaLabel} {rtl ? '←' : '→'}
        </Button>
      ) : null;

      notification.open({
        key: toastKey,
        className: 'lead-nudge-truleads-toast',
        message: <p className="lead-nudge-truleads-toast__text">{body}</p>,
        description: cta,
        icon: (
          <div className="lead-nudge-truleads-toast__icon-wrap">
            <div className="lead-nudge-truleads-toast__icon">
              <Icon icon="BsStars" size="22px" />
            </div>
            {nudge.count != null && nudge.count > 0 && (
              <Badge
                count={nudge.count}
                className="lead-nudge-truleads-toast__badge"
                color="#1a8f7a"
                overflowCount={99}
              />
            )}
          </div>
        ),
        placement: rtl ? 'bottomLeft' : 'bottomRight',
        duration: 0,
        onClose,
      });
      suppressNudgeForPeriod(user.id, nudge.key, nudge);
    });
  }, [user, navigate, i18n.language, rtl]);

  return null;
};

export default LeadNudgeToasts;
