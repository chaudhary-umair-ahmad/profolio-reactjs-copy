import { useTranslation } from 'react-i18next';
import React from 'react';
import PropTypes from 'prop-types';
import { TagStyled } from './styled';
import Icon from '../icon/icon';

const ProductTag = (props) => {
  const {
    icon,
    name,
    iconProps,
    hideIconInTag = false,
    tagBackgroundColor,
    tagStyle,
    shape,
    tagSpace,
    showIcon = true,
    onClick,
  } = props;
  const { t } = useTranslation();

  return (
    <TagStyled
      shape={shape || 'round'}
      tagBackgroundColor={iconProps?.color || tagBackgroundColor}
      style={{ ...tagStyle }}
      tagSpace={tagSpace || (hideIconInTag && '4px 6px')}
      onClick={onClick}
    >
      {!hideIconInTag && (
        <Icon
          icon={icon}
          size={iconProps?.size || '1em'}
          iconProps={{ ...iconProps, iconContainerSize: '1.4em', color: '#fff' }}
        />
      )}
      {t(name)}
    </TagStyled>
  );
};

ProductTag.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  iconProps: PropTypes.object,
};

export default ProductTag;
