import { AREA_UNIT } from './constants';
const getPropertyTypeIcon = propertyType => {
  switch (propertyType) {
    case 'House':
      return 'IconPropertyBuy';
    case 'Flat':
      return 'IconFlats';
    case 'Upper Portion':
      return 'IconUpperPortions';
    case 'Lower Portion':
      return 'IconLowerPortions';
    case 'Farm House':
      return 'IconFarmHouses';
    case 'Room':
      return 'IconRooms';
    case 'Penthouse':
      return 'IconPenthouse';
    case 'Residential Plot':
      return 'IconResidentialPlots';
    case 'Commercial Plot':
      return 'IconCommercialPlots';
    case 'Agricultural Land':
      return 'IconAgriculturalLand';
    case 'Industrial Land':
      return 'IconIndustrialLand';
    case 'Plot File':
      return 'IconPlotFiles';
    case 'Plot Form':
      return 'IconPlotForms';
    case 'Office':
      return 'IconOffices';
    case 'Shop':
      return 'IconShops';
    case 'Warehouse':
      return 'BiBuildingHouse';
    case 'Factory':
      return 'IconFactory';
    case 'Building':
      return 'IconBuildings';
    case 'Other':
      return 'IconCommercialOthers';

    default:
      return null;
  }
};

const propertyTypes = [
  {
    id: 1,
    title: 'Home',
    meta_title: 'Homes',
    alternate_title: 'Home',
    slug_sale: 'Homes',
    slug_rent: 'Rentals',
    sub_types: [
      {
        id: 9,
        title: 'House',
        meta_title: 'Houses Property',
        alternate_title: 'House',
        slug_sale: 'Houses_Property',
        slug_rent: 'Rentals_Houses_Property',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 8,
        title: 'Flat',
        meta_title: 'Flats Apartments',
        alternate_title: 'Flat',
        slug_sale: 'Flats_Apartments',
        slug_rent: 'Rentals_Flats_Apartments',
        slug_area_unit: AREA_UNIT.SQUARE_FEET,
      },
      {
        id: 21,
        title: 'Upper Portion',
        meta_title: 'Upper Portion',
        alternate_title: 'Upper Portion',
        slug_sale: 'Upper_Portions',
        slug_rent: 'Rentals_Upper_Portions',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 22,
        title: 'Lower Portion',
        meta_title: 'Lower Portion',
        alternate_title: 'Lower Portion',
        slug_sale: 'Lower_Portions',
        slug_rent: 'Rentals_Lower_Portions',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 20,
        title: 'Farm House',
        meta_title: 'Farm Houses',
        alternate_title: 'Farm House',
        slug_sale: 'Farm_Houses',
        slug_rent: 'Rentals_Farm_Houses',
        slug_area_unit: AREA_UNIT.KANAL,
      },
      {
        id: 24,
        title: 'Room',
        meta_title: 'Rooms',
        alternate_title: 'Room',
        slug_sale: 'Rooms',
        slug_rent: 'Rentals_Rooms',
        slug_area_unit: AREA_UNIT.SQUARE_FEET,
      },
      {
        id: 25,
        title: 'Penthouse',
        meta_title: 'Penthouse',
        alternate_title: 'Penthouse',
        slug_sale: 'Penthouse',
        slug_rent: 'Rentals_Penthouse',
        slug_area_unit: AREA_UNIT.SQUARE_FEET,
      },
    ],
  },
  {
    id: 2,
    title: 'Plots',
    meta_title: 'Plots',
    alternate_title: 'Plot',
    slug_sale: 'Plots',
    slug_rent: 'Rentals_Plots',
    sub_types: [
      {
        id: 12,
        title: 'Residential Plot',
        meta_title: 'Residential Plots',
        alternate_title: 'Residential Plot',
        slug_sale: 'Residential_Plots',
        slug_rent: 'Rentals_Residential_Plots',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 11,
        title: 'Commercial Plot',
        meta_title: 'Commercial Plots',
        alternate_title: 'Commercial Plot',
        slug_sale: 'Commercial_Plots',
        slug_rent: 'Rentals_Commercial_Plots',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 19,
        title: 'Agricultural Land',
        meta_title: 'Agricultural Land',
        alternate_title: 'Agricultural Land',
        slug_sale: 'Agricultural_Land',
        slug_rent: 'Rentals_Agricultural_Land',
        slug_area_unit: AREA_UNIT.KANAL,
      },
      {
        id: 27,
        title: 'Industrial Land',
        meta_title: 'Industrial Land',
        alternate_title: 'Industrial Land',
        slug_sale: 'Industrial_Land',
        slug_rent: 'Rentals_Industrial_Land',
        slug_area_unit: AREA_UNIT.KANAL,
      },
      {
        id: 23,
        title: 'Plot File',
        meta_title: 'Plot Files',
        alternate_title: 'Plot File',
        slug_sale: 'Plot_Files',
        slug_rent: 'Rentals_Plot_Files',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 26,
        title: 'Plot Form',
        meta_title: 'Plot Forms',
        alternate_title: 'Plot Form',
        slug_sale: 'Plot_Forms',
        slug_rent: 'Rentals_Plot_Forms',
        slug_area_unit: AREA_UNIT.MARLA,
      },
    ],
  },
  {
    id: 3,
    title: 'Commercial',
    meta_title: 'Commercial',
    alternate_title: 'Commercial',
    slug_sale: 'Commercial',
    slug_rent: 'Rentals_Commercial',
    sub_types: [
      {
        id: 13,
        title: 'Office',
        meta_title: 'Offices',
        alternate_title: 'Office',
        slug_sale: 'Offices',
        slug_rent: 'Rentals_Offices',
        slug_area_unit: AREA_UNIT.SQUARE_FEET,
      },
      {
        id: 15,
        title: 'Shop',
        meta_title: 'Retail Shops',
        alternate_title: 'Shop',
        slug_sale: 'Retail_Shops',
        slug_rent: 'Rentals_Retail_Shops',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 17,
        title: 'Warehouse',
        meta_title: 'Warehouses',
        alternate_title: 'Warehouse',
        slug_sale: 'Warehouses',
        slug_rent: 'Rentals_Warehouses',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 14,
        title: 'Factory',
        meta_title: 'Factories',
        alternate_title: 'Factory',
        slug_sale: 'Factories',
        slug_rent: 'Rentals_Factories',
        slug_area_unit: AREA_UNIT.KANAL,
      },
      {
        id: 16,
        title: 'Building',
        meta_title: 'Buildings',
        alternate_title: 'Building',
        slug_sale: 'Buildings',
        slug_rent: 'Rentals_Buildings',
        slug_area_unit: AREA_UNIT.MARLA,
      },
      {
        id: 18,
        title: 'Other',
        meta_title: 'Commercial Properties',
        alternate_title: 'Other',
        slug_sale: 'Other_Commercial_Properties',
        slug_rent: 'Rentals_Other_Commercial_Properties',
        slug_area_unit: AREA_UNIT.MARLA,
      },
    ],
  },
];

export const listingTypes = (skipIds = []) =>
  propertyTypes.map(e => ({
    ...e,
    sub_types: e.sub_types
      .filter(it => !skipIds.find(item => item == it.id))
      .map(it => ({ ...it, icon: getPropertyTypeIcon(it.title) })),
  }));
