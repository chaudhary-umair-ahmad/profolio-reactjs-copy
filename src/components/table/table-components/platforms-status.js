import React from 'react';
import { Flex, Icon, Popover, Tag } from '../../common';
import Group from '../../common/group/group';
import tenantUtils from '@utils';

export const PlatformStatus = (props) => {
  const { data = [] } = props;

  return (
    <Group gap="8px" template="auto">
      {data?.map((item) => (
        <Flex key={item?.slug}>
          <Tag color={item?.[item?.statusKey]?.color} shape="round">
            {item?.[item?.statusKey]?.label}
          </Tag>
          {item?.[item?.statusKey]?.comments?.length && (
            <Popover
              placement="right"
              action="click"
              content={
                Array.isArray(item?.[item?.statusKey]?.comments)
                  ? item?.[item?.statusKey]?.comments
                      .map((e) => (typeof e === 'string' ? e : tenantUtils.getLocalisedString(e, 'reason')))
                      .join(', ')
                  : item?.[item?.statusKey]?.comments?.join(', ')
              }
            >
              <Icon
                icon="AiOutlineInfoCircle"
                style={{ color: item?.[item?.statusKey]?.color, marginInlineStart: 5 }}
                color="currentColor"
              />
            </Popover>
          )}
        </Flex>
      ))}
    </Group>
  );
};
