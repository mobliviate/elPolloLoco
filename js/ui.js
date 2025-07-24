// js/ui.js
/* global startGame, goHome, restartGame, audioManager, setMuteButtonState, toggleMobileControls */

let DEBUG_MODE = false;

/**
 * Initializes UI buttons and overlays.
 */
function initUI() {
    document.getElementById('btn-start').addEventListener('click', function () {
        startGame();
    });

    document.getElementById('btn-impressum-open').addEventListener('click', function () {
        showImpressum(true);
    });

    document.getElementById('btn-impressum-close').addEventListener('click', function () {
        showImpressum(false);
    });

    document.getElementById('btn-mute-toggle').addEventListener('click', function () {
        audioManager.toggleMute();
        setMuteButtonState(audioManager.isMuted());
    });

    document.getElementById('btn-restart').addEventListener('click', function () {
        restartGame();
    });

    document.getElementById('btn-home').addEventListener('click', function () {
        goHome();
    });
}

/**
 * Shows or hides the imprint overlay.
 * @param {boolean} show
 */
function showImpressum(show) {
    var imp = document.getElementById('impressum');
    if (show) {
        imp.classList.remove('hidden');
    } else {
        imp.classList.add('hidden');
    }
}

/**
 * Updates the mute button label.
 * @param {boolean} muted
 */
function setMuteButtonState(muted) {
    var btn = document.getElementById('btn-mute-toggle');
    btn.textContent = 'Mute: ' + (muted ? 'ON' : 'OFF');
}

/**
 * Displays the endscreen (“win” or “lose”) and stops music/SFX.
 * @param {string} type
 */
function showEndscreen(type) {
    var end = document.getElementById('endscreen');
    var cont = document.getElementById('endscreen-content');
    var imgPath = type === 'win'
        ? 'img/You won, you lost/You Won B.png'
        : 'img/You won, you lost/You lost b.png';

    cont.style.backgroundImage = 'url("' + imgPath + '")';
    audioManager.pauseAll(true);            // stop all audio when endscreen appears
    end.classList.remove('hidden');
}

/**
 * Toggles visibility of mobile controls.
 * @param {boolean} show
 */
function toggleMobileControls(show) {
    var mc = document.getElementById('mobile-controls');
    if (show) {
        mc.classList.remove('hidden');
    } else {
        mc.classList.add('hidden');
    }
}