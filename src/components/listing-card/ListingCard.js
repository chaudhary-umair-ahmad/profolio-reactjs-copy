import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '../common';
import TenantComponents from '@components';

export const ListingCard = (props) => {
  const { t } = useTranslation();
  const { item, disableDiv, selected, wrap, align } = props;

  const getTooltipText = () => {
    let locationTitle = '';
    if (item?.platforms.location?.breadcrumb?.length > 3) {
      item?.platforms.location?.breadcrumb?.forEach((e, index) => {
        if (index > 2) {
          locationTitle = `${e?.title} ${locationTitle}`;
        }
      });
      locationTitle = `${locationTitle} ${item?.platforms.location?.title}, ${
        item?.platforms.location?.breadcrumb?.find((it) => it.level === 3)?.title
      }`;
    } else {
      locationTitle = `${item?.platforms.location?.title}, ${
        item?.platforms.location?.breadcrumb?.find((it) => it.level === 3)?.title
      }`;
    }
    return locationTitle;
  };
  const array = (platform) =>
    [
      platform?.consumedQuota ? `${platform?.consumedQuota} Quota` : '',
      !!platform.views && !platform.views === 'loading'
        ? `${platform.views} views`
        : platform?.views === 0 || !platform?.views
          ? ''
          : `${platform.views} Views`,
      platform.leads && !platform.leads === 'loading'
        ? `${platform.leads} views`
        : platform?.leads === 0 || !platform?.leads
          ? ''
          : `${platform.leads} Leads`,
    ]
      .filter((e) => !!e)
      .map((e) => (e === 'loading' ? <Skeleton size="small" /> : e));

  return (
    <TenantComponents.ListingCard
      item={item}
      disableDiv={disableDiv}
      selected={selected}
      wrap={wrap}
      align={align}
      array={array}
    />
  );
};
