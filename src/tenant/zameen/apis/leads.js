import tenantTransformers from '@transformers';
import tenantUtils from '@utils';
import { convertQueryObjToString } from '../../../utility/urlQuery';

const leadsEndpoints = {
  getMailCount: {
    query: (userId) => {
      return {
        url: `/api/conversations/unread_conversations_count?${userId && userId != -1 && `q[user_id_eq]=${userId}`}`,
      };
    },
    transformer: (response) => tenantTransformers.mailCountTransformer(response),
  },

  getMessageDetail: {
    query: (messageId) => {
      return {
        url: `/api/conversations/${messageId}`,
      };
    },
  },

  postReply: {
    query: ({ message, messageId }) => {
      return {
        url: `/api/conversations/${messageId}/send_message`,
        method: 'PATCH',
        body: {
          message: { body: message },
        },
      };
    },
  },
  deleteMailThread: {
    query: ({ ids }) => {
      return {
        url: `/api/conversations/${ids}`,
        method: 'DELETE',
      };
    },
  },

  untrashThead: {
    query: ({ id }) => {
      return {
        url: `/api/conversations/${id}/untrash`,
        method: 'PATCH',
      };
    },
  },
  getMailbox: {
    query: ({ type, params, userId }) => {
      const queryParams = {
        ...(type === 'deleted' && { is_trashed: true }),
        ...params,
        ...(userId && userId !== -1 && { [`q[user_id_eq]`]: userId }),
      };
      return {
        url: `/api/conversations?${convertQueryObjToString(queryParams)}`,
      };
    },
    transformer: (response) => {
      if (response?.error) {
        return response;
      } else if (response?.conversations) {
        return {
          conversations: response?.conversations,
          pagination: tenantUtils.getPaginationObject(response?.pagination),
        };
      }
    },
  },
};

export default leadsEndpoints;
