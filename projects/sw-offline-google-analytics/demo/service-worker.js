/* eslint-env worker, serviceworker */
/* global goog */

const CACHE_NAME = 'runtime-caching';
self.goog = {DEBUG: true};
importScripts('../build/offline-google-analytics-import.js');

// First, enable the offline Google Analytics behavior.
// This will get "first shot" at responding to Google Analytics requests, before
// our catch-all fetch event listener can handle it.
goog.useOfflineGoogleAnalytics();

// Use a basic network-first caching strategy as a catch-all for everything
// other than the Google Analytics requests.
// (In a real app, you'd want to use a more sophisticated caching technique.)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return fetch(event.request).then(response => {
        return cache.put(event.request, response.clone()).then(() => response);
      }).catch(() => cache.match(event.request));
    })
  );
});
