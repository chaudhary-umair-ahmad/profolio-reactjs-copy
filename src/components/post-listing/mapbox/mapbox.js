import tenantTheme from '@theme';
import PropTypes from 'prop-types';
// import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL from 'react-map-gl';
import { Icon } from '../../common';
import { Mapbox } from './map-style';

import { t } from 'i18next';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../../common';

const mapboxKey = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapBox = forwardRef((props, ref) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const { latitude, longitude, zoom: mapZoom = 9, readOnly, onClick, disabled } = props;
  const [viewPort, setViewPort] = useState({ latitude: latitude, longitude: longitude, zoom: mapZoom });

  useImperativeHandle(ref, () => ({
    getViewPort() {
      return viewPort;
    },
  }));

  useEffect(() => {
    setViewPort({ latitude: latitude, longitude: longitude, zoom: mapZoom });
  }, [latitude, longitude, mapZoom]);

  return (
    <div style={{ position: 'relative' }}>
      <Mapbox disabled={disabled} className={readOnly && 'mapbox-container'} style={{ position: 'relative' }}>
        <ReactMapGL
          // style={readOnly && { marginLeft: 50, width: 350, height: 100 }}
          mapboxApiAccessToken={mapboxKey}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          {...viewPort}
          onViewportChange={(viewport) => setViewPort(viewport)}
          onZoom={(e) => {
            !readOnly && setViewPort((prevState) => ({ ...prevState, zoom: e.viewState.zoom }));
          }}
          onDrag={(e) => {
            !readOnly && setViewPort((prevState) => ({ ...prevState, ...e.viewState }));
          }}
          onClick={!readOnly && onClick}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <Icon icon="MdLocationPin" size="2em" color={tenantTheme['primary-color']} />
          </div>
        </ReactMapGL>
        {readOnly && (
          <Button
            iconSize={isMobile ? '12px' : '14px'}
            size="small"
            style={{
              '--btn-bg-color': '#fff',
              '--btn-content-color': tenantTheme['primary-color'],
              borderColor: tenantTheme['primary-light-2'],
            }}
            type="primary-light"
            className="location-map-btn fw-600"
            icon="LuMapPin"
            onClick={onClick}
          >
            {t('Set Location on Map')}
          </Button>
        )}
      </Mapbox>
    </div>
  );
});

MapBox.defaultProps = {
  latitude: '69.3451',
  longitude: '30.3753',
  width: '100%',
  height: '600px',
  zoom: 13,
  styles: { width: '100%', height: '100%', top: 0, left: 0 },
};

MapBox.propTypes = {
  latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.string,
  height: PropTypes.string,
  zoom: PropTypes.number,
  onConfirmMapLocation: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default MapBox;
