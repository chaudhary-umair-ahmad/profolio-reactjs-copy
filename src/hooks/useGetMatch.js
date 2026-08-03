import { useMatch, useResolvedPath } from 'react-router-dom';
import useGetLocation from './useGetLocation';

const useGetMatch = path => {
  const location = useGetLocation();
  const resolvedPath = useResolvedPath(path ? path : location?.pathname);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  return {
    ...match,
    isExact: location?.pathname == match?.pathname,
  };
};

export default useGetMatch;
