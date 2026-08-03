import tenantTheme from '@theme';
import { Col, Row, Typography } from 'antd';
import Countdown from 'antd/lib/statistic/Countdown';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, notification } from '..';
import { TIME_DATE_FORMAT } from '../../../constants/formats';
import { useGetLocation } from '../../../hooks';
import { getTimeDateString } from '../../../utility/date';
import { Button } from '../button/button';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import DataTable from '../dataTable/dataTable';
import Heading from '../heading/heading';
import { useDeleteStoryMutation } from '../../../apis/listings';

const { Text } = Typography;

const removeStoryColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Purpose', dataIndex: 'purpose', key: 'purpose' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  { title: 'Price', dataIndex: 'price', key: 'price' },
  { title: 'Listed Date', dataIndex: 'date', key: 'date' },
];

const renderDataTable = (label, tableClassName, data, columns) => {
  return (
    <>
      <div className="mb-8">{label}</div>
      <DataTable className={tableClassName} columns={columns} data={data} />
    </>
  );
};

const PopoverContent = (props) => {
  const { t } = useTranslation();
  const [deleteStory] = useDeleteStoryMutation();

  const { title, expiryTime, requestedAt, color, stories = {}, listing, stats, appliedDescription } = props;
  const [loading, setLoading] = useState(false);
  const removeStoryRef = useRef();

  const stroyAdContent = (story, storyPendingMessage = t('Request for story Ad is in pending state')) => {
    return (
      <>
        <Row gutter={12} align="top" style={{ minWidth: 200 }} className="mb-12">
          <Col xs={12}>
            <div style={{ fontSize: 12 }}>
              <strong>Posted On</strong>
              <div> {getTimeDateString(story?.published_at) || '-'} </div>
            </div>
          </Col>
          <Col xs={12}>
            <div style={{ fontSize: 12 }}>
              <strong>Posted Count</strong>
              <div>{story?.no_of_days || '-'}</div>
            </div>
          </Col>

          <Col xs={12}>
            <div style={{ fontSize: 12 }}>
              <strong>Story Views</strong>
              <div>{stats?.story_views_total || '-'} </div>
            </div>
          </Col>
          <Col xs={12}>
            <div style={{ fontSize: 12 }}>
              <strong>Time Remaining</strong>
              <Countdown
                value={getTimeDateString(story?.expired_at, TIME_DATE_FORMAT)}
                format={'HH [Hours]'}
                valueStyle={{ fontSize: 12 }}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={12} align="middle">
          {story?.story_id ? (
            <Button
              onClick={() => {
                setLoading(true);
                removeStoryRef?.current && removeStoryRef.current.showModal();
              }}
              transparented
              block
              style={{ borderColor: '#f5222d', '--btn-content-color': '#f5222d' }}
              loading={loading}
            >
              Remove
            </Button>
          ) : (
            <div>{storyPendingMessage}</div>
          )}
        </Row>
      </>
    );
  };

  const onDeleteStories = async () => {
    const response = await deleteStory({
      userId: listing?.listingOwner?.id,
      storyId: stories?.[0]?.story_id,
      listingId: listing?.property_id,
    });
    if (response) {
      setLoading(false);
      removeStoryRef?.current && removeStoryRef.current.hideModal();
      if (response?.error) {
        notification.error(response.error);
      } else if (response?.dontUpdate) {
        notification.error(response?.message);
      }
    }
  };

  return (
    <>
      <ConfirmationModal
        width={'708px'}
        ref={removeStoryRef}
        okText={'Delete Story'}
        onSuccess={onDeleteStories}
        onCancel={() => setLoading(false)}
      >
        <>
          {renderDataTable(
            <strong> Delete Stories</strong>,
            'mb-16',
            [
              {
                id: <>{listing?.property_id}</>,
                purpose: listing?.purpose,
                location: listing?.location?.title_long,
                price: listing?.price?.value,
                date: getTimeDateString(listing?.posted_on),
              },
            ],
            removeStoryColumns,
          )}
          <p className="color-gray-dark">
            The story of the following property will be destroyed. Are you sure you want to delete?
          </p>
        </>
      </ConfirmationModal>
      <Flex vertical gap="8px">
        <Row>
          <Heading as="h6" className="mb-0" style={{ color }}>
            {title}
          </Heading>
          <div>{appliedDescription && appliedDescription}</div>
        </Row>

        {title === 'Zameen Stories'
          ? stroyAdContent(stories?.[0])
          : (expiryTime || requestedAt) && (
              <div className="fz-12">
                {expiryTime && (
                  <Flex vertical gap="2px">
                    <Text type="secondary"> {t('Expiring on')}</Text>
                    <strong style={{ color: tenantTheme['base-color'] }}>{expiryTime}</strong>
                  </Flex>
                )}
                {requestedAt && (
                  <Flex vertical gap="2px">
                    <Text type="secondary">{t('Selected Date & Time')}</Text>
                    <strong style={{ color: tenantTheme['base-color'] }}>{requestedAt}</strong>
                  </Flex>
                )}
              </div>
            )}
      </Flex>
    </>
  );
};

export default PopoverContent;
