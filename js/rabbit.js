const rabbitLanes = document.querySelectorAll("[data-rabbit-lane]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WALK_IMAGES = ["img/walk1.png", "img/probe5.png"];
const JUMP_IMAGE = "img/probe5.png";
const WALK_FRAME_TIME = 0.14;

function initRabbit(lane) {
    const rabbit = lane.querySelector(".pixel-rabbit");
    const sprite = rabbit?.querySelector(".rabbit-sprite");
    if (!rabbit || !sprite) return null;

    const state = {
        x: 0,
        y: 0,
        dir: 1,
        speed: 52,
        maxX: 0,
        jumpVelocity: 0,
        jumping: false,
        walkFrame: 0,
        walkElapsed: 0
    };

    function updateBounds() {
        state.maxX = Math.max(0, lane.clientWidth - rabbit.offsetWidth - 8);
        state.x = Math.min(state.x, state.maxX);
    }

    function jump() {
        if (state.jumping) return;
        state.jumping = true;
        state.jumpVelocity = -230;
    }

    rabbit.addEventListener("click", jump);
    updateBounds();
    return { rabbit, sprite, state, updateBounds };
}

const rabbits = Array.from(rabbitLanes).map(initRabbit).filter(Boolean);

function renderRabbit(entity) {
    const { rabbit, sprite, state } = entity;
    const spriteUrl = state.jumping ? JUMP_IMAGE : WALK_IMAGES[state.walkFrame];
    sprite.style.backgroundImage = `url("${spriteUrl}")`;
    rabbit.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scaleX(${state.dir})`;
}

if (rabbits.length > 0) {
    let lastTime = performance.now();

    function animate(now) {
        const dt = Math.min(0.04, (now - lastTime) / 1000);
        lastTime = now;

        rabbits.forEach((entity) => {
            const { state } = entity;

            if (!reduceMotion) {
                state.x += state.dir * state.speed * dt;
                state.walkElapsed += dt;

                if (!state.jumping && state.walkElapsed >= WALK_FRAME_TIME) {
                    state.walkFrame = (state.walkFrame + 1) % WALK_IMAGES.length;
                    state.walkElapsed = 0;
                }

                if (state.x >= state.maxX) {
                    state.x = state.maxX;
                    state.dir = -1;
                } else if (state.x <= 0) {
                    state.x = 0;
                    state.dir = 1;
                }
            }

            if (state.jumping) {
                state.jumpVelocity += 760 * dt;
                state.y += state.jumpVelocity * dt;

                if (state.y >= 0) {
                    state.y = 0;
                    state.jumpVelocity = 0;
                    state.jumping = false;
                }
            } else {
                state.y = 0;
            }

            renderRabbit(entity);
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    window.addEventListener("resize", () => rabbits.forEach((rabbit) => rabbit.updateBounds()));
}
