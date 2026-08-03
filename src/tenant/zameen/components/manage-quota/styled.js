import tenantTheme from '@theme';
import { Row } from 'antd';
import styled from 'styled-components';

export const QuotaBlock = styled.div`
  // & + & {
  //   border-block-start: 1px solid #e6e6e6;
  //   margin-block-start: 24px;
  //   padding-block-start: 24px;
  // }

  .ant-table.ant-table .ant-table-thead th {
    background-color: var(--table-header-bg-color, #f8f9fb);
    color: hsl(0 0% 0% / 64%);
    font-weight: 500;
  }
`;

export const ManageQuotaTable = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  --table-header-bg-color: transparent;

  .manageTable {
    border: 1px solid red;
  }

  .ant-table,
  .ant-table-cell {
    background-color: transparent !important;
  }

  .ant-table-thead {
    > tr {
      &:hover {
      }
      > th {
        padding: 3px 0;
        color: ${tenantTheme['light-color']} !important;
        font-weight: 400 !important;
        border: none;

        @media only screen and (max-width: 767px) {
          padding: 3px 5px;
        }
      }
    }
  }

  .ant-table-tbody > tr > td {
    padding: 3px 0;
    border: none;
  }

  .ant-table-thead > tr > th:before {
    display: none;
  }
`;

export const ManageQuotaList = styled(Row)`
  padding-block: 16px;

  & + & {
    border-top: 1px solid #e6e6e6;
  }

  .title {
    label {
    }
  }

  .ant-input-number-input {
    height: 40px;
  }

  button.ant-btn {
    color: #1f1f1f;
    font-weight: 300;

    @media only screen and (max-width: 767px) {
      padding: 14px 4px;
      border: none;

      span + span {
        display: none;
      }
    }

    @media only screen and (min-width: 767px) {
      height: 42px;
      min-width: 100px;
    }
  }
`;
