import { Tag } from '../../common';
import { useTranslation } from 'react-i18next';

export const AdLicenseStatus = (props, style) => {
  const { jarvis_stages_display_name, jarvis_stages } = props;
  const { t } = useTranslation();
  const getStatusColor = (stage) => {
    switch (stage) {
      case "request_confirmation":
        return 'lime';

      case 'rega_contract_creation':
        return 'blue';

      case 'ad_license_creation':
        return 'gold';

      case 'completed':
        return "green";

      case 'post_listing':
        return 'orange';

      case 'rejected':
        return 'red';

      case 'post_listing':
        return 'green';

      case "payment_pending":
        return 'red';
    }
  };

  return (
    <Tag
      color={`${getStatusColor(jarvis_stages)}`}
      shape="round"
      style={{...style && (style)}}
    >
      {t(jarvis_stages_display_name)}
    </Tag>
  );
};
