export const convertQueryObjToString = (obj) => {
  if (!obj) return '';
  const keys = Object.keys(obj);
  return keys
    .map((key) =>
      obj[key]
        ? Array.isArray(obj[key])
          ? obj[key].map((item) => `${key}[]=${item}`).join('&')
          : `${key}=${obj[key]}`
        : '',
    )
    .filter((e) => !!e)
    .join('&');
};

const removeCommas = (filters) => {
  if (!filters) return '';
  const keys = Object.keys(filters);
  const params = keys
    ?.map((e) => {
      const valuesArray = filters[e] && filters[e] != 'null' ? filters[e]?.split(',') : '';
      return (
        valuesArray &&
        valuesArray
          ?.map((val) => {
            return `${e}=${val}`;
          })
          .join('&')
      );
    })
    .join('&');
  return params;
};

export const getQueryString = (filters, removeCommaSeperated = false) => {
  const queryString =
    typeof filters === 'string'
      ? filters
      : removeCommaSeperated
        ? removeCommas(filters)
        : convertQueryObjToString(filters);
  return queryString;
};

export const mapQueryStringToFilterObject = (search, cb = () => {}) => {
  const queryObj = {};
  const queryString = search?.split('?')[1];

  if (queryString) {
    const items = decodeURI(queryString)?.split('&');
    for (const item of items) {
      const key = item?.split('=')[0];
      const value = item?.split('=')[1];
      cb(key, value);
      if (key && value) {
        if (queryObj[key]) {
          queryObj[key] += `,${value}`;
        } else {
          queryObj[key] = value;
        }
      }
    }
  }

  return { queryObj };
};
