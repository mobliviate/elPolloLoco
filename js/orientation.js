let orientationOverlay = null;

/**
 * Checks device orientation and shows the overlay only in "mobile view".
 * Mobile view is defined as pointer "coarse" AND viewport ≤ 900px.
 * @returns {void}
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
 * Determines a consistent "mobile view" used by both overlay and controls.
 * @returns {boolean} True when the device qualifies as mobile view.
 */
function isMobileView() {
    let coarse = window.matchMedia('(pointer: coarse)').matches;
    let small = window.matchMedia('(max-width: 900px)').matches || window.innerWidth <= 900;
    return coarse && small;
}

/**
 * Orientation change event handler that re-checks orientation.
 * @returns {void}
 */
window.addEventListener('orientationchange', function () {
    checkOrientation();
});

/**
 * Resize event handler that re-checks orientation.
 * @returns {void}
 */
window.addEventListener('resize', function () {
    checkOrientation();
});