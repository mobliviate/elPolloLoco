// js/orientation.js
/* global isMobile */

let orientationOverlay = null;

/**
 * Checks orientation and toggles overlay on mobile devices.
 */
function checkOrientation() {
    if (!orientationOverlay) {
        orientationOverlay = document.getElementById('orientation-overlay');
    }
    if (!isMobile()) {
        orientationOverlay.classList.add('hidden');
        return;
    }
    if (window.matchMedia("(orientation: portrait)").matches) {
        orientationOverlay.classList.remove('hidden');
    } else {
        orientationOverlay.classList.add('hidden');
    }
}

window.addEventListener('orientationchange', function () {
    checkOrientation();
});

window.addEventListener('resize', function () {
    checkOrientation();
});