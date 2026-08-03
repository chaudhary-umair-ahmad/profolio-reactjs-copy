import styled from 'styled-components';

export const NationalDayGiftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props?.isMobile ? '4px' : '8px' };
  flex-wrap: wrap;
`;

export const GiftIcon = styled.img`
  height: 24px;
  width: auto;
  object-fit: contain;
`;

export const FreeText = styled.span`
  color: #22c55e;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
`;
