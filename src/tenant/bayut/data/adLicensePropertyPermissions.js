// Property permissions based on property sub types
export const adLicensePropertyPermissions = {
  residential: {
    apartment: { property_age: true, bedrooms: true, area_size: true },
    villa: { property_age: true, bedrooms: true, area_size: true },
    floor: { property_age: true, bedrooms: true, area_size: true },
    residential_building: { property_age: true, bedrooms: true, area_size: true },
    residential_land: { property_age: false, bedrooms: false, area_size: true },
    land: { property_age: false, bedrooms: false, area_size: true },
    house: { property_age: true, bedrooms: true, area_size: true },
    rest_house: { property_age: true, bedrooms: true, area_size: true },
    chalet: { property_age: true, bedrooms: true, area_size: true },
    room: { property_age: true, bedrooms: false, area_size: true },
  },
  commercial: {
    office: { property_age: true, bedrooms: false, area_size: true },
    commercial_building: { property_age: true, bedrooms: false, area_size: true },
    warehouse: { property_age: true, bedrooms: false, area_size: true },
    commercial_land: { property_age: false, bedrooms: false, area_size: true },
    industrial_land: { property_age: false, bedrooms: false, area_size: true },
    farm: { property_age: true, bedrooms: true, area_size: true },
    agriculture_plot: { property_age: false, bedrooms: false, area_size: true },
    hotel: { property_age: true, bedrooms: true, area_size: true },
    workshop: { property_age: true, bedrooms: false, area_size: true },
    factory: { property_age: true, bedrooms: false, area_size: true },
    school: { property_age: true, bedrooms: false, area_size: true },
    health_centre: { property_age: true, bedrooms: true, area_size: true },
    gas_station: { property_age: true, bedrooms: false, area_size: true },
    exhibition_building: { property_age: true, bedrooms: false, area_size: true },
    land: { property_age: false, bedrooms: false, area_size: true },
  }
};

export const getAdLicensePropertyPermissions = (propertySubType) => {
  if (!propertySubType?.meta_value) return { property_age: true, bedrooms: true, area_size: true };
  
  const title = propertySubType.meta_value.toLowerCase().replace(/\s+/g, '_');
  
  if (adLicensePropertyPermissions.residential[title]) {
    return adLicensePropertyPermissions.residential[title];
  }
  
  if (adLicensePropertyPermissions.commercial[title]) {
    return adLicensePropertyPermissions.commercial[title];
  }
  
  return { property_age: true, bedrooms: true, area_size: true };
};