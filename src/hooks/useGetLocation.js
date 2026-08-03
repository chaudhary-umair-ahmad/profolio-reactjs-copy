import { useLocation } from 'react-router-dom';

const useGetLocation = () => {
  const location = useLocation();
  const paths = location.pathname.split('/')?.filter(path => path != '');
  const basePath = `/${paths?.[0]}`;
  const routePath = `/${paths?.[paths?.length - 1]}`;

  return {
    ...location,
    basePath,
    routePath,
  };
};

export default useGetLocation;
