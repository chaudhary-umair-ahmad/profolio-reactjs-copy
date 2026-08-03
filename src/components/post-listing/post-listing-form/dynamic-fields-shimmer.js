import React from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Skeleton } from '../../common';
import PostListingSkeleton from './post-listing-from-skeleton';

const SECTION_SKELETONS = [
  { icon: 'IconLocationPurpose', titleKey: 'Property Location' },
  { icon: 'IconImagesPost', titleKey: 'Property Images' },
  { icon: 'IconAdInformation', titleKey: 'Price and Specs' },
  { icon: 'IconContactInfo', titleKey: 'Contact Information' },
];

/**
 * Shimmer shown while dynamic form fields are loading.
 * Mirrors the layout of real sections (card + icon + title + fields) for a smooth transition.
 */
const DynamicFieldsShimmer = ({ sectionCount = 4, gap = '32px' }) => {
  const { t } = useTranslation();

  const sections = SECTION_SKELETONS.slice(0, Math.min(sectionCount, SECTION_SKELETONS.length));

  return (
    <Group gap={gap} template="1fr">
      {sections.map((section, index) => (
        <PostListingSkeleton
          key={`shimmer-${section.titleKey}-${index}`}
          icon={section.icon}
          title={t(section.titleKey)}
          loading
        >
          <Group gap="24px" style={{ maxWidth: 640 }}>
            <Skeleton type="input" style={{ width: '100%', height: 40 }} />
            <Skeleton type="input" style={{ width: '100%', height: 40 }} />
            {index === 0 && <Skeleton type="input" style={{ width: '100%', height: 40 }} />}
          </Group>
        </PostListingSkeleton>
      ))}
    </Group>
  );
};

export default DynamicFieldsShimmer;
