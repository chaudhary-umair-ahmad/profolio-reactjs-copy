import tenantTheme from '@theme';
import React from 'react';
import { DATE_FORMAT, TIME_FORMAT } from '../../../constants/formats';
import { getTimeDateString } from '../../../utility/date';
import { TextWithIcon } from '../../common';

export const DateTime = (props) => {
  const { showTime, value, textColor, iconSize, textSize, wrapperClass, wrapperStyle } = props;

  return value ? (
    <div className={wrapperClass} style={{ ...wrapperStyle }}>
      <TextWithIcon
        value={getTimeDateString(value, DATE_FORMAT)}
        icon="FiCalendar"
        iconProps={{ size: iconSize || '12px', color: tenantTheme.gray550 }}
        textColor={textColor || tenantTheme.gray700}
        textSize={textSize || '12px'}
      />

      {showTime && (
        <TextWithIcon
          value={getTimeDateString(value, TIME_FORMAT)}
          icon="GoClockFill"
          iconProps={{ size: iconSize || '12px', color: tenantTheme.gray550 }}
          textColor={tenantTheme.gray700}
          textSize={textSize || '12px'}
        />
      )}
    </div>
  ) : (
    '-'
  );
};
