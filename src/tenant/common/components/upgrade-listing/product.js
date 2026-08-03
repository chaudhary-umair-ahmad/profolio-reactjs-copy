import React from 'react';
import cx from 'clsx';
import { TagRecommend } from './style';
import { Group, Icon } from '../../../../components/common';
import { IconStyled } from '../../../../components/common/icon/IconStyled';
import { Space } from 'antd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Product = ({
  title,
  dropDown,
  description,
  alertMessage,
  icon,
  iconColor,
  iconBackgroundColor,
  hasVerifiedCheck,
  isRecommended,
  price,
  iconSize,
  discountedPrice,
  extra,
  autoRenew,
  ...rest
}) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { t } = useTranslation();
  return (
    <Group
      template={'1fr auto'}
      gap={isMobile ? '8px' : '8px 24px'}
      className={cx(rest.className, 'align-items-center')}
    >
      <div className="flex" style={{ gap: 8 }}>
        {icon && (
          <IconStyled color={iconColor} style={{ backgroundColor: iconBackgroundColor, fontSize: iconSize }}>
            <Icon icon={icon || 'MdOutlineCircle'} />
          </IconStyled>
        )}
        <div style={{ flex: 1 }}>
          <Space compact size={6}>
            <strong>{title}</strong>
            {dropDown && dropDown}
          </Space>
          <div className="text-muted fs12">{description}</div>
        </div>
      </div>
      <div
        className="flex"
        style={{
          flexDirection: 'column',
        }}
      >
        {isRecommended && <TagRecommend>{t('Recommended')}</TagRecommend>}
        {discountedPrice && (
          <div style={{ textDecoration: 'line-through' }} className="samiBold text-muted">
            {discountedPrice}
          </div>
        )}

        {price && price}
        {autoRenew && autoRenew}
      </div>
      {alertMessage && <div className="color-gray-lightest span-all">{alertMessage}</div>}
      {extra && <div className="span-all">{extra}</div>}
    </Group>
  );
};

export default Product;
