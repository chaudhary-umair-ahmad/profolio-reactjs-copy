import { useState } from 'react';
import { Button, notification } from '../../common';
import { useTranslation } from 'react-i18next';
import { useRouteNavigate } from '../../../hooks';
import { useCreateCartMutation } from '../../../apis/cart';
import { useSelector } from 'react-redux';
import { payNowClickEvent } from '../../../services/analyticsService';
import tenantTheme from '@theme';

export const AdLicenseActions = (props) => {
  const { jarvis_stages, id, purpose_id } = props;
  const { t } = useTranslation();
  const navigate = useRouteNavigate();
  const [createCart] = useCreateCartMutation();
  const user = useSelector((state) => state.app.loginUser.user);
  const [isCreatingCart, setIsCreatingCart] = useState(false);

  const handlePayNow = async () => {
    try {
      setIsCreatingCart(true);

      if (!purpose_id) {
        notification.error(t('Product information not found. Please try again.'));
        return;
      }

      const cartPayload = {
        source: 'profolio',
        requestable_type: 'AdLicenseRequest',
        requestable_id: id,
        total_credits:1,
        cart_details_attributes: [
          {
            item_id: purpose_id === 1 ? 9 : 10,
            item_type: 'Product',
            source: 'profolio',
            quantity: 1,
          },
        ],
      };

      const cartResponse = await createCart({ cart: cartPayload }).unwrap();

      if (cartResponse?.cart?.id) {
        payNowClickEvent(user);
        navigate(`/checkout?cart_id=${cartResponse.cart.id}&ad_license=true`, {
          state: {
            interactedFrom: 'ad_license_listing',
            adLicenseId: id,
          },
        });
      } else if (cartResponse?.error) {
        notification.error(response.error);
        setButtonLoading(false);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to create payment. Please try again.';
      notification.error(t(errorMessage));
    } finally {
      setIsCreatingCart(false);
    }
  };

  if (jarvis_stages === 'payment_pending') {
    return (
      <Button
        size="small"
        onClick={handlePayNow}
        loading={isCreatingCart}
        disabled={isCreatingCart}
        style={{
          '--btn-content-color': tenantTheme['primary-color'],
          '--btn-border-color': tenantTheme['primary-color'],
          paddingInline: 12,
        }}
        type="primary-light"
      >
        {t('Pay Now')}
      </Button>
    );
  }

  return null;
};
