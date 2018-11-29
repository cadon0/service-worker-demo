self.addEventListener("install", function(event) {
  // Steps to install the service worker
  event.waitUntil(
    caches.open("image-cache").then(function(cache) {
      console.log("Opened cache");
      return cache.add("./logo.svg");
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return cached data
      if (response) {
        console.log(`returning ${event.request} from cache`);
        return response;
      }
      // Not found in cache - fetch from server
      console.log(event.request);
      console.log(`Fetching from server`);
      return fetch(event.request);
    })
  );
});