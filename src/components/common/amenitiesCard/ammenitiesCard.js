import React from 'react';
import { Card, Icon } from '..';
import { Text } from '../textWithIcon/styled';

const AmmenitiesCard = ({ icon, title, CustomComponent }) => {
  return (
    <Card>
      <div>
        {icon && (
          <div>
            <Icon icon={icon} />
          </div>
        )}
        <Text>{title}</Text>
      </div>
      <div>{CustomComponent}</div>
    </Card>
  );
};

export default AmmenitiesCard;
