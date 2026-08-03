import tenantUtils from '@utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Algolia from '../../services/algolia';
import { SelectSearch } from '../common';
import tenantConstants from '@constants';

const CityLocationFilter = (props) => {
  const { subList, filtersObject, SPLIT_BY = ',', mode, queryObject, setFiltersObject } = props;
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (queryObject?.city_id) {
      fetchSelectedCities(queryObject?.city_id?.split(','));
    }
  }, [queryObject?.city_id]);

  useEffect(() => {
    if (filtersObject['city_id']) {
      fetchSelectedLocation(filtersObject['city_id'].split(','));
    }
  }, [filtersObject['city_id']]);

  const fetchSelectedLocation = async (cityIds) => {
    setLocationsLoading(true);
    try {
      const queryObject = Algolia.getLocationsOfMultipleCities(cityIds);
      const response = await Algolia.getLocationsIndex().search('', queryObject);
      setLocations(response.hits);
    } catch (error) {
      console.error('Failed to fetch selected locations:', error);
    } finally {
      setLocationsLoading(false);
    }
  };

  const fetchSelectedCities = async (cityIds) => {
    setCitiesLoading(true);
    try {
      const queryObject = Algolia.getMultipleCitiesByID(cityIds);
      const selectedCities = await Algolia.getLocationsIndex().search('', queryObject);
      if (selectedCities) {
        setCities((cities) => [
          ...cities,
          ...selectedCities.hits.filter((newCity) => !cities.some((city) => city.location_id === newCity.location_id)),
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch selected cities:', error);
      console.error('Failed to fetch selected cities:', error);
    } finally {
      setCitiesLoading(false);
    }
  };

  const fetchCities = async () => {
    setCitiesLoading(true);
    try {
      const queryObject = Algolia.getAllCities();
      const response = await Algolia.getLocationsIndex().search('', queryObject);
      setCities(response.hits);
    } catch (error) {
      console.error('Failed to fetch cities:', error?.message);
    } finally {
      setCitiesLoading(false);
    }
  };

  const fetchCitiesOnSearch = async (text, callbackSuccess = () => {}, callback) => {
    try {
      let response = null;
      if (!!text) {
        const queryObject = Algolia.getCitiesByName(text);
        response = await Algolia.getLocationsIndex().search('', queryObject);
      } else {
        const queryObject = Algolia.getAllCities();
        response = await Algolia.getLocationsIndex().search('', queryObject);
      }

      if (response) {
        callbackSuccess(response);
        return response;
      } else {
        callback();
      }
    } catch (e) {
      callback();
    }
  };

  const fetchLocations = async (text, callbackSuccess = () => {}, callback) => {
    if (!!text) {
      try {
        const queryObject = Algolia.getLocationsByName(filtersObject['city_id'].split(','), text, true);
        const response = await Algolia.getLocationsIndex().search('', queryObject);
        if (response) {
          callbackSuccess(response);
          return response;
        } else {
          callback();
        }
      } catch (e) {
        callback();
      }
    } else {
      callback();
      return;
    }
  };

  const onChangeCity = (value, option, key) => {
    let filters = { ...filtersObject };
    if (option.length) {
      filters[key] = option.map((e) => e.location_id?.toString()).join(SPLIT_BY);
      setFiltersObject(filters);
    } else {
      delete filters[key];
      delete filters[subList[1].key];
      setFiltersObject(filters);
    }
  };

  const onDeselectCity = (e) => {
    const obj = {
      ...filtersObject,
      [subList?.[0].key]: filtersObject[subList[0].key]
        .split(',')
        .filter((num) => num != e)
        .join(','),
    };
    delete obj[subList[1].key];
    setFiltersObject(obj);
  };

  const onSelectLocation = (value, option, key) => {
    let filters = { ...filtersObject };
    if (option.length) {
      filters[key] = option.map((e) => e.location_id?.toString()).join(SPLIT_BY);
      setFiltersObject(filters);
    } else {
      delete filters[key];
      setFiltersObject(filters);
    }
  };

  return (
    <>
      {!!subList[0] && (
        <SelectSearch
          className="mb-24"
          value={
            mode === 'multiple'
              ? filtersObject[subList[0].key]
                ? filtersObject[subList[0].key].split(SPLIT_BY)
                : []
              : filtersObject[subList[0].key]
          }
          onChange={(value, option) => onChangeCity(value, option, subList[0].key)}
          label={t(tenantConstants.LISTING_LOCATIONS.label)}
          placeholder={t(`Select ${tenantConstants.LISTING_LOCATIONS.label}`)}
          fetchApi={fetchCitiesOnSearch}
          initialOptions={cities}
          payloadKey="hits"
          valueAsObj
          labelProps={{ muted: true }}
          getOptionValue={(e) => e.location_id}
          getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'title')}
          filterOption={false}
          allowClear
          onDeselect={onDeselectCity}
          mode={mode}
          loading={citiesLoading}
          {...subList[0]}
        />
      )}
      {subList[1] && (
        <SelectSearch
          value={
            mode === 'multiple'
              ? filtersObject[subList[1].key]
                ? filtersObject[subList[1].key].split(SPLIT_BY)
                : []
              : filtersObject[subList[1].key]
          }
          onChange={(value, option) => onSelectLocation(value, option, subList[1].key)}
          label={t('Location')}
          placeholder={
            filtersObject.city_id ? t('Select Location') : t(`Select ${tenantConstants.LISTING_LOCATIONS.label} First`)
          }
          fetchApi={fetchLocations}
          payloadKey="hits"
          disabled={!filtersObject.city_id}
          valueAsObj
          labelProps={{ muted: true }}
          getOptionValue={(e) => e.location_id}
          getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'title')}
          filterOption={false}
          mode={mode}
          initialOptions={locations}
          loading={locationsLoading}
          allowClear
          {...subList[1]}
        />
      )}
    </>
  );
};

export default CityLocationFilter;
