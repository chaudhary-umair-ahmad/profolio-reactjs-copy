import React, { useMemo } from 'react';
import tenantData from '@data';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Flex } from 'antd';
import { useTheme } from 'styled-components';
import tenantRoutes from '@routes';
import useRouteNavigate from '../../../hooks/useRouteNavigate';
import { Avatar } from '../../../components/common';
import { ChevronRightBolIcon, RankTileSvg, TruPointsTileSvg, ViewPublicProfile } from '../../../components/svg';
import { AgentProfileCardSkeleton } from './AgentPerformanceSkeleton';
import { getClassifiedBaseURL } from '../../../utility/env';
import { getRankSuffix } from './Utils';
import {
  ProfileHeaderWrapper,
  UserCardSection,
  ProfileUserAvatar,
  ProfileUserInfo,
  ProfileUserName,
  PublicProfileLink,
  StatsPanel,
  StatTile,
  TileLeft,
  IconBox,
  StatLabel,
  StatValue,
  TileLink,
} from './styled';

const AgentProfileCard = ({
  user = {},
  rank = null,
  truPoints = 0,
  onLeaderboardClick = () => {},
  onActivityClick = () => {},
  loading = false,
  isMobile = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const currentUser = useSelector((state) => state.app?.loginUser?.user);
  const locale = useSelector((state) => state.app?.AppConfig?.locale);
  const rtl = useSelector((state) => state.app?.AppConfig?.rtl);
  const navigate = useRouteNavigate();
  const { name = '', profile_image = '', name_l1 = '' } = user;
  const isRanked = !!rank;

  const publicProfileUrl = useMemo(() => {
    if (!currentUser?.external_id || !currentUser?.name) {
      return null;
    }
    const nameSlug = currentUser.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const localePrefix = locale && locale !== 'en' ? `/${locale}` : '/en';
    const classifiedBaseURL = getClassifiedBaseURL();
    const externalId = currentUser.external_id;

    return `${classifiedBaseURL}${localePrefix}/brokers/${nameSlug}-${externalId}.html`;
  }, [currentUser, locale]);

  const handleViewPublicProfile = (e) => {
    e.preventDefault();
    if (publicProfileUrl) {
      window.open(publicProfileUrl, '_blank');
    } else {
      const path = tenantRoutes.app().dashboard.path;
      navigate(path);
    }
  };

  if (loading) {
    return <AgentProfileCardSkeleton isMobile={isMobile} />;
  }

  return (
    <ProfileHeaderWrapper theme={theme}>
      <Flex
        align="center"
        gap={12}
        as={UserCardSection}
        style={isMobile ? { justifyContent: 'space-between', width: '100%' } : {}}
      >
        <Flex align="center" gap={12} style={{ minWidth: 0, flex: 1 }}>
          <ProfileUserAvatar theme={theme}>
            <Avatar src={profile_image} size={50} iconSize={24} iconContainerSize="50px" />
          </ProfileUserAvatar>
          <Flex vertical gap={5} as={ProfileUserInfo}>
            <ProfileUserName theme={theme}>
              {locale === 'ar' && name_l1 ? name_l1 : name}
            </ProfileUserName>
            {!isMobile && (
              <PublicProfileLink theme={theme} href="#" onClick={handleViewPublicProfile}>
                {t('View my Public Profile')}
                <ViewPublicProfile />
              </PublicProfileLink>
            )}
          </Flex>
        </Flex>
        {isMobile && (
          <PublicProfileLink theme={theme} href="#" onClick={handleViewPublicProfile} style={{ flexShrink: 0 }}>
            {t('View my Public Profile')}
            <ViewPublicProfile />
          </PublicProfileLink>
        )}
      </Flex>

      <Flex gap={16} align="stretch" as={StatsPanel}>
        <StatTile theme={theme} id={tenantData?.tourElementIds?.ap_profile_header_rank}>
          <TileLeft onClick={onLeaderboardClick}>
            <IconBox>
              <RankTileSvg />
            </IconBox>
            <Flex
              vertical
              gap={2}
              align="flex-start"
              style={{ minWidth: 0, flex: 1, overflow: 'hidden', maxWidth: '100%' }}
            >
              <StatLabel theme={theme}>{isRanked ? t('Rank') : t('Not Ranked')}</StatLabel>
              <StatValue theme={theme}>{isRanked && `${rank}${getRankSuffix(rank)}`}</StatValue>
            </Flex>
          </TileLeft>
          <TileLink onClick={onLeaderboardClick} theme={theme}>
            {t('Leaderboard')}{' '}
            <ChevronRightBolIcon
              size={14}
              color="#006169"
              style={{ transform: rtl ? 'scaleX(-1)' : 'none' }}
            />
          </TileLink>
        </StatTile>

        <StatTile theme={theme} id={tenantData?.tourElementIds?.ap_profile_header_trupoints}>
          <TileLeft onClick={onActivityClick}>
            <IconBox>
              <TruPointsTileSvg />
            </IconBox>
            <Flex
              vertical
              gap={2}
              align="flex-start"
              style={{ minWidth: 0, flex: 1, overflow: 'hidden', maxWidth: '100%' }}
            >
              <StatLabel theme={theme}>{t('TruPoints™')}</StatLabel>
              <StatValue theme={theme}>{truPoints}</StatValue>
            </Flex>
          </TileLeft>
          <TileLink onClick={onActivityClick} theme={theme}>
            {t('Activity')}{' '}
            <ChevronRightBolIcon
              size={14}
              color="#006169"
              style={{ transform: rtl ? 'scaleX(-1)' : 'none' }}
            />
          </TileLink>
        </StatTile>
      </Flex>
    </ProfileHeaderWrapper>
  );
};

export default AgentProfileCard;
