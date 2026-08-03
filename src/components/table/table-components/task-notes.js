import tenantTheme from '@theme';
import { t } from 'i18next';
import React from 'react';
import { Text, TextWithIcon } from '../../common';

export const TaskNotes = ({ value, imageUrl }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {value ? (
        <Text ellipsis={{ tooltip: value }} style={{ width: 200 }}>
          {value}
        </Text>
      ) : (
        '-'
      )}
      {imageUrl && (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 4, fontSize: 12, color: tenantTheme['primary-color'] }}
        >
          <TextWithIcon
            icon="FaRegFileImage"
            value={t('image')}
            textColor={tenantTheme['primary-color']}
            textSize={'12px'}
            iconProps={{ color: tenantTheme['primary-color'], size: '12px' }}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          />
        </a>
      )}
    </div>
  );
};
