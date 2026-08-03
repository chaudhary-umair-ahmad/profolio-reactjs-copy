import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Divider, Typography } from 'antd';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useAddTaskMutation, useGetTasksTypesQuery, useLazyGetTasksSubTypesQuery } from '../../apis/lms';
import {
  Button,
  DateSelect,
  Drawer,
  ErrorMessage,
  Flex,
  Group,
  Heading,
  notification,
  Select,
  TextInput,
} from '../common';
import ImageUpload from '../image-upload/image-upload';
import { ListingDetailCompact } from '../table/table-components/listing-detail-compact';
import AddInterestDrawer from './add-interest-drawer';
import { getInitialValues, getValidationSchema } from './leads-add-task-form-data';
import { submitTaskClickEvent } from '../../services/analyticsService';
const { Text } = Typography;

const AddTaskDrawer = forwardRef((props, ref) => {
  const { onTaskAdded } = props;
  const { t } = useTranslation();
  const drawerRef = useRef();
  const addInterestDrawerRef = useRef();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const user = useSelector((state) => state.app.loginUser?.user);
  const locale = useSelector((state) => state.app.AppConfig.locale);
  const [subTaskTypes, setSubTaskTypes] = useState([]);
  const [subPlannedTaskTypes, setSubPlannedTaskTypes] = useState([]);
  const [leadId, setLeadId] = useState();
  const allowedFilesType = useMemo(() => ['jpg', 'png', 'jpeg'], []);
  const [loadingStates, setLoadingStates] = useState({
    taskTypes: false,
    completedSubTaskType: false,
    plannedSubTaskType: false,
  });
  const {
    data: taskTypes,
    isLoading: taskTypesLoading,
    isFetching: taskTypesFetching,
    error: TaskTypesError,
  } = useGetTasksTypesQuery({}, { skip: !(leadId || props?.id) });
  const [getTasksSubTypes] = useLazyGetTasksSubTypesQuery();
  const [addTask, { isLoading: btnLoading }] = useAddTaskMutation();

  const onInterestClick = () => (e) => {
    e.stopPropagation();
    addInterestDrawerRef.current.openDrawer({
      leadId: leadId || props?.id,
    });
  };

  const fetchSubTaskTypes = async (taskTypeId, task) => {
    try {
      const loadingKey = task === 'planned' ? 'plannedSubTaskType' : 'completedSubTaskType';
      setLoadingStates({ ...loadingStates, [loadingKey]: true });
      const response = await getTasksSubTypes({ taskId: taskTypeId, categoryId: task == 'planned' ? 1 : 0 });
      if (response) {
        setLoadingStates({ ...loadingStates, [loadingKey]: false });
        if (task == 'planned') {
          setSubPlannedTaskTypes(response?.data);
        } else {
          setSubTaskTypes(response?.data);
        }
      }
    } catch (error) {
      notification.error('Error fetching subtask types');
    }
  };

  const addLeadTask = async (values, actions) => {
    try {
      const response = await addTask({ values, id: props?.id || leadId });
      if (response) {
        if (response?.error) {
          notification.error(response?.error);
        } else {
          onTaskAdded();
          notification.success(response?.data?.message);
          drawerRef.current.closeDrawer();
          actions.resetForm();
        }
      }
    } catch (error) {
      notification.error(response.message);
    }
  };

  useImperativeHandle(ref, () => ({
    openDrawer(lead_id) {
      drawerRef?.current && drawerRef?.current?.openDrawer();
      setLeadId(lead_id);
    },
  }));

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: getValidationSchema(t),
    onSubmit: (values, actions) => {
      submitTaskClickEvent(user, leadId);
      addLeadTask(values, actions);
    },
    enableReinitialize: true,
  });

  const resetValues = () => {
    formik.resetForm();
  };

  const renderDrawerTitle = () => (
    <Flex align="center" gap="10px">
      <Button
        size="small"
        style={{ borderRadius: '50%', border: 0, height: '28px', width: '28px' }}
        type="primaryOutlined"
        icon="IoMdArrowRoundBack"
        onClick={() => drawerRef.current.closeDrawer()}
        iconSize="18px"
        iconClassName="flipX"
      />
      <Text className="fw-700" style={{ fontSize: '18px' }}>
        {t('Add Task')}
      </Text>
    </Flex>
  );

  return (
    <Drawer
      title={renderDrawerTitle()}
      onCloseDrawer={resetValues}
      ref={drawerRef}
      width={isMobile ? '100vw' : '50vw'}
      height={isMobile && '100vh'}
      bodyStyle={{ paddingTop: '0', padding: isMobile && '16px' }}
      headerStyle={{ paddingInline: isMobile && '12px', alignItems: 'start' }}
      placement={isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right'}
      footer={null}
    >
      <form onSubmit={formik.handleSubmit}>
        <Heading as="h4" className="mb-4" style={{ fontSize: isMobile ? '16px' : '18px' }}>
          {t('Completed Task')}
        </Heading>
        <Text type="secondary">{t('Enter information of the last completed task on this lead')}</Text>
        <Divider style={{ marginBlockEnd: '24px', marginBlockStart: '8px' }} />
        <Group className="mb-16" template={isMobile ? 'initial' : 'repeat(2, 1fr)'} gap={isMobile ? '16px' : '44px'}>
          <Select
            label={t('Task Type')}
            name="taskType"
            placeholder={t('Select Task Type')}
            onChange={(value) => {
              formik.setFieldValue('completedTaskType', value);
              fetchSubTaskTypes(value);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.completedTaskType}
            style={{ width: '100%' }}
            getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'name')}
            getOptionValue={(op) => op.id}
            options={taskTypes}
            errorMsg={
              formik.touched.completedTaskType && formik.errors.completedTaskType ? formik.errors.completedTaskType : ''
            }
            inputLoading={taskTypesLoading || taskTypesFetching}
          />

          <Select
            label={t('Task Sub Type')}
            name="subTaskType"
            placeholder={t('Select Task Sub Type')}
            onChange={(value) => formik.setFieldValue('completedsubTaskType', value)}
            onBlur={formik.handleBlur}
            value={formik.values.completedsubTaskType}
            style={{ width: '100%' }}
            disabled={!formik?.values?.['completedTaskType'] || loadingStates?.completedSubTaskType}
            errorMsg={
              formik.touched.completedsubTaskType && formik.errors.completedsubTaskType
                ? formik.errors.completedsubTaskType
                : ''
            }
            options={subTaskTypes}
            getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'name')}
            getOptionValue={(op) => op.id}
            inputLoading={loadingStates?.completedSubTaskType}
          />
        </Group>

        <Group
          className={isMobile ? 'mb-32' : 'mb-40'}
          template={isMobile ? 'initial' : 'repeat(2, 1fr)'}
          style={{ alignItems: 'start' }}
          gap={isMobile ? '16px' : '44px'}
        >
          <DateSelect
            className="date-picker"
            popupClassName="date-dropdown"
            label={t('Completion Date & Time')}
            onChange={(date) => formik.setFieldValue('completionDate', date)}
            value={formik.values.completionDate}
            errorMsg={formik.touched.completionDate && formik.errors.completionDate ? formik.errors.completionDate : ''}
            disabledDate={(current) => current && current > moment().endOf('day')}
            pickerStyle={{ width: '100%', margin: 0 }}
            placeholder={t('Select Completion Date and Time')}
          />
          <ImageUpload
            images={formik.values.attachments}
            setImages={(imgArr) => {
              const updatedImages = imgArr.map((img) => ({ ...img, id: img.uuid }));
              formik.setFieldValue('attachments', updatedImages);
            }}
            name="attachments"
            allowedFiles={allowedFilesType}
            btnText={'Upload'}
            label={
              <span>
                {t('Attachment')}{' '}
                <span style={{ color: tenantTheme.gray550, fontSize: isMobile ? '10px' : '12px' }}>
                  ({t('Optional')})
                </span>
              </span>
            }
            attachmentType={'image'}
          />
          <div>
            <Heading as="h6" className="mb-8">
              {t('Interest')}
            </Heading>
            {!!formik?.values?.taskInterest ? (
              <Flex align="start" gap="2px">
                <ListingDetailCompact {...formik?.values?.taskInterest} />
                <Button
                  icon="IoMdClose"
                  onClick={() => formik.setFieldValue('taskInterest', null)}
                  type="link"
                  style={{ '--btn-content-color': tenantTheme['danger-color'] }}
                />
              </Flex>
            ) : (
              <>
                <Button
                  size="small"
                  icon="FaSquarePlus"
                  iconSize="1em"
                  type="primaryOutlined"
                  block
                  onClick={onInterestClick()}
                  style={{ justifyContent: 'start', width: 'max-content' }}
                >
                  {t('Add Interest')}
                </Button>

                <AddInterestDrawer
                  forTask
                  singleSelect
                  ref={addInterestDrawerRef}
                  setField={formik.setFieldValue}
                  fieldKey={'taskInterest'}
                />
                <div style={{ marginBlockStart: '10px' }}>
                  <ErrorMessage message={formik?.touched?.taskInterest ? formik?.errors?.taskInterest : ''} />
                </div>
              </>
            )}
          </div>
        </Group>

        <Heading as="h4" className="mb-4" style={{ fontSize: isMobile ? '16px' : '18px' }}>
          {t('Planned Task')}
        </Heading>

        <Text type="secondary">{t('Enter information of the next planned task on this lead')}</Text>
        <Divider style={{ marginBlockEnd: '24px', marginBlockStart: '8px' }} />

        <Group className="mb-16" template={isMobile ? 'initial' : 'repeat(2, 1fr)'} gap={isMobile ? '16px' : '44px'}>
          <Select
            label={t('Task Type')}
            name="taskType"
            placeholder={t('Select Task Type')}
            onChange={(value) => {
              formik.setFieldValue('plannedTaskType', value);
              fetchSubTaskTypes(value, 'planned');
            }}
            onBlur={formik.handleBlur}
            value={formik.values.plannedTaskType}
            style={{ width: '100%' }}
            options={taskTypes}
            getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'name')}
            getOptionValue={(op) => op.id}
            errorMsg={
              formik.touched.plannedTaskType && formik.errors.plannedTaskType ? formik.errors.plannedTaskType : ''
            }
            inputLoading={taskTypesLoading || taskTypesFetching}
          />

          <Select
            label={t('Task Sub Type')}
            name="subTaskType"
            placeholder={t('Select Task Sub Type')}
            onChange={(value) => formik.setFieldValue('plannedsubTaskType', value)}
            onBlur={formik.handleBlur}
            value={formik.values.plannedsubTaskType}
            style={{ width: '100%' }}
            errorMsg={
              formik.touched.plannedsubTaskType && formik.errors.plannedsubTaskType
                ? formik.errors.plannedsubTaskType
                : ''
            }
            disabled={!formik?.values?.['plannedTaskType'] || loadingStates?.plannedSubTaskType}
            options={subPlannedTaskTypes}
            getOptionLabel={(op) => tenantUtils.getLocalisedString(op, 'name')}
            getOptionValue={(op) => op.id}
            inputLoading={loadingStates?.plannedSubTaskType}
          />
        </Group>

        <Group
          className={isMobile ? 'mb-32' : 'mb-40'}
          template={isMobile ? 'initial' : 'repeat(2, 1fr)'}
          style={{ alignItems: 'start' }}
          gap={isMobile ? '16px' : '44px'}
        >
          <DateSelect
            className="date-picker"
            popupClassName="date-dropdown"
            label={t('Due Date & Time')}
            onChange={(date) => formik.setFieldValue('dueDate', date)}
            value={formik.values.dueDate}
            errorMsg={formik.touched.dueDate && formik.errors.dueDate ? formik.errors.dueDate : ''}
            disabledDate={(current) => current && current < moment().startOf('day')}
            pickerStyle={{ width: '100%', margin: 0 }}
            placeholder={t('Select Due Date and Time')}
          />
        </Group>

        <Heading as="h4" style={{ fontSize: isMobile ? '16px' : '18px' }}>
          {t('Notes')}{' '}
          <span style={{ color: tenantTheme.gray550, fontSize: isMobile ? '10px' : '12px' }}>({t('Optional')})</span>
        </Heading>

        <Text>{t('Enter any notes and comments regarding the added task')}</Text>

        <div style={{ marginTop: '20px' }}>
          <TextInput
            name="notes"
            placeholder={t('e.g., token has been received')}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.notes}
            lineCount={4}
            maxLength={200}
          />
        </div>

        <Flex
          justify="space-between"
          style={{
            marginLeft: '50%',
            width: '50%',
            paddingTop: '20px',
          }}
        >
          <Button
            type="default"
            style={{ width: '48%', marginRight: '4%' }}
            onClick={() => {
              drawerRef.current.closeDrawer();
            }}
          >
            {t('Cancel')}
          </Button>

          <Button type="primary" htmlType="submit" style={{ width: '48%' }} loading={btnLoading} disabled={btnLoading}>
            {t('Add Task')}
          </Button>
        </Flex>
      </form>
    </Drawer>
  );
});

export default AddTaskDrawer;
