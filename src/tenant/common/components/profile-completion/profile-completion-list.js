import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import tenantConstants from '@constants';
import React from 'react';
import { t } from 'i18next';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CustomCard, LinkWithIcon } from '../../../../components/common';
import { getClassifiedBaseURL } from '../../../../utility/env';
import { getLocaleForURL } from '../../../../utility/language';
import { IconSwitch } from '../../../../components/svg';

const ProfileCompletionList = (props) => {
  const { user } = useSelector((state) => state.app.loginUser);

  const profileNavigationRoutes = useMemo(
    () => [
      {
        key: 1,
        title: t('User Settings'),
        link:
          !user?.is_profile_completed && tenantRoutes.app(`/user-settings`, false, user).settings.subRoutes[0]?.path,
        cardBackground: user?.is_profile_completed && tenantTheme['primary-light-4'],
        isVerified: user?.is_profile_completed,
        internalLink: true,
      },
      ...(tenantConstants.ENABLE_FAL_LICENSE
        ? [
            {
              key: 2,
              title: t('FAL License Verification'),
              link:
                !user?.is_rega_verified &&
                `${getClassifiedBaseURL()}${getLocaleForURL()}/verification/rega/?redirectPath=${window.location.href}`,
              cardBackground: user?.is_rega_verified && tenantTheme['primary-light-4'],
              isVerified: user?.is_rega_verified,
            },
          ]
        : []),
      ...(tenantConstants.ENABLE_NAFATH
        ? [
            {
              key: 3,
              title: t('Nafath Verification'),
              link:
                !user?.is_nafaz_verified &&
                `${getClassifiedBaseURL()}${getLocaleForURL()}/verification/nafath/?redirectPath=${window.location.href}`,
              cardBackground: user?.is_nafaz_verified && tenantTheme['primary-light-4'],
              isVerified: user?.is_nafaz_verified,
            },
          ]
        : []),
    ],
    [],
  );

  return profileNavigationRoutes.map((e) => (
    <React.Fragment key={e?.key}>
      <CustomCard
        avatarIcon={e?.isVerified ? 'SvgIconCheck' : 'SvgRadio'}
        iconSize={16}
        title={e?.title}
        link={e?.link}
        cardBackground={e?.cardBackground}
        isVerified={e?.isVerified}
        cardStyle={{ borderColor: e?.isVerified && tenantTheme['primary-light-3'] }}
        onClick={e?.onClick}
        internalLink={e?.internalLink}
        extraContent={
          !e?.internalLink &&
          !e?.isVerified && (
            <LinkWithIcon
              as="a"
              icon={<IconSwitch color={tenantTheme['primary-color']} />}
              href={e?.link}
              className="btnLink"
              target="_blank"
            />
          )
        }
        {...props}
      />
    </React.Fragment>
  ));
};
export default ProfileCompletionList;
