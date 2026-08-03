import React from 'react';
import { Group } from '../../common';
import PostListingSkeleton from './post-listing-from-skeleton';

/**
 * JSONForm `layout` render: one skeleton card per dynamic section.
 */
export default function PostListingFormSectionsLayout({ formik: form, getFieldsSections, getField, t }) {
  const sections = (getFieldsSections() || []).filter(
    (section) => Array.isArray(section?.fields) && section.fields.length > 0,
  );
  return sections.map((section) => (
    <PostListingSkeleton
      key={section.slug || section.title}
      icon={section.icon || 'PropertyInformationIcon'}
      title={section.title || t('Additional Information')}
    >
      <Group gap="32px" style={{ maxWidth: 640 }}>
        {(Array.isArray(section.fields) ? section.fields : []).map((fieldItem) => {
          const fieldNode = getField(fieldItem, form);
          if (!fieldNode) return null;
          return <React.Fragment key={fieldItem.key}>{fieldNode}</React.Fragment>;
        })}
      </Group>
    </PostListingSkeleton>
  ));
}
