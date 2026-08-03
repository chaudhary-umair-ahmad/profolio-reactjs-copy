// styled.js
import styled from 'styled-components';
import tenantTheme from '@theme';

export const SeatsContainer = styled.div`
  margin-bottom: 24px;
`;

export const StyledCard = styled.div`
  background: ${(props) => props.bg || '#f5faff'};
  border: 1px solid ${(props) => props.border || '#e6f0ff'};
  border-radius: 12px;
  padding: 16px 20px;
`;

export const IconWrapper = styled.div`
  background: ${(props) => props.bg || '#e6f0ff'};
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 22px;
    color: ${(props) => props.color || '#1677ff'};
  }
`;

export const CardTitle = styled.h5`
  margin-bottom: ${(props) => (props.noMargin ? '0' : '8px')};
  font-size: 16px;
  font-weight: 600;
`;

export const CardSubtitle = styled.p`
  color: ${tenantTheme['text-color-secondary'] || '#999'};
  margin-bottom: 0;
`;

export const CountText = styled.h2`
  margin: 0;
  font-weight: 700;
  color: ${(props) => props.color || 'inherit'};
`;

export const StatLabel = styled.p`
  color: ${tenantTheme['text-color-secondary'] || '#999'};
  margin: 0;
  width: 100px;
`;

export const StatValue = styled.h5`
  margin: 0;
  color: ${(props) => props.color || 'inherit'};
  font-weight: 600;
`;
