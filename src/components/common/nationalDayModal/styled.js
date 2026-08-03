import styled from 'styled-components';

export const NationalDayModalContainer = styled.div`
  display: flex;
  max-height: ${props => props?.isMobile ? '620px' : '420px'};
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  flex-direction: ${props => props?.isMobile ? 'column' : 'row'};
  min-height: ${props => props?.isMobile ? '400px' : 'auto'};
`;

export const ImageSection = styled.div`
  flex: ${props => props?.isMobile ? '1' : '1'};
  min-height: ${props => props?.isMobile ? '100%' : '420px'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: ${props => props?.isMobile ? '24px' : '40px'};
  margin: ${props => props?.isMobile ? '0' : '20px 0px'};

  h2 {
    font-weight: bold;
    font-size: ${props => props?.isMobile ? '24px' : '32px'};
    margin-bottom: ${props => props?.isMobile ? '16px' : '26px'};
    line-height: 1.2;
    color: #333;
  }

  p {
    font-size: ${props => props?.isMobile ? '14px' : '16px'};
    line-height: 1.5;
    margin-bottom: ${props => props?.isMobile ? '16px' : '24px'};
    color: #333;
  }
`;
