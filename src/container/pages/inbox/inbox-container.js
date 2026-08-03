import tenantApi from '@api';
import tenantRoutes from '@routes';
import tenantUtils from '@utils';
import { Col, Radio, Row, Space, Spin } from 'antd';
import cx from 'clsx';
import propTypes from 'prop-types';
import {
  default as React,
  default as React,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import InboxPages from '.';
import { Card, Heading, Icon, Navbar, Select } from '../../../components/common';
import { RadioButtonStyled } from '../../../components/common/radio-button/styled';
import { EmailWrapper } from '../../../components/inbox/style';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';
import { useGetLocation, useOutsideClick, usePageTitle, useRouteNavigate } from '../../../hooks';
import { stSlash } from '../../../utility/utility';
import { Main } from '../../styled';
import { NavWrapper } from '../user-settings/style';
import { BadgeMobileStyle } from './style';

const InboxContainer = ({ match }) => {
  const { routePath: routeMatchPath } = useGetLocation();

  const { t, i18n } = useTranslation();
  usePageTitle(t('Inbox - Profolio'));

  const inboxRoutes = useCallback(
    (path, countDetails) => {
      return [
        {
          key: 'received',
          path: `${path}/received`,
          Component: 'InboxPage',
          name: 'Inbox',
          icon: 'FiInbox',
          label: 'Inbox',
          badge: countDetails?.['unread_conversations_count'],
          type: 'inbox',
          key: 'received',
          sub: [{ path: `${path}/received/:id`, Component: 'MailDetailViewPage', canReply: true }],
        },
        {
          key: 'trash',
          path: `${path}/trash`,
          Component: 'TrashPage',
          name: 'Trash',
          icon: 'FiTrash2',
          badge: '',
          type: 'deleted',
          label: 'Trash',
          value: 'trash',
          key: 'trash',
          sub: [{ path: `${path}/trash/:id`, Component: 'MailDetailViewPage', canReply: false }],
        },
      ];
    },
    [i18n.language],
  );

  const routes = useCallback(
    (path) => [
      ...inboxRoutes(path, null),
      {
        path: `${path}/folder/:folderId`,
        Component: 'FolderPage',
        type: 'folder',
        sub: [{ path: `${path}/folder/:folderId/:id`, Component: 'MailDetailViewPage', canReply: true }],
      },
    ],
    [i18n.language],
  );

  const pathName = path.split(':')[0];
  const [state, setState] = useState({ responsive: 0, collapsed: false });
  const { collapsed } = state;
  const { user } = useSelector((state) => state.app.loginUser);

  const [selectedUser, setUser] = useState(user);
  const [folders, setFolders] = useState([]);
  const [navLinks, setNavLinks] = useState(inboxRoutes(stSlash(routeMatchPath), null));
  const users = useSelector((state) => state.app.userGroup.list);
  const [tab, setTab] = useState('received');
  const controlRef = useRef();
  const navigate = useRouteNavigate();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    function updateSize() {
      const width = window.innerWidth;
      setState({ responsive: width });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const toggleCollapsed = () => {
    setState({ ...state, collapsed: !collapsed });
  };
  useOutsideClick(controlRef, () => {
    setState({ ...state, collapsed: false });
  });

  useEffect(() => {
    if (selectedUser?.id) {
      fetchCount(selectedUser?.id);
      navigate({ pathname: '/inbox/received' });
    }
  }, [selectedUser?.id]);

  const fetchCount = async (userId) => {
    setLoading(true);
    const response = await tenantApi.getMailCount(userId);
    if (response) {
      setLoading(false);
      setNavLinks(inboxRoutes(stSlash(routeMatchPath), response.data));
    }
  };

  const inBoxWeb = () => {
    return (
      <Main>
        <NavWrapper>
          {!!user?.permissions?.[PERMISSIONS_TYPE.INBOX] && (
            <Space
              className="flex"
              style={{
                justifyContent: 'space-between',
              }}
            >
              <Heading as="h5" className="mb-0">
                {t('Inbox')}
              </Heading>
              <Space className="flex">
                <Heading as="h6" className="color-gray-dark fw-600">
                  {t('Select Inbox for:')}
                </Heading>

                <Select
                  value={selectedUser?.id}
                  options={[{ id: -1, name: t('All') }, ...users]}
                  onChange={(value, option) => {
                    setUser(option);
                  }}
                  getOptionLabel={(op) => {
                    return `${tenantUtils.getLocalisedString(op, 'name')} ${op.id === user?.id ? t('(Me)') : ''}`;
                  }}
                  valueAsObj
                  className="mb-12"
                  style={{
                    width: 200,
                  }}
                  inputLoading={loading}
                />
              </Space>
            </Space>
          )}
          <Row className="justify-content-center" gutter={isMobile ? 0 : 10}>
            <Col
              // className="trigger-col"
              lg={6}
              xs={24}
            >
              <Card
                bodyStyle={{
                  padding: '16px 20px',
                }}
                style={{
                  position: 'sticky',
                  top: 94,
                }}
                headless
              >
                <Navbar paths={navLinks} path={pathName} />
              </Card>
            </Col>

            <Col lg={18} xs={24}>
              <EmailWrapper>
                <Routes>
                  <Suspense
                    fallback={
                      <div className="spin">
                        <Spin />
                      </div>
                    }
                  >
                    {inboxRoutes(stSlash(routeMatchPath), !!user?.permissions?.[PERMISSIONS_TYPE.INBOX]).map((e, i) => {
                      const PageComponent = InboxPages[e.Component] ? InboxPages[e.Component] : () => null;
                      return [
                        <Route
                          path={e.path}
                          key={i}
                          element={
                            <PageComponent
                              {...props}
                              user={selectedUser}
                              type={e.type}
                              folders={folders}
                              fetchCount={() => fetchCount(selectedUser?.id)}
                              permanentDelete={e.type.includes('deleted')}
                              currentRoute={tab}
                            />
                          }
                        />,
                        e.sub
                          ? e.sub.map((it, i) => {
                              const SubComponent = InboxPages[it.Component] ? InboxPages[it.Component] : () => null;
                              return (
                                <Route
                                  key={i}
                                  path={it.path}
                                  element={
                                    <SubComponent
                                      {...props}
                                      user={selectedUser}
                                      type={e.type}
                                      canReply={it.canReply}
                                      fetchCount={() => fetchCount(selectedUser?.id)}
                                      currentRoute={tab}
                                    />
                                  }
                                />
                              );
                            })
                          : null,
                      ];
                    })}
                  </Suspense>
                </Routes>
              </EmailWrapper>
            </Col>
          </Row>
        </NavWrapper>
      </Main>
    );
  };

  const handleTabClick = (e) => {
    setTab(e.target.value);
    navigate(`${tenantRoutes.app().inbox.path}/${e?.target?.value}`);
  };

  const inBoxMobile = () => {
    return (
      <Main>
        <EmailWrapper>
          <Row className="p-16">
            <Radio.Group onChange={handleTabClick} value={tab}>
              {navLinks?.map((e, i) => (
                <RadioButtonStyled key={i} value={e?.key} btnSize="small">
                  <Space size={6}>
                    <Icon icon={e?.icon} size={14} style={{ verticalAlign: 0 }} />
                    {e?.name}
                    {!!e?.badge && <BadgeMobileStyle count={e?.badge} overflowCount={99} />}
                  </Space>
                </RadioButtonStyled>
              ))}
            </Radio.Group>
          </Row>
          <Card className={cx(!isMobile && 'mb-20')} bodyStyle={{ padding: isMobile ? 16 : 40 }}>
            {!!user?.permissions?.[PERMISSIONS_TYPE.INBOX] && (
              <div className="mb-12">
                {/* <p className="color-gray-light mb-8">{t('Select Inbox for:')}</p> */}
                <Select
                  value={selectedUser?.id}
                  options={[{ id: -1, name: t('All') }, ...users]}
                  onChange={(value, option) => {
                    setUser(option);
                  }}
                  getOptionLabel={(op) => {
                    return `${op.name} ${op.id === user?.id ? t('(Me)') : ''}`;
                  }}
                  valueAsObj
                  inputLoading={loading}
                />
              </div>
            )}
            <Row>
              <Col xxl={24} className="inbox-space">
                <Routes>
                  <Suspense
                    fallback={
                      <div className="spin">
                        <Spin />
                      </div>
                    }
                  >
                    {routes(stSlash(routeMatchPath), !!user?.permissions?.[PERMISSIONS_TYPE.INBOX]).map((e, i) => {
                      const PageComponent = InboxPages[e.Component] ? InboxPages[e.Component] : () => null;
                      return [
                        <Route
                          path={e.path}
                          key={i}
                          element={(props) => (
                            <PageComponent
                              {...props}
                              user={selectedUser}
                              type={e.type}
                              folders={folders}
                              fetchCount={() => fetchCount(selectedUser?.id)}
                              permanentDelete={e.type.includes('deleted')}
                              currentRoute={tab}
                            />
                          )}
                          exact
                        />,
                        e.sub
                          ? e.sub.map((it, i) => {
                              const SubComponent = InboxPages[it.Component] ? InboxPages[it.Component] : () => null;
                              return (
                                <Route
                                  key={i}
                                  path={it.path}
                                  element={(props) => (
                                    <SubComponent
                                      {...props}
                                      user={selectedUser}
                                      type={e.type}
                                      canReply={it.canReply}
                                      fetchCount={() => fetchCount(selectedUser?.id)}
                                      currentRoute={tab}
                                    />
                                  )}
                                  exact
                                />
                              );
                            })
                          : null,
                      ];
                    })}
                  </Suspense>
                </Routes>
              </Col>
            </Row>
          </Card>
        </EmailWrapper>
      </Main>
    );
  };

  return isMobile ? inBoxMobile() : inBoxWeb();
};

InboxContainer.propTypes = {
  match: propTypes.object,
};

export default InboxContainer;
