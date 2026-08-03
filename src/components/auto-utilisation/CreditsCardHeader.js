import { Row } from 'antd';
import React from 'react';
import { Heading } from '../common';
import Icon from '../common/icon/icon';

function CreditsCardHeader(props) {
  const { data } = props;
  const { title, points } = data;
  return (
    <>
      <Row>
        <div>
          <Icon icon="AiOutlineSetting" size={20} />
        </div>
        <Heading as="h4">{title}</Heading>
      </Row>
      <div>
        {points?.map((item, index) => {
          return (
            <Row key={index}>
              <Icon icon="TiTick" size={14} />
              <span>{item}</span>
            </Row>
          );
        })}
      </div>
    </>
  );
}

export default CreditsCardHeader;
