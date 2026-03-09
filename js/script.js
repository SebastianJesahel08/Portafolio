const intro = document.getElementById("intro");
const INTRO_DURATION_MS = 3000;
const FADE_DURATION_MS = 800;

if (intro) {
    setTimeout(() => {
        intro.classList.add("oculto");

        setTimeout(() => {
            const hasMenu = Boolean(document.querySelector("main.contenido-menu"));
            if (!hasMenu) {
                window.location.replace("index.html#inicio");
                return;
            }

            intro.remove();
            document.body.classList.add("menu-animate");
            document.body.classList.remove("menu-preload");

            if (!window.location.hash) {
                history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}#inicio`);
            }
        }, FADE_DURATION_MS + 20);
    }, INTRO_DURATION_MS);
}
