import { List } from 'antd';
import styled from 'styled-components';

export const ListItemStyled = styled(List.Item)`
  padding-block: 24px;
  padding-inline: 0;

  &:first-of-type {
    padding-block-start: 0;
  }

  &:last-of-type {
    padding-block-end: 0;
  }

  .ant-list-item-meta-title {
    font-weight: 600;
  }
`;
