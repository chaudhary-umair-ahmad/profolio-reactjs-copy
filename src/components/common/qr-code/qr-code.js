import React from 'react';
import QRCode from 'react-qr-code';

const QR_Code = props => {
  const { value, size, viewBox, ...rest } = props;
  return <QRCode value={value} size={size} viewBox={viewBox} {...rest} />;
};

export default QR_Code;
