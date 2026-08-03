import { DatePicker } from 'antd';
import { DATE_BEFORE_TIME_FORMAT, DATE_FORMAT } from '../../../constants/formats';
import { SkeletonBody } from '../../skeleton/Skeleton';
import Label from '../Label/Label';
import ErrorMessage from '../errorMessage/errorMessage';
import Group from '../group/group';
import { IconStyled } from '../icon/IconStyled';
import Icon from '../icon/icon';
import { useSelector } from 'react-redux';

function DateSelect(props) {
  const {
    className,
    placeholder = 'Select Date',
    label,
    labelIcon,
    name,
    labelProps,
    skeletonLoading,
    value,
    onChange,
    groupTemplate,
    errorMsg,
    containerClassName,
    showTime = true,
    ...rest
  } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const renderDatePicker = () => {
    return (
      <>
        <DatePicker
          className={containerClassName}
          showTime={showTime}
          format={showTime ? DATE_BEFORE_TIME_FORMAT : DATE_FORMAT}
          value={value}
          placeholder={placeholder}
          onChange={(date) => {
            onChange(date);
          }}
          style={{ margin: !isMobile && '5px', ...rest.pickerStyle }}
          inputReadOnly
          {...rest}
        />
        <ErrorMessage message={errorMsg} />
      </>
    );
  };

  const renderLabel = () => {
    return (
      label && (
        <Label htmlFor={name} {...labelProps}>
          {label}
        </Label>
      )
    );
  };

  return skeletonLoading ? (
    <SkeletonBody type={'input'} />
  ) : labelIcon ? (
    <Group template={labelIcon ? 'max-content auto' : ''} gap="16px">
      {labelIcon && (
        <IconStyled>
          <Icon icon={labelIcon} />
        </IconStyled>
      )}
      <Group template="initial" gap="8px">
        {renderLabel()}
        {renderDatePicker()}
      </Group>
    </Group>
  ) : (
    <Group className={className} template={groupTemplate || 'initial'} gap="8px">
      {renderLabel()}
      {renderDatePicker()}
    </Group>
  );
}

export default DateSelect;
