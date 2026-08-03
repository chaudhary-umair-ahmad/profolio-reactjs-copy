import { useDispatch, useSelector } from 'react-redux';
import store from '@store';
import parentApi from '../store/parentApi';

export const useQueryUpdate = () => {
  const dispatch = useDispatch();
  const updateQueryData = (endpoint, cb, handleArgs) => {
    let parentState = store.getState().parentApi;
    const args = getEndPointArgs(endpoint, parentState, handleArgs);
    dispatch(parentApi.util.updateQueryData(endpoint, args, cb));
  };
  return [updateQueryData];
};

export const getEndPointArgs = (endpoint, parentState, handleArgs) => {
  const items = Object.keys(parentState.subscriptions).filter((e) => e.startsWith(endpoint));
  const itemKey = items.find((e) => !!Object.keys(parentState.subscriptions[e]).length);
  const args = itemKey?.split('(')?.[1]?.split(')')[0];
  if (!args || args === 'undefined') return undefined;
  return handleArgs ? handleArgs(JSON.parse(args)) : JSON.parse(args);
};

export const useGetQueryCachedData = (queryName) => {
  const queryArgs = getEndPointArgs([queryName], store.getState().parentApi);
  const data = useSelector((state) => parentApi.endpoints?.[queryName]?.select(queryArgs)(state)?.data);
  return data;
};
