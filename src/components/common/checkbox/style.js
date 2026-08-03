import Styled from 'styled-components';
import { Checkbox, Row } from 'antd';
import tenantTheme from '@theme';

const CheckboxStyle = Styled(Checkbox)`
  .ant-checkbox-inner {
    border-radius: 4px;
    border-color: ${tenantTheme.gray500};
  }
`;

const RowStyle = Styled(Row)`
  &.reverse {
    flex-direction: row-reverse;
    justify-content: flex-end;

    label {
      font-weight: normal;
      .ant-checkbox {
        margin-inline-end: 12px;
      }
    }
  }

  &.label-space {
    @media screen and (min-width: 992px) {
      padding-block-start: 40px;
    }
  }
`;

export { CheckboxStyle, RowStyle };
