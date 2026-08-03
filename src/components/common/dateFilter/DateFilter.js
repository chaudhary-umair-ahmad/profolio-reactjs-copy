import React, { useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TextInput } from '..';
import { DATE_FORMAT } from '../../../constants/formats';
import { getDateDiff, getDatePickerPlaceholder, getTimeDateString } from '../../../utility/date';
import { SkeletonBody } from '../../skeleton/Skeleton';
import { DateRangePickerOne } from '../datePicker/datePicker';
import DrawerPopover from '../drawerPopover/drawerPopover';

function DateFilter(props) {
  const { t } = useTranslation();
  const {
    placeholder,
    queryStartDate,
    queryEndDate,
    label,
    labelProps,
    loading,
    error,
    skeletonLoading,
    disabled,
    accentColor,
    minwidth = 250,
    inputPlaceholder,
    ...rest
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [mountKey, setMountKey] = useState(0);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const onClick = (e) => {
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    setMountKey(prev => prev + 1);
    setIsOpen(true);
  };

  const content = <>
    <DateRangePickerOne
      {...props}
      setIsOpen={setIsOpen}
      accentColor={accentColor}
      key={mountKey}
    />
  </>

  function getPlaceHolder() {
    if (inputPlaceholder) {
      return t(inputPlaceholder);
    } else {
      const datePlaceholder = getDatePickerPlaceholder(queryStartDate, queryEndDate, props?.reportsStaticRanges, t);
      if (datePlaceholder) {
        return datePlaceholder;
      }
      return `${getTimeDateString(queryStartDate, DATE_FORMAT, false, true)} – ${getTimeDateString(
        queryEndDate,
        DATE_FORMAT,
        false,
        true,
      )}`;
    }
  }

  return skeletonLoading ? (
    <SkeletonBody type="input" />
  ) : (
    <>
      <DrawerPopover
        open={isOpen}
        onVisibleChange={() => {
          setIsOpen(!isOpen);
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
        title={t('Search by Calendar')}
        content={content}
        action="click"
        zIndex={1111}
        getTooltipContainer={null}
        getPopupContainer={null}
        footer={null}
      >
        <TextInput
          readOnly
          label={label}
          labelProps={labelProps}
          suffixIcon="FiCalendar"
          iconColor={accentColor}
          placeholder={placeholder}
          loading={loading}
          skeletonLoading={skeletonLoading}
          onClick={onClick}
          value={queryStartDate && queryEndDate ? getPlaceHolder() : ''}
          className="dateFilter"
          style={{ minWidth: !isMobile && minwidth, caretColor: 'transparent', '--border-color': accentColor }}
          disabled={disabled}
          fieldSize={rest.fieldSize}
          accentColor={accentColor}
          {...rest}
        />
      </DrawerPopover>
    </>
  );
}

export default DateFilter;
