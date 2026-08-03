import { Group, TextWithIcon } from '../../common';
import { HealthTag } from '../../listing-health/styled';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { CardCompact } from '../../common/cards/styled';
import tenantTheme from '@theme';
import { useGetQualityCriteriaQuery } from '../../../apis/postlisting';

const QualityTip = (props) => {
  const { propertyId, type = '', count = 0, className } = props;
  const { t } = useTranslation();

  const { data: qualityCriteria, isLoading: loading, error } = useGetQualityCriteriaQuery();

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const qualityDetails = useMemo(() => {
    if (!qualityCriteria || !qualityCriteria[type]) {
      return { message: t('Data not available'), value: 0, color: 'Low' };
    }

    const item = qualityCriteria[type]?.find((f) => count >= f.range[0] && count <= f.range[1]);

    let updatedMessage = item?.message || '';
    if (type === 'images' && updatedMessage?.includes('num_of_images')) {
      const leastCount = qualityCriteria[type]?.[qualityCriteria[type].length - 1]?.range[0] || 0;
      updatedMessage = updatedMessage.replace('num_of_images', Math.max(0, leastCount - count));
    }

    return {
      message: updatedMessage,
      value: item?.donut_fill_percentage || 0,
      color: item?.donut_meter_color,
    };
  }, [count, type, qualityCriteria]);

  const getTagColor = (color) => {
    switch (color) {
      case 'green':
        return 'success';
      case 'red':
        return 'error';
      case 'yellow':
        return 'warning';
      default:
        return 'warning';
    }
  };

  return (
    !qualityCriteria?.non_built_types?.includes(propertyId) && (
      <CardCompact
        as={Group}
        template={'1fr auto'}
        compactCardRadius="6px"
        compactCardPadding={isMobile ? '12px' : '12px 16px'}
        style={{ alignItems: 'center' }}
        className={className}
      >
        <TextWithIcon
          title={t('Quality Tip')}
          textColor={tenantTheme['base-color']}
          value={qualityDetails.message}
          icon="SvgQualityTip"
          iconProps={{ color: tenantTheme['primary-color'] + 'aa', size: '24px' }}
          fontWeight={700}
          subClass="color-gray-dark fz-12 fw-400"
          style={{ lineHeight: 1.4 }}
          gap="12px"
        />
        <HealthTag className="fw-700 fz-14" color={getTagColor(qualityDetails.color)}>
          {qualityDetails.value}%
        </HealthTag>
      </CardCompact>
    )
  );
};

QualityTip.propTypes = {
  propertyId: PropTypes.number,
  type: PropTypes.string,
  count: PropTypes.number,
};

export default QualityTip;
