import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ContentWrapper = styled.div`
  height: 100%;
`;

const LoaderOverlay = styled(({ loading, ...rest }) => <div {...rest} />)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({ loading }) => (loading ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  z-index: 10;
`;

const LoaderWrapper = ({ children, loading, data = true, Skeleton = () => null, size }) => {
  return (
    <Wrapper>
      {loading && !data ? (
        <Skeleton />
      ) : (
        <>
          <LoaderOverlay loading={loading}>
            <Spin size={size || 'small'} />
          </LoaderOverlay>

          <ContentWrapper>{children}</ContentWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default LoaderWrapper;
