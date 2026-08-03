import styled from 'styled-components';

export const FlexStyled = styled(({ wrap, vertical, gap, align, ...rest }) => <div {...rest} />)`
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  align-items: ${(props) => props.align};
  justify-content: ${(props) => props.justify};
  gap: ${(props) => props.gap};
  flex: ${(props) => props.flex};
  flex-wrap: ${(props) => props.wrap && 'wrap'};
  flex-direction: ${(props) => props.vertical && 'column'};
`;

FlexStyled.displayName = 'FlexStyled';
