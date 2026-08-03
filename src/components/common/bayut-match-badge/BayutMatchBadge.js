import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import tenantConstants from '@constants';
import Flex from '../flex';
import { Drawer } from '../drawer/drawer';
import { BayutMatchIcon } from '../../svg';

export const BAYUT_MATCH_SOURCE = 'bayut_match';

const SIZE_STYLES = {
  small: {
    iconSize: 9,
    fontSize: '10px',
    gap: '4px',
    paddingInline: '4px',
    paddingBlock: '2px',
  },
  medium: {
    iconSize: 11,
    fontSize: '12px',
    gap: '5px',
    paddingInline: '0.5em',
    paddingBlock: '2px',
  },
};

const badgeStyle = (sizeStyle, style) => ({
  lineHeight: 1,
  paddingInline: sizeStyle.paddingInline,
  paddingBlock: sizeStyle.paddingBlock,
  backgroundColor: 'rgba(233, 247, 240, 1)',
  borderRadius: '9999px',
  display: 'inline-flex',
  color: 'rgba(40, 177, 109, 1)',
  fontSize: sizeStyle.fontSize,
  fontWeight: 600,
  alignSelf: 'center',
  justifyContent: 'center',
  ...style,
});

const BayutMatchBadge = ({
  show = true,
  size = 'small',
  style = {},
  className = '',
}) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const bottomSheetRef = useRef();

  if (!tenantConstants?.BAYUT_MATCHING_LEAD || !show) return null;

  const sizeStyle = SIZE_STYLES[size];
  const badgeContent = (
    <Flex
      align="center"
      gap={sizeStyle.gap}
      className={className}
      style={badgeStyle(sizeStyle, style)}
    >
      <BayutMatchIcon size={sizeStyle.iconSize} color="#28B16D" />
      {t('Bayut Match')}
    </Flex>
  );

  if (isMobile) {
    return (
      <>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            bottomSheetRef.current?.openDrawer();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              bottomSheetRef.current?.openDrawer();
            }
          }}
          style={{ display: 'inline-flex', cursor: 'pointer' }}
        >
          {badgeContent}
        </span>
        <Drawer
          ref={bottomSheetRef}
          placement="bottom"
          height="auto"
          title={t('Bayut Match')}
          footer={null}
          stopPropagation
          headerStyle={{ textAlign: 'center' }}
        >
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 400, LineHeight: '145%', color:'rgba(34, 34, 34, 1)'  }}>{t('Bayut Match tooltip')}</p>
        </Drawer>
      </>
    );
  }

  return (
    <Tooltip
      title={
        <span style={{ fontSize: '14px', fontWeight: 600, lineHeight: '145%', color:'rgba(34, 34, 34, 1)' }}>
          {t('Bayut Match tooltip')}
        </span>
      }
      placement="top"
      overlayClassName="bayut-match-tooltip"
    >
      {badgeContent}
    </Tooltip>
  );
};

export default BayutMatchBadge;
