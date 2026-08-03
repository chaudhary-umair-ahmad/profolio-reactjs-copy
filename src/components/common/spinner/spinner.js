import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined />;

const Spinner = props => {
  const { size, color, type } = props;

  return type === 'full' ? (
    <div className="spin">
      <Spin size={size} />
    </div>
  ) : (
    <Spin indicator={antIcon} size={size} />
  );
};

export default Spinner;
