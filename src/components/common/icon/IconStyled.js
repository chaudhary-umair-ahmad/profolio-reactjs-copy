import AntIcon from '@ant-design/icons';
import tenantTheme from '@theme';
import chroma from 'chroma-js';
import Styled from 'styled-components';

export const IconStyled = Styled(
  ({ iconContainerSize, iconBackgroundColor, marginTop, hasBackground, bgOpacity, iconRadius, ...rest }) => <div {...rest}></div>,
)`
  --icon-bg-color: ${(props) =>
    props.color ? chroma(props.color).alpha(props.bgOpacity || 0.08) : tenantTheme['bg-color-normal']};
  --icon-color: ${(props) => props.color || tenantTheme.gray700};
  --icon-styled-width: ${(props) => props.iconContainerSize};
  --icon-radius: ${(props) => props.iconRadius || '30%'};

  align-self: start;
  background-color: var(--icon-bg-color);
  border-radius: var(--icon-radius);
  display: grid;
  place-content: center;
  width: var(--icon-styled-width, 32px);
  aspect-ratio: 1;

  svg {
    color: var(--icon-color);
    vertical-align: middle;
  }

  .ant-tabs-tab & {
    .anticon {
      margin-inline: initial;

      svg {
        padding-inline: initial;
      }
    }
  }
`;

IconStyled.displayName = 'IconStyled';

export const AntIconStyled = Styled(({ hasBackground, iconContainerSize, marginTop, iconBackgroundColor, ...rest }) => (
  <AntIcon {...rest} />
))`
  display: inline-grid;
  place-content: center;
  vertical-align: initial;
`;
AntIconStyled.displayName = 'AntIconStyled';
