const SPA_ROUTES = new Set(["menu.html", "proyectos.html", "experiencia.html", "contacto.html"]);
let isNavigating = false;

function getRouteName(url) {
    const parsedUrl = new URL(url, window.location.href);
    const path = parsedUrl.pathname.split("/").pop() || "";
    return path.toLowerCase();
}

function shouldHandleAsSpa(link) {
    if (!link) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;

    const nextUrl = new URL(link.href, window.location.href);
    if (nextUrl.origin !== window.location.origin) return false;
    if (nextUrl.hash && nextUrl.pathname === window.location.pathname) return false;

    return SPA_ROUTES.has(getRouteName(nextUrl.href));
}

function bootPageFeatures() {
    window.initTheme?.();
    window.initSkills?.();
    window.initReveal?.();
    window.initContactForm?.();
    window.initRabbits?.();
}

async function renderRoute(url, options = { pushState: true, keepScrollY: null }) {
    if (isNavigating) return;
    isNavigating = true;

    const keepScrollY = options.keepScrollY ?? window.scrollY;

    try {
        const response = await fetch(url, { headers: { "X-Requested-With": "spa-router" } });
        if (!response.ok) {
            window.location.href = url;
            return;
        }

        const html = await response.text();
        const parser = new DOMParser();
        const nextDocument = parser.parseFromString(html, "text/html");
        const nextMain = nextDocument.querySelector("main.contenido-menu");
        const currentMain = document.querySelector("main.contenido-menu");

        if (!nextMain || !currentMain) {
            window.location.href = url;
            return;
        }

        const baseBodyClasses = Array.from(nextDocument.body.classList).filter(
            (cssClass) => cssClass !== "light-mode" && cssClass !== "dark-mode"
        );

        document.body.className = baseBodyClasses.join(" ");
        currentMain.replaceWith(nextMain);
        document.title = nextDocument.title;

        if (options.pushState) {
            history.pushState({ spa: true }, "", url);
        }

        bootPageFeatures();

        requestAnimationFrame(() => {
            window.scrollTo(0, keepScrollY);
        });
    } catch {
        window.location.href = url;
    } finally {
        isNavigating = false;
    }
}

document.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!shouldHandleAsSpa(link)) return;

    event.preventDefault();
    renderRoute(link.href, { pushState: true, keepScrollY: window.scrollY });
});

window.addEventListener("popstate", () => {
    const routeName = getRouteName(window.location.href);
    if (!SPA_ROUTES.has(routeName)) return;

    renderRoute(window.location.href, { pushState: false, keepScrollY: window.scrollY });
});
