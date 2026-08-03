import tenantRoutes from '@routes';
import React, { useState, useEffect, useRef } from 'react';
import { ReactAudioContainer } from '../styled';
import { Button, Flex, notification, Popover, Skeleton } from '../../common';
import { t } from 'i18next';
import { useLazyGetLeadCallRecordingQuery } from '../../../apis/lms';
import { recordingClickEvent } from '../../../services/analyticsService';
import { useGetLocation } from '../../../hooks';
import { useSelector } from 'react-redux';
const CallRecording = (props) => {
  const { recording_uuid, leadId, showPlayButton = true } = props;
  const [popupVisible, setPopupVisible] = useState(false);
  const [callURL, setCallURL] = useState(null);
  const [getLeadCallRecording, { isFetching: loading }] = useLazyGetLeadCallRecordingQuery();
  const location = useGetLocation();
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const user = useSelector((state) => state.app.loginUser?.user);
  const audioElementRef = useRef(null);
  const getCallRecording = async (e) => {
    recordingClickEvent(user, location?.pathname == tenantRoutes.app('', false, user).leads_dashboard.path, leadId);
    e?.stopPropagation();
    const response = await getLeadCallRecording({ recording_uuid });
    if (response) {
      if (response?.error) {
        notification.error(response?.error);
        setPopupVisible(false);
      } else {
        setCallURL(response?.data);
      }
    }
  };

  useEffect(() => {
    if (!showPlayButton) {
      getCallRecording();
    }
  }, [showPlayButton, recording_uuid]);

  const handleOpenChange = (visible) => {
    setPopupVisible(visible);

    if (!visible) {
      const audioElement = audioElementRef?.current;
      if (audioElement) {
        audioElement?.pause();
        audioElement.currentTime = 0;
      }
    }
  };

  const renderCallPlaybackSkeleton = () => {
    return (
      <Flex vertical gap="2px">
        {[1].map(() => (
          <>
            <Skeleton
              style={{
                height: '30px',
                width: showPlayButton ? 395 : '100%',
                maxWidth: showPlayButton ? 395 : '100%',
                margin: 8,
              }}
            />
          </>
        ))}
      </Flex>
    );
  };
  const renderCallPlayback = () => {
    return (
      <>
      {loading ? (
          renderCallPlaybackSkeleton()
        ) : (
          <ReactAudioContainer
            className="react-audio-player"
            src={callURL}
            controls
            $drawer={!showPlayButton}
            style={{ margin: isMobile ? 8 : 0 }}
            onCanPlay={(e) => {
              audioElementRef.current = e.target;
            }}
          />
        )}
      </>
    );
  };

  if (showPlayButton) {
    return (
      <Popover
        placement="bottomLeft"
        content={renderCallPlayback()}
        trigger="click"
        open={popupVisible}
        onOpenChange={handleOpenChange}
      >
        <Button
          size="small"
          type="link"
          icon="MdPlayCircleOutline"
          className="p-0"
          onClick={getCallRecording}
          style={{ justifyContent: 'start', '--ant-control-height-sm': '20px' }}
        >
          {t('Play Recording')}
        </Button>
      </Popover>
    );
  }

  return <>{renderCallPlayback()}</>;
};
export default CallRecording;
