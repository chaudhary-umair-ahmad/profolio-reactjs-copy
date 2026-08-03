import React from 'react';
const AppLink = ({ link, IconEn, IconAr, height, width, locale, onClick }) => (
  <a href={link} onClick={onClick}>
    {locale === 'en' ? <IconEn height={height} width={width} /> : <IconAr height={height} width={width} />}
  </a>
);
export default AppLink;
