self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("expense-store").then(cache=>{
            return cache.addAll([
                "index.html",
                "dashboard.html",
                "style.css",
                "script.js"
            ]);
        })
    );
});