import tenantData from '@data';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Group } from '../../../components/common';
import { requiredCreditsData } from './requiredCreditsData';

const CreditRequiredCard = () => {
  const { t } = useTranslation();
  const breakdownProducts = requiredCreditsData.by_products.map((byProduct) => {
    const product = tenantData.products.find((product) => product.id === byProduct.id);
    return { ...product, required_credits: byProduct.required_credits };
  });
  return (
    <div>
      <Card>
        <Group>
          <div>
            <strong>{t('Credits Required')}</strong>
            <p>{t('This much required credits publish listings and apply products')}</p>
          </div>
          <div>
            {breakdownProducts.map((item) => (
              <div>
                <div>{t(item.name)}</div>
                <div>{item.required_credits}</div>
              </div>
            ))}
          </div>
          <div>
            <Button type="link">{t('Go to Propshop to buy credits')}</Button>
          </div>
        </Group>
      </Card>
    </div>
  );
};
export default CreditRequiredCard;
