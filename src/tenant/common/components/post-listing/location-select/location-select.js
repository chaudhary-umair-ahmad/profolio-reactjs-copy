import tenantUtils from '@utils';
import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Icon, Label, SelectSearch, Spinner, Tag } from '../../../../../components/common';
import { IconStyled } from '../../../../../components/common/icon/IconStyled';
import Algolia from '../../../../../services/algolia';
import { MapModal } from '../../../../../components/post-listing/map-modal/map-modal';
import { changeLocationClickEvent } from '../../../../../services/analyticsService';
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
    renderCrossCityAlerts = () => null,
    onLocationSelect = () => {},
    name,
    hideLocation,
    hidePlot,
    hideCrossCity,
    prefixIcon,
    labelIcon,
    showPrefixIcon = true,
    showLableIcon = true,
    user,
    formik,
    propertyType,
    mode,
    label,
    placeholder,
    lockCityAfterSelection = true,
  } = props;
  const locationLocked = disabled === true;
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [isPlotFinderExists, setShowPlotFinder] = useState(false);
  const { t } = useTranslation();

  const plotFinderRef = useRef();
  const locationRef = useRef();
  const modalRef = useRef();

  const locationNotEditable = formik?.values?.is_location_editable === false;
  const showLocationReadOnlyTag = forUpdate && locationNotEditable;

  useEffect(() => {
    if (value?.city?.name) {
      fetchSelectedCity(value?.city?.name);
    }
  }, [value?.city?.name]);

  // District list must follow value.city (composite), not formik.values.location (listing root).
  useEffect(() => {
    const city = value?.city;
    const cityId = city?.location_id ?? city?.id;
    if (!cityId || !city) {
      setLocations([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetchChildLocations(city);
      if (cancelled) return;
      setLocations(
        res?.hits?.length
          ? res.hits.map((e) => ({
              ...e,
              title: tenantUtils.getLocalisedString(e, 'title'),
              value: e?.location_id,
            }))
          : [],
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [value?.city?.location_id, value?.city?.id]);

  useEffect(() => {
    fetchCities();
  }, [value?.city?.location_id]);

  const fetchChildLocations = async (location, withParent = false, callbackSuccess = () => {}, callback = () => {}) => {
    if (!!location) {
      try {
        const id = location?.id ?? location?.location_id;
        setLocationsLoading(true);
        const queryObject = withParent
          ? Algolia.getLocationsChildsFromLevelWithParent(id, location.level)
          : Algolia.getLocationsChildsFromLevel(id, location.level);
        const response = await Algolia.getLocationsIndex().search('', queryObject);
        setLocationsLoading(false);
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

  const fetchSelectedCity = async (name) => {
    setCitiesLoading(true);
    try {
      const queryObject = Algolia.getCitiesByName(name);
      const response = await Algolia.getLocationsIndex().search('', queryObject);
      if (response) {
        setCities([
          ...(response?.hits?.length
            ? response?.hits?.map((e) => ({
                ...e,
                city_title: tenantUtils.getLocalisedString(e, 'title'),
              }))
            : []),
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch city:', error?.message);
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

  const fetchCities = async () => {
    setCitiesLoading(true);
    try {
      const queryObject = Algolia.getAllCities();
      const response = await Algolia.getLocationsIndex().search('', queryObject);
      if (response) {
        setCities(
          response?.hits?.length
            ? response?.hits?.map((e) => ({
                ...e,
                city_title: tenantUtils.getLocalisedString(e, 'title'),
              }))
            : [],
        );
        response.hits;
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
        const queryObject = Algolia.getLocationsByName(value?.city?.location_id ?? value?.city?.id, text);
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

  const onChangeCity = (cityValue, option) => {
    let locationOBJ = {};
    if (option) {
      if (value?.city?.location_id != option.location_id) {
        plotFinderRef.current && plotFinderRef.current.clearOptions();
        locationRef.current && locationRef.current.clearOptions();
        onCityChange(option);
        locationOBJ['city'] = { ...option, id: option?.location_id };
      } else {
        locationOBJ = value;
      }
    } else {
      setShowPlotFinder(false);
    }
    setFieldValue(
      item.key,
      {
        ...locationOBJ,
        map: option ? { longitude: option.longitude, latitude: option.latitude, type: 'city' } : null,
        location: null,
      },
      true,
    );
  };

  const onChangeLocation = (locationValue, option) => {
    let locationAdd = {};
    locationAdd['location'] = { ...option, id: option?.location_id };
    setFieldValue(item.key, {
      city: value?.city,
      ...locationAdd,
      map: option ? { longitude: option.longitude, latitude: option.latitude, type: 'location' } : null,
    });
    onLocationSelect(option);
  };

  const onConfirmMapLocation = ({ latitude, longitude }, val = value) => {
    setFieldValue(item.key, { ...val, map: { longitude, latitude, type: 'map' } }, true);
  };

  const onCancelMapModal = () => {
    const longitude = value?.map?.longitude || value.location?.longitude;
    const latitude = value?.map?.latitude || value.location?.latitude;
    setFieldValue(item.key, { ...value, map: { longitude, latitude, type: 'map' } }, true);
  };

  const getMapPosition = useCallback(() => {
    return {
      latitude: (value?.map ? value.map : value?.location)?.latitude,
      longitude: (value?.map ? value.map : value?.location)?.longitude,
    };
  }, [value?.map, value?.location]);

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
      {showLocationReadOnlyTag ? (
        renderLocationTag()
      ) : (
        <>
          <Group gap={hideLocation ? '8px' : '0'}>
            <SelectSearch
              name={item.key}
              onChange={onChangeCity}
              onBlur={() => setFieldTouched(item.key, { city: true })}
              label={label ? t(label) : t(tenantConstants.LISTING_LOCATIONS.label)}
              placeholder={placeholder ? t(placeholder) : t(`Select ${tenantConstants.LISTING_LOCATIONS.label}`)}
              fetchApi={fetchCitiesOnSearch}
              payloadKey="hits"
              filterOption={false}
              value={value?.city?.location_id}
              prefixIcon={!!showPrefixIcon && 'MdCircle'}
              labelIcon={!!showLableIcon && 'MdOutlinePlace'}
              initialOptions={
                value?.city?.location_id && !cities?.some((c) => c?.location_id === value?.city?.location_id)
                  ? [{ ...value.city, city_title: value.city?.city_title ?? tenantUtils.getLocalisedString(value.city, 'title') }, ...(cities || [])]
                  : cities || []
              }
              getOptionValue={(e) => e.location_id}
              getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'title')}
              loading={citiesLoading}
              allowClear
              valueAsObj
              errorMsg={touched && error?.city}
              disabled={
                locationLocked ||
                disabled?.city ||
                (lockCityAfterSelection && !!(value?.city?.location_id ?? value?.city?.id))
              }
              mode={mode}
            />
            {!hideCrossCity && (
              <div style={{ marginInlineStart: 52, marginBlockStart: 8 }}>{renderCrossCityAlerts()}</div>
            )}
          </Group>
          {!hideLocation && (
            <div>
              <SelectSearch
                key={value?.city?.location_id ?? value?.city?.id ?? 'no-city'}
                fetchApi={fetchLocations}
                payloadKey="hits"
                disabled={locationLocked || !(value?.city?.location_id ?? value?.city?.id) || locationNotEditable}
                valueAsObj
                getOptionValue={(e) => e.location_id}
                getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'title')}
                filterOption={false}
                value={value?.location?.location_id}
                onChange={onChangeLocation}
                onBlur={() => setFieldTouched(item.key, { city: true, location: true })}
                initialOptions={locations}
                label={t('Location')}
                labelIcon="MdOutlineMap"
                placeholder={
                  !(value?.city?.location_id ?? value?.city?.id)
                    ? t('Search Location')
                    : t('Search from ') + tenantUtils.getLocalisedString(value?.city, 'title') ||
                      tenantUtils.getLocalisedString(value?.city, 'name')
                }
                prefixIcon="location"
                errorMsg={touched?.location && error?.location}
                ref={locationRef}
              />
            </div>
          )}
        </>
      )}

      {showPlot && (
        <>
          {/* <SelectOnMap
            imgUrl=`${getBaseURL()}/profolio-assets/images/map.png`
            onClick={() => {
              modalRef && modalRef.current.showModal();
            }}
            disabled={!value?.location}
            style={{ marginInlineStart: 50 }}
            className={!value?.location && 'pointerDisabled'}
            type="button"
          >
            <Icon className="mb-8" icon="HiLocationMarker" size="2em" />
            {!!value?.plot || forUpdate ? t('Location on Map') : t('Choose Location on Map')}
          </SelectOnMap> */}
          <Suspense fallback={<Spinner />}>
            <MapBox
              onClick={() => {
                modalRef && modalRef.current.showModal();
                changeLocationClickEvent(user, formik?.values, !forUpdate);
              }}
              disabled={locationLocked || disabled?.location || locationNotEditable}
              readOnly={true}
              {...getMapPosition()}
            />
          </Suspense>
          <MapModal
            modalRef={modalRef}
            value={value}
            forUpdate={forUpdate}
            onCancelMapModal={onCancelMapModal}
            onConfirmMapLocation={onConfirmMapLocation}
            getMapPosition={getMapPosition}
            user={user}
            formikValues={formik?.values}
          />
        </>
      )}
    </Group>
  );
};
export default LocationSelect;
