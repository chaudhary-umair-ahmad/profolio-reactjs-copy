import tenantTheme from '@theme';
import PropTypes from 'prop-types';
import React from 'react';
import { TextWithIcon } from '../common';
import { WarningNoticeStyled } from './styled';

const WarningNotice = (props) => {
  const {
    className,
    icon = 'AiOutlineInfoCircle',
    iconProps = {
      size: '1.2em',
      color: tenantTheme['error-color'],
    },
    title = 'Warning notice',
    style,
    textSize = '10px',
    linkProps = {
      color: '#bdbdbd',
      style: {
        fontWeight: 600,
        fontSize: '10px',
      },
    },
    extra,
    ...rest
  } = props;

  return (
    <WarningNoticeStyled className={className} style={{ ...style }} {...rest}>
      <TextWithIcon icon={icon} iconProps={iconProps} title={title} textSize={textSize} textColor="#272b41" />
      {extra && extra}
    </WarningNoticeStyled>
  );
};

// WarningNotice.propTypes = {
//   className: PropTypes.string,
//   icon: PropTypes.string,
//   iconProps: PropTypes.object,
//   title: PropTypes.string,
//   style: PropTypes.object,
//   textSize: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
//   linkProps: PropTypes.object,
// };

export default WarningNotice;
