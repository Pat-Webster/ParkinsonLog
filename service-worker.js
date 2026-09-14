const CACHE_NAME =
    "parkinsons-log-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


self.addEventListener(
    "install",
    function (event) {

        self.skipWaiting();

        event.waitUntil(
            caches
                .open(CACHE_NAME)
                .then(
                    function (cache) {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );
                    }
                )
        );
    }
);


self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches
                .keys()
                .then(
                    function (cacheNames) {

                        return Promise.all(

                            cacheNames.map(
                                function (name) {

                                    if (
                                        name !==
                                        CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            name
                                        );
                                    }
                                }
                            )
                        );
                    }
                )
                .then(
                    function () {

                        return self.clients.claim();
                    }
                )
        );
    }
);


self.addEventListener(
    "fetch",
    function (event) {

        event.respondWith(

            fetch(event.request)

                .then(
                    function (response) {

                        const copy =
                            response.clone();

                        caches
                            .open(CACHE_NAME)
                            .then(
                                function (cache) {

                                    cache.put(
                                        event.request,
                                        copy
                                    );
                                }
                            );

                        return response;
                    }
                )

                .catch(
                    function () {

                        return caches.match(
                            event.request
                        );
                    }
                )
        );
    }
);