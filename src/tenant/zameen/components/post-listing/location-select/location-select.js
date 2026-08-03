import tenantApi from '@api';
import tenantData from '@data';
import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Icon, Label, Select, SelectSearch, Spinner, Tag } from '../../../../../components/common';
import { IconStyled } from '../../../../../components/common/icon/IconStyled';
import { MapModal } from '../../../../../components/post-listing/map-modal/map-modal';
import Algolia from '../../../../../services/algolia';
import { useLazyFetchPlotsByQueryQuery } from '../../../../../apis/listings';
import tenantConstants from '@constants';
const MapBox = lazy(() => import('../../../../../components/post-listing/mapbox/mapbox'));

const LocationSelect = (props) => {
  const {
    value,
    error,
    touched,
    setFieldValue,
    setFieldTouched,
    item,
    onCityChange = () => {},
    onPlotSelect,
    showPlot,
    disabled,
    forUpdate,
    crossCity,
    renderCrossCityAlerts,
    onLocationSelect,
    name,
    hideLocation,
    hidePlot,
    hideCrossCity,
    prefixIcon,
    labelIcon,
    showPrefixIcon = false,
    showLableIcon = true,
    user,
    onLocationChange,
    onLocationClick,
    propertyType,
  } = props;
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [isPlotFinderExists, setShowPlotFinder] = useState(false);
  const { t } = useTranslation();
  // const [fetchPlotsByQuery] = useLazyFetchPlotsByQueryQuery();
  const plotFinderRef = useRef();
  const locationRef = useRef();
  const modalRef = useRef();
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchPlotsByQuery = async (parentId, query) => {
    //toDo: fetchPlotsByQuery
    const rs = await fetch(
      `https://www.zameen.com/api/plotFinder/parcel/?all=1&externalID=${parentId}${query ? `&query=${query}` : ''}`,
    );
    const response = await rs.json();
    if (response) {
      return {
        data: response,
      };
    } else {
      return { ...response };
    }
  };

  const fetchCities = async () => {
    setCitiesLoading(true);
    try {
      const queryObject = Algolia.getAllCities();
      const response = await Algolia.getLocationsIndex().search('', queryObject);
      if (response) {
        setCities(response.hits);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error?.message);
    } finally {
      setCitiesLoading(false);
    }
  };

  const fetchLocations = async (text, callbackSuccess = () => {}, callback) => {
    if (!!text) {
      try {
        const queryObject = Algolia.getLocationsByName(value?.city?.location_id, text);
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

  const fetchPlotByNumber = async (plotValue, cb = () => {}, errorCallback) => {
    if (!!plotValue) {
      try {
        const response = await fetchPlotsByQuery(value?.location?.location_id, plotValue);
        if (response) {
          if (response.data) {
            cb(response);
            return response;
          } else {
            errorCallback();
          }
        }
      } catch (e) {
        errorCallback();
      }
    } else {
      errorCallback();
      return;
    }
  };

  const plotFinderExists = async (option) => {
    const response = await fetchPlotsByQuery(option.location_id);
    if (response) {
      if (response.data?.length) {
        setShowPlotFinder(!(response.data.length === 0));
      } else {
        setShowPlotFinder(false);
      }
    }
  };

  const resetAreaSizeAndUnit = () => {
    setFieldValue('area', {
      unit:
        tenantData.areaUnitList.find(
          (e) =>
            e.slug == user?.settings?.find((it) => it.name == 'area_unit')?.value ||
            e.title_short == user?.settings?.find((it) => it.name == 'area_unit')?.value,
        )?.id || 5,
      value: null,
    });
  };

  const onChangeCity = (cityValue, option) => {
    resetAreaSizeAndUnit();
    let locationOBJ = {};
    if (option) {
      if (value.city?.location_id != option.location_id) {
        plotFinderRef.current && plotFinderRef.current.clearOptions();
        locationRef.current && locationRef.current.clearOptions();
        onCityChange(option);
        locationOBJ['city'] = option;
      } else {
        locationOBJ = value;
      }
    } else {
      setShowPlotFinder(false);
    }
    setFieldValue(item.key, locationOBJ, true);
  };

  const onChangeLocation = (locationValue, option) => {
    resetAreaSizeAndUnit();
    if (option.location_id != value.location?.location_id) {
      setFieldValue(item.key, {
        city: value.city,
        location: option,
        map: option ? { longitude: option.longitude, latitude: option.latitude, type: 'location' } : null,
      });
      plotFinderRef.current && plotFinderRef.current.clearOptions();
      plotFinderExists(option);
      onLocationSelect(option);
    } else if (!option) {
      setShowPlotFinder(false);
    }
  };

  const decryptCoordinates = (point) => {
    const [lng, lat] = point;
    return [(0.0005 + lng) / 1.001, (lat - 0.0003) * 1.0005];
  };

  const onChangePlotNumber = (val, option) => {
    if (option) {
      const [lng, lat] = decryptCoordinates(option.geometry.coordinates);
      setFieldValue(item.key, {
        ...value,
        plot: option,
        map: {
          longitude: lng,
          latitude: lat,
          type: 'plotfinder',
        },
      });
      onPlotSelect(option);
    } else {
      setFieldValue(item.key, {
        ...value,
        plot: null,
        map: {
          longitude: Number(value?.location.longitude),
          latitude: Number(value?.location.latitude),
          type: 'location',
        },
      });
      onPlotSelect(null);
    }
  };

  const onChangeMapPointer = ({ latitude, longitude }, val = value) => {
    setFieldValue(item.key, { ...val, map: { longitude, latitude, type: 'map' } }, true);
  };

  const onSuccessMapLocationChange = () => {
    onLocationChange();
    modalRef?.current && modalRef.current.hideModal();
  };
  const onCancelMapModal = () => {
    const longitude = value?.map?.longitude || value.location?.longitude;
    const latitude = value?.map?.latitude || value.location?.latitude;
    setFieldValue(item.key, { ...value, map: { longitude, latitude, type: 'map' } }, true);
  };
  const getMapPosition = useCallback(() => {
    return {
      latitude: (value?.map ? value.map : value?.plot ? value.plot : value?.location)?.latitude,
      longitude: (value?.map ? value.map : value?.plot ? value.plot : value?.location)?.longitude,
    };
  }, [value?.map, value?.plot, value?.location]);

  const renderLocationTag = () => {
    const locationChip = [value?.plot?.plot_number && `Plot # ${value?.plot?.plot_number}`, value.location, value.city]
      .filter((e) => !!e)
      .map((e) => e?.title?.en || e?.title || e)
      .join(', ');
    return (
      <Group template="max-content auto" gap="16px">
        <IconStyled>
          <Icon icon="MdOutlineMap" />
        </IconStyled>
        <Group template="initial" gap="8px">
          <Label>{t('Location')}</Label>
          <div>
            <Tag shape="round" bordered disabled>
              {value.location && locationChip}
            </Tag>
          </div>
        </Group>
      </Group>
    );
  };

  return (
    <Group gap="32px" template="1fr">
      {forUpdate ? (
        renderLocationTag()
      ) : (
        <>
          <Group gap={hideLocation ? '8px' : '0'}>
            <Select
              showSearch={true}
              value={value?.city?.location_id}
              name={item.key}
              onChange={onChangeCity}
              onBlur={() => setFieldTouched(item.key, { city: true })}
              label={t(tenantConstants.LISTING_LOCATIONS.label)}
              placeholder={t(`Select ${tenantConstants.LISTING_LOCATIONS.label}`)}
              prefixIcon={!!showPrefixIcon && 'MdCircle'}
              labelIcon={!!showLableIcon && 'MdOutlinePlace'}
              options={cities}
              getOptionValue={(e) => e.location_id}
              getOptionLabel={(e) => e.title.en || e.title}
              loading={citiesLoading}
              allowClear
              valueAsObj
              errorMsg={
                (error?.city && touched?.city && error?.city) ||
                (!!touched && Object.keys(touched).length === 0 && error?.city)
              }
              disabled={disabled}
            />
            {!hideCrossCity && (
              <div style={{ marginInlineStart: 52, marginBlockStart: 8 }}>{renderCrossCityAlerts()}</div>
            )}
          </Group>
          {!hideLocation && (
            <div>
              <SelectSearch
                fetchApi={fetchLocations}
                payloadKey="hits"
                disabled={!value?.city?.location_id}
                valueAsObj
                getOptionValue={(e) => e.location_id}
                getOptionLabel={(e) => e.title.en}
                filterOption={false}
                value={value?.location?.location_id}
                onChange={onChangeLocation}
                onBlur={() => setFieldTouched(item.key, { city: true, location: true })}
                label={t('Location')}
                labelIcon="MdOutlineMap"
                placeholder={
                  !value?.city?.location_id ? t('Search Location') : t(`Search from ${value?.city?.title.en}`)
                }
                prefixIcon="location"
                errorMsg={
                  (error?.location && touched?.location && error?.location) ||
                  (!!touched && Object.keys(touched).length === 0 && error?.location)
                }
                ref={locationRef}
              />
            </div>
          )}
        </>
      )}

      {showPlot && (
        <>
          <Suspense fallback={<Spinner />}>
            <MapBox
              {...getMapPosition()}
              readOnly={true}
              disabled={!value?.location}
              onClick={() => modalRef && modalRef.current.showModal()}
            />
          </Suspense>
          <MapModal
            modalRef={modalRef}
            value={value}
            forUpdate={forUpdate}
            onCancelMapModal={onCancelMapModal}
            onConfirmMapLocation={onChangeMapPointer}
            getMapPosition={getMapPosition}
            user={user}
            propertyType={propertyType}
          />
        </>
      )}

      {!hidePlot && (
        <>
          <Group gap="16px">
            {showPlot && isPlotFinderExists && !forUpdate && (
              <SelectSearch
                value={value?.plot?.id}
                onChange={onChangePlotNumber}
                label={t('Plot Number')}
                placeholder={t('Enter plot number e-g 236 D')}
                prefixIcon="location"
                labelIcon="MdOutlineMap"
                fetchApi={fetchPlotByNumber}
                payloadKey="data"
                getOptionValue={(e) => e.id}
                getOptionLabel={(e) => `Plot # ${[e.plot_number, e.area, e.street].filter((it) => it).join(', ')}`}
                disabled={!value?.location}
                filterOption={false}
                valueAsObj
                showSearch
                allowClear
                ref={plotFinderRef}
              />
            )}
          </Group>
        </>
      )}
    </Group>
  );
};
export default LocationSelect;
