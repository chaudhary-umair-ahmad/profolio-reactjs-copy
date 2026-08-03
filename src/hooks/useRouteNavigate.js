import { useNavigate } from 'react-router-dom';

const useRouteNavigate = () => {
  const navigate = useNavigate();

  return navigate;
};

export default useRouteNavigate;
