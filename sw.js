/* Matemiks: internetsiz ishlash uchun kesh */
var VER="matemiks-de9e628e42",FILES=["./", "adv.js", "app.js", "chess-engine.js", "chess.js", "diploma.js", "extras.js", "games2.js", "games3.js", "icons/favicon-32.png", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "index.html", "know-data.js", "know-data2.js", "know-data3.js", "know-home-a.js", "know-home-a2.js", "know-home-b.js", "know-home-b2.js", "know-home-uz.js", "know.js", "lang/adv-i18n.js", "lang/chess-i18n.js", "lang/en.js", "lang/games2-i18n.js", "lang/kk.js", "lang/know-i18n.js", "lang/ky.js", "lang/parent-i18n.js", "lang/ru.js", "lang/tg.js", "lang/tk.js", "lang/tr.js", "lang/uz.js", "lang/world-i18n.js", "manifest.webmanifest", "parent.js", "style.css", "sudoku2.js", "world-data.js", "world.js"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VER).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VER&&k!=="matemiks-fonts"&&k.indexOf("matemiks-")===0}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);if(e.request.method!=="GET")return;
  if(u.host.indexOf("fonts.g")===0){ // shriftlar: keshdan, bo'lmasa tarmoqdan
    e.respondWith(caches.open("matemiks-fonts").then(function(c){return c.match(e.request).then(function(r){return r||fetch(e.request).then(function(n){c.put(e.request,n.clone());return n})})}));return}
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||fetch(e.request)}));
});
