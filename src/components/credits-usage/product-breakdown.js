import { List, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Number } from '../common';
import { IconStyled } from '../common/icon/IconStyled';

export const ProductBreakdown = ({ title, value, iconColor }) => {
  const { t } = useTranslation();
  return (
    <List.Item className="px-0">
      <Space>
        <IconStyled
          color="#fff"
          style={{ '--icon-bg-color': iconColor, '--icon-styled-width': '16px', height: 'var(--icon-styled-width)' }}
        >
          <Icon icon="GoDotFill" size={10} />
        </IconStyled>
        <div className="color-gray-dark">{t(title)}</div>
      </Space>
      <div className="semiBold">
        <Number type="number" value={value} compact={false} />
      </div>
    </List.Item>
  );
};
