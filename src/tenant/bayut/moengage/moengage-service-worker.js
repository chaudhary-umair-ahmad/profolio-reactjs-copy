importScripts('https://cdn.moengage.com/release/dc_1/versions/2.49.0/serviceworker_cdn.min.latest.js');
importScripts('/moengage-service-worker-handler.js');

self.addEventListener('push', async function (event) {
  handlePushEvent(event);
});

self.addEventListener('notificationclick', function (event) {
  handleNotificationClick(event);
});
