import tenantTheme from '@theme';
import { Divider } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Number } from '../../../../components/common';
import Statistic from '../../../../components/common/statistic';
import { ListCardFooter, StatisticWrapperSmall } from '../../../../components/styled';
import { getTimeDateString } from '../../../../utility/date';

const CardTrafficLeadsByDate = ({ reachData, contactData, item, index }) => {
  const { t } = useTranslation();

  return (
    <>
      <Group key={index} className="mb-8" template="1.2fr 1fr auto 1fr" gap="0px">
        <Statistic
          title={t('Date')}
          value={item?.date?.value ? getTimeDateString(item?.date?.value) : '-'}
          trends={false}
        />
        {reachData
          .filter((e) => e.key !== 'leads')
          .map((e, i) => {
            return (
              <React.Fragment key={i}>
                {i !== 0 && (
                  <div className="text-center" style={{ alignSelf: 'center' }}>
                    <Divider type="vertical" style={{ height: 32, marginInline: '12px' }} />
                  </div>
                )}
                <Statistic
                  key={e?.id}
                  icon={e?.icon}
                  iconProps={{
                    ...e?.iconProps,
                    hasBackground: true,
                    size: '1em',
                    iconContainerSize: '24px',
                  }}
                  title={t(e?.title)}
                  formatter={<Number value={e?.value ? e.value : 0} compact={false} />}
                  value={e?.value ? e.value : 0}
                  trends={false}
                />
              </React.Fragment>
            );
          })}
      </Group>
      <ListCardFooter>
        <StatisticWrapperSmall>
          <Statistic
            icon="MdPhone"
            iconProps={{
              color: tenantTheme['color-leads'],
              hasBackground: true,
              size: '1em',
              iconContainerSize: '24px',
            }}
            title={t('Total Leads')}
            formatter={<Number value={item?.leads?.value} compact={false} />}
            value={item?.leads?.value}
            rootClassName="totalLeads"
            trends={false}
          />
        </StatisticWrapperSmall>

        {contactData.map((e, index) => {
          return (
            <StatisticWrapperSmall key={index}>
              <Statistic
                key={e?.id}
                icon={e?.icon}
                iconProps={{
                  ...e?.iconProps,
                  hasBackground: true,
                  size: '1em',
                  iconContainerSize: '24px',
                }}
                title={t(e?.title)}
                formatter={<Number value={e?.value ? e.value : 0} compact={false} />}
                value={e?.value ? e.value : 0}
                trends={false}
              />
              {index !== contactData.length - 1 && <Divider type="vertical" style={{ height: 16 }} />}
            </StatisticWrapperSmall>
          );
        })}
      </ListCardFooter>
    </>
  );
};

export default CardTrafficLeadsByDate;
