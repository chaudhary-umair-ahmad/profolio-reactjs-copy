import tenantData from '@data';
import React, { useMemo } from 'react';
import { Flex, Icon, Segmented } from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { setSectionPlatform } from '../../store/appSlice';
import { BayutLogoEn, DubizzleLogo, MultiPlatformIcon } from '../svg';
import { switcherProfolioEvent } from '../../services/analyticsService';
import MultiPlatform from '../common/multiplatform';

const PlatfromSwitch = (props) => {
  const { section, platformsType, platformSwitchStyle, className, loading, size } = props;
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const user = useSelector((state) => state.app.loginUser?.user);
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.[section]);
  const locale = useSelector((state) => state.app.AppConfig.locale);

  const dispatch = useDispatch();

  const onChangePlatform = (e) => {
    const platformObj = btnList.find((item) => item.slug == e);
    switcherProfolioEvent(user, e, section);
    dispatch(setSectionPlatform({ section, value: platformObj }));
    if (props.platformChange) props.platformChange();
  };

  const btnList = useMemo(() => {
    switch (platformsType) {
      case 'all':
        return [
          {
            id: 3,
            key: 'all',
            label: 'All',
            name: 'All',
            title: 'All',
            slug: 'all',
            value: 'all',
            responseKey: 'all',
          },
          ...tenantData?.platformList.map((item) => ({
            ...item,
            label: item?.getLogo(selectedPlatform?.slug == 'all' ? { iconProps: { color: 'white' } } : {}),
          })),
        ];
      case 'bayutDubizzle':
        return [
          {
            id: 1,
            key: 'bayut',
            label: (
              <Icon
                icon={locale === 'ar' ? 'BayutLogoAr' : 'BayutLogoEn'}
                size={'60px'}
                style={{ height: '15px', marginTop: '12px' }}
                iconProps={selectedPlatform?.slug == 'bayut' ? { color: 'white' } : {}}
              />
            ),
            name: 'Bayut',
            title: 'Bayut',
            slug: 'bayut',
            value: 'bayut',
            responseKey: 'bayut',
          },
          {
            id: 2,
            key: 'bayutDubizzle',
            label: (
              <MultiPlatform
                style={{ justifyContent: 'center', marginTop: '7px', height: isMobile ? '24px' : '24px' }}
                iconProps={selectedPlatform?.slug == 'bayutDubizzle' ? { color: 'white' } : {}}
              />
            ),
            name: 'Bayut & Dubizzle',
            title: 'Bayut & Dubizzle',
            slug: 'bayutDubizzle',
            value: 'bayutDubizzle',
            responseKey: 'dubizzle',
            isMultiPlatform: true,
          },
        ];
      default:
        return tenantData?.platformList.map((item) => ({
          ...item,
          label: item?.getLogo({ locale, ...(selectedPlatform?.slug == item?.slug && { color: 'white' }) }),
        }));
    }
  }, [selectedPlatform?.slug]);

  return (
    <Segmented
      value={selectedPlatform?.slug}
      options={btnList.map((item) => ({ ...item, icon: '' }))}
      onChange={onChangePlatform}
      disabled={loading}
      style={{ marginInlineStart: !isMobile && 'auto', ...platformSwitchStyle }}
      className={className}
      size={size}
    />
  );
};

export default PlatfromSwitch;
