import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Text, Group } from '../';
import { capitalizeFirstLetter } from '../../../utility/utility';
const KeyValueCard = ({ title, items = [], cardProps = {} }) => {
  const { t } = useTranslation();

  return (
    <div>
      {title && (
        <Text className="color-gray-dark fs12" strong>
          {t(title)}
        </Text>
      )}

      <Card
        style={{
          border: '1px solid #E1F2F0',
          borderRadius: '8px',
          marginTop: '10px',
        }}
        bodyStyle={{
          background: '#F2FAFA',
          padding: '16px 24px',
          borderRadius: '8px',
        }}
      >
        <Group template={`repeat(2, 1fr)`} gap="14px">
          {items.map(({ label, value, isDate }) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text className="color-gray-dark fs12 mb-4">{t(label)} </Text>
              <Text className=" fs12 mb-4" strong>
                {isDate ? value || '-' : value ? capitalizeFirstLetter(value?.toString()) : '-'}
              </Text>
            </div>
          ))}
        </Group>
      </Card>
    </div>
  );
};

export default KeyValueCard;
