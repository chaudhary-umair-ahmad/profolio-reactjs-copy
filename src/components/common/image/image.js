import { Image as AntdImage } from 'antd';
import React from 'react';

const Image = (props) => {
  const { src, fallback, ...rest } = props;

  return <AntdImage src={src || fallback} alt="" preview={false} {...rest} />;
};

Image.propTypes = {};

export default Image;
