self.handlePushEvent = async function (event) {
  let data = {};
  try {
    if (event.data) {
      const rawText = await event.data.text();

      const parsedData = JSON.parse(rawText);
      data = parsedData.payload || {};
    }
  } catch (e) {
    console.error('Error parsing push event data:', e);
  }

  const title = data.title || 'New Notification';
  const options = {
    body: data.message || 'You have a new message!',
    icon: data.icon || '/default-icon.png',
    data: { urlToOpen: data.urlToOpen },
    actions: data.actions || [], // Supports action buttons
  };
  const showNotifPromise = self.registration.showNotification(title, options);

  // Send a message to open clients (i.e., tabs) that a notification has been shown
  const notifyClients = self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'MOENGAGE_NOTIFICATION_SHOWN',
        payload: {
          title: data.title,
          urlToOpen: data.urlToOpen,
          timestamp: Date.now(),
        },
      });
    });
  });

  event.waitUntil(Promise.all([showNotifPromise, notifyClients]));

  //event.waitUntil(self.registration.showNotification(title, options));
};

self.handleNotificationClick = function (event) {
  event.notification.close();
  const notificationData = event.notification.data || {};

  if (event.action) {
    // Handle action buttons if present
  } else if (notificationData.urlToOpen) {
    event.waitUntil(clients.openWindow(notificationData.urlToOpen));
  }
};
