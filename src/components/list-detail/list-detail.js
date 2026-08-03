import React from 'react';
import { List as AntdList, Typography } from 'antd';
import { Flex } from '../common';

const { Title } = Typography;

const ListDetail = ({ data, title }) => {
  return (
    <div>
      <Title level={5} style={{ fontWeight: '700' }}>
        {title}
      </Title>
      <AntdList
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) =>
          (item?.label || item?.value) && (
            <AntdList.Item className="px-0">
              <Flex justify="space-between" className="w-100">
                <div className="color-gray-dark">{item.label}</div>
                <div>{item.value}</div>
              </Flex>
            </AntdList.Item>
          )
        }
      />
    </div>
  );
};

export default ListDetail;
