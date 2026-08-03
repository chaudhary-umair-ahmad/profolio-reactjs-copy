import tenantTheme from '@theme';

export const getPackageBySlug = (slug) => {
  return packages?.[slugToType?.[slug]];
};

export const slugToType = {
  'bronze-half-yearly': 'bronze',
  'bronze-yearly': 'bronze',
  'silver-half-yearly': 'silver',
  'silver-yearly': 'silver',
  'gold-half-yearly': 'gold',
  'gold-yearly': 'gold',
  'elite-club-half-yearly': 'elite-club',
  'elite-club-yearly': 'elite-club',
  'platinum-half-yearly': 'platinum',
  'platinum-yearly': 'platinum',
  'platinum-plus-half-yearly': 'platinum-plus',
  'platinum-plus-yearly': 'platinum-plus',
  'starter-half-yearly': 'starter',
  'starter-yearly': 'starter',
  'starter-pro-half-yearly': 'starter-pro',
  'starter-pro-yearly': 'starter-pro',
};

export const packages = {
  bronze: {
    platformSlug: 'ksa',
    icon: 'IconPkgBronze',
    iconProps: { color: '#c4882e' },
    packageColor: '#FFF3E8',
    textColor: '#B85E39',
  },

  'elite-club': {
    icon: 'IconPackageElite',
    packageColor: '#EFC16F',
    iconProps: { size: '20px' },
  },
  silver: {
    platformSlug: 'ksa',
    icon: 'IconPkgSilver',
    iconProps: { color: tenantTheme.gray600 },
    packageColor: tenantTheme.gray600,
    textColor: '#9C9C9C',
  },
  gold: {
    platformSlug: 'ksa',
    icon: 'IconPkgGold',
    iconProps: { color: '#f2910a' },
    packageColor: '#FBEFD9',
    textColor: '#F2910A',
  },
  platinum: {
    platformSlug: 'ksa',
    icon: 'IconPkgPlatinum',
    iconProps: { color: '#5c7bdd' },
    packageColor: '#E7F3FB',
    textColor: '#5CB2F8',
  },
  'platinum-plus': {
    type: 'platinum-plus',
    platformSlug: 'ksa',
    icon: 'IconPkgPlatinumPlus',
    iconProps: { color: '#cfae19' },
    packageColor: '#FFD1002B',
    textColor: '#DFBC21',
  },
  starter: {
    type: 'starter',
    platformSlug: 'ksa',
    icon: 'IconPkgStarter',
    iconProps: { color: '#53c18a' },
    packageColor: '#44C1812B',
    textColor: '#32BF77',
  },
  'starter-pro': {
    type: 'starter-pro',
    platformSlug: 'ksa',
    icon: 'IconPkgStarterPro',
    iconProps: { color: '#479eeb' },
    packageColor: '#A97BEA2B',
    textColor: '#A97BEA',
  },
};
