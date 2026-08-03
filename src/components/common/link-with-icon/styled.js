import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const sidebarPillStyles = css`
  width: 100%;
  height: 36px;
  max-width: 100%;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  color: #767676;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
  box-sizing: border-box;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: #595959;
    border-color: #dcdcdc;
    background: #fafafa;
    text-decoration: none;
  }

  svg {
    flex-shrink: 0;
  }

  html[dir='rtl'] & {
    flex-direction: row-reverse;
  }

  /* Mobile drawer: fixed pill size; no horizontal padding (width from box + border) */
  @media (max-width: 991px) {
    box-sizing: border-box;
    width: 246px;
    min-width: 246px;
    max-width: none;
    height: 36px;
    padding: 0;
    border-width: 1px;
    border-color: rgb(240, 240, 240);
    border-radius: 6px;
    gap: 4px;
  }
`;

/** Top navbar “Go to bayut.sa” pill — matches design spec (width / border / radius / padding / gap). */
const headerClassifiedPillStyles = css`
  box-sizing: border-box;
  width: fit-content;
  min-width: 148.71px;
  height: 36px;
  max-width: none;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 0 16px;
  background: #fff;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 6px;
  color: #767676;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;
  opacity: 1;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: #595959;
    border-color: #e0e0e0;
    background: #fafafa;
    text-decoration: none;
  }

  svg {
    flex-shrink: 0;
  }

  html[dir='rtl'] & {
    flex-direction: row-reverse;
  }

  @media (max-width: 768px) {
    width: fit-content;
    min-width: 148.71px;
  }
`;

export const LinkStyled = styled(Link)`
  align-items: center;
  display: inline-flex;
  gap: 4px;
  line-height: 1;
  text-decoration: ${(props) => (props.$noUnderline ? 'none' : 'underline')};

  &:hover {
    text-decoration: ${(props) => (props.$noUnderline ? 'none' : 'underline')};
  }

  ${(p) => p.$sidebarPill && sidebarPillStyles};
  ${(p) => p.$headerClassifiedPill && headerClassifiedPillStyles};

  .anticon {
    &,
    svg {
      vertical-align: middle;
    }
  }
`;
