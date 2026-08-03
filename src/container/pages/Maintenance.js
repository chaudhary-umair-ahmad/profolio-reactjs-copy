import React from 'react';
import { useSelector } from 'react-redux';
import { EmptyState } from '../../components/common';
import { LogoBayutKsa, LogoBayutKsaArabic } from '../../components/svg';
import styled from 'styled-components';

const PlaceCenter = styled.div`
  display: grid;
  place-content: center;
`;

const Maintenance = () => {
  const { locale } = useSelector((state) => state.app.AppConfig);

  return (
    <PlaceCenter style={{ minHeight: '100vh' }}>
      <EmptyState
        type="maintenance"
        logo={locale === 'ar' ? <LogoBayutKsaArabic width={200} /> : <LogoBayutKsa width={200} />}
      />
    </PlaceCenter>
  );
};

export default Maintenance;
