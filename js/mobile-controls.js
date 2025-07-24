// js/mobile-controls.js
/* global keyboard, toggleMobileControls */

/**
 * Initializes mobile control buttons.
 */
(function initMobileControls() {
    if (!isMobile()) return;

    toggleMobileControls(true);

    bindTouchButton('mc-left', 'LEFT');
    bindTouchButton('mc-right', 'RIGHT');
    bindTouchButton('mc-jump', 'UP');
    bindTouchButton('mc-throw', 'D');
})();

/**
 * Binds a button id to a keyboard property.
 * @param {string} id 
 * @param {string} keyProp 
 */
function bindTouchButton(id, keyProp) {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        keyboard[keyProp] = true;
    }, { passive: false });

    btn.addEventListener('touchend', function (e) {
        e.preventDefault();
        keyboard[keyProp] = false;
    }, { passive: false });
}

/**
 * Simple mobile detection.
 */
function isMobile() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}