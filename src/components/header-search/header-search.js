import { Col, Input, Row } from 'antd';
import { Icon, Popover } from '../common';
import { useDispatch, useSelector } from 'react-redux';

import { Div } from './header-search-style';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { headerSearchAction } from '../../redux/headerSearch/actionCreator';

const HeaderSearch = ({ darkMode }) => {
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.headerSearchData);
  const rtl = useSelector((state) => state.app.AppConfig.rtl);

  const search = (e) => {
    dispatch(headerSearchAction(e.target.value));
  };

  const content = (
    <div>
      {searchData.length ? (
        searchData.map((group) => {
          const { title, count, id } = group;
          return (
            <NavLink key={id} to="#">
              {title}
              <span className="certain-search-item-count">{count} people</span>
            </NavLink>
          );
        })
      ) : (
        <NavLink to="#">Data Not found....</NavLink>
      )}
    </div>
  );

  return (
    <>
      <Div className="certain-category-search-wrapper" style={{ width: '100%' }} darkMode={darkMode}>
        <Row className="ant-row-middle">
          <Col md={2} xs={1} className={rtl ? 'text-left' : 'text-right'}>
            <span className="certain-category-icon">
              <Icon icon="FiCalendar" size={14} />
            </span>
          </Col>
          <Col md={22} xs={23}>
            <Popover
              placement={!rtl ? 'bottomLeft' : 'bottomRight'}
              content={content}
              title="Search List"
              action="focus"
            >
              <Input placeholder="Search..." onInput={search} />
            </Popover>
          </Col>
        </Row>
      </Div>
    </>
  );
};

HeaderSearch.propTypes = {
  darkMode: PropTypes.bool,
};

export default HeaderSearch;
