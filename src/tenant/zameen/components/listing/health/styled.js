import styled from 'styled-components';

export const ColorBlob = styled.div`
  --blob-color: ${(props) => props.color};
  --blob-size: ${(props) => props.size};

  background-color: var(--blob-color);
  border-radius: 50%;
  width: var(--blob-size, 26px);
  height: var(--blob-size, 26px);
`;

export const LegendHorizontal = styled.div`
  transform: rotate(90deg) translateY(12px);
`;
