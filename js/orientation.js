// js/orientation.js
// js/orientation.js

let orientationOverlay = null;

/**
 * Prüft die Orientierung und zeigt das Overlay nur in "mobiler Ansicht".
 * "Mobil" = Pointer "coarse" UND Viewport ≤ 900px.
 */
function checkOrientation() {
    if (!orientationOverlay) {
        orientationOverlay = document.getElementById('orientation-overlay');
    }

    if (!isMobileView()) {
        orientationOverlay.classList.add('hidden');
        if (typeof updateMobileControlsVisibility === 'function') { updateMobileControlsVisibility(); }
        return;
    }

    if (window.matchMedia('(orientation: portrait)').matches) {
        orientationOverlay.classList.remove('hidden');
    } else {
        orientationOverlay.classList.add('hidden');
    }

    if (typeof updateMobileControlsVisibility === 'function') { updateMobileControlsVisibility(); }
}

/**
 * Ermittelt "mobile Ansicht" (für Overlay & Controls konsistent).
 * @returns {boolean}
 */
function isMobileView() {
    let coarse = window.matchMedia('(pointer: coarse)').matches;
    let small = window.matchMedia('(max-width: 900px)').matches || window.innerWidth <= 900;
    return coarse && small;
}

window.addEventListener('orientationchange', function () {
    checkOrientation();
});

window.addEventListener('resize', function () {
    checkOrientation();
});