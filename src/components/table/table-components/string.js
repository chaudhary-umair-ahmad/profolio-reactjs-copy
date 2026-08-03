import { Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export const String = (props) => {
  const { text = '' } = props;
  return (
    <Text maxLength={15} ellipsis style={{ width: 50 }}>
      {text}
    </Text>
  );
};

