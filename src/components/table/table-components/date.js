import tenantTheme from '@theme';
import { t } from 'i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import { getTimeDateString } from '../../../utility/date';
import { Icon, Popover } from '../../common';
import Group from '../../common/group/group';

export const Date = (props) => {
  const { user } = useSelector((state) => state.app.loginUser);

  const { data = [] } = props;
  return (
    <Group template="auto" gap="8px">
      {props?.value ? (
        <div> {getTimeDateString(props?.value, props?.format)} </div>
      ) : (
        data?.map((item) => (
          <div key={item.slug}>
            {item?.posted_on ? getTimeDateString(item?.posted_on) : '-'}
            {!user?.isCurrencyUser && item?.expiry_date && (
              <Popover
                content={
                  <>
                    {t('Expiring on')}: <strong>{getTimeDateString(item?.expiry_date)}</strong>
                  </>
                }
                action="hover"
              >
                <>
                  <Icon
                    icon="AiOutlineInfoCircle"
                    size={16}
                    style={{ marginInlineStart: 5 }}
                    color={tenantTheme['primary-color']}
                  />
                </>
              </Popover>
            )}
          </div>
        ))
      )}
    </Group>
  );
};
