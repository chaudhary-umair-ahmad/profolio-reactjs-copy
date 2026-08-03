import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ListingContainer } from '../../../components/listing-container/ListingContainer';
import { useFetchOnQueryUpdate } from '../../../hooks';
import { useLazyGetMyOrdersQuery } from '../../../apis/cart';
const MyOrders = () => {
  const { user } = useSelector((state) => state.app.loginUser);

  const [ordersData, setOrdersdata] = useState([]);
  const [getMyOrders, { isLoading: loading, error }] = useLazyGetMyOrdersQuery();

  const { fetchData } = useFetchOnQueryUpdate(
    (params) => {
      if (user?.id) {
        getOrdersData(params);
      }
    },
    [user?.id],
  );

  const getOrdersData = async (params) => {
    const response = await getMyOrders({ userId: user.id, params: params });
    if (response) {
      if (!response.error) {
        setOrdersdata(response?.data);
      }
    }
  };

  return (
    <ListingContainer
      listingsData={ordersData}
      listingApi={getOrdersData}
      loading={loading}
      error={error}
      onRetry={getOrdersData}
      enableFilters={false}
    />
  );
};

export default MyOrders;
