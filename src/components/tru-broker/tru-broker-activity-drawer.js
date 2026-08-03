import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Drawer, notification } from '../../components/common';
import { InfiniteScroll } from '../../components/common/infinite-scroll/infinite-scroll';
import ActivityList from './tru-broker-activity-list';
import TruBrokerActivityListSkeleton from './tru-broker-activity-skeleton';
import { useLazyGetTruPointsActivityLogsDataQuery } from '../../apis/user';

const TruBrokerActivityDrawer = forwardRef((_props, ref) => {
  const { t } = useTranslation();
  const [truBrokerLogDetails, setTruBrokerLogDetails] = useState(null);
  const [paginationDetails, setPaginationDetails] = useState(null);
  const [userId, setUserId] = useState();
  const { locale, isMobile } = useSelector((state) => state.app.AppConfig);
  const [getTruPointsActivityLogsData, { isLoading: truBrokerLogDetailsLoading, error, isFetching }] =
    useLazyGetTruPointsActivityLogsDataQuery();

  const drawerRef = useRef();

  useImperativeHandle(
    ref,
    () => ({
      openDrawer: onOpenTruBrokerActivityDrawer,
    }),
    [],
  );

  const fetchTruBrokerLogDetails = async (id, page = 1, updateList = false) => {
    const response = await getTruPointsActivityLogsData({ page: page, userId: id });
    if (response) {
      if (response?.error) {
        notification.error(response?.error);
      } else {
        setTruBrokerLogDetails((prev) => {
          const updated_response = response?.data?.tru_point_activities?.map((item, index) => ({
            ...item,
            key: prev?.length ? response?.data?.pagination?.current_page * 10 + index : index,
          }));
          return prev?.length && !!updateList ? [...prev, ...updated_response] : updated_response;
        });
        setPaginationDetails(response?.data?.pagination);
      }
    }
  };

  const onOpenTruBrokerActivityDrawer = (id) => {
    drawerRef.current.openDrawer();
    setUserId(id);
    fetchTruBrokerLogDetails(id);
  };

  return (
    <Drawer
      width={'30vw'}
      title={t('TruPoints™ Activity')}
      placement={isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right'}
      ref={drawerRef}
      height={600}
      footer={null}
    >
      {!!truBrokerLogDetailsLoading ? (
        <TruBrokerActivityListSkeleton />
      ) : (
        <InfiniteScroll
          CardComponent={ActivityList}
          itemKey="key"
          dataList={truBrokerLogDetails}
          loading={truBrokerLogDetailsLoading}
          fetchFunction={(page) => fetchTruBrokerLogDetails(userId, page, true)}
          nextPage={paginationDetails?.next_page}
          containerOffset={200}
          requestOffset={340}
        />
      )}
    </Drawer>
  );
});
export default TruBrokerActivityDrawer;
