import { Divider, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CreditUsage, ProgressStyled } from '../../container/pages/credits-usage/styled';
import { Number } from '../common';
import Statistic from '../common/statistic';
import cx from 'clsx';

export const LineChart = ({ breakdownDetails, displayChart = false, lineChartData, className, chartStyle }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  return (
    <>
      <CreditUsage className={false && 'sticky'}>
        <Row className={cx(className)} style={{ gap: 16, ...chartStyle, marginBottom: 20 }}>
          {breakdownDetails?.map((e, index) => (
            <>
              <Statistic
                title={t(e?.label)}
                value={e?.value}
                formatter={<Number value={e?.value ? e.value : 0} compact={false} />}
                isMobile={isMobile}
                fontSize={isMobile ? '1.14286em' : '1.28571em'}
                trends={false}
              />
              {index + 1 !== breakdownDetails?.length && (
                <Divider
                  type="vertical"
                  orientation="center"
                  style={{ height: 30, alignSelf: 'center', marginInline: 0 }}
                />
              )}
            </>
          ))}
        </Row>

        {displayChart && (
          <ProgressStyled
            percent={100}
            showInfo={false}
            strokeColor={lineChartData && lineChartData}
            className="mb-24"
            style={{
              verticalAlign: 'top',
              '--progress-bg': lineChartData && lineChartData,
            }}
          />
        )}
      </CreditUsage>
      <div className="stickySpace" />
    </>
  );
};
