import { Space } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import { Icon } from '../../common';
import { IconStyled } from '../../common/icon/IconStyled';

export const AvatarName = (props) => {
  const { name, image } = props;
  return (
    <Space>
      {image ? (
        <Avatar size={34} src={image} style={{ margin: 0, padding: 1 }} />
      ) : (
        <IconStyled>
          <Icon size={16} icon="FiUser" />
        </IconStyled>
      )}
      {name}
    </Space>
  );
};
