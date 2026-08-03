import React from 'react';
import tenantConstants from '@constants';
import { ProfolioLogoAr, ProfolioLogo } from '../../../../components/svg';

export const Logo = ({ rtl }) => {
  return rtl ? (
    <ProfolioLogoAr text={tenantConstants?.APP_LOGO?.getLogoText()?.ar} width={220} height="32px" />
  ) : (
    <ProfolioLogo text={tenantConstants?.APP_LOGO?.getLogoText()?.en} width={190} height="32px" />
  );
};
