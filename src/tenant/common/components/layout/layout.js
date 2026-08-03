import React from 'react';
import TenantComponents from '@components';
const Header = () => {
  return <TenantComponents.NavBar />;
};

const Footer = () => {
  return <TenantComponents.FooterComponent />;
};

const Layout = {
  Header,
  Footer,
};

export { Layout };
