const contactForm = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");

if (contactForm && feedback) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = new FormData(contactForm);
        const nombre = String(data.get("nombre") || "").trim();
        const email = String(data.get("email") || "").trim();
        const asunto = String(data.get("asunto") || "").trim();
        const mensaje = String(data.get("mensaje") || "").trim();
        const formAction = contactForm.getAttribute("action") || "";

        if (!nombre || !email || !asunto || !mensaje) {
            feedback.textContent = "Completa todos los campos antes de enviar.";
            return;
        }

        if (!formAction || formAction.includes("REEMPLAZA_TU_FORM_ID")) {
            feedback.textContent = "Configura tu Formspree ID en contacto.html para activar el envio.";
            return;
        }

        feedback.textContent = "Enviando mensaje...";

        try {
            const response = await fetch(formAction, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                },
                body: data
            });

            if (response.ok) {
                feedback.textContent = "Mensaje enviado. Gracias por contactarme.";
                contactForm.reset();
                return;
            }

            feedback.textContent = "No se pudo enviar. Intenta nuevamente en unos minutos.";
        } catch {
            feedback.textContent = "Error de red. Verifica tu conexion e intenta otra vez.";
        }
    });
}
