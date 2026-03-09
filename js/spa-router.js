const SPA_ROUTES = new Set(["app.html", "index.html", "menu.html", "proyectos.html", "experiencia.html", "contacto.html"]);
const HASH_TO_ROUTE = {
    "#inicio": "app.html",
    "#proyectos": "proyectos.html",
    "#experiencia": "experiencia.html",
    "#contacto": "contacto.html"
};
const ROUTE_TO_HASH = {
    "app.html": "#inicio",
    "index.html": "#inicio",
    "menu.html": "#inicio",
    "proyectos.html": "#proyectos",
    "experiencia.html": "#experiencia",
    "contacto.html": "#contacto"
};

let isNavigating = false;

function getRouteName(url) {
    const parsedUrl = new URL(url, window.location.href);
    const path = parsedUrl.pathname.split("/").pop() || "app.html";
    return path.toLowerCase();
}

function getRouteFromHash(hash) {
    const safeHash = String(hash || "").toLowerCase();
    return HASH_TO_ROUTE[safeHash] || null;
}

function shouldHandleAsSpa(link) {
    if (!link) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;

    const nextUrl = new URL(link.href, window.location.href);
    if (nextUrl.origin !== window.location.origin) return false;

    return SPA_ROUTES.has(getRouteName(nextUrl.href));
}

function bootPageFeatures() {
    const storedTheme = window.getStoredTheme?.() || "dark";
    window.applyTheme?.(storedTheme);
    window.initTheme?.();
    window.initSkills?.();
    window.initReveal?.();
    window.initContactForm?.();
    window.initRabbits?.();
}

function setActiveMenuFromRoute(route) {
    const currentLinks = document.querySelectorAll(".menu-links a");
    currentLinks.forEach((link) => {
        const linkRoute = getRouteName(link.href);
        link.classList.toggle("is-active", linkRoute === route);
    });
}

async function renderRoute(route, options = { updateHistory: true, keepScrollY: null }) {
    if (route === "menu.html" || route === "index.html") route = "app.html";
    if (isNavigating) return;
    if (!SPA_ROUTES.has(route)) return;
    isNavigating = true;

    const keepScrollY = options.keepScrollY ?? window.scrollY;

    try {
        const response = await fetch(route, { cache: "no-store" });
        if (!response.ok) {
            window.location.href = route;
            return;
        }

        const html = await response.text();
        const parser = new DOMParser();
        const nextDocument = parser.parseFromString(html, "text/html");
        const nextMain = nextDocument.querySelector("main.contenido-menu");
        const currentMain = document.querySelector("main.contenido-menu");

        if (!nextMain || !currentMain) {
            window.location.href = route;
            return;
        }

        const bodyClasses = Array.from(nextDocument.body.classList).filter(
            (cssClass) => cssClass !== "light-mode" && cssClass !== "dark-mode"
        );
        const currentThemeClass = document.body.classList.contains("light-mode") ? "light-mode" : "dark-mode";

        document.body.className = `${bodyClasses.join(" ")} ${currentThemeClass}`.trim();
        currentMain.replaceWith(nextMain);
        document.title = nextDocument.title;
        setActiveMenuFromRoute(route);
        bootPageFeatures();

        const panelContent = document.querySelector(".panel-content");
        if (!panelContent || !panelContent.textContent.trim()) {
            window.location.href = route;
            return;
        }

        if (options.updateHistory) {
            const nextHash = ROUTE_TO_HASH[route] || "#inicio";
            const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
            history.pushState({ spa: true, route }, "", nextUrl);
        }

        requestAnimationFrame(() => {
            window.scrollTo(0, keepScrollY);
        });
    } catch {
        window.location.href = route;
    } finally {
        isNavigating = false;
    }
}

function getRouteFromCurrentUrl() {
    return getRouteFromHash(window.location.hash) || getRouteName(window.location.href) || "app.html";
}

function ensureCanonicalHash() {
    const route = getRouteFromCurrentUrl();
    if (!SPA_ROUTES.has(route)) return;

    const targetHash = ROUTE_TO_HASH[route] || "#inicio";
    if (window.location.hash.toLowerCase() === targetHash) return;

    const nextUrl = `${window.location.pathname}${window.location.search}${targetHash}`;
    history.replaceState({ spa: true, route }, "", nextUrl);
}

document.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!shouldHandleAsSpa(link)) return;

    event.preventDefault();
    const route = getRouteName(link.href);
    renderRoute(route, { updateHistory: true, keepScrollY: window.scrollY });
});

window.addEventListener("popstate", () => {
    const route = getRouteFromCurrentUrl();
    if (!SPA_ROUTES.has(route)) return;

    renderRoute(route, { updateHistory: false, keepScrollY: window.scrollY });
});

window.addEventListener("hashchange", () => {
    const route = getRouteFromCurrentUrl();
    if (!SPA_ROUTES.has(route)) return;

    renderRoute(route, { updateHistory: false, keepScrollY: window.scrollY });
});

ensureCanonicalHash();
