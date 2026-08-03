import { current } from '@reduxjs/toolkit';
import listingsApis from '../apis/listings';
import parentApi from '../store/parentApi';
import tenantUtils from '@utils';
import { normalizeBookedDateRanges } from './bookedDateRanges';

const STATS_KEYS = [
  'views',
  'clicks',
  'leads',
  'ctr',
  'calls',
  'stats',
  'statsError',
  'emails_clicked',
  'emails_received',
  'sms',
  'whatsapp',
  'chat',
  'whatsapp_sent',
  'whatsapp_chats',
  'calls_received',
  'calls_answered',
  'calls_missed',
];

const pickExistingStatsFromPlatformRow = (platformRow) => {
  if (!platformRow || platformRow.views === 'loading' || platformRow.views === undefined) return {};
  return STATS_KEYS.reduce((acc, key) => {
    if (platformRow[key] !== undefined) acc[key] = platformRow[key];
    return acc;
  }, {});
};

const parseGetMyListingsArgs = (queryKey) => {
  const s = String(queryKey);
  if (!s.startsWith('getMyListings(') || !s.endsWith(')')) return null;
  const inner = s.slice('getMyListings('.length, -1);
  try {
    return JSON.parse(inner);
  } catch {
    return null;
  }
};

/**
 * Updates all fulfilled getMyListings caches so booking UI matches saved ranges without refetching.
 * Refreshes row actions closure via a new listingRowActions that reads merged listing + booking.
 */
const rowMatchesListingId = (row, listingId) => {
  if (row?.id != null && String(row.id) === String(listingId)) return true;
  if (row?.property_id != null && String(row.property_id) === String(listingId)) return true;
  return false;
};

export const patchAllMyListingsCachesForBooking = (dispatch, getState, listingId, bookedDateRanges) => {
  if (listingId == null || listingId === '') return;

  const bookedDates = normalizeBookedDateRanges(bookedDateRanges);
  const booked = bookedDates.length > 0;
  const state = getState();
  const user = state?.app?.loginUser?.user;
  const queries = state?.[parentApi.reducerPath]?.queries ?? {};
  const keys = Object.keys(queries).filter((k) => k.startsWith('getMyListings('));

  const applyDraft = (draftListings) => {
    if (!draftListings?.list?.length) return;
    const i = draftListings.list.findIndex((row) => rowMatchesListingId(row, listingId));
    if (i === -1) return;

    const row = draftListings.list[i];
    const prevAdditional =
      row.additional_details != null && typeof row.additional_details === 'object' ? row.additional_details : {};
    const additional_details = { ...prevAdditional, booked_dates: bookedDates };

    row.booked = booked;
    row.additional_details = additional_details;

    if (row.property && typeof row.property === 'object') {
      row.property.booked = booked;
      row.property.bookedDates = bookedDates;
    }

    if (!row.dynamic_data) row.dynamic_data = {};
    const prevDyn = row.dynamic_data.dynamic_fields != null && typeof row.dynamic_data.dynamic_fields === 'object'
      ? row.dynamic_data.dynamic_fields
      : {};
    row.dynamic_data.dynamic_fields = {
      ...prevDyn,
      booked,
      additional_details,
    };

    const platformRow = row.platforms?.data?.[0];
    if (platformRow && user) {
      const existingStats = pickExistingStatsFromPlatformRow(platformRow);
      /** Plain snapshots: draft proxies are revoked after updateQueryData; do not close over `row`. */
      const listingForActions = {
        ...current(row),
        booked,
        additional_details,
      };
      const nextPlatform = {
        ...current(platformRow),
        listingRowActions: (refsObject, loading) =>
          tenantUtils.getListingRowActions(listingForActions, 'ksa', refsObject, loading),
      };
      STATS_KEYS.forEach((key) => {
        if (existingStats[key] !== undefined) nextPlatform[key] = existingStats[key];
      });
      row.platforms = {
        ...current(row.platforms),
        data: [nextPlatform],
      };
    }

    draftListings.list[i] = row;
  };

  keys.forEach((key) => {
    const args = parseGetMyListingsArgs(key);
    const entry = queries[key];
    if (!args || entry?.status !== 'fulfilled') return;
    dispatch(listingsApis.util.updateQueryData('getMyListings', args, applyDraft));
  });
};
