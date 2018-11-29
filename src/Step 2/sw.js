self.addEventListener("install", function(event) {
  // Steps to install the service worker
  event.waitUntil(
    caches.open("image-cache").then(function(cache) {
      console.log("Opened cache");
      return cache.add("./logo.svg");
    })
  );
});
