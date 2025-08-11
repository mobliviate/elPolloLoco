// js/game.js
/* global World, Keyboard, audioManager, setMuteButtonState, createLevel1, updateMobileControlsVisibility */

let canvas;
let world = null;
let keyboard = new Keyboard();
let currentLevel = null;

/* WICHTIG: window.world initialisieren, damit andere Dateien (mobile-controls.js)
   den Zustand sicher über window.world prüfen können. */
window.world = null;

/**
 * Bootstrapped beim Laden der Seite.
 */
function boot() {
    canvas = document.getElementById('canvas');
    initUI();
    initKeyboardListeners();
    initMuteButtonFromStorage();
    checkOrientation();
}

/**
 * Startet das Spiel (einmalig).
 */
function startGame() {
    if (world !== null) { return; }
    currentLevel = createLevel1();
    world = new World(canvas, keyboard, currentLevel);
    window.world = world;                 // <-- an window anhängen
    audioManager.playLoop('bgm');
    hideStartScreen();
    updateMobileControlsVisibility();
}

/**
 * Startet das Spiel neu.
 */
function restartGame() {
    if (world) { world.gameOver = true; }
    document.getElementById('endscreen').classList.add('hidden');
    world = null;
    window.world = null;                  // <-- sauber zurücksetzen
    currentLevel = null;
    startGame();
    updateMobileControlsVisibility();
}

/**
 * Zurück zur Startseite.
 */
function goHome() {
    window.location.reload();
}

/**
 * Initialisiert Keyboard-Events.
 */
function initKeyboardListeners() {
    window.addEventListener('keydown', function (event) {
        switch (event.code) {
            case 'ArrowLeft': keyboard.LEFT = true; break;
            case 'ArrowRight': keyboard.RIGHT = true; break;
            case 'ArrowUp': keyboard.UP = true; break;
            case 'ArrowDown': keyboard.DOWN = true; break;
            case 'Space': keyboard.SPACE = true; break;
            case 'KeyD': keyboard.D = true; break;
            case 'KeyP': togglePause(); break;
            case 'F2': toggleDebug(); break;
        }
        updateLastInputTime();
    });

    window.addEventListener('keyup', function (event) {
        switch (event.code) {
            case 'ArrowLeft': keyboard.LEFT = false; break;
            case 'ArrowRight': keyboard.RIGHT = false; break;
            case 'ArrowUp': keyboard.UP = false; break;
            case 'ArrowDown': keyboard.DOWN = false; break;
            case 'Space': keyboard.SPACE = false; break;
            case 'KeyD': keyboard.D = false; break;
        }
    });
}

/**
 * Pausiert/entpausiert das Spiel und synchronisiert UI.
 */
function togglePause() {
    if (!world) { return; }
    world.togglePause();
    audioManager.pauseAll(world.paused);
    updateMobileControlsVisibility();     // <-- Controls bei Pause ausblenden
}

/**
 * Markiert die letzte Eingabezeit (für Idle/Sleep).
 */
function updateLastInputTime() {
    if (!world || !world.character || !world.character[0]) { return; }
    world.character[0].markActive();
}

/**
 * Debug-Modus an/aus.
 */
function toggleDebug() {
    window.DEBUG_MODE = !window.DEBUG_MODE;
}

/**
 * Stellt den Mute-Button-Status aus Storage her.
 */
function initMuteButtonFromStorage() {
    setMuteButtonState(audioManager.isMuted());
}

/**
 * Versteckt den Startscreen.
 */
function hideStartScreen() {
    let ss = document.getElementById('start-screen');
    ss.classList.add('hidden');
}