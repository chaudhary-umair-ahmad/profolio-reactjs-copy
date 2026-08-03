import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonStyled, ButtonStyledGroup } from './styled';
import { Icon } from '..';

const Button = (props) => {
  const {
    type = 'default',
    shape,
    icon,
    iconSize = '1.2em',
    iconColor,
    size,
    outlined,
    primaryOutlined,
    dubizzlePrimary,
    ghost,
    transparented,
    opaque,
    raised,
    squared,
    color,
    social,
    load,
    children,
    iconClassName,
    iconProps,
    enableOnHover,
    ...rest
  } = props;
  const [state, setState] = useState({
    loading: false,
  });

  const enterLoading = () => {
    setState({ loading: true });
  };

  return (
    <ButtonStyled
      squared={squared}
      outlined={outlined ? 1 : 0}
      ghost={ghost}
      transparent={transparented ? 1 : 0}
      opaque={opaque ? 1 : 0}
      raised={raised ? 1 : 0}
      data={type}
      size={size}
      shape={shape}
      type={type}
      icon={icon && <Icon icon={icon} size={iconSize} color={iconColor} className={iconClassName} />}
      color={color}
      social={social}
      onClick={load && enterLoading}
      loading={state.loading}
      {...rest}
    >
      {children}
    </ButtonStyled>
  );
};

// Button.propTypes = {
//   type: PropTypes.oneOf([
//     'primary',
//     'secondary',
//     'success',
//     'info',
//     'warning',
//     'danger',
//     'link',
//     'dark',
//     'light',
//     'white',
//     'dashed',
//     'error',
//     'default',
//     'primaryOutlined',
//     'primary-light',
//     'dubizzlePrimary',
//   ]),
//   shape: PropTypes.string,
//   icon: PropTypes.string,
//   iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   iconColor: PropTypes.string,
//   size: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
//   color: PropTypes.string,
//   outlined: PropTypes.bool,
//   transparented: PropTypes.bool,
//   opaque: PropTypes.bool,
//   raised: PropTypes.bool,
//   squared: PropTypes.bool,
//   social: PropTypes.bool,
//   load: PropTypes.bool,
//   ghost: PropTypes.bool,
//   children: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
// };

const BtnGroup = ({ children }) => {
  return <ButtonStyledGroup>{children}</ButtonStyledGroup>;
};

BtnGroup.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export { Button, BtnGroup };
