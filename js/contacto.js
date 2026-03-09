const FORMSPREE_PREFIX = "https://formspree.io/f/";
const DEFAULT_SUBMIT_LABEL = "Enviar mensaje";

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setFeedback(feedback, message, type = "") {
    feedback.textContent = message;
    feedback.classList.remove("is-success", "is-error");

    if (type === "success") feedback.classList.add("is-success");
    if (type === "error") feedback.classList.add("is-error");
}

function showToast(toast, state, message, type = "") {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("success", "error");
    if (type === "success") toast.classList.add("success");
    if (type === "error") toast.classList.add("error");

    toast.classList.add("show");

    if (state.toastTimeoutId) clearTimeout(state.toastTimeoutId);
    state.toastTimeoutId = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

function setSubmittingState(submitButton, state, submitting) {
    state.isSending = submitting;
    if (!submitButton) return;

    submitButton.disabled = submitting;
    submitButton.textContent = submitting ? "Enviando..." : DEFAULT_SUBMIT_LABEL;
}

function initContactForm(root = document) {
    const contactForm = root.getElementById("contact-form");
    const feedback = root.getElementById("form-feedback");
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    const toast = root.getElementById("toast");
    const state = { isSending: false, toastTimeoutId: null };

    if (!contactForm || !feedback) return;

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (state.isSending) return;

        const data = new FormData(contactForm);
        const nombre = String(data.get("nombre") || "").trim();
        const email = String(data.get("email") || "").trim();
        const asunto = String(data.get("asunto") || "").trim();
        const mensaje = String(data.get("mensaje") || "").trim();
        const formAction = contactForm.getAttribute("action") || "";

        if (!nombre || !email || !asunto || !mensaje) {
            setFeedback(feedback, "Completa todos los campos antes de enviar.", "error");
            return;
        }

        if (!isValidEmail(email)) {
            setFeedback(feedback, "Ingresa un correo valido.", "error");
            return;
        }

        if (!formAction || !formAction.startsWith(FORMSPREE_PREFIX)) {
            setFeedback(feedback, "Formulario no configurado. Revisa el endpoint de Formspree.", "error");
            return;
        }

        setSubmittingState(submitButton, state, true);
        setFeedback(feedback, "Enviando mensaje...");

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
                setFeedback(feedback, successMessage, "success");
                showToast(toast, state, successMessage, "success");
                contactForm.reset();
                return;
            }

            const failMessage = "No se pudo enviar. Intenta nuevamente en unos minutos.";
            setFeedback(feedback, failMessage, "error");
            showToast(toast, state, failMessage, "error");
        } catch {
            const errorMessage = "Error de red. Verifica tu conexion e intenta otra vez.";
            setFeedback(feedback, errorMessage, "error");
            showToast(toast, state, errorMessage, "error");
        } finally {
            setSubmittingState(submitButton, state, false);
        }
    });
}

window.initContactForm = initContactForm;

initContactForm();
