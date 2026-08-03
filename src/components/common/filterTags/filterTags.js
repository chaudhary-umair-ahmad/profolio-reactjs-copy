import { Text } from '..';
import cx from 'clsx';
import { useMemo } from 'react';
import tenantTheme from '@theme';
import { Tooltip } from 'antd';

const FilterTag = (props) => {
  const { label, value, className, valueKey = 'label' } = props;
  const getTitle = (e) => e?.label || e?.name || e?.displayName || '';

  const renderText = (text, tooltip) => {
    return (
      <Text style={{ color: label ? '#707070' : tenantTheme['primary-color'] }} className={cx(className, 'semiBold')}>
        {Array.isArray(text) ? text?.join(', ') : text}
        {!!tooltip?.length && (
          <>
            {', '}
            <Tooltip title={tooltip?.join(', ')}>
              <Text type="success" className="pointer" style={{ alignItems: 'center' }}>
                <span
                  style={{ backgroundColor: '#e6f5e7', padding: '4px 10px', borderRadius: 15, lineHeight: 'normal' }}
                >
                  +{tooltip?.length}
                </span>
              </Text>
            </Tooltip>{' '}
          </>
        )}
      </Text>
    );
  };

  const getText = useMemo(() => {
    if (typeof value === 'string') {
      const itemsText = value.split(',').slice(0, 5);
      const itemsTooltip = value.split(',').slice(5);
      return renderText(itemsText, itemsTooltip);
    }
    if (Array.isArray(value) && value?.length) {
      const itemsText = value.slice(0, 5);
      const itemsTooltip = value.slice(5);
      if (typeof value[0] === 'string') return renderText(itemsText, itemsTooltip);
      if (typeof value[0] === 'object') return renderText(itemsText.map(getTitle), itemsTooltip.map(getTitle));
    }
    return null;
  }, [value]);

  return !!getText ? (
    label ? (
      <>
        {label}: {getText}
      </>
    ) : (
      getText
    )
  ) : null;
};

export default FilterTag;
