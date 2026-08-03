import { Input, Row, Space } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Button,
  ConfirmationModal,
  DataTable,
  Heading,
  Number,
  Skeleton,
  notification,
  Drawer,
  DrawerModal,
} from '../../../../../components/common';

import tenantApi from '@api';
import { useTranslation } from 'react-i18next';
import NoImagesAvailable from '../../../../../components/no-images-available/NoImagesAvailable';
import { IconStoryAd } from '../../../../../components/svg';
import { useLazyFetchListingDetailQuery } from '../../../../../apis/listings';
import { useLazyGetS3PreSignedUrlQuery } from '../../../../../apis/common';
import ImageUploadItem from '../../../../../components/common/image-uploads/image-upload-item';

const postStoryColumns = [
  { title: 'ID', dataIndex: 'property_id', key: 'property_id' },
  { title: 'Purpose', dataIndex: 'purpose', key: 'purpose' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  { title: 'Price', dataIndex: 'price', key: 'price' },
];

const Table = ({ label, tableClassName, data, columns }) => (
  <>
    <div className="mb-8">{label}</div>
    <DataTable className={tableClassName} columns={columns} data={data} />
  </>
);
export const PostStoryModal = forwardRef((props, ref) => {
  const {
    isModalOpen,
    setIsModalOpen,
    userId,
    property_id,
    location,
    purpose,
    price,
    setStoryCreditDeduction,
    totalCredits,
    isMobile,
    setActionLoading,
  } = props;
  const { t } = useTranslation();
  const [days, setDays] = useState(0);
  const [storyCreditsAvaiable, setStoryCreditsAvaiable] = useState(0);
  const postStoryRef = useRef();
  const [fetchListingDetail, { data, isLoading: loading }] = useLazyFetchListingDetailQuery();
  const [getS3PreSignedUrl, { isLoading, isError }] = useLazyGetS3PreSignedUrlQuery();

  const list = [{ property_id, purpose: purpose?.title, location: location?.title, price: <Number {...price} /> }];

  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const onClose = () => {
    !isMobile && postStoryRef?.current && postStoryRef.current.hideModal();
    setActionLoading(false);
    setIsModalOpen(false);
    setDays(0);
  };

  useEffect(() => {
    isModalOpen && fetchListingImages();
  }, [isModalOpen]);

  const fetchListingImages = async () => {
    const response = await fetchListingDetail({ userId: userId, listingId: property_id });
    if (response) {
      if (response.error) {
        setError(response.error);
      } else {
        setImages(response?.data?.active_images);
      }
    }
  };

  useEffect(() => {
    setStoryCreditsAvaiable(totalCredits);
  }, [totalCredits]);

  useImperativeHandle(ref, () => ({
    showPostStoryModal() {
      !isMobile && postStoryRef?.current && postStoryRef.current.showModal();
      setIsModalOpen(true);
    },
  }));

  const handlePostStory = () => {
    if (days === 0) {
      notification.error(t('Number of days cannot be zero'));
      return;
    }
    if (images?.filter((e) => e.selected).length === 0) {
      notification.error(t('Please select atleast one image'));
      return;
    }
    !isMobile && postStoryRef?.current && postStoryRef.current.hideModal();
    setIsModalOpen(false);
    setStoryCreditDeduction(
      days,
      images
        .filter((e) => e.selected)
        .map((e) => {
          return e.id.toString();
        }),
      totalCredits,
    );
  };

  const ImageBankSkeleton = () => {
    return (
      <Space>
        <Skeleton size={96} type="image" />
        <Skeleton size={96} type="image" />
        <Skeleton size={96} type="image" />
      </Space>
    );
  };

  const renderImages = () => {
    return loading ? (
      <Space>
        <ImageBankSkeleton />
      </Space>
    ) : error ? (
      <p>{error}</p>
    ) : images?.length > 0 ? (
      <Space wrap>
        {images?.map((item) => {
          return (
            <ImageUploadItem
              key={item.id}
              item={item}
              getS3PreSignedUrl={getS3PreSignedUrl}
              files={images}
              setFiles={setImages}
              isSvg={false}
              makeBlob
              associationKey={null}
              previewKey={'thumbnail'}
              selectOnClick={() => {}}
              fullPreviewKey={'large'}
              showClose={false}
              showDuplicateWarning={false}
            />
          );
        })}
      </Space>
    ) : (
      <NoImagesAvailable />
    );
  };

  const content = () => (
    <>
      {!isMobile && <Table label="Post a Story" tableClassName="mb-24" data={list} columns={postStoryColumns} />}
      <div className="mb-8">
        {!isMobile && <hr className="light mb-20" />}
        <Heading as="h6" className="mb-16">
          {t('Select Property Images')}
        </Heading>
        {renderImages()}
      </div>
      <Row
        align="middle"
        justify="space-between"
        wrap={false}
        style={{ backgroundColor: '#F5F5F5', borderRadius: 10 }}
        className="p-12"
      >
        <div>
          <p className="mb-0">{t('Set number of days')}</p>
          <p className="mb-0 flex align-content-center color-gray-lightest fs12">
            {`${storyCreditsAvaiable} ${t('story credits available')}`}{' '}
            <IconStoryAd color="#00a651" size={16} style={{ marginInlineStart: 6 }} />
          </p>
        </div>

        <div>
          <Button
            onClick={() => setDays(days - 1)}
            disabled={days === 0}
            icon="HiMinus"
            iconSize="1em"
            // transparented
            style={{ '--btn-bg-color': '#fff', '--btn-content-color': '#000' }}
          />
          <Input
            className="counter-input text-center"
            style={{ width: 42, height: 34, border: 'none', backgroundColor: 'transparent' }}
            size="small"
            value={days}
          />
          <Button
            onClick={() => setDays(days + 1)}
            disabled={days === Math.floor(storyCreditsAvaiable)}
            icon="HiPlus"
            iconSize="1em"
            transparented
            style={{ '--btn-bg-color': '#fff', '--btn-content-color': '#000' }}
          />
        </div>
      </Row>
    </>
  );
  return (
    <DrawerModal
      visible={isModalOpen}
      width={500}
      // contentWrapperStyle={{ minWidth: '100%' }}
      title={t('Post a Story')}
      placement="bottom"
      onCancel={onClose}
      footer={
        <Row justify="space-between">
          <Button
            onClick={() => {
              setDays(0);
              setImages(
                images.map((image) => ({
                  ...image,
                  selected: false,
                })),
              );
            }}
          >
            Reset
          </Button>
          <Button type="primary" onClick={handlePostStory}>
            Post
          </Button>
        </Row>
      }
    >
      {content()}
    </DrawerModal>
  );
});
