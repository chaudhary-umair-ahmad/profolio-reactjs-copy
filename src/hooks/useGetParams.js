import { useParams } from 'react-router-dom';

const useGetParams = () => {
  const params = useParams();

  return params;
};

export default useGetParams;
