import { Skeleton, Space } from 'antd';
import cx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioButtonStyled, RadioGroupStyled, RadioPill, TabsStyled } from './styled';
import { ErrorMessage, Icon } from '..';
import { fetchApi } from '../../../utility/commonApis';
import { getErrorString, getOBJValueByKey } from '../../../utility/utility';
import Label from '../Label/Label';
import Group from '../group/group';
import { IconStyled } from '../icon/IconStyled';

function RadioButtons(props) {
  const {
    className,
    label,
    labelIcon = null,
    name,
    loading = false,
    value,
    handleChange,
    buttonList = [],
    isTabbed,
    isButton,
    btnSize,
    shape,
    serverProps = null,
    valueKey = 'key',
    onTabChange = () => {},
    options: tabOptions,
    errorMsg,
    disabled,
    radioGroupGap = 'initial',
    activeKey,
    color,
    getKey = (item) => item.key || item.id,
    showCount = false,
    tabStyle,
    count,
    style,
  } = props;

  const [options, setOptions] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { t } = useTranslation();

  const getNormalizedRadioValue = (v) => {
    if (v == null) return v;
    if (typeof v === 'object' && v !== null) {
      if (v[valueKey] != null) return v[valueKey];
      if (valueKey === 'slug' && v.slug != null) return String(v.slug).toLowerCase();
    }
    if (valueKey === 'slug') {
      if (v === '1' || v === 1) return 'yes';
      if (v === '0' || v === 0) return 'no';
    }
    return v;
  };

  const groupValue = getNormalizedRadioValue(value);

  useEffect(() => {
    setOptionsData();
  }, [buttonList]);

  useEffect(() => {
    if (tabOptions) {
      setOptions(tabOptions);
    }
  }, [tabOptions]);

  const setOptionsData = async () => {
    if (serverProps) {
      const { url, payloadKey, parser, onLoadOptions = () => {} } = serverProps;
      const response = await fetchApi(url);
      setApiLoading(true);
      if (response && getOBJValueByKey(response, payloadKey)) {
        setApiLoading(false);
        setOptions(getOBJValueByKey(response, payloadKey).map(parser));
        // onLoadOptions(getOBJValueByKey(response, payloadKey).map(parser));
      } else {
        setApiLoading(false);
        setApiError(getErrorString(response));
      }
    } else {
      setOptions(buttonList);
    }
  };
  const renderButtons = () => {
    return (
      <Group className={cx(className)} template="initial" gap="8px">
        {label && <Label htmlFor={name}>{label}</Label>}

        <RadioGroupStyled
          value={groupValue}
          onChange={handleChange}
          name={name}
          size={btnSize}
          style={{ '--radio-group-gap': radioGroupGap, ...style }}
          block={props.block}
        >
          {isTabbed ? (
            <TabsStyled
              onTabClick={(activeKey) => {
                onTabChange(options.find((e) => e.tabKey == activeKey));
              }}
              activeKey={activeKey}
              style={{...tabStyle}}
            >
              {options.map((item) => {
                return (
                  <TabsStyled.TabPane tab={t(item.tabTitle)} key={getKey(item)} disabled={disabled}>
                    <Space className="pills-list" wrap>
                      {item.buttonList.map((e) => (
                        <RadioPill value={e[valueKey]} key={e[valueKey]} shape="round" disabled={disabled}>
                          {e.icon && <Icon icon={e.icon} />}
                          {t(e.label)}
                        </RadioPill>
                      ))}
                    </Space>
                  </TabsStyled.TabPane>
                );
              })}
            </TabsStyled>
          ) : isButton ? (
            options.map((item) => (
              <RadioButtonStyled
                value={item[valueKey]}
                key={getKey(item)}
                disabled={disabled || item.disabled}
                color={color || props.accentColor}
                block={props.block}
              >
                {item.icon && <Icon icon={item.icon} />}
                {t(item.label)}
                {item.badge && item.badge}
              </RadioButtonStyled>
            ))
          ) : (
            options.map((item, index) => {
              const key = getKey(item)
              const RightComponent = item?.RightComponent
              const selected = key == groupValue
              return (
                <RadioPill value={item[valueKey]} key={key} shape={shape} disabled={disabled || item.disabled}>
                  {item.icon && <Icon icon={item.icon} selected={selected} />}
                  {t(item.label)} {showCount && item?.count}
                  {RightComponent && <RightComponent selected={selected} price={item?.price} />}
                </RadioPill>
              );
            })
          )}
        </RadioGroupStyled>
        <ErrorMessage message={errorMsg} />
      </Group>
    );
  };

  return loading ? (
    <Skeleton active avatar={!!labelIcon} paragraph={{ rows: 1 }} />
  ) : labelIcon ? (
    <Group template="max-content auto" gap="16px">
      <IconStyled>
        <Icon icon={labelIcon} />
      </IconStyled>
      {renderButtons()}
    </Group>
  ) : (
    renderButtons()
  );
}

// RadioButtons.propTypes = {
//   className: PropTypes.string,
//   label: PropTypes.string,
//   labelIcon: PropTypes.string,
//   name: PropTypes.string,
//   loading: PropTypes.bool,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   handleChange: PropTypes.func,
//   buttonList: PropTypes.array,
//   isTabbed: PropTypes.bool,
//   serverProps: PropTypes.object,
//   shape: PropTypes.string,
//   btnSize: PropTypes.string,
//   valueKey: PropTypes.string,
//   onTabChange: PropTypes.func,
//   isButton: PropTypes.bool,
//   radioGroupGap: PropTypes.string,
// };

export default RadioButtons;
