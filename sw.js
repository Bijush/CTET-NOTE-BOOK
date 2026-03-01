// ===============================
// 🔥 CTET APP SERVICE WORKER
// FULL UPDATED PRO VERSION
// ===============================

// 🔁 CHANGE VERSION EVERY UPDATE
const CACHE_VERSION = "ctet-app-v7";

// Static cache name
const STATIC_CACHE = CACHE_VERSION;


// ===============================
// 📦 FILES TO CACHE
// (FULL LIST — NOTHING REMOVED)
// ===============================

const STATIC_ASSETS = [

/* ROOT */
"./",
"./index.html",
"./offline.html",

/* CSS */
"./css/common.css",
"./css/mcq.css",
"./css/theory.css",

/* JS */
"./js/dashboard.js",
"./js/mcq.js",
"./js/auth.js",
"./js/piaget-mcq.js",
"./js/piaget.js",
"./js/bookmarks.js",
"./js/bookmark-view.js",
"./js/weak.js",

/* DATA */
"./data/piaget_mcq_question.js",
"./data/mcq_question.js",
"./data/mock_question.js",




/* PAGES */
"./pages/dashboard.html",
"./pages/mcq.html",
"./pages/piaget.html",
"./pages/piaget-mcq.html",
"./pages/bookmarks.html",
"./pages/bookmark-view.html",
"./pages/revision.html",
"./pages/weak.html",

/* MANIFEST */
"./manifest.json"

];


// ===============================
// 📦 INSTALL
// ===============================

self.addEventListener(
"install",
event => {

console.log(
"📦 SW Installing:",
CACHE_VERSION
);

// Safe caching (no crash if file missing)
event.waitUntil(

caches.open(STATIC_CACHE)
.then(async cache => {

console.log("✅ Caching App Shell");

for (const file of STATIC_ASSETS){

try{

await cache.add(file);

}catch(err){

console.warn(
"❌ Cache failed:",
file
);

}

}

})

);

// Activate immediately
self.skipWaiting();

}
);


// ===============================
// 🧹 ACTIVATE
// ===============================

self.addEventListener(
"activate",
event => {

console.log("🧹 SW Activating");

event.waitUntil(

caches.keys().then(keys =>

Promise.all(

keys.map(key => {

if(key !== STATIC_CACHE){

console.log(
"🗑️ Removing old cache:",
key
);

return caches.delete(key);

}

})

)

)

);

self.clients.claim();

}
);


// ===============================
// 🔄 FORCE UPDATE SUPPORT
// ===============================

self.addEventListener(
"message",
event => {

if(
event.data &&
event.data.action ===
"skipWaiting"
){

console.log(
"⚡ Force Updating"
);

self.skipWaiting();

}

}
);


// ===============================
// 🌐 FETCH STRATEGY
// ===============================

self.addEventListener(
"fetch",
event => {

const req = event.request;
const url = new URL(req.url);


// ❌ Skip API / Firebase / JSON
if(

url.pathname.endsWith(".json") ||
url.hostname.includes("firebase") ||
url.hostname.includes("googleapis") ||
url.hostname.includes("gstatic")

){

event.respondWith(fetch(req));
return;

}


// ===========================
// 🟢 HTML → Network First
// ===========================

if(req.mode === "navigate"){

event.respondWith(

fetch(req)
.then(res => {

const copy = res.clone();

caches.open(STATIC_CACHE)
.then(c =>
c.put(req, copy)
);

return res;

})
.catch(() =>
caches.match("./offline.html")
)

);

return;

}


// ===========================
// 🟡 STATIC → Cache First
// ===========================

event.respondWith(

caches.match(req)
.then(cached => {

if(cached) return cached;

return fetch(req)
.then(res => {

if(
res &&
res.status === 200 &&
res.type === "basic"
){

const copy = res.clone();

caches.open(STATIC_CACHE)
.then(c =>
c.put(req, copy)
);

}

return res;

})
.catch(()=>{

if(
req.destination ===
"document"
){

return caches.match(
"./offline.html"
);

}

});

})

);

}
);


// ===============================
// 📊 VERSION LOG
// ===============================

self.addEventListener(
"activate",
()=>{

console.log(
"🚀 CTET APP VERSION:",
CACHE_VERSION
);

}
);
