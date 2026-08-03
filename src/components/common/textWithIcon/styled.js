import styled from 'styled-components';

export const Text = styled(({ textSize, textColor, lead, ...rest }) => <div {...rest} />)`
  display: ${(props) => !props.textBlock && 'inline'};
  color: ${(props) => props.textColor || '#222'};
  font-weight: ${(props) => (props.lead ? '600' : props.fontWeight || '500')};
  font-size: ${(props) => props.textSize || (props.lead && '1.143rem')};
  .value {
    font-size: ${(props) => props.textSize || (props.lead && '1.143rem')};
  }
`;
Text.displayName = 'TextStyled';
