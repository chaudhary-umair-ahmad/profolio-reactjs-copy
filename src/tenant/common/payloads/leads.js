import { getTimeDateString } from '../../../utility/date';

const addLeadInterestsPayload = (data) => {
  const { selectedListings, leadId } = data || {};
  return {
    interests: selectedListings?.map((itemId) => {
      return {
        lead_id: leadId,
        listing_id: itemId,
      };
    }),
  };
};

const updateLeadNamePayload = (data) => {
  const { leadName } = data || {};
  return {
    lead: {
      name: leadName,
    },
  };
};
const addTaskPayload = (data) => {
  const { values, id } = data || {};
  return {
    task: {
      image_ids: values.attachments.map((img) => img.id),
      task_type_id: values.completedTaskType,
      notes: values.notes,
      task_purpose_id: values.completedsubTaskType,
      completed_at: getTimeDateString(values.completionDate, false, true),
      due_date: getTimeDateString(values.dueDate, false, true),
      taskable_id: id,
      taskable_type: 'Lead',
      listing_id: values?.taskInterest?.id,
      child_attributes: {
        task_type_id: values.plannedTaskType,
        task_purpose_id: values.plannedsubTaskType,
        due_date: getTimeDateString(values.dueDate, false, true),
        taskable_id: id,
        taskable_type: 'Lead',
        listing_id: values?.taskInterest?.id,
      },
    },
  };
};
const addLeadPayload = (data) => {
  const { values, user } = data || {};

  return {
    lead: {
      user_id: user?.id,
      agency_id: user?.agency?.id,
      lead_user_name: values?.name,
      lead_email_address: values?.email,
      lead_phone_number: values?.phone,
      lead_whatsapp_number: values?.whatsapp,
      listing_id: values?.interest?.id,
    },
  };
};

export default { addLeadInterestsPayload, addTaskPayload, updateLeadNamePayload, addLeadPayload };
