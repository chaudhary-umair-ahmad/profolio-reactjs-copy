import tenantApi from '@api';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Col, Row, Space, Tooltip } from 'antd';
import propTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Button,
  Card,
  EmptyState,
  Group,
  Heading,
  Icon,
  Number,
  Skeleton,
  TextInput,
  TextWithIcon,
  notification,
} from '../../../components/common';
import { Cards } from '../../../components/common/cards/frame/cards-frame';
import { IconStyled } from '../../../components/common/icon/IconStyled';
import {
  MailDetailsWrapper,
  MailRightAction,
  MessageAction,
  MessageReply,
  ReplyList,
} from '../../../components/inbox/style';
import { useRouteNavigate } from '../../../hooks';
import { getTimeDateString } from '../../../utility/date';
import { TENANT_KEY } from '../../../utility/env';
import { DATE_FORMAT, TIME_DATE_FORMAT } from '../../../constants/formats';
import { usePostReplyMutation } from '../../../apis/lms';

const Single = (props) => {
  const { t, i18n } = useTranslation();
  const navigate = useRouteNavigate();
  const { match, history, canReply, inboxFor, type, user, fetchCount } = props;
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [textError, setTextError] = useState(false);
  const [showReply, setShowReply] = useState(true);
  const [postReply, { isLoading: postLoading }] = usePostReplyMutation();

  const [state, setState] = useState({
    replyMessage: 0,
  });
  const [reply, setReply] = useState('');
  const { rtl } = useSelector((state) => ({ rtl: state.app.AppConfig.rtl }));
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  useEffect(() => {
    fetchMessage();
  }, []);

  const refreshState = (e) => {
    e.preventDefault();
    fetchMessage();
  };

  const fetchMessage = async () => {
    setLoading(true);
    const response = await tenantApi.getMessageDetail(user.id, match.params.id);
    setError('');
    if (response) {
      setLoading(false);
      if (response.error) {
        setError(response.error);
      } else {
        response?.conversation && setEmail(response?.conversation);
        fetchCount();
      }
    }
  };

  const sendReply = async (replyMessage) => {
    const response = await postReply({ message: replyMessage, messageId: match.params.id });
    if (response) {
      if (response.error) {
        notification.error(response.error);
      } else {
        setShowReply(false);
        setReply(null);
        setEmail(response);
      }
    }
  };

  const validateValue = useCallback(
    (value) => {
      if (value) {
        var regex =
          /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
        return regex.test(value);
      }
      return false;
    },
    [reply],
  );
  const getLocationTitle = useCallback(
    (item) =>
      item?.location?.breadcrumb
        .map((e) => tenantUtils.getLocalisedString(e, 'title'))
        .reverse()
        .join(', '),
    [email],
  );

  return (
    <MailDetailsWrapper>
      <Cards
        title={
          <MessageAction className="email-detail">
            <Button
              className="btn-icon"
              shape="cirle"
              icon={!rtl ? 'IoIosArrowBack' : 'IoIosArrowForward'}
              onClick={() => navigate(-1)}
            />
            <Tooltip placement="bottom" title={t('Refresh')}>
              <Button className="btn-icon" shape="cirle" icon="MdRefresh" onClick={refreshState} />
            </Tooltip>
          </MessageAction>
        }
        isbutton={
          <MailRightAction>
            <span>{t('1 - 50 of 235')}</span>
          </MailRightAction>
        }
      >
        {/* Listing Detail Card */}
        {TENANT_KEY === 'bayut' && (
          <Card style={{ backgroundColor: '#f5f5f5' }} bodyStyle={{ padding: isMobile ? 12 : 16 }}>
            <Row gutter={12} wrap={false} align={'middle'}>
              <Col flex="none">
                <img
                  src={email?.leadable?.image?.thumbnail}
                  width={isMobile ? 72 : 90}
                  height={isMobile ? 72 : 90}
                  style={{ borderRadius: '.4rem' }}
                />
              </Col>
              <Col flex="auto">
                <Group template="1fr" gap="2px">
                  <Number
                    type="price"
                    compact={false}
                    value={email?.leadable?.price}
                    style={{
                      color: tenantTheme['primary-color'],
                      fontWeight: 700,
                    }}
                  />

                  <div className={isMobile ? 'fs12' : 'fs14'}>{getLocationTitle(email?.leadable)}</div>

                  <div className="color-gray-dark">
                    {tenantUtils.getLocalisedString(email?.leadable?.type, 'title')} for{' '}
                    {tenantUtils.getLocalisedString(email?.leadable?.purpose, 'title')}
                  </div>
                  <Space size={30} className="color-gray-dark">
                    <TextWithIcon icon="IconBedroom" title={`${email?.leadable?.beds} ${t('Rooms')}`} />
                    <TextWithIcon icon="IconAreaSize" title={`${email?.leadable?.area_unit?.value} sqm`} />
                  </Space>
                </Group>
              </Col>
            </Row>
          </Card>
        )}

        <Row gutter={15}>
          <Col xs={24}>
            {loading && !error && <MailDetailSkeleton />}
            {error && <EmptyState message={error} onClick={() => fetchMessage()} buttonLoading={loading} />}
            {email?.messages?.length &&
              email.messages.map((item) => (
                <ReplyList>
                  {isMobile ? (
                    <>
                      <figure className="reply-view__content grid">
                        {item?.sender?.profile_image_url ? (
                          <img src={item?.sender?.profile_image_url} alt="" className="img" />
                        ) : (
                          <IconStyled className="img">
                            <Icon size={24} icon="FiUser" />
                          </IconStyled>
                        )}

                        <figcaption className="align-center-v">
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Heading as="h6" className="mb-0">
                              {tenantUtils.getLocalisedString(item?.sender, 'name')}
                            </Heading>
                            <div className="color-gray-dark d-flex fs12" style={{ gap: 10 }}>
                              {item?.sender?.email} <span className="text-muted">|</span> {item?.sender?.phone}
                            </div>
                          </div>
                        </figcaption>
                      </figure>

                      <figure className="reply-view__content d-flex mb-0">
                        <figcaption>
                          <div className="reply-content"> {tenantUtils.getLocalisedString(item, 'body')}</div>
                        </figcaption>
                      </figure>

                      <div className="color-gray-dark fs12 text-right">
                        {getTimeDateString(item.created_at, TIME_DATE_FORMAT)}
                      </div>
                    </>
                  ) : (
                    <>
                      <figure className="reply-view__content d-flex mb-0">
                        {item?.sender?.profile_image_url ? (
                          <img src={item?.sender?.profile_image_url} alt="" className="img" />
                        ) : (
                          <IconStyled className="img">
                            <Icon size={24} icon="FiUser" />
                          </IconStyled>
                        )}
                        <figcaption>
                          <Heading as="h6" className="fs16 mb-2 text-capitalize">
                            {tenantUtils.getLocalisedString(item?.sender, 'name')}
                          </Heading>
                          <div className="color-gray-dark mb-24 d-flex" style={{ gap: 12 }}>
                            {item?.sender?.email} <span className="text-muted">|</span> {item?.sender?.phone}
                          </div>
                          <div className="reply-content">{tenantUtils.getLocalisedString(item, 'body')}</div>
                        </figcaption>
                      </figure>

                      <div className="reply-view__meta color-gray-dark">
                        {getTimeDateString(item.created_at, DATE_FORMAT, true)}
                      </div>
                    </>
                  )}
                </ReplyList>
              ))}

            <MessageReply>
              {!showReply && !error && !!canReply && (
                <Button onClick={() => canReply && setShowReply(true)}>
                  <Icon icon="BsFillReplyAllFill" size={14} /> {t('Reply')}
                </Button>
              )}
              <div className="reply-form d-flex">
                {showReply && !error && !!canReply && (
                  <>
                    {!isMobile && (
                      <IconStyled className="img">
                        <Icon size={24} icon="FiUser" />
                      </IconStyled>
                    )}
                    <div className="text-right">
                      <TextInput
                        key="property_description"
                        value={reply}
                        handleChange={(e) => {
                          const value = e.target.value;
                          const check = validateValue(value);
                          setTextError(check);
                          setReply(e.target.value);
                        }}
                        lineCount={6}
                        errorMsg={textError ? t('Emojis are not allowed') : null}
                        placeholder={t('Type your message...')}
                        className="mb-4"
                      />
                      <Button
                        style={{ paddingInline: 40 }}
                        size="large"
                        type="primary"
                        onClick={() => {
                          sendReply(reply);
                        }}
                        loading={postLoading}
                        disabled={postLoading || !reply || textError}
                      >
                        {t('Send')}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </MessageReply>
          </Col>
        </Row>
      </Cards>
    </MailDetailsWrapper>
  );
};

const MailDetailSkeleton = () => {
  return (
    <Row gutter={15}>
      <Col xs={24}>
        {[1, 2, 3, 4].map((e) => (
          <ReplyList>
            <figure className="reply-view__content d-flex">
              <Skeleton size={50} className="img" type="avatar" />
              <Row gutter={[0, 12]} style={{ minWidth: 300 }}>
                <Skeleton width={150} type="button" />
                <Skeleton width={550} type="button" />
              </Row>
            </figure>
            <div className="reply-view__meta">
              <span className="meta-list">
                <span className="date-meta">
                  <Skeleton type="button" />
                </span>
              </span>
            </div>
          </ReplyList>
        ))}
      </Col>
    </Row>
  );
};

Single.propTypes = {
  match: propTypes.object,
  history: propTypes.object,
};

export default Single;
