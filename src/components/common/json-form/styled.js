import tenantTheme from '@theme';
import React from 'react';
import styled from 'styled-components';
import Card from '../cards/Card';

/** Factory to avoid circular dependency: json-form.js calls this with JSONForm and exports JSONFormStyled. */
export const createJSONFormStyled = (Component) => styled(Component)`
  max-width: 880px;
  margin: 0 auto;

  > div {
    align-items: start; // user-settings/profile - after error msgs field alignment
  }

  @media only screen and (max-width: 991px) {
    > div {
      --template: minmax(min(20ch, 100%), 1fr) !important;
    }
  }
`;

export const AmenitiesCard = styled((props) => <Card {...props} />)`
  &.ant-card {
    cursor: pointer;
    border-radius: 8px !important;
    border: 1px solid #e8e8e8 !important;
    background-color: #ffffff !important;
    box-shadow: none !important;
    transition: all 0.2s ease;
    margin: 0 !important;
    width: 100%;
    display: block !important;
     
    .ant-card-body {
      padding: 12px 16px !important;
      width: 100% !important;
      border: none !important;
    }
    
    // Remove any default card borders or dividers
    &::before,
    &::after {
      display: none !important;
    }
    
    input {
      height: 33px;
      max-width: 100px;
      width: 100%;
    }
    
    &.selected-card {
      border-color: ${tenantTheme['primary-light-2'] || '#40a9ff'} !important;
      background-color: ${tenantTheme['primary-light-4'] || '#e6f7ff'} !important;
      
      &:hover {
        border-color: ${tenantTheme['primary-light-2'] || '#40a9ff'} !important;
        background-color: ${tenantTheme['primary-light-4'] || '#e6f7ff'} !important;
      }
    }
    
    // Ensure proper flex layout
    > .ant-card-body {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    
    // Group wrapper styling - ensure vertical centering
    .w-100 {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 34px;
    }
    
    .amenities-data {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0; // Allow text truncation
      
      // Text styling
      span {
        font-size: 14px;
        color: #262626;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    // Input wrapper (checkbox/select) - ensure vertical centering
    .w-100 > div:last-child {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
    }
    
    // Icon styling
    svg {
      flex-shrink: 0;
      width: 1.4em;
      height: 1.4em;
    }
    
    // Checkbox styling - ensure it stays centered vertically
    .ant-checkbox-wrapper {
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      
      .ant-checkbox {
        top: 0;
        display: flex;
        align-items: center;
        vertical-align: middle;
        
        .ant-checkbox-inner {
          border-color: #c1bfbf;
          border-radius: 4px;
          width: 18px;
          height: 18px;
          border-width: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &::after {
            width: 6px;
            height: 10px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            margin-top: -1px;
          }
        }
        
        &.ant-checkbox-checked .ant-checkbox-inner {
          background-color: ${tenantTheme['primary-color'] || '#1890ff'};
          border-color: ${tenantTheme['primary-color'] || '#1890ff'};
          
          &::after {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          }
        }
      }
    }
    
    // Select dropdown styling
    .ant-select {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      
      .ant-select-selector {
        border-radius: 6px;
        border-color: #d9d9d9;
        height: 33px;
        min-width: 120px;
        display: flex;
        align-items: center;
        
        .ant-select-selection-item {
          line-height: 31px;
          padding-inline-end: 20px;
        }
        
        .ant-select-selection-placeholder {
          line-height: 31px;
        }
      }
      
      .ant-select-arrow {
        right: 8px;
      }
    }
  }

  .ant-select-dropdown {
    min-width: 150px !important;
  }
`;
