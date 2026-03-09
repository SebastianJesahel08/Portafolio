const contactForm = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");
const submitButton = contactForm?.querySelector('button[type="submit"]');
const toast = document.getElementById("toast");
const FORMSPREE_PREFIX = "https://formspree.io/f/";
const DEFAULT_SUBMIT_LABEL = "Enviar mensaje";
let isSending = false;
let toastTimeoutId = null;

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFeedback(message, type = "") {
    feedback.textContent = message;
    feedback.classList.remove("is-success", "is-error");

    if (type === "success") feedback.classList.add("is-success");
    if (type === "error") feedback.classList.add("is-error");
}

function showToast(message, type = "") {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("success", "error");
    if (type === "success") toast.classList.add("success");
    if (type === "error") toast.classList.add("error");

    toast.classList.add("show");

    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

function setSubmittingState(submitting) {
    isSending = submitting;
    if (!submitButton) return;

    submitButton.disabled = submitting;
    submitButton.textContent = submitting ? "Enviando..." : DEFAULT_SUBMIT_LABEL;
}

if (contactForm && feedback) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (isSending) return;

        const data = new FormData(contactForm);
        const nombre = String(data.get("nombre") || "").trim();
        const email = String(data.get("email") || "").trim();
        const asunto = String(data.get("asunto") || "").trim();
        const mensaje = String(data.get("mensaje") || "").trim();
        const formAction = contactForm.getAttribute("action") || "";

        if (!nombre || !email || !asunto || !mensaje) {
            setFeedback("Completa todos los campos antes de enviar.", "error");
            return;
        }

        if (!isValidEmail(email)) {
            setFeedback("Ingresa un correo valido.", "error");
            return;
        }

        if (!formAction || !formAction.startsWith(FORMSPREE_PREFIX)) {
            setFeedback("Formulario no configurado. Revisa el endpoint de Formspree.", "error");
            return;
        }

        setSubmittingState(true);
        setFeedback("Enviando mensaje...");

        try {
            const response = await fetch(formAction, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                },
                body: data
            });

            if (response.ok) {
                const successMessage = "Mensaje enviado. Gracias por contactarme.";
                setFeedback(successMessage, "success");
                showToast(successMessage, "success");
                contactForm.reset();
                return;
            }

            const failMessage = "No se pudo enviar. Intenta nuevamente en unos minutos.";
            setFeedback(failMessage, "error");
            showToast(failMessage, "error");
        } catch {
            const errorMessage = "Error de red. Verifica tu conexion e intenta otra vez.";
            setFeedback(errorMessage, "error");
            showToast(errorMessage, "error");
        } finally {
            setSubmittingState(false);
        }
    });
}
