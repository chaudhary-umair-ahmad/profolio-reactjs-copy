import tenantTheme from '@theme';

import propTypes from 'prop-types';
import React from 'react';
import { MultiPlatformIconStyled } from './style';
import Flex from '../flex';
import Icon from '../icon/icon';
import { useSelector } from 'react-redux';
import cx from 'clsx';

const MultiPlatform = ({ iconSize, subClass, style, iconProps, substyle }) => {
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  return (
    <MultiPlatformIconStyled>
      <Flex align="center" gap="6px" style={{ ...style }}>
        <Icon icon={locale === 'ar' ? 'BayutLogoAr' : 'BayutLogoEn'} size={iconSize || '55px'} iconProps={iconProps} />
        <span className={cx('base-color fw-600', subClass)} style={{ ...substyle, marginTop: '-2px' }}>
          &
        </span>
        <Icon
          icon={locale === 'ar' ? 'DubizzleLogoAr' : 'DubizzleLogo'}
          size={iconSize || '55px'}
          style={{ marginTop: '-8px' }}
          iconProps={iconProps}
        />
      </Flex>
    </MultiPlatformIconStyled>
  );
};

export default MultiPlatform;
