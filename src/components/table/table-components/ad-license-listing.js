import tenantTheme from '@theme';
import { t } from 'i18next';
import { getBaseURL } from '../../../utility/env';
import { Number, Tag, TextWithIcon, Image } from '../../common';
import Group from '../../common/group/group';
import { Thumbnail } from '../../styled';
import { useTranslation } from 'react-i18next';

export const AdLicenseListing = (props) => {
  const { property_price, latitude, longitude, location, type } = props;

  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <Group template="106px 1fr" onClick={(e) => e.stopPropagation()} className="align-items-center">
      <Thumbnail style={{ position: 'relative' }}>
        <Image
          style={{ cursor: 'default' }}
          src={null} // No image for ad license requests
          fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
        />
      </Thumbnail>

      <Group className="fz-12 py-2" template="initial">
        <Number className="text-primary" compact={false} value={String(property_price)} type={'price'} />
        <TextWithIcon
          icon="IconAreaSize"
          iconProps={{ size: '1.4em', color: tenantTheme.gray500 }}
          textColor={tenantTheme.gray700}
          value={`${t('Location')}:  ${location ? (currentLang === 'en' ? location?.title : location?.title_l1) : ''}`}
        />
        <span>
          <Tag
            color={tenantTheme['primary-light-4']}
            style={{ '--tag-color': tenantTheme['primary-color'], fontWeight: '700' }}
          >
            {`${currentLang === 'en' ? type?.combined_title : type?.combined_title_l1}`}
          </Tag>
        </span>
      </Group>
    </Group>
  );
};
