import tenantTheme from '@theme';
import styled from 'styled-components';

export const LabelStyled = styled.label`
  color: var(--label-color, ${props => (props.muted ? tenantTheme['label-muted'] : '#000')});
  font-weight: var(--label-font-weight, 600);
  font-size: ${props => (props.size === 'small' ? '12px' : '')};
`;
