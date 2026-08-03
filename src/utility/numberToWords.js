import tenantConstants from '@constants';
import { t } from 'i18next';

export const numberToWords = (number, asOrdinal, locale, showCurrency) => {
  function isFinite(value) {
    return !(typeof value !== 'number' || value !== value || value === Infinity || value === -Infinity);
  }
  var ENDS_WITH_DOUBLE_ZERO_PATTERN = /(hundred|thousand|(m|b|tr|quadr)illion)$/;
  var ENDS_WITH_TEEN_PATTERN = /teen$/;
  var ENDS_WITH_Y_PATTERN = /y$/;
  var ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN = /(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/;
  var ordinalLessThanThirteen = {
    zero: 'zeroth',
    one: 'first',
    two: 'second',
    three: 'third',
    four: 'fourth',
    five: 'fifth',
    six: 'sixth',
    seven: 'seventh',
    eight: 'eighth',
    nine: 'ninth',
    ten: 'tenth',
    eleven: 'eleventh',
    twelve: 'twelfth',
  };

  function makeOrdinal(words) {
    // Ends with *00 (100, 1000, etc.) or *teen (13, 14, 15, 16, 17, 18, 19)
    if (ENDS_WITH_DOUBLE_ZERO_PATTERN.test(words) || ENDS_WITH_TEEN_PATTERN.test(words)) {
      return words + 'th';
    }
    // Ends with *y (20, 30, 40, 50, 60, 70, 80, 90)
    else if (ENDS_WITH_Y_PATTERN.test(words)) {
      return words.replace(ENDS_WITH_Y_PATTERN, 'ieth');
    }
    // Ends with one through twelve
    else if (ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN.test(words)) {
      return words.replace(ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN, replaceWithOrdinalVariant);
    }
    return words;
  }

  function replaceWithOrdinalVariant(match, numberWord) {
    return ordinalLessThanThirteen[numberWord];
  }
  var MAX_SAFE_INTEGER = 9007199254740991;

  function isSafeNumber(value) {
    return typeof value === 'number' && Math.abs(value) <= MAX_SAFE_INTEGER;
  }

  var TEN = 10;
  var ONE_HUNDRED = 100;
  var ONE_THOUSAND = 1000;
  var ONE_MILLION = 1000000;
  var ONE_BILLION = 1000000000; //         1.000.000.000 (9)
  var ONE_TRILLION = 1000000000000; //     1.000.000.000.000 (12)
  var ONE_QUADRILLION = 1000000000000000; // 1.000.000.000.000.000 (15)
  var MAX = 9007199254740992; // 9.007.199.254.740.992 (15)

  var LESS_THAN_TWENTY = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];

  var TENTHS_LESS_THAN_HUNDRED = [
    'zero',
    'ten',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  var LESS_THAN_TWENTY_AR = [
    'صفر',
    'واحد',
    'اثنان',
    'ثلاثة',
    'أربعة',
    'خمسة',
    'ستة',
    'سبعة',
    'ثمانية',
    'تسعة',
    'عشرة',
    'أحد عشر',
    'اثنا عشر',
    'ثلاثة عشر',
    'أربعة عشر',
    'خمسة عشر',
    'ستة عشر',
    'سبعة عشر',
    'ثمانية عشر',
    'تسعة عشر',
  ];

  var TENTHS_LESS_THAN_HUNDRED_AR = [
    'صفر',
    'عشرة',
    'عشرون',
    'ثلاثون',
    'أربعون',
    'خمسون',
    'ستون',
    'سبعون',
    'ثمانون',
    'تسعون',
  ];

  function toWords(number, asOrdinal) {
    var words;
    var num = parseInt(number, 10);

    if (!isFinite(num)) {
      throw new TypeError('Not a finite number: ' + number + ' (' + typeof number + ')');
    }
    if (!isSafeNumber(num)) {
      // throw new RangeError('Input is not a safe number, it’s either too large or too small.');
      return '';
    }
    words = generateWords(num);
    return asOrdinal
      ? makeOrdinal(words)
      : showCurrency
        ? words.concat(` (${tenantConstants.CURRENCY_SYMBOL()})`)
        : words;
  }

  function generateWords(number) {
    var remainder,
      word,
      words = arguments[1];

    // We’re done
    if (number === 0) {
      return !words ? 'zero' : words.join(' ').replace(/,$/, '');
    }
    // First run
    if (!words) {
      words = [];
    }
    // If negative, prepend “minus”
    if (number < 0) {
      words.push('minus');
      number = Math.abs(number);
    }

    if (number < 20) {
      remainder = 0;
      word = locale == 'en' ? LESS_THAN_TWENTY[number] : LESS_THAN_TWENTY_AR[number];
    } else if (number < ONE_HUNDRED) {
      remainder = number % TEN;
      word =
        locale == 'en'
          ? TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)]
          : TENTHS_LESS_THAN_HUNDRED_AR[Math.floor(number / TEN)];
      // In case of remainder, we need to handle it here to be able to add the “-”
      if (remainder) {
        word += '-' + (locale === 'en' ? LESS_THAN_TWENTY[remainder] : LESS_THAN_TWENTY_AR[remainder]);
        remainder = 0;
      }
    } else if (number < ONE_THOUSAND) {
      remainder = number % ONE_HUNDRED;
      word = generateWords(Math.floor(number / ONE_HUNDRED)) + t('hundred');
    } else if (number < ONE_MILLION) {
      remainder = number % ONE_THOUSAND;
      word = generateWords(Math.floor(number / ONE_THOUSAND)) + t('thousand');
    } else if (number < ONE_BILLION) {
      remainder = number % ONE_MILLION;
      word = generateWords(Math.floor(number / ONE_MILLION)) + t('million');
    } else if (number < ONE_TRILLION) {
      remainder = number % ONE_BILLION;
      word = generateWords(Math.floor(number / ONE_BILLION)) + t('billion');
    } else if (number < ONE_QUADRILLION) {
      remainder = number % ONE_TRILLION;
      word = generateWords(Math.floor(number / ONE_TRILLION)) + t('trillion');
    } else if (number <= MAX) {
      remainder = number % ONE_QUADRILLION;
      word = generateWords(Math.floor(number / ONE_QUADRILLION)) + t('quadrillion');
    }
    words.push(word);
    return generateWords(remainder, words);
  }

  return toWords(number, asOrdinal);
};
