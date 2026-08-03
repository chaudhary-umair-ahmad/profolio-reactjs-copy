import cx from 'clsx';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getBaseURL } from '../../../utility/env';
import { Button, DrawerModal, Image } from '..';
import ImagePreviewGroup from '../image-preview-group/image-preview-group';
import { Modal } from '../modals/antd-modals';
import { ImageGalleryDrawer, ImageGallerySection, ImageModalContainer } from './styled';

const ImageGallery = ({ images, className, modalTitle, imagecount, rowTemplate, imgStyle, modalStyle, ...rest }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    if (images?.length > 0) {
      setVisible(true);
    }
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <ImageGalleryDrawer>
      <ImageGallerySection
        gap="8px"
        template={images?.length <= 1 ? '1fr' : '1fr 32%'}
        className={cx(className, 'gallery-container')}
        style={{ '--row-template': rowTemplate || (isMobile ? '40px' : '100px'), ...imgStyle }}
      >
        {images?.length < 1 && (
          <Image src={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`} style={{ width: '100%' }} />
        )}
        {images?.slice(0, imagecount).map((image) => (
          <Image key={image?.id} src={image?.sizes?.full} onClick={openModal} style={{ cursor: 'pointer', width: '100%' }} />
        ))}
        <div className={'gallery-btn'}>
          <Button
            size={isMobile ? 'small' : null}
            onClick={openModal}
            className="btn-transparent"
            icon="MdPhotoCamera"
            iconSize={isMobile ? '14px' : null}
          >
            {' '}
            {images?.length}
          </Button>
        </div>
      </ImageGallerySection>

      <DrawerModal
        title={modalTitle}
        visible={visible}
        onCancel={closeModal}
        centered
        height={'auto'}
        footer={null}
        {...rest}
      >
        <ImageModalContainer
          template={isMobile ? 'initial' : 'repeat(2,1fr)'}
          gap="24px 12px"
          className="scroll-y hide-scrollbar"
          style={{ '--box-height': '600px', position: 'relative', ...modalStyle }}
          {...rest}
        >
          <ImagePreviewGroup>
            {images?.map((image) => (
              <Image key={image.id} src={image.sizes?.full} preview={true} alt="thumbnail" onClick={closeModal} />
            ))}
          </ImagePreviewGroup>
        </ImageModalContainer>
      </DrawerModal>
    </ImageGalleryDrawer>
  );
};

export default ImageGallery;
