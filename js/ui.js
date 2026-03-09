let revealObserver = null;

function initReveal(root = document) {
    if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
    }

    const revealElements = root.querySelectorAll(".reveal");
    if (revealElements.length === 0) return;

    revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
}

window.initReveal = initReveal;

initReveal();
