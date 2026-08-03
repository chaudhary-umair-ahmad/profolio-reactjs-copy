import { useEffect, useState } from 'react';

import debounce from 'lodash/debounce';
import { getOBJValueByKey } from '../utility/utility';

const useDebounceFetch = (dependencyArray = [], fetchApi, dataKey) => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    debouncedFetchData(fetchApi, response => {
      if (response) {
        setResults(getOBJValueByKey(response, dataKey));
      }
    });
  }, dependencyArray);

  const debouncedFetchData = debounce((fetchApi, cb) => {
    fetchData(fetchApi, cb);
  }, 300);

  const fetchData = async (fetchApi, cb) => {
    const res = await fetchApi();
    cb(res);
  };
  return [results, setResults];
};

export default useDebounceFetch;
