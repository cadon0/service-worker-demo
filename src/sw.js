// self.addEventListener("install", function(event) {
//   // Steps to install the service worker
//   event.waitUntil(
//     caches.open("image-cache").then(function(cache) {
//       return cache.add("./logo.png");
//     })
//   );
// });

// self.addEventListener("fetch", function(event) {
//   event.respondWith(tryNetworkWithTimeout(event.request, 1000).catch(tryCache));
// });

// function tryNetworkWithTimeout(request, timeout) {
//   console.log("Attempting to use the network...");
//   return new Promise((resolve, reject) => {
//     const timeoutId = setTimeout(reject(request), timeout);

//     fetch(request).then(response => {
//       console.log(`Fetching ${request.url} from network successful!`);
//       clearTimeout(timeoutId);
//       resolve(response);
//     });
//   });
// }

// async function tryCache(request) {
//   console.log("Fetch from network took too long, searching cache...");
//   const cache = await caches.open("image-cache");
//   const matching = await cache.match(request);
//   if (matching) {
//     console.log("Found in cache!");
//     return matching;
//   }
//   console.log("Not found in cache either :(");
// }

var CACHE = "network-or-cache";

self.addEventListener("install", function(evt) {
  console.log("The service worker is being installed.");
  evt.waitUntil(precache());
});

self.addEventListener("fetch", function(evt) {
  console.log("The service worker is serving the asset.");
  evt.respondWith(
    fromNetwork(evt.request, 400).catch(function() {
      return fromCache(evt.request);
    })
  );
});

function precache() {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll(["./logo.png"]);
  });
}

function fromNetwork(request, timeout) {
  return new Promise(function(fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function(response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      return matching || Promise.reject("no-match");
    });
  });
}
