/**
 * Maps Surge `dynamic_field_options.slug` (features / add-amenities) to
 * `AmenitiesSvg` export names. Legacy `tenantData.amenities[id].svg` uses
 * different numeric ids; slug is stable across APIs.
 */
const FEATURE_AMENITY_ICON_BY_SLUG = {
  'balcony-or-terrace': 'SvgIcBalcony',
  'barbeque-area': 'SvgIcBarbeque',
  'double-glazed-windows': 'SvgIcWindows',
  'air-conditioned': 'SvgIcAc',
  'central-heating': 'SvgIcCentralHeating',
  'day-care-center': 'SvgIcDayCare',
  'electricity-backup': 'SvgIcElectricityBackup',
  'waste-disposal': 'SvgIcWasteDisposal',
  'first-aid-medical-center': 'SvgIcMedicalCenter',
  floor: 'SvgIcFloorNumber',
  'elevators-in-building': 'SvgIcElevators',
  'service-elevators': 'SvgIcServiceElevators',
  freehold: 'SvgIcFreeHold',
  'pet-policy': 'SvgIcPets',
  'gym-or-health-club': 'SvgIcGym',
  'fiber-coverage': 'SvgIcFiberCoverage',
  'smart-home-system': 'SvgIcSmartHomeSystem',
  'atm-facility': 'SvgIcAtm',
  jacuzzi: 'SvgIcJacuzzi',
  'kids-play-area': 'SvgIcPlayArea',
  'lawn-or-garden': 'SvgIcGarden',
  'maids-room': 'SvgIcMaid',
  sauna: 'SvgIcSauna',
  'steam-room': 'SvgIcSteamRoom',
  'swimming-pool': 'SvgIcSwimming',
  'nearby-schools': 'SvgIcSchool',
  'nearby-hospitals': 'SvgIcHospitals',
  'nearby-shopping-malls': 'SvgIcShoppingMall',
  'maintenance-staff': 'SvgIcMaintenanceStaff',
  'security-staff': 'SvgIcSecurity',
  'cctv-security': 'SvgIcCctv',
  'cafeteria-or-canteen': 'SvgIcCafeteria',
  'laundry-facility': 'SvgIcLaundaryFacility',
  'facilities-for-disabled': 'SvgIcDisabled',
  'parking-spaces': 'SvgIcParkingSpace',
  'storage-areas': 'SvgIcStorageArea',
  '24-hours-concierge': 'SvgIcConcierge',
  'cleaning-services': 'SvgIcCleaningService',
  'close-to-metro-station': 'SvgIcMetroStation',
  'basement-parking': 'SvgIcParking',
  'close-to-main-roads': 'SvgIcCloseToMainRoad',
  'private-garage': 'SvgIcPrivateGarage',
  'nearby-mosque': 'SvgIcMosque',
  'valet-service': 'SvgIcValetService',
  playdium: 'SvgIcPlaydium',
  basement: 'SvgIcBasement',
  'guest-room': 'SvgIcGuestRoom',
  'fireplace-utility': 'SvgIcFirePlace',
  'private-entrance': 'SvgIcPrivateEntrance',
  electricity: 'SvgIcElectricity',
  'water-supply': 'SvgIcWater',
  sewerage: 'SvgIcSanitation',
  'fixed-phone': 'SvgIcFixedPhone',
  'flood-drainage': 'SvgIcFloodDrainage',
  'yoga-studio': 'SvgIcYogaStudio',
  'beauty-center-spa': 'SvgIcBeautyCenterSpa',
  'social-lounges': 'SvgIcSocialLounges',
  'coffee-corner': 'SvgIcCoffeeCorner',
  'family-entertainment-areas': 'SvgIcFamilyEntertainmentAreas',
  'kids-activity-zones': 'SvgIcKidsActivityZones',
  cinema: 'SvgIcCinema',
  'gaming-vr-zone': 'SvgIcGamingVrZone',
  billiards: 'SvgIcBilliards',
  'table-tennis': 'SvgIcTableTennis',
  'meeting-events-rooms': 'SvgIcMeetingEventsRooms',
  'reception-concierge-areas': 'SvgIcReceptionConciergeAreas',
  'co-working-study-spaces': 'SvgIcCoWorkingStudySpaces',
  'reading-library-quiet-zones': 'SvgIcReadingLibraryQuietZones',
};

const FALLBACK_ICON = 'MdIndeterminateCheckBox';

/**
 * @param {Record<string, { svg?: string }>|undefined} legacyAmenities - e.g. tenantData.amenities
 * @param {string|number} optionId - field key / option id
 * @param {string|null|undefined} slug - dynamic_field_options.slug
 * @returns {string} Icon component name for `<Icon icon={...} />`
 */
export const getFeatureAmenityIconName = (legacyAmenities, optionId, slug) => {
  const legacy =
    legacyAmenities && optionId != null
      ? legacyAmenities[optionId] ?? legacyAmenities[String(optionId)]
      : undefined;
  if (legacy?.svg) return legacy.svg;
  if (slug && FEATURE_AMENITY_ICON_BY_SLUG[slug]) return FEATURE_AMENITY_ICON_BY_SLUG[slug];
  return FALLBACK_ICON;
};
