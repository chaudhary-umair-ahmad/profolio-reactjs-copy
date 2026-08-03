import { List as AntdList } from 'antd';
import React from 'react';
const List = ({ children, ...rest }) => {
  return <AntdList {...rest}>{children}</AntdList>;
};
List.Item = AntdList.Item;
export default List;
