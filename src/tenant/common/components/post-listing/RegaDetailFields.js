import tenantUtils from '@utils';
import { List, Typography } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Title } from '../../../../components/common/popup/style';
import { regaInformationClickEvent } from '../../../../services/analyticsService';
import { ListViewStyled } from './styled';

const RegaDetailFields = ({ listing }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { user } = useSelector((state) => state.app.loginUser);

  const { t } = useTranslation();

  useEffect(() => {
    regaInformationClickEvent(user);
  }, []);

  const data = useMemo(() => {
    return [
      {
        label: t('License Info'),
        keys: [
          {
            label: t('FAL License no.'),
            value: tenantUtils.getLocalisedString(listing?.rega_details?.license_info, 'fal_license_number'),
          },
          {
            label: t('Created date'),
            value: tenantUtils.getLocalisedString(listing?.rega_details?.license_info, 'start_date'),
          },
          {
            label: t('Expiry Date'),
            value: tenantUtils.getLocalisedString(listing?.rega_details?.license_info, 'end_date'),
          },
        ],
      },
      {
        label: t('Location'),
        keys: [
          { label: t('Region'), value: tenantUtils.getLocalisedString(listing?.rega_details?.location, 'region') },
          { label: t('City'), value: listing?.rega_details?.location?.city },
          { label: t('District'), value: listing?.rega_details?.location?.district },
          { label: t('Street name'), value: listing?.rega_details?.location?.street_name },
          { label: t('Postal Code'), value: listing?.rega_details?.location?.postal_code },
          { label: t('Building no.'), value: listing?.rega_details?.location?.building_number },
          { label: t('Additional no.'), value: listing?.rega_details?.location?.additional_number },
          { label: t('Latitude'), value: listing?.latitude },
          { label: t('Longitude'), value: listing?.longitude },
        ],
      },
      {
        label: t('Property Specs'),
        keys: [
          {
            label: t('Ad type'),
            value: tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'advertisement_type'),
          },
          {
            label: t('Property usage'),
            value: tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'listing_usage'),
          },
          {
            label: t('Property Type'),
            value: tenantUtils.getLocalisedString(listing?.rega_details?.property_specs, 'listing_type'),
          },
          { label: t('Area size'), value: `${listing?.area_unit?.value} Sqm` },
          { label: t('No.of rooms'), value: listing?.rega_details?.property_specs?.number_of_rooms },
        ],
      },
      {
        label: t('Utilities'),
        keys: [
          { label: t('Electricty'), value: !!listing?.rega_details?.utilities?.Electricity ? t('Yes') : t('No') },
          { label: t('Sanitation'), value: !!listing?.rega_details?.utilities?.Sewerage ? t('Yes') : t('No') },
          { label: t('Water'), value: !!listing?.rega_details?.utilities?.['Water Supply'] ? t('Yes') : t('No') },
        ],
      },
      {
        label: t('Additional Info'),
        keys: [
          {
            label: t('Property age'),
            value: tenantUtils.getLocalisedString(listing?.rega_details?.additional_info, 'listing_age'),
          },
          { label: t('Street width'), value: listing?.rega_details?.additional_info?.street_width },
          { label: t('Plan no'), value: listing?.rega_details?.additional_info?.plan_number },
          { label: t('Deed no.'), value: listing?.rega_details?.additional_info?.deed_number },
          {
            label: t('Property Facade'),
            value: tenantUtils.getLocalisedString(listing?.rega_details?.additional_info, 'listing_face'),
          },
          { label: t('Border & lengths'), value: listing?.rega_details?.additional_info?.borders_and_lengths },
          {
            label: t('Guarantees or Duration'),
            value: listing?.rega_details?.additional_info?.guarantees_and_duration,
          },
          // { label:t("Arabic or English Title"), value: 'PENDING' },
          { label: t('Channels'), value: listing?.rega_details?.additional_info?.channels?.join(', ') },
          {
            label: t('Any obligations on property'),
            value: listing?.rega_details?.additional_info?.obligations_on_listing,
          },
          // { label: t('Features and Amenities'), value: listing?.listing_features?.length ? t('Yes') : t('No') },
          {
            label: t('Compliance with Saudi building'),
            value: listing?.rega_details?.additional_info?.compliance_with_saudi_building_code ? t('Yes') : t('No'),
          },
          {
            label: t('Property is pawned'),
            value: listing?.rega_details?.additional_info?.is_listing_pawned ? t('Yes') : t('No'),
          },
          // { label: t('Residence Type'), value: t('PENDING') },
          {
            label: t('Property is Constrained'),
            value: listing?.rega_details?.additional_info?.is_listing_constrained ? t('Yes') : t('No'),
          },
        ],
      },
    ];
  }, [listing]);

  return (
    <>
      {data.map((item) => (
        <div key={item.label}>
          <Title>
            <strong>{item.label}</strong>
          </Title>
          <ListViewStyled
            className="mb-16"
            style={{ '--grid-template': isMobile ? '1fr 1fr' : '1fr 1fr 1fr', '--grid-gap': '0 20px' }}
          >
            {item.keys.map((key) => (
              <List.Item
                key={key.label}
                className="px-0 grid"
                style={{ '--template': isMobile ? '1fr' : '1fr 1fr', '--gap': isMobile ? '0' : '8px' }}
              >
                <Typography.Text className="text-muted">{key?.label}</Typography.Text>
                <div className="semiBold">{key?.value}</div>
              </List.Item>
            ))}
          </ListViewStyled>
        </div>
      ))}
    </>
  );
};

export default RegaDetailFields;
