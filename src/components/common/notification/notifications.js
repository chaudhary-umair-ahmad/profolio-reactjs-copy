import { message as msg } from 'antd';

const getNotificationArgs = (message, title) => ({
  title: title,
  description: message,
});

const notify = {
  error: (message, duration = 4.5) => {
    msg.error({
      content: message,
      className: 'errorMessage',
      duration: duration,
    });
    // msg.error({ ...getNotificationArgs(message, title || 'Error') });
  },
  success: (message, title) => {
    msg.success({ content: message, className: 'successMessage' });
    // msg.success({ ...getNotificationArgs(message, title || 'Success') });
  },
  info: (message, duration = 4.5) => {
    msg.info({
      content: message,
      className: 'infoMessage',
      duration: duration,
    });
  },
  //   ...notification,
};

export default notify;
