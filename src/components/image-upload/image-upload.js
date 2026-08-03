import { addBlobIdentifier, onFilesAdded, uploadFile } from '../../helpers/fileHelpers/imageUploadHelper';
import { Button, Group, Title, ErrorMessage, Flex } from '../common';

import React from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploadItem from '../common/image-uploads/image-upload-item';
import Label from '../common/Label/Label';
import { useLazyGetS3PreSignedUrlQuery } from '../../apis/common';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Lottie from '../common/lottie/lottie';
import appConstants from '@constants';
import ProfilePictureGuidelinesModal from '../../container/pages/user-settings/imageGuidelinesModal';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLazyImageAnalyserQuery } from '../../apis/user';
import uploadFileLottie from './upload.json';

const contentMappingForImages = ['image/jpeg', 'image/png'];

const handleFileAdd = async (images, setImages, newImages) => {
  const newImagesArray = await addBlobIdentifier(newImages);
  onFilesAdded(images, setImages, newImagesArray);
};

const ImageUpload = (props) => {
  const { t } = useTranslation();
  const {
    images,
    setImages,
    multi,
    attachmentType = 'generic',
    associationKey,
    btnText,
    imageDescription,
    imageGuidelines,
    onApprovalChange,
    fetchingAnalysis,
    hasLottie = false,
    uploadClass,
    buttonStyle,
    checkAnalyzerError,
    errorMsg,
    showClose = true,
    ...rest
  } = props;
  const [getS3PreSignedUrl, { isLoading, isError }] = useLazyGetS3PreSignedUrlQuery();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [triggerImageAnalysis, { data: analysisData, isError: analysisError, isFetching: analysisFetching }] =
    useLazyImageAnalyserQuery();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const renderInput = () => {
    return (
      <input
        id={`image-upload-${props.name}`}
        style={{ display: 'none' }}
        type="file"
        accept={contentMappingForImages.join(',')}
        multiple={multi}
        onChange={async (e) => {
          const newFiles = e.target.files;
          await handleFileAdd(images, (pics) => setImages(pics), newFiles);
        }}
        onClick={(event) => {
          event.target.value = '';
        }}
      />
    );
  };

  const renderUploadButton = () => {
    const shouldNotCrop = props?.attachmentType === 'user_cnic_back' || props?.attachmentType === 'user_cnic_front';
    const upload = (
        <Upload
          accept={contentMappingForImages.join(',')}
          beforeUpload={async (file) => {
            await handleFileAdd(images, setImages, [file]);
            return false;
          }}
          className={uploadClass}
        >
          <Button
            type="primaryOutlined"
            style={{
              borderStyle: 'dashed',
              ...buttonStyle,
            }}
            className="px-24"
          >
            {hasLottie && (
              <div>
                <Lottie
                  width={'40px'}
                  height={'auto'}
                  style={{ margin: '0px 0px' }}
                  animationData={uploadFileLottie}
                  loop={false}
                  autoplay={false}
                />
              </div>
            )}
            {t(btnText) || t('Browse and Upload')}
          </Button>
        </Upload>
    );
    return shouldNotCrop ? (
      upload
    ) : (
      <ImgCrop modalClassName="imageCrop" modalTitle={t('Edit Image')} modalOk={t('OK')} modalCancel={t('Cancel')}>
        {upload}
      </ImgCrop>
    );
  };

  const removeImage = (imageItem) => {
    let newImages = [...images];
    newImages = newImages.filter((pic) => pic?.id != imageItem?.id || pic?.gallerythumb != imageItem?.gallerythumb);
    setImages(newImages);
  };

  const retryCallback = () => {
    images.map((pic) => {
      if (pic.inError && !pic.uploading && !pic.uploaded) {
        uploadFile(pic, attachmentType, 'nil', images, setImages, true, false, undefined);
      }
    });
  };

  const renderImages = () => {
    return images?.map((item) => (
      <div key={item.id} style={{ position: 'relative', display: 'inline-block' }}>
        <ImageUploadItem
          key={item?.id || item?.gallerythumb}
          getS3PreSignedUrl={getS3PreSignedUrl}
          onRetry={retryCallback}
          removeImage={removeImage}
          item={item}
          files={images}
          setFiles={setImages}
          isSvg={false}
          makeBlob
          attachmentType={attachmentType}
          associationKey={null}
          imageAnalyser={triggerImageAnalysis}
          analyzing={analysisFetching}
          analyzeError={analysisError}
          borderRadius="6px"
          showClose={showClose}
        />

        {(item.uploading || analysisFetching) && (
          <div className="img-status">
            {item.uploading && (
              <div className="loader">
                <span className="fw-600" style={{ color: '#fff' }}>
                  Uploading...
                </span>
              </div>
            )}
            {analysisFetching && (
              <div className="loader">
                <span className="fw-600" style={{ color: '#fff' }}>
                  Checking...
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    ));
  };
  const showGuidelinesModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Group className={rest.className} template="initial" gap="8px">
        <Label>{props.label}</Label>
        <Flex gap={isMobile ? '6px' : '54px'} align={isMobile && 'center'} wrap={isMobile ? true : false}>
          <div className={isMobile && 'w-100'}>
            {renderImages()}
            {renderInput()}
            <div>{images.length === 0 ? renderUploadButton() : multi && renderUploadButton()}</div>
          </div>
          {!appConstants.IMAGE_ANALYSER && imageDescription && imageDescription}
          {appConstants.IMAGE_ANALYSER && props?.attachmentType === 'user_profile' && (
            <div>
              <Title level={5} className="mb-0" style={{ fontSize: isMobile && '14px' }}>
                {t('Profile Picture Guidelines:')}
              </Title>
              {imageGuidelines && <div>{imageGuidelines}</div>}

              <Button
                type="link"
                icon="FaArrowRight"
                onClick={showGuidelinesModal}
                className="p-0 mb-0"
                style={{ flexDirection: 'row-reverse', height: 'max-content' }}
                size={'small'}
              >
                {t('Learn more')}
              </Button>
            </div>
          )}
        </Flex>
        {errorMsg && <ErrorMessage message={errorMsg} />}
        {images?.map(
          (item, index) =>
            item?.analyseError &&
            item?.analyseError.length > 0 && <ErrorMessage key={index} message={item.analyseError[0]} />,
        )}
      </Group>

      {appConstants.IMAGE_ANALYSER && (
        <ProfilePictureGuidelinesModal visible={isModalVisible} onCancel={handleModalCancel} />
      )}
    </>
  );
};

export default ImageUpload;
