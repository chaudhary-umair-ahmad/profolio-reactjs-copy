import { getErrorString, getOBJValueByKey } from '../utility/utility';
import { useEffect, useState, useMemo } from 'react';

import { fetchApi } from '../utility/commonApis';

const useServerPropsForLists = (serverProps, defaultOptions) => {
  const [options, setOptions] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const memoizedDefaultOptions = useMemo(() => defaultOptions, [JSON.stringify(defaultOptions)]);
  
  useEffect(() => {
    setOptionsData();
  }, [memoizedDefaultOptions]);

  const setOptionsData = async () => {
    if (serverProps) {
      const { url, payloadKey, parser } = serverProps;
      const response = await fetchApi(url);
      setApiLoading(true);
      if (response && getOBJValueByKey(response, payloadKey)) {
        setApiLoading(false);
        setOptions(getOBJValueByKey(response, payloadKey).map(parser));
      } else {
        setApiLoading(false);
        setApiError(getErrorString(response));
      }
    } else {
      setOptions(defaultOptions);
    }
  };

  return { options, setOptions, apiLoading, apiError };
};

export default useServerPropsForLists;
