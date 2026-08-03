import PropTypes from 'prop-types';
import React from 'react';
import { AlertStyled } from './styled';

const Alert = (props) => {
  const {
    type = 'error',
    icon,
    message = '',
    description,
    showIcon,
    outlined = false,
    closable,
    closeText,
    action,
    ...rest
  } = props;

  return !!message ? (
    <AlertStyled
      message={message}
      type={type}
      description={description}
      closable={closable}
      showIcon={showIcon && showIcon}
      outlined={outlined}
      closeText={closeText && closeText}
      icon={icon && icon}
      action={action}
      {...rest}
    />
  ) : null;
};

// Alert.propTypes = {
//   type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
//   message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
//   description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
//   showIcon: PropTypes.bool,
//   outlined: PropTypes.bool,
//   closable: PropTypes.bool,
//   closeText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
//   icon: PropTypes.node,
// };

export default Alert;
