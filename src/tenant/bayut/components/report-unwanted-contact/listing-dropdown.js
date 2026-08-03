import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Divider, Popover, Button } from 'antd';
import { Icon, ErrorMessage } from '../../../../components/common';
import Spinner from '../../../../components/common/spinner/spinner';
import tenantTheme from '@theme';
import cx from 'clsx';
import ListingCard from './listing-card';

const ListingDropdown = ({
  data = [],
  selectedValue,
  onSelect,
  placeholder,
  label,
  error,
  touched,
  isLoading = false,
  isFetching = false,
  hasMorePages = false,
  onScroll,
  onChangeListing,
  showChangeButton = false,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useSelector((state) => state.app.AppConfig);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownScrollRef = useRef(null);

  const handleListingScroll = useCallback(
    (e) => {
      const { target } = e;
      if (
        target.scrollTop + target.offsetHeight >= target.scrollHeight - 20 &&
        hasMorePages &&
        !isLoading &&
        !isFetching &&
        onScroll
      ) {
        onScroll(e);
      }
    },
    [hasMorePages, isLoading, isFetching, onScroll],
  );

  const handleSelect = (item) => {
    onSelect(item);
    setDropdownVisible(false);
  };

  const handleChangeListing = () => {
    setDropdownVisible(true);
    if (onChangeListing) {
      onChangeListing();
    }
    setTimeout(() => {
      if (dropdownScrollRef.current) {
        dropdownScrollRef.current.scrollTop = 0;
      }
    }, 100);
  };

  const dropdownContent = (
    <div
      ref={dropdownScrollRef}
      onScroll={handleListingScroll}
      style={{
        maxHeight: isMobile ? '300px' : '400px',
        overflowY: 'auto',
        width: isMobile ? 'calc(100vw - 48px)' : '500px',
        padding: 0,
      }}
    >
      {data.length === 0 && !isLoading && !isFetching ? (
        <div style={{ padding: '16px', textAlign: 'center', color: tenantTheme.gray500 }}>{t('No listings found')}</div>
      ) : (
        <>
          {data.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListingCard
                listing={item}
                isInDropdown={true}
                isSelected={selectedValue === item.id}
                onSelect={handleSelect}
              />
              {index < data.length - 1 && <Divider style={{ margin: 0, marginBottom: '10px' }} />}
            </React.Fragment>
          ))}
          {(isLoading || isFetching) && (
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <Spinner size="small" />
            </div>
          )}
          {!hasMorePages && data.length > 0 && !isLoading && !isFetching && (
            <div style={{ padding: '8px', textAlign: 'center', color: tenantTheme.gray500, fontSize: 12 }}>
              {t('No more listings')}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderDropdownTrigger = () => (
    <div
      className={cx('ant-select', 'ant-select-single', {
        'ant-select-status-error': touched && error,
      })}
      style={{
        border: `1px solid ${touched && error ? '#ff4d4f' : '#d9d9d9'}`,
        borderRadius: '6px',
        padding: '4px 11px',
        minHeight: '40px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onClick={() => setDropdownVisible(!dropdownVisible)}
      onMouseEnter={(e) => {
        if (!touched || !error) {
          e.currentTarget.style.borderColor = tenantTheme['primary-color'];
        }
      }}
      onMouseLeave={(e) => {
        if (!touched || !error) {
          e.currentTarget.style.borderColor = '#d9d9d9';
        }
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="color-gray-dark">{placeholder}</span>
      </div>
      <Icon
        icon={dropdownVisible ? 'MdKeyboardArrowUp' : 'MdKeyboardArrowDown'}
        style={{ marginLeft: 8, color: tenantTheme.gray500 }}
      />
    </div>
  );

  const selectedItem = data.find((item) => item.id === selectedValue);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          marginBottom: showChangeButton && !dropdownVisible ? '-14px' : '8px',
        }}
      >
        {label && <label style={{ margin: 0 }}>{label}</label>}
        {showChangeButton && selectedItem && (
          <Button
            onClick={handleChangeListing}
            style={{
              borderRadius: '4px',
              borderWidth: '1px',
              paddingTop: '2px',
              paddingRight: '12px',
              paddingBottom: '2px',
              paddingLeft: '12px',
              backgroundColor: '#F2FAFA',
              borderColor: '#DDEAEB80',
              fontWeight: 600,
              fontSize: '11px',
              color: '#006169',
              marginLeft: 'auto',
              height: 'auto',
              borderStyle: 'solid',
            }}
          >
            {t('Change listing')}
          </Button>
        )}
      </div>
      {(!selectedItem || dropdownVisible) && (
        <Popover
          content={dropdownContent}
          trigger="click"
          open={dropdownVisible}
          onOpenChange={setDropdownVisible}
          placement="bottomLeft"
          overlayStyle={{ padding: 0 }}
          overlayInnerStyle={{ padding: '6px' }}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        >
          {renderDropdownTrigger()}
        </Popover>
      )}
      {touched && error && <ErrorMessage message={error} />}
    </div>
  );
};

export default ListingDropdown;
