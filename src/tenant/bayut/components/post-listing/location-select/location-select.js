import tenantApi from '@api';
import tenantData from '@data';
import tenantUtils from '@utils';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Icon, Label, SelectSearch, Spinner, Tag } from '../../../../../components/common';
import { IconStyled } from '../../../../../components/common/icon/IconStyled';
import Algolia from '../../../../../services/algolia';
import { GoogleMapModal } from '../../../../../components/post-listing/google-map-modal/google-map-modal';
import { changeLocationClickEvent } from '../../../../../services/analyticsService';
import tenantConstants from '@constants';
import GoogleMapComponent from '../../../../../components/post-listing/google-map/google-map';
import { Col, Row } from 'antd';

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
    onLocationSelect,
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

  // District options must follow the city chosen in this field (value.city), not formik.values.location
  // (listing root from initialValues), which would pin the same districts for every city.
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
    fetchCities()
  }, []);

  const fetchChildLocations = async (location, withParent = false, callbackSuccess = () => {}, callback = () => {}) => {
    if (!!location) {
      try {
        const id = location?.id || location?.location_id;
        setLocationsLoading(true);
        const queryObject = withParent
          ? Algolia.getLocationsChildsFromLevelWithParent(location.id, location.level)
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
    if (!option) {
      setShowPlotFinder(false);
      plotFinderRef.current && plotFinderRef.current.clearOptions();
      locationRef.current && locationRef.current.clearOptions();
      setFieldValue(item.key, { city: null, location: null, map: null }, true);
      return;
    }
    let locationOBJ = {};
    if (value?.city?.location_id != option.location_id) {
      plotFinderRef.current && plotFinderRef.current.clearOptions();
      locationRef.current && locationRef.current.clearOptions();
      onCityChange(option);
      locationOBJ['city'] = { ...option, id: option?.city_id };
    } else {
      locationOBJ = value;
    }
    setFieldValue(
      item.key,
      {
        ...locationOBJ,
        map: { longitude: option.longitude, latitude: option.latitude, type: 'city' },
      },
      true,
    );
  };

  const onChangeLocation = (locationValue, option) => {
    if (!option) {
      setShowPlotFinder(false);
      plotFinderRef.current && plotFinderRef.current.clearOptions();
      setFieldValue(
        item.key,
        {
          city: value?.city,
          location: null,
          map:
            value?.city?.longitude != null && value?.city?.latitude != null
              ? { longitude: value.city.longitude, latitude: value.city.latitude, type: 'city' }
              : value?.map ?? null,
        },
        true,
      );
      onLocationSelect(null);
      return;
    }
    if (option.location_id != value.location?.location_id) {
      let locationAdd = {};
      locationAdd['location'] = { ...option, id: option?.location_id };
      setFieldValue(item.key, {
        city: value?.city,
        ...locationAdd,
        map: { longitude: option.longitude, latitude: option.latitude, type: 'location' },
      });
      plotFinderRef.current && plotFinderRef.current.clearOptions();
      onLocationSelect(option);
    }
  };

  const onChangePlotNumber = (val, option) => {
    if (option) {
      setFieldValue(item.key, {
        ...value,
        plot: option,
        map: {
          longitude: option.geometry.coordinates[0],
          latitude: option.geometry.coordinates[1],
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

  const onConfirmMapLocation = ({ latitude, longitude }, val = value) => {
    setFieldValue(item.key, { ...val, map: { longitude, latitude, type: 'map' } }, true);
  };

  const onCancelMapModal = () => {
    const longitude = value?.map?.longitude || value.location?.longitude;
    const latitude = value?.map?.latitude || value.location?.latitude;
    setFieldValue(item.key, { ...value, map: { longitude, latitude, type: 'map' } }, true);
  };

  const getMapPosition = useCallback(() => {
    const position = value?.map || value?.location;
    return {
      lat: position?.latitude,
      lng: position?.longitude,
      latitude: position?.latitude,
      longitude: position?.longitude,
    };
  }, [value?.map, value?.location]);

  const cityOptions = useMemo(() => {
    if (!value?.city) return cities;
    const list = cities ?? [];
    const selectedId = value.city.location_id ?? value.city.id;
    if (list.some((c) => (c?.location_id ?? c?.id) === selectedId)) return cities;
    const title = value.city.title ?? { en: String(value.city.name ?? selectedId) };
    return [{ ...value.city, location_id: selectedId, id: selectedId, title }, ...list];
  }, [cities, value?.city]);

  /** When editing, Algolia district hits may not include the saved id yet — seed the current row so the label shows. */
  const districtOptions = useMemo(() => {
    const loc = value?.location;
    const list = locations ?? [];
    if (!loc) return list;
    const selectedId = loc.location_id ?? loc.id;
    if (selectedId == null || selectedId === '') return list;
    const idKey = (x) => x?.location_id ?? x?.value ?? x?.id;
    if (list.some((x) => idKey(x) === selectedId)) return list;
    const title = loc.title ?? { en: String(loc.name ?? selectedId) };
    return [{ ...loc, location_id: selectedId, id: selectedId, value: selectedId, title }, ...list];
  }, [locations, value?.location]);

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
              initialOptions={cityOptions}
              getOptionValue={(e) => e.location_id}
              getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'title')}
              loading={citiesLoading}
              allowClear
              valueAsObj
              errorMsg={
                (error?.city && touched?.city && error?.city) ||
                (!!touched && Object.keys(touched).length === 0 && error?.city) ||
                null
              }
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
                disabled={
                  locationLocked || !(value?.city?.location_id ?? value?.city?.id) || locationNotEditable
                }
                valueAsObj
                getOptionValue={(e) => e.location_id}
                getOptionLabel={(e) => tenantUtils.getLocalisedString(e, 'title')}
                filterOption={false}
                value={value?.location?.location_id}
                onChange={onChangeLocation}
                onBlur={() => setFieldTouched(item.key, { city: true, location: true })}
                initialOptions={districtOptions}
                label={t('Location/District')}
                labelIcon="MdOutlineMap"
                placeholder={
                  !(value?.city?.location_id ?? value?.city?.id)
                    ? t('Search Location')
                    : t('Search from ') + tenantUtils.getLocalisedString(value?.city, 'title') ||
                      tenantUtils.getLocalisedString(value?.city, 'name')
                }
                prefixIcon="location"
                errorMsg={
                  (error?.location && touched?.location && error?.location) ||
                  (!!touched && Object.keys(touched).length === 0 && error?.location) ||
                  null
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
            <Row>
              <Col xs={22} lg={22} xl={22} offset={2}>
                <GoogleMapComponent
                  onClick={() => {
                    modalRef && modalRef.current.showModal();
                    changeLocationClickEvent(user, formik?.values, !forUpdate);
                  }}
                  disabled={locationLocked || disabled?.location || locationNotEditable}
                  readOnly={true}
                  enableInteractions={true}
                  lat={getMapPosition()?.lat}
                  lng={getMapPosition()?.lng}
                  zoom={13}
                  mapStyle={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}
                  className="location-select-map"
                />
              </Col>
            </Row>
          </Suspense>
          <GoogleMapModal
            modalRef={modalRef}
            value={value}
            forUpdate={forUpdate}
            onCancelMapModal={onCancelMapModal}
            onConfirmMapLocation={onConfirmMapLocation}
            getMapPosition={getMapPosition}
            user={user}
            formikValues={formik?.values}
            propertyType={propertyType}
          />
        </>
      )}
    </Group>
  );
};
export default LocationSelect;
