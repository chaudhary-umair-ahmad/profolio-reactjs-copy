import React, { useEffect, useState } from 'react';
import { Button, Card, EmptyState, Heading, Icon, Skeleton, notification } from '../common';
import { EmailAuthor, EmailHeader, MobileEmail, Style } from './style';

import tenantApi from '@api';
import tenantRoutes from '@routes';
import { Row, Space } from 'antd';
import cx from 'clsx';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFetchOnQueryUpdate, useGetLocation, useGetParams, useRouteNavigate } from '../../hooks';
import { getTimeDateString } from '../../utility/date';
import { ellipsis, stSlash } from '../../utility/utility';
import Topbar from './Topbar';
import { useDeleteMailThreadMutation, useLazyGetMailboxQuery, useUntrashTheadMutation } from '../../apis/lms';

const Content = (props) => {
  const { folderId } = useGetParams();
  const location = useGetLocation();

  const { user, type, folders, fetchCount, permanentDelete, currentRoute } = props;
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [state, setState] = useState({ selectedRowKeys: [], emails: messages, sort: true });
  const { rtl } = useSelector((state) => ({ rtl: state.app.AppConfig.rtl }));
  const { selectedRowKeys, emails, sort } = state;
  const navigate = useRouteNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const inboxMobileRoutePath = stSlash(tenantRoutes.app().inbox.path);
  const [deleteMailThread] = useDeleteMailThreadMutation();
  const [untrashThead] = useUntrashTheadMutation();

  const { fetchData } = useFetchOnQueryUpdate((params) => user?.id && fetchMessages(params), [user?.id, type]);
  const [getMailbox, { isLoading, error, isError }] = useLazyGetMailboxQuery();
  const fetchMessages = async (params) => {
    setState((prevState) => ({ ...prevState, selectedRowKeys: [] }));
    const response = await getMailbox({ type: type, params: params, userId: user?.id });
    if (response) {
      if (!response.error) {
        setMessages(response?.data?.conversations);
        setPagination(response?.data.pagination);
      }
    }
  };

  useEffect(() => {
    setState({ emails: messages, selectedRowKeys, sort });
  }, [messages, selectedRowKeys, sort]);

  const refreshState = (e) => {
    e.preventDefault();
    fetchData();
  };

  const onDelete = async (ids) => {
    setDeleteLoading(true);
    const response = await deleteMailThread({ ids });
    if (response) {
      setDeleteLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        fetchData();
        fetchCount(user?.id);
      }
    }
  };

  const onPermanentDelete = async (id) => {
    setDeleteLoading(true);

    const response = await untrashThead({ id });
    if (response) {
      setDeleteLoading(false);
      if (response.error) {
        notification.error(response.error);
      } else {
        fetchData();
        fetchCount(user.id);
      }
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    setState({ ...state, sortedInfo: sorter });
  };

  const onRowSelection = (byValue) => {
    setState((prevState) => ({ ...prevState, selectedRowKeys: [] }));
    let newSelectedRowKeys = emails
      .filter((filterObj) => {
        return filterObj.unread_messages == byValue;
      })
      .map((email) => {
        0;
        return email.id;
      });

    return newSelectedRowKeys;
  };

  const onSelectChange = (selectedRowKey) => {
    setState({ ...state, selectedRowKeys: selectedRowKey });
  };

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const data = [];
  if (emails !== undefined)
    emails.forEach((inbox, key) => {
      const { id, subject, latest_message: message, unread_messages } = inbox;
      const { user_to_show: sender, body, created_at: time } = message || {};
      isMobile
        ? data.push({
            key: id,
            name: (
              <div>
                <EmailAuthor className="mb-24">
                  <Link to={`${location.pathname}/${id}`}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Heading as="h6" className="mb-2">
                        {sender?.name}
                      </Heading>
                    </div>
                  </Link>
                </EmailAuthor>
                <span className="email-time">{getTimeDateString(time) || ''}</span>
                <span className="action-icons">
                  <Space align="center">
                    <Button
                      className="btn-icon m-0"
                      type="primary"
                      shape="circle"
                      icon={permanentDelete ? 'MdSettingsBackupRestore' : 'BsTrash'}
                      onClick={() => (permanentDelete ? onPermanentDelete(id) : onDelete([id]))}
                    />
                  </Space>
                </span>
              </div>
            ),
            content: (
              <EmailHeader>
                <Link to={`${location.pathname}/${id}`}>
                  <Heading as="h6" className="mb-0 fw-500 fs13">
                    {subject}
                    {unread_messages > 0 && <span className={`mail-badge primary`}>{'Unread'}</span>}
                  </Heading>
                  <p className="color-gray-dark mb-0">
                    {body ? ellipsis(body?.replace(/(<([^>]+)>)/g, ' '), isMobile ? 10 : 100) : ''}
                  </p>
                </Link>
              </EmailHeader>
            ),
            linkTo: `${location.pathname}/${id}`,
          })
        : data.push({
            key: id,
            name: (
              <EmailAuthor className={unread_messages === 0 && 'read-email'}>
                <Link to={`${location.pathname}/${id}`} className="d-flex" style={{ flexDirection: 'column' }}>
                  <Heading as="h6" className="mb-8">
                    {sender?.name}
                  </Heading>
                  <p className="color-gray-dark mb-0">{sender?.email}</p>
                  <p className="color-gray-dark mb-0">{sender?.phone}</p>
                </Link>
              </EmailAuthor>
            ),
            content: (
              <EmailHeader className={unread_messages === 0 && 'read-email'}>
                <Link to={`${location.pathname}/${id}`}>
                  <Heading as="h6" className="mb-8">
                    {subject}
                    {unread_messages > 0 && <span className={`mail-badge primary`}>{'Unread'}</span>}
                  </Heading>
                  <p className="color-gray-dark mb-0">
                    {body ? ellipsis(body?.replace(/(<([^>]+)>)/g, ' '), isMobile ? 10 : 100) : ''}
                  </p>
                </Link>
              </EmailHeader>
            ),
            time: (
              <div>
                <span className="email-time">{getTimeDateString(time) || ''}</span>
                <span className="action-icons">
                  <Space align="center">
                    <Button
                      className="btn-icon m-0"
                      loading={deleteLoading}
                      type="primary"
                      shape="circle"
                      icon={permanentDelete ? 'MdSettingsBackupRestore' : 'BsTrash'}
                      onClick={(event) => {
                        event.stopPropagation();
                        //event.preventDefault();
                        permanentDelete ? onPermanentDelete(id) : onDelete([id]);
                      }}
                    />
                  </Space>
                </span>
              </div>
            ),
            linkTo: `${location.pathname}/${id}`,
          });
    });

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideDefaultSelections: true,
    selections: [
      {
        key: 'all',
        text: 'All',
        onSelect: () => {
          const newSelectedRowKeys = messages.map((item) => item.id);
          setState((prevState) => ({ ...prevState, selectedRowKeys: newSelectedRowKeys }));
        },
      },
      {
        key: 'read',
        text: 'Read',
        onSelect: () => {
          const newSelectedRowKeys = onRowSelection('0');
          setState((prevState) => ({ ...prevState, selectedRowKeys: newSelectedRowKeys }));
        },
      },
      {
        key: 'unread',
        text: 'Unread',
        onSelect: () => {
          const newSelectedRowKeys = onRowSelection('1');
          setState((prevState) => ({ ...prevState, selectedRowKeys: newSelectedRowKeys }));
        },
      },
    ],
  };

  const renderPagination = () => {
    return (
      <div
        className={cx('email-top-right d-flex align-items-center', !isMobile && 'mb-8')}
        style={{
          justifyContent: 'end',
          paddingTop: isMobile && 10,
        }}
      >
        {pagination && !!pagination.totalCount && (
          <>
            <span className="page-number">
              {pagination.current === 1 ? 1 : (pagination?.current - 1) * pagination?.pageCount + 1} -
              {pagination.totalCount > pagination?.current * pagination?.pageCount
                ? pagination?.current * pagination?.pageCount
                : pagination?.totalCount}{' '}
              of {pagination.totalCount}
            </span>
            <div className="pagination-slider">
              <Link
                className="btn-paging"
                to={`${location.pathname}?page=${pagination.prevPage}`}
                disabled={!pagination.prevPage}
              >
                <Icon icon={!rtl ? 'IoIosArrowBack' : 'IoIosArrowForward'} size={14} />
              </Link>
              <Link
                className="btn-paging"
                to={`${location.pathname}?page=${pagination.nextPage}`}
                disabled={!pagination.nextPage}
              >
                <Icon icon={rtl ? 'IoIosArrowBack' : 'IoIosArrowForward'} size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    );
  };

  const columns = isMobile
    ? [
        {
          title: (
            <>
              <Topbar
                refreshState={refreshState}
                showTopbar={!!selectedRowKeys.length}
                onDeleteClick={() => (permanentDelete ? onPermanentDelete(selectedRowKeys) : onDelete(selectedRowKeys))}
                // onFolderClick={folderId => onMoveToFolder(selectedRowKeys, folderId)}
                folders={folders.filter((folder) => folder.id != folderId)}
              />
            </>
          ),
          dataIndex: 'name',
        },
        {
          title: (
            <>
              <div className="email-top-right d-flex align-items-center">
                {pagination && !!pagination.totalCount && (
                  <>
                    <span className="page-number">
                      {pagination.current === 1 ? 1 : (pagination?.current - 1) * pagination?.pageCount + 1} -
                      {pagination.totalCount > pagination?.current * pagination?.pageCount
                        ? pagination?.current * pagination?.pageCount
                        : pagination?.totalCount}{' '}
                      of {pagination.totalCount}
                    </span>
                    <div className="pagination-slider" style={{ marginInlineEnd: 0 }}>
                      <Link
                        className="btn-paging"
                        to={`${location.pathname}?page=${pagination.prevPage}`}
                        disabled={!pagination.prevPage}
                      >
                        <Icon icon={!rtl ? 'IoIosArrowBack' : 'IoIosArrowForward'} size={14} />
                      </Link>
                      <Link
                        className="btn-paging"
                        to={`${location.pathname}?page=${pagination.nextPage}`}
                        disabled={!pagination.nextPage}
                      >
                        <Icon icon={rtl ? 'IoIosArrowBack' : 'IoIosArrowForward'} size={14} />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </>
          ),
          dataIndex: 'content',
        },
      ]
    : [
        {
          title: (
            <Topbar
              refreshState={refreshState}
              showTopbar={!!selectedRowKeys.length}
              onDeleteClick={() => (permanentDelete ? onPermanentDelete(selectedRowKeys) : onDelete(selectedRowKeys))}
              folders={folders.filter((folder) => folder.id != folderId)}
            />
          ),
          dataIndex: 'name',
          width: '150px',
        },
        {
          dataIndex: 'content',
          width: '60%',
        },
        {
          title: (
            <>
              <div className="email-top-right d-flex align-items-center">
                {pagination && !!pagination.totalCount && (
                  <>
                    <span className="page-number">
                      {pagination.current === 1 ? 1 : (pagination?.current - 1) * pagination?.pageCount + 1} -
                      {pagination.totalCount > pagination?.current * pagination?.pageCount
                        ? pagination?.current * pagination?.pageCount
                        : pagination?.totalCount}{' '}
                      of {pagination.totalCount}
                    </span>
                    <div className="pagination-slider" style={{ marginInlineEnd: 0 }}>
                      <Link
                        className="btn-paging"
                        to={`${location.pathname}?page=${pagination.prevPage}`}
                        disabled={!pagination.prevPage}
                      >
                        <Icon icon={!rtl ? 'IoIosArrowBack' : 'IoIosArrowForward'} size={14} />
                      </Link>
                      <Link
                        className="btn-paging"
                        to={`${location.pathname}?page=${pagination.nextPage}`}
                        disabled={!pagination.nextPage}
                      >
                        <Icon icon={rtl ? 'IoIosArrowBack' : 'IoIosArrowForward'} size={14} />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </>
          ),
          dataIndex: 'time',
          key: 'time',
          width: '90px',
        },
      ];

  const renderMobileInbox = () => {
    return emails?.length ? (
      <>
        {emails.map((e, i) => (
          <MobileEmail
            key={i}
            className={e.unread_messages === 0 ? 'read-email' : ''}
            onClick={() => navigate(`${inboxMobileRoutePath}/${currentRoute}/${e?.id}`)}
          >
            <Row justify="space-between" align="middle">
              <Heading as="h6">{e?.latest_message?.user_to_show?.name}</Heading>
              <span className="color-gray-light">{getTimeDateString(e?.latest_message?.created_at) || ''}</span>
            </Row>
            <Row justify="space-between" align="start">
              <div>
                <div>{e?.subject}</div>
                <p className="color-gray-dark mb-0">
                  {e?.latest_message?.body
                    ? ellipsis(e?.latest_message?.body?.replace(/(<([^>]+)>)/g, ' '), isMobile ? 10 : 100)
                    : ''}
                </p>
              </div>

              <Button
                className="btn-icon m-0"
                type="primary"
                shape="circle"
                icon={permanentDelete ? 'MdSettingsBackupRestore' : 'BsTrash'}
                iconSize="14px"
                loading={deleteLoading}
                onClick={(event) => {
                  event.stopPropagation();
                  permanentDelete ? onPermanentDelete(e?.id) : onDelete([e?.id]);
                }}
              />
            </Row>
          </MobileEmail>
        ))}
        {renderPagination()}
      </>
    ) : isLoading ? (
      [1, 2, 3]?.map((e, i) => (
        <Card key={i} className="mb-12" onClick={() => {}}>
          <Skeleton />
        </Card>
      ))
    ) : (
      <EmptyState type="table" />
    );
  };

  return error ? (
    <EmptyState
      title={t('Error')}
      message={error}
      onClick={() => {
        fetchData();
      }}
      buttonLoading={isLoading}
    />
  ) : isMobile ? (
    <>{renderMobileInbox()}</>
  ) : data.length ? (
    <Style
      className={cx('table-responsive', isMobile && 'inbox-mobile mb-0')}
      pagination={false}
      columns={columns}
      dataSource={data}
      onChange={handleChange}
      loading={isLoading}
      tableLayout={'fixed'}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            navigate(`${location.pathname}/${record?.key}`);
          },
        };
      }}
    />
  ) : (
    <Card>
      <EmptyState type="table" hideRetryButton />
    </Card>
  );
};

Content.propTypes = {};

export default Content;
