import tenantTheme from '@theme';
import { Col } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumberString } from '../../utility/utility';
import { Button, Icon, TextInput } from '../common';
import Group from '../common/group/group';
import SelectInput from '../common/select/select';
import { UtilisationRowStyled } from './styled';

const UtilisationRows = (props) => {
  const { credits, maxRows, selections, setSelections, isMobile, errorMsg } = props;
  const [options, setOptions] = useState(credits?.length ? [...credits?.map((e) => ({ ...e, disabled: false }))] : []);
  const { t } = useTranslation();

  const onItemSelect = (value, obj, index) => {
    let newSelections = [...selections];
    let newObject = newSelections[index];
    newObject = { ...newObject, value: value, option: obj };
    newSelections[index] = newObject;
    updateOptions(newSelections);
    setSelections(newSelections);
  };

  const updateOptions = (obj) => {
    let newOptions = options.map((item) => {
      const isSelected = obj.find((e) => e.value === item.id);
      if (isSelected !== undefined) {
        return { ...item, disabled: true };
      } else {
        return { ...item, disabled: false };
      }
    });
    setOptions(newOptions);
  };

  const onNumberChange = (value, index) => {
    let newSelections = [...selections];
    let newObject = newSelections[index];
    if (value > 0 && value <= 100) {
      newObject = { ...newObject, percentage: value, error: false };
      newSelections[index] = newObject;
    } else {
      newObject = { ...newObject, percentage: null, error: true };
      newSelections[index] = newObject;
    }
    setSelections(newSelections);
  };

  const addRow = () => {
    let newSelections = [...selections, { value: null, percentage: null, error: false }];
    setSelections(newSelections);
  };

  const removeRow = (index) => {
    let newSelections = [...selections];
    newSelections.splice(index, 1);

    updateOptions(newSelections);
    setSelections(newSelections);

    !!errorMsg && errorMsg.splice(index, 1);
  };

  const showRow = (item, index) => {
    return (
      <>
        <UtilisationRowStyled gutter={[16, 16]} align="start" key={index}>
          <Col xs={24} lg={12} xl={6}>
            <SelectInput
              label={isMobile || index === 0 ? t('Category') : null}
              name="category"
              options={options}
              value={item?.value}
              placeholder={t('Select Category')}
              suffixIcon="BsChevronDown"
              onChange={(value, option) => onItemSelect(value, option, index)}
              labelProps={{ muted: true }}
              getOptionLabel={(e) => (
                <div>
                  <Icon style={{ color: !e.disabled ? e?.iconColor : '' }} icon={e.icon} />
                  {t(e.title)}
                </div>
              )}
              errorMsg={
                !!errorMsg && !!errorMsg?.[index]
                  ? errorMsg?.[index]?.value
                  : item?.error && !item?.value && t('Please select a category')
              }
            />
          </Col>
          <Col xs={24} lg={12} xl={6}>
            <TextInput
              type="number"
              label={isMobile || index === 0 ? t('Percentage to be Used') : null}
              min={1}
              max={100}
              placeholder={t('Percentage')}
              suffixIcon="AiOutlinePercentage"
              disabled={selections[index]?.value === null}
              handleChange={(e) => onNumberChange(e.target.value, index)}
              value={item?.percentage}
              style={{ borderColor: item?.error && '#c00' }}
              labelProps={{ muted: true }}
              errorMsg={
                !!errorMsg && !!errorMsg?.[index]
                  ? errorMsg?.[index]?.percentage
                  : item?.error && t('Enter a value between 1-100')
              }
            />
          </Col>
          <Col xs={24} lg={12} xl={6}>
            <TextInput
              type="number"
              label={isMobile || index === 0 ? t('Utilized Credits') : null}
              labelProps={{ muted: true }}
              disabled
              value={
                !!item?.percentage && !item?.error && !!item?.option?.available
                  ? formatNumberString(item?.option?.available * (Number(item?.percentage) / 100))
                  : ''
              }
            />
          </Col>
          <Col xs={24} lg={12} xl={6} style={{ position: isMobile ? 'unset' : 'relative' }}>
            {index == 0 && <div style={{ height: '30px' }}></div>}
            <div className="flex">
              {selections.length !== 1 && (
                <Button
                  icon="MdClose"
                  iconColor="#c00"
                  iconSize="1.4em"
                  className="btnClose"
                  style={{ height: 48, marginInlineEnd: 10, paddingInline: 24 }}
                  onClick={() => {
                    removeRow(index);
                  }}
                />
              )}

              {selections?.length < maxRows && index === selections.length - 1 && (
                <Button
                  icon="AiOutlinePlus"
                  iconColor={tenantTheme['primary-color']}
                  style={{ height: isMobile ? 36 : 48, flex: 1 }}
                  onClick={() => addRow()}
                  className="btnAdd"
                >
                  {t('Add Credit')}
                </Button>
              )}
            </div>
          </Col>
        </UtilisationRowStyled>
      </>
    );
  };
  return (
    <div style={{ ...(!credits?.filter((e) => e?.available >= 1)?.length && { pointerEvents: 'none', opacity: 0.6 }) }}>
      <Group gap="16px">
        {selections.map((item, index) => {
          return <React.Fragment key={index}>{showRow(item, index)}</React.Fragment>;
        })}
      </Group>
    </div>
  );
};

export default UtilisationRows;
