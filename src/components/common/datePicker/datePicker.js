// eslint-disable-next-line max-classes-per-file

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import tenantTheme from '@theme';
import { addDays, endOfDay, startOfDay, subDays } from 'date-fns';
import React, { useState } from 'react';
import { createStaticRanges, DateRangePicker } from 'react-date-range';
import { useTranslation } from 'react-i18next';
import { getDatePickerPlaceholder, getParsedDateValue, getStartEndValue, getStaticRanges } from '../../../utility/date';
import { Button } from '../button/button';
import { ButtonGroup, ItemWraper } from './style';

const DateRangePickerOne = (props) => {
  const {
    setIsOpen,
    onSelect,
    type = 'past',
    accentColor = tenantTheme['primary-color'],
    minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    reportsStaticRanges = false,
    okText,
    ...rest
  } = props;
  const { t } = useTranslation();

  const [dateSelection, setDateSelection] = useState({
    datePickerInternational: null,
    dateRangePicker: {
      selection: {
        startDate: props.queryStartDate ? new Date(props.queryStartDate) : subDays(new Date(), 0),
        endDate: props.queryEndDate ? new Date(props.queryEndDate) : new Date(),
        key: 'selection',
      },
    },
  });

  const handleRangeChange = (which) => {
    setDateSelection({
      ...dateSelection,
      dateRangePicker: {
        ...dateSelection.dateRangePicker,
        ...which,
      },
    });
  };
  const { dateRangePicker } = dateSelection;
  const start = dateRangePicker.selection.startDate.toString();
  const end = dateRangePicker.selection.endDate.toString();
  const datePickerPlaceholder = getDatePickerPlaceholder(
    dateRangePicker.selection.startDate,
    dateRangePicker.selection.endDate,
    reportsStaticRanges,
    t,
  );
  return (
    <ItemWraper accentColor={accentColor}>
      <DateRangePicker
        onChange={handleRangeChange}
        showSelectionPreview
        moveRangeOnFirstSelection={false}
        className="PreviewArea"
        months={2}
        {...(type === 'past' && {
          maxDate: new Date(),
          minDate: minDate,
        })}
        {...(type === 'future' && { minDate: new Date() })}
        ranges={[dateRangePicker?.selection]}
        direction="horizontal"
        inputRanges={[]}
        staticRanges={createStaticRanges(getStaticRanges(reportsStaticRanges, t))}
        rangeColors={[`${accentColor}`]}
        readOnly={true}
        onFocus={(e) => e.target.blur()}
        {...rest}
      />

      <ButtonGroup>
        <p>{getStartEndValue(start, end)}</p>
        <div>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setIsOpen(false);
              onSelect(getParsedDateValue(start), getParsedDateValue(end), datePickerPlaceholder);
            }}
            style={{ backgroundColor: accentColor || tenantTheme['primary-color'], border: 0 }}
          >
            {okText ? t(okText) : t('Search')}
          </Button>
          <Button size="small" type="white" outlined onClick={() => setIsOpen(false)}>
            {t('Cancel')}
          </Button>
        </div>
      </ButtonGroup>
    </ItemWraper>
  );
};

export { DateRangePickerOne };
