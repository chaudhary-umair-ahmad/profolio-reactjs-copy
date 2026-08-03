import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Marker, useJsApiLoader } from '@react-google-maps/api';
import { Icon } from '../../common';
import { t } from 'i18next';
import { MessageContainer, MessageContent, MessageText, StyledGoogleMap } from './styled';

const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const GoogleMapComponent = forwardRef((props, ref) => {
  const {
    onCallback,
    loadingCallback,
    enableInteractions = true,
    enableCurrentLocation = false,
    lat,
    lng,
    className,
    zoom: initialZoom = 15,
    readOnly = false,
    onClick,
    disabled = false,
    mapStyle = {},
  } = props;

  const [center, setCenter] = useState({
    lat: lat ?? 25.276987,
    lng: lng ?? 55.296249,
  });

  const [markerPosition, setMarkerPosition] = useState({
    lat: lat ?? 25.276987,
    lng: lng ?? 55.296249,
  });

  const [zoom, setZoom] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsKey,
  });

  useImperativeHandle(ref, () => ({
    fetchAddress(lat, lng) {
      // getAddress(lat, lng);
      if (loadingCallback) loadingCallback(false);
      setCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
    },
    getViewPort() {
      return {
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
        zoom: zoom,
      };
    },
  }));

  const handleMapClick = (event) => {
    if (enableInteractions && !readOnly) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      // getAddress(lat, lng);
      setMarkerPosition({ lat, lng });
      setCenter({ lat, lng });

      if (onCallback) {
        onCallback({ lat, lng });
      }

      if (onClick) {
        onClick(event);
      }
    } else {
      if (onClick) {
        onClick(event);
      }
    }
  };

  // const getAddress = async (lat, lng) => {
  //   setMarkerPosition({ lat, lng });
  //   try {
  //     const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
  //       params: {
  //         latlng: `${lat},${lng}`,
  //         key: googleMapsKey,
  //       },
  //     });

  //     let formattedAddress = '';
  //     let cityName = '';
  //     let countryName = '';
  //     let countryCode = '';
  //     let postalCode = '';
  //     let areaName = '';

  //     if (response.data.results.length > 0) {
  //       const addressComponents = response.data.results[0].address_components;
  //       for (const component of addressComponents) {
  //         if (component.types.includes('locality')) {
  //           cityName = component.long_name;
  //         } else if (component.types.includes('country')) {
  //           countryName = component.long_name;
  //           countryCode = component.short_name;
  //         } else if (component.types.includes('postal_code')) {
  //           postalCode = component.long_name;
  //         } else if (
  //           component.types.includes('neighborhood') ||
  //           component.types.includes('sublocality')
  //         ) {
  //           areaName = component.short_name;
  //         }
  //       }
  //       formattedAddress = response.data.results[0].formatted_address;
  //     }

  //     const location = {
  //       lat,
  //       lng,
  //       cityName,
  //       countryName,
  //       formattedAddress,
  //       postalCode,
  //       countryCode,
  //       areaName,
  //     };

  //     if (onCallback) {
  //       onCallback(location);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching address:', error);
  //   }
  // };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    // getAddress(lat, lng);
    setMarkerPosition({ lat, lng });
    setCenter({ lat, lng });

    if (onCallback) {
      onCallback({ lat, lng });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      if (loadingCallback) loadingCallback(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // getAddress(latitude, longitude);
        if (loadingCallback) loadingCallback(false);
        setCenter({ lat: latitude, lng: longitude });
        setMarkerPosition({ lat: latitude, lng: longitude });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    if (enableCurrentLocation) {
      getCurrentLocation();
    }
  }, [enableCurrentLocation]);

  useEffect(() => {
    if (lat && lng) {
      const newCenter = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      setCenter(newCenter);
      setMarkerPosition(newCenter);
    }
  }, [lat, lng]);

  // Show error message if API key is missing
  if (!googleMapsKey) {
    return (
      <MessageContainer>
        <MessageContent>
          <Icon icon="MdError" size="2em" color="#ff4d4f" />
          <MessageText>
            {t('Google Maps API key is missing. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file.')}
          </MessageText>
        </MessageContent>
      </MessageContainer>
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <MessageContainer>
        <MessageContent>
          <Icon icon="MdRefresh" size="2em" color="#1890ff" />
          <MessageText>{t('Loading Google Maps...')}</MessageText>
        </MessageContent>
      </MessageContainer>
    );
  }

  return (
    <StyledGoogleMap
      center={center}
      mapContainerStyle={mapStyle}
      zoom={zoom}
      onClick={handleMapClick}
      onLoad={() => {
        // Additional actions when the map loads
      }}
      onUnmount={() => {
        // Cleanup when the map unmounts
      }}
      options={{
        gestureHandling: enableInteractions && !readOnly ? 'auto' : 'none',
        disableDefaultUI: readOnly,
        zoomControl: !readOnly,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
      className={className ?? ''}
    >
      <Marker
        position={markerPosition}
        draggable={enableInteractions && !readOnly}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </StyledGoogleMap>
  );
});

export default GoogleMapComponent;
