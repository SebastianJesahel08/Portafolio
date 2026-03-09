// Capturamos el bloque de intro para manipular su salida en pantalla.
const intro = document.getElementById("intro");

// Espera 3 segundos para que el usuario vea la presentacion inicial.
if (intro) {
    setTimeout(() => {
        // Activa la clase que desvanece el intro.
        intro.classList.add("oculto");

        // Espera lo que dura la transicion y luego lleva al menu real.
        setTimeout(() => {
            window.location.href = "menu.html";
        }, 800);
    }, 3000);
}
