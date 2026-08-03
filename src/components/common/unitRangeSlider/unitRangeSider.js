import { Col, InputNumber, Row, Slider, Space } from 'antd';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Dropdown, Flex, Number, Text } from '..';
import styles from './index.module.less';
import { useTranslation } from 'react-i18next';
import { numberFormat } from '../../../utility/utility';

const UnitRangeSlider = (props) => {
  const { t } = useTranslation();
  const {
    rangeList = [],
    steps,
    setField,
    value = [],
    label,
    unitList = [],
    defaultUnitKey = '',
    disabledUnit,
  } = props;
  const [searchParams, setSearchParams] = useSearchParams({});
  const queryObj = Object.fromEntries([...searchParams]);
  const [selectedUnit, setSelectedUnit] = useState(
    unitList?.find((e) => e.slug == (queryObj?.areaUnitKey || defaultUnitKey)),
  );
  const menuStyle = { overflowY: 'auto', maxHeight: 240 };
  const [rangeValue, setRangeValue] = useState(value);
  const getRangeValue = useCallback(
    (index) => {
      const unitType = rangeList.find((item) => item.key === selectedUnit.key);
      return unitType?.value?.[index];
    },
    [selectedUnit],
  );

  const marks = {
    [getRangeValue(0)]: {
      label: rangeValue[0] ? (
        <Number unit={t(selectedUnit.title_short)} value={rangeValue[0]} />
      ) : (
        <Number unit={t(selectedUnit.title_short)} value={getRangeValue(0)} />
      ),
    },
    [getRangeValue(1)]: {
      label: rangeValue[1] ? (
        <Number unit={t(selectedUnit.title_short)} value={rangeValue[1]} />
      ) : (
        <Number unit={t(selectedUnit.title_short)} value={getRangeValue(1)} />
      ),
    },
  };

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(rangeValue)) {
      setRangeValue(value);
    }
  }, [value]);

  useEffect(() => {
    const filteredUnitKey = unitList.filter((item) => item.value == queryObj?.areaUnitKey);
    if (filteredUnitKey?.length > 0) {
      setSelectedUnit({ ...filteredUnitKey[0], key: filteredUnitKey[0].key, value: filteredUnitKey[0].value });
    }
  }, []);

  const onChange = (value) => {
    setRangeValue(value);
    setField({ range: value, rangeUnit: selectedUnit?.key });
  };

  const onSelectUnit = (value) => {
    setField({ range: [], rangeUnit: value?.key }, true);
    setSelectedUnit({ ...value, key: value.key, value: value?.key });
  };
  const onResetClick = () => {
    setSelectedUnit(unitList?.find((e) => e.slug == (queryObj?.areaUnitKey || defaultUnitKey)));
    setField({ range: [], rangeUnit: selectedUnit?.key }, true);
  };

  return (
    <Col>
      <Row justify={'space-between'} style={{ alignItems: 'center' }}>
        <label className="d-block">{label}</label>
        <Flex>
          <Dropdown
            onChange={onSelectUnit}
            options={unitList}
            style={{ cursor: 'pointer', border: 'none', padding: 0, alignItems: 'center' }}
            disabled={disabledUnit}
          >
            <Text>{t(selectedUnit?.title_short)}</Text>
          </Dropdown>
          <Button type="link" onClick={onResetClick} style={{ paddingInlineEnd: '2px' }}>
            {t('Reset')}
          </Button>
        </Flex>
      </Row>
      <Space style={{ alignItems: 'baseline' }} className={styles.inputSpacer}>
        <InputNumber
          placeholder={t('Min')}
          min={getRangeValue(0)}
          max={getRangeValue(1)}
          style={{ width: '100%' }}
          value={rangeValue?.[0] ? `${numberFormat(rangeValue[0])}` : null}
          onChange={(e) => {
            onChange([e, rangeValue[1]]);
          }}
        />
        <div style={{ marginInline: '8px' }}>{t('To')}</div>
        <InputNumber
          placeholder={t('Max')}
          min={getRangeValue(0)}
          max={getRangeValue(1)}
          style={{ width: '100%' }}
          value={rangeValue?.[1] ? `${numberFormat(rangeValue[1])}` : null}
          onChange={(e) => {
            onChange([rangeValue[0], e]);
          }}
        />
      </Space>
      <Col span={24}>
        <Slider
          className={styles.rangeSlider}
          style={{ '--slider-margin': 0 }}
          range
          marks={marks}
          min={getRangeValue(0)}
          max={getRangeValue(1)}
          onChange={onChange}
          value={rangeValue?.length > 0 ? rangeValue : []}
          tooltip={{
            formatter: (value) => <Number unit={t(selectedUnit?.title_short)} value={value} />,
          }}
        />
      </Col>
    </Col>
  );
};

export default UnitRangeSlider;
