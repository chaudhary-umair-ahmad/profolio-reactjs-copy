import React from 'react';
import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { LinkWithIcon } from '../../../../components/common';
import { IconSwitch, SidebarClassifiedLinkIcon } from '../../../../components/svg';
import { useTranslation } from 'react-i18next';
import { getClassifiedBaseURL } from '../../../../utility/env';
import { getLocaleForURL } from '../../../../utility/language';
import { capitalizeFirstLetter } from '../../../../utility/utility';

const HeaderLink = ({ className, variant = 'default' }) => {
  const { t } = useTranslation();
  const sidebarPill = variant === 'sidebarPill';
  const headerPill = variant === 'headerPill';
  const classifiedPill = sidebarPill || headerPill;
  const classifiedIcon = (
    <SidebarClassifiedLinkIcon color="rgba(40, 177, 109, 1)" width={18} height={14} />
  );
  return (
    <LinkWithIcon
      as="a"
      icon={classifiedPill ? classifiedIcon : <IconSwitch />}
      linkTitle={t('Go to {{link}}', { link: capitalizeFirstLetter(tenantConstants.LINK_TITLE) })}
      href={`${getClassifiedBaseURL()}${getLocaleForURL()}`}
      className={
        sidebarPill ? className || undefined : headerPill ? className || undefined : `btnLink px-8 ${className || ''}`
      }
      target="_blank"
      $sidebarPill={sidebarPill}
      $headerClassifiedPill={headerPill}
    />
  );
};

export default HeaderLink;
