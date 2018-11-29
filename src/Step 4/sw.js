self.addEventListener("install", function(event) {
  // Steps to install the service worker
  event.waitUntil(
    caches.open("image-cache").then(function(cache) {
      return cache.add("./logo.png");
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(tryNetworkWithTimeout(event.request, 1000).catch(tryCache));
});

function tryNetworkWithTimeout(request, timeout) {
  console.log("Attempting to use the network...");
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(reject, timeout);

    fetch(request).then(response => {
      console.log("Fetch from network successful!");
      clearTimeout(timeoutId);
      resolve(response);
    });
  });
}

async function tryCache(request) {
  console.log("Fetch from network took too long, searching cache...");
  const cache = await caches.open("image-cache");
  const matching = await cache.match(request);
  if (matching) {
    console.log("Found in cache!");
    return matching;
  }
  console.log("Not found in cache either :(");
}
