"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["./index.html","b5e1dc0c638ad7187337cf64066b53fb"],["./static/css/main.0d507d0d.css","d399220f15f067085d22e1e43f408786"],["./static/js/main.77d4871a.js","411a4983dff3f20dc23c32cf5220b851"],["./static/media/Awesome_message.9b222ef4.mp3","9b222ef4d2a57f0f787b5f0421dc6824"],["./static/media/GoodWork_message.eeb08f07.mp3","eeb08f07c01c479fe6709cf845022f81"],["./static/media/Lesson_format_CorrectSound1.6a600f0e.mp3","6a600f0ed97f6d4c619ef2095217a604"],["./static/media/Lesson_format_CorrectSound2.a3b6e330.mp3","a3b6e330211fe750024f390c0dbdb09e"],["./static/media/Lesson_format_CorrectSound3.faea2305.mp3","faea2305cbd921f90d8de54fb17cbfc4"],["./static/media/NiceTry_message.77f360e3.mp3","77f360e3ac726cfc970f6fc986a8f5da"],["./static/media/TryAgain_message.eef1fe3c.mp3","eef1fe3c99b578b602484291af7fe523"],["./static/media/difficult123.14364316.png","143643167cec3fcf9550cc756b9e3619"],["./static/media/game_and_pause.1ba62599.png","1ba6259904462740e26f4976d858ba36"],["./static/media/main.f30382b1.png","f30382b19524d6ca203291de85892f88"],["./static/media/pause_menu.d511dcf4.png","d511dcf4afb12fe52ce910399fde6860"],["./static/media/pause_menu_background.b8ad9118.png","b8ad9118ae1d34222890dfb7ecb15c69"],["./static/media/response-image.5c087bca.png","5c087bca5b88f500fc761ce6d3a1ed9b"],["./static/media/results.e4ff03b6.png","e4ff03b6382cc72f1b46df8c8c1e8ad9"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,n,a){var r=new URL(e);return a&&r.pathname.match(a)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),r=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),r]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var a=new Request(n,{credentials:"same-origin"});return fetch(a).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),t=urlsToCacheKeys.has(n));!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(n=new URL("./index.html",self.location).toString(),t=urlsToCacheKeys.has(n)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});