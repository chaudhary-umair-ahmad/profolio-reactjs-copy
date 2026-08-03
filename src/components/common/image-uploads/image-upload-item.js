import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { TENANT_KEY } from '../../../utility/env';
import { Spinner } from '..';
import { Button, Checkbox, ConfirmationModal, Icon, Popover, Skeleton } from '../';
import { strings } from '../../../constants/strings';
import { uploadFile } from '../../../helpers/fileHelpers/imageUploadHelper';
import { ImageEnlarge, ImageSelector } from '../../post-listing/image-select/styled';
import { IconEnlargeImage } from '../../svg';
import { Tag } from '../tag/tag';
import { DocumentsThumb, GalleryThumb, Remove, Retry, Thumbnail } from './styled';

const ImageUploadItem = (props) => {
  const { t } = useTranslation();
  const {
    uploadImage,
    item,
    removeImage,
    previewKey = 'gallerythumb',
    selectOnClick,
    selectMainOnDoubleClick,
    attachmentType,
    associationKey,
    files,
    setFiles,
    makeBlob,
    isSvg,
    size,
    getS3PreSignedUrl,
    imgContain,
    onRetry,
    fullPreviewKey,
    showClose = true,
    viewType,
    onImageUpload = () => {},
    imageAnalyser,
    borderRadius,
    showDuplicateWarning = true,
  } = props;
  const { uploaded, uploading, inError, selected, isMainImage, status, is_rega_image, analysing, analyseError, is_unique, image_type } = item;

  const [imageLoaded, setImageLoaded] = useState(false);
  const modalRef = useRef();
  useEffect(() => {
    uploadFile(
      item,
      getS3PreSignedUrl,
      attachmentType,
      associationKey,
      files,
      setFiles,
      makeBlob,
      isSvg,
      undefined,
      onImageUpload,
      imageAnalyser,
    );
  }, []);

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  let timer = 0;
  let delay = 200;
  let prevent = false;

  const onImageClick = () => {
    // !selectOnClick && modalRef.current.showModal();
  };
  const onImageDoubleClick = () => {
    if (selectMainOnDoubleClick) {
      const updatedFiles = files.map((e) => ({
        ...e,
        isMainImage: e.id === item.id,
      }));
      setFiles(updatedFiles);
    }
  };

  const onClick = () => {
    timer = setTimeout(() => {
      !prevent && onImageClick();
      prevent = false;
    }, delay);
  };

  const onDoubleClick = () => {
    clearTimeout(timer);
    prevent = true;
    onImageDoubleClick();
  };

  const renderImage = (status) => {
    return (
      <Thumbnail
        style={{
          '--thumbnail-width': '100%',
          ...(status === 'Rejected' || status === 'rejected' ? { borderColor: 'red', borderStyle: 'solid' } : {}),
          // borderColor: 'red',
          // borderStyle: 'solid',
          '--border-radius': borderRadius,
        }}
        draggable={false}
        onClick={onClick}
        onDoubleClick={onImageDoubleClick}
        src={item[previewKey] ? item[previewKey] : item.localPreview}
      />
    );
  };

  const renderListView = () => {
    return (
      <DocumentsThumb className="gallery-thumb" imgContain={imgContain} faded={inError || uploading}>
        <div className="file-tile">
          <div style={{ wordBreak: 'break-all' }}>
            <Icon className="file-icon" icon="MdFileCopy" />
            {item?.name || item?.file?.name}
          </div>
          {inError && (
            <Retry
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onRetry(item);
              }}
            >
              {isMobile ? <Icon icon="MdRefresh" size={16} /> : 'Retry'}
            </Retry>
          )}
          {!uploading && showClose && (
            <Button
              icon="HiOutlineTrash"
              className="btnTrash"
              onClick={(e) => {
                e.preventDefault();
                removeImage(item);
              }}
            >
              {isMobile ? '' : 'Remove'}
            </Button>
          )}
          {!!uploading && <Spinner />}
        </div>
      </DocumentsThumb>
    );
  };

  const renderGalleryView = () => {
    return (
      <GalleryThumb className="gallery-thumb" imgContain={imgContain} faded={inError || uploading}>
        {selectOnClick && (
          <ImageSelector>
            <Checkbox
              value={selected}
              onChange={(event) => {
                setFiles((prevState) =>
                  prevState.map((e) => (e.id === item.id ? { ...e, selected: event.target.checked } : e)),
                );
              }}
              style={{ width: 96, height: 96 }}
            >
              {renderImage(status)}
            </Checkbox>
          </ImageSelector>
        )}

        <ImageEnlarge
          onClick={() => {
            if (!uploading && !inError) {
              setImageLoaded(true);
              modalRef?.current && modalRef.current.showModal();
            }
          }}
        >
          <IconEnlargeImage />
        </ImageEnlarge>
        {showDuplicateWarning && is_unique === false && image_type === "listing_image" && (
          <Popover
            content={t("Duplicate image detected. This image is currently in use on another {{tenant}} listing. It may reduce your property's health score.", {
              tenant: TENANT_KEY === 'zameen' ? 'Zameen' : 'Bayut',
            })}
            action="hover"
            placement="top"
            getPopupContainer={() => document.body}
          >
            <div
              style={{
                position: 'absolute',
                insetInlineStart: '4px',
                insetBlockStart: '4px',
                zIndex: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
              }}
            >
              <AiOutlineInfoCircle size={16} color="#ADB4D2" />
            </div>
          </Popover>
        )}
        {!selectOnClick && renderImage(status)}
        {is_rega_image && (
          <Tag shape="round" style={{ alignSelf: 'top', fontSize: 12 }}>
            {t('Rega Image')}
          </Tag>
        )}
        {isMainImage && (
          <Tag shape="round" style={{ alignSelf: 'center', fontSize: 12 }}>
            {t('Cover')}
          </Tag>
        )}
        {status === 'Rejected' ||
          (status === 'rejected' && (
            <Tag color={'red'} shape="round" style={{ alignSelf: 'center', fontSize: 12 }}>
              {t('Rejected')}
            </Tag>
          ))}
        {inError && (
          <Retry
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRetry(item);
            }}
          >
            {t('Retry')}
          </Retry>
        )}
        {!uploading && showClose && !is_rega_image && !analysing && (
          <Remove
            size="small"
            icon="MdClose"
            shape="circle"
            onClick={(e) => {
              e.preventDefault();
              removeImage(item);
            }}
            style={{ '--ant-control-height-sm': '24px' }}
          />
        )}
        {!!uploading && <Spinner />}
        <ConfirmationModal
          title={strings.preview}
          ref={modalRef}
          footer={null}
          width={'auto'}
          bodyStyle={{
            minWidth: isMobile ? 150 : 300,
            minHeight: isMobile ? 'auto' : 300,
          }}
        >
          {imageLoaded ? (
            <Thumbnail
              style={{ '--thumbnail-width': 'auto', '--thumbnail-height': 'auto', maxWidth: '100%', maxHeight: '100%' }}
              src={
                item?.full
                  ? item?.full
                  : item?.gallerythumb
                    ? item?.gallerythumb.replace('thumbnail', 'full')
                    : item?.localPreview
              }
              onLoad={(e) => {
                setImageLoaded(true);
              }}
            />
          ) : (
            <div
              className="flex justify-content-center align-items-center"
              style={{ width: 600, height: 600, backgroundColor: 'aliceblue' }}
            >
              <Skeleton type="image" active={false} />
            </div>
          )}
        </ConfirmationModal>
      </GalleryThumb>
    );
  };

  return viewType === 'list' ? renderListView() : renderGalleryView();
};

export default ImageUploadItem;
