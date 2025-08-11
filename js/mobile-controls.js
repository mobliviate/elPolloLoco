// js/mobile-controls.js
// js/mobile-controls.js
/* global keyboard, world, toggleMobileControls */

/**
 * Ermittelt, ob die Mobile-Controls grundsätzlich erlaubt sind.
 * Kriterium: Pointer "coarse" UND Viewport ≤ 900px.
 * @returns {boolean}
 */
function shouldShowMobileControls() {
    let coarse = window.matchMedia('(pointer: coarse)').matches;
    let small = window.matchMedia('(max-width: 900px)').matches || window.innerWidth <= 900;
    return coarse || small;
}

/**
 * Prüft, ob gerade wirklich gespielt wird (keine Overlays, Welt vorhanden, nicht pausiert).
 * @returns {boolean}
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
 * Ist ein Overlay-Element sichtbar (ohne .hidden)?
 * @param {string} id
 * @returns {boolean}
 */
function isOverlayVisible(id) {
    let el = document.getElementById(id);
    return !!(el && !el.classList.contains('hidden'));
}

/**
 * Aktualisiert die Sichtbarkeit der Mobile-Controls.
 * Nur sichtbar, wenn Mobilemodus aktiv UND Spiel aktiv.
 */
function updateMobileControlsVisibility() {
    let show = shouldShowMobileControls() && isGameActive();
    toggleMobileControls(show);
}

/**
 * Initialisiert die Mobile-Controls nach DOM-Load.
 * Bindet Events nur einmal und schaltet Anzeige dynamisch.
 */
function initMobileControls() {
    updateMobileControlsVisibility();
    bindControlButtonsOnce();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
}

/**
 * Reagiert auf Größen-/Orientierungswechsel.
 */
function handleViewportChange() {
    updateMobileControlsVisibility();
}

/**
 * Bindet Steuertasten (Touch + Maus) einmalig.
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
 * Verknüpft Button mit Keyboard-Flag.
 * @param {string} id
 * @param {string} keyProp
 */
function bindPressButton(id, keyProp) {
    let btn = document.getElementById(id);
    if (!btn) { return; }
    addTouchHandlers(btn, keyProp);
    addMouseHandlers(btn, keyProp);
}

/**
 * Fügt Touch-Handler hinzu.
 * @param {HTMLElement} btn
 * @param {string} keyProp
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
 * Fügt Maus-Handler hinzu (für DevTools-Tests).
 * @param {HTMLElement} btn
 * @param {string} keyProp
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
 * Setzt Keyboard-Flag und markiert Aktivität.
 * @param {string} keyProp
 * @param {boolean} val
 */
function setKeyFlag(keyProp, val) {
    keyboard[keyProp] = val;
    if (world && world.character && world.character[0] && val) {
        world.character[0].markActive();
    }
}

/* DOM-Load Hook */
window.addEventListener('load', function () {
    initMobileControls();
});