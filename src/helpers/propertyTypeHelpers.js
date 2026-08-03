/**
 * Helper function to get icon for property type based on name
 * @param {string} propertyTypeName - The name of the property type
 * @returns {string|null} - Icon name or default icon if not found
 */
export const getPropertyTypeIcon = (propertyTypeName) => {
  if (!propertyTypeName) return null;

  // Normalize the name for matching (handle both English and Arabic names)
  const normalizedName = propertyTypeName.trim();

  // Map property type names to icons (matching the icons from listingTypes.js)
  const iconMap = {
    'Residential': 'HiOutlineBuildingOffice2',
    'House': 'IconPropertyBuy',
    'Flat': 'IconFlats',
    'Upper Portion': 'IconUpperPortions',
    'Lower Portion': 'IconLowerPortions',
    'Farm House': 'IconFarmHouses',
    'Room': 'IconRooms',
    'Penthouse': 'IconPenthouse',
    'Residential Plot': 'IconResidentialPlots',
    'Commercial Plot': 'IconCommercialPlots',
    'Agricultural Land': 'IconAgriculturalLand',
    'Residential Lands': 'IconResidentialPlots',
    'Plot File': 'IconPlotFiles',
    'Plot Form': 'IconPlotForms',
    'Office': 'IconOffices',
    'Shop': 'IconShops',
    // IconWarehouse is not registered (only IconWarehouses exists); match Palace/Studio fallback in this map.
    'Warehouse': 'BiBuildingHouse',
    'Factory': 'IconFactory',
    'Building': 'IconBuildings',
    'Other': 'IconCommercialOthers',
    'Floor': 'FaRegBuilding',
    'Apartment': 'ApartmentIcon',
    'Villas': 'VillaIcon',
    'Villa': 'VillaIcon',
    'Chalets': 'ChaletIcon',
    'Chalet': 'ChaletIcon',
    'Rest House': 'GuestHouseIcon',
    'Resort': 'ResortIcon',
    'Commercial Buildings': 'BsBuilding',
    'Commercial': 'HiOutlineOfficeBuilding',
    'Garage': 'PiGarageDuotone',
    'Other Commercial': 'MdStoreMallDirectory',
    'Townhouse': 'LiaWarehouseSolid',
    'Showrooms': 'PiBuildingOfficeThin',
  };

  // Try exact match first
  if (iconMap[normalizedName]) {
    return iconMap[normalizedName];
  }

  // Try case-insensitive match
  const lowerName = normalizedName.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (key.toLowerCase() === lowerName) {
      return icon;
    }
  }

  // Default icon if no match found
  return 'BiBuildingHouse';
};

/**
 * Helper function to get icon for purpose based on purpose value
 * @param {string} purposeValue - The purpose value (e.g., 'Sale', 'Rent', 'Sell')
 * @returns {string|null} - Icon name or default icon if not found
 */
export const getPurposeIcon = (purposeValue) => {
  if (!purposeValue) return null;

  // Normalize the value for matching (handle both English variations)
  const normalizedValue = purposeValue.trim();
  const lowerValue = normalizedValue.toLowerCase();

  // Map purpose values to icons (matching the icons from purposeList)
  // 'Sale' or 'Sell' → 'IconPropertyBuy'
  // 'Rent' → 'IconPropertyRent'
  if (lowerValue === 'sale' || lowerValue === 'sell') {
    return 'IconPropertyBuy';
  }

  if (lowerValue === 'rent') {
    return 'IconPropertyRent';
  }

  // Default icon if no match found
  return 'MdOutlineCheckCircle';
};
