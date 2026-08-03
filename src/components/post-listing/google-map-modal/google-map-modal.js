import { useTranslation } from 'react-i18next';
import { ConfirmationModal, Spinner } from '../../common';
import React, { lazy, Suspense, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import { changeLocationConfirmEvent } from '../../../services/analyticsService';

const GoogleMapComponent = lazy(() => import('../google-map/google-map'));

const GoogleMapModal = (props) => {
  const { modalRef, value, forUpdate, onCancelMapModal, onConfirmMapLocation, getMapPosition, formikValues, user } =
    props;
  const mapRef = useRef();
  const { t } = useTranslation();

  const debouncedUpdateMarker = useCallback(
    debounce((newViewport, val) => {
      const updatedMarker = {
        latitude: newViewport.latitude,
        longitude: newViewport.longitude,
      };
      onConfirmMapLocation(updatedMarker, val);
    }, 300),
    [],
  );

  const onSuccessMapLocationChange = () => {
    changeLocationConfirmEvent(user, formikValues, !forUpdate);
    mapRef.current && debouncedUpdateMarker(mapRef.current.getViewPort(), value);
    modalRef?.current && modalRef.current.hideModal();
  };

  const mapPosition = getMapPosition();

  return (
    <ConfirmationModal
      title={`${!!value?.plot || forUpdate ? t('Location on Map') : t('Drag to select location on map')}`}
      ref={modalRef}
      onSuccess={onSuccessMapLocationChange}
      bodyStyle={{ padding: 0 }}
      width={800}
      maskClosable={false}
      onCancel={onCancelMapModal}
      {...((!!value?.plot || forUpdate) && { footer: null })}
    >
      <Suspense fallback={<Spinner type="full" />}>
        <GoogleMapComponent
          lat={mapPosition.lat}
          lng={mapPosition.lng}
          ref={mapRef}
          zoom={13}
          mapStyle={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}
        />
      </Suspense>
    </ConfirmationModal>
  );
};

export { GoogleMapModal };