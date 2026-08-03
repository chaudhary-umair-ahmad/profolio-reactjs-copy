import React, { useCallback } from 'react';
import { AntIconStyled, IconStyled } from './IconStyled';

import * as ReactIcons from '../../icons';
import * as LocalIcons from '../../svg';
import * as AmenitiesIcons from '../../widgets/AmenitiesSvg';
import * as NewAmenitiesIcons from '../../widgets/NewAmenitiesSvg';

function Icon(props) {
  const { icon, size = '1.2em', styled, iconProps, className = '', ...rest } = props;

  const Component = ReactIcons[icon] || LocalIcons[icon] || AmenitiesIcons[icon] || NewAmenitiesIcons[icon];

  const getIcon = useCallback(
    (e) => {
      const { iconContainerSize, hasBackground, ...filteredIconProps } = e || {};
      return (
        <AntIconStyled
          className={className}
          component={() => (Component ? <Component size={size} {...filteredIconProps} {...rest} /> : null)}
        />
      );
    },
    [props],
  );

  return styled ? <IconStyled {...iconProps}>{getIcon()}</IconStyled> : getIcon(iconProps);
}

export default Icon;
