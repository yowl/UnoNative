console.debug("[ServiceWorker] Initializing");

let config = {};

self.addEventListener('install', function (e) {
    console.debug('[ServiceWorker] Installing offline worker');
    e.waitUntil(
        fetch("./uno-config.js")
            .then(r => r.text()
                .then(configStr => {
                    eval(configStr);
                    caches.open('managed-a0861c51ec6eb4bd52c549aabf18011805d3e874').then(function (cache) {
                        console.debug('[ServiceWorker] Caching app binaries and content');
                        return cache.addAll(config.offline_files);
                    });
                }
                )
            )
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(async function () {
        try {
            // Network first mode to get fresh content every time, then fallback to
            // cache content if needed.
            return await fetch(event.request);
        } catch (err) {
            return caches.match(event.request).then(response => {
                return response || fetch(event.request);
            });
        }
    }());
});


// managed-a0861c51ec6eb4bd52c549aabf18011805d3e874