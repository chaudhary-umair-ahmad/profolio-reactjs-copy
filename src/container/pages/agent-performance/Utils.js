import { FiAward, FiClock, FiSpeaker, FiStar } from 'react-icons/fi';
import {
  HealthListingIcon,
  HotListingIcon,
  HotListingTrubroker,
  HouseIcon,
  ListIcon,
  LocationIcon,
  ProgressIcon,
  QualityListerFilter,
  SuperListerFilter,
  QualityListerIcon,
  QualityListerIconTeamPerformance,
  RentalProperty,
  ResponsiveBrokerFilter,
  ResponsiveBrokerIcon,
  ResponsiveBrokerIconTeamPerformance,
  SignatureListingIcon,
  SuperListerIcon,
  SuperListerIconTeamPerformance,
  TruBrokerSixMonths,
  TruBrokerThreeMonths,
  TrueBrokerIcon,
} from '../../../components/svg';
import superListerLottieAnimation from './SuperListerLottie.json';
import qualityListerLottieAnimation from './QualityListerLottie.json';
import responsiveBrokerLottieAnimation from './ResponsiveBrokerLottie.json';

import { getTimeDateString } from '../../../utility/date';
import { DATE_BEFORE_TIME_FORMAT } from '../../../constants/formats';

export const BadgesData = (data, userData) => {
  const imageScore = parseFloat(data?.quality_lister?.listing_images) || 0;
  const featureScore = parseFloat(data?.quality_lister?.listing_features) || 0;
  const callsAnswered = parseFloat(data?.responsive_broker?.call_response_rate) || 0;
  const waResponse = parseFloat(data?.responsive_broker?.whatsapp_response_rate) || 0;
  const activeListings = data?.super_lister?.active_listing_count ?? 0;
  const whatsapp_count = data?.responsive_broker?.whatsapp_count ?? 0;
  const call_count = data?.responsive_broker?.call_count ?? 0;
  const whatsappCriteria = data?.responsive_broker?.whatsapp_criteria ?? 0;
  const callCriteria = data?.responsive_broker?.call_criteria ?? 0;
  const call_answered_count = data?.responsive_broker?.call_answered_count ?? Math.round((call_count * callsAnswered) / 100);
  const whatsapp_responded_count = data?.responsive_broker?.whatsapp_responded_count ?? Math.round((whatsapp_count * waResponse) / 100);

  return [
    {
      name: 'Quality Lister',
      slug: 'quality-lister',
      description: 'Exclusive badge awarded to agents who maintain high quality listings.',
      lottie: qualityListerLottieAnimation,
      iconColor: '#1890ff',
      fillColor: '#64B7E3',
      unfilledColor: '#E1F5FF',
      unfilledColorHex: null,
      unfilledColorOpacity: null,
      pillBg: '#E8F5FB',
      id: 'apBadgeQualityLister',
      status: 'achieved',
      metrics: [
        { label: 'Images Score', value: `${imageScore}%`, percent: imageScore, color: '#1890ff' },
        { label: 'Features Score', value: `${featureScore}%`, percent: featureScore, color: '#1890ff' },
      ],
      showLocked: !userData?.is_quality_lister,
    },
    {
      name: 'Responsive Broker',
      slug: 'responsive-broker',
      description: 'Exclusive badge awarded to agents who are highly reachable and responsive.',
      lottie: responsiveBrokerLottieAnimation,
      iconColor: '#722ed1',
      fillColor: '#C796D8',
      unfilledColor: null,
      unfilledColorHex: '#C796D8',
      unfilledColorOpacity: 0.2,
      pillBg: '#F4E9F5',
      id: 'apBadgeResponsiveBroker',
      status: 'not-achieved',
      metrics: [
        {
          label: 'Calls Answered',
          value: `${callsAnswered}%`,
          percent: callsAnswered,
          color: '#722ed1',
          slug: 'calls-answered',
          tooltip: { received: call_count, answered: call_answered_count, criteria: callCriteria },
        },
        {
          label: 'WA Response',
          value: `${waResponse}%`,
          percent: waResponse,
          color: '#722ed1',
          slug: 'wa-response',
          tooltip: { received: whatsapp_count, responded: whatsapp_responded_count, criteria: whatsappCriteria },
        },
      ],
      showLocked: !userData?.is_responsive_broker,
    },
    {
      name: 'Super Lister',
      slug: 'super-lister',
      description:
        'Exclusive badge awarded to agents who consistently maintain a strong presence through listing activity.',
      lottie: superListerLottieAnimation,
      iconColor: '#faad14',
      fillColor: '#EFC468',
      unfilledColor: null,
      unfilledColorHex: '#EFC468',
      unfilledColorOpacity: 0.15,
      pillBg: '#FFFBE3',
      id: 'apBadgeSuperLister',
      status: 'achieved',
      metrics: [
        {
          label: 'Active Listing',
          value: `${activeListings || 0}/20`,
          percent: activeListings ? Math.min((activeListings / 20) * 100, 100) : 0,
          color: '#faad14',
        },
      ],
      showLocked: !userData?.is_super_lister,
    },
  ];
};

export const calculatePercentFromValue = (value) => {
  if (value === null || value === undefined || value === '') return 0;

  if (typeof value === 'number') {
    return Math.min(Math.max(value, 0), 100);
  }

  if (typeof value === 'string') {
    const match = value.match(/^(\d+)\/(\d+)$/);
    if (match) {
      const numerator = parseInt(match[1], 10);
      const denominator = parseInt(match[2], 10);
      if (denominator > 0) {
        return Math.min(Math.max((numerator / denominator) * 100, 0), 100);
      }
    }

    if (value.endsWith('%')) {
      return Math.min(Math.max(parseFloat(value.replace('%', '')) || 0, 0), 100);
    }
  }

  return 0;
};

export const hexToRgba = (hex, a = 0.14) => {
  if (!hex || typeof hex !== 'string') {
    return `rgba(0, 0, 0, ${a})`;
  }
  const value = hex.trim();
  if (value.startsWith('rgba(') || value.startsWith('rgb(')) {
    return value;
  }
  const h = value.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((x) => x + x)
          .join('')
      : h;
  const r = parseInt(full.slice(0, 2) || '00', 16);
  const g = parseInt(full.slice(2, 4) || '00', 16);
  const b = parseInt(full.slice(4, 6) || '00', 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const getBadgeIcon = (badgeType) => {
  if (!badgeType) return '';

  const normalizedType = badgeType.toString().toLowerCase().replace(/\s+/g, '');
  switch (normalizedType) {
    case 'qualitylister':
      return <QualityListerIcon size={24} />;
    case 'responsivebroker':
      return <ResponsiveBrokerIcon size={24} />;
    case 'superlister':
      return <SuperListerIcon size={24} />;
    case 'trubroker':
      return <TrueBrokerIcon />;
    default:
      return '';
  }
};

export const getBadgeIconTeamPerformance = (badgeType) => {
  if (!badgeType) return '';

  const normalizedType = badgeType.toString().toLowerCase().replace(/\s+/g, '');
  switch (normalizedType) {
    case 'qualitylister':
      return <QualityListerIconTeamPerformance />;
    case 'responsivebroker':
      return <ResponsiveBrokerIconTeamPerformance />;
    case 'superlister':
      return <SuperListerIconTeamPerformance />;
    case 'trubroker':
      return <TrueBrokerIcon />;
    default:
      return '';
  }
};

export const getBadgeFilterTeamPerformance = (badgeType) => {
  if (!badgeType) return '';

  const normalizedType = badgeType.toString().toLowerCase().replace(/\s+/g, '');
  switch (normalizedType) {
    case 'qualitylister':
      return <QualityListerFilter height={40} width={140} />;
    case 'responsivebroker':
      return <ResponsiveBrokerFilter height={40} width={140} />;
    case 'superlister':
      return <SuperListerFilter height={40} width={140} />;
    case 'trubroker':
      return <TrueBrokerIcon height={40} width={140} />;
    default:
      return '';
  }
};

export const leaderboardItems = (leaderboardData) => {
  if (!leaderboardData || !Array.isArray(leaderboardData.list)) return { items: [], pagination: null };

  const items = leaderboardData?.list?.map((item) => {
    const badges = [];
    if (item.is_tru_broker) badges.push('TruBroker');
    if (item.is_quality_lister) badges.push('Quality Lister');
    if (item.is_responsive_broker) badges.push('Responsive Broker');
    if (item.is_super_lister) badges.push('Super Lister');

    return {
      rank: item.rank,
      name: item.name,
      name_l1: item.name_l1,
      avatar: item.profile_image || null,
      badges: badges,
      truPoints: item.score,
    };
  });

  return {
    items,
    pagination: leaderboardData?.pagination || null,
  };
};

export const formattedTruPointsData = (truPointsCriteriaData) => {
  if (!truPointsCriteriaData?.tru_points || !Array.isArray(truPointsCriteriaData.tru_points)) {
    return [];
  }
  return truPointsCriteriaData.tru_points.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    title_l1: item.title_l1,
    points: item.points,
    is_completed: item.is_completed,
  }));
};

export const IconCriteriaMapping = (slug) => {
  const iconMap = {
    'active-listings-gt-4': { icon: <ListIcon />, bgColor: '#f2fafa', color: '#006169' },
    'avg-listing-health-gt-50': { icon: <HealthListingIcon />, bgColor: '#f2fff8', color: '#28B16D' },
    'upgrade-to-hot': { icon: <HotListingIcon />, bgColor: '#fff3f3', color: '#e74c3c' },
    'upgrade-to-signature': { icon: <SignatureListingIcon />, bgColor: '#fff9e6', color: '#f39c12' },
    'post-a-listing': { icon: <LocationIcon />, bgColor: '#f2fafa', color: '#006169' },
    'trubroker-3-months': { icon: <TruBrokerThreeMonths />, bgColor: '#fffce8', color: '#f1c40f' },
    'trubroker-6-months': { icon: <TruBrokerSixMonths />, bgColor: '#fffce8', color: '#f39c12' },
    'activate-trucheck-rented': { icon: <RentalProperty />, bgColor: '#f2fafa', color: '#006169' },
    'activate-trucheck-sale': { icon: <HouseIcon />, bgColor: '#f2fafa', color: '#006169' },
  };
  return iconMap[slug] || { icon: <FiClock size={12} />, bgColor: '#f2fafa', color: '#006169' };
};

export const formattedActivityData = (activityLogsData) => {
  if (!activityLogsData?.tru_point_activities || !Array.isArray(activityLogsData.tru_point_activities)) {
    return [];
  }

  return activityLogsData.tru_point_activities.map((item) => {
    const formattedDate = getTimeDateString(item.created_at, DATE_BEFORE_TIME_FORMAT, false, true);

    return {
      description: item.description,
      description_l1: item.description_l1,
      points: item.points,
      type: item.slug,
      date: formattedDate,
    };
  });
};

export const getRankSuffix = (rank) => {
  if (!rank) return '';
  const j = rank % 10;
  const k = rank % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};
