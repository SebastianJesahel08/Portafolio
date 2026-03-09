const intro = document.getElementById("intro");
const INTRO_DURATION_MS = 3000;
const FADE_DURATION_MS = 800;

if (intro) {
    setTimeout(() => {
        intro.classList.add("oculto");

        setTimeout(() => {
            window.location.href = "menu.html";
        }, FADE_DURATION_MS);
    }, INTRO_DURATION_MS);
}
