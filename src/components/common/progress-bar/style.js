import styled from 'styled-components';

export const ProgressBarContainer = styled.div`
  width: 300px;
  height: 20px;
  border: 1px solid #ccc;
  position: relative;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #4caf50;
  position: absolute;
  top: 0;
  left: 0;
`;

export const ProgressBarPercentage = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
`;
