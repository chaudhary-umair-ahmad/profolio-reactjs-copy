import { Typography } from 'antd';
import VirtualList from 'rc-virtual-list';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Spinner from '../spinner/spinner';
const { Text } = Typography;

export const InfiniteScroll = ({
  CardComponent,
  itemKey,
  fetchFunction,
  loading,
  dataList,
  nextPage,
  containerOffset,
  requestOffset,
  ...rest
}) => {
  const { t } = useTranslation();
  const rtl = useSelector((state) => state.app.AppConfig.rtl);
  const [singleItemHeight, setSingleItemHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(null);

  useEffect(() => {
    setContainerHeight(window.innerHeight - containerOffset);
  }, []);

  const onScroll = (e) => {
    const page = nextPage;
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= containerHeight + requestOffset) {
      if (page && !loading) {
        fetchFunction(page);
      }
    }
  };

  return (
    <VirtualList
      data={dataList}
      height={containerHeight}
      itemHeight={singleItemHeight}
      fullHeight
      onScroll={onScroll}
      itemKey={itemKey}
      direction={rtl ? 'rtl' : 'ltr'}
    >
      {(item, index) => (
        <React.Fragment key={index}>
          <CardComponent
            item={item}
            singleItemHeight={singleItemHeight}
            setSingleItemHeight={setSingleItemHeight}
            loading={loading}
            {...rest}
          />
          {loading && index === dataList.length - 1 && <Spinner loading />}
          {/* {index === dataList.length - 1 && !nextPage && (
            <div className="text-center">
              <Text className="text-muted">{t('No more data')}</Text>
            </div>
          )} */}
        </React.Fragment>
      )}
    </VirtualList>
  );
};
