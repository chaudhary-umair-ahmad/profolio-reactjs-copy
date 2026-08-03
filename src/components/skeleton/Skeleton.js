import { Skeleton as AntdSkeleton } from 'antd';
import React from 'react';
function SkeletonBody({
  type = 'button',
  size = 'default',
  active = true,
  loading,
  enableAvatar = true,
  avatarShape = 'circle',
  ...rest
}) {
  switch (type) {
    case 'title':
      return <AntdSkeleton.Input active={active} size={size} loading {...rest} />;
    case 'paragraph':
      return <AntdSkeleton active={active} size={size} loading {...rest} />;
    case 'input':
      return <AntdSkeleton.Input active={active} size={size} loading {...rest} />;
    case 'button':
      return (
        <AntdSkeleton.Button
          active={active}
          size={size}
          loading
          block={rest.width ? true : false}
          style={{ maxWidth: rest.width, height: rest.height, lineHeight: rest.height }}
          {...rest}
        />
      );
    case 'avatar':
      return <AntdSkeleton.Avatar active={active} size={size} loading avatarShape={avatarShape} {...rest} />;
    case 'image':
      return <AntdSkeleton.Image active={active} size={size} loading avatarShape={avatarShape} {...rest} />;
    default:
      return <AntdSkeleton active={active} avatar={enableAvatar} loading={loading} {...rest} />;
  }
}

export { SkeletonBody };
