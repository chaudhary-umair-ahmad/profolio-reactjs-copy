import tenantUtils from '@utils';
import tenantConstants from '@constants';
const getPropertyTypeIcon = (propertyType) => {
  switch (propertyType) {
    case 'Residential':
      return 'HiOutlineBuildingOffice2';
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
    case 'Residential Lands':
      return 'IconResidentialPlots';
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
    case 'Floor':
      return 'FaRegBuilding';
    case 'Apartment':
      return 'ApartmentIcon';
    case 'Villas':
      return 'VillaIcon';
    case 'Chalets':
      return 'ChaletIcon';
    case 'Rest House':
      return 'GuestHouseIcon';
    case 'Resort':
      return 'ResortIcon';
    case 'Commercial Buildings':
      return 'BsBuilding';
    case 'Commercial':
      return 'HiOutlineOfficeBuilding';
    case 'Garage':
      return 'PiGarageDuotone';
    case 'Other Commercial':
      return 'MdStoreMallDirectory';
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
      // {
      //   id: 1,
      //   display_order: 1,
      //   htaccess: 'residential',
      //   slug_sale: '',
      //   slug_rent: '',
      //   parent_id: 1,
      //   title: {
      //     en: 'Residential',
      //     ar: 'سكني',
      //   },
      //   alternate_title: {
      //     en: 'Residential',
      //     ar: 'سكني',
      //   },
      //   meta_value: {
      //     en: 'Residential',
      //     ar: 'residential',
      //   },
      // },
      // {
      //   id: 2,
      //   display_order: 2,
      //   htaccess: 'commercial',
      //   slug_sale: '',
      //   slug_rent: '',
      //   parent_id: 1,
      //   title: {
      //     en: 'Commercial',
      //     ar: 'تجاري',
      //   },
      //   alternate_title: {
      //     en: 'Commercial',
      //     ar: 'تجاري',
      //   },
      //   meta_value: {
      //     en: 'Commercial',
      //     ar: 'commercial',
      //   },
      // },
      {
        id: 3,
        display_order: 3,
        htaccess: 'apartment',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Apartment',
          ar: 'شقق',
        },
        alternate_title: {
          en: 'Apartment',
          ar: 'شقق',
        },
        meta_value: {
          en: 'Apartment',
          ar: 'apartment',
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
        id: 5,
        display_order: 5,
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
        id: 7,
        display_order: 6,
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
        id: 8,
        display_order: 7,
        htaccess: 'garage',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
        title: {
          en: 'Garage',
          ar: 'تجاري',
        },
        alternate_title: {
          en: 'Garage',
          ar: 'تجاري',
        },
        meta_value: {
          en: 'garage',
          ar: 'تجاري',
        },
      },
      {
        id: 9,
        display_order: 8,
        htaccess: 'commercial-buildings',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
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
        id: 10,
        display_order: 9,
        htaccess: 'commercial-properties',
        slug_sale: '',
        slug_rent: '',
        parent_id: 1,
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
      // {
      //   id: 1,
      //   display_order: 1,
      //   htaccess: 'residential',
      //   slug_sale: '',
      //   slug_rent: '',
      //   parent_id: 1,
      //   title: {
      //     en: 'Residential',
      //     ar: 'سكني',
      //   },
      //   alternate_title: {
      //     en: 'Residential',
      //     ar: 'سكني',
      //   },
      //   meta_value: {
      //     en: 'Residential',
      //     ar: 'residential',
      //   },
      // },
      // {
      //   id: 2,
      //   display_order: 2,
      //   htaccess: 'commercial',
      //   slug_sale: '',
      //   slug_rent: '',
      //   parent_id: 1,
      //   title: {
      //     en: 'Commercial',
      //     ar: 'تجاري',
      //   },
      //   alternate_title: {
      //     en: 'Commercial',
      //     ar: 'تجاري',
      //   },
      //   meta_value: {
      //     en: 'Commercial',
      //     ar: 'commercial',
      //   },
      // },
      {
        id: 3,
        display_order: 3,
        htaccess: 'apartment',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Apartment',
          ar: 'شقق',
        },
        alternate_title: {
          en: 'Apartment',
          ar: 'شقق',
        },
        meta_value: {
          en: 'Apartment',
          ar: 'apartment',
        },
      },
      {
        id: 4,
        display_order: 4,
        htaccess: 'villas',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
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
        id: 5,
        display_order: 5,
        htaccess: 'chalets',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
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
        id: 7,
        display_order: 6,
        htaccess: 'residential-lands',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
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
        id: 8,
        display_order: 7,
        htaccess: 'garage',
        slug_sale: '',
        slug_rent: '',
        parent_id: 2,
        title: {
          en: 'Garage',
          ar: 'احترافي',
        },
        alternate_title: {
          en: 'Garage',
          ar: 'احترافي',
        },
        meta_value: {
          en: 'Garage',
          ar: 'garage',
        },
      },
      {
        id: 9,
        display_order: 8,
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
        id: 10,
        display_order: 9,
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
        ...(tenantConstants.ROOM_PROPERTY_TYPE_ENABLED ? [{
          id: 11,
          display_order: null,
          htaccess: 'room',
          slug_sale: '',
          slug_rent: '',
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
        }] : []),

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
];

export const listingTypes = (skipIds = [], locale) =>
  propertyTypes.map((e) => ({
    ...e,
    sub_types: e.sub_types
      .filter((it) => !skipIds.find((item) => item == it.id))
      .map((it) => ({
        ...it,
        title: it?.title,
        icon: getPropertyTypeIcon(tenantUtils.getLocalisedString(it, 'title')),
      })),
  }));

export default { listingTypes };
