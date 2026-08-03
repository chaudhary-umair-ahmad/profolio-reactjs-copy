export const mailCountTransformer = (response) => {
  return {
    data: {
      'user-inbox': response?.unread_conversations_count,
      'user-deleted': response?.counts?.deleted,
    },
  };
};

export default { mailCountTransformer };
