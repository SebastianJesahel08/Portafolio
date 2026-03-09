function clampPercent(value) {
    const number = Number(value);
    if (Number.isNaN(number)) return 0;
    return Math.max(0, Math.min(100, number));
}

function setSkillLevel(item, percentage) {
    const safeValue = clampPercent(percentage);
    const fill = item.querySelector(".bar-fill");
    const valueLabel = item.querySelector(".skill-value");

    if (fill) fill.style.width = `${safeValue}%`;
    if (valueLabel) valueLabel.textContent = `${safeValue}%`;
    item.dataset.level = String(safeValue);
}

function initSkills(root = document) {
    const skillItems = root.querySelectorAll(".skill-item");
    skillItems.forEach((item) => {
        const level = item.dataset.level ?? "0";
        setSkillLevel(item, level);
    });
}

window.setSkillLevel = setSkillLevel;
window.initSkills = initSkills;

initSkills();
