/**
 * Initializes UI buttons, overlays, and fullscreen observers.
 * @returns {void}
 */
function initUI() {
    bindClick('btn-start', startGame);
    bindClick('btn-impressum-open', function () { showImpressum(true); });
    bindClick('btn-impressum-close', function () { showImpressum(false); });
    bindClick('btn-restart', restartGame);
    bindClick('btn-home', goHome);
    bindClick('btn-mute-toggle', function () {
        audioManager.toggleMute();
        setMuteButtonState(audioManager.isMuted());
    });
    initFullscreenObservers();
}

/**
 * Adds a click event handler to an element by ID.
 * @param {string} id - Element ID.
 * @param {Function} handler - Click handler function.
 * @returns {void}
 */
function bindClick(id, handler) {
    let el = document.getElementById(id);
    if (el) { el.addEventListener('click', handler); }
}

/**
 * Shows or hides the imprint overlay and syncs mobile controls.
 * @param {boolean} show - Whether to show the imprint.
 * @returns {void}
 */
function showImpressum(show) {
    let imp = document.getElementById('impressum');
    if (show) {
        imp.classList.remove('hidden');
        toggleMobileControls(false);
    } else {
        imp.classList.add('hidden');
        updateMobileControlsVisibility();
    }
}

/**
 * Updates the mute button label according to the current state.
 * @param {boolean} muted - Current mute state.
 * @returns {void}
 */
function setMuteButtonState(muted) {
    let btn = document.getElementById('btn-mute-toggle');
    btn.textContent = 'Mute: ' + (muted ? 'ON' : 'OFF');
}

/**
 * Displays the endscreen of a given type and pauses audio.
 * @param {'win'|'lose'} type - The endscreen type to show.
 * @returns {void}
 */
function showEndscreen(type) {
    let end = document.getElementById('endscreen');
    let cont = document.getElementById('endscreen-content');
    let imgPath = type === 'win'
        ? 'img/You won, you lost/You Won B.png'
        : 'img/You won, you lost/You lost b.png';
    cont.style.backgroundImage = 'url("' + imgPath + '")';
    audioManager.pauseAll(true);
    end.classList.remove('hidden');
    toggleMobileControls(false);
}

/**
 * Shows or hides the mobile controls bar element.
 * @param {boolean} show - True to show, false to hide.
 * @returns {void}
 */
function toggleMobileControls(show) {
    let mc = document.getElementById('mobile-controls');
    if (!mc) { return; }
    if (show) { mc.classList.remove('hidden'); }
    else { mc.classList.add('hidden'); }
}

/**
 * Returns whether there is currently an element in fullscreen.
 * @returns {boolean} True if fullscreen is active.
 */
function isFullscreenActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

/**
 * Requests fullscreen for a given element using vendor-prefixed APIs if needed.
 * @param {HTMLElement} el - Element to make fullscreen.
 * @returns {void}
 */
function requestFullscreenSafe(el) {
    if (!el) { return; }
    if (el.requestFullscreen) { el.requestFullscreen(); return; }
    if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); return; }
    if (el.msRequestFullscreen) { el.msRequestFullscreen(); }
}

/**
 * Exits fullscreen using vendor-prefixed APIs if needed.
 * @returns {void}
 */
function exitFullscreenSafe() {
    if (document.exitFullscreen) { document.exitFullscreen(); return; }
    if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); return; }
    if (document.msExitFullscreen) { document.msExitFullscreen(); }
}

/**
 * Public API wrapper to enter fullscreen mode.
 * @param {HTMLElement} element - Element to enter fullscreen.
 * @returns {void}
 */
function enterFullscreen(element) {
    requestFullscreenSafe(element);
}

/**
 * Public API wrapper to leave fullscreen mode.
 * @returns {void}
 */
function exitFullscreen() {
    exitFullscreenSafe();
}

/**
 * Reacts to fullscreen state changes to show/hide relevant buttons.
 * @returns {void}
 */
function onFullscreenChange() {
    let fsBtn = document.getElementById('fullscreen-button');
    let exBtn = document.getElementById('exit-fullscreen-button');
    let active = isFullscreenActive();
    if (fsBtn) { fsBtn.style.display = active ? 'none' : 'block'; }
    if (exBtn) { exBtn.style.display = active ? 'block' : 'none'; }
}

/**
 * Registers listeners for fullscreenchange events and syncs UI once.
 * @returns {void}
 */
function initFullscreenObservers() {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    onFullscreenChange();
}