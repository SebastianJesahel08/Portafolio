const THEME_STORAGE_KEY = "portfolio-theme";

function applyTheme(theme) {
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    document.body.classList.toggle("dark-mode", !isLight);
    document.documentElement.style.backgroundColor = isLight ? "#ffffff" : "#000000";

    const toggle = document.getElementById("theme-toggle");
    if (toggle) toggle.checked = isLight;
}

function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function getStoredTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY) || "dark";
}

function initTheme() {
    applyTheme(getStoredTheme());

    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.onchange = (event) => {
        const theme = event.target.checked ? "light" : "dark";
        applyTheme(theme);
        saveTheme(theme);
    };
}

window.initTheme = initTheme;
window.applyTheme = applyTheme;
window.getStoredTheme = getStoredTheme;

initTheme();
