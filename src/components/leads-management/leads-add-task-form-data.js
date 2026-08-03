import * as Yup from 'yup';

export const getInitialValues = () => ({
  completedTaskType: null,
  completedsubTaskType: null,
  plannedTaskType: null,
  plannedsubTaskType: null,
  completionDate: null,
  dueDate: null,
  notes: '',
  attachments: [],
  taskInterest: null,
});

export const getValidationSchema = (t) =>
  Yup.object().shape({
    completedTaskType: Yup.string().required(t('Task Type is required')),
    completedsubTaskType: Yup.string().required(t('Sub task type is required')),
    plannedTaskType: Yup.string().required(t('Task Type is required')),
    plannedsubTaskType: Yup.string().required(t('Sub task type is required')),
    completionDate: Yup.date().nullable().required(t('Completion date is required')),
    dueDate: Yup.date().nullable().required(t('Due date is required')),
    notes: Yup.string().optional(),
    attachments: Yup.array().of(Yup.object()).optional(),
    taskInterest: Yup.object().nullable().required(t('Interest is required')),
  });
