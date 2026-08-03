import tenantApi from '@api';
import { Divider, Row } from 'antd';
import cx from 'clsx';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getUniqueArrayByObjKey } from '../../../utility/utility';
import {
  Button,
  Checkbox,
  ConfirmationModal,
  EmptyState,
  ErrorMessage,
  Group,
  ImageUploadDropzone,
  ListItem,
  Skeleton,
  TextWithIcon,
} from '../../common';
import Label from '../../common/Label/Label';
import { IconStyled } from '../../common/icon/IconStyled';
import Icon from '../../common/icon/icon';
import { ImageUpload, Thumbnail } from '../../common/image-uploads/styled';
import { EmptyNoImage } from '../../svg';
import { ImageSelector } from './styled';
import QualityTip from '../quality-tip/quality-tip';
import tenantTheme from '@theme';
import { useLazyGetImageBankQuery } from '../../../apis/common';

const ImageSelect = (props) => {
  const {
    label,
    labelIcon,
    values,
    setFieldValue,
    style,
    errorMsg,
    valueKey = 'property_images',
    filesAllowed,
    imageBankIcon = true,
    showImageBank = true,
    onImageUpload = () => {},
    showQualityTip = false,
    propertyTypeId,
    showClose = true,
  } = props;
  const [images, setImages] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const [getImageBank] = useLazyGetImageBankQuery();

  const user = useSelector((state) => state.app.loginUser.user);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const setImagesOnChange = () => {
    if (images.length) {
      setImages((prev) =>
        prev.map((e) => ({
          ...e,
          ...(values?.[valueKey].find((it) => it.id == e.id) ? { selected: true } : { selected: false }),
        })),
      );
    }
  };

  const fetchImages = async (page) => {
    setLoading(true);

    const response = await getImageBank({ userId: user.id, perPage: 30, page: page });
    if (response) {
      setLoading(false);
      if (response.error) {
        setError(response.error);
      } else {
        const imagesResponse = response.data.images;
        // if (values?.[valueKey] && values?.[valueKey]?.length) {
        //   values?.[valueKey].forEach((e) => {
        //     const selectedImage = imagesResponse.find((it) => it.id == e.id);
        //     if (selectedImage) selectedImage.selected = true;
        //   });
        // }
        setImages((prev) => [...prev, ...imagesResponse]);
        setPagination(response.data.pagination);
      }
    }
  };

  const onDone = () => {
    const selectedImages = images
      .filter((e) => e.selected)
      .map((e) => ({ ...e, uploaded: true, uploading: false, inError: false }));
    const allImages = values?.[valueKey]
      ? getUniqueArrayByObjKey([...values?.[valueKey], ...selectedImages], 'id')
      : [...selectedImages];
    if (!allImages.find((e) => e.isMainImage) && allImages[0]?.id) {
      allImages[0] = { ...allImages[0], isMainImage: true };
    }
    setFieldValue(valueKey, allImages);
    setShowModal(false);
  };

  return (
    <div name={valueKey}>
      <Group template="max-content auto" gap="16px" style={{ ...style }}>
        {labelIcon && (
          <IconStyled>
            <Icon icon={labelIcon} />
          </IconStyled>
        )}
        <div>
          <Group template="initial" gap="8px" className="mb-16">
            {' '}
            <Label>{label}</Label>
            <ImageUpload>
              <ImageUploadDropzone
                btnText={t('Upload Images')}
                btnStyle={
                  !isMobile && {
                    padding: '6px 14px',
                    color: '#fff',
                    backgroundColor: tenantTheme['primary-color'],
                  }
                }
                pictures={values[valueKey] || []}
                setPictures={(pictures) => setFieldValue(valueKey, pictures)}
                previewKey="thumbnail"
                fullPreviewKey="large"
                selectMainOnDoubleClick={true}
                name={valueKey}
                filesAllowed={filesAllowed}
                attachmentType="listing_image"
                containerClass={cx(!values[valueKey]?.length && isMobile && 'noImage')}
                onImageUpload={onImageUpload}
                showClose={showClose}
              >
                {(renderImages, renderUploadButton) => (
                  <>
                    <Row style={{ rowGap: '16px', columnGap: '32px' }} className="align-items-center">
                      {imageBankIcon && <Icon icon="IconImageBank" />}
                      <Group template="initial" gap="8px" style={{ alignSelf: isMobile && 'start' }}>
                        {renderUploadButton()}
                        {showImageBank ? (
                          <Button
                            onClick={() => {
                              !images.length && fetchImages();
                              setShowModal(true);
                              setImagesOnChange();
                            }}
                          >
                            {t('Image Bank')}
                          </Button>
                        ) : (
                          <></>
                        )}
                        {!isMobile && (
                          <small className="color-gray-dark" style={{ width: '22ch' }}>
                            {t('Max size 5MB, .jpg .png only')}
                          </small>
                        )}
                      </Group>
                      {!isMobile && (
                        <ul className={cx('text-muted', !!values[valueKey]?.length ? '' : 'mb-0')} style={{ flex: 1 }}>
                          <ListItem className="flex mb-8" style={{ gap: '6px' }}>
                            {t('Ads with pictures get 5x more views.')}
                          </ListItem>
                          <ListItem className="flex mb-8" style={{ gap: '6px' }}>
                            {t('Upload good quality pictures with proper lighting.')}
                          </ListItem>
                          <ListItem className="flex" style={{ gap: '6px' }}>
                            {t('Double click to set cover image.')}
                          </ListItem>
                        </ul>
                      )}
                    </Row>
                    {!!values[valueKey]?.length && (
                      <>
                        {!isMobile && <Divider style={{ marginBlock: '20px 16px' }} />}
                        {/* <div className="grid" style={{ '--gap': '8px' }}> */}
                        {/* {renderImages && (
<div className="color-gray-light">
<small className="align-center-v" style={{ gap: 2, lineHeight: 1 }}>
<Icon icon="MdInfoOutline" /> {t('Double Click to set main Image')}
</small>
</div>
)} */}

                        {renderImages()}
                        {/* </div> */}
                      </>
                    )}
                  </>
                )}
              </ImageUploadDropzone>
            </ImageUpload>
            {!!values[valueKey]?.length && isMobile && (
              <TextWithIcon
                icon="FiInfo"
                title={t('Double click to set cover image.')}
                textColor="#A3A3A3"
                fontWeight={400}
                className="fs12"
                iconProps={{
                  size: 13,
                  color: '#A3A3A3',
                }}
              />
            )}
            <ErrorMessage message={errorMsg} />
          </Group>
          {showQualityTip && (
            <QualityTip
              type="images"
              count={(values?.[valueKey] || []).filter((image) => !image._destroy).length}
              propertyId={propertyTypeId}
            />
          )}
        </div>
      </Group>

      <ConfirmationModal
        title={t('Upload From Image Bank')}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onSuccess={onDone}
      >
        {loading && !images.length ? (
          <Group template="repeat(auto-fill,minmax(min(96px,100%),1fr))" gap="8px">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => (
              <Skeleton width="100%" height={96} key={e} />
            ))}
          </Group>
        ) : error && !images.length ? (
          <EmptyState message={error} onClick={fetchImages} buttonLoading={loading} />
        ) : (
          <>
            {images.length ? (
              <>
                <Group
                  template="repeat(auto-fill,minmax(min(96px,100%),1fr))"
                  gap="8px"
                  className="scroll-y"
                  style={{ '--box-height': '408px', padding: 2 }}
                >
                  {images.map((item, index) => (
                    <ImageSelector key={index}>
                      <Checkbox
                        value={item.selected}
                        onChange={(event) => {
                          setImages((prev) => {
                            const updatedImages = [...prev];
                            updatedImages[index] = { ...updatedImages[index], selected: event.target.checked };
                            return updatedImages;
                          });
                        }}
                        style={{ width: '100%', height: 96 }}
                      >
                        <Thumbnail style={{ '--thumbnail-width': '100%' }} src={item.thumbnail} />
                      </Checkbox>
                    </ImageSelector>
                  ))}
                </Group>
                {pagination?.nextPage && (
                  <Row justify="center" style={{ marginTop: 8 }}>
                    <Button
                      type={'link'}
                      // loading={loading}
                      disabled={loading}
                      onClick={() => fetchImages(pagination.nextPage)}
                    >
                      {images.length && error ? 'Retry' : `Show More`}
                      <Icon icon="MdKeyboardArrowDown" className="m-0" />
                    </Button>
                  </Row>
                )}
              </>
            ) : (
              <EmptyState illustration={<EmptyNoImage />} title={t('No Images Uploaded')} hideRetryButton />
            )}
          </>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default ImageSelect;
