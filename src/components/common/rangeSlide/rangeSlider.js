import { Col, InputNumber, Slider, Space } from 'antd';
import { Button, Number } from '..';
import styles from './index.module.less';
import { t } from 'i18next';

const RangeSlider = (props) => {
  const { range, setField, value = [], label, compact = true, type } = props;

  const marks = {
    [range[0]]: {
      label: value[0] ? (
        <Number compact={compact} type={type} value={value[0]} />
      ) : (
        <Number compact={compact} type={type} value={range[0]} />
      ),
    },
    [range[1]]: {
      label: value[1] ? (
        <Number compact={compact} type={type} value={value[1]} />
      ) : (
        <Number compact={compact} type={type} value={range[1]} />
      ),
    },
  };

  const onChange = (newValue) => {
    setField(newValue);
  };

  const onResetClick = () => {
    setField([], true);
  };

  return (
    <>
      <Space align="center" className="w-100" style={{ justifyContent: 'space-between' }}>
        <label className="d-block" style={{ flex: 1 }}>
          {label}
        </label>
        <Button type="link" onClick={onResetClick} style={{ paddingInlineEnd: '2px' }}>
          {t('Reset')}
        </Button>
      </Space>

      <Col>
        <Space style={{ alignItems: 'baseline' }} className={styles.inputSpacer}>
          <InputNumber
            min={range[0]}
            max={range[1]}
            style={{ width: '100%' }}
            placeholder={t('Min')}
            value={value[0] && value[0]}
            onChange={(e) => {
              onChange([e, value[1]]);
            }}
          />
          <div style={{ marginInline: '8px' }}>To</div>
          <InputNumber
            min={range[0]}
            max={range[1]}
            placeholder={t('Max')}
            style={{ width: '100%' }}
            value={value[1] && value[1]}
            onChange={(e) => {
              onChange([value[0], e]);
            }}
          />
        </Space>
        <Col span={24}>
          <Slider
            style={{ '--slider-margin': 0 }}
            className={styles.rangeSlider}
            range
            marks={marks}
            min={range[0]}
            max={range[1]}
            onChange={onChange}
            value={value}
            tooltip={{
              formatter: (value) => <Number compact={compact} type={type} value={value} />,
            }}
          />
        </Col>
      </Col>
    </>
  );
};

export default RangeSlider;
