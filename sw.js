const CACHE_NAME = "todo-app-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./todo.css",
    "./todo.js",
    "./manifest.json",
    "./icon.png"
];

// Зберігаємо файли в кеш при встановленні
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

// Віддаємо файли з кешу, якщо немає інтернету
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
