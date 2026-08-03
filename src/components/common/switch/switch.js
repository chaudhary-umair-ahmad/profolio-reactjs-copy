import React from 'react';
import { Row, Col, Switch as AntdSwitch } from 'antd';
import PropTypes from 'prop-types';
import { Icon } from '..';
import { IconStyled } from '../icon/IconStyled';
import Label from '../Label/Label';

function Switch(props) {
  const { className, label, name, labelIcon, switchOnly, value, desc, rowWrap, labelSuffix, ...rest } = props;

  return switchOnly ? (
    <AntdSwitch id={name} name={name} checked={value} {...rest} />
  ) : (
    <Row align="start" size="middle" gutter={16} wrap={false} className={className}>
      {labelIcon && (
        <Col flex="50px">
          <IconStyled>
            <Icon icon={labelIcon} />
          </IconStyled>
        </Col>
      )}
      <Col flex="auto">
        <Row justify="space-between" wrap={rowWrap}>
          <div>
            <Label htmlFor={name}>{label}</Label>
            {labelSuffix && labelSuffix}
            {desc && <div className="color-gray-light">{desc}</div>}
          </div>
          <AntdSwitch name={name} checked={value} {...rest} />
        </Row>
      </Col>
    </Row>
  );
}

Switch.propTypes = {
  className: PropTypes.string,
  desc: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  labelIcon: PropTypes.string,
  switchOnly: PropTypes.bool,
  value: PropTypes.bool,
};

export default Switch;
