import tenantTheme from '@theme';
import { Cascader } from 'antd';
import Styled from 'styled-components';

const CascaderStyle = Styled(Cascader)`
    &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
      border-radius: ${tenantTheme['border-radius-base']};
    }

    .ant-input{
        padding: 5.5px 20px;
    }
    .anticon svg{
        width: 1.2em;
        height: 1.2em;
    }
`;

export { CascaderStyle };
