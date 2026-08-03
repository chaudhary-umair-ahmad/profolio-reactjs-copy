import React from 'react';
import PropTypes from 'prop-types';
import { TabBasic, Child } from './style';
import Icon from '../icon/icon';

const Tab = props => {
  const { data, tabPosition, color, type } = props;
  let counter = 0;

  return (
    <TabBasic
      className={type === 'pills' ? 'ant-tabs-pills' : ''}
      color={color && color}
      type={type}
      defaultActiveKey="1"
      tabPosition={tabPosition !== undefined ? tabPosition : 'top'}
    >
      {data.map(item => {
        const { title, content, icon, tabTitle } = item;
        counter += 1;
        return (
          <Child
            color={color && color}
            tab={
              icon === undefined ? (
                tabTitle
              ) : (
                <span>
                  <Icon icon={icon} />
                  {tabTitle}
                </span>
              )
            }
            key={counter}
          >
            {title && <h2>{title}</h2>}
            <>{content}</>
          </Child>
        );
      })}
    </TabBasic>
  );
};

Tab.propTypes = {
  color: PropTypes.string,
  tabPosition: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string,
};

export { Tab };
