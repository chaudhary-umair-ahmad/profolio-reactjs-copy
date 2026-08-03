import tenantRoutes from '@routes';
import useGetLocation from "./useGetLocation";

const useRouteType = () => {
  const location = useGetLocation();
  const currentRoute = tenantRoutes.publicRoutes().find(route => location.pathname?.includes(route.path));
  return currentRoute ? "public" : "private";
};

export default useRouteType;
