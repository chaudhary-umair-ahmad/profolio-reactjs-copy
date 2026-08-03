import { DATE_FORMAT, YEAR_MONTH_DATE_FORMAT } from '../constants/formats';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import 'moment/locale/ar'; // Import Arabic locale
import { addDays, endOfDay, startOfDay } from 'date-fns';

const defineds = {
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
};
export const getStaticRanges = (reportsStaticRanges = false, t) => {
  return [
    {
      label: t('Today'),
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday,
      }),
    },
    {
      label: t('Yesterday'),
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday,
      }),
    },

    {
      label: t('Last 7 Days'),
      range: () => ({
        startDate: addDays(new Date(), -6),
        endDate: startOfDay(new Date()),
      }),
    },
    {
      label: t('Last 15 Days'),
      range: () => ({
        startDate: addDays(new Date(), -14),
        endDate: startOfDay(new Date()),
      }),
    },
    {
      label: t('Last 30 Days'),
      range: () => ({
        startDate: addDays(new Date(), -29),
        endDate: startOfDay(new Date()),
      }),
    },
    ...(reportsStaticRanges
      ? [
          {
            label: t('Last 3 Months'),
            range: () => ({
              startDate: addDays(new Date(), -89),
              endDate: startOfDay(new Date()),
            }),
          },
          {
            label: t('Last 6 Months'),
            range: () => ({
              startDate: addDays(new Date(), -179),
              endDate: startOfDay(new Date()),
            }),
          },
          {
            label: t('Last Year'),
            range: () => ({
              startDate: addDays(new Date(), -364),
              endDate: startOfDay(new Date()),
            }),
          },
          // {
          //   label: t('Last 2 Years'),
          //   range: () => ({
          //     startDate: addDays(new Date(), -729),
          //     endDate: startOfDay(new Date()),
          //   }),
          // },
        ]
      : []),
  ];
};

export const getDatePickerPlaceholder = (startDate, endDate, reportsStaticRanges, t) => {
  const datePickerLabels = getStaticRanges(reportsStaticRanges, t);
  const foundRange = datePickerLabels?.find((range) => {
    const definedRange = range?.range();
    const rangeStartDate = getTimeDateString(definedRange?.startDate, YEAR_MONTH_DATE_FORMAT, false, true);
    const rangeEndDate = getTimeDateString(definedRange?.endDate, YEAR_MONTH_DATE_FORMAT, false, true);
    return rangeStartDate === startDate && rangeEndDate === endDate;
  });
  return foundRange ? foundRange?.label : null;
};
export const getDateStringToShow = (dateString, locale, dayjs) => {
  dayjs.locale(locale);
  return dayjs(dateString)?.fromNow();
};

export function getMonthFromString(mon) {
  const month = new Date(Date.parse(`${mon} 1, 2012`)).getMonth() + 1;
  return month.toString().length === 1 ? `0${month}` : month;
}

export function getParsedDateValue(dateString) {
  const formattedDate = dayjs(new Date(dateString)).format(YEAR_MONTH_DATE_FORMAT);
  return formattedDate;
}

export function getStartEndValue(start, end) {
  const startDate = getTimeDateString(getParsedDateValue(start), DATE_FORMAT, false, true);
  const endDate = getTimeDateString(getParsedDateValue(end), DATE_FORMAT, false, true);
  return `${startDate} - ${endDate}`;
}

export function getDateDiff(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const timeDifference = Math.abs(startDate - endDate);
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

export const getTimeDateString = (dateString, dateFormat = DATE_FORMAT, local, defaultLocale) => {
  if (!!dateString) {
    let date = new Date(
      typeof dateString === 'string' && dateString.includes('Z') && !local
        ? dateString.replace('Z', '')
        : typeof dateString === 'string'
          ? dateString.replace(' ', 'T')
          : dateString,
    );
    var datetime = defaultLocale ? moment(date).locale('en').format(dateFormat) : moment(date).format(dateFormat); // Set the locale explicitly for formatting time
    return datetime;
  }
  return '';
};

export const getVariousDates = (diff, format = 'YYYY-MM-DD', add) => {
  const currentDate = moment().locale('en').format(format);
  const prevDate = add
    ? moment().locale('en').add(diff, 'days').format(format)
    : moment().locale('en').subtract(diff, 'days').format(format);
  return [prevDate, currentDate];
};

export const getDateLabels = (startDate, endDate, dateFormat) => {
  let dateArray = [];
  let currentDate = moment(startDate).locale('en');
  let stopDate = moment(endDate).locale('en');
  while (currentDate <= stopDate) {
    dateArray.push(
      moment(currentDate)
        .locale('en')
        .format(dateFormat || 'MMM DD, YYYY'),
    );
    currentDate = currentDate.add(1, 'days');
  }
  return dateArray;
};

export const getDateDiffInDays = (dateRange) => {
  return Math.ceil((new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime()) / (1000 * 3600 * 24)) + 1;
};
