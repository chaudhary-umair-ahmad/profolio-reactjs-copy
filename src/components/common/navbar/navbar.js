import tenantTheme from '@theme';
import { Badge } from 'antd';
import propTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Icon } from '..';
import { Nav } from './style';

const Navbar = ({ paths, toggleCollapsed, basePath, children }) => {
  const { t } = useTranslation();
  return (
    <Nav>
      <ul>
        {paths &&
          paths.map((e, i) => {
            return (
              <li key={i}>
                <NavLink
                  to={{ pathname: basePath ? `${basePath}${e.path}` : e.path, params: { page: e.name } }}
                  onClick={toggleCollapsed}
                >
                  <Icon icon={e.icon} />
                  <span className="nav-text">
                    {e.name && <span>{t(e.name)}</span>}
                    {!!e.badge && (
                      <Badge
                        count={e.badge}
                        overflowCount={99}
                        style={{ backgroundColor: tenantTheme['primary-color'] }}
                      />
                    )}
                  </span>
                </NavLink>
              </li>
            );
          })}
      </ul>
      {children}
    </Nav>
  );
};

// Navbar.propTypes = {
//   path: propTypes.string.isRequired,
// };

export default Navbar;
