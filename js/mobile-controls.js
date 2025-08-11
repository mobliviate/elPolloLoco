/**
 * Determines whether mobile controls should be considered at all.
 * Criterion: pointer "coarse" OR viewport ≤ 900px.
 * @returns {boolean} True if device likely needs touch controls.
 */
function shouldShowMobileControls() {
    let coarse = window.matchMedia('(pointer: coarse)').matches;
    let small = window.matchMedia('(max-width: 900px)').matches || window.innerWidth <= 900;
    return coarse || small;
}

/**
 * Checks if the game is actively running without overlays or pause.
 * @returns {boolean} True when playing is possible.
 */
function isGameActive() {
    if (!window.world) { return false; }
    if (world.gameOver) { return false; }
    if (world.paused) { return false; }
    if (isOverlayVisible('start-screen')) { return false; }
    if (isOverlayVisible('endscreen')) { return false; }
    if (isOverlayVisible('impressum')) { return false; }
    if (isOverlayVisible('orientation-overlay')) { return false; }
    return true;
}

/**
 * Returns if a given overlay element is visible (no .hidden class).
 * @param {string} id - Element ID to check.
 * @returns {boolean} True if element exists and is visible.
 */
function isOverlayVisible(id) {
    let el = document.getElementById(id);
    return !!(el && !el.classList.contains('hidden'));
}

/**
 * Computes and applies visibility of mobile controls bar.
 * Only visible when mobile mode AND game active.
 * @returns {void}
 */
function updateMobileControlsVisibility() {
    let show = shouldShowMobileControls() && isGameActive();
    toggleMobileControls(show);
    toggleKeyMap(!show);
}

/**
 * Initializes mobile controls: binds handlers once and updates on load.
 * @returns {void}
 */
function initMobileControls() {
    updateMobileControlsVisibility();
    bindControlButtonsOnce();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
}

/**
 * Handles viewport changes (resize/orientation) by recalculating visibility.
 * @returns {void}
 */
function handleViewportChange() {
    updateMobileControlsVisibility();
}

/**
 * Binds touch/mouse handlers to control buttons; runs once.
 * @returns {void}
 */
function bindControlButtonsOnce() {
    if (bindControlButtonsOnce.done) { return; }
    bindPressButton('mc-left', 'LEFT');
    bindPressButton('mc-right', 'RIGHT');
    bindPressButton('mc-jump', 'UP');
    bindPressButton('mc-throw', 'D');
    bindControlButtonsOnce.done = true;
}

/**
 * Associates a button element with a Keyboard property.
 * @param {string} id - Button element ID.
 * @param {string} keyProp - Property on Keyboard (e.g., 'LEFT').
 * @returns {void}
 */
function bindPressButton(id, keyProp) {
    let btn = document.getElementById(id);
    if (!btn) { return; }
    addTouchHandlers(btn, keyProp);
    addMouseHandlers(btn, keyProp);
}

/**
 * Attaches touchstart/touchend handlers to a control button.
 * @param {HTMLElement} btn - Target button element.
 * @param {string} keyProp - Keyboard property to toggle.
 * @returns {void}
 */
function addTouchHandlers(btn, keyProp) {
    btn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        setKeyFlag(keyProp, true);
    }, { passive: false });

    btn.addEventListener('touchend', function (e) {
        e.preventDefault();
        setKeyFlag(keyProp, false);
    }, { passive: false });
}

/**
 * Attaches mouse handlers (for DevTools testing) to a control button.
 * @param {HTMLElement} btn - Target button element.
 * @param {string} keyProp - Keyboard property to toggle.
 * @returns {void}
 */
function addMouseHandlers(btn, keyProp) {
    btn.addEventListener('mousedown', function (e) {
        e.preventDefault();
        setKeyFlag(keyProp, true);
    });

    btn.addEventListener('mouseup', function (e) {
        e.preventDefault();
        setKeyFlag(keyProp, false);
    });

    btn.addEventListener('mouseleave', function () {
        setKeyFlag(keyProp, false);
    });
}

/**
 * Sets a Keyboard flag and marks the character active when pressed.
 * @param {string} keyProp - Property name to set on keyboard.
 * @param {boolean} val - New boolean value.
 * @returns {void}
 */
function setKeyFlag(keyProp, val) {
    keyboard[keyProp] = val;
    if (world && world.character && world.character[0] && val) {
        world.character[0].markActive();
    }
}

/**
 * DOM load hook: initializes mobile controls after the page has loaded.
 * @returns {void}
 */
window.addEventListener('load', function () {
    initMobileControls();
});