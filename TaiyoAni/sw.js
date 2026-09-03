// sw.js - TaiyoAni Background Push Worker
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// ดักรับสัญญาณ Push จากเซิร์ฟเวอร์ Google ตอนปิดเว็บ/ปิดเบราว์เซอร์
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'TaiyoAni UI Hub', body: event.data.text() };
  }

  const title = data.title || '🔔 มีการแจ้งเตือนใหม่';
  const options = {
    body: data.body || 'มีกิจกรรมใหม่ในทีม TaiyoAni Hub',
    icon: data.icon || './Tanomiya.png',
    badge: './Tanomiya.png',
    vibrate: [300, 100, 300, 100, 300], // สั่นระดับฮาร์ดแวร์
    tag: data.tag || 'taiyoani-alert',
    renotify: true,
    requireInteraction: true,
    data: {
      linkView: data.linkView || 'home'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// จัดการเมื่อกดคลิกที่แถบแจ้งเตือนของเครื่อง
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetView = event.notification.data ? event.notification.data.linkView : 'home';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'NAVIGATE_VIEW', view: targetView });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(`./?view=${targetView}`);
      }
    })
  );
});

// รองรับการยิงแจ้งเตือนภายในหน้าเว็บตามปกติ
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      icon: './Tanomiya.png',
      badge: './Tanomiya.png',
      vibrate: [250, 100, 250],
      requireInteraction: true,
      ...options
    });
  }
});