self.addEventListener("push", function (event) {
    const options = {
        body: event.data.text(),
        icon: "logo.svg",
        badge: "logo.svg",
    };

    event.waitUntil(self.registration.showNotification("injunweb", options));
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(clients.openWindow("https://dashboard.injunweb.com"));
});
