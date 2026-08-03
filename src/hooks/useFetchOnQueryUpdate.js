import { useEffect } from 'react';
import { mapQueryStringToFilterObject } from '../utility/urlQuery';
import useGetLocation from './useGetLocation';
const useFetchOnQueryUpdate = (fetchData, dependencyArray = []) => {
  const location = useGetLocation();
  const fetchD = () => {
    const { queryObj } = mapQueryStringToFilterObject(location.search);
    fetchData(queryObj);
  };

  useEffect(() => {
    fetchD();
  }, [location.search, ...dependencyArray]);

  return { fetchData: fetchD };
};

export default useFetchOnQueryUpdate;
