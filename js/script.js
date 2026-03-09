const intro = document.getElementById("intro");
const INTRO_DURATION_MS = 3000;
const FADE_DURATION_MS = 800;
const INTRO_SEEN_KEY = "portfolio-intro-seen";

function revealMenuNow() {
    document.body.classList.add("menu-animate");
    document.body.classList.remove("menu-preload");
}

if (intro) {
    const hasHashRoute = Boolean(window.location.hash);
    const introSeenInSession = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";

    if (hasHashRoute || introSeenInSession) {
        intro.remove();
        revealMenuNow();
        return;
    }

    setTimeout(() => {
        intro.classList.add("oculto");

        setTimeout(() => {
            const hasMenu = Boolean(document.querySelector("main.contenido-menu"));
            if (!hasMenu) {
                window.location.replace("index.html#inicio");
                return;
            }

            intro.remove();
            revealMenuNow();
            sessionStorage.setItem(INTRO_SEEN_KEY, "1");

            if (!window.location.hash) {
                history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}#inicio`);
            }
        }, FADE_DURATION_MS + 20);
    }, INTRO_DURATION_MS);
}
