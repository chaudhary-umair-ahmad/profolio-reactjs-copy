import tenantTheme from '@theme';
import React from 'react';
import { useSelector } from 'react-redux';
import { ErrorMessage, Group, ImageUploadDropzone } from '../../common';
import Label from '../../common/Label/Label';
import { IconStyled } from '../../common/icon/IconStyled';
import Icon from '../../common/icon/icon';

const DocumentSelect = (props) => {
  const { label, labelIcon, values, setFieldValue, style, errorMsg, valueKey, attachmentType } = props;
  const user = useSelector((state) => state.app.loginUser.user);

  return (
    <Group gap="16px" template="max-content auto">
      {labelIcon && (
        <IconStyled>
          <Icon icon={labelIcon} />
        </IconStyled>
      )}
      <Group template="initial" gap="8px">
        <div>
          <Label>{label}</Label>
          <div className="text-muted">Add additional document related to your property</div>
        </div>
        <>
          <ImageUploadDropzone
            btnText="Add Documents"
            btnStyle={{
              height: 'initial',
              padding: '6px 14px',
              background: 'transparent',
              color: tenantTheme['primary-color'],
              border: '1px solid currentColor',
              width: 'max-content',
              textShadow: 'none',
              boxShadow: 'none',
            }}
            pictures={values[valueKey] || []}
            setPictures={(pictures) => setFieldValue(valueKey, pictures)}
            previewKey="thumbnail"
            fullPreviewKey="large"
            selectMainOnDoubleClick
            contentMappingForImages={['']}
            attachmentType={attachmentType}
            viewType="list"
          >
            {(renderImages, renderUploadButton) => (
              <>
                {renderImages()}
                {renderUploadButton()}
              </>
            )}
          </ImageUploadDropzone>
        </>
        <ErrorMessage message={errorMsg} />
      </Group>
    </Group>
  );
};

export default DocumentSelect;
