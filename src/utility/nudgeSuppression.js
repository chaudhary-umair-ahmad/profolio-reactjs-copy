/**
 * Nudges from GET /api/users/current: user.nudges is an array of entries like
 *   { key: "bayut_match", count?, expires_at, redirection_url: { en, ar }, message: { en, ar }, cta?: { en, ar } }
 * `count` is deprecated (retained only on `bayut_match`) and is never used for gating/suppression —
 * a nudge triggers solely on its presence in the array. expires_at: ISO-8601 preferred, or
 * "YYYY-MM-DD HH:mm:ss" (parsed as local).
 */
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { cookieDomain, TENANT_KEY } from './env';

dayjs.extend(customParseFormat);

export const NUDGE_KEY_BAYUT_MATCH = 'bayut_match';
const NUDGE_KEY_LMS_INTRO = 'lms_intro';
const COOKIE_SAME_BASE = { path: '/', sameSite: 'Lax' };

const getBaseCookieOptions = () => {
  if (typeof window === 'undefined') {
    return { ...COOKIE_SAME_BASE };
  }
  return {
    ...COOKIE_SAME_BASE,
    secure: window.location?.protocol === 'https:',
    ...(cookieDomain && { domain: cookieDomain }),
  };
};

/**
 * @param {string|Date|number} value
 * @returns {Date|null}
 */
export const parseNudgeExpiresAt = (value) => {
  if (value == null) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const s = String(value).trim();
  if (!s) return null;
  const isoTry = dayjs(s);
  if (isoTry.isValid()) return isoTry.toDate();
  const withT = s.includes('T') ? dayjs(s) : dayjs(s.replace(' ', 'T'));
  if (withT.isValid()) return withT.toDate();
  const p = dayjs(s, 'YYYY-MM-DD HH:mm:ss', true);
  if (p.isValid()) return p.toDate();
  return null;
};

const parseLocalizedMap = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const en = typeof raw.en === 'string' ? raw.en : null;
  const ar = typeof raw.ar === 'string' ? raw.ar : null;
  if (!en && !ar) return null;
  return { en, ar };
};

/**
 * @param {{ en?: string|null, ar?: string|null }|null} map
 * @param {string} [locale] i18n language, e.g. en, ar
 * @returns {string|null}
 */
export const resolveLocalisedNudgeValue = (map, locale) => {
  if (!map) return null;
  const lang = String(locale || 'en').split(/[-_]/)[0].toLowerCase();
  if (lang === 'ar' && map.ar) return map.ar;
  if (map[lang]) return map[lang];
  return map.en || map.ar || null;
};

/**
 * @param {{ redirectionUrls?: { en?: string|null, ar?: string|null }|null }|null} nudge
 * @param {string} [locale] i18n language, e.g. en, ar
 * @returns {string|null}
 */
export const resolveNudgeRedirectionUrl = (nudge, locale) => resolveLocalisedNudgeValue(nudge?.redirectionUrls, locale);

const normalizeNudgeEntry = (entry) => {
  if (!entry || typeof entry !== 'object' || !entry.key) return null;
  const expiresAt = parseNudgeExpiresAt(entry.expires_at ?? entry.expiresAt);
  const windowHours =
    entry.window_hours != null
      ? Number(entry.window_hours)
      : entry.windowHours != null
        ? Number(entry.windowHours)
        : null;
  const redirectionUrls = parseLocalizedMap(entry.redirection_url ?? entry.redirectionUrl);
  const message = parseLocalizedMap(entry.message);
  const cta = parseLocalizedMap(entry.cta);
  return {
    key: entry.key,
    count: entry.count != null ? Number(entry.count) : null,
    expiresAt,
    windowHours: Number.isFinite(windowHours) ? windowHours : null,
    redirectionUrls,
    message,
    cta,
    getRedirectionUrl: (locale) => resolveLocalisedNudgeValue(redirectionUrls, locale),
    getMessage: (locale) => resolveLocalisedNudgeValue(message, locale),
    getCta: (locale) => resolveLocalisedNudgeValue(cta, locale),
  };
};

/**
 * @param {Array|null|undefined} raw
 * @returns {Array<object>} normalized nudges; [] for non-array input (array-only, no legacy object back-compat)
 */
export const parseUserNudges = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeNudgeEntry).filter(Boolean);
};

const DEFAULT_LMS_INTRO_FALLBACK_HOURS = 24;
const LEGACY_MIGRATION_YEARS = 1;

const findNudgeByKey = (nudges, key) => (Array.isArray(nudges) ? nudges.find((n) => n?.key === key) : null);

const resolveLmsIntroExpires = (user) => {
  const nudges = user?.parsedNudges;
  const lmsIntro = findNudgeByKey(nudges, NUDGE_KEY_LMS_INTRO);
  const bayutMatch = findNudgeByKey(nudges, NUDGE_KEY_BAYUT_MATCH);
  for (const d of [lmsIntro?.expiresAt, bayutMatch?.expiresAt]) {
    if (d && d.getTime() > Date.now()) return d;
  }
  return dayjs()
    .add(lmsIntro?.windowHours ?? bayutMatch?.windowHours ?? DEFAULT_LMS_INTRO_FALLBACK_HOURS, 'hour')
    .toDate();
};

const sanitizeKeySegment = (k) => String(k).replace(/[^a-zA-Z0-9_]/g, '_');

/**
 * @param {number|string} userId
 * @param {string} nudgeKey
 */
export const getNudgeCookieName = (userId, nudgeKey) =>
  `nudge_${TENANT_KEY}_${sanitizeKeySegment(nudgeKey)}_${userId}`;

export const getLmsIntroCookieName = (userId) => `lms_intro_${TENANT_KEY}_${userId}`;

export const getLmsIntroMigratedKey = (userId) => `lmsIntroCookieMigrated_${userId}`;

/** Suppression token = `expires_at` epoch only (deprecated `count` is never part of it). */
const buildNudgeToken = (nudge) => {
  const t = nudge?.expiresAt instanceof Date && !Number.isNaN(nudge.expiresAt.getTime()) ? nudge.expiresAt.getTime() : 0;
  return String(t);
};

/**
 * @param {number|string} userId
 * @param {string} nudgeKey
 * @param {{ expiresAt: Date|null }|null} nudge
 */
export const isNudgeSuppressed = (userId, nudgeKey, nudge) => {
  if (!userId || !nudge?.expiresAt) return true;
  const name = getNudgeCookieName(userId, nudgeKey);
  const v = Cookies.get(name);
  return v === buildNudgeToken(nudge);
};

/**
 * @param {number|string} userId
 * @param {string} nudgeKey
 * @param {{ expiresAt: Date|null }|null} nudge
 */
export const suppressNudgeForPeriod = (userId, nudgeKey, nudge) => {
  if (!userId || !nudge?.expiresAt) return;
  if (nudge.expiresAt.getTime() <= Date.now()) return;
  const name = getNudgeCookieName(userId, nudgeKey);
  Cookies.set(name, buildNudgeToken(nudge), { ...getBaseCookieOptions(), expires: nudge.expiresAt });
};

/**
 * @param {string} key e.g. "bayut_match"
 * @returns {string} e.g. "Bayut Match"
 */
export const nudgeKeyToAnalyticsValue = (key) =>
  String(key)
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const isLmsIntroSuppressed = (userId) => {
  if (!userId) return false;
  return !!Cookies.get(getLmsIntroCookieName(userId));
};

export const lmsIntroCookieMigrated = (userId) =>
  typeof localStorage !== 'undefined' && localStorage.getItem(getLmsIntroMigratedKey(userId)) === '1';

/**
 * One-time: users who only had tapTargets (no lms intro cookie) get a long cookie so the first load does not flash the modal.
 * @param {number|string} userId
 * @returns {boolean} true if a migration cookie was written
 */
export const legacyMigrateLmsIntroForPreCookieUsers = (userId) => {
  if (!userId) return false;
  if (lmsIntroCookieMigrated(userId) || isLmsIntroSuppressed(userId)) return false;
  if (typeof localStorage === 'undefined') return false;
  const raw = localStorage.getItem('tapTargets');
  if (!raw) return false;
  let tap;
  try {
    tap = JSON.parse(raw);
  } catch {
    return false;
  }
  if (!tap?.lms?.introModal?.hide) return false;
  const exp = dayjs().add(LEGACY_MIGRATION_YEARS, 'year').toDate();
  const name = getLmsIntroCookieName(userId);
  Cookies.set(name, '1', { ...getBaseCookieOptions(), expires: exp });
  localStorage.setItem(getLmsIntroMigratedKey(userId), '1');
  return true;
};

const clearLmsIntroTapTargetsHide = () => {
  if (typeof localStorage === 'undefined') return;
  const raw = localStorage.getItem('tapTargets');
  if (!raw) return;
  try {
    const tap = JSON.parse(raw);
    if (!tap?.lms) return;
    const next = {
      ...tap,
      lms: { ...tap.lms, introModal: { ...tap.lms?.introModal, hide: false } },
    };
    localStorage.setItem('tapTargets', JSON.stringify(next));
  } catch {
    /* ignore */
  }
};

/**
 * After the LMS intro cookie expires, clear tapTargets hide so the next server period can show the intro again.
 * @param {number|string} userId
 * @returns {boolean} true if tapTargets was updated
 */
export const reEnableLmsIntroInTapTargets = (userId) => {
  if (!userId) return false;
  if (typeof localStorage === 'undefined') return false;
  if (isLmsIntroSuppressed(userId)) return false;
  if (!lmsIntroCookieMigrated(userId)) return false;
  const raw = localStorage.getItem('tapTargets');
  if (!raw) return false;
  let tap;
  try {
    tap = JSON.parse(raw);
  } catch {
    return false;
  }
  if (!tap?.lms?.introModal?.hide) return false;
  clearLmsIntroTapTargetsHide();
  return true;
};

/**
 * @param {number|string} [userId]
 */
export const clearNudgeCookiesForUser = (userId) => {
  if (userId == null || userId === '') return;
  const opts = getBaseCookieOptions();
  const prefix = `nudge_${TENANT_KEY}_`;
  const suffix = `_${userId}`;
  const scannedNudgeCookieNames =
    typeof document !== 'undefined'
      ? document.cookie
          .split(';')
          .map((c) => c.split('=')[0].trim())
          .filter((name) => name.startsWith(prefix) && name.endsWith(suffix))
      : [];
  const names = [...new Set([...scannedNudgeCookieNames, getLmsIntroCookieName(userId)])];
  for (const name of names) {
    Cookies.remove(name, { path: COOKIE_SAME_BASE.path, ...(opts.domain && { domain: opts.domain }) });
  }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(getLmsIntroMigratedKey(userId));
    } catch {
      /* ignore */
    }
  }
};

/**
 * Dismissal expiry for the LMS/TruLeads intro: prefer nudge `expires_at`, else 24h from now.
 * @param {object} [user] login user with optional parsedNudges
 * @returns {Date}
 */
export const resolveLmsIntroDismissExpiresAt = (user) => resolveLmsIntroExpires(user);

/**
 * @param {number|string} userId
 * @param {Date} expiresAt
 */
export const suppressLmsIntro = (userId, expiresAt) => {
  if (!userId) return;
  if (!expiresAt || !(expiresAt instanceof Date) || Number.isNaN(expiresAt.getTime())) return;
  if (expiresAt.getTime() <= Date.now()) return;
  const name = getLmsIntroCookieName(userId);
  Cookies.set(name, '1', { ...getBaseCookieOptions(), expires: expiresAt });
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(getLmsIntroMigratedKey(userId), '1');
  }
};
