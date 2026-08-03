import tenantTheme from '@theme';
import styled from 'styled-components';

export const WarningNoticeStyled = styled.div`
  --warning-notice-bg: ${(props) => props.type === 'simple' && 'transparent'};

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: var(--warning-notice-bg, ${tenantTheme.gray200});
  padding: ${(props) => (props.type === 'simple' ? 0 : '6px 8px')};
  border-radius: 6px;

  > div {
    flex-wrap: nowrap;
    align-items: var(--align-items, flex-start);
  }
`;
