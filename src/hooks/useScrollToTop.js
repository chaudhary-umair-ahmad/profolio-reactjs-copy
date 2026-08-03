import { useEffect } from 'react';
import useGetLocation from './useGetLocation';

const useScrollToTop = () => {
  const location = useGetLocation();
  useEffect(() => {
    window.scrollY > 0 && window.scrollTo(0, 0);
  }, [location.pathname]);
};

export default useScrollToTop;
