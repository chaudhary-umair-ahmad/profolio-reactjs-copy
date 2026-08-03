import React, { useMemo } from 'react';
import { Button, ErrorMessage, Group, TextInput } from '../../common';

import { useTranslation } from 'react-i18next';
import Label from '../../common/Label/Label';
import { IconStyled } from '../../common/icon/IconStyled';
import Icon from '../../common/icon/icon';
import { AddVideo } from './styled';

const VideoSelect = props => {
  const { label, labelIcon, value, setFieldValue, style, errorMsg, valueKey, hostList, isMobile } = props;
  const { t } = useTranslation();

  const videos = useMemo(() => (value ? value.filter(e => !e._destroy) : []), [value]);

  return (
    <Group gap="16px" template="max-content auto">
      {labelIcon && (
        <IconStyled>
          <Icon icon={labelIcon} />
        </IconStyled>
      )}
      <Group gap="8px" template="initial">
        <div name={valueKey}>
          <Label>{label}</Label>
          <div className="text-muted">
            {t('Add videos of your property from Youtube. Upload on Youtube and paste the link below.')}
          </div>
        </div>
        {!!videos.length && (
          <AddVideo gap="16px" template={'auto'}>
            {value.map((item, index) => {
              return (
                !item._destroy && (
                  <div style={{ position: 'relative' }} key={index}>
                    <TextInput
                      prefixIcon={
                        <Icon
                          icon={hostList.find(e => e.value == item.host)?.icon || 'AiFillYoutube'}
                          color={hostList.find(e => e.value == item.host)?.color || '#FF0000'}
                          size="1.2em"
                        />
                      }
                      label={t('Video Link')}
                      muted
                      placeholder={t('Place video link here')}
                      value={item.url || item.link || ''}
                      onChange={e => {
                        const fieldValue = [...value];
                        fieldValue[index] = { ...item, url: e.target.value, ...(e.target.value === '' && { link: '' }) };
                        setFieldValue(valueKey, fieldValue, true);
                      }}
                    />
                    <Button
                      type="link"
                      className="btn-close"
                      icon="HiOutlineTrash"
                      size="small"
                      style={{ '--btn-content-color': '#f5222d' }}
                      onClick={() => {
                        const fieldValue = [...value];
                        fieldValue[index] = { ...fieldValue[index], _destroy: true };
                        setFieldValue(valueKey, fieldValue, true);

                        // if (!value[index]?.video_id) {
                        //   let tempVid = value.filter((e, ind) => ind != index);
                        //   setFieldValue(valueKey, tempVid);
                        // } else {
                        //   value[index] = { ...value[index], _destroy: true };
                        //   setFieldValue(valueKey, [...value]);
                        // }
                      }}
                    >
                      {t('Delete Video')}
                    </Button>
                    {!!errorMsg?.[index] && <ErrorMessage message={errorMsg?.[index]} />}
                  </div>
                )
              );
            })}
          </AddVideo>
        )}
        {(!value || videos?.length <= 3) && (
          <div>
            <Button
              type="primary"
              outlined
              onClick={() => {
                setFieldValue(valueKey, [...(value || []), { host: hostList[0].value, url: '', title: '' }]);
              }}
              style={{ fontSize: 14 }}
            >
              {videos?.length > 0 ? t('Add Another Video') : t('Add Video')}
            </Button>
          </div>
        )}
      </Group>
    </Group>
  );
};

export default VideoSelect;
