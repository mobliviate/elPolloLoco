// js/ui.js
/* global audioManager */

/* -----------------------------------------------------------
   UI Init
----------------------------------------------------------- */

/**
 * Initialisiert UI-Buttons und Overlays.
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
 * Bindet Click-Handler an ein Element per ID.
 * @param {string} id
 * @param {Function} handler
 */
function bindClick(id, handler) {
    let el = document.getElementById(id);
    if (el) { el.addEventListener('click', handler); }
}

/* -----------------------------------------------------------
   Impressum & Endscreen & Mute
----------------------------------------------------------- */

/**
 * Öffnet/Schließt Impressum.
 * @param {boolean} show
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
 * Aktualisiert Label des Mute-Buttons.
 * @param {boolean} muted
 */
function setMuteButtonState(muted) {
    let btn = document.getElementById('btn-mute-toggle');
    btn.textContent = 'Mute: ' + (muted ? 'ON' : 'OFF');
}

/**
 * Zeigt Endscreen (“win”/“lose”) und pausiert Audio.
 * @param {string} type
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

/* -----------------------------------------------------------
   Mobile Controls Sichtbarkeit (wird auch extern genutzt)
----------------------------------------------------------- */

/**
 * Zeigt/verbirgt die Mobile-Controls-Leiste.
 * @param {boolean} show
 */
function toggleMobileControls(show) {
    let mc = document.getElementById('mobile-controls');
    if (!mc) { return; }
    if (show) { mc.classList.remove('hidden'); }
    else { mc.classList.add('hidden'); }
}

/* -----------------------------------------------------------
   Fullscreen – stabil & Cross-Browser
----------------------------------------------------------- */

/**
 * Liefert true, wenn ein Element im Fullscreen ist.
 * @returns {boolean}
 */
function isFullscreenActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

/**
 * Versucht Fullscreen anzufordern (Cross-Browser).
 * @param {HTMLElement} el
 */
function requestFullscreenSafe(el) {
    if (!el) { return; }
    if (el.requestFullscreen) { el.requestFullscreen(); return; }
    if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); return; }
    if (el.msRequestFullscreen) { el.msRequestFullscreen(); }
}

/**
 * Verlässt Fullscreen sicher (Cross-Browser).
 */
function exitFullscreenSafe() {
    if (document.exitFullscreen) { document.exitFullscreen(); return; }
    if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); return; }
    if (document.msExitFullscreen) { document.msExitFullscreen(); }
}

/**
 * Öffentliche API: Fullscreen betreten.
 * @param {HTMLElement} element
 */
function enterFullscreen(element) {
    requestFullscreenSafe(element);
}

/**
 * Öffentliche API: Fullscreen verlassen.
 */
function exitFullscreen() {
    exitFullscreenSafe();
}

/**
 * Reagiert auf Fullscreen-Zustandswechsel (UI sync).
 */
function onFullscreenChange() {
    let fsBtn = document.getElementById('fullscreen-button');
    let exBtn = document.getElementById('exit-fullscreen-button');
    let active = isFullscreenActive();
    if (fsBtn) { fsBtn.style.display = active ? 'none' : 'block'; }
    if (exBtn) { exBtn.style.display = active ? 'block' : 'none'; }
}

/**
 * Registriert Fullscreen-Eventlistener.
 */
function initFullscreenObservers() {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    onFullscreenChange();
}