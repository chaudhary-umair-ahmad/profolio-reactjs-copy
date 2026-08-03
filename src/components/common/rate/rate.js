import React, { useEffect, useState } from 'react';
import { Rate as AntDRate } from 'antd';

const Rate = ({ value = 0, onChange = () => {}, ...rest }) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = newValue => {
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return <AntDRate value={currentValue} onChange={handleChange} {...rest} />;
};

export default Rate;
