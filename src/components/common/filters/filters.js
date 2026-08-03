import tenantTheme from '@theme';
import { Badge, Col, Collapse, Form, Row, Skeleton, Space } from 'antd';
import cx from 'clsx';
import { t } from 'i18next';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Button, DateFilter, Drawer, FilterTag, Label, Popover, Select, Switch, Tag, TextInput } from '..';
import { useFilters } from '../../../hooks';
import CityLocationFilter from '../../cityLocationFilter/cityLocationFilter';
import { Divider, Group, Icon, Title } from '../../common';
import RangeSlider from '../../common/rangeSlide/rangeSlider';
import UnitRangeSlider from '../../common/unitRangeSlider/unitRangeSider';
import UnitSelect from '../unitSelect/unitSelect';
import styles from './index.module.less';

const Filters = forwardRef(
  (
    {
      list: filterList,
      loading,
      ignoreFilterKeys,
      skeletonLoading,
      children,
      onSaveSearch,
      isDrawerView,
      renderTopRight,
      onFilterValueChange,
      onFiltersApply,
      onFilterClear,
      haveDependentRequests,
      haveDependents,
      searchText,
      onClickMoreFilters,
      saveSearchButtonLabel = t('Save Search'),
      isFetching,
      hideFilterTags = false,
      tabFilterKey,
      intialFilterCount,
      fetchFunction,
      noUrlPush = false,
      columnSpan,
    },
    ref,
  ) => {
    const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
    const locale = useSelector((state) => state.app.AppConfig.locale);
    const [searchParams, setSearchParams] = useSearchParams();
    const queryObj = Object.fromEntries([...searchParams]);
    const { t } = useTranslation();
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const { filterTags, filtersObject, setFiltersObject, setTagsAndFilters } = useFilters();

    const AVAILABLE_FILTERS = useMemo(() => {
      return filterList?.filter((item) => {
        return !item.hidden;
        // && (item.dependsOn ? item.dependsOn.every((e) => filtersObject?.[e[0]]?.includes(e[1])) : true)
      });
    }, [filterList, haveDependents ? filtersObject : null]);

    const INITIAL_FILTERS_TO_SHOW = intialFilterCount != null ? intialFilterCount : isMobile ? 0 : 4;
    const SPLIT_BY = ',';

    const onSearch = (object) => {
      if (noUrlPush) {
        fetchFunction(object);
      } else {
        setSearchParams(object);
      }
      onFiltersApply(object);
    };

    useImperativeHandle(ref, () => ({ onSearch, setFiltersObject }), [filterList]);

    const handleFilterReset = () => {
      onSearch({});
      setFiltersObject({});
      showMoreFilters && isDrawerView && setShowMoreFilters(false);
    };

    const onTagClose = (item) => {
      const obj = { ...filtersObject };
      delete obj[item.searchKey];
      const dependents = item.filterItem?.dependents;
      dependents?.forEach((key) => {
        delete obj[key];
      });
      onFilterValueChange(item, obj[item.searchKey], item.searchKey, filtersObject);
      onSearch(obj, true);
    };

    const onChangeMoreFilters = () => setShowMoreFilters((showMoreFilters) => !showMoreFilters);

    const onInputBlur = (key) => (e) => {
      if (e?.target?.value) {
        setFiltersObject((prev) => ({ ...prev, [key]: e?.target?.value }));
      } else {
        let obj = { ...filtersObject };
        delete obj[key];
        setFiltersObject(obj);
      }
    };

    const onInputChange = (key) => (e) => {
      if (e) {
        setFiltersObject((prev) => ({ ...prev, [key]: e?.target?.value }));
      } else {
        let obj = { ...filtersObject };
        delete obj[key];
        setFiltersObject(obj);
      }
    };

    const onInputEnter = (key) => (e) => {
      setShowMoreFilters(false);
      const obj = { ...filtersObject, ...(e?.target?.value && { [key]: e?.target?.value }) };
      onSearch(obj);
      setFiltersObject(obj);
    };

    const onChangeRangeSlider = (key, defaultValues) => (value, reset) => {
      let min = reset ? '' : (value[0] ?? defaultValues[0]);
      let max = reset ? '' : (value[1] ?? defaultValues[1]);
      const obj = { ...filtersObject, [key]: `${min},${max}` };
      reset && delete obj[key];
      setFiltersObject(obj);
    };

    const onChangeUnitRangeSlider = (key, unitKey, defaultValues) => (field, reset) => {
      let min = reset ? '' : (field?.range?.[0] ?? defaultValues[0]);
      let max = reset ? '' : (field?.range?.[1] ?? defaultValues[1]);
      const obj = { ...filtersObject, [key]: `${min},${max}`, [unitKey]: field?.rangeUnit };
      if (reset) {
        delete obj[key];
        delete obj[unitKey];
      }
      setFiltersObject(obj);
    };

    const onChangeSelect = (mode, key, dependents) => (value) => {
      const obj = { ...filtersObject };
      if (mode == 'multiple') {
        if (value.length) {
          obj[key] = value.join(SPLIT_BY);
        } else {
          delete obj[key];
        }
      } else {
        if (value) {
          obj[key] = value;
        } else {
          delete obj[key];
        }
      }
      if (dependents?.length) {
        dependents?.map((key) => {
          delete obj[key];
        });
      }

      setFiltersObject(obj);
    };

    const onUnitSelect = (searchKey, value, subList, applyFilter = false, isStacked) => {
      let obj = { ...filtersObject };
      if (value) obj[searchKey] = value;
      !isStacked &&
        subList.forEach((key) => {
          if (obj.hasOwnProperty(key)) {
            // obj[key] = '';
            delete obj[key];
          }
        });

      setFiltersObject(obj);
      applyFilter && onSearch(obj);
    };

    const getFilterType = (item) => {
      const {
        type,
        label,
        labelProps,
        placeholder,
        key,
        list,
        subList,
        defaultValue,
        onValuesConvert,
        getValueKey = (item) => item?.value || item?.id,
        showInSingleTag,
        inputType,
        limit,
        iconColor,
        allowInput,
        level,
        nestedOptions,
        content_type,
        isStacked,
        picker = 'date',
        appliedFilter,
        mapFilterObject,
        selectOptionsList,
        selectMode,
        maxCharacterLength,
        isCurrency = false,
        defaultValues = [0, 0],
        disableFuture,
        mode,
        splitString,
        minDate,
        reportsStaticRanges = false,
        unitList,
        unitKey,
        dependents,
        dependsOn,
        queryParamKey,
        ...rest
      } = item;

      switch (type) {
        case 'select':
          return (
            <Select
              style={{ '--select-height': '44px' }}
              zIndex={10}
              mode={mode}
              key={key}
              className="selectSearch"
              label={t(label)}
              value={
                mode === 'multiple'
                  ? filtersObject[key]
                    ? filtersObject[key].split(SPLIT_BY)
                    : []
                  : filtersObject[key]
              }
              options={dependsOn ? (filtersObject?.[dependsOn] ? list?.[filtersObject?.[dependsOn]] : []) : list}
              onChange={onChangeSelect(mode, key, dependents)}
              defaultValue={defaultValue}
              placeholder={t(placeholder)}
              openIcon="MdKeyboardArrowUp"
              labelProps={labelProps}
              maxTagPlaceholder={(items) => (
                <Popover
                  getPopupContainer={() => document.body}
                  content={items?.map(rest?.getOptionLabel)}
                >{`+${items?.length}`}</Popover>
              )}
              allowClear
              {...rest}
            />
          );
        case 'locationFilter':
          return (
            <CityLocationFilter
              filtersObject={filtersObject}
              queryObject={Object?.fromEntries(searchParams)}
              mode={mode}
              SPLIT_BY={SPLIT_BY}
              setFiltersObject={setFiltersObject}
              subList={subList}
              {...rest}
            />
          );
        case 'dateRange':
          return (
            <DateFilter
              label={t(label)}
              minwidth={100}
              minDate={minDate}
              reportsStaticRanges={reportsStaticRanges}
              queryStartDate={filtersObject[key] ? filtersObject[key]?.split(SPLIT_BY)[0] : null}
              queryEndDate={filtersObject[key] ? filtersObject[key]?.split(SPLIT_BY)[1] : null}
              onSelect={(startDate, endDate) => {
                if (startDate && endDate) {
                  const obj = {
                    ...filtersObject,
                    [key]: `${startDate.split('/').join('-')},${endDate.split('/').join('-')}`,
                  };
                  setFiltersObject(obj);
                }
              }}
              onClear={() => {
                const obj = { ...filtersObject };
                delete obj[key];
                setFiltersObject(obj);
              }}
              skeletonLoading={skeletonLoading}
              placeholder={filtersObject[key] ? item?.getOptionLabel(filtersObject[key]) : t(placeholder)}
              labelProps={labelProps}
              fieldSize={isMobile && 'medium'}
              allowClear
              readOnly={false}
              okText="Confirm"
              {...rest}
            />
          );
        case 'input':
          return (
            <TextInput
              value={filtersObject[key] || ''}
              label={t(label)}
              placeholder={t(placeholder)}
              type={inputType}
              limit={limit}
              useInternalState
              handleBlur={onInputBlur(key)}
              handleChange={onInputChange(key)}
              allowInput={allowInput}
              suffixIcon="search"
              labelProps={labelProps}
              skeletonLoading={skeletonLoading}
              onPressEnter={onInputEnter(key)}
              allowClear
              {...rest}
              fieldSize={isMobile && 'medium'}
            />
          );
        case 'rangeSlider':
          return (
            <RangeSlider
              isCurrency={isCurrency}
              label={t(label)}
              range={list}
              value={filtersObject[key]?.split(',') || undefined}
              setField={onChangeRangeSlider(key, defaultValues)}
              {...rest}
            />
          );
        case 'unitRangeSlider':
          return (
            <UnitRangeSlider
              label={t(label)}
              rangeList={list}
              unitList={unitList.map((e) => ({ ...e, value: [0, 100000] }))}
              defaultUnitKey={item?.defaultUnitKey}
              value={filtersObject[key]?.split(',') || undefined}
              setField={onChangeUnitRangeSlider(key, unitKey, defaultValues)}
              {...rest}
            />
          );
        case 'toggle':
          return (
            <Row align="middle" justify="space-between" wrap={false} style={{ width: '100%', minHeight: 44 }}>
              <Label htmlFor={key} {...labelProps}>
                {t(label)}
              </Label>
              <Switch
                switchOnly
                name={key}
                checked={filtersObject[key] === 'true' || filtersObject[key] === '1'}
                onChange={(checked) => {
                  const obj = { ...filtersObject };
                  if (checked) obj[key] = 'true';
                  else delete obj[key];
                  setFiltersObject(obj);
                  onFilterValueChange && onFilterValueChange(item, checked ? 'true' : null, key);
                }}
              />
            </Row>
          );
        case 'unitSelect':
          return (
            <UnitSelect
              selectStyles={{ '--select-height': '44px' }}
              label={t(label)}
              options={subList}
              defaultOption={subList.find((e) => filtersObject[e.key])}
              value={filtersObject}
              handleChange={(key, value, applyFilter = false) => {
                onUnitSelect(
                  key,
                  value,
                  subList.map((e) => e.key).filter((e) => e !== key),
                  applyFilter,
                  item.isStacked,
                );

                onFilterValueChange(item, value, key);
              }}
              placeholder={placeholder}
              inputClass="selectSearch"
              componentType={item.componentType}
              splitBy={SPLIT_BY}
              onPressEnter={() => setShowMoreFilters(false)}
              {...rest}
            />
          );
        default:
          return null;
      }
    };

    const searchButton = (text = t('Search'), size = 'large', btnHeight = 42, icon = 'FiSearch') => {
      return (
        <Button
          onClick={() => {
            onSearch(filtersObject);
            showMoreFilters && isDrawerView && setShowMoreFilters(false);
          }}
          icon={icon}
          type="primary"
          size={size}
          style={{ height: btnHeight, boxShadow: 'none' }}
          loading={loading || isFetching}
        >
          {text}
        </Button>
      );
    };

    const renderTag = (tag) => (
      <Tag closable onClose={() => onTagClose(tag)} key={`${tag.searchKey}-${tag.label}`} color="#fff">
        {tag.title}
      </Tag>
    );

    const renderTags = () => {
      const tagList = filterTags?.list
        ? filterTags.list.map((e) => ({
            ...e,
            title: <FilterTag label={e.label} value={e.tagValue} className={e.className} />,
          }))
        : [];
      return (
        !!filterTags?.list?.length && (
          <div className="mbe-16">
            <Space size={12} align="start">
              <Icon icon="RiFilter2Fill" color="#9D9D9D" size={18} style={{ height: 32 }} />
              <div className={styles.appliedTags}>
                {tagList.map(renderTag)}
                <span>
                  <Button
                    type="link"
                    danger
                    variant="skeleton"
                    onClick={handleFilterReset}
                    disabled={loading}
                    text={t('Clear All')}
                    style={{ height: 32 }}
                  />
                  {onSaveSearch && (
                    <Button type="primary-light" onClick={() => onSaveSearch(filtersObject)} style={{ height: 32 }}>
                      <Icon icon="RiBookmarkFill" size="14px" /> {saveSearchButtonLabel}
                    </Button>
                  )}
                </span>
              </div>
            </Space>
          </div>
        )
      );
    };

    const renderInitialFilters = () => {
      return (
        <Row gutter={8} className={styles.filterMain} style={{ alignItems: 'end' }}>
          {AVAILABLE_FILTERS?.map((item, index) =>
            index <= INITIAL_FILTERS_TO_SHOW - 1 ? (
              <Col span={columnSpan || isMobile ? 24 : 6} key={item.key}>
                <Form.Item key={item.key}>{getFilterType(item)}</Form.Item>
              </Col>
            ) : null,
          )}

          {AVAILABLE_FILTERS.length < INITIAL_FILTERS_TO_SHOW && (
            <Col span={6}>
              <div style={{ marginBlockStart: 23 }}>{searchButton(searchText)}</div>
            </Col>
          )}
        </Row>
      );
    };

    const renderItemWithHeading = (title, child) => (
      <>
        <Title style={{ paddingTop: 12 }} level={5}>
          {title}
        </Title>
        <Divider className="m-0 mbe-16" />
        {child}
      </>
    );

    const renderFilterItem = (item, index) => (
      <Col span={isDrawerView ? 24 : 6} key={`${item.key}-${index}`}>
        <Form.Item className={item?.containerClassName} key={item.key}>
          {getFilterType(item)}
        </Form.Item>
      </Col>
    );

    const renderRestFilters = () =>
      AVAILABLE_FILTERS?.map((item, index) =>
        index > INITIAL_FILTERS_TO_SHOW - 1
          ? item.heading
            ? renderItemWithHeading(item.heading, renderFilterItem(item, index))
            : renderFilterItem(item, index)
          : null,
      );

    const renderDrawerView = () => {
      return (
        AVAILABLE_FILTERS.length > INITIAL_FILTERS_TO_SHOW && (
          <Drawer
            title={
              <>
                <Title level={4} className="mb-0">
                  {t('Filters')}
                </Title>
                <span className="text-muted fs12">{t('Apply filters to organize data accordingly')}</span>
              </>
            }
            closable={false}
            placement={isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right'}
            height={'100vh'}
            width={450}
            onClose={onChangeMoreFilters}
            open={showMoreFilters}
            className={styles.filterMain}
            extra={<Icon icon="IoMdClose" onClick={onChangeMoreFilters} className="pointer" />}
            footer={
              <Row justify="end">
                <Space>
                  <Button className="pi-12" style={{ '--btn-bg': '#9d9d9d' }} onClick={handleFilterReset}>
                    {t('Reset Filters')}
                  </Button>
                  {searchButton(t('Search'), 'default')}
                </Space>
              </Row>
            }
            style={{ '--ant-padding-lg': '16px' }}
          >
            {renderRestFilters()}
          </Drawer>
        )
      );
    };

    const renderFiltersMobile = () => {
      return (
        <div style={{ marginBlock: '10px' }}>
          <Badge count={getBadgeCount()} style={{ top: '5px', insetInlineEnd: '12px' }}>
            <Button
              type="default"
              onClick={() => setShowMoreFilters(true)}
              icon="MdFilterList"
              iconColor={tenantTheme['primary-color']}
            >
              {/* {t('Filters')} */}
            </Button>
          </Badge>
          {renderDrawerView()}
        </div>
      );
    };

    const renderCollapseView = () => {
      return (
        AVAILABLE_FILTERS.length > INITIAL_FILTERS_TO_SHOW && (
          <Collapse
            ghost
            expandIcon={() => (
              <Row justify="center">
                <Button type="link" variant="skeleton" onClick={onChangeMoreFilters}>
                  <span className="semiBold">{showMoreFilters ? t('Show Less') : t('Show More')}</span>
                  <div className={cx(styles.lotiOuter, showMoreFilters && styles.chevronReverse)}>
                    <div className={styles.chevron}></div>
                    <div className={styles.chevron}></div>
                    <div className={styles.chevron}></div>
                  </div>
                </Button>
              </Row>
            )}
            expandIconPosition="centre"
            collapsible="icon"
            className="expandableOuter mbe-8"
          >
            <Collapse.Panel>
              <Row gutter={8} className={styles.filterMain}>
                {renderRestFilters()}
                <Col span={4} style={{ marginTop: 25 }}>
                  {searchButton(searchText)}
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        )
      );
    };

    const getBadgeCount = () => {
      const excludedKeys = [
        ...AVAILABLE_FILTERS.filter((_, index) => index <= INITIAL_FILTERS_TO_SHOW - 1).map((item) => item.key),
        tabFilterKey,
        'areaUnitKey',
        'page',
        'leadDrawerId',
      ];
      return queryObj ? Object.keys(queryObj).filter((key) => !excludedKeys.includes(key)).length : 0;
    };

    const renderFiltersDesktop = () => {
      return (
        <>
          <Group template="1fr auto" gap="8px">
            <div>
              {renderInitialFilters()}
              {isDrawerView ? renderDrawerView() : renderCollapseView()}
            </div>
            <Row
              align="middle"
              justify="space-between"
              wrap={false}
              style={{ marginBlockStart: 23, height: 48, gap: '8px' }}
            >
              {isDrawerView && AVAILABLE_FILTERS.length > INITIAL_FILTERS_TO_SHOW && (
                <Badge className={styles.badgeCount} count={getBadgeCount()}>
                  <Button
                    size="small"
                    onClick={() => {
                      onChangeMoreFilters();
                      onClickMoreFilters();
                    }}
                    className={cx('pi-8', styles.moreFiltersBtn)}
                    style={{ border: 0, margin: 2 }}
                    icon="MdOutlineDoubleArrow"
                    iconSize="1.4em"
                    iconClassName="flipX"
                  >
                    {t('Show More')}
                  </Button>
                </Badge>
              )}
              <Button
                size="small"
                onClick={handleFilterReset}
                style={{ padding: 0, border: 0, backgroundColor: 'transparent', color: tenantTheme['danger-color'] }}
                disabled={
                  !Object.keys(noUrlPush ? filtersObject : queryObj)?.filter(
                    (e) => e !== tabFilterKey && e !== 'page' && e !== 'leadDrawerId',
                  ).length
                }
                type={'link'}
              >
                {t('Clear filters')}
              </Button>
              {AVAILABLE_FILTERS.length >= INITIAL_FILTERS_TO_SHOW && searchButton(searchText)}
              {renderTopRight()}
            </Row>
          </Group>
        </>
      );
    };

    return loading && !AVAILABLE_FILTERS?.length ? (
      <Row>
        <Col span={20}>
          <FiltersSkeleton />
        </Col>

        {children({})}
      </Row>
    ) : children ? (
      children({ renderFiltersDesktop, renderFiltersMobile, renderTags, isData: !!AVAILABLE_FILTERS?.length })
    ) : (
      <>
        {renderFiltersDesktop()}
        {!hideFilterTags && renderTags()}
      </>
    );
  },
);

const FiltersSkeleton = () => {
  return (
    <div className="mb-12" style={{ display: 'flex', gap: '8px', width: '100%' }}>
      {[1, 2, 3, 4].map((e) => (
        <>
          <Group key={e} className="w-100" style={{ gap: '8px' }}>
            <Skeleton.Button active size="small" style={{ height: 30 }} />
            <Skeleton.Input active style={{ borderRadius: 6, width: '100%' }} />
          </Group>
        </>
      ))}
    </div>
  );
};

Filters.defaultProps = {
  onFilterValueChange: () => {},
  onFiltersApply: () => {},
  onFilterClear: () => {},
  onClickMoreFilters: () => {},
  renderTopRight: () => null,
  isDrawerView: true,
};

export default Filters;
