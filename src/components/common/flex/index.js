import React from 'react';
import { PropTypes } from 'prop-types';
import { StyleSheetManager } from 'styled-components';
import { FlexStyled } from './styled';

const Flex = (props) => {
  const { children, align = 'normal', justify = 'normal', ...rest } = props;
  return (
    <StyleSheetManager disableVendorPrefixes>
      <FlexStyled align={align} justify={justify} {...rest}>
        {children}
      </FlexStyled>
    </StyleSheetManager>
  );
};
export default Flex;

// Flex.propTypes = {
//   children: PropTypes.node,
//   className: PropTypes.string,
//   align: PropTypes.oneOf(['normal', 'start', 'center', 'end', 'stretch', 'baseline']),
//   justify: PropTypes.oneOf([
//     'normal',
//     'start',
//     'end',
//     'center',
//     'space-around',
//     'space-between',
//     'space-evenly',
//     'stretch',
//   ]),
//   gap: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
//   style: PropTypes.object,
//   flex: PropTypes.string,
//   vertical: PropTypes.bool,
//   wrap: PropTypes.bool,
// };
