import { Divider, Pagination, Row } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Group } from '../../../../components/common';
import Statistic from '../../../../components/common/statistic';
import { getTimeDateString } from '../../../../utility/date';

const CardListingByDate = ({ tableData, disabled, getReportsDateTypeData, getServiceTypesDateData, setPageDate }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [previousReportsDate, setPreviousReportsDate] = useState(null);

  const renderPagination = () => {
    return tableData?.pagination && tableData?.list && tableData?.list?.length > 0 ? (
      <Pagination
        onChange={handlePaginationChange}
        showSizeChanger={false}
        pageSize={tableData?.pagination?.pageCount || 20}
        defaultCurrent={tableData?.pagination?.current}
        current={tableData?.pagination?.current}
        total={tableData?.pagination?.totalCount}
      />
    ) : null;
  };

  const handlePaginationChange = async (current) => {
    setCurrentPage(current);
    setPageDate(current);
  };

  return (
    <>
      <Group
        className="mb-8"
        gap="6px"
        template="initial"
        style={{
          ...(disabled && { pointerEvents: 'none', opacity: 0.4 }),
        }}
      >
        {tableData?.list?.map((item, i) => {
          const reportsType = getReportsDateTypeData(item);
          const reportsService = getServiceTypesDateData(item);

          return (
            <Card key={i} bodyStyle={{ padding: '12px 16px' }}>
              <Row className="mb-16" justify="space-between">
                <Statistic
                  title={t('Date')}
                  value={getTimeDateString(item?.date?.value)}
                  fontSize="13px"
                  trends={false}
                />
                <Statistic
                  title={t('Posted Listings')}
                  value={item?.active_listings?.value}
                  fontSize="16px"
                  className="text-right"
                  trends={false}
                />
              </Row>
              <Group template="repeat(5, 1fr)" gap="16px 0px">
                {reportsType.map((e, i) => {
                  return (
                    <React.Fragment key={i}>
                      {i !== 0 && i % 3 !== 0 && (
                        <div className="text-center">
                          <Divider type="vertical" className="m-0" style={{ height: 30 }} />
                        </div>
                      )}
                      <Statistic
                        title={t(e?.title)}
                        value={e?.value}
                        icon={e?.icon}
                        iconProps={e?.iconProps}
                        trends={false}
                      />
                    </React.Fragment>
                  );
                })}
              </Group>
            </Card>
          );
        })}
      </Group>
      <div className="px-8">{tableData?.pagination && renderPagination()}</div>
    </>
  );
};

export default CardListingByDate;
