export const regex = {
  naturalNumbers: /^[1-9][0-9]*$/,
  alphabets: /^[A-Za-z\s]+$/,
  wholeNumbers: /^[0-9]{1,12}$/,
  idNumber: /^[0-9+]{5}-?[0-9+]{7}-?[0-9]{1}$/,
  decimal: /^\d+(\.\d{1,2})?$/,
  alphaNumeric: (isLimited = false) => {
    return isLimited ? /^[0-9a-zA-Z]{1,5}$/ : /^[0-9a-zA-Z]*$/;
  },
  phoneNumber: /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm,
  number: (isNonZero = false) => {
    return isNonZero ? /^[0-9]{1,12}$/ : /^([1-9]|([1-9]\d{1,11}))$/;
  },
  emailRegex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  password: /^(?=.*[A-Za-z])(?=.*?(?:[^\w\s]|[_]))(?=.*\d).{8,}$/,
  onlyAlphabets: /[a-zA-Z]/,
  onlyArabicChar: /[\u0600-\u06FF]/,
  englishRegex: /^[^\u0600-\u06FF]+$/,
  arabicRegex: /^[^A-Za-z]+$/,
  /** Legacy reference; Surge/Bayut post-listing video URL format uses `dynamic_fields[].regex` on the videos row. */
  youtubeUrl: /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?=.*v=([A-Za-z0-9_-]+))(?:\S+)?|embed\/([A-Za-z0-9_-]+)|v\/([A-Za-z0-9_-]+)|shorts\/([A-Za-z0-9_-]+))|youtu\.be\/([A-Za-z0-9_-]+))(?:\?.*)?$/,
};
