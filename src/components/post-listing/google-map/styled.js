import styled from 'styled-components';
import { GoogleMap } from '@react-google-maps/api';

export const MessageContainer = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #666;
`;

export const MessageContent = styled.div`
  text-align: center;
`;

export const MessageText = styled.div`
  margin-top: 8px;
`;

export const StyledGoogleMap = styled(({ className, ...props }) => (
  <GoogleMap mapContainerClassName={className} {...props} />
))`
  cursor: pointer !important;
  
  .gm-style > div:first-child {
    cursor: pointer !important;
  }
`;
