import dayjs from 'dayjs';

/**
 * API may send snake_case, camelCase, or alternate keys for booked ranges.
 * Returns a stable { start_date, end_date }[] for UI and mappers.
 */
export const normalizeBookedDateRanges = (ranges) => {
  if (!Array.isArray(ranges)) return [];
  return ranges
    .map((r) => {
      if (!r || typeof r !== 'object') return null;
      const start = r.start_date ?? r.startDate ?? r.from ?? r.start;
      const end = r.end_date ?? r.endDate ?? r.to ?? r.end;
      if (start == null || end == null) return null;
      return { start_date: start, end_date: end };
    })
    .filter(Boolean);
};

export const hasBookedRangeIncludingToday = (ranges) => {
  const normalized = normalizeBookedDateRanges(ranges);
  if (!normalized.length) return false;
  const today = dayjs().startOf('day');
  return normalized.some((range) => {
    const start = dayjs(range.start_date).startOf('day');
    const end = dayjs(range.end_date).startOf('day');
    if (!start.isValid() || !end.isValid()) return false;
    return (
      (today.isSame(start, 'day') || today.isAfter(start, 'day')) &&
      (today.isSame(end, 'day') || today.isBefore(end, 'day'))
    );
  });
};

/** End date string for the range that includes today (for tooltips); null if none. */
export const getActiveBookingEndDateString = (ranges) => {
  const normalized = normalizeBookedDateRanges(ranges);
  if (!normalized.length) return null;
  const today = dayjs().startOf('day');
  for (const range of normalized) {
    const start = dayjs(range.start_date).startOf('day');
    const end = dayjs(range.end_date).startOf('day');
    if (!start.isValid() || !end.isValid()) continue;
    const inRange =
      (today.isSame(start, 'day') || today.isAfter(start, 'day')) &&
      (today.isSame(end, 'day') || today.isBefore(end, 'day'));
    if (inRange) return end.format('YYYY-MM-DD');
  }
  return null;
};
