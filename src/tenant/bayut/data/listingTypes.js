import { getLocalisedString } from '../utils/utilities';
const getPropertyTypeIcon = (propertyType) => {
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
    case 'Offices':
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
    case 'Floor':
      return 'FaRegBuilding';
    case 'Apartment':
      return 'ApartmentIcon';
    case 'Villa':
      return 'VillaIcon';
    case 'Chalet':
      return 'ChaletIcon';
    case 'Rest House':
      return 'GuestHouseIcon';
    case 'Resort':
      return 'ResortIcon';
    case 'Townhouse':
      return 'LiaWarehouseSolid';
    case 'Showrooms':
      return 'PiBuildingOfficeThin';
    case 'Residential Lands':
      return 'MdOutlineHomeWork';
    default:
      return null;
  }
};

const propertyTypes = [
  {
    id: 1,
    display_order: 1,
    // title: 'Residential',
    meta_title: 'Residential',
    // alternate_title: 'Residential',
    slug_sale: 'Residential',
    slug_rent: '',
    sub_types: [
      {
        id: 3,
        display_order: 3,
        htaccess: 'apartments',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Apartments',
          ar: 'شقق',
        },
        alternate_title: {
          en: 'Apartment',
          ar: 'شقة',
        },
        meta_value: {
          en: 'Apartments',
          ar: 'apartments',
        },
      },
      {
        id: 4,
        display_order: 4,
        htaccess: 'villas',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Villas',
          ar: 'فلل',
        },
        alternate_title: {
          en: 'Villa',
          ar: 'فيلا',
        },
        meta_value: {
          en: 'Villas',
          ar: 'villas',
        },
      },
      {
        id: 6,
        display_order: 6,
        htaccess: 'residential-floors',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Floors',
          ar: 'ادوار',
        },
        alternate_title: {
          en: 'Floor',
          ar: 'دور',
        },
        meta_value: {
          en: 'Floors',
          ar: 'residential-floors',
        },
      },
      {
        id: 7,
        display_order: 7,
        htaccess: 'hotel-apartments',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Hotel Apartments',
          ar: 'شقق فندقية',
        },
        alternate_title: {
          en: 'Hotel Apartment',
          ar: 'شقة فندقية',
        },
        meta_value: {
          en: 'Hotel Apartments',
          ar: 'hotel-apartments',
        },
      },
      {
        id: 8,
        display_order: 8,
        htaccess: 'residential-buildings',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Residential Buildings',
          ar: 'عمائر سكنية',
        },
        alternate_title: {
          en: 'Residential Building',
          ar: 'عمارة سكنية',
        },
        meta_value: {
          en: 'Residential Buildings',
          ar: 'residential-buildings',
        },
      },
      {
        id: 9,
        display_order: 9,
        htaccess: 'residential-lands',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Residential Lands',
          ar: 'اراضي سكنية',
        },
        alternate_title: {
          en: 'Residential Land',
          ar: 'ارض سكنية',
        },
        meta_value: {
          en: 'Residential Lands',
          ar: 'residential-lands',
        },
      },
      {
        id: 10,
        display_order: 10,
        htaccess: 'house',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Houses',
          ar: 'بيوت شعبية',
        },
        alternate_title: {
          en: 'House',
          ar: 'بيت شعبي',
        },
        meta_value: {
          en: 'Houses',
          ar: 'بيوت شعبية',
        },
      },
      {
        id: 11,
        display_order: 11,
        htaccess: 'rest-houses',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Rest Houses',
          ar: 'استراحات',
        },
        alternate_title: {
          en: 'Rest House',
          ar: 'إستراحة',
        },
        meta_value: {
          en: 'Rest Houses',
          ar: 'rest-houses',
        },
      },
      {
        id: 12,
        display_order: 12,
        htaccess: 'chalets',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Chalets',
          ar: 'شاليهات',
        },
        alternate_title: {
          en: 'Chalet',
          ar: 'شاليه',
        },
        meta_value: {
          en: 'Chalets',
          ar: 'chalets',
        },
      },
      {
        id: 13,
        display_order: 13,
        htaccess: 'labour-camps',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Labour Camps',
          ar: 'مساكن عمال',
        },
        alternate_title: {
          en: 'Labour Camp',
          ar: 'سكن عمال',
        },
        meta_value: {
          en: 'Labour Camps',
          ar: 'labour-camps',
        },
      },
      {
        id: 24,
        display_order: 24,
        htaccess: 'hotel-room',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Hotel Rooms',
          ar: 'غرفة فندقية',
        },
        alternate_title: {
          en: 'Hotel Room',
          ar: 'غرفة فندقية',
        },
        meta_value: {
          en: 'Hotel Rooms',
          ar: 'غرفة فندقية',
        },
      },
      {
        id: 25,
        display_order: 25,
        htaccess: 'palace',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Palaces',
          ar: 'قصور',
        },
        alternate_title: {
          en: 'Palace',
          ar: 'قصر',
        },
        meta_value: {
          en: 'Palaces',
          ar: 'قصور',
        },
      },
      {
        id: 26,
        display_order: null,
        htaccess: 'studio',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Studio',
          ar: 'شقَّة صغيرة (استوديو)',
        },
        alternate_title: {
          en: 'Studio',
          ar: 'شقَّة صغيرة (استوديو)',
        },
        meta_value: {
          en: 'studio',
          ar: 'شقَّة صغيرة (استوديو)',
        },
      },
      {
        id: 27,
        display_order: null,
        htaccess: 'room',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Room',
          ar: 'غرفة',
        },
        alternate_title: {
          en: 'Room',
          ar: 'غرفة',
        },
        meta_value: {
          en: 'room',
          ar: 'غرفة',
        },
      },
      {
        id: 42,
        display_order: null,
        htaccess: 'land',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Land',
          ar: 'أرض',
        },
        alternate_title: {
          en: 'Land',
          ar: 'ارض ',
        },
        meta_value: {
          en: 'land',
          ar: 'أرض',
        },
      },
      {
        id: 43,
        display_order: null,
        htaccess: 'building',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Building',
          ar: 'عمارة',
        },
        alternate_title: {
          en: 'Building',
          ar: 'عمارة',
        },
        meta_value: {
          en: 'building',
          ar: 'عمارة',
        },
      },
    ],
    title: {
      en: 'Residential',
      ar: 'سكني',
    },
    alternate_title: {
      en: 'Residential',
      ar: 'سكني',
    },
    meta_value: {
      en: 'Residential',
      ar: 'residential',
    },
  },
  {
    id: 2,
    display_order: 2,
    htaccess: 'commercial',
    slug_sale: '',
    slug_rent: '',
    parent_id: null,
    sub_types: [
      {
        id: 14,
        display_order: 14,
        htaccess: 'offices',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Offices',
          ar: 'مكاتب',
        },
        alternate_title: {
          en: 'Offices',
          ar: 'مكتب',
        },
        meta_value: {
          en: 'Offices',
          ar: 'مكاتب',
        },
      },
      {
        id: 15,
        display_order: 15,
        htaccess: 'shops',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Shops',
          ar: 'محلات تجارية',
        },
        alternate_title: {
          en: 'Shop',
          ar: 'محل تجاري',
        },
        meta_value: {
          en: 'Shops',
          ar: 'shops',
        },
      },
      {
        id: 16,
        display_order: 16,
        htaccess: 'showrooms',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Showrooms',
          ar: 'صالات عرض',
        },
        alternate_title: {
          en: 'Showroom',
          ar: 'صالة عرض',
        },
        meta_value: {
          en: 'Showrooms',
          ar: 'showrooms',
        },
      },
      {
        id: 17,
        display_order: 17,
        htaccess: 'commercial-buildings',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Commercial Buildings',
          ar: 'عمائر تجارية',
        },
        alternate_title: {
          en: 'Commercial Building',
          ar: 'عمارة تجارية',
        },
        meta_value: {
          en: 'Commercial Buildings',
          ar: 'commercial-buildings',
        },
      },
      {
        id: 18,
        display_order: 18,
        htaccess: 'warehouses',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Warehouses',
          ar: 'مستودعات',
        },
        alternate_title: {
          en: 'Warehouse',
          ar: 'مستودع',
        },
        meta_value: {
          en: 'Warehouses',
          ar: 'warehouses',
        },
      },
      {
        id: 19,
        display_order: 19,
        htaccess: 'commercial-lands',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Commercial Lands',
          ar: 'اراضي تجارية',
        },
        alternate_title: {
          en: 'Commercial Land',
          ar: 'ارض تجارية',
        },
        meta_value: {
          en: 'Commercial Lands',
          ar: 'commercial-lands',
        },
      },
      {
        id: 20,
        display_order: 20,
        htaccess: 'industrial-lands',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Industrial Lands',
          ar: 'اراضي صناعية',
        },
        alternate_title: {
          en: 'Industrial Land',
          ar: 'ارض صناعية',
        },
        meta_value: {
          en: 'Industrial Lands',
          ar: 'industrial-lands',
        },
      },
      {
        id: 21,
        display_order: 21,
        htaccess: 'farms',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Farms',
          ar: 'مزارع',
        },
        alternate_title: {
          en: 'Farm',
          ar: 'مزرعة',
        },
        meta_value: {
          en: 'Farms',
          ar: 'farms',
        },
      },
      {
        id: 22,
        display_order: 22,
        htaccess: 'commercial-properties',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Other Commercial',
          ar: 'عقارات تجارية اخرى',
        },
        alternate_title: {
          en: 'Other Commercial',
          ar: 'عقارات تجارية اخرى',
        },
        meta_value: {
          en: 'Other Commercial',
          ar: 'commercial-properties',
        },
      },
      {
        id: 23,
        display_order: 23,
        htaccess: 'agriculture-plots',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Agriculture Plots',
          ar: 'اراضي زراعية',
        },
        alternate_title: {
          en: 'Agriculture Plot',
          ar: 'ارض زراعية',
        },
        meta_value: {
          en: 'Agriculture Plots',
          ar: 'agriculture-plots',
        },
      },
      {
        id: 28,
        display_order: null,
        htaccess: 'complex',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Complex',
          ar: 'مجمع',
        },
        alternate_title: {
          en: 'Complex',
          ar: 'مجمع',
        },
        meta_value: {
          en: 'complex',
          ar: 'مجمع',
        },
      },
      {
        id: 29,
        display_order: null,
        htaccess: 'tower',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Tower',
          ar: 'برج',
        },
        alternate_title: {
          en: 'Tower',
          ar: 'برج',
        },
        meta_value: {
          en: 'tower',
          ar: 'برج',
        },
      },
      {
        id: 30,
        display_order: null,
        htaccess: 'booth',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Booth',
          ar: 'كشك',
        },
        alternate_title: {
          en: 'Booth',
          ar: 'كشك',
        },
        meta_value: {
          en: 'booth',
          ar: 'كشك',
        },
      },
      {
        id: 31,
        display_order: null,
        htaccess: 'cinema',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Cinema',
          ar: 'سينما',
        },
        alternate_title: {
          en: 'Cinema',
          ar: 'سينما',
        },
        meta_value: {
          en: 'cinema',
          ar: 'سينما',
        },
      },
      {
        id: 32,
        display_order: null,
        htaccess: 'hotel',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Hotel',
          ar: 'فندق',
        },
        alternate_title: {
          en: 'Hotel',
          ar: 'فندق',
        },
        meta_value: {
          en: 'hotel',
          ar: 'فندق',
        },
      },
      {
        id: 33,
        display_order: null,
        htaccess: 'parkings',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Parkings',
          ar: 'مواقف سيارات',
        },
        alternate_title: {
          en: 'Parkings',
          ar: 'مواقف سيارات',
        },
        meta_value: {
          en: 'parkings',
          ar: 'مواقف سيارات',
        },
      },
      {
        id: 34,
        display_order: null,
        htaccess: 'workshop',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Workshop',
          ar: 'ورشة',
        },
        alternate_title: {
          en: 'Workshop',
          ar: 'ورشة',
        },
        meta_value: {
          en: 'workshop',
          ar: 'ورشة',
        },
      },
      {
        id: 35,
        display_order: null,
        htaccess: 'atm',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'ATM',
          ar: 'صراف',
        },
        alternate_title: {
          en: 'ATM',
          ar: 'صراف',
        },
        meta_value: {
          en: 'atm',
          ar: 'صراف',
        },
      },
      {
        id: 36,
        display_order: null,
        htaccess: 'factory',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Factory',
          ar: 'مصنع',
        },
        alternate_title: {
          en: 'Factory',
          ar: 'مصنع',
        },
        meta_value: {
          en: 'factory',
          ar: 'مصنع',
        },
      },
      {
        id: 37,
        display_order: null,
        htaccess: 'school',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'School',
          ar: 'مدرسة',
        },
        alternate_title: {
          en: 'School',
          ar: 'مدرسة',
        },
        meta_value: {
          en: 'school',
          ar: 'مدرسة',
        },
      },
      {
        id: 38,
        display_order: null,
        htaccess: 'health-center',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Hospital',
          ar: 'مستشفى',
        },
        alternate_title: {
          en: 'Health Center',
          ar: 'ركز صحي',
        },
        meta_value: {
          en: 'hospital_healthcenter',
          ar: 'مستشفى',
        },
      },
      {
        id: 39,
        display_order: null,
        htaccess: 'electricity-station',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Electricity Station',
          ar: 'محطة كهرباء',
        },
        alternate_title: {
          en: 'Electricity Station',
          ar: 'محطة كهرباء',
        },
        meta_value: {
          en: 'electricity_station',
          ar: 'محطة كهرباء',
        },
      },
      {
        id: 40,
        display_order: null,
        htaccess: 'telecom-tower',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Telecom Tower',
          ar: 'برج اتصالات',
        },
        alternate_title: {
          en: 'Telecom Tower',
          ar: 'برج اتصالات',
        },
        meta_value: {
          en: 'telecom_tower',
          ar: 'برج اتصالات',
        },
      },
      {
        id: 41,
        display_order: null,
        htaccess: 'gas-station',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Gas Station',
          ar: 'محطة',
        },
        alternate_title: {
          en: 'Gas Station',
          ar: 'محطة',
        },
        meta_value: {
          en: 'gas_station',
          ar: 'محطة',
        },
      },
      {
        id: 44,
        display_order: null,
        htaccess: 'exhibition-building',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Exhibition Building',
          ar: 'معرض',
        },
        alternate_title: {
          en: 'Exhibition Building',
          ar: 'معرض',
        },
        meta_value: {
          en: 'Exhibition Building',
          ar: 'معرض',
        },
      },
    ],
    title: {
      en: 'Commercial',
      ar: 'تجاري',
    },
    alternate_title: {
      en: 'Commercial',
      ar: 'تجاري',
    },
    meta_value: {
      en: 'Commercial',
      ar: 'commercial',
    },
  },
  {
    id: 4,
    display_order: 4,
    htaccess: 'dailyrental',
    slug_sale: '',
    slug_rent: '',
    parent_id: null,
    sub_types: [
      {
        id: 3,
        display_order: 3,
        htaccess: 'apartments',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Apartments',
          ar: 'شقق',
        },
        alternate_title: {
          en: 'Apartment',
          ar: 'شقة',
        },
        meta_value: {
          en: 'Apartments',
          ar: 'apartments',
        },
      },
      {
        id: 27,
        display_order: null,
        htaccess: 'room',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Room',
          ar: 'غرفة',
        },
        alternate_title: {
          en: 'Room',
          ar: 'غرفة',
        },
        meta_value: {
          en: 'room',
          ar: 'غرفة',
        },
      },
      {
        id: 4,
        display_order: 4,
        htaccess: 'villas',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Villas',
          ar: 'فلل',
        },
        alternate_title: {
          en: 'Villa',
          ar: 'فيلا',
        },
        meta_value: {
          en: 'Villas',
          ar: 'villas',
        },
      },
      // Daily Rentals: residential-floors (listing type id 6) omitted here; use Residential group for that type.
       // {
      //   id: 6,
      //   display_order: 6,
      //   htaccess: 'residential-floors',
      //   slug_sale: '',
      //   slug_rent: '',
      //   parent_id: 1,
      //   title: {
      //     en: 'Floor',
      //     ar: 'ادوار',
      //   },
      //   alternate_title: {
      //     en: 'Floor',
      //     ar: 'دور',
      //   },
      //   meta_value: {
      //     en: 'Floors',
      //     ar: 'residential-floors',
      //   },
      // },
      {
        id: 12,
        display_order: 12,
        htaccess: 'chalets',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Chalets',
          ar: 'شاليهات',
        },
        alternate_title: {
          en: 'Chalet',
          ar: 'شاليه',
        },
        meta_value: {
          en: 'Chalets',
          ar: 'chalets',
        },
      },
      {
        id: 11,
        display_order: 11,
        htaccess: 'rest-houses',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Rest Houses',
          ar: 'استراحات',
        },
        alternate_title: {
          en: 'Rest House',
          ar: 'استراحات',
        },
        meta_value: {
          en: 'Rest House',
          ar: 'Rest House',
        },
      },
      // {
      //   id: 45,
      //   display_order: 45,
      //   htaccess: 'resort',
      //   slug_sale: '',
      //   slug_rent: '',
      //   parent_id: 1,
      //   title: {
      //     en: 'Resort',
      //     ar: 'منتجع',
      //   },
      //   alternate_title: {
      //     en: 'Resort',
      //     ar: 'منتجع',
      //   },
      //   meta_value: {
      //     en: 'Resort',
      //     ar: 'Resort',
      //   },
      // },
    ],
    title: {
      en: 'Daily Rentals',
      ar: 'تجاري',
    },
    alternate_title: {
      en: 'Daily Rentals',
      ar: 'تجاري',
    },
    meta_value: {
      en: 'Daily Rental',
      ar: 'dailyrental',
    },
  },
  // {
  //   id: 5,
  //   display_order: 4,
  //   htaccess: 'offplans',
  //   slug_sale: '',
  //   slug_rent: '',
  //   parent_id: null,
  //   sub_types: [
  //     {
  //       id: 3,
  //       display_order: 3,
  //       htaccess: 'apartments',
  //       slug_sale: '',
  //       slug_rent: '',
  //       parent_id: 1,
  //       title: {
  //         en: 'Apartments',
  //         ar: 'شقق',
  //       },
  //       alternate_title: {
  //         en: 'Apartment',
  //         ar: 'شقة',
  //       },
  //       meta_value: {
  //         en: 'Apartments',
  //         ar: 'apartments',
  //       },
  //     },
  //     {
  //       id: 4,
  //       display_order: 4,
  //       htaccess: 'villas',
  //       slug_sale: '',
  //       slug_rent: '',
  //       parent_id: 1,
  //       title: {
  //         en: 'Villas',
  //         ar: 'فلل',
  //       },
  //       alternate_title: {
  //         en: 'Villa',
  //         ar: 'فيلا',
  //       },
  //       meta_value: {
  //         en: 'Villas',
  //         ar: 'villas',
  //       },
  //     },
  //     {
  //       id: 6,
  //       display_order: 6,
  //       htaccess: 'residential-floors',
  //       slug_sale: '',
  //       slug_rent: '',
  //       parent_id: 1,
  //       title: {
  //         en: 'Floors',
  //         ar: 'ادوار',
  //       },
  //       alternate_title: {
  //         en: 'Floor',
  //         ar: 'دور',
  //       },
  //       meta_value: {
  //         en: 'Floors',
  //         ar: 'residential-floors',
  //       },
  //     },
  //     {
  //       id: 12,
  //       display_order: 12,
  //       htaccess: 'chalets',
  //       slug_sale: '',
  //       slug_rent: '',
  //       parent_id: 1,
  //       title: {
  //         en: 'Chalets',
  //         ar: 'شاليهات',
  //       },
  //       alternate_title: {
  //         en: 'Chalet',
  //         ar: 'شاليه',
  //       },
  //       meta_value: {
  //         en: 'Chalets',
  //         ar: 'chalets',
  //       },
  //     },
  //     {
  //       id: 9,
  //       display_order: 9,
  //       htaccess: 'residential-lands',
  //       slug_sale: '',
  //       slug_rent: '',
  //       parent_id: 1,
  //       title: {
  //         en: 'Residential Lands',
  //         ar: 'اراضي سكنية',
  //       },
  //       alternate_title: {
  //         en: 'Residential Land',
  //         ar: 'ارض سكنية',
  //       },
  //       meta_value: {
  //         en: 'Residential Lands',
  //         ar: 'residential-lands',
  //       },
  //     },
  //     {
  //       id: 14,
  //       display_order: 14,
  //       htaccess: 'offices',
  //       slug_sale: '',
  //       slug_rent: '',
  //       parent_id: 2,
  //       title: {
  //         en: 'Offices',
  //         ar: 'مكاتب',
  //       },
  //       alternate_title: {
  //         en: 'Offices',
  //         ar: 'مكتب',
  //       },
  //       meta_value: {
  //         en: 'Offices',
  //         ar: 'مكاتب',
  //       },
  //     },
  //     {
  //       id: 16,
  //       display_order: 16,
  //       htaccess: 'showrooms',
  //       slug_sale: '',
  //       slug_rent: '',
  //       parent_id: 2,
  //       title: {
  //         en: 'Showrooms',
  //         ar: 'صالات عرض',
  //       },
  //       alternate_title: {
  //         en: 'Showroom',
  //         ar: 'صالة عرض',
  //       },
  //       meta_value: {
  //         en: 'Showrooms',
  //         ar: 'showrooms',
  //       },
  //     },
  //     {
  //       id: 46,
  //       display_order: 46,
  //       htaccess: 'Townhouse',
  //       slug_sale: '',
  //       slug_rent: '',
  //       parent_id: 2,
  //       title: {
  //         en: 'Townhouse',
  //         ar: 'صالات عرض',
  //       },
  //       alternate_title: {
  //         en: 'Townhouse',
  //         ar: 'صالة عرض',
  //       },
  //       meta_value: {
  //         en: 'Townhouse',
  //         ar: 'townhouse',
  //       },
  //     },
  //   ],
  //   title: {
  //     en: 'Daily Rentals',
  //     ar: 'تجاري',
  //   },
  //   alternate_title: {
  //     en: 'Daily Rentals',
  //     ar: 'تجاري',
  //   },
  //   meta_value: {
  //     en: 'Daily Rental',
  //     ar: 'dailyrental',
  //   },
  // },
];

export const listingTypes = (skipIds = [], locale) =>
  propertyTypes.map((e) => ({
    ...e,
    sub_types: e.sub_types
      .filter((it) => !skipIds.find((item) => item == it.id))
      .map((it) => ({
        ...it,
        title: it?.title,
        icon: getPropertyTypeIcon(getLocalisedString(it, 'title')),
      })),
  }));

export default { listingTypes };
