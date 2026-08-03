import { NetworkService } from '../services/networkService';

export const fetchApi = async (url) => {
  const response = await NetworkService.get(url);
  if (response && response.data) {
    return {
      ...response,
    };
  }
  return response;
};
