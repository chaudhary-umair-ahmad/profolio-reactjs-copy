import tenantTheme from '@theme';
import { Tag } from 'antd';
import chroma from 'chroma-js';
import Styled from 'styled-components';

export const TagStyled = Styled(({ textColor, gradient, spaceTop, size, ...rest }) => <Tag {...rest} />)`
  &.ant-tag {
    --tag-font-size: ${(props) => props.size};
    
    border-radius: ${(props) => (props.shape === 'round' ? '24px' : '4px')};
    border-color: ${(props) => (props.bordered ? tenantTheme['border-color-base'] : 'transparent')};
    color: var(--tag-color, #707070);
    background-color:var(--tag-bg, #f5f5f5) ;
    font-size: var(--tag-font-size, 14px);
    font-weight: 400;
    line-height: var(--line-height, 1.4);
    margin-inline-end: unset;
    padding-inline: .5em;

    
    
    
    ${(props) =>
      props.gradient &&
      `
      --tag-color: ${props.textColor};
      background-blend-mode: overlay;
     --linear-value: -90deg, #fff2, #0009;
     background-image: linear-gradient(var(--linear-value));

      border: none;      
    `}
    

    ${(props) =>
      props.shape === 'round' &&
      `
      line-height: 2em;
      padding-inline: 0.85em;
      @media only screen and (max-width: 991px) {
        line-height: 1.6em;
      }
    `}


       ${(props) =>
         props.shape === 'circle' &&
         `
      --border-radius: 50%;
      width: 18px;
      height: 18px;
      padding: 0 !important; 
       > span{
       margin: auto;
       }
   
    `}


  }

  &.ant-tag-warning {
    color: ${tenantTheme['warning-color']};
    background-color: ${chroma.mix(tenantTheme['warning-color'], '#fff', 0.85).saturate(0.24)};
  }

  &.ant-tag-green {
    color: ${tenantTheme['secondary-color']};
    background-color: ${chroma.mix(tenantTheme['secondary-color'], '#fff', 0.85).saturate(0.24)};
  }

  &.ant-tag-red {
    color: ${tenantTheme['danger-color']};
    background-color: ${chroma.mix(tenantTheme['danger-color'], '#fff', 0.85).saturate(0.24)};
  }
  
  &.ant-tag-blue {
    color: ${tenantTheme['info-color']};
    background-color: ${chroma.mix(tenantTheme['info-color'], '#fff', 0.85).saturate(0.24)};
  }

  .ant-tag-close-icon {
    margin-inline-start: 4px;
    position: relative;
    top: var(--space-top, 2px);
  }
`;
