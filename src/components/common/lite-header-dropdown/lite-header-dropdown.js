import cx from 'clsx';
import React from 'react';
import { Dropdown } from '../dropdown/dropdown';
import Icon from '../icon/icon';
import { LiteDropdownItems } from '../../../tenant/bayut/components/layout/styled';
import { getClassifiedBaseURL } from '../../../utility/env';
import { useSelector } from 'react-redux';

const LiteHeaderDropdown = ({
  title,
  options,
  placement,
  onOptionsIconClick = () => {},
  prefixIcon = null,
  suffixIcon = null,
  optionsIcon = null,
  ...iconProps
}) => {
  const locale = useSelector((state) => state.app.AppConfig.locale);

  const renderOptionItems = () => {
    return (
      options?.length > 0 &&
      options?.map((item) => (
        <>
          <LiteDropdownItems
            className="flex"
            style={{ justifyContent: 'space-between', padding: '8px 16px', width: 290 }}
            key={item?.id}
          >
            <a className="items" href={`${getClassifiedBaseURL()}${locale === 'en' ? '/en' : ''}${item?.url}`}>
              {item?.name}
            </a>
            {!!optionsIcon && <Icon icon={optionsIcon} onClick={() => onOptionsIconClick(item)} {...iconProps} />}
          </LiteDropdownItems>
        </>
      ))
    );
  };

  return (
    <Dropdown
      placement={placement}
      prefixIcon={prefixIcon}
      prefixIconProps={{ size: '1.28571em', color: 'currentColor' }}
      rootClassName="p-0"
      className={cx('dropDownSelect', 'languageDropdown', 'fz-12')}
      renderChildren={renderOptionItems}
      suffixIcon={suffixIcon}
      style={{ gap: 7 }}
    >
      {title}
    </Dropdown>
  );
};

export default LiteHeaderDropdown;
