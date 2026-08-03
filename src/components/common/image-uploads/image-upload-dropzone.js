import React, { forwardRef, useCallback, useEffect } from 'react';
import SortableList, { SortableItem } from 'react-easy-sort';
import { addBlobIdentifier, onFilesAdded, uploadFile } from '../../../helpers/fileHelpers/imageUploadHelper';

import tenantTheme from '@theme';
import { Space } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Icon } from '../../common';
import ImageUploadItem from './image-upload-item';
import { UploadButton } from './styled';
import { useLazyGetS3PreSignedUrlQuery } from '../../../apis/common';
import { isSafari } from '../../../utility/general';

const ImageUploadDropzone = forwardRef((props, ref) => {
  const {
    setPictures,
    pictures,
    getRetry,
    btnClassName = 'ant-btn ant-btn-primary',
    btnText = 'Upload',
    children,
    previewKey,
    selectOnClick,
    selectMainOnDoubleClick,
    fullPreviewKey,
    btnStyle,
    showClose,
    contentMappingForImages = ['image/jpeg', 'image/png'],
    attachmentType = 'generic',
    viewType = 'gallery',
    name,
    filesAllowed,
    containerClass,
    onImageUpload = () => {},
  } = props;

  const [getS3PreSignedUrl] = useLazyGetS3PreSignedUrlQuery();

  useEffect(() => {
    getRetry && getRetry(retryCallback);
  });

  const removeImage = async (imageItem) => {
    if (typeof imageItem?.id === 'string') {
      const index = pictures.findIndex((pic) => {
        return pic.id === imageItem.id;
      });
      const updatedPictures = [...pictures];
      updatedPictures.splice(index, 1);
      setPictures(updatedPictures);
    } else {
      const index = pictures.findIndex((pic) => {
        return pic.id === imageItem.id;
      });
      const updatedPictures = [...pictures];
      updatedPictures[index] = { ...updatedPictures[index], _destroy: true };
      setPictures(updatedPictures);
    }
  };

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const setFiles = (files) => {
    setPictures(files);
  };

  const retryCallback = (imageItem) => {
    pictures.map((pic) => {
      if (pic.inError && !pic.uploading && !pic.uploaded && pic?.id === imageItem?.id && !pic._destroy) {
        uploadFile(pic, getS3PreSignedUrl, attachmentType, 'nil', pictures, setFiles, true, false, undefined);
      }
    });
  };

  const getImageItem = (item) => {
    return (
      <ImageUploadItem
        key={item.id}
        onRetry={retryCallback}
        removeImage={removeImage}
        item={item}
        files={pictures}
        setFiles={setFiles}
        isSvg={false}
        getS3PreSignedUrl={() => getS3PreSignedUrl({ id: item.id })}
        makeBlob
        attachmentType={attachmentType}
        associationKey={null}
        previewKey={previewKey}
        selectOnClick={selectOnClick}
        selectMainOnDoubleClick={selectMainOnDoubleClick}
        fullPreviewKey={fullPreviewKey}
        showClose={showClose}
        viewType={viewType}
        onImageUpload={onImageUpload}
      />
    );
  };

  const handleFileAdd = async (files) => {
    const newFilesArray = await addBlobIdentifier(files);
    onFilesAdded(pictures, (pics) => setPictures(pics), newFilesArray, filesAllowed);
  };

  const renderUploadButton = (buttonProps) => {
    return (
      <UploadButton className={btnClassName} style={{ ...btnStyle }}>
        {isMobile && <Icon icon="FaImages" size={'18px'} color={tenantTheme['primary-color']} />}
        {btnText}
        <input
          style={{ display: 'none' }}
          type="file"
          accept={contentMappingForImages.join(',')}
          multiple={isSafari() ? false : true}
          onChange={async (e) => {
            const newFiles = e.target.files;
            await handleFileAdd(newFiles);
          }}
          onClick={(event) => {
            event.target.value = '';
          }}
          name={name}
          {...buttonProps}
        />
      </UploadButton>
    );
  };

  const onSortEnd = (oldIndex, newIndex) => {
    const oldIndexObject = pictures?.[oldIndex];

    const newPictures = [...pictures];
    newPictures?.splice(oldIndex, 1);
    newPictures?.splice(newIndex, 0, oldIndexObject);
    const orderedPictures = newPictures.map((image, index) => ({
      ...image,
      order: index + 1,
    }));
    setPictures(orderedPictures);
  };

  const itemsUploading = pictures?.some((e) => e.uploading);

  const renderImages = useCallback(() => {
    return viewType === 'list' ? (
      <SortableList
        className="list"
        onSortEnd={onSortEnd}
        draggedItemClassName=""
        style={itemsUploading ? { cursor: 'not-allowed', pointerEvents: 'none' } : {}}
      >
        {pictures
          .filter((e) => !e?._destroy)
          .map((pic, i) => (
            <SortableItem key={pic}>
              <div>{getImageItem(pic, i)}</div>
            </SortableItem>
          ))}
      </SortableList>
    ) : (
      <SortableList
        style={itemsUploading ? { cursor: 'not-allowed', pointerEvents: 'none' } : {}}
        className=""
        onSortEnd={onSortEnd}
        draggedItemClassName=""
      >
        <Space wrap={true}>
          {pictures
            .filter((e) => !e?._destroy)
            .map((pic, i) => (
              <SortableItem key={pic?.id}>
                <div>{getImageItem(pic, i)}</div>
              </SortableItem>
            ))}
        </Space>
      </SortableList>
    );
  }, [pictures]);

  return (
    <div className={`dzu-dropzone ${viewType === 'list' ? 'dropzone-list' : ''} ${containerClass}`}>
      {children(renderImages, renderUploadButton)}
    </div>
  );
});

// ImageUploadDropzone.propTypes = {
//   isSelectingMultiple: PropTypes.bool,
//   children: PropTypes.func.isRequired,
//   btnClassName: PropTypes.string,
//   btnText: PropTypes.string,
//   // btnStyle: PropTypes.object,
// };

const DropZone = (props) => {
  const { children, onDropCallback, className } = props;

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const fileDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    onDropCallback(files);
  };
  return (
    <div className={className} onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop}>
      {children}
    </div>
  );
};

export default ImageUploadDropzone;
