import { Text } from '../../common';
import tenantTheme from '@theme';
import { DATE_FORMAT } from '../../../constants/formats';
import { getTimeDateString } from '../../../utility/date';

export const AdLicenseRequestedOn = (props) => {
  const { created_at } = props;
  return (
    <Text size="14px" color={tenantTheme['text-color']}>
      {getTimeDateString(created_at, DATE_FORMAT)}
    </Text>
  );
};